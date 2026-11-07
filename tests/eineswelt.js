// Playwright-Test (Paket „Eine Welt“, 07.11.2026): Stil A durchgezogen und die Insel aus der Ferne.
// 2D: Insel-Tür der Startseite ist ein Stil-A-Bild mit Kontur, Deutsch/Sachunterricht haben eindeutige Zeichen („Abc“, Lupe mit Blatt), Knöpfe, Türen und
// Karten tragen die Kontur #3B1F63 (outline) und Knöpfe einen festen Schatten, keine Wolken hinter dem Türen-Schrank; die Begleiter-Blasen auf den
// Fach-Startseiten (Benno, Fipsi, Ella) haben Kontur und Zipfel; Matheweg-Tafel mit Benno am Rand (Zeichnung, kein Emoji), Punktpapier und Fortschritt in
// Kontur-Farbe – echt gerechnet bis zur nächsten Aufgabe; Mein Tier: Eier mittig, Sprecherin Ella, Ei echt ausgesucht; Album: alle sieben Begleiter als
// Zeichnung, Drache und Katze wie in „Mein Tier“, Sticker echt ausgesucht und groß angesehen.
// 3D: Kamerafahrt beim Betreten echt (weit → nah, ease-in-out über die Uhr), Antippen überspringt sie sofort; ohne ?fahrt=an im Test keine Fahrt;
// nachts Sterne und Mond im Bild, Schaum bläulich; Regen macht den Boden nass; Figur mit kurzen Ärmeln wie im Kleiderschrank.
// Aufruf: sh tests/laufen.sh eineswelt   (3D-Teil, allein laufen lassen; Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource|open-meteo/;
const KONTUR = "rgb(59, 31, 99)";
process.on("unhandledRejection", (e) => { console.log("❌ Abbruch: " + e.message + "\n  " + (global.__fehler || []).join("\n  ")); process.exit(1); });

