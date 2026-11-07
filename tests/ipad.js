// Test iPad-Rückmeldung 02.11.2026 (fünf Meldungen des Auftraggebers, je mit Prüfung):
//  1. „Manchmal zweite Zeile nur für eine Kachel“ → Raster-Ausgleich in shared/core.js: auf keiner Kachel-Seite steht (quer/hoch) eine einzelne
//     Kachel in der letzten Zeile, wenn die Zeilen davor mindestens 3 Kacheln haben.
//  2. „Emoji über Text (Lichterfest)“ → Emoji-Bilder bleiben so groß wie ihr Platz im Text, auch wenn alte Seitenregeln (.gruppen .option svg) greifen.
//  3. „Einführung zeigt Hinweis zur Sonnenuhr immer wieder neu“ → Szene „Erst lernen“ gilt mit der letzten Blase als gesehen; wer dann die Insel
//     verlässt, bekommt sie nicht noch einmal (3D-Insel).
//  4. „Würfel überall einheitlich“ → ⚀–⚅ und 🎲 werden als derselbe Stil-A-Würfel gezeichnet wie in Mathe.
//  5. „Kein Einhorn im Tablet-Führerschein“ → Wisch-Übung ohne 🦄.
//  6. (03.11.) „Kreis, Dreieck, Viereck sind unterschiedlich farbig und groß“ → eigene Formzeichen \uE110–\uE113, eine Farbe, eine Größe.
// Aufruf: sh tests/laufen.sh ipad   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const fs = require("fs");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;
const KACHEL_SEITEN = ["", "spiele/mathe/", "spiele/deutsch/", "spiele/medien/", "spiele/sachkunde/", "spiele/sachkunde/?fach=kunst", "spiele/sachkunde/?fach=musik",
  "spiele/sachkunde/?fach=werken", "spiele/sachkunde/?fach=sport", "spiele/sachkunde/?fach=ethik", "spiele/englisch/", "spiele/ich/", "spiele/gefuehle/",
  "spiele/atelier/", "spiele/schach/", "spiele/eltern/", "spiele/album/", "spiele/vorschule/", "spiele/vorlesen/", "spiele/lesen/"];

