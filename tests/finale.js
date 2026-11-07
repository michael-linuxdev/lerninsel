// Test Story-Bogen mit Finale (07.11.2026, Paket 6) auf der runden Insel – echt durchgeklickt:
// - Brunis Station (Nebenszene ab Kapitel 2), Tilda stellt sich vor (ab Kapitel 3 nach E9) – Zeigehand zur Station bzw. zum Schachtisch
// - Kapitel 5 „Der Sturm“: Bruni hat Angst, das Kind atmet mit ihr; während der Szene Sturm (dunkler Himmel, Regen), danach wie vorher
// - Paulas Fest nach der ersten Bootsfahrt: Plakat an der Bühne
// - Kapitel 8 „Fipsis Schatz“: Truhe am Wegweiser, „Öffnen“ → Wörterbuch der Insel im Album mit den eigenen Wörtern (Kapitel der Schatzkarte + Lernkartei)
// - Kapitel 9 „Die Insel ist wach“: alle sieben Begleiter am Schachtisch sichtbar, der letzte Nebel geht; danach kein Ende-Bildschirm
// - danach Jahreszeiten-Episode (Herbst, Winter per __testJetzt) mit Sachthema-Angebot; die Chronik zeigt alle neuen Szenen
// Aufruf: sh tests/laufen.sh finale (allein laufen lassen, 3D)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;
const TAG = (m, d) => new Date(m < 12 ? 2026 : 2027, m < 12 ? m : m - 12, d, 15, 0).getTime();

