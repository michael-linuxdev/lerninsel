// Test NA-60 „Altersgerechte Erfahrung“ (30.10.2026):
// - Vorlesen nur auf Knopfdruck: Vorschul-Spiel und Szene sprechen nicht von selbst; 🔊 / „Nochmal vorlesen“ liest vor; Eltern-Schalter „automatisch“ stellt das alte Verhalten her
// - Tagesaufgaben je Klasse (Vorschule, 1, 2, 3); ein Rucksack-Spiel echt durchgetippt erledigt die Vorschul-Aufgabe
// - Türen nach Klasse: Englisch erst ab Kl. 3 (oder mit Eltern-Wahl „ab Klasse 1“), Robo-Programmieren ab Kl. 3
// - „Heute für dich“ auf der Startseite führt zur nächsten offenen Tagesaufgabe
// - Matheweg: alle Stationen geschafft → Vorschlag für den nächsten Weg
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };
  async function kind(stufe) {
    const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true, serviceWorkers: "block" });
    await ctx.addInitScript(() => {
      window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__elternAlle = true; window.__testSchnell = true;
      // Gerätestimme nachbilden: zeichnet auf, was gesprochen würde (die echte Sprache.sprich mit der Knopfdruck-Regel läuft)
      window.__gesagt = [];
      const fake = { speaking: false, pending: false, paused: false, speak(u) { window.__gesagt.push(u.text); setTimeout(() => u.onend && u.onend(), 20); }, cancel() {}, resume() {}, getVoices() { return []; }, addEventListener() {} };
      Object.defineProperty(window, "speechSynthesis", { value: fake, configurable: true });
    });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", stufe); await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    await p.waitForTimeout(300);
    return { ctx, p };
  }
  const gesagt = (p) => p.evaluate(() => window.__gesagt.filter(t => String(t).trim()));   // " " = Freischalten der Stimme beim ersten Antippen (iPad), kein Vorlesen

  // ---------- Vorschule: eigene Startseite, Tagesaufgaben, Vorlesen nur auf Knopfdruck ----------
  {
    const { ctx, p } = await kind("vs");
    const a = await p.evaluate(() => Charakter.aufgaben().map(x => x.id));
    erwarte(a.join() === "rucksack,zahlen,laute", `Vorschule: Tagesaufgaben aus dem Rucksack (${a.join(", ")})`);
    const heute = await p.evaluate(() => document.getElementById("heute-fuer-dich").textContent);
    erwarte(/Vorschul-Rucksack/.test(heute), "„Heute für dich“: Vorschul-Rucksack");
    await bild(p, "alter-vorschule-start");
    await p.click("#heute-fuer-dich"); await p.waitForURL(/vorschule/); await p.waitForTimeout(400);
    await p.click('.kachel[data-id="vs-zaehlen"]'); await p.waitForTimeout(500);
    erwarte((await gesagt(p)).length === 0, "Vorschul-Spiel: nichts wird von selbst vorgelesen");
    await p.click("#nochmal"); await p.waitForTimeout(300);
    const g = await gesagt(p);
    erwarte(g.length === 1 && /\?/.test(g[0]), `🔊 „Nochmal vorlesen“: die Frage wird vorgelesen („${g[0] || ""}“)`);
    // das Spiel echt durchtippen (richtige Antwort = erste Option)
    for (let i = 0; i < 20; i++) {
      const s = await p.evaluate(() => { const l = __vorschule.lauf; return !document.getElementById("ende-ansicht").hidden ? null : l && l.schritte[l.pos]; });
      if (!s) break;
      if (s.typ === "ordnen") { for (let k = 0; k < s.teile.length; k++) await p.click(`#aufgabe .option[data-i="${k}"]`); }
      else await p.click(`#aufgabe .option >> nth=${await p.evaluate((t) => [...document.querySelectorAll("#aufgabe .option")].findIndex(b => b.textContent === t), s.optionen[0])}`);
      await p.waitForTimeout(150);
      await p.waitForFunction(() => !document.querySelector("#hinweis.gut") || !document.getElementById("ende-ansicht").hidden || true, null, { timeout: 2000 });
      await p.waitForTimeout(900);
    }
    erwarte(await p.evaluate(() => !document.getElementById("ende-ansicht").hidden && Charakter.aufgaben().find(x => x.id === "rucksack").erledigt), "Rucksack-Spiel echt durchgetippt: Tagesaufgabe erledigt");
    // Eltern: automatisch vorlesen
    await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(400);
    if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.waitForTimeout(500); }
    erwarte(await p.evaluate(() => !document.getElementById("vl-auto").checked), "Elternbereich: „Automatisch vorlesen“ ist aus");
    await p.check("#vl-auto"); await p.waitForTimeout(200);
    await p.goto(BASIS + "spiele/vorschule/"); await p.waitForTimeout(300);
    await p.evaluate(() => { window.__gesagt.length = 0; });
    await p.click('.kachel[data-id="vs-zaehlen"]'); await p.waitForTimeout(600);
    erwarte((await gesagt(p)).length >= 1, "mit „Automatisch vorlesen“: die Frage wird sofort vorgelesen (wie früher)");
    await ctx.close();
  }

  // ---------- Szene: 🔊 liest vor, sonst still ----------
  {
    const { ctx, p } = await kind("2");
    await p.evaluate(() => Story.merkeSzene("sonne"));
    await p.goto(BASIS + "spiele/album/#chronik"); await p.waitForTimeout(400);
    await p.click('[data-spiele="sonne"]'); await p.waitForTimeout(600);
    erwarte((await gesagt(p)).length === 0 && await p.evaluate(() => document.getElementById("szene-ton").getAttribute("aria-label") === "Vorlesen"), "Szene: nichts von selbst; Knopf 🔊 heißt „Vorlesen“");
    await p.click("#szene-ton"); await p.waitForTimeout(300);
    erwarte((await gesagt(p)).some(t => /Sonne/.test(t)), "🔊 in der Szene liest die Sprechblase vor");
    await ctx.close();
  }

  // ---------- Klassen 1–3: Tagesaufgaben, Türen, Robo ----------
  for (const [stufe, erwartet, englisch, robo] of [["1", ["laute", "zahlen"], false, false], ["2", ["training", "wort"], false, false], ["3", ["training", "wort", "englisch"], true, true]]) {
    const { ctx, p } = await kind(stufe);
    const a = await p.evaluate(() => Charakter.aufgaben().map(x => x.id));
    const tuer = await p.evaluate(() => !document.querySelector(".tuer.englisch").hidden);
    erwarte(erwartet.every((x, i) => a[i] === x) && tuer === englisch, `Klasse ${stufe}: Tagesaufgaben ${a.join(", ")}; Englisch-Tür ${englisch ? "da" : "nicht da"}`);
    await p.goto(BASIS + "spiele/medien/"); await p.waitForTimeout(400);
    erwarte(await p.evaluate(() => !document.getElementById("robo-zeile").hidden) === robo, `Klasse ${stufe}: Robo-Programmieren ${robo ? "sichtbar" : "erst ab Klasse 3"}`);
    if (stufe === "2") {
      await p.evaluate(() => { const e = Spielwelt.lade("eltern"); e.englisch = { ab: "1" }; Spielwelt.speichere("eltern", e); });
      await p.goto(BASIS); await p.waitForTimeout(300);
      erwarte(await p.evaluate(() => !document.querySelector(".tuer.englisch").hidden), "Klasse 2 mit Eltern-Wahl „Englisch ab Klasse 1“: Englisch-Tür da");
      await bild(p, "alter-kl2-start");
      await p.click("#heute-fuer-dich"); await p.waitForURL(/mathe/);
      erwarte(/training=1/.test(p.url()), "„Heute für dich“ führt zum Mathe-Training");
      // alle Stationen des Kl.-2-Weges geschafft → Vorschlag für Klasse 3
      await p.evaluate(() => { const m = Spielwelt.lade("mathe") || {}; m.k2 = {}; Mathe.STATIONEN.forEach(s => { m.k2[s.id] = 3; }); m.weg = "k2"; Spielwelt.speichere("mathe", m); });
      await p.goto(BASIS + "spiele/mathe/"); await p.waitForTimeout(500);
      erwarte(await p.evaluate(() => !document.getElementById("weiter-klasse").hidden), "Matheweg Kl. 2 komplett: Vorschlag „Weiter: 3. Klasse“");
      await p.click("#weiter-klasse-los"); await p.waitForTimeout(300);
      erwarte(await p.evaluate(() => /3\. Klasse/.test(document.querySelector(".weg-wahl.an").textContent)), "Antippen öffnet den Matheweg Klasse 3");
    }
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Altersgerecht-Test (NA-60) bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
