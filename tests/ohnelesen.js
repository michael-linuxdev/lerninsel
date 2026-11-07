// Playwright-Test Paket 2 „Ohne Lesen bedienbar“ (07.11.2026), echt durchgeklickt:
// - Startseite Vorschule und Kl. 1: höchstens vier Türen, großer „Los!“-Knopf (🔊 liest vor) startet genau die nächste Aufgabe
//   (Vorschule → erstes Rucksack-Spiel, Kl. 1 → Laute-Runde), Rucksack-Tür mit 🎒 statt Robo/Schloss; Handy 390 × 760 ohne Querscrollen
// - Eltern-Schalter „Startseite: alles zeigen“ (≥ 40 px) zeigt die alte Startseite, wieder aus → kurz; Sprungmarken in langen Reitern, Geburtsdatum-Tipp klein
// - Insel gesperrt: Robo sagt einen kurzen Satz, 🔊 liest ihn vor, „Zum Führerschein“ pulsiert
// - Matheweg Kl. 1: Hand „Hier weiter“ an genau einer Station, andere offene heller, „Muster fortsetzen“ ohne 🔁; 🔊 liest Aufgabe und nach einem
//   echten Fehler auch die Rückmeldung vor
// - Lesen Vorschule: nur passende Wege, Rest hinter „➕ Mehr“; Rucksack-Untertitel ohne Fachwörter („Bildung“ nur als title)
// - Deutsch Kl. 1: „Für dich“ mit höchstens 5 Kacheln, „📚 Alle Kapitel“ öffnet die Werkstatt; Kopfleiste mit Beschriftung; ⚙️ nur mit PIN
// - Zurück-Regel auf allen Seiten: 🏠 führt immer zur Startseite (aria-label „Zur Startseite“), ⬅️ nie zur Startseite, jeder Knopf mit Namen
// - Insel-Ankunft (3D): während einer Szene keine Leiste/Hinweise, Sticker-Toast wartet, danach nacheinander, Steuerungs-Hinweis zuletzt
// Aufruf: sh tests/laufen.sh ohnelesen   (Screenshots mit BILDER=<ordner>; 3D-Teil mit swiftshader, OHNE3D=1 lässt ihn weg)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource|open-meteo/;
process.on("unhandledRejection", (e) => { console.log("❌ Abbruch: " + e.message + "\n  " + (global.__fehler || []).join("\n  ")); process.exit(1); });