(async () => {
  const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };
  const INSEL = BASIS + "spiele/welt3d/heimat.html?stunde=14";
  const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true, serviceWorkers: "block" });
  await ctx.addInitScript((t) => { let x = null; try { x = localStorage.getItem("__testJetzt"); } catch (e) { /* egal */ } window.__jetzt = x ? +x : t; window.__keinSparen = true; }, TAG(9, 20));
  const p = await ctx.newPage();
  p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
  p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
  await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
  await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
  await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.click("#e-ok"); await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString()));
  await p.evaluate(() => { const m = Spielwelt.lade("medien") || {}; m.lektionen = { bedienung: 3 }; Spielwelt.speichere("medien", m);
    Story.etappeFertig("E1"); ["E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9"].forEach(e => Story.etappeFertig(e, true));
    Story.merkeSzene("sonne"); Story.setzeKapitel(1); for (let i = 0; i < 12; i++) Zeit.aufgabe(); });
  const tag = (m, d) => p.evaluate((t) => { localStorage.setItem("__testJetzt", String(t)); }, TAG(m, d));
  const funde = (n) => p.evaluate((n) => { const d = Spielwelt.lade("lernfunde") || { tage: {} }; d.tage = d.tage || {}; d.summe = n; Spielwelt.speichere("lernfunde", d); }, n);
  const aktuell = () => p.evaluate(() => (window.__szene ? __szene.aktuell() : null));
  const weiter = async () => { await p.click("#szene-weiter", { force: true }); await p.waitForTimeout(450); };
  const bisEnde = async () => { for (let i = 0; i < 8 && await aktuell(); i++) await weiter(); };
  const warteSzene = (id) => p.waitForFunction((id) => window.__szene && __szene.aktuell() && __szene.aktuell().id === id, id, { timeout: 25000 })
    .catch(async (e) => { console.error("Szene fehlt: " + id, fehler.join(" / "), JSON.stringify(await p.evaluate(() => ({ jetzt: InselKern.naechsteStory({}), szene: __szene.aktuell(), st: Story.zustand(), heute: Spielwelt.heute() })))); throw e; });   // Hilfe bei der Fehlersuche
  const zeitFrei = () => p.evaluate(() => { for (let i = 0; i < 12; i++) Zeit.aufgabe(); });

  // ---------- Brunis Station (Kapitel 2) ----------
  await p.evaluate(() => Story.setzeKapitel(2));
  await p.goto(INSEL); await warteSzene("brunis-station");
  let a = await aktuell();
  erwarte(a.wer === "baer" && a.zeigt && a.anzahl === 3, "Kapitel 2: Bruni zeigt ihre Tierpflege-Station (3 Blasen, Zeigehand)");
  await weiter(); a = await aktuell(); erwarte(a && a.zeigt && /Wildtiere/.test(a.text), "zweite Blase zeigt zur Station");
  await bild(p, "finale-bruni");
  await bisEnde();
  erwarte(await p.evaluate(() => Story.chronik().some(x => x.s === "brunis-station") && !__szene.aktuell()), "Brunis Station in der Chronik");
  erwarte(await p.evaluate(() => InselKern.naechsteStory({})) === null, "am selben Tag keine zweite Nebenszene");

  // ---------- Tilda (Kapitel 3, nach E9) ----------
  await tag(9, 21); await p.evaluate(() => Story.setzeKapitel(3));
  await p.goto(INSEL); await zeitFrei(); await warteSzene("tilda");
  a = await aktuell();
  erwarte(a.wer === "tilda" && a.zeigt && /gründlich/.test(a.text), "Tilda stellt sich vor: „langsam – aber gründlich“, Zeigehand zum Schachtisch");
  await bild(p, "finale-tilda");
  await bisEnde();
  erwarte(await p.evaluate(() => Story.gesehen("tilda")), "Tilda-Szene gesehen");

  // ---------- Kapitel 5 „Der Sturm“ mit Wetter ----------
  await tag(9, 22); await p.evaluate(() => { Story.setzeKapitel(4); Spielwelt.speichere("sachkunde", { themen: { wetter: 2 } }); }); await funde(25);
  await p.goto(INSEL); await zeitFrei(); await warteSzene("der-sturm");
  a = await aktuell(); await p.waitForTimeout(400);
  let fx = await p.evaluate(() => __heimat.story());
  erwarte(a.wer === "eule" && fx.sturm && fx.regen && fx.himmel === "#7f92a6", `Sturm zieht auf: dunkler Himmel, Regen (${fx.himmel})`);
  await bild(p, "finale-sturm");
  await weiter(); a = await aktuell();
  erwarte(a.wer === "baer" && /Angst/.test(a.text) && /Ein – aus/.test(a.text), "Bruni hat ein bisschen Angst – das Kind atmet mit ihr („Ein – aus“)");
  await weiter(); a = await aktuell(); erwarte(a.wer === "baer" && /Danke/.test(a.text), "Bruni bedankt sich");
  await weiter(); a = await aktuell(); fx = await p.evaluate(() => __heimat.story());
  erwarte(a.wer === "eule" && /Aufräumen/.test(a.text) && !fx.sturm && !fx.regen && fx.himmel !== "#7f92a6", "Ella: „Der Sturm ist vorbei … danke“ – Himmel wieder wie vorher");
  await bisEnde();
  erwarte(await p.evaluate(() => Story.kapitel() === 5 && !__heimat.story().sturm), "Kapitel 5 erreicht, kein Sturm mehr");

  // ---------- Paulas Fest nach der ersten Bootsfahrt ----------
  await tag(9, 23); await p.evaluate(() => Spielwelt.speichere("rhythmus", { geschafft: {}, neu: {}, runden: 1 }));
  await p.goto(INSEL); await zeitFrei(); await warteSzene("paulas-feier");
  a = await aktuell(); erwarte(a.wer === "papagei" && a.zeigt, "nach der ersten Bootsfahrt: Paula feiert auf der Bühne");
  await weiter(); a = await aktuell();
  erwarte(/Plakat/.test(a.text) && /Atelier/.test(a.text) && await p.evaluate(() => __heimat.story().plakat), "Plakat an der Bühne (ohne eigenes Bild: Einladung zum Malen)");
  await bild(p, "finale-paula");
  await bisEnde();

  // ---------- Kapitel 8 „Fipsis Schatz“ ----------
  await tag(9, 24);
  await p.evaluate(() => { Story.setzeKapitel(7); Spielwelt.speichere("deutsch", { kapitel: { wald: 2, hof: 1, baeckerei: 3, strand: 1, schloss: 1 } });
    Spielwelt.speichere("lernkartei", { deutsch: [{ k: "wort|Apfel", s: { typ: "wort", wort: "Apfel" }, stufe: 1, faellig: "2099-01-01" }], sachkunde: [] }); });
  await p.goto(INSEL); await zeitFrei(); await warteSzene("fipsis-schatz");
  a = await aktuell(); erwarte(a.wer === "fipsi" && /komplett/.test(a.text), "Kapitel 8: Fipsi – die Schatzkarte ist komplett");
  erwarte(await p.evaluate(() => !__heimat.story().schatz), "vor Blase 2 keine Truhe");
  await weiter(); a = await aktuell();
  erwarte(a.zeigt && await p.evaluate(() => !!__heimat.story().schatz), "zweite Blase: Truhe am Wegweiser erscheint, Zeigehand zeigt hin");
  await bild(p, "finale-truhe");
  await bisEnde();
  erwarte(await p.evaluate(() => Story.kapitel() === 8), "Kapitel 8 erreicht");
  await p.evaluate(() => { const o = InselKern.erstelle(new URLSearchParams(location.search)).ORTE.schatz; __heimat.ich.position.set(o.x + 0.8, __heimat.ich.position.y, o.z + 0.6); });
  await p.waitForTimeout(900);
  const akt = await p.evaluate(() => __heimat.aktion);
  await p.evaluate(() => __heimat.druecke()); await p.waitForTimeout(400);
  const blase = await p.evaluate(() => ({ titel: document.getElementById("blase-titel").textContent, text: document.getElementById("blase").textContent }));
  erwarte(akt === "Öffnen" && /Fipsis Schatz/.test(blase.titel) && /Wörterbuch/.test(blase.text), `Truhe antippen: „${akt}“, Fipsi zeigt das Wörterbuch`);
  await p.click("#blase-los"); await p.waitForURL(/album\/#woerterbuch/); await p.waitForSelector(".wb-wort");
  const wb = await p.evaluate(() => ({ reiter: [...document.querySelectorAll("#reiter button")].map(b => b.textContent.trim()), woerter: [...document.querySelectorAll(".wb-wort")].map(b => b.textContent.trim()), gruppen: [...document.querySelectorAll(".wb-gruppe h3")].map(h => h.textContent) }));
  erwarte(wb.reiter.some(t => /Wörterbuch/.test(t)) && wb.woerter.some(t => /die\s*Eule/.test(t)) && wb.woerter.some(t => /Apfel/.test(t)),
    `Wörterbuch der Insel: eigene Wörter aus Schatzkarte und Lernkartei (${wb.woerter.length}: ${wb.woerter.slice(0, 6).join(" · ")} …)`);
  erwarte(wb.gruppen.join("") === [...wb.gruppen].sort().join(""), `nach Buchstaben sortiert (${wb.gruppen.join(" ")})`);
  await p.click(".wb-wort"); await p.waitForTimeout(200);
  erwarte(await p.evaluate(() => (Spielwelt.lade("woerterbuch") || {}).w.length > 5), "Wörter bleiben gespeichert (nichts geht verloren)");
  await bild(p, "finale-woerterbuch");
  await p.setViewportSize({ width: 820, height: 1180 }); await bild(p, "finale-woerterbuch-hoch"); await p.setViewportSize({ width: 1180, height: 820 });

  // ---------- Kapitel 9 = Finale „Die Insel ist wach“ ----------
  await tag(9, 25); await funde(70);
  await p.goto(INSEL); await zeitFrei(); await warteSzene("insel-wach");
  await p.waitForTimeout(700);
  a = await aktuell(); fx = await p.evaluate(() => __heimat.story());
  const punkte = await p.evaluate(() => __heimat.festPunkte()), tilda = await p.evaluate(() => Insel.ort("schach")());
  erwarte(a.wer === "robo" && fx.fest.length === 6 && punkte.every(x => x.sichtbar) && tilda && tilda.sichtbar,
    `Finale: alle sieben Begleiter am Schachtisch sichtbar (${fx.fest.join(", ")} + Tilda)`);
  erwarte(await p.evaluate(() => __heimat.nebel().band > 0), "der letzte Nebel liegt noch um die Insel");
  await bild(p, "finale-fest");
  await weiter(); await weiter();
  a = await aktuell(); erwarte(a.wer === "eule" && /Die Insel ist wach/.test(a.text), "Ella: „Die Insel ist wach – und sie wächst weiter mit dir.“");
  await p.waitForTimeout(4500);
  erwarte(await p.evaluate(() => __heimat.nebel().band === 0 && Story.kapitel() === 9), "der letzte Nebel ist sichtbar verschwunden, Kapitel 9 erreicht");
  await bild(p, "finale-nebelweg");
  await bisEnde();
  await p.waitForTimeout(500);
  erwarte(await p.evaluate(() => !__szene.aktuell() && !!document.querySelector("canvas") && Story.KAPITEL_ZAHL === 9 && InselKern.naechsteStory({}) === null), "danach geht es offen weiter: kein Ende-Bildschirm, die Insel bleibt, heute keine Episode mehr");

  // ---------- Jahreszeiten-Episoden ----------
  await tag(10, 3);
  await p.goto(INSEL); await zeitFrei(); await warteSzene("jz-herbst");
  a = await aktuell(); erwarte(a.wer === "eule" && /Herbst/.test(a.text) && a.zeigt, "Herbst nach dem Finale: Ella und die bunten Blätter");
  await bisEnde(); await p.waitForTimeout(600);
  const angebot = await p.evaluate(() => ({ titel: document.getElementById("blase-titel").textContent, los: !document.getElementById("blase-los").hidden }));
  erwarte(/Bäume/.test(angebot.titel) && angebot.los, `danach ein Sachthema als Angebot (${angebot.titel})`);
  await bild(p, "finale-herbst");
  await p.click("#blase-los"); await p.waitForURL(/sachkunde\/\?thema=baeume/); await p.waitForTimeout(800);
  erwarte(await p.evaluate(() => !!(__sachkunde.lauf && __sachkunde.lauf.t.id === "baeume")), "der Knopf öffnet das Thema „Bäume genau kennen“ direkt");
  await p.goto(INSEL); await p.waitForTimeout(3500);
  erwarte(!(await aktuell()), "im selben Herbst kommt die Episode nicht wieder");
  // Eigene Idee: Feste aus Herkunftsländern – am 2. Januar Neujahr mit Väterchen Frost
  await tag(12, 2);
  await p.goto(INSEL); await zeitFrei(); await warteSzene("fest-neujahr");
  a = await aktuell(); erwarte(a.wer === "baer" && /Neujahr/.test(a.text) && a.zeigt, "Fest-Episode: Neujahr in vielen Ländern (Bruni)");
  await weiter(); a = await aktuell(); erwarte(/Väterchen Frost/.test(a.text), "Väterchen Frost bringt die Geschenke");
  await bild(p, "finale-neujahr");
  await bisEnde();
  erwarte(await p.evaluate(() => Story.gesehen("fest-neujahr-2026") && InselKern.naechsteStory({}) === null), "Neujahr einmal im Jahr, danach heute nichts mehr");
  await tag(13, 10);   // Februar 2027
  await p.goto(INSEL); await zeitFrei(); await warteSzene("jz-winter");
  a = await aktuell(); erwarte(a.wer === "baer" && /Winter/.test(a.text), "Winter: Bruni und der Schnee");
  await bisEnde();

  // ---------- Chronik ----------
  await p.goto(BASIS + "spiele/album/#chronik"); await p.waitForTimeout(800);
  const chr = await p.evaluate(() => __album.eintraege().map(x => x.s));
  const neu = ["brunis-station", "tilda", "der-sturm", "paulas-feier", "fipsis-schatz", "insel-wach", "jz-herbst", "fest-neujahr", "jz-winter"];
  erwarte(neu.every(s => chr.includes(s)), `Inselchronik zeigt die neuen Szenen (${neu.filter(s => chr.includes(s)).length}/${neu.length})`);
  await p.click('[data-spiele="insel-wach"]'); await p.waitForTimeout(500);
  erwarte(await p.evaluate(() => __szene.aktuell() && __szene.aktuell().id === "insel-wach"), "das Finale lässt sich in der Chronik noch einmal ansehen");
  await bild(p, "finale-chronik");

  await browser.close();
  if (fehler.length) { console.error("❌ Fehler:\n" + fehler.join("\n")); process.exit(1); }
  console.log("✅ Story-Bogen mit Finale: Test bestanden.");
})().catch((e) => { console.error(e); process.exit(1); });