(async () => {
  const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
  const fehler = global.__fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };
  async function kind(breite, hoehe, stufe = "2") {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true, serviceWorkers: "block" });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__keinSparen = true; window.__testSchnell = true; });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`Seitenfehler: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`Konsole: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok"); await p.waitForSelector("#e-name");
    await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", stufe); await p.click("#e-ok"); await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString())); await p.waitForTimeout(300);
    await p.evaluate(() => { const m = Spielwelt.lade("medien") || {}; m.lektionen = { bedienung: 3 }; Spielwelt.speichere("medien", m); Story.etappeFertig("E1");
      ["E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9"].forEach(e => Story.etappeFertig(e, true)); Story.merkeSzene("sonne"); Story.setzeKapitel(1); for (let i = 0; i < 12; i++) Zeit.aufgabe(); });
    return { ctx, p };
  }
  const umriss = (p, sel) => p.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; const c = getComputedStyle(e);
    return { farbe: c.outlineColor, breite: parseFloat(c.outlineWidth), stil: c.outlineStyle, schatten: c.boxShadow, rand: c.borderTopColor, randBreite: parseFloat(c.borderTopWidth) }; }, sel);

  // ---------- 2D, iPad quer und hoch ----------
  for (const [breite, hoehe, art] of [[1180, 820, "quer"], [820, 1180, "hoch"]]) {
    const { ctx, p } = await kind(breite, hoehe);
    await p.goto(BASIS, { waitUntil: "load" }); await p.waitForTimeout(800);
    const tuer = await p.evaluate(() => { const s = document.querySelector("#tuer-insel svg.insel-bild"); if (!s) return null; const r = s.getBoundingClientRect();
      return { kontur: s.getAttribute("stroke"), teile: s.querySelectorAll("ellipse, path, circle, rect").length, gross: r.width > 120 && r.height > 80,
        abc: (document.querySelector(".tuer.deutsch svg text") || {}).textContent, lupe: !!document.querySelector(".tuer.sach svg circle[r='24']"),
        wolken: getComputedStyle(document.body).backgroundImage }; });
    erwarte(tuer && tuer.kontur === "#3B1F63" && tuer.teile >= 10 && tuer.gross, `${art}: Insel-Tür zeigt ein Stil-A-Bild mit Kontur (${tuer && tuer.teile} Formen)`);
    erwarte(tuer && tuer.abc === "Abc" && tuer.lupe, `${art}: Deutsch zeigt „Abc“, Sachunterricht eine Lupe`);
    erwarte(tuer && tuer.wolken === "none", `${art}: keine Wolken hinter dem Türen-Schrank`);
    for (const sel of [".tuer.mathe", ".tuer.insel", ".leiste .knopf, .kopf .knopf, .knopf", ".ich-knopf"]) {
      const u = await umriss(p, sel);
      erwarte(u && u.farbe === KONTUR && u.breite >= 2 && u.stil === "solid", `${art}: ${sel.split(",")[0]} mit Kontur (${u && u.farbe} ${u && u.breite}px)`);
    }
    const k = await umriss(p, "#ton");
    erwarte(k && k.schatten.includes(KONTUR) && /0px 5px 0px/.test(k.schatten), `${art}: Knopf steht auf festem Schatten in Kontur-Farbe (${k && k.schatten})`);
    await bild(p, `start-${art}`);
    // Eigene Idee „Lebendige Insel-Tür“: das Bild zeigt Tages-/Jahreszeit und Wetter der Insel
    await p.goto(BASIS + "?stunde=22&monat=12", { waitUntil: "load" }); await p.waitForTimeout(500);
    const nacht = await p.evaluate(() => { const s = document.querySelector("#tuer-insel svg.insel-bild"), sicht = (k) => getComputedStyle(s.querySelector(".it-" + k)).display !== "none";
      return { z: window.__inseltuer && __inseltuer(), mond: sicht("mond"), sonne: sicht("sonne"), schnee: sicht("schnee"), klasse: document.getElementById("tuer-insel").classList.contains("nacht"), bg: getComputedStyle(document.getElementById("tuer-insel")).backgroundImage }; });
    erwarte(nacht.z && nacht.z.nacht && nacht.mond && !nacht.sonne && nacht.schnee && nacht.klasse && /rgb\(28, 42, 85\)/.test(nacht.bg), `${art}: Insel-Tür nachts im Winter mit Mond, Schnee und dunklem Himmel`);
    await bild(p, `start-nacht-${art}`);
    await p.goto(BASIS + "?stunde=14&monat=10&wetter=regen", { waitUntil: "load" }); await p.waitForTimeout(500);
    const regen = await p.evaluate(() => { const s = document.querySelector("#tuer-insel svg.insel-bild"), sicht = (k) => getComputedStyle(s.querySelector(".it-" + k)).display !== "none";
      return { z: __inseltuer(), regen: sicht("regen"), mond: sicht("mond"), busch: s.querySelector(".it-busch").getAttribute("fill") }; });
    erwarte(regen.z.saison === "herbst" && regen.regen && !regen.mond && regen.busch === "#F08A3C", `${art}: Insel-Tür am Herbsttag mit Regen und buntem Busch`);

    // Fach-Startseiten: Begleiter-Blasen mit Kontur und Zipfel
    for (const [url, sel, name] of [["spiele/mathe/", "#benno-text", "Mathe/Benno"], ["spiele/deutsch/", "#karte-text", "Deutsch/Fipsi"], ["spiele/sachkunde/", "#intro-text", "Sachunterricht/Ella"]]) {
      await p.goto(BASIS + url, { waitUntil: "load" }); await p.waitForTimeout(700);
      const b = await p.evaluate((sel) => { const e = document.querySelector(sel), c = getComputedStyle(e), z = getComputedStyle(e, "::before");
        return { rand: c.borderTopColor, breite: c.borderTopWidth, text: e.textContent.trim().length, zipfel: z.content !== "none" && z.borderLeftColor === "rgb(59, 31, 99)" && z.borderBottomWidth === "3px" }; }, sel);
      erwarte(b.rand === KONTUR && b.breite === "3px" && b.text > 5 && b.zipfel, `${art}: ${name}-Blase mit 3-px-Kontur und Zipfel`);
      if (url === "spiele/mathe/") await bild(p, `mathe-${art}`);
    }

    // Matheweg: Tafel mit Benno am Rand, Punktpapier, Fortschritt in Kontur-Farbe – eine Aufgabe echt über die Tasten gelöst
    await p.goto(BASIS + "spiele/mathe/", { waitUntil: "load" }); await p.waitForTimeout(600);
    await p.evaluate(() => __mathe.starte(0)); await p.waitForTimeout(700);
    const t = await p.evaluate(() => { const b = document.getElementById("tafel-begleiter"), ta = document.getElementById("tafel"), c = getComputedStyle(ta), pu = document.querySelector("#punkte span");
      return { fig: !!(b && b.querySelector("svg")), emoji: /[\u{1F000}-\u{1FFFF}]/u.test(b ? b.textContent : ""), papier: c.backgroundImage.includes("radial-gradient"), kontur: c.outlineColor,
        punkt: pu ? getComputedStyle(pu).boxShadow : "", ohneScroll: ta.scrollHeight <= ta.clientHeight + 2 }; });
    erwarte(t.fig && !t.emoji, `${art}: Benno schaut als Zeichnung über den Tafelrand (kein Emoji)`);
    erwarte(t.papier && t.kontur === KONTUR && t.ohneScroll, `${art}: Tafel mit Punktpapier und Kontur, passt ohne Scrollen`);
    erwarte(t.punkt.includes(KONTUR), `${art}: Fortschrittspunkte in Kontur-Farbe`);
    const antwort = await p.evaluate(() => String(__mathe.lauf.liste[__mathe.lauf.pos].antwort));
    for (const z of antwort) await p.click(`.taste[data-ziffer="${z}"]`);
    await p.click('.taste.ok');
    await p.waitForTimeout(1200);
    const gut = await p.evaluate(() => document.querySelectorAll("#punkte .gut").length);
    erwarte(gut >= 1, `${art}: Aufgabe echt gelöst, Fortschritt zeigt einen grünen Punkt (${gut})`);
    await bild(p, `mathe-aufgabe-${art}`);

    // Mein Tier: Sprecherin Ella, Eier mittig, Ei echt ausgesucht
    await p.goto(BASIS + "spiele/tier/", { waitUntil: "load" }); await p.waitForTimeout(800);
    const tier = await p.evaluate(() => { const box = document.getElementById("eier").getBoundingClientRect(), eier = [...document.querySelectorAll("#eier .ei-wahl")].map(e => e.getBoundingClientRect());
      const zeile = eier.filter(r => Math.abs(r.top - eier[0].top) < 4), links = zeile[0].left - box.left, rechts = box.right - zeile[zeile.length - 1].right;
      return { ella: !!document.querySelector("#wahl-sprecher svg"), links, rechts, n: eier.length, halme: getComputedStyle(document.body).backgroundImage.includes("svg") }; });
    erwarte(tier.ella, `${art}: Mein Tier – Ella spricht (Zeichnung neben der Blase)`);
    erwarte(Math.abs(tier.links - tier.rechts) < 8, `${art}: Eier stehen mittig (${Math.round(tier.links)} / ${Math.round(tier.rechts)} px Rand, ${tier.n} Eier)`);
    erwarte(tier.halme, `${art}: Wiese mit Halmen`);
    await bild(p, `tier-${art}`);
    await p.locator("#eier .ei-wahl").first().click(); await p.waitForTimeout(600);
    erwarte(await p.evaluate(() => !document.getElementById("ei-ansicht").hidden || !!document.querySelector(".dlg, dialog[open], [role=dialog]:not([hidden])")), `${art}: Ei echt ausgesucht`);

    // Album: sieben Begleiter als Zeichnung, Drache/Katze wie „Mein Tier“; Sticker echt ausgesucht
    await p.goto(BASIS + "spiele/album/", { waitUntil: "load" }); await p.waitForTimeout(500);
    await p.evaluate(() => { const d = Sticker.daten(); d.wahl = 1; Spielwelt.speichere("sticker", d); });
    await p.reload({ waitUntil: "load" }); await p.waitForTimeout(900);
    const al = await p.evaluate(() => ({ fig: [...document.querySelectorAll("#seite .st .e .emo.fig")].length, tier: document.querySelectorAll("#seite .st .e svg.tier-bild").length,
      begleiter: Sticker.BEGLEITER.length, alleDa: Sticker.BEGLEITER.every(id => !!document.querySelector(`#seite .st[data-id="${id}"]`)) }));
    erwarte(al.fig === 7 && al.begleiter === 7 && al.alleDa, `${art}: Album „Inselbewohner“ zeigt alle sieben Begleiter als Zeichnung (${al.fig})`);
    erwarte(al.tier === 2, `${art}: Drache und Katze wie in „Mein Tier“ gezeichnet (${al.tier})`);
    await bild(p, `album-${art}`);
    const wahl = p.locator('[data-wahl="tilda"]');
    if (await wahl.count()) { await wahl.click(); await p.waitForTimeout(700); }
    erwarte(await p.evaluate(() => !!(Sticker.daten().hat || {}).tilda), `${art}: Sticker „Schildkröte Tilda“ echt ausgesucht`);
    await ctx.close();
  }

  // ---------- 3D: Kamerafahrt, Nacht, Regen, Figur ----------
  {
    const { ctx, p } = await kind(1180, 820);
    const oeffne = async (q) => { await p.goto(BASIS + "spiele/welt3d/heimat.html" + q, { waitUntil: "domcontentloaded", timeout: 60000 }); await p.waitForFunction(() => window.__heimat && __heimat.ich, null, { timeout: 60000 }); };
    // ohne ?fahrt=an keine Fahrt im automatischen Test
    await oeffne("?stunde=14"); await p.waitForTimeout(1500);
    erwarte(!(await p.evaluate(() => __heimat.kamerafahrt().laeuft)), "Insel: im Test ohne ?fahrt=an keine Kamerafahrt (alte Tests teleportieren sofort)");
    const f0 = await p.evaluate(() => __heimat.figurInfo());
    erwarte(f0.aermelArt === "kurz" && f0.aermel === 2 && f0.halsFrei > 0, `Figur trägt kurze Ärmel wie im Kleiderschrank (${f0.aermelArt}, Hals frei ${f0.halsFrei})`);
    // Nachts mit Fahrt: Anfang weit, Sterne und Mond im Bild, dann weich zur Startkamera
    await oeffne("?stunde=22&fahrt=an&fahrtdauer=6000");
    await p.waitForFunction(() => __heimat.kamerafahrt().anteil > 0, null, { timeout: 60000 });
    await p.evaluate(() => { if (window.__szene && __szene.aktuell()) __szene.abbrechen(); });
    const anfang = await p.evaluate(() => ({ f: __heimat.kamerafahrt(), h: __heimat.himmel() }));
    erwarte(anfang.f.laeuft && anfang.f.art === "einflug" && anfang.f.abstand > anfang.f.ziel + 8, `Kamerafahrt beginnt weit (${anfang.f.abstand} statt ${anfang.f.ziel})`);
    erwarte(anfang.h.sterneImBild >= 8 && anfang.h.mondImBild, `nachts Sterne (${anfang.h.sterneImBild} im Bild) und Mond am Himmel`);
    erwarte(anfang.h.schaum === "#7FA3DA", "nachts Schaum am Ufer bläulich");
    // Die Seite schreibt den Abstand je gezeichnetem Bild mit (Swiftshader zeichnet langsam, Abfragen von außen wären zu selten)
    await p.waitForFunction(() => !__heimat.kamerafahrt().laeuft, null, { timeout: 90000 });
    const ende = await p.evaluate(() => __heimat.kamerafahrt()), v = (ende.letzte || {}).verlauf || [];
    const faellt = v.every((w, i) => i === 0 || w <= v[i - 1] + 0.01);
    erwarte(ende.letzte && ende.letzte.ende === "fertig" && v.length >= 3 && faellt && v[0] > v[v.length - 1] + 8 && Math.abs(ende.abstand - ende.ziel) < 0.3,
      `Kamerafahrt fährt stetig heran und endet an der Startkamera (${v.length} Bilder, ${v[0]} → ${v[v.length - 1]} → ${ende.abstand})`);
    await bild(p, "insel-nacht-ende");
    // Antippen überspringt die Fahrt sofort
    await oeffne("?stunde=14&fahrt=an&fahrtdauer=15000");
    await p.waitForFunction(() => __heimat.kamerafahrt().anteil > 0, null, { timeout: 60000 });
    await p.evaluate(() => { if (window.__szene && __szene.aktuell()) __szene.abbrechen(); });
    erwarte(await p.evaluate(() => __heimat.kamerafahrt().laeuft), "Kamerafahrt läuft beim Betreten am Tag");
    await bild(p, "insel-tag-anfang");
    await p.mouse.click(900, 420);
    await p.waitForTimeout(400);
    const nach = await p.evaluate(() => __heimat.kamerafahrt());
    erwarte(!nach.laeuft && nach.letzte && nach.letzte.ende === "uebersprungen" && Math.abs(nach.abstand - nach.ziel) < 0.3, `Antippen überspringt die Fahrt sofort (${nach.abstand})`);
    erwarte(await p.evaluate(() => __heimat.himmel().sterne === 0), "tagsüber keine Sterne");
    // Regen: nasser Boden
    await oeffne("?stunde=14&wetter=regen"); await p.waitForTimeout(1200);
    erwarte(await p.evaluate(() => __heimat.himmel().nass), "bei Regen sind Gras, Wege und Steine dunkler (nass)");
    await p.evaluate(() => { if (window.__szene && __szene.aktuell()) __szene.abbrechen(); });
    await bild(p, "insel-regen");
    await ctx.close();
  }
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n  " + fehler.join("\n  ")); process.exit(1); }
  console.log("✅ Eine-Welt-Test bestanden (Stil A, Startseite, Fach-Blasen, Tafel, Mein Tier, Album, Kamerafahrt, Nachthimmel, Regen, Figur).");
})();