(async () => {
  const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };
  const einrichten = async (ctx) => {
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.click("#e-ok"); await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    await p.evaluate(() => { const m = Spielwelt.lade("medien") || {}; m.lektionen = { bedienung: 3 }; Spielwelt.speichere("medien", m); });
    return p;
  };
  // Raster mit einzelner Kachel in der letzten Zeile (bei mindestens 3 Kacheln in der ersten Zeile)
  const einzelne = (p) => p.evaluate(() => {
    const out = [];
    document.querySelectorAll("*").forEach(el => {
      const cs = getComputedStyle(el);
      if (!/grid|flex/.test(cs.display) || (cs.display.includes("flex") && cs.flexWrap !== "wrap")) return;
      const k = [...el.children].filter(c => { const r = c.getBoundingClientRect(); return r.width > 30 && r.height > 30 && getComputedStyle(c).position !== "absolute"; });
      if (k.length < 3) return;
      const zeilen = {}; k.forEach(c => { const t = Math.round(c.getBoundingClientRect().top / 8); (zeilen[t] = zeilen[t] || []).push(c); });
      const z = Object.values(zeilen);
      if (z.length >= 2 && z[0].length >= 3 && z[z.length - 1].length === 1) out.push(`.${[...el.classList].join(".")} ${z.map(x => x.length).join("/")}`);
    });
    return out;
  });
  // Emoji-Bilder, die größer sind als ihr Platz (dann liegen sie über dem Text)
  const zuGross = (p) => p.evaluate(() => [...document.querySelectorAll(".emo > svg")].filter(s => s.getClientRects().length).filter(s => {
    const a = s.getBoundingClientRect(), b = s.parentElement.getBoundingClientRect();
    return a.width > b.width + 1 || a.height > b.height + 1;
  }).map(s => s.parentElement.textContent).slice(0, 5));

  // ---------- 1 und 2: alle Kachel-Seiten quer und hoch ----------
  for (const [w, h, lage] of [[1180, 820, "quer"], [820, 1180, "hoch"]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: true, serviceWorkers: "block" });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__elternAlle = true; });
    const p = await einrichten(ctx);
    const allein = [], gross = [];
    for (const s of KACHEL_SEITEN) {
      await p.goto(BASIS + s); await p.waitForTimeout(700);
      (await einzelne(p)).forEach(x => allein.push(`${s || "start"}: ${x}`));
      (await zuGross(p)).forEach(x => gross.push(`${s || "start"}: ${x}`));
    }
    erwarte(!allein.length, `${lage}: keine einzelne Kachel in der letzten Zeile auf ${KACHEL_SEITEN.length} Seiten${allein.length ? " – " + allein.join("; ") : ""}`);
    erwarte(!gross.length, `${lage}: kein Emoji-Bild größer als sein Platz${gross.length ? " – " + gross.join("; ") : ""}`);
    // Lichterfest: Zuordnen-Schritt in „Kinder der Welt“
    await p.goto(BASIS + "spiele/sachkunde/"); await p.waitForTimeout(700);
    await p.evaluate(() => { const i = __sachkunde.themen.findIndex(t => t.id === "kulturen"); __sachkunde.starte(i); __sachkunde.schritt(__sachkunde.lauf.t.schritte.findIndex(s => s.typ === "zuordnen")); });
    await p.waitForTimeout(400);
    const licht = await p.evaluate(() => { const k = document.querySelector('.gruppen [data-g="licht"]'), e = k.querySelector(".emo"), t = [...k.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
      const r = document.createRange(); r.selectNodeContents(t); const tr = r.getBoundingClientRect(), er = e.querySelector("svg").getBoundingClientRect();
      return { ueber: er.bottom > tr.top + 1 && er.top < tr.bottom && er.right > tr.left && er.left < tr.right, text: k.textContent.trim() }; });
    erwarte(!licht.ueber && /Lichterfeste/.test(licht.text), `${lage}: 🪔 steht über „Lichterfeste“, nicht darauf`);
    await bild(p, `ipad-lichterfest-${lage}`);
    // Ausgleich greift auch, wenn sich die Breite ändert (Drehen)
    if (lage === "quer") {
      await p.goto(BASIS + "spiele/sachkunde/"); await p.waitForTimeout(700);
      await p.setViewportSize({ width: 700, height: 1000 }); await p.waitForTimeout(400);
      const nachDrehen = await einzelne(p);
      erwarte(!nachDrehen.length, `nach dem Drehen/Verkleinern weiter ausgeglichen${nachDrehen.length ? " – " + nachDrehen.join("; ") : ""}`);
    }
    await ctx.close();
  }

  // ---------- 4 und 5: Würfel und Tablet-Führerschein ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true, serviceWorkers: "block" });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
    const p = await einrichten(ctx);
    await p.goto(BASIS + "spiele/vorschule/"); await p.waitForTimeout(700);
    await p.evaluate(() => __vorschule.starte("vs-zaehlen")); await p.waitForTimeout(400);
    const w = await p.evaluate(() => [...document.querySelectorAll(".emo")].filter(e => /[⚀-⚅]/u.test(e.textContent)).map(e => ({ t: e.textContent, kreise: e.querySelectorAll("svg circle").length, rand: !!e.querySelector('svg rect[stroke="#3B1F63"]') })));
    erwarte(w.length === 3 && w.every(x => x.rand && x.kreise === "⚀⚁⚂⚃⚄⚅".indexOf(x.t) + 1), `Vorschule: Würfel ⚀–⚅ als Stil-A-Würfel mit passenden Augen (${w.map(x => x.t + x.kreise).join(" ")})`);
    await bild(p, "ipad-wuerfel-vorschule");
    // 6. (Meldung 03.11.) Kreis, Dreieck, Viereck gleich gefärbt und gleich groß – nur die Form unterscheidet sich
    await p.evaluate(() => __vorschule.starte("vs-formen")); await p.waitForTimeout(400);
    const formen = await p.evaluate(() => [...document.querySelectorAll(".emo svg g[fill]")].filter(g => g.closest("button")).map(g => { const r = g.getBoundingClientRect(); return { fill: g.getAttribute("fill"), b: Math.round(r.width), h: Math.round(r.height) }; }));
    const gr = formen.map(f => Math.max(f.b, f.h));
    erwarte(formen.length === 3 && new Set(formen.map(f => f.fill)).size === 1 && Math.max(...gr) - Math.min(...gr) <= 8,
      `Vorschule: Kreis, Dreieck, Viereck in einer Farbe und gleich groß (${formen.map(f => f.fill + " " + f.b + "×" + f.h).join(", ")})`);
    await bild(p, "ipad-formen-vorschule");
    const vs = fs.readFileSync(__dirname + "/../spiele/vorschule/aufgaben.js", "utf8").split('id: "vs-formen"')[1].split('id: "vs-vergleichen"')[0];
    const k1 = fs.readFileSync(__dirname + "/../spiele/mathe/aufgaben.js", "utf8").split('id: "k1formen"')[1].split('id: "k1geld"')[0];
    erwarte(!/🔵|🔺|🟦|🟩|🟧|🔴/u.test(vs + k1) && /\\uE110/.test(vs) && /\\uE110/.test(k1), "Formen-Aufgaben (Vorschule, Matheweg Kl. 1) ohne bunte Form-Emojis");
    const ein = await p.evaluate(() => { const d = document.createElement("div"); d.textContent = "🎲"; document.body.appendChild(d); return new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => r(d.querySelectorAll(".emo svg circle").length)))); });
    erwarte(ein === 5, "🎲 ist derselbe Würfel (fünf Augen) statt des roten Noto-Würfels");
    await p.goto(BASIS + "spiele/mathe/"); await p.waitForTimeout(500);
    const mathe = await p.evaluate(() => { const st = "k1wuerfel"; for (let i = 0; i < 40; i++) { const a = Mathe.aufgabe(st, i + 1); if (a.bild) return a.bild; } return ""; });
    erwarte(/M8 94h112v2a24 24/.test(mathe) && /#3B1F63/.test(mathe), "Mathe-Würfelbilder nutzen dieselbe Zeichnung");
    const medien = fs.readFileSync(__dirname + "/../spiele/medien/medien.js", "utf8");
    erwarte(!medien.includes("🦄"), "Tablet-Führerschein: kein Einhorn mehr in der Wisch-Übung");
    await ctx.close();
  }

  // ---------- 3: Sonnenuhr-Hinweis nur einmal (3D-Insel) ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true, serviceWorkers: "block" });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
    const p = await einrichten(ctx);
    await p.evaluate(() => Story.etappeFertig("E1"));
    const INSEL = BASIS + "spiele/welt3d/heimat.html?stunde=14";
    await p.goto(INSEL);
    await p.waitForFunction(() => window.__szene && __szene.aktuell() && __szene.aktuell().id === "erst-lernen", null, { timeout: 20000 });
    // bis zur letzten Blase („Komm zu mir …“), dann – wie ein Kind – direkt die Seite verlassen, ohne „Los geht's!“
    for (let i = 0; i < 5; i++) { const a = await p.evaluate(() => __szene.aktuell()); if (!a || a.nr === a.anzahl - 1) break; await p.click("#szene-weiter", { force: true }); await p.waitForTimeout(250); }
    const letzte = await p.evaluate(() => { const a = __szene.aktuell(); return a && a.nr === a.anzahl - 1; });
    erwarte(letzte, "„Erst lernen“ bis zur letzten Blase");
    erwarte(await p.evaluate(() => Story.etappe("E2") && Story.gesehen("erst-lernen")), "mit der letzten Blase ist die Etappe E2 erledigt und die Szene gesehen");
    await p.goto(BASIS + "spiele/mathe/"); await p.waitForTimeout(400);
    await p.goto(INSEL); await p.waitForTimeout(4000);
    const wieder = await p.evaluate(() => window.__szene && __szene.aktuell());
    erwarte(!wieder || wieder.id !== "erst-lernen", `beim nächsten Besuch kommt der Sonnenuhr-Hinweis nicht noch einmal (${wieder ? wieder.id : "keine Szene"})`);
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ iPad-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