(async () => {
  const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
  const fehler = global.__fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };
  async function kind(stufe, breite = 1180, hoehe = 820) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true, serviceWorkers: "block" });
    await ctx.addInitScript(() => {
      window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__testSchnell = true; window.__keinSparen = true;
      // Gerätestimme nachbilden (wie tests/altersgerecht.js): zeichnet auf, was gesprochen würde – die echte Knopfdruck-Regel läuft
      window.__gesagt = [];
      const fake = { speaking: false, pending: false, paused: false, speak(u) { window.__gesagt.push(u.text); setTimeout(() => u.onend && u.onend(), 20); }, cancel() {}, resume() {}, getVoices() { return []; }, addEventListener() {} };
      Object.defineProperty(window, "speechSynthesis", { value: fake, configurable: true });
    });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", stufe); await p.click("#e-ok"); await p.click("#uebergabe-los");
    await p.waitForURL(u => !/eltern/.test(u.toString())); await p.waitForTimeout(400);
    // die Eltern-Sitzung beenden: das Kind spielt jetzt allein (wichtig für ⚙️ mit PIN)
    await p.evaluate(() => sessionStorage.removeItem(Spielwelt.vorsilbe + "eltern"));
    return { ctx, p };
  }
  const gesagt = (p) => p.evaluate(() => window.__gesagt.filter(t => String(t).trim()));
  const leeren = (p) => p.evaluate(() => { window.__gesagt.length = 0; });
  const startseite = (p) => p.evaluate(() => {
    const da = (t) => !t.hidden && getComputedStyle(t).display !== "none" && t.getBoundingClientRect().height > 0;
    const tueren = [...document.querySelectorAll(".schrank .tuer")].filter(da), los = document.getElementById("los"), r = los.getBoundingClientRect();
    return { tueren: tueren.map(t => t.classList[1]), kurz: document.body.classList.contains("kurz-start"), los: da(document.getElementById("los-zeile")), losText: los.textContent, losTop: r.top, losH: r.height,
      puls: getComputedStyle(los).animationName, quer: document.documentElement.scrollWidth <= innerWidth + 1, hoch: document.documentElement.scrollHeight <= innerHeight + 1,
      unten: Math.max(...tueren.map(t => t.getBoundingClientRect().bottom)), ih: innerHeight,
      rucksack: (() => { const t = document.getElementById("vorschule-link"); return { emoji: /🎒/.test(t.textContent), robo: !!t.querySelector('[data-wer="robo"]'), schloss: !!t.querySelector("svg.bild rect") }; })() };
  });

  // ---------- Vorschule: kurze Startseite, Los!, Rucksack, Lesen ----------
  for (const [breite, hoehe, art] of [[1180, 820, "iPad quer"], [820, 1180, "iPad hoch"], [390, 760, "Handy"]]) {
    const { ctx, p } = await kind("vs", breite, hoehe);
    const s = await startseite(p);
    erwarte(s.kurz && s.tueren.length <= 4 && s.tueren.includes("insel") && s.tueren.includes("vorschule"), `Vorschule ${art}: ${s.tueren.length} Türen (${s.tueren.join(", ")})`);
    erwarte(s.los && /Los!/.test(s.losText) && /Vorschul-Rucksack/.test(s.losText) && s.puls === "los-puls" && s.losH >= 60, `Vorschule ${art}: großer „Los!“-Knopf pulsiert (${s.losText.replace(/\s+/g, " ").trim()})`);
    erwarte(s.rucksack.emoji && !s.rucksack.robo && !s.rucksack.schloss, `Vorschule ${art}: Rucksack-Tür mit 🎒, ohne Robo und ohne Schloss-Bild`);
    erwarte(s.quer && s.losTop < s.ih, `Vorschule ${art}: kein Querscrollen, „Los!“ auf dem ersten Bildschirm (${Math.round(s.losTop)} px)`);
    if (art !== "Handy") erwarte(s.hoch && s.unten <= s.ih + 1, `Vorschule ${art}: alles ohne Scrollen (Türen bis ${Math.round(s.unten)} px von ${s.ih})`);
    await bild(p, `ohnelesen-vs-start-${art.replace(" ", "-")}`);
    if (art === "iPad quer") {
      await leeren(p); await p.click("#los-hoer"); await p.waitForTimeout(200);
      const g = await gesagt(p);
      erwarte(g.length === 1 && /Los!/.test(g[0]) && /Vorschul-Rucksack/.test(g[0]), `🔊 neben „Los!“ liest vor („${g[0] || ""}“)`);
      await p.click("#los", { force: true }); await p.waitForURL(/vorschule/); await p.waitForTimeout(500);
      erwarte(await p.evaluate(() => !document.getElementById("aufgabe-ansicht").hidden && __vorschule.lauf && __vorschule.lauf.a.id === __vorschule.alle()[0] && !/los/.test(location.search)),
        "„Los!“ startet sofort das erste Rucksack-Spiel");
      // eine Aufgabe echt antippen (richtige Antwort = erste Option der Daten)
      const opt = await p.evaluate(() => { const st = __vorschule.lauf.schritte[0]; return st.optionen ? [...document.querySelectorAll("#aufgabe .option")].findIndex(b => b.textContent === st.optionen[0]) : -1; });
      if (opt >= 0) { await p.click(`#aufgabe .option >> nth=${opt}`); await p.waitForTimeout(1200); erwarte(await p.evaluate(() => __vorschule.lauf.pos >= 1), "erste Rucksack-Aufgabe echt gelöst"); }
      await p.click("#zur-liste"); await p.waitForTimeout(300);
      const u = await p.evaluate(() => ({ text: [...document.querySelectorAll(".bereich .klein")].map(x => x.textContent).join(" | "), title: document.querySelector(".bereich").getAttribute("title") || "" }));
      erwarte(!/Bildung|Somatisch|Kommunikativ/.test(u.text) && /Bildung/.test(u.title), `Rucksack: Untertitel kindgerecht („${u.text.slice(0, 60)}…“), Bildungsbereich nur als title`);
      await bild(p, "ohnelesen-vs-rucksack");
      // Lesen für die Vorschule: nur passende Wege, Rest hinter „Mehr“
      await p.goto(BASIS); await p.waitForTimeout(300);
      await p.click("#laute-link"); await p.waitForURL(/lesen/); await p.waitForTimeout(400);
      const sichtbar = () => p.evaluate(() => [...document.querySelectorAll(".wege .weg")].filter(w => getComputedStyle(w).display !== "none").map(w => w.id));
      const v1 = await sichtbar();
      erwarte(!v1.includes("weg-sas") && !v1.includes("weg-texte") && !v1.includes("weg-vorlesen") && v1.includes("weg-gleich") && v1.includes("weg-mehr") && v1.length <= 8, `Lesen Vorschule: ${v1.length} Wege, ohne Schreibschrift/Lesetexte (${v1.join(", ")})`);
      erwarte(await p.evaluate(() => document.getElementById("lesen-zurueck").getAttribute("href") === "../../"), "Lesen Vorschule: ⬅️ führt eine Ebene zurück – zur Startseite, woher das Kind kam");
      await bild(p, "ohnelesen-vs-lesen");
      // Eigene Idee: „Was gibt es hier?“ liest die Wege nacheinander vor, die genannte Kachel leuchtet; Fipsi antippen liest die Blase
      await leeren(p); await p.click("#was-hier"); await p.waitForTimeout(30);
      const an = await p.evaluate(() => ({ a: __vorleser.aktuell, n: document.querySelectorAll(".vorleser-an").length }));
      await p.waitForFunction(() => !__vorleser.laeuft, null, { timeout: 5000 }).catch(() => {});
      const gl = await gesagt(p);
      erwarte(an.n === 1 && gl.length === v1.length - 0 && gl[0] === "Buchstaben-Tafel" && gl.includes("Gleicher Anfang") && !gl.some(t => /Schreibschrift/.test(t)),
        `„🔊 Was gibt es hier?“ liest ${gl.length} sichtbare Wege nacheinander vor (${gl.slice(0, 3).join(", ")} …), die Kachel leuchtet`);
      await leeren(p); await p.click("#fipsi-start"); await p.waitForTimeout(150);
      const gf = await gesagt(p), blase = await p.textContent("#start-blase");
      erwarte(gf.length === 1 && gf[0] === blase, "Fipsi antippen: liest die Sprechblase vor");
      await p.click("#weg-mehr"); await p.waitForTimeout(200);
      const v2 = await sichtbar();
      erwarte(v2.includes("weg-texte") && v2.includes("weg-legen") && !v2.includes("weg-mehr"), `„➕ Mehr“ zeigt den Rest (${v2.length} Wege)`);
    }
    await ctx.close();
  }

  // ---------- Klasse 1: Startseite, Insel gesperrt, Los!, Matheweg, Deutsch, Eltern ----------
  {
    const { ctx, p } = await kind("1");
    let s = await startseite(p);
    erwarte(s.kurz && s.tueren.length === 4 && ["insel", "mathe", "deutsch", "vorschule"].every(t => s.tueren.includes(t)), `Kl. 1: vier Türen (${s.tueren.join(", ")})`);
    erwarte(s.hoch && s.los && /Laute und Silben/.test(s.losText), `Kl. 1: „Los!“ mit der nächsten Tagesaufgabe (${s.losText.replace(/\s+/g, " ").trim()}), ohne Scrollen`);
    await bild(p, "ohnelesen-k1-start");
    // Insel gesperrt: kurzer Robo
    await p.click("#tuer-insel"); await p.waitForSelector("#robo-dialog:not([hidden])");
    const r = await p.evaluate(() => ({ text: document.getElementById("robo-text").textContent, puls: getComputedStyle(document.getElementById("robo-los")).animationName }));
    erwarte(r.text.length <= 60 && r.text.split(/[.!?]/).filter(x => x.trim()).length <= 2 && r.puls === "los-puls", `Insel gesperrt: Robo sagt kurz „${r.text}“, „Zum Führerschein“ pulsiert`);
    await leeren(p); await p.click("#robo-hoer"); await p.waitForTimeout(200);
    erwarte((await gesagt(p)).some(t => t.includes(r.text)), "Robo: 🔊 liest den Satz vor");
    await bild(p, "ohnelesen-k1-robo");
    await p.click("#robo-zu");
    // Los! → Laute-Runde
    await p.click("#los", { force: true }); await p.waitForURL(/lesen/); await p.waitForTimeout(600);
    erwarte(await p.evaluate(() => __lesen.ansicht() === "uebung" && __lesen.anzahl() > 0), "Kl. 1: „Los!“ startet sofort eine Laute-Runde");
    // eine Laute-Aufgabe echt antippen
    const ri = await p.evaluate(() => __lesen.richtigIndex());
    await p.waitForSelector(`#wahl [data-i="${ri}"]`, { timeout: 5000 }).catch(() => {});
    await p.click(`#wahl [data-i="${ri}"]`); await p.waitForTimeout(200);
    erwarte(await p.evaluate((i) => { const k = document.querySelector(`#wahl [data-i="${i}"]`); return (k && k.classList.contains("richtig")) || __lesen.aufgabeNr() >= 1; }, ri), "Laute-Aufgabe echt gelöst");

    // Matheweg Kl. 1: Hier weiter, 🔊
    await p.goto(BASIS + "spiele/mathe/"); await p.waitForTimeout(700);
    const w = await p.evaluate(() => ({ jetzt: document.querySelectorAll(".station.jetzt").length, hand: document.querySelectorAll(".station.jetzt .hier").length, dezent: document.querySelectorAll(".station.dezent").length,
      muster: [...document.querySelectorAll(".station")].filter(s => /Muster fortsetzen/.test(s.textContent)).map(s => s.querySelector(".kreis").textContent).join(), label: (document.querySelector(".station.jetzt") || {}).getAttribute?.("aria-label") || "" }));
    erwarte(w.jetzt === 1 && w.hand === 1 && w.dezent >= 1 && /hier geht es weiter/.test(w.label), `Matheweg Kl. 1: Hand an genau einer Station, ${w.dezent} andere offene heller`);
    erwarte(w.muster && !/🔁/.test(w.muster), `„Muster fortsetzen“ mit eigenem Symbol (${w.muster})`);
    await bild(p, "ohnelesen-k1-matheweg");
    await leeren(p); await p.click("#benno"); await p.waitForTimeout(150);
    erwarte((await gesagt(p)).join() === await p.textContent("#benno-text"), "Matheweg: Benno antippen liest seine Sprechblase vor („Tipp auf mich!“)");
    await p.click(".station.jetzt"); await p.waitForTimeout(500);
    if (await p.isVisible("#erklaer-nein").catch(() => false)) { await p.click("#erklaer-nein"); await p.waitForTimeout(300); }
    await p.waitForFunction(() => __mathe.lauf && document.querySelector("#eingabe .taste"), null, { timeout: 8000 }).catch(() => {});
    if (!(await p.evaluate(() => !!__mathe.lauf))) { await p.evaluate(() => __mathe.starte(0)); await p.waitForTimeout(300); }
    await leeren(p); await p.click("#tafel-hoer"); await p.waitForTimeout(200);
    const g1 = await gesagt(p), tt = await p.evaluate(() => __mathe.tafelText());
    erwarte(g1.length === 1 && g1[0].length > 3 && !/[🔊⭐]/u.test(g1[0]), `Matheweg: 🔊 liest die Aufgabe vor („${g1[0] || ""}“)`);
    // echter Fehler über die Tasten
    const a = await p.evaluate(() => { const x = __mathe.lauf.liste[__mathe.lauf.pos]; return { art: x.art, antwort: String(x.antwort), optionen: (x.optionen || []).map(String) }; });
    if (a.art === "wahl") { const falsch = a.optionen.find(o => o !== a.antwort); await p.click(`#eingabe .taste[data-wert="${falsch}"]`); }
    else { const falsch = String((+a.antwort + 1) % 10 || 2); for (const z of falsch) await p.click(`#eingabe .taste[data-ziffer="${z}"]`); await p.click('#eingabe .taste[data-tun="ok"]'); }
    await p.waitForTimeout(500);
    await leeren(p); await p.click("#tafel-hoer"); await p.waitForTimeout(200);
    const g2 = await gesagt(p);
    erwarte(g2.length === 1 && /Fast|Schau|nochmal/i.test(g2[0]), `Matheweg: nach einem Fehler liest 🔊 auch die Rückmeldung vor („${(g2[0] || "").slice(-70)}“)`);
    erwarte(await p.evaluate(() => { const t = document.getElementById("tafel"); return t.scrollHeight <= t.clientHeight + 2; }), "Tafel passt weiter ohne Scrollen");
    await bild(p, "ohnelesen-k1-tafel");

    // Deutsch Kl. 1: Für dich, Alle Kapitel, Kopfleiste, ⚙️ mit PIN
    await p.goto(BASIS + "spiele/deutsch/"); await p.waitForTimeout(600);
    const d = await p.evaluate(() => ({ fuer: document.querySelectorAll("#werk-fuer-dich .ort").length, lesen: !!document.querySelector("#werk-fuer-dich #zu-lesen"), werk: document.getElementById("werkstatt").hidden,
      hoehe: document.documentElement.scrollHeight, labels: [...document.querySelectorAll("#karte-ansicht .oben .mit-text small")].filter(x => x.offsetParent).map(x => x.textContent) }));
    erwarte(d.fuer >= 3 && d.fuer <= 5 && d.lesen && d.werk && d.hoehe < 1400, `Deutsch Kl. 1: „Für dich“ mit ${d.fuer} Kacheln (Lesen dabei), Werkstatt zu, Seite ${d.hoehe} px statt 2300`);
    await leeren(p); await p.click("#fuer-dich-hoer"); await p.waitForFunction(() => !__vorleser.laeuft, null, { timeout: 5000 }).catch(() => {});
    erwarte((await gesagt(p)).length === d.fuer + 0 && (await gesagt(p))[0] === "Lesen und Schreiben", `Deutsch „Für dich“: 🔊 liest alle ${d.fuer} Kacheln nacheinander vor`);
    erwarte(d.labels.join() === "Zeigen,Vorlesen,Heft,Eltern", `Deutsch: Kopfleisten-Symbole beschriftet (${d.labels.join(", ")})`);
    await bild(p, "ohnelesen-k1-deutsch");
    await p.click("#werk-alle"); await p.waitForTimeout(400);
    erwarte(await p.evaluate(() => !document.getElementById("werkstatt").hidden && document.querySelectorAll("#werkstatt .werk-gruppe").length >= 4 && document.getElementById("werk-fuer-dich").hidden), "„📚 Alle Kapitel“ öffnet die ganze Werkstatt");
    await p.click("#einst-auf"); await p.waitForTimeout(200);
    erwarte(await p.evaluate(() => !document.getElementById("einst-pin").hidden && document.getElementById("einst-inhalt").hidden), "⚙️ fragt zuerst nach der Eltern-PIN");
    await p.fill("#einst-pin-feld", "9999"); await p.click("#einst-pin-ok"); await p.waitForTimeout(150);
    erwarte(await p.evaluate(() => /stimmt nicht/.test(document.getElementById("einst-pin-fehler").textContent) && document.getElementById("einst-inhalt").hidden), "falsche PIN: Einstellungen bleiben zu");
    await p.fill("#einst-pin-feld", "1234"); await p.click("#einst-pin-ok"); await p.waitForTimeout(200);
    erwarte(await p.evaluate(() => !document.getElementById("einst-inhalt").hidden && !document.getElementById("sch-vorlesen").hidden), "richtige PIN: Vorlesen/Hilfe-Schalter erreichbar (Funktion bleibt)");
    await p.click("#einst-zu");

    // Eltern: Schalter „Alles zeigen“, Sprungmarken, Geburtsdatum-Tipp klein
    await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(500);
    if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.waitForTimeout(500); }
    const ue = await p.evaluate(() => { const g = document.getElementById("geburt-fehlt"), t = document.querySelector('.eltern-teil[data-teil="ueberblick"]');
      return { klein: !!g && g.tagName === "P" && t.firstElementChild !== g && !(g.closest(".karte") === t.firstElementChild && false), erst: t.firstElementChild && t.firstElementChild.id, erkl: !!document.getElementById("gesamtstufe-erklaert") }; });
    erwarte(ue.klein && ue.erkl, "Elternbereich: Geburtsdatum-Tipp klein in der Übersicht, Gesamtstufe in einem Satz erklärt");
    await p.click('.eltern-reiter [data-teil="kinder"]'); await p.waitForTimeout(300);
    const sw = await p.evaluate(() => { const r = document.getElementById("start-alles").getBoundingClientRect(); const sp = document.querySelector('.eltern-teil[data-teil="kinder"] .sprung');
      const kl = ["vl-auto", "alte-zeichnung", "eigene-bilder"].map(id => document.getElementById(id).getBoundingClientRect()).every(x => x.width >= 40 && x.height >= 40);
      return { w: r.width, h: r.height, kl, sprung: sp ? sp.querySelectorAll("button").length : 0 }; });
    erwarte(sw.w >= 40 && sw.h >= 40 && sw.kl, `Elternbereich: Schalter mit ≥ 40 px Tippfläche (${Math.round(sw.w)} × ${Math.round(sw.h)})`);
    erwarte(sw.sprung >= 4, `Elternbereich „Kinder & Gerät“: ${sw.sprung} Sprungmarken oben`);
    if (sw.sprung) { await p.click('.eltern-teil[data-teil="kinder"] .sprung button >> nth=-1'); await p.waitForTimeout(900); erwarte(await p.evaluate(() => scrollY > 50), `Sprungmarke scrollt zur Karte`); }
    await bild(p, "ohnelesen-eltern-kinder");
    await p.click("#start-alles"); await p.waitForTimeout(200);
    erwarte(await p.evaluate(() => (Spielwelt.lade("eltern").start || {}).alles === true), "„Startseite: alles zeigen“ gespeichert");
    await p.goto(BASIS); await p.waitForTimeout(500);
    s = await startseite(p);
    erwarte(!s.kurz && !s.los && s.tueren.length >= 7 && s.tueren.includes("sach") && s.tueren.includes("gef"), `mit „Alles zeigen“: alte Startseite (${s.tueren.length} Türen), kein „Los!“`);
    erwarte(await p.evaluate(() => !document.getElementById("heute-fuer-dich").hidden && getComputedStyle(document.getElementById("heute-fuer-dich")).display !== "none"), "alte Startseite: „Heute für dich“ wie bisher");
    await bild(p, "ohnelesen-k1-alles");
    await p.goto(BASIS + "spiele/eltern/#kinder"); await p.waitForTimeout(500);
    if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.waitForTimeout(500); }
    await p.click('.eltern-reiter [data-teil="kinder"]'); await p.waitForTimeout(200);
    await p.click("#start-alles"); await p.waitForTimeout(200);
    await p.goto(BASIS); await p.waitForTimeout(400);
    erwarte((await startseite(p)).kurz, "Schalter wieder aus: kurze Startseite");
    await ctx.close();
  }

  // ---------- Klasse 1 Handy, Klasse 2 unverändert ----------
  {
    const { ctx, p } = await kind("1", 390, 760);
    const s = await startseite(p);
    erwarte(s.kurz && s.quer && s.losTop + s.losH <= 760 && s.tueren.length === 4, `Kl. 1 Handy: kein Querscrollen, „Los!“ ganz im ersten Bild (${Math.round(s.losTop)} px)`);
    await bild(p, "ohnelesen-k1-handy");
    await p.goto(BASIS + "spiele/deutsch/"); await p.waitForTimeout(500);
    erwarte(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1 && document.querySelectorAll("#werk-fuer-dich .ort").length <= 5), "Deutsch Kl. 1 Handy: passt in die Breite");
    await bild(p, "ohnelesen-k1-handy-deutsch");
    await ctx.close();
  }
  {
    const { ctx, p } = await kind("2");
    const s = await startseite(p);
    erwarte(!s.kurz && !s.los && s.tueren.length >= 6, `Kl. 2: Startseite wie bisher (${s.tueren.length} Türen, kein „Los!“)`);
    // Zurück-Regel auf allen Seiten (HTML geholt und geprüft)
    const SEITEN = ["spiele/mathe/", "spiele/deutsch/", "spiele/lesen/", "spiele/vorschule/", "spiele/medien/", "spiele/sachkunde/", "spiele/englisch/", "spiele/ich/", "spiele/album/",
      "spiele/heft/", "spiele/schatz/", "spiele/vorlesen/", "spiele/praesentieren/", "spiele/daz/", "spiele/tier/", "spiele/anziehen/", "spiele/atelier/", "spiele/schach/", "spiele/gefuehle/",
      "spiele/robo/", "spiele/sorbisch/", "spiele/garten/", "spiele/baeckerei/", "spiele/tierstation/", "spiele/angeln/", "spiele/rhythmus/", "spiele/wetter/", "spiele/leuchtturm/", "spiele/bruecke/",
      "spiele/expedition/", "spiele/welt3d/heimat.html"];
    const verstoss = await p.evaluate(async (seiten) => {
      const aus = [];
      for (const s of seiten) {
        const html = await (await fetch(s)).text(), doc = new DOMParser().parseFromString(html, "text/html"), basis = new URL(s, location.href);
        doc.querySelectorAll("a, button").forEach(el => {
          const t = el.textContent.replace(/\s+/g, "").trim(), href = el.getAttribute("href"), ziel = href ? new URL(href, basis).pathname : "";
          const start = ziel && new URL("./", location.href).pathname === ziel;
          if (t === "🏠" && (!start || el.getAttribute("aria-label") !== "Zur Startseite")) aus.push(`${s}: 🏠 → ${href} (${el.getAttribute("aria-label")})`);
          if (t === "⬅️" && start && !/lesen-zurueck/.test(el.id)) aus.push(`${s}: ⬅️ führt zur Startseite`);
          if ((t === "⬅️" || t === "🏠") && !el.getAttribute("aria-label")) aus.push(`${s}: ${t} ohne aria-label`);
        });
      }
      return aus;
    }, SEITEN);
    erwarte(!verstoss.length, `Zurück-Regel auf ${SEITEN.length} Seiten: 🏠 = Startseite, ⬅️ = eine Ebene zurück${verstoss.length ? " – " + verstoss.join("; ") : ""}`);
    await ctx.close();
  }

  // ---------- Insel-Ankunft (3D): Meldungen nacheinander ----------
  if (!process.env.OHNE3D) {
    const { ctx, p } = await kind("2");
    await p.evaluate(() => { const m = Spielwelt.lade("medien") || {}; m.lektionen = { bedienung: 3 }; Spielwelt.speichere("medien", m); Story.etappeFertig("E1");
      ["E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9"].forEach(e => Story.etappeFertig(e, true)); Story.merkeSzene("sonne"); Story.setzeKapitel(1);
      try { localStorage.removeItem("lerninsel.joystick"); } catch (e) { } });
    await p.goto(BASIS + "spiele/welt3d/heimat.html?stunde=14", { waitUntil: "domcontentloaded", timeout: 60000 });
    await p.waitForFunction(() => window.__heimat && __heimat.ich, null, { timeout: 60000 });
    await p.evaluate(() => { if (window.__szene && __szene.aktuell()) __szene.abbrechen(); __szene.spiele("sonne"); });
    await p.waitForTimeout(300);
    await p.evaluate(() => { const d = Spielwelt.lade("sticker") || {}; if (d.hat) delete d.hat["w-mond"]; Spielwelt.speichere("sticker", d); Sticker.entdecke("w-mond"); });
    await p.waitForTimeout(700);
    const m1 = await p.evaluate(() => ({ m: __heimat.meldungen(), joy: getComputedStyle(document.getElementById("joy-hinweis")).visibility, lern: getComputedStyle(document.getElementById("lern-hinweis")).visibility,
      toast: (() => { const b = document.getElementById("belohnung"); return !!b && b.getBoundingClientRect().bottom > 0 && /Sticker/.test(b.textContent); })() }));
    erwarte(m1.m.ruhig && m1.m.warten >= 1 && m1.joy === "hidden" && m1.lern === "hidden" && !m1.toast, `Insel: während der Szene keine Leiste, kein Steuerungs-Hinweis, Sticker-Toast wartet (${m1.m.warten})`);
    await bild(p, "ohnelesen-insel-szene");
    for (let i = 0; i < 6 && await p.evaluate(() => !!__szene.aktuell()); i++) { await p.click("#szene-weiter", { force: true }).catch(() => {}); await p.waitForTimeout(400); }
    await p.evaluate(() => { if (__szene.aktuell()) __szene.abbrechen(); });
    await p.waitForFunction(() => __heimat.meldungen().warten === 0, null, { timeout: 15000 }).catch(() => {});
    await p.waitForTimeout(400);
    const toast = await p.evaluate(() => { const b = document.getElementById("belohnung"); return !!b && /Sticker/.test(b.textContent); });
    const vorher = await p.evaluate(() => __heimat.meldungen().steuerung);
    await p.waitForFunction(() => __heimat.meldungen().steuerung, null, { timeout: 8000 }).catch(() => {});
    const m2 = await p.evaluate(() => ({ m: __heimat.meldungen(), joy: getComputedStyle(document.getElementById("joy-hinweis")).visibility }));
    erwarte(toast && !vorher && m2.m.steuerung && m2.joy === "visible", "Insel: nach der Szene erst der Sticker-Toast, danach der Steuerungs-Hinweis");
    await bild(p, "ohnelesen-insel-danach");
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Ohne-Lesen-Test bestanden.");
})();
