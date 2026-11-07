// Playwright-Test (07.11.2026): Bennos Brücke (Kapitel 9) – echt durchgeklickt.
// Seite: zu bis Kapitel 9; Kl. 2 eine ganze Runde über Bretter/Tasten gebaut (ein Fehler mit Hinweis, zwei Fehler mit Lösungshilfe), der Bauplan wächst
// je Schritt, Stück gemerkt, +1 ⭐; drei weitere Runden: höchstens 3 ⭐ am Tag, das vierte Stück steht trotzdem; Elternbereich zeigt den Stand;
// je eine Runde für Vorschule (hoch), Kl. 1, Kl. 3 (hoch, Russisch) und Kl. 4 (Handy) über die Knöpfe – keine Querscrollleiste, Knöpfe ≥ 40 px.
// 3D (allein laufen lassen): Kapitel 9 fällig nach 55 Lernfunden und 5 Stationen, Szene mit Zeigehand auf Sandbank und Baustelle, Baustelle offen
// („🌉 Bauen“) führt zur Seite; die 3D-Brücke wächst mit den Stücken; unfertig: am letzten Brett ist Schluss; fertig: Abschluss-Szene und
// über die Brücke auf die Sandbank laufen (Antippen des Ziels); eigene Welt: Brücke auch dort.
// Aufruf: sh tests/laufen.sh bruecke   (Screenshots mit BILDER=<ordner>)
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
  async function kind(stufe, breite = 1180, hoehe = 820, { russisch = false } = {}) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true, serviceWorkers: "block" });
    await ctx.addInitScript(() => { let x = null; try { x = localStorage.getItem("__testJetzt"); } catch (e) { /* egal */ } window.__jetzt = x ? +x : new Date(2026, 9, 25, 15, 0).getTime(); window.__testSchnell = true; window.__keinSparen = true; });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`Seitenfehler: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`Konsole: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok"); await p.waitForSelector("#e-name");
    await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", stufe);
    if (russisch) { await p.selectOption("#e-sprache", "ru"); if (await p.$("#e-dosis")) await p.selectOption("#e-dosis", "immer"); }
    await p.click("#e-ok"); await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString())); await p.waitForTimeout(300);
    return { ctx, p };
  }
  const seite = async (p) => { await p.goto(BASIS + "spiele/bruecke/"); await p.waitForLoadState("load"); await p.waitForTimeout(300); };
  const sterne = (p) => p.evaluate(() => Spielwelt.sterne());
  const klicke = async (p, sel) => { for (const s of sel) { await p.click(`#eingabe ${s}, #aufgabe ${s}`); await p.waitForTimeout(40); } };
  const art = (p) => p.evaluate(() => __bruecke.aufgabe && __bruecke.aufgabe.art);
  const teileImPlan = (p) => p.evaluate(() => { const g = document.querySelector("#plan .im-bau"); return g ? +g.dataset.teile : 0; });
  // einen Bauschritt echt lösen (optional vorher falsch klicken)
  async function schritt(p, fehlversuche = 0) {
    const pos = await p.evaluate(() => __bruecke.lauf.pos), runde = await p.evaluate(() => __bruecke.daten().runden);
    for (let i = 0; i < fehlversuche; i++) await klicke(p, await p.evaluate(() => __bruecke.falsch()));
    const h = fehlversuche ? await p.evaluate(() => ({ t: document.getElementById("hinweis").textContent, l: document.getElementById("hinweis").classList.contains("loesung"), m: !!document.querySelector("#aufgabe .markiert") })) : null;
    await klicke(p, await p.evaluate(() => __bruecke.loesung()));
    await p.waitForFunction(([pos, runde]) => __bruecke.daten().runden > runde || (__bruecke.lauf.pos > pos && !__bruecke.aufgabe.fertig), [pos, runde], { timeout: 6000 });
    return h;
  }
  async function runde(p, fehler1 = 0, fehler2 = 0) {
    const h = [];
    h.push(await schritt(p, fehler1)); h.push(await schritt(p, fehler2)); await schritt(p); await schritt(p);
    await p.waitForSelector("#ende");
    return h;
  }

  // ---------- Seite, Klasse 2 ----------
  { const { ctx, p } = await kind("2");
    await seite(p);
    erwarte(await p.isVisible("#zu") && !(await p.isVisible("#aufgabe")), "vor Kapitel 9 ist der Bauplatz zu");
    await p.evaluate(() => Story.setzeKapitel(9)); await seite(p);
    erwarte(await p.evaluate(() => __bruecke.stufe() === "b" && __bruecke.lauf.liste.map(a => a.art).join() === "wahl,legen,zahl,legen"), "Kapitel 9: Kl. 2 = Stufe b (cm/m, Bretter legen, Sachaufgabe, Bretter legen)");
    erwarte(await p.isVisible("#plan svg.bauplan") && (await teileImPlan(p)) === 0 && await p.isVisible("#frage-vorlesen") && await p.isVisible("#benno-vorlesen"), "Bauplan mit leerem Stück, 🔊 für Benno und die Aufgabe");
    await bild(p, "bruecke-k2-start");
    const s0 = await sterne(p);
    // Schritt 1 mit einem Fehler: freundlicher Hinweis
    const h1 = await schritt(p, 1);
    erwarte(h1 && /^Fast!/.test(h1.t) && !h1.l, `ein Fehler: freundlicher Hinweis („${h1 && h1.t.slice(0, 50)}…“)`);
    erwarte((await teileImPlan(p)) === 1, "Schritt 1 geschafft: Pfeiler stehen im Bauplan");
    // Schritt 2 (Bretter legen) mit zwei Fehlern: Lösungshilfe zeigt das passende Brett
    erwarte((await art(p)) === "legen" && await p.isVisible(".luecke") && await p.isVisible("[data-stk='30']"), "Bretter-Lücke mit Maßband und Brett-Knöpfen (10, 20, 30, 50 cm)");
    await bild(p, "bruecke-k2-legen");
    const h2 = await schritt(p, 2);
    erwarte(h2 && h2.l && h2.m && /Benno zeigt/.test(h2.t), "zwei Fehler (Brett ragt über): Benno zeigt die Lösung, das passende Brett blinkt");
    erwarte((await teileImPlan(p)) === 2, "Schritt 2: Balken im Bauplan");
    await schritt(p); await schritt(p);
    await p.waitForSelector("#ende");
    const d1 = await p.evaluate(() => Spielwelt.lade("bruecke"));
    erwarte(d1.abschnitte === 1 && d1.runden === 1 && d1.fehlerfrei === 0 && (await sterne(p)) === s0 + 1 && /Stück 1 von 8/.test(await p.textContent("#ende")), "Runde fertig: Stück 1 von 8 gebaut, +1 ⭐, gemerkt");
    erwarte(await p.evaluate(() => document.querySelectorAll("#plan .stueck.fertig").length === 1), "im Bauplan steht ein fertiges Stück");
    erwarte(await p.evaluate(() => (Spielwelt.lade("lernfunde") || {}).summe > 0 || Lernfunde.gesamt() > 0), "neues Brückenstück = Lernfund");
    await bild(p, "bruecke-k2-ende");
    // drei weitere Runden ohne Fehler: Sterne-Deckel 3 am Tag, das vierte Stück steht trotzdem
    for (let i = 0; i < 3; i++) { await p.click("#nochmal"); await p.waitForTimeout(100); await runde(p); }
    const d4 = await p.evaluate(() => Spielwelt.lade("bruecke"));
    erwarte(d4.abschnitte === 4 && d4.fehlerfrei === 3 && (await sterne(p)) === s0 + 3 && /schon 3/.test(await p.textContent("#ende")), "vier Stücke an einem Tag: nur 3 ⭐ (vorhersehbar), das vierte Stück steht trotzdem");
    erwarte(await p.evaluate(() => { const a = __bruecke.aufgabenFuer("b", 123), b = __bruecke.aufgabenFuer("b", 123); return JSON.stringify(a) === JSON.stringify(b) && JSON.stringify(__bruecke.aufgabenFuer("b", 124)) !== JSON.stringify(a); }), "Aufgaben aus festem Zufall: gleiche Saat = gleiche Runde, nächste Runde anders");
    // nächster Tag: wieder ein Stern
    await p.evaluate(() => localStorage.setItem("__testJetzt", String(new Date(2026, 9, 26, 15, 0).getTime()))); await seite(p);
    const s4 = await sterne(p); await runde(p);
    erwarte((await sterne(p)) === s4 + 1 && (await p.evaluate(() => Spielwelt.lade("bruecke").abschnitte)) === 5, "am nächsten Tag: Stück 5, wieder +1 ⭐");
    // fertig bauen (Daten), dann weiter messen ohne Sterne
    await p.evaluate(() => { const d = Spielwelt.lade("bruecke"); d.abschnitte = 8; d.neu = {}; Spielwelt.speichere("bruecke", d); }); await seite(p);
    const s8 = await sterne(p); await runde(p);
    erwarte((await sterne(p)) === s8 && (await p.evaluate(() => Spielwelt.lade("bruecke").abschnitte)) === 8 && /nachgemessen/.test(await p.textContent("#ende")) && await p.evaluate(() => document.querySelectorAll("#plan .stueck.fertig").length === 8),
      "Brücke fertig: weiter messen geht, ohne Sterne; der Bauplan zeigt alle 8 Stücke");
    // Elternbereich
    await p.evaluate(() => { window.__elternAlle = true; }); await p.goto(BASIS + "spiele/eltern/"); if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); }
    await p.waitForTimeout(600);
    await p.click('.eltern-reiter [data-teil="lernstand"]').catch(() => {}); await p.waitForTimeout(400);
    const el = await p.evaluate(() => (document.getElementById("eltern-bruecke") || {}).textContent || "");
    erwarte(/8 von 8 Brückenstücken/.test(el), `Elternbereich: ${el.trim().slice(0, 80)}`);
    await ctx.close(); }

  // ---------- Vorschule hoch, Kl. 1, Kl. 3 hoch mit Russisch, Kl. 4 Handy ----------
  for (const [stufe, breite, hoehe, name, buchstabe, arten, ru] of [
    ["vs", 820, 1180, "Vorschule hoch", "a", "wahl,ordnen,zahl,ordnen", false], ["1", 1180, 820, "Kl. 1 quer", "a", "wahl,ordnen,zahl,ordnen", false],
    ["3", 820, 1180, "Kl. 3 hoch, Russisch", "c", "zahl,zahl,pfeiler,zahl", true], ["4", 390, 760, "Kl. 4 Handy", "d", "zahl,zahl,plan,wahl", false]]) {
    const { ctx, p } = await kind(stufe, breite, hoehe, { russisch: ru });
    await p.evaluate(() => Story.setzeKapitel(9)); await seite(p);
    const st = await p.evaluate(() => ({ s: __bruecke.stufe(), a: __bruecke.lauf.liste.map(x => x.art).join() }));
    erwarte(st.s === buchstabe && st.a === arten, `${name}: Stufe ${st.s} (${st.a})`);
    const durch = async (n) => { for (let i = 0; i < n; i++) {
      const a = await p.evaluate(() => __bruecke.aufgabe.art);
      const m = await p.evaluate(() => ({ w: document.documentElement.scrollWidth, iw: innerWidth, k: Math.min(...[...document.querySelectorAll("#eingabe button")].filter(b => b.offsetParent).map(b => Math.min(b.getBoundingClientRect().width, b.getBoundingClientRect().height))) }));
      erwarte(m.w <= m.iw + 1 && m.k >= 40, `${name}, Schritt ${i + 1} (${a}): keine Querscrollleiste, Knöpfe ≥ 40 px (${Math.round(m.k)})`);
      if (i === 1 || (a === "pfeiler" || a === "plan" || a === "ordnen")) await bild(p, `bruecke-${name.replace(/[ .,]+/g, "-")}-${i + 1}`);
      await schritt(p, i === 2 ? 1 : 0);
    } };
    if (ru) erwarte(await p.evaluate(() => !!document.querySelector("#frage .ru") && /[а-я]/.test(document.querySelector("#frage .ru").textContent) && !!document.querySelector("#benno-text .ru")), `${name}: russische Hilfe unter Aufgabe und Benno`);
    await durch(4);
    await p.waitForSelector("#ende");
    erwarte((await p.evaluate(() => Spielwelt.lade("bruecke").abschnitte)) === 1, `${name}: Runde echt bis zum Ende, Stück 1 gebaut`);
    if (stufe === "4") {   // Stufe d: Maßstab, km/m, Plan zeichnen, Tragkraft – Aufgaben prüfen
      const ok = await p.evaluate(() => { const l = __bruecke.aufgabenFuer("d", 77); return l[0].antwort === l[0].zellen * l[0].je && l[2].antwort >= 2 && l[2].antwort <= 7 && l[3].optionen.filter(o => o.ok).length <= 1; });
      erwarte(ok, "Stufe d: Maßstab-Rechnung stimmt, Plan passt aufs Raster");
    }
    await ctx.close();
  }

  // ---------- 3D-Insel ----------
  { const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true, serviceWorkers: "block" });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__keinSparen = true; });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`Insel: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`Insel-Konsole: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok"); await p.waitForSelector("#e-name");
    await p.fill("#e-name", "Mira"); await p.click("#e-ok"); await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    await p.evaluate(() => { Spielwelt.speichere("medien", { lektionen: { bedienung: 3 } });
      Story.etappeFertig("E1"); ["E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9"].forEach(e => Story.etappeFertig(e, true));
      ["sonne", "brunis-station", "tilda", "paulas-feier"].forEach(s => Story.merkeSzene(s, true)); Story.setzeKapitel(8);
      const d = Spielwelt.lade("lernfunde") || { tage: {} }; d.summe = 56; Spielwelt.speichere("lernfunde", d);
      Spielwelt.speichere("mathe", { k2: { zahlen100: 1, plus100: 1, minus100: 1, einmaleins2: 1, laenge: 1 } }); for (let i = 0; i < 12; i++) Zeit.aufgabe(); });
    const INSEL = BASIS + "spiele/welt3d/heimat.html?stunde=14";
    const aktuell = () => p.evaluate(() => (window.__szene ? __szene.aktuell() : null));
    const weiter = async () => { await p.click("#szene-weiter", { force: true }); await p.waitForTimeout(450); };
    const warteSzene = (id) => p.waitForFunction((id) => window.__szene && __szene.aktuell() && __szene.aktuell().id === id, id, { timeout: 25000 });
    await p.goto(INSEL); await p.waitForFunction(() => window.__heimat && __heimat.bruecke, null, { timeout: 30000 });
    let b = await p.evaluate(() => __heimat.bruecke());
    erwarte(b.n === 0 && !b.offen && b.schloss && b.aktion[1] === "Ansehen", "vor Kapitel 9: Baustelle mit Schloss, noch keine Brücke");
    await warteSzene("bennos-bruecke");
    let a = await aktuell(); const z0 = await p.evaluate(() => Insel.ort("sandbank")());
    erwarte(a.wer === "biber" && /Sandbank/.test(a.text) && z0 && z0.sichtbar, `Kapitel 9 fällig (55 Lernfunde, 5 Stationen): die Figur steht an der Baustelle, Benno zeigt die Sandbank ${JSON.stringify(z0)}`);
    await bild(p, "bruecke-3d-szene");
    await weiter();
    b = await p.evaluate(() => __heimat.bruecke());
    erwarte(b.offen && !b.schloss && b.aktion[1] === "Bauen" && (await p.evaluate(() => Story.kapitel())) === 9, "Blase 2: Kapitel 9 gemerkt, Baustelle offen („🌉 Bauen“), Zeigehand auf der Baustelle");
    for (let i = 0; i < 6 && await aktuell(); i++) await weiter();
    await p.waitForTimeout(300);
    erwarte(await p.evaluate(() => Story.chronik().some(x => x.s === "bennos-bruecke")), "Szene in der Inselchronik");
    // Baustelle antippen → Seite
    await p.evaluate(() => __heimat.brueckeTippen()); await p.waitForTimeout(300);
    const bl = await p.evaluate(() => ({ t: document.getElementById("blase-titel").textContent, los: !document.getElementById("blase-los").hidden }));
    erwarte(/Bennos Brücke/.test(bl.t) && bl.los, "Baustelle antippen: Benno lädt zum Bauen ein");
    await p.click("#blase-los"); await p.waitForURL(/bruecke\//); await p.waitForSelector("#aufgabe");
    erwarte(true, "Knopf führt zum Bauplatz");
    // Brücke wächst: 3 Stücke gebaut → 3D
    await p.evaluate(() => Spielwelt.speichere("bruecke", { abschnitte: 3, neu: {}, runden: 3, fehlerfrei: 0 }));
    await p.goto(INSEL); await p.waitForFunction(() => window.__heimat && __heimat.bruecke, null, { timeout: 30000 }); await p.waitForTimeout(800);
    b = await p.evaluate(() => __heimat.bruecke());
    erwarte(b.n === 3 && b.boden === 1 && b.dreiecke > 100, `3 Stücke gebaut: die 3D-Brücke reicht ${b.laenge.toFixed(1)} weit hinaus (${b.dreiecke} Dreiecke)`);
    const g = await p.evaluate(() => [1, 5, 8].map(n => { __heimat.baueBruecke(n); const x = __heimat.bruecke(); return [x.laenge, x.dreiecke]; }));
    erwarte(g[0][0] < g[1][0] && g[1][0] < g[2][0] && g[0][1] < g[2][1] && g[2][1] < 8000, `Brücke wächst Stück für Stück (Länge ${g.map(x => x[0].toFixed(1)).join(" → ")}, höchstens ${g[2][1]} Dreiecke)`);
    await p.evaluate(() => __heimat.baueBruecke(3));
    // unfertig: auf die Brücke ja, über das letzte Brett hinaus nein
    await p.evaluate(() => { const b = __heimat.bruecke(); __heimat.ich.position.set(b.mitte.x, 0.3, b.mitte.z); });
    await p.waitForTimeout(500);
    b = await p.evaluate(() => __heimat.bruecke());
    erwarte(b.ich.auf === "bruecke" && Math.abs(b.ich.y - 0.36) < 0.05, `Figur steht auf der Brücke (Höhe ${b.ich.y.toFixed(2)})`);
    await p.evaluate(() => { const b = __heimat.bruecke(); __heimat.laufeZu(b.sand.x, b.sand.z); }); await p.waitForTimeout(6000);
    b = await p.evaluate(() => __heimat.bruecke());
    erwarte(Math.hypot(b.ich.x - b.sand.x, b.ich.z - b.sand.z) > b.sand.r && Math.hypot(b.ich.x - b.ende.x, b.ich.z - b.ende.z) < 0.8 && b.ich.auf === "bruecke", `unfertig: zur Sandbank geschickt – Halt am letzten Brett (Abstand zum Ende ${Math.hypot(b.ich.x - b.ende.x, b.ich.z - b.ende.z).toFixed(2)})`);
    await p.evaluate(() => __heimat.blick(0.4, 0.75, 22)); await p.waitForTimeout(300); await bild(p, "bruecke-3d-halb");
    // fertig: Abschluss-Szene, dann zu Fuß hinüber auf die Sandbank
    await p.evaluate(() => { Spielwelt.speichere("bruecke", { abschnitte: 8, neu: {}, runden: 8, fehlerfrei: 2 }); localStorage.setItem("__testJetzt", String(new Date(2026, 9, 26, 15, 0).getTime())); });
    await ctx.addInitScript(() => { let x = null; try { x = localStorage.getItem("__testJetzt"); } catch (e) { /* egal */ } if (x) window.__jetzt = +x; });
    await p.goto(INSEL); await p.evaluate(() => { for (let i = 0; i < 12; i++) Zeit.aufgabe(); });
    await warteSzene("bruecke-fertig");
    a = await aktuell(); erwarte(a.wer === "biber" && /Geschafft/.test(a.text), "Brücke fertig: Abschluss-Szene mit Benno");
    for (let i = 0; i < 6 && await aktuell(); i++) await weiter();
    b = await p.evaluate(() => __heimat.bruecke());
    erwarte(b.n === 8 && b.boden === 2, "fertige Brücke mit begehbarer Sandbank");
    // vom Brückenkopf aus losgeschickt: die Figur läuft über die Brücke bis auf die Sandbank
    await p.evaluate(() => { const b = __heimat.bruecke(); __heimat.ich.position.set(b.kopf.x, 0.3, b.kopf.z); __heimat.laufeZu(b.sand.x, b.sand.z); });
    await p.waitForFunction(() => { const b = __heimat.bruecke(); return Math.hypot(b.ich.x - b.sand.x, b.ich.z - b.sand.z) < 1.2; }, null, { timeout: 30000 }).catch(() => {});
    b = await p.evaluate(() => __heimat.bruecke());
    erwarte(b.ich.auf === "sandbank" && Math.abs(b.ich.y - 0.24) < 0.05, `über die Brücke auf die Sandbank gelaufen (Abstand ${Math.hypot(b.ich.x - b.sand.x, b.ich.z - b.sand.z).toFixed(2)})`);
    await p.evaluate(() => __heimat.sandbankTippen()); await p.waitForTimeout(300);
    erwarte(/ganze Insel/.test(await p.textContent("#blase")), "Sandbank antippen: Benno freut sich über die Aussicht");
    await p.evaluate(() => __heimat.blick(0.4, 0.75, 24)); await p.waitForTimeout(300); await bild(p, "bruecke-3d-fertig");
    // eigene Welt: auch dort steht die Brücke
    await p.goto(INSEL + "&biom=wald&groesse=gross&see=1&seed=5"); await p.waitForFunction(() => window.__heimat && __heimat.bruecke, null, { timeout: 30000 });
    b = await p.evaluate(() => __heimat.bruecke());
    erwarte(b.n === 8 && Math.hypot(b.sand.x, b.sand.z) > 25, "eigene Welt (Wald, groß): die Brücke führt auch dort hinaus zur Sandbank");
    await ctx.close(); }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Brücken-Test bestanden.");
})();
