// Playwright-Test (NA-26): Pixel-Insel (spiele/pixel/insel.html) – dieselbe Welt und Story wie „Rund“, gezeichnet mit PixiJS.
// Prüft: Prolog E1 (Tippen-Laufen, Haus, Aktionsknopf), Stationen und Nachbarn aus dem Kern, Antippen = hinlaufen und ansprechen,
// E2 „Erst lernen“ / „Sonne geht auf“ / E3 „Erste Frucht“ mit weichendem Nebel, Weihnachtspaket mit Tannenbaum im Zimmer,
// Zimmer betreten/verlassen, Zeichenaufrufe (Budget), Quer- und Hochformat.
// Aufruf: sh tests/laufen.sh pixelinsel   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;
const TAG1 = new Date(2026, 9, 25, 15, 0).getTime(), TAG2 = new Date(2026, 9, 26, 15, 0).getTime();

(async () => {
  const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };

  async function neuesKind(zeit, viewport = { width: 1180, height: 820 }) {
    const ctx = await browser.newContext({ viewport, hasTouch: true });
    await ctx.addInitScript((t) => { let x = null; try { x = localStorage.getItem("__testJetzt"); } catch (e) { /* egal */ } window.__jetzt = x ? +x : t; }, zeit);
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    await p.evaluate(() => { const m = Spielwelt.lade("medien") || {}; m.lektionen = { bedienung: 3 }; Spielwelt.speichere("medien", m); });
    return { ctx, p };
  }
  const szene = (p) => p.evaluate(() => window.__szene && __szene.aktuell());
  const warteSzene = (p, id) => p.waitForFunction((id) => window.__szene && __szene.aktuell() && __szene.aktuell().id === id, id, { timeout: 20000 });
  const durch = async (p) => { for (let i = 0; i < 6 && await szene(p); i++) { await p.click("#szene-weiter", { force: true }); await p.waitForTimeout(300); } };
  const blase = (p) => p.evaluate(() => ({ offen: !document.getElementById("blase").hidden, titel: document.getElementById("blase-titel").textContent, text: document.getElementById("blase-text").textContent, extra: !document.getElementById("blase-extra").hidden && document.getElementById("blase-extra").textContent, los: !document.getElementById("blase-los").hidden }));
  const zu = (p) => p.evaluate(() => { document.getElementById("blase").hidden = true; });

  // 1) Prolog in beiden Ausrichtungen
  for (const [b, h, lage] of [[1180, 820, "quer"], [820, 1180, "hoch"]]) {
    const { ctx, p } = await neuesKind(TAG1, { width: b, height: h });
    await p.goto(BASIS + "spiele/pixel/insel.html?stunde=14");
    await warteSzene(p, "prolog");
    let a = await szene(p);
    erwarte(a.nr === 0 && a.wer === "robo" && /Mira/.test(a.text), `Pixel: Prolog beginnt mit Robo Pixel (${lage})`);
    const start = await p.evaluate(() => ({ x: __pixel.ich.x, z: __pixel.ich.z, steg: __pixel.steg, z1: __pixel.zeichnungen(), skala: __pixel.skala() }));
    erwarte(Math.abs(start.x - start.steg.x) < 0.01 && start.z > start.steg.z0, `Kind startet am Steg (${lage})`);
    erwarte(start.skala >= 2 && Number.isInteger(start.skala), `ganzzahlige Vergrößerung ×${start.skala} (${lage})`);
    await p.waitForTimeout(3800);   // Kamerafahrt
    await bild(p, `pixel-prolog-1-${lage}`);
    await p.click("#szene-weiter", { force: true }); await p.waitForTimeout(400);
    a = await szene(p);
    erwarte(a.nr === 1 && a.wartet && a.zeigt && /Tippe/.test(a.text), `Blase 2: Hand zeigt auf die Wiese, Text zum Tippen (${lage})`);
    await bild(p, `pixel-prolog-2-${lage}`);
    // echtes Tippen auf die Wiese vor der Figur
    const pkt = await p.evaluate(() => __pixel.bildschirm(__pixel.ich.x, __pixel.ich.z - 3.2));
    await p.mouse.click(pkt.x, pkt.y);
    await p.waitForFunction(() => __szene.aktuell() && __szene.aktuell().nr === 2, null, { timeout: 8000 }).catch(() => {});
    a = await szene(p);
    erwarte(a && a.nr === 2 && a.zeigt, `nach dem Tippen läuft das Kind los, Blase 3 zeigt aufs Haus (${lage})`);
    // vor die Haustür stellen → Aktionsknopf „Reingehen“
    await p.evaluate(() => { const t = __pixel.tuer; __pixel.teleport(t.x, t.z); });
    await p.waitForFunction(() => __szene.aktuell() && __szene.aktuell().nr === 3, null, { timeout: 5000 }).catch(() => {});
    erwarte(await p.evaluate(() => __pixel.aktion === "Reingehen"), `vor der Tür zeigt der Aktionsknopf „Reingehen“ (${lage})`);
    await bild(p, `pixel-prolog-4-${lage}`);
    await p.click("#springen", { force: true }); await p.waitForTimeout(800);
    const nachher = await p.evaluate(() => ({ drinnen: __pixel.besuche === 1, szene: __szene.aktuell(), e1: Story.etappe("E1"), chronik: Story.chronik().map(x => x.s), imProlog: __pixel.imProlog }));
    erwarte(nachher.drinnen && (!nachher.szene || nachher.szene.id !== "prolog") && nachher.e1 && !nachher.imProlog && nachher.chronik.includes("prolog"), `Aktionsknopf führt ins Haus, Prolog fertig, E1 gesetzt (${lage})`);
    await bild(p, `pixel-zimmer-${lage}`);

    if (lage === "quer") {
      // 2) Zimmer: Schrank antippen, über die Tür unten rausgehen (mit Spielzeit – ohne schickt die Insel das Kind nach dem Prolog wieder hinaus)
      await p.evaluate(() => { for (let i = 0; i < 12; i++) Zeit.aufgabe(); if (!__pixel.drinnen) __pixel.reingehen(); }); await p.waitForTimeout(300);
      await p.evaluate(() => __pixel.tippe("schrank")); await p.waitForTimeout(200);
      let bl = await blase(p);
      erwarte(bl.offen && /Kleiderschrank/.test(bl.titel) && bl.los, "Zimmer: Schrank führt zum Kleiderschrank");
      await zu(p);
      await p.evaluate(() => { __pixel.laufeZu(0, 3.6); }); await p.waitForTimeout(1500);
      erwarte(await p.evaluate(() => !__pixel.drinnen), "Zimmer: unten durch die Tür geht es nach draußen");
      // 3) Stationen aus dem Kern: Wissensbaum, Sonnenuhr, Nachbarn; Robo bietet die Ankunft nochmal an
      await p.evaluate(() => { if (__szene.aktuell()) Szene.abbrechen(); });
      await p.evaluate(() => __pixel.tippe("wissensbaum")); bl = await blase(p);
      erwarte(bl.offen && /Wissensbaum/.test(bl.titel), "Wissensbaum antwortet (Text aus dem Kern)");
      await zu(p);
      const nb = await p.evaluate(() => __pixel.nachbarn());
      erwarte(["eule", "fipsi", "robo", "baer", "biber"].every(n => nb.includes(n)), `alle Nachbarn stehen auf der Insel (${nb.join(", ")})`);
      await p.evaluate(() => __pixel.tippe("nachbar-robo")); bl = await blase(p);
      erwarte(/Pixel/.test(bl.titel) && /nochmal/.test(bl.extra || ""), "Robo Pixel bietet „Wie ging das nochmal?“ an");
      await zu(p);
      await p.evaluate(() => __pixel.tippe("ballons")); bl = await blase(p);
      erwarte(/Schläft|gesperrt|Ballon/.test(bl.titel), `Spielort ohne Spielzeit/Führerschein antwortet wie bei „Rund“ (${bl.titel})`);
      await zu(p);
      // 4) Antippen eines Nachbarn auf dem Bildschirm: hinlaufen, dann ansprechen
      await p.evaluate(() => { const o = __pixel.orte().find(x => x.id === "nachbar-eule"); __pixel.teleport(o.x + 3.2, o.z + 0.4); });
      await p.waitForTimeout(400);
      const eule = await p.evaluate(() => { const o = __pixel.orte().find(x => x.id === "nachbar-eule"); return __pixel.bildschirm(o.x, o.z, 0.8); });
      await p.mouse.click(eule.x, eule.y); await p.waitForTimeout(2500);
      bl = await blase(p);
      erwarte(bl.offen && /Ella/.test(bl.titel), `Eule antippen: Kind läuft hin und Ella spricht (${bl.titel})`);
      await bild(p, "pixel-eule");
      await zu(p);
      const zeichen = await p.evaluate(() => __pixel.zeichnungen());
      erwarte(zeichen >= 1 && zeichen <= 4, `Zeichenaufrufe Pixel-Insel: ${zeichen} (Budget ≤ 4)`);
      // Pfeiltasten bewegen die Figur
      const vor = await p.evaluate(() => ({ x: __pixel.ich.x, z: __pixel.ich.z }));
      await p.keyboard.down("ArrowRight"); await p.waitForTimeout(700); await p.keyboard.up("ArrowRight");
      const nach = await p.evaluate(() => ({ x: __pixel.ich.x, z: __pixel.ich.z }));
      erwarte(nach.x > vor.x + 0.5, "Pfeiltasten bewegen die Figur");
    }
    await ctx.close();
  }

  // 5) Tutorial E2/E3 in Pixel: Sonnenuhr, Sonne geht auf, erste Frucht, Nebel weicht
  {
    const { ctx, p } = await neuesKind(TAG1);
    await p.evaluate(() => Story.etappeFertig("E1"));
    const INSEL = BASIS + "spiele/pixel/insel.html?stunde=14";
    await p.goto(INSEL); await warteSzene(p, "erst-lernen");
    let a = await szene(p);
    const n0 = await p.evaluate(() => __pixel.nebel());
    erwarte(a.zeigt && n0.stufe === 0 && n0.alpha > 0.5, `E2: Pixel zeigt auf die Sonnenuhr, Nebel dicht (Stufe ${n0.stufe})`);
    await bild(p, "pixel-e2");
    await durch(p);
    erwarte(await p.evaluate(() => Story.etappe("E2")), "E2 erledigt");
    await p.evaluate(() => { const s = __pixel.su; __pixel.teleport(s.x - 0.3, s.z - 1.2); }); await p.waitForTimeout(500);
    erwarte(await p.evaluate(() => __pixel.aktion === "Ansehen"), "an der Sonnenuhr zeigt der Aktionsknopf „Ansehen“");
    await p.evaluate(() => __pixel.druecke()); await p.waitForTimeout(200);
    erwarte(/Prozent/.test((await blase(p)).text), "Sonnenuhr erklärt den Fortschritt");
    await zu(p);
    await p.evaluate(() => { for (let i = 0; i < 12; i++) Zeit.aufgabe(); Lernfunde.merke({ fach: "mathe", art: "gemeistert", text: "7 + 8 = 15", schluessel: "t:7+8" }); });
    await p.goto(INSEL); await warteSzene(p, "sonne");
    erwarte(true, "mit Spielzeit: Szene „Die Sonne geht auf“");
    await durch(p);
    await p.evaluate((t) => localStorage.setItem("__testJetzt", String(t)), TAG2);
    await p.goto(INSEL); await warteSzene(p, "erste-frucht");
    a = await szene(p);
    erwarte(a.wer === "eule" && a.zeigt, "E3: Ella zeigt auf den Wissensbaum");
    await p.click("#szene-weiter", { force: true }); await p.waitForTimeout(300);
    await p.click("#szene-weiter", { force: true }); await p.waitForTimeout(3600);
    const n1 = await p.evaluate(() => ({ k: Story.kapitel(), n: __pixel.nebel() }));
    erwarte(n1.k === 1 && n1.n.stufe === 1, `Kapitel 1, Nebel weicht (Stufe ${n1.n.stufe})`);
    await bild(p, "pixel-e3");
    await durch(p);
    // Minispiel-Ort mit Spielzeit
    await p.evaluate(() => { const m = Spielwelt.lade("medien"); m.fuehrerschein = "2026-10-01"; Spielwelt.speichere("medien", m); });
    await p.goto(INSEL); await p.waitForTimeout(2000);
    await p.evaluate(() => { if (__szene.aktuell()) Szene.abbrechen(); __pixel.tippe("ballons"); });
    const bl = await blase(p);
    erwarte(/Ballon/.test(bl.titel) && bl.los, "mit Spielzeit und Führerschein führt die Ballon-Wiese zum Minispiel");
    await ctx.close();
  }

  // 6) Weihnachten: Paket am Steg öffnen, Tannenbaum steht im Pixel-Zimmer
  {
    const { ctx, p } = await neuesKind(new Date(2026, 11, 10, 15, 0).getTime());
    const INSEL = BASIS + "spiele/pixel/insel.html?stunde=14&monat=12";
    await p.goto(INSEL); await warteSzene(p, "prolog");
    const vorher = await p.evaluate(() => ({ paket: __pixel.paket, lichter: __pixel.lichter() }));
    erwarte(!!vorher.paket && vorher.lichter > 10, `Dezember: Paket am Steg und Lichterkette (${vorher.lichter} Lichter)`);
    await p.waitForTimeout(3600);
    await bild(p, "pixel-weihnachten");
    await p.click("#szene-weg"); await p.waitForTimeout(300);
    await warteSzene(p, "weihnachtspaket");
    erwarte(await p.evaluate(() => __szene.aktuell().zeigt), "Pixel zeigt auf das Paket");
    await p.click("#szene-weiter", { force: true }); await p.waitForTimeout(300);
    erwarte(await p.evaluate(() => __szene.aktuell().wartet), "Szene wartet, bis das Paket geöffnet ist");
    await p.evaluate(() => { const k = __pixel.paket; __pixel.teleport(k.x - 0.2, k.z - 1.0); }); await p.waitForTimeout(500);
    erwarte(await p.evaluate(() => __pixel.aktion === "Öffnen"), "am Paket zeigt der Aktionsknopf „Öffnen“");
    await p.evaluate(() => __pixel.druecke()); await p.waitForTimeout(800);
    const auf = await p.evaluate(() => ({ g: Story.hatGeschenk("weihnachten-2026"), steht: Object.values(__pixel.zimmerDaten().plaetze).includes("tannenbaum"), paket: __pixel.paket, szene: __szene.aktuell(), titel: document.getElementById("blase-titel").textContent }));
    erwarte(auf.g && auf.steht && !auf.paket && !auf.szene && /Weihnachtspaket/.test(auf.titel), "Paket geöffnet: Geschenk gemerkt, Tannenbaum im Zimmer, Szene fertig");
    await zu(p);
    await p.evaluate(() => __pixel.reingehen()); await p.waitForTimeout(600);
    erwarte(await p.evaluate(() => __pixel.moebel().includes("tannenbaum")), "der Tannenbaum steht im Pixel-Zimmer");
    await bild(p, "pixel-weihnachten-zimmer");
    await ctx.close();
  }

  // 7) Pixel-Zimmer (NA-28): Einrichten mit dem gemeinsamen Laden, Möbel, Wandfarbe, Pinnwand, Staffelei
  {
    const { ctx, p } = await neuesKind(TAG1);
    await p.evaluate(() => { Story.etappeFertig("E1"); Story.etappeFertig("E2"); for (let i = 0; i < 12; i++) Zeit.aufgabe(); Spielwelt.schalteFrei("moebel-lampe", 0); Spielwelt.schalteFrei("wand-mint", 0);
      Lernfunde.merke({ fach: "mathe", art: "gemeistert", text: "7 + 8 = 15", schluessel: "t:7+8" }); });
    await p.goto(BASIS + "spiele/pixel/insel.html?stunde=14&drinnen=1"); await p.waitForFunction(() => window.__pixel && __pixel.drinnen, null, { timeout: 20000 });
    await p.evaluate(() => { if (__szene.aktuell()) Szene.abbrechen(); });
    erwarte(await p.evaluate(() => !document.getElementById("einrichten").hidden), "im Zimmer gibt es den Knopf „Einrichten“");
    await p.click("#einrichten"); await p.waitForTimeout(300);
    await p.click('[data-moebel="lampe"]'); await p.waitForTimeout(300);
    erwarte(await p.evaluate(() => __pixel.ringe === 6), "Möbel gewählt: sechs Ringe zeigen die Plätze");
    await p.click('[data-platz="links"]'); await p.waitForTimeout(300);
    const m = await p.evaluate(() => ({ moebel: __pixel.moebel(), daten: __pixel.zimmerDaten().plaetze.links, ringe: __pixel.ringe }));
    erwarte(m.moebel.includes("lampe") && m.daten === "lampe" && m.ringe === 0, "Stehlampe steht an der linken Wand (gleiche Daten wie „Rund“)");
    await p.click('[data-wand="mint"]'); await p.waitForTimeout(300);
    erwarte(await p.evaluate(() => __pixel.zimmerDaten().wand === "mint"), "Wandfarbe Mint gestrichen");
    await bild(p, "pixel-zimmer-einrichten");
    await p.click("#laden-zu"); await p.waitForTimeout(200);
    for (const [id, re] of [["moebel-lampe", /Stehlampe/], ["pinnwand", /Pinnwand/], ["staffelei", /Staffelei/], ["spiegel", /Spiegel/]]) {
      await p.evaluate((id) => __pixel.tippe(id), id); const bl = await blase(p);
      erwarte(bl.offen && re.test(bl.titel), `Zimmer: ${id} antwortet (${bl.titel})`); await zu(p);
    }
    await bild(p, "pixel-zimmer-moebel");
    await ctx.close();
  }

  // 8) Figuren (NA-27): Kind trägt Frisur und Extras aus dem Kleiderschrank, das Tier läuft in vier Richtungen
  {
    const { ctx, p } = await neuesKind(TAG1);
    await p.evaluate(() => { Story.etappeFertig("E1"); Story.etappeFertig("E2");
      const a = Spielwelt.lade("anziehen") || {}; a.aktuell = Object.assign(Figur.STANDARD(), { haare: { id: "zoepfe", farbe: "#2E2240" }, extras: { krone: { farbe: "#FFC83D" }, brille: { farbe: "#E0574A" } } }); Spielwelt.speichere("anziehen", a);
      Spielwelt.speichere("tier", Object.assign({}, Spielwelt.lade("tier") || {}, { phase: "tier", art: "fuchs", farbe: 0, name: "Flocke", traegt: { schleife: true }, besitz: { schleife: true } })); });
    await p.goto(BASIS + "spiele/pixel/insel.html?stunde=14"); await p.waitForFunction(() => !!window.__pixel, null, { timeout: 20000 });
    await p.evaluate(() => { if (__szene.aktuell()) Szene.abbrechen(); });
    const f = await p.evaluate(() => __pixel.figur());
    erwarte(f.frisur === "zoepfe" && f.extras.krone && f.extras.brille && f.haar === "dunkel", `Figur aus dem Kleiderschrank: Zöpfe, Krone, Brille (${f.frisur}, Haar ${f.haar})`);
    erwarte(await p.evaluate(() => !!__pixel.tier), "das Haustier läuft mit");
    const richtungen = new Set();
    for (const [dx, dz] of [[0, 3], [0, -3], [3, 0], [-3, 0]]) {
      await p.evaluate(([dx, dz]) => { const i = __pixel.ich; __pixel.teleport(i.x + dx, i.z + dz); }, [dx, dz]); await p.waitForTimeout(500);
      richtungen.add(await p.evaluate(() => __pixel.tierRichtung));
    }
    erwarte(richtungen.has("vorn") && richtungen.has("hinten") && richtungen.has("seite"), `Tier zeigt vorn, hinten und Seite (${[...richtungen].join(", ")})`);
    await bild(p, "pixel-figuren");
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Pixel-Insel-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
