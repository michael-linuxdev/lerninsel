// Playwright-Test (Erprobung 10.11.2026, Rückmeldung des Testers „M“, Seiten ohne 3D):
// Tablet-Führerschein: „RU“ neben den Antworten sichtbar und vorgelesen (auch bei Hilfe „automatisch“), „Als Bild speichern“ (Teilen, Download,
// als Home-Bildschirm-App „gedrückt halten“), Abzeichen „Tablet-Profi“ führt zum Führerschein · Sachunterricht quer mit Prüfleiste: „Weiter“ im Bild,
// erwartete Antwort in der Leiste, Zuordnen zählt als ein Schritt · Matheweg hoch: Band im Bild, Abstand unter den Lernbereichen, Prüfleiste vor
// der Antwort, Erklär-Einheit einen Schritt zurück, kurze Runden ohne doppelte Antwort · Meldungen „Neuer Sticker“ → Album, „Rechen-Kraft“ → Mein Können ·
// Atelier „💾 Speichern“ · Figur ohne Strähnen vor den Wangen, Ärmel mit Naht · Szene ohne „(Entwurf, ungeprüft)“.
// Aufruf: sh tests/laufen.sh rueckmeldung   (Screenshots mit BILDER=<ordner>)
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
  async function kind({ breite = 1180, hoehe = 820, ru = true, erprobung = false, vorher = null } = {}) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true, serviceWorkers: "block", acceptDownloads: true });
    await ctx.addInitScript(() => {
      window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__gesprochen = []; window.__testSchnell = true;
      class U { constructor(t) { this.text = t; this.lang = ""; } }
      window.SpeechSynthesisUtterance = U;
      const synth = { speaking: false, pending: false, paused: false, getVoices: () => [{ name: "Milena", lang: "ru-RU", localService: true, default: true }, { name: "Anna", lang: "de-DE", localService: true, default: true }],
        speak(u) { if (u.text.trim()) window.__gesprochen.push({ t: u.text, l: u.lang }); setTimeout(() => u.onend && u.onend(), 5); }, cancel() {}, resume() {}, addEventListener() {} };
      Object.defineProperty(window, "speechSynthesis", { value: synth, configurable: true });
    });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", "2");
    if (ru) await p.selectOption("#e-sprache", "ru");   // Hilfe bleibt „automatisch“ wie beim Tester (nicht „immer“)
    await p.click("#e-ok"); await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString())); await p.waitForTimeout(200);
    if (erprobung) await p.evaluate(() => localStorage.setItem("spielwelt.erprobung", JSON.stringify({ an: true, kuerzel: "T", rollen: ["spieler", "lehrkraft", "ru"], faecher: [], klassen: [] })));
    if (vorher) await p.evaluate(vorher);
    return { ctx, p };
  }
  const log = (p) => p.evaluate(() => JSON.parse(localStorage.getItem("spielwelt.erprobung.log") || "[]"));
  // bis zum nächsten Schritt mit Antwort-Zeilen weiterklicken (Info-Karten „Weiter“, Daumen/Zuordnen irgendwie lösen)
  async function bisAuswahl(p) {
    for (let i = 0; i < 60; i++) {
      if (await p.$(".option-zeile")) return true;
      const w = await p.$("#weiter"); if (w) await w.click(); else { const o = await p.$(".option:not(:disabled)"); if (o) await o.click(); }
      await p.waitForTimeout(120);
    }
    return false;
  }

  // ---------- 1. Tablet-Führerschein: RU bei den Antworten, Bild speichern, Abzeichen ----------
  {
    const { ctx, p } = await kind({ breite: 820, hoehe: 1148 });
    await p.goto(BASIS + "spiele/medien/"); await p.waitForFunction(() => window.__medien);
    await p.evaluate(() => __medien.starte(1));
    erwarte(await bisAuswahl(p), "Medien: Schritt mit Antworten erreicht");
    const ruKnopf = await p.$(".option-zeile .mk.ru");
    const sichtbar = ruKnopf && await ruKnopf.isVisible();
    erwarte(sichtbar, "Medien: „RU“-Knopf neben jeder Antwort ist sichtbar (wurde vom Ausschleichen mit versteckt)");
    erwarte((await p.$$(".option-zeile .mk.ru:visible")).length === (await p.$$(".option-zeile")).length, "Medien: jede Antwort hat ihren „RU“-Knopf");
    await p.evaluate(() => { window.__gesprochen = []; });
    if (sichtbar) await ruKnopf.click();
    await p.waitForTimeout(350);
    const g = await p.evaluate(() => ({ g: window.__gesprochen, text: (() => { const t = document.querySelector(".option-zeile .ru-text"); return t && !t.hidden && getComputedStyle(t).display !== "none" ? t.textContent : ""; })() }));
    erwarte(g.g.length === 1 && g.g[0].l === "ru-RU" && /[а-яё]/i.test(g.g[0].t) && g.text === g.g[0].t, `Medien: „RU“ antippen zeigt die Antwort auf Russisch und liest sie russisch vor („${(g.g[0] || {}).t || ""}“)`);
    await bild(p, "rm-medien-ru");
    // die Sprechblase: RU-Knopf ebenfalls
    await p.evaluate(() => { window.__gesprochen = []; });
    await p.click("#blase .mk.ru"); await p.waitForTimeout(350);
    erwarte((await p.evaluate(() => window.__gesprochen)).some(x => x.l === "ru-RU"), "Medien: „RU“ an der Sprechblase liest russisch vor");

    // Führerschein: Abzeichen auf der Startseite führt hin; Bild speichern
    await p.evaluate(() => { const m = Spielwelt.lade("medien") || {}; m.lektionen = {}; LEKTIONEN.forEach(l => { m.lektionen[l.id] = 3; }); m.fuehrerschein = "2026-10-25"; Spielwelt.speichere("medien", m); });
    await p.goto(BASIS); await p.waitForSelector("#abzeichen:not([hidden])");
    erwarte(await p.evaluate(() => document.getElementById("abzeichen").tagName === "A"), "Startseite: Abzeichen „Tablet-Profi“ ist antippbar");
    await p.click("#abzeichen"); await p.waitForURL(/medien\/#fuehrerschein/); await p.waitForFunction(() => window.__medien);
    erwarte(await p.isVisible("#urkunde svg"), "Antippen zeigt den Tablet-Führerschein");
    await p.evaluate(() => __medien.bildFertig());
    const b0 = await p.evaluate(() => __medien.bild());
    erwarte(b0.bereit && b0.groesse > 5000, `Führerschein: Bild liegt schon bereit, bevor jemand tippt (${b0.groesse} Bytes)`);
    // a) Gerät kann teilen: navigator.share wird direkt im Antippen mit der Bilddatei aufgerufen
    await p.evaluate(() => { window.__geteilt = []; navigator.canShare = (d) => !!(d && d.files && d.files.length); navigator.share = (d) => { window.__geteilt.push({ n: d.files[0].name, t: d.files[0].type, g: d.files[0].size, aktiv: !!(navigator.userActivation && navigator.userActivation.isActive) }); return Promise.resolve(); }; });
    await p.click("#fs-bild"); await p.waitForTimeout(200);
    const geteilt = await p.evaluate(() => window.__geteilt);
    erwarte(geteilt.length === 1 && /mira-tablet-fuehrerschein\.png/.test(geteilt[0].n) && geteilt[0].t === "image/png" && geteilt[0].aktiv, `Führerschein: „Als Bild speichern“ teilt die PNG-Datei sofort im Antippen (${JSON.stringify(geteilt[0] || {})})`);
    // b) Teilen wird abgelehnt (wie auf dem iPad des Testers), App vom Home-Bildschirm: Bild zum Gedrückthalten
    await p.evaluate(() => { window.__standalone = true; navigator.share = () => Promise.reject(Object.assign(new Error("nein"), { name: "NotAllowedError" })); });
    await p.click("#fs-bild"); await p.waitForSelector("#fs-halten:not([hidden])");
    const halten = await p.evaluate(() => { const i = document.getElementById("fs-bild-gross"); return { src: /^blob:/.test(i.src), kontext: i.dataset.kontext, callout: getComputedStyle(i).webkitTouchCallout || "", breit: i.getBoundingClientRect().width }; });
    await p.waitForFunction(() => document.getElementById("fs-bild-gross").naturalWidth === 1440);
    erwarte(halten.src && halten.kontext === "an" && halten.breit > 300, "Führerschein als Home-Bildschirm-App: Bild erscheint groß zum Gedrückthalten („In Fotos sichern“), Safari-Menü dort erlaubt");
    await bild(p, "rm-fuehrerschein-halten");
    await p.click("#fs-halten-zu");
    // c) ohne Teilen im Browser: Download
    await p.evaluate(() => { window.__standalone = false; navigator.canShare = undefined; });
    const [dl] = await Promise.all([p.waitForEvent("download", { timeout: 10000 }), p.click("#fs-bild")]);
    erwarte(/mira-tablet-fuehrerschein\.png/.test(dl.suggestedFilename()), `Führerschein im Browser ohne Teilen: Download „${dl.suggestedFilename()}“`);
    await ctx.close();
  }

  // ---------- 2. Sachunterricht quer mit Prüfleiste: „Weiter“ im Bild, erwartete Antwort, Zähler ----------
  for (const [breite, hoehe, art] of [[1180, 788, "quer"], [820, 1148, "hoch"]]) {
    const { ctx, p } = await kind({ breite, hoehe, erprobung: true });
    await p.goto(BASIS + "spiele/sachkunde/?thema=gemeinde"); await p.waitForFunction(() => window.__sachkunde && window.Erprobung && Erprobung.eintraege);
    let zuordnen = false;
    for (let i = 0; i < 80; i++) {   // bis zur ersten Auswahl; Zuordnen dabei richtig lösen
      if (await p.$(".option-zeile")) break;
      const w = await p.$("#weiter");
      if (w) await w.click();
      else { zuordnen = true; const bs = await p.$$(".option:not(:disabled)"); for (const b of bs) { if (await p.$("#weiter")) break; if (await b.isVisible().catch(() => false)) { await b.click().catch(() => {}); await p.waitForTimeout(60); } } }
      await p.waitForTimeout(120);
    }
    erwarte(!!(await p.$(".option-zeile")), `SU ${art}: Auswahl-Schritt erreicht${zuordnen ? " (Zuordnen davor gelöst)" : ""}`);
    const leiste = await p.evaluate(() => { const l = document.querySelector(".erp-leiste"), a = document.getElementById("aufgabe").getBoundingClientRect(), r = l && l.getBoundingClientRect();
      return l ? { text: l.innerText, imBild: r.bottom <= innerHeight + 1 && r.top >= 0, neben: r.right <= a.left + 1, aufgabeHoch: Math.round(a.height) } : null; });
    erwarte(leiste && /Erwartete Antwort:\s*Die Bürgermeisterin oder der Bürgermeister/.test(leiste.text) && leiste.imBild, `SU ${art}: Prüfleiste im Bild und zeigt die erwartete Antwort – prüfen geht vor dem Antworten`);
    if (art === "quer") erwarte(leiste && leiste.neben, `SU quer: Prüfleiste steht links unter Ella, nicht unter der Aufgabenkarte (Karte ${leiste && leiste.aufgabeHoch} px hoch)`);
    await p.click('.erp-leiste [data-rolle="fach"] [data-u="ok"]'); await p.waitForTimeout(150);
    erwarte((await log(p)).some(e => e.art === "pruefung" && e.urteil === "ok" && e.inhalt === "sachkunde:gemeinde"), `SU ${art}: 👍 vor der Antwort wird gespeichert`);
    // richtige Antwort zuerst antippen (wie der Tester) → Erklärung UND „Weiter“ im sichtbaren Teil der Karte
    const richtig = await p.evaluateHandle(() => [...document.querySelectorAll(".option-zeile .option")].find(b => /Bürgermeister/.test(b.textContent)));
    await richtig.click(); await p.waitForSelector("#weiter"); await p.waitForTimeout(350);
    const w = await p.evaluate(() => { const r = document.getElementById("weiter").getBoundingClientRect(), a = document.getElementById("aufgabe").getBoundingClientRect(), e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return { oben: Math.round(r.top), unten: Math.round(r.bottom), karteUnten: Math.round(a.bottom), vh: innerHeight, trifft: !!(e && e.closest("#weiter")) }; });
    erwarte(w.unten <= w.karteUnten + 1 && w.unten <= w.vh && w.trifft, `SU ${art}: nach der richtigen Antwort ist „Weiter“ ganz zu sehen und antippbar (${JSON.stringify(w)})`);
    await bild(p, `rm-su-${art}`);
    // Thema zu Ende spielen: „beantwortet“ nie größer als die Zahl der Schritte
    for (let i = 0; i < 200; i++) {
      if (await p.evaluate(() => Erprobung.eintraege().some(e => e.art === "runde"))) break;
      const wk = await p.$("#weiter"); if (wk) await wk.click(); else { const o = await p.$(".option:not(:disabled)"); if (o) await o.click().catch(() => {}); }
      await p.waitForTimeout(70);
    }
    const runde = (await p.evaluate(() => Erprobung.eintraege())).find(e => e.art === "runde" && e.inhalt === "sachkunde:gemeinde");
    erwarte(runde && runde.beantwortet <= runde.n && runde.beantwortet >= 2, `SU ${art}: Runde zu Ende, Zähler stimmig (${runde ? `${runde.beantwortet} von ${runde.n}` : "kein Eintrag"})`);
    await ctx.close();
  }

  // ---------- 3. Matheweg hoch: Band im Bild, Lernbereiche mit Abstand, Prüfleiste, Erklär-Einheit zurück ----------
  for (const [breite, hoehe, art] of [[820, 1148, "iPad hoch"], [1180, 820, "iPad quer"], [390, 760, "Handy"]]) {
    const { ctx, p } = await kind({ breite, hoehe, erprobung: true });
    await p.goto(BASIS + "spiele/mathe/"); await p.waitForFunction(() => window.__mathe && document.querySelector("#karte .station")); await p.waitForTimeout(300);
    const weg = await p.evaluate(() => { const k = document.getElementById("karte"), kr = k.getBoundingClientRect(), xs = [...k.querySelectorAll(".station")].map(s => { const r = s.querySelector(".kreis").getBoundingClientRect(); return (r.left + r.right) / 2; });
      const bogen = +k.dataset.bogen, links = Math.min(...xs) - bogen, rechts = Math.max(...xs) + bogen;
      const sj = document.getElementById("schuljahr"), letzte = sj && !sj.hidden ? Math.max(...[...sj.querySelectorAll("*")].map(x => x.getBoundingClientRect().bottom)) + scrollY : 0;
      const raus = sj ? [...sj.querySelectorAll("*")].filter(x => { const r = x.getBoundingClientRect(); return r.width && (r.right > innerWidth + 0.5 || r.left < -0.5); }).length : 0;
      return { links: Math.round(links), rechts: Math.round(rechts), iw: innerWidth, sw: document.documentElement.scrollWidth, platzUnten: Math.round(document.documentElement.scrollHeight - letzte), raus, sj: !!letzte, kr: [kr.left, kr.right] }; });
    erwarte(weg.links >= 0 && weg.rechts <= weg.iw && weg.sw <= weg.iw, `${art}: das Band des Mathewegs bleibt links und rechts im Bild (${weg.links} … ${weg.rechts} von ${weg.iw})`);
    erwarte(weg.sj && weg.platzUnten >= 30 && weg.raus === 0, `${art}: unter den Lernbereichs-Kacheln bleiben ${weg.platzUnten} px Platz, keine ragt seitlich hinaus`);
    await p.evaluate(() => document.getElementById("schuljahr").scrollIntoView({ block: "end" })); await bild(p, `rm-mathe-${art.replace(" ", "-")}-weg`);
    // Prüfleiste: erwartete Antwort, Urteil vor der Antwort
    await p.evaluate(() => __mathe.starte(0)); await p.waitForSelector(".erp-leiste");
    const pl = await p.evaluate(() => { const l = document.querySelector(".erp-leiste"), r = l.getBoundingClientRect(), a = __mathe.lauf ? null : null; return { text: l.innerText, imBild: r.bottom <= innerHeight + 1 }; });
    const soll = await p.evaluate(() => Erprobung.jetzt.loesung);
    erwarte(/^\d+$/.test(soll) && pl.text.includes("Erwartete Antwort") && pl.text.includes(soll) && pl.imBild, `${art}: Prüfleiste im Bild mit erwarteter Antwort (${soll})`);
    await p.click('.erp-leiste [data-rolle="fach"] [data-u="aendern"]'); await p.waitForTimeout(100);
    await p.click('.erp-leiste [data-rolle="fach"] [data-u="ok"]'); await p.waitForTimeout(100);
    const pr = (await log(p)).filter(e => e.art === "pruefung");
    erwarte(pr.length === 2 && pr[1].urteil === "ok" && await p.evaluate(() => document.querySelectorAll(".erp-leiste .erp-zeile button.an").length === 1 && document.querySelector(".erp-leiste .erp-zeile button.an").dataset.u === "ok"),
      `${art}: Urteil vor dem Antworten gespeichert; der zuletzt getippte Knopf ist markiert`);
    await bild(p, `rm-mathe-${art.replace(" ", "-")}-leiste`);
    // Erklär-Einheit: zwei Schritte vor, einen zurück (Knopf), wieder vor
    await p.evaluate(() => { window.__erklaertFertig = false; __mathe.erklaere("plus20", () => { window.__erklaertFertig = true; }); }); await p.waitForTimeout(200);
    erwarte(!(await p.$("#erklaer-zurueck")), `${art}: Erklär-Einheit – im ersten Schritt kein Zurück-Knopf`);
    const punkt = () => p.evaluate(() => [...document.querySelectorAll("#punkte .punkt")].findIndex(x => x.classList.contains("jetzt")));
    // erster Schritt („zeigen“): ▶/Weiter antippen, bis der zweite Schritt da ist
    for (let i = 0; i < 12 && await punkt() === 0; i++) { const k = await p.$("#eingabe button:not(:disabled)"); if (k) await k.click(); await p.waitForTimeout(150); }
    erwarte(await punkt() === 1 && !!(await p.$("#erklaer-zurueck")), `${art}: im zweiten Schritt gibt es ⬅️`);
    await p.click("#erklaer-zurueck"); await p.waitForTimeout(150);
    erwarte(await punkt() === 0, `${art}: ⬅️ führt einen Erklär-Schritt zurück`);
    for (let i = 0; i < 12 && await punkt() === 0; i++) { const k = await p.$("#eingabe button:not(:disabled)"); if (k) await k.click(); await p.waitForTimeout(150); }
    // Wischen nach rechts über die Tafel = zurück
    await p.evaluate(() => { const t = document.getElementById("tafel"), r = t.getBoundingClientRect(), y = r.top + r.height / 2;
      const ev = (typ, x) => { const e = new Event(typ, { bubbles: true }); e.changedTouches = [{ clientX: x, clientY: y }]; t.dispatchEvent(e); };
      ev("touchstart", r.left + 40); ev("touchend", r.left + 220); });
    await p.waitForTimeout(150);
    erwarte(await punkt() === 0, `${art}: nach rechts wischen führt ebenfalls zurück`);
    await bild(p, `rm-mathe-${art.replace(" ", "-")}-erklaeren`);
    await ctx.close();
  }
  // kurze Runden: nie zweimal dieselbe Antwort bei Auswahl-Aufgaben
  {
    const { ctx, p } = await kind({ ru: false });
    await p.goto(BASIS + "spiele/mathe/"); await p.waitForFunction(() => window.Mathe);
    const doppelt = await p.evaluate(() => { let n = 0; for (let i = 0; i < 300; i++) { const r = Mathe.runde("vergleich", 2); if (r.length !== 2 || r[0].antwort === r[1].antwort) n++; } return n; });
    erwarte(doppelt === 0, `Einstufung „Größer oder kleiner“: in 300 Zweier-Runden nie zweimal dasselbe Zeichen (${doppelt})`);

    // ---------- 4. Meldungen führen weiter ----------
    await p.goto(BASIS + "spiele/mathe/"); await p.waitForFunction(() => window.Sticker && window.Charakter);
    await p.evaluate(() => { const id = Object.keys(Sticker.ALLE)[0]; Sticker.gib(id); });
    await p.waitForSelector("#belohnung"); await p.waitForTimeout(400);
    erwarte(/Neuer Sticker/.test(await p.textContent("#belohnung")) && await p.evaluate(() => document.getElementById("belohnung").dataset.ziel === "spiele/album/"), "Meldung „Neuer Sticker“ hat das Album als Ziel");
    await p.click("#belohnung"); await p.waitForURL(/spiele\/album\//);
    erwarte(true, "Antippen der Sticker-Meldung öffnet das Stickeralbum");
    await p.goto(BASIS + "spiele/mathe/"); await p.waitForFunction(() => window.Charakter);
    await p.evaluate(() => Charakter.gib("mathe", 12)); await p.waitForSelector("#belohnung"); await p.waitForTimeout(400);
    erwarte(/Rechen-Kraft: Stufe/.test(await p.textContent("#belohnung")), "Meldung „Rechen-Kraft: Stufe …“ erscheint");
    await p.click("#belohnung"); await p.waitForURL(/spiele\/ich\/#kann/); await p.waitForTimeout(300);
    erwarte(await p.evaluate(() => { const b = document.querySelector('.ich-reiter [data-reiter="kann"]'); return !!b && (b.classList.contains("an") || b.getAttribute("aria-selected") === "true" || b.getAttribute("aria-pressed") === "true"); }), "Antippen führt zu Meine Ecke → „Mein Können“");
    // eine Meldung ohne Ziel schließt nur
    await p.goto(BASIS + "spiele/mathe/"); await p.waitForFunction(() => window.Charakter);
    await p.evaluate(() => Charakter.hinweis("Test", "ohne Ziel")); await p.waitForSelector("#belohnung"); await p.waitForTimeout(400);
    await p.click("#belohnung"); await p.waitForTimeout(300);
    erwarte(/spiele\/mathe\//.test(p.url()), "Meldung ohne Ziel: Antippen schließt nur");

    // ---------- 5. Atelier: 💾 Speichern ----------
    await p.goto(BASIS + "spiele/atelier/"); await p.waitForFunction(() => window.__atelier);
    await p.click("#frei-malen"); await p.waitForSelector("#leinwand:visible");
    const lw = await p.$("#leinwand"), box = await lw.boundingBox();
    await p.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.4); await p.mouse.down(); await p.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.6, { steps: 6 }); await p.mouse.up();
    erwarte(await p.isVisible("#speichern"), "Atelier: Knopf „💾 Speichern“ beim Malen");
    const reihe = await p.evaluate(() => { const k = [...document.querySelectorAll(".aktionen .knopf")].map(b => b.getBoundingClientRect()); return k.every(r => r.right <= innerWidth && r.bottom <= innerHeight && r.left >= 0); });
    erwarte(reihe, "Atelier: alle Knöpfe unter der Leinwand im Bild");
    await p.click("#speichern"); await p.waitForTimeout(700);
    const gesp = await p.evaluate(async () => ({ bilder: (await Bilder.alle()).length, malt: getComputedStyle(document.getElementById("leinwand")).display !== "none" && document.getElementById("leinwand").offsetParent !== null }));
    erwarte(gesp.bilder === 1 && gesp.malt, `Atelier: „Speichern“ legt das Bild in die Galerie (${gesp.bilder}) und bleibt beim Malen`);
    await bild(p, "rm-atelier");
    await p.click("#speichern"); await p.waitForTimeout(700);
    erwarte((await p.evaluate(async () => (await Bilder.alle()).length)) === 1, "Atelier: nochmal speichern überschreibt dasselbe Bild (kein zweites)");

    // ---------- 6. Figur: keine Strähnen vor den Wangen, Ärmel mit Naht ----------
    await p.goto(BASIS + "spiele/anziehen/"); await p.waitForFunction(() => window.Figur && window.KindFigur);
    const fig = await p.evaluate(() => { const aus = {};
      ["lang", "bob", "wellen", "schulterlang"].forEach(h => { const v = (h === "lang" || h === "bob" ? KindFigur.HAARE[h]("#8A5A34") : null); if (v) aus[h] = / C(88|90) 1(42|40) /.test(v.vorne); });
      const l = Figur.STANDARD(); l.oberteil = { id: "tshirt", farbe: "#FF9BC8" }; const t = Figur.zeichneFigur(l);
      const l2 = Figur.STANDARD(); l2.oberteil = { id: "sterntop", farbe: "#FF9BC8" }; l2.kleid = null; const t2 = Figur.zeichneFigur(l2);
      const d = document.createElement("div"); d.innerHTML = `<svg viewBox="0 0 300 520">${t}</svg>`; const ids = [...d.querySelectorAll("[id]")].map(x => x.id);
      return { straehnen: aus, naht: (t.match(/class="aermel-naht"/g) || []).length, ohneAermel: (t2.match(/class="aermel-naht"/g) || []).length, doppelteIds: ids.length - new Set(ids).size }; });
    erwarte(fig.straehnen.lang === false && fig.straehnen.bob === false, "Figur: „lang“ und „Bob“ ohne Strähnen vor den Wangen (keine „Koteletten“)");
    erwarte(fig.naht === 1 && fig.ohneAermel === 0 && fig.doppelteIds === 0, `Figur: Ärmel mit feiner Naht statt dicker Kontur über dem Rumpf (T-Shirt ${fig.naht}, Top ohne Ärmel ${fig.ohneAermel}, doppelte ids ${fig.doppelteIds})`);
    await bild(p, "rm-kleiderschrank");
    await ctx.close();
  }

  // ---------- 7. Szene: kein „(Entwurf, ungeprüft)“ in der Sprechblase ----------
  {
    const { ctx, p } = await kind({ vorher: null });
    await p.goto(BASIS + "spiele/eltern/"); if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); }
    await p.goto(BASIS + "spiele/album/"); await p.waitForFunction(() => window.Szene && window.__szene);
    await p.evaluate(() => { const k = Spielwelt.kind ? Spielwelt.kind() : null; __szene.spiele("sonne"); }); await p.waitForSelector("#szene-hilfe", { state: "attached" });
    const sz = await p.evaluate(() => { const h = document.getElementById("szene-hilfe"); h.hidden = false; const n = getComputedStyle(h, "::after").content, o = getComputedStyle(h).outlineStyle;
      return { entwurf: h.classList.contains("entwurf"), nach: n, rand: o, text: h.textContent }; });
    erwarte(sz.entwurf && /[а-яё]/i.test(sz.text) && (sz.nach === "none" || sz.nach === "normal" || sz.nach === '""') && sz.rand === "none", `Szene: russische Hilfe ohne Zusatz „(Entwurf, ungeprüft)“ und ohne gestrichelten Rand (${JSON.stringify({ nach: sz.nach, rand: sz.rand })})`);
    await bild(p, "rm-szene");
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Rückmeldung-Test bestanden.");
})();
