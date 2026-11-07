// Test Erprobungsmodus (Paket K, 12.11.2026): Reiter „🔍 Erprobung & Prüfen“ im Elternbereich echt bedient (Schalter, Kürzel, drei Rollen
// gleichzeitig: Spieler/in, Lehrkraft mit Fächern/Klasse, Muttersprachler/in Russisch), dann echt gespielt: Mathe-Runde mit Fehler über die Tasten,
// Werkstatt-Schritt, Sachthema; „✍️ Melden“ mit Text (Name des Kindes wird zu {name}), Prüfleiste fachlich ✏️ mit Korrektur und Russisch 👍,
// Seitenwechsel; Export als Datei per Download abgefangen und geprüft (Format, Prüfsummen wie quellen/pruefstand.js, keine Namen/eigenen Texte),
// Leeren, Modus aus → nichts mehr aufgezeichnet und kein Knopf; Prüfliste Russisch schreibt mit; Handy (390 × 760) und Barriere-Regeln.
const { chromium } = require("playwright");
const fs = require("fs");
const PS = require("../quellen/pruefstand.js");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource|open-meteo/;

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };
  const passt = (p) => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
  async function neu(breite = 1180, hoehe = 820) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true, acceptDownloads: true });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__testSchnell = true; });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    p.on("dialog", d => d.accept());
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", "2");
    await p.selectOption("#e-sprache", "ru"); await p.waitForTimeout(100);
    if (await p.$("#e-dosis")) await p.selectOption("#e-dosis", "immer");
    await p.click("#e-ok"); await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    return { ctx, p };
  }
  async function eltern(p) {
    await p.goto(BASIS + "spiele/eltern/"); await p.waitForLoadState("load");
    if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); }
    await p.waitForSelector('.eltern-reiter [data-teil="erprobung"]');
    await p.click('.eltern-reiter [data-teil="erprobung"]'); await p.waitForSelector("#erp-an");
  }
  const log = (p) => p.evaluate(() => JSON.parse(localStorage.getItem("spielwelt.erprobung.log") || "[]"));
  const kosten = (p) => p.evaluate(() => ({ e: !!window.Erprobung, knopf: !!document.getElementById("erp-melden"), skript: [...document.scripts].some(s => /erprobung\.js/.test(s.src)) }));

  const { ctx, p } = await neu();

  // ---------- Modus aus: keine Kosten ----------
  await p.goto(BASIS + "spiele/mathe/?weg=k2"); await p.waitForTimeout(500);
  let k = await kosten(p);
  erwarte(!k.e && !k.knopf && !k.skript, "Modus aus: erprobung.js wird nicht geladen, kein Melden-Knopf, kein Erprobung-Objekt");

  // ---------- Elternbereich: Reiter, Einwilligung, drei Rollen, Kürzel ----------
  await eltern(p);
  const reiter = await p.evaluate(() => [...document.querySelectorAll(".eltern-reiter button")].map(b => b.dataset.teil));
  erwarte(reiter.includes("erprobung"), "Elternbereich: Reiter „🔍 Erprobung & Prüfen“ immer sichtbar");
  await p.click("#erp-einwilligung summary");
  const einw = await p.evaluate(() => document.getElementById("erp-einwilligung").textContent);
  erwarte(/Nichts wird automatisch verschickt/.test(einw) && /jederzeit ausschalten und löschen/.test(einw) && /Nicht.*aufgezeichnet/s.test(einw), "Einwilligungstext: was aufgezeichnet wird, nichts automatisch verschickt, jederzeit löschbar");
  await p.click("#erp-an"); await p.waitForTimeout(100);
  await p.fill("#erp-kuerzel", "T1<b>"); await p.press("#erp-kuerzel", "Tab"); await p.waitForTimeout(100);
  await p.click("#erp-rolle-lehrkraft"); await p.waitForTimeout(80);
  for (const f of ["mathe", "deutsch", "sachkunde"]) { await p.click("#erp-fach-" + f); await p.waitForTimeout(60); }
  await p.click("#erp-klasse-2"); await p.waitForTimeout(60);
  await p.click("#erp-rolle-ru"); await p.waitForTimeout(80);
  const st = await p.evaluate(() => Erprobung.einstellungen());
  erwarte(/^T1 ?b$/.test(st.kuerzel), `Kürzel gesäubert gespeichert („${st.kuerzel}“)`);
  erwarte(st.an && ["spieler", "lehrkraft", "ru"].every(r => st.rollen.includes(r)) && st.faecher.length === 3 && st.klassen.join() === "2",
    `Modus an mit drei Rollen gleichzeitig (${st.rollen.join(", ")}), Fächer ${st.faecher.join("/")}, Klasse ${st.klassen.join()}`);
  await bild(p, "erprobung-eltern-quer");

  // ---------- Mathe-Runde mit Fehler, echt über die Tasten ----------
  await p.goto(BASIS + "spiele/mathe/?weg=k2"); await p.waitForTimeout(600);
  k = await kosten(p);
  erwarte(k.e && k.knopf, "Modus an: erprobung.js geladen, Melden-Knopf auf der Seite");
  // eine Station mit Frage und russischer Hilfezeile suchen (Hilfesprache Russisch, „Immer“)
  let nr = -1;
  for (let n = 0; n < 40 && nr < 0; n++) {
    await p.evaluate((n) => __mathe.starte(n), n); await p.waitForTimeout(250);
    if (await p.evaluate(() => !!document.querySelector("#tafel > p.frage ~ .hilfe-ru"))) nr = n;
  }
  erwarte(nr >= 0, `Mathe Kl. 2: Station ${nr} mit Frage und russischer Zeile`);
  const a = await p.evaluate(() => { const a = __mathe.lauf.liste[__mathe.lauf.pos]; return { art: a.art, antwort: a.antwort, optionen: a.optionen, station: a.station }; });
  const tippe = async (wert) => {
    if (a.art === "wahl") { await p.click(`.wahl-tasten .taste[data-wert="${wert}"]`); return; }
    for (const z of String(wert)) await p.click(`.tasten .taste[data-ziffer="${z}"]`);
    await p.click('.tasten .taste[data-tun="ok"]');
  };
  // Prüfleiste: fachlich ✏️ mit Korrektur, Russisch 👍
  await p.waitForSelector('.erp-leiste .erp-zeile[data-rolle="fach"]');
  const leisteDa = await p.evaluate(() => { const l = document.querySelector(".erp-leiste"), r = l.getBoundingClientRect(), t = document.getElementById("tafel").getBoundingClientRect(); return { unter: r.top >= t.bottom - 1, sicht: r.height > 30 }; });
  erwarte(leisteDa.unter && leisteDa.sicht, "Mathe: Prüfleiste unter der Tafel");
  await p.click('.erp-zeile[data-rolle="fach"] [data-u="aendern"]');
  await p.fill(".erp-korr textarea", "Bitte kleinere Zahlen für Mira"); await p.click(".erp-speichern");
  await p.waitForSelector('.erp-zeile[data-rolle="ru"]:not([hidden])', { timeout: 4000 }).catch(() => {});
  const ruDa = await p.evaluate(() => !document.querySelector('.erp-zeile[data-rolle="ru"]').hidden);
  erwarte(ruDa, "Mathe mit Hilfesprache Russisch: Zeile „Russisch“ in der Prüfleiste");
  if (ruDa) await p.click('.erp-zeile[data-rolle="ru"] [data-u="ok"]');
  await bild(p, "erprobung-mathe-quer");
  // Melden mit Text
  await p.click("#erp-melden"); await p.waitForSelector("#erp-dialog");
  await bild(p, "erprobung-melden-quer");
  await p.click("#erp-dialog .erp-los");
  erwarte(/Tippe zuerst/.test(await p.textContent("#erp-dialog .erp-hinweis")), "Melden ohne Kategorie: freundlicher Hinweis");
  await p.click('#erp-dialog [data-kat="schwer"]');
  await p.fill("#erp-text", "Mira fand das <script> knifflig");
  await p.click("#erp-dialog .erp-los"); await p.waitForTimeout(200);
  erwarte(!(await p.$("#erp-dialog")) && await p.isVisible("#erp-melden"), "Melden: Dialog zu, Knopf wieder da");
  // erst falsch, dann richtig über die Tasten
  const falsch = a.art === "wahl" ? a.optionen.find(o => String(o) !== a.antwort) : String((+a.antwort + 1) % 100);
  await tippe(falsch); await p.waitForTimeout(1500);
  await tippe(a.antwort); await p.waitForTimeout(1100);
  // Rest der Runde über die Tasten spielen (Runde fertig)
  for (let i = 0; i < 30; i++) {
    const z = await p.evaluate(() => { const l = __mathe.lauf; const ende = !document.getElementById("ende-ansicht").hidden; const a = l && l.liste[l.pos]; return ende ? null : { art: a.art, antwort: a.antwort, weiter: !!document.getElementById("weiter") }; });
    if (!z) break;
    if (z.weiter) { await p.click("#weiter"); await p.waitForTimeout(150); continue; }
    if (z.art === "wahl") await p.click(`.wahl-tasten .taste[data-wert="${z.antwort}"]`);
    else { for (const c of String(z.antwort)) await p.click(`.tasten .taste[data-ziffer="${c}"]`); await p.click('.tasten .taste[data-tun="ok"]'); }
    await p.waitForTimeout(1100);
  }
  erwarte(await p.isVisible("#ende-ansicht"), "Mathe-Runde bis zum Ende gespielt");

  // ---------- Werkstatt-Schritt ----------
  await p.goto(BASIS + "spiele/deutsch/"); await p.waitForTimeout(500);
  await p.evaluate(() => __deutsch.starte(WERKSTATT.findIndex(k => k.id === "w-rechengeschichten"), WERKSTATT)); await p.waitForTimeout(300);
  await p.click("#weiter"); await p.waitForTimeout(300);
  const lu = await p.evaluate(() => { const s = __deutsch.lauf.k.schritte[__deutsch.lauf.pos]; return { typ: s.typ, richtig: s.optionen && (s.optionen[0].t || s.optionen[0]) }; });
  const knoepfe = await p.$$eval("#aufgabe .option", bs => bs.map(b => b.textContent.trim()));
  const iR = knoepfe.findIndex(t => t === lu.richtig || t.includes(lu.richtig)), iF = knoepfe.findIndex((t, i) => i !== iR);
  await p.click(`#aufgabe .option >> nth=${iF}`); await p.waitForTimeout(200);
  await p.click(`#aufgabe .option >> nth=${iR}`); await p.waitForTimeout(400);
  erwarte(lu.typ === "luecke" && iR >= 0 && await p.$(".erp-leiste"), `Werkstatt: Lückentext-Schritt echt beantwortet (falsch, dann richtig), Prüfleiste da`);

  // ---------- Sachthema ----------
  await p.goto(BASIS + "spiele/sachkunde/"); await p.waitForTimeout(500);
  await p.evaluate(() => __sachkunde.starte(__sachkunde.themen.findIndex(t => t.id === "gesundheit"))); await p.waitForTimeout(300);
  await p.click("#weiter"); await p.waitForTimeout(200); await p.click("#weiter"); await p.waitForTimeout(300);
  const sk = await p.evaluate(() => { const s = __sachkunde.lauf.t.schritte[__sachkunde.lauf.pos]; return { typ: s.typ, ok: (s.optionen.find(o => o.ok) || {}).t }; });
  const sko = await p.$$eval("#aufgabe .option", bs => bs.map(b => b.textContent.trim()));
  await p.click(`#aufgabe .option >> nth=${sko.findIndex(t => t.startsWith(sk.ok))}`); await p.waitForTimeout(300);
  await p.click('.erp-zeile[data-rolle="fach"] [data-u="ok"]');
  erwarte(sk.typ === "wahl", "Sachthema „Gesundheit“: Wahl-Frage echt beantwortet, fachlich 👍");

  // ---------- Export ----------
  await eltern(p);
  await p.click("#erp-vorschau"); await p.waitForSelector("#erp-zahlen");
  const vorschau = await p.textContent("#erp-zahlen");
  erwarte(/Aufgaben/.test(vorschau) && /Meldungen/.test(vorschau) && /Prüfungen/.test(vorschau) && /Seiten/.test(vorschau), `Vorschau zeigt Anzahl je Art (${vorschau.trim().slice(0, 120)})`);
  await bild(p, "erprobung-vorschau-quer");
  const [dl] = await Promise.all([p.waitForEvent("download"), p.click("#erp-speichern")]);
  const pfad = await dl.path(), name = dl.suggestedFilename(), roh = fs.readFileSync(pfad, "utf8"), d = JSON.parse(roh);
  if (BILDER) fs.writeFileSync(`${BILDER}/${name}`, roh);
  erwarte(/^lerninsel-erprobung-T1b?-2026-10-25\.json$/.test(name), `Dateiname ${name}`);
  erwarte(d.format === "lerninsel-erprobung" && d.version === 1 && /^T1/.test(d.kuerzel) && d.rollen.length === 3 && d.geraet && d.geraet.bildschirm && d.app && d.app.version && d.von && d.bis,
    "Datei: Format, Version 1, Kürzel, drei Rollen, Gerät, App-Version, Zeitraum");
  const E = d.eintraege, art = (x) => E.filter(e => e.art === x);
  const ma = art("aufgabe").filter(e => e.inhalt === "mathe:" + a.station);
  erwarte(ma.some(e => !e.richtig && e.antwort === String(falsch)) && ma.some(e => e.richtig && e.versuch === 2) && ma.every(e => e.ms >= 0 && e.klasse === "2" && e.fach === "mathe"),
    `Mathe-Aufgaben mit Antwort, richtig/falsch, Versuch, Zeit (${ma.length} Einträge)`);
  const station = PS.bereiche().mathe.liste.find(x => x.id === a.station);
  erwarte(ma[0] && ma[0].h === PS.hash(station.inhalt), `Prüfsumme der Station im Browser = quellen/pruefstand.js (${ma[0] && ma[0].h})`);
  const kap = PS.bereiche().werkstatt.liste.find(x => x.id === "w-rechengeschichten"), wa = art("aufgabe").filter(e => e.inhalt === "werkstatt:w-rechengeschichten");
  erwarte(wa.length === 2 && wa[0].schritt === "1" && !wa[0].richtig && wa[1].richtig && wa[0].h === PS.hash(kap.inhalt), "Werkstatt-Schritt 1: falsch, dann richtig, Prüfsumme passt");
  const th = PS.bereiche().sachkunde.liste.find(x => x.id === "gesundheit"), sa = art("aufgabe").find(e => e.inhalt === "sachkunde:gesundheit");
  erwarte(sa && sa.richtig && sa.schritt === "2" && sa.h === PS.hash(th.inhalt), "Sachthema Schritt 2 richtig, Prüfsumme passt");
  const pf = art("pruefung").find(e => e.rolle === "fach" && e.urteil === "aendern"), pr = art("pruefung").find(e => e.rolle === "ru" && e.urteil === "ok"), pg = art("pruefung").find(e => e.rolle === "fach" && e.inhalt === "sachkunde:gesundheit");
  erwarte(pf && /kleinere Zahlen/.test(pf.korrektur) && pf.inhalt === "mathe:" + a.station && pf.h === ma[0].h && pf.kuerzel, "Prüfung fachlich ✏️ mit Korrektur, Inhalt-ID, Prüfsumme und Kürzel");
  erwarte(pr && /[а-яё]/i.test(pr.ruText || "") && pr.h && pr.hInhalt === ma[0].h, `Prüfung Russisch 👍 mit dem russischen Text und seiner Prüfsumme („${pr && (pr.ruText || "").slice(0, 40)}“)`);
  erwarte(pg && pg.urteil === "ok" && pg.schritt === "2", "Prüfung fachlich 👍 im Sachthema");
  const me = art("meldung")[0];
  erwarte(me && me.kat === "schwer" && /\{name\} fand das/.test(me.text) && !/[<>]/.test(me.text) && me.inhalt === "mathe:" + a.station && me.klasse === "2", `Meldung mit Kategorie, gesäubertem Text und Kontext („${me && me.text}“)`);
  const seiten = art("seite").map(e => e.seite);
  erwarte(["spiele/mathe?weg=k2", "spiele/deutsch", "spiele/sachkunde"].every(s => seiten.includes(s)) && art("seite").every(e => e.ms >= 0), `Seitenwechsel mit Verweildauer (${[...new Set(seiten)].join(", ")})`);
  erwarte(art("runde").some(e => e.inhalt === "mathe:" + a.station) && art("abbruch").some(e => /werkstatt|sachkunde/.test(e.inhalt)), "Fertige Mathe-Runde und Abbrüche (Werkstatt/Sachthema verlassen)");
  erwarte(!/Mira/.test(roh) && !/knifflig für Mira/.test(roh) && !/<script>/.test(roh), "Datei ohne Namen des Kindes und ohne HTML");
  erwarte(!E.some(e => e.art === "aufgabe" && e.inhalt && /schreiben/.test(e.schritt || "") && e.antwort), "Keine eigenen Texte (Schreib-Schritte ohne Antwort)");
  // ---------- Prüfliste Russisch schreibt mit ----------
  await p.goto(BASIS + "spiele/eltern/russisch-pruefen.html"); await p.waitForTimeout(400);
  await p.click("details.karte >> nth=0"); await p.waitForSelector(".eintrag .wahl .ok");
  await p.click(".eintrag .wahl .nein >> nth=0"); await p.fill(".eintrag input >> nth=0", "Лучше так"); await p.press(".eintrag input >> nth=0", "Tab"); await p.waitForTimeout(500);
  const rl = (await log(p)).filter(e => e.art === "pruefung" && /^ru-text:/.test(e.inhalt));
  erwarte(rl.some(e => e.urteil === "aendern" && e.korrektur === "Лучше так" && e.h && e.ruText), `Prüfliste Russisch: ✗ mit besserer Fassung landet in der Erprobungsdatei (${rl.length})`);
  erwarte(!(await p.$("#erp-melden")), "Prüfliste: kein Melden-Knopf (Erwachsenen-Seite)");

  // ---------- Leeren, Modus aus ----------
  await eltern(p);
  await p.click("#erp-vorschau"); await p.waitForSelector("#erp-leeren"); await p.click("#erp-leeren"); await p.waitForTimeout(200);
  erwarte((await log(p)).length === 0, "Aufzeichnung geleert");
  await p.click("#erp-an"); await p.waitForTimeout(150);
  await p.goto(BASIS + "spiele/mathe/?weg=k2"); await p.waitForTimeout(500);
  k = await kosten(p);
  await p.evaluate(() => __mathe.starte(0)); await p.waitForTimeout(300);
  const a2 = await p.evaluate(() => { const a = __mathe.lauf.liste[__mathe.lauf.pos]; return a.antwort; });
  await p.evaluate((w) => __mathe.antworte(w), a2); await p.waitForTimeout(300);
  await p.goto(BASIS + "spiele/sachkunde/"); await p.waitForTimeout(300);
  erwarte(!k.e && !k.knopf && (await log(p)).length === 0 && !(await p.$(".erp-leiste")), "Modus aus: nichts mehr aufgezeichnet, kein Knopf, keine Prüfleiste");
  await ctx.close();

  // ---------- Handy und Barriere ----------
  {
    const { ctx, p } = await neu(390, 760);
    await p.evaluate(() => localStorage.setItem("spielwelt.erprobung", JSON.stringify({ an: true, kuerzel: "H2", rollen: ["spieler", "lehrkraft", "ru"], faecher: [], klassen: [] })));
    await p.goto(BASIS + "spiele/mathe/?weg=k2"); await p.waitForTimeout(600);
    await p.evaluate(() => __mathe.starte(0)); await p.waitForTimeout(500);
    const m = await p.evaluate(() => { const b = document.getElementById("erp-melden").getBoundingClientRect(); return { w: b.width, h: b.height, links: b.left };});
    erwarte(m.w >= 40 && m.h >= 40 && m.links <= 0.5 && await passt(p), `Handy: Melden-Knopf am linken Rand, Tippfläche ${Math.round(m.w)} × ${Math.round(m.h)} px, keine Scrollleiste`);
    // Tasten und Tafel werden vom Knopf nicht verdeckt
    const verdeckt = await p.evaluate(() => { const b = document.getElementById("erp-melden").getBoundingClientRect();
      return [...document.querySelectorAll(".tasten .taste, .wahl-tasten .taste, #tafel-hoer, #zum-weg")].filter(t => { const r = t.getBoundingClientRect(); return r.width && r.left < b.right && r.right > b.left && r.top < b.bottom && r.bottom > b.top; }).length; });
    erwarte(verdeckt === 0, "Handy: der Melden-Knopf verdeckt keine Taste und keinen Knopf");
    await p.locator(".erp-leiste").scrollIntoViewIfNeeded();
    const klein = await p.evaluate(() => [...document.querySelectorAll(".erp-leiste button")].filter(b => b.offsetParent && (b.getBoundingClientRect().height < 40 || b.getBoundingClientRect().width < 40)).length);
    erwarte(klein === 0 && await passt(p), "Handy: Prüfleiste mit Tippflächen ≥ 40 px, keine Scrollleiste");
    await bild(p, "erprobung-mathe-handy");
    await p.click("#erp-melden"); await p.waitForSelector("#erp-dialog");
    const dlg = await p.evaluate(() => { const k = document.querySelector(".erp-karte").getBoundingClientRect(); return k.left >= 0 && k.right <= innerWidth && [...document.querySelectorAll("#erp-dialog button")].every(b => b.getBoundingClientRect().height >= 40); });
    // Barriere: jeder Knopf mit Namen, Eingaben beschriftet, keine doppelten ids, Russisch als Entwurf ausgezeichnet
    const bar = await p.evaluate(() => {
      const knoepfe = [...document.querySelectorAll("#erp-dialog button, #erp-melden, .erp-leiste button")].filter(b => !(b.getAttribute("aria-label") || b.textContent).trim()).length;
      const ids = [...document.querySelectorAll("[id]")].map(e => e.id), doppelt = ids.filter((x, i) => ids.indexOf(x) !== i).length;
      const eingaben = [...document.querySelectorAll("#erp-dialog textarea, .erp-leiste textarea")].filter(t => !(t.labels && t.labels.length) && !t.getAttribute("aria-label")).length;
      const ru = document.querySelectorAll('#erp-dialog [lang="ru"].ru').length;
      return { knoepfe, doppelt, eingaben, ru, dialog: document.getElementById("erp-dialog").getAttribute("role") === "dialog" };
    });
    erwarte(dlg && bar.knoepfe === 0 && bar.doppelt === 0 && bar.eingaben === 0 && bar.dialog, `Handy: Melden-Dialog passt, Knöpfe ≥ 40 px mit Namen, Eingaben beschriftet, keine doppelten ids`);
    erwarte(bar.ru >= 8, `Melden-Dialog mit russischen Zeilen (Hilfesprache Russisch, ${bar.ru})`);
    await bild(p, "erprobung-melden-handy");
    await p.keyboard.press("Escape");
    erwarte(!(await p.$("#erp-dialog")), "Escape schließt den Melden-Dialog");
    await eltern(p); await bild(p, "erprobung-eltern-handy");
    erwarte(await passt(p), "Handy: Reiter Erprobung ohne Scrollleiste");
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.join("\n")); process.exit(1); }
  console.log("✅ Erprobungstest bestanden");
})().catch(e => { console.error(e); process.exit(1); });
