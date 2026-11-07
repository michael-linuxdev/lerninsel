// Playwright-Test (01.11.2026): eigene Bilder statt Emojis – der Baustein ersetzt bekannte Emojis durch die eigenen Bilder (Stil A),
// der Text bleibt unsichtbar erhalten (textContent), Eingabefelder bleiben unberührt, neue Inhalte werden nachträglich ersetzt,
// Eltern-Wahl „Emojis des Geräts“ (eltern.bilder = "geraet") schaltet den Ersatz ab.
// Aufruf: sh tests/laufen.sh bilder   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource|open-meteo/;
process.on("unhandledRejection", (e) => { console.log("❌ Abbruch: " + e.message + "\n  " + (global.__fehler || []).join("\n  ")); process.exit(1); });
(async () => {
  const browser = await chromium.launch();
  const fehler = global.__fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true });
  await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
  const p = await ctx.newPage();
  p.on("pageerror", e => fehler.push(`Seitenfehler: ${e.message}`));
  p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`Konsole: ${m.text()}`); });
  await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
  await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok"); await p.waitForSelector("#e-name");
  await p.fill("#e-name", "Mira ⭐"); await p.click("#e-ok"); await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString())); await p.waitForTimeout(800);
  // Startseite: Stern-Knopf zeigt das eigene Bild, Text enthält weiter ⭐
  const s = await p.evaluate(() => ({ n: document.querySelectorAll(".emo").length, stern: !!document.querySelector("#sterne") && document.querySelector("#sterne").parentElement.querySelector(".emo > img") !== null,
    text: document.querySelector("#sterne").parentElement.textContent, anzahl: window.__emoji ? __emoji.anzahl() : 0 }));
  erwarte(s.anzahl >= 100 && s.n > 5, `Startseite: ${s.n} Emojis durch eigene Bilder ersetzt (${s.anzahl} Bilder vorhanden)`);
  erwarte(s.stern && s.text.includes("⭐"), "Stern-Knopf: eigenes Bild, das Zeichen ⭐ bleibt im Text");
  if (BILDER) await p.screenshot({ path: `${BILDER}/bilder-start.png` });
  // nachträglich eingefügter Inhalt wird ersetzt, Eingabefelder nicht
  const nach = await p.evaluate(async () => {
    const d = document.createElement("div"); d.id = "probe"; d.textContent = "Ich mag 🍎 und 🦊"; document.body.appendChild(d);
    const i = document.createElement("input"); i.id = "probe-feld"; i.value = "🍎"; document.body.appendChild(i);
    await new Promise(r => setTimeout(r, 120));
    return { emo: d.querySelectorAll(".emo").length, text: d.textContent, feld: i.value, unbekannt: (() => { const x = document.createElement("p"); x.textContent = "🛸"; document.body.appendChild(x); return x; })() && true };
  });
  erwarte(nach.emo === 2 && nach.text === "Ich mag 🍎 und 🦊" && nach.feld === "🍎", "neuer Inhalt: 🍎 und 🦊 ersetzt, textContent unverändert, Eingabefeld unberührt");
  // Noto in Stil A: Kontur ohne SVG-Filter (zwei <use>), keine Wangen. Seit Paket 5 (07.11.2026) als <img> mit einer Adresse je Emoji (seit „icons.js verkleinern“ data: statt blob:):
  // gleiches Emoji mehrfach = dieselbe Adresse, kein Inline-SVG mehr im DOM, jedes Bild gültig (geladen, nicht leer)
  const noto = await p.evaluate(async () => {
    const d = document.createElement("div"); d.textContent = "😊😊🍎🍎"; document.body.appendChild(d);
    await new Promise(r => setTimeout(r, 120));
    const ALLE = await __emoji.alle(), roh = Object.values(ALLE), smiley = ALLE["1f60a"];
    const imgs = [...d.querySelectorAll(".emo > img")];
    await Promise.all(imgs.map(i => i.decode().catch(() => null)));
    return { anzahl: roh.length, filter: roh.filter(s => s.includes("<filter")).length, use: roh.filter(s => (s.match(/<use href='#n[0-9a-f]+-b'/g) || []).length === 2).length,
      imgs: imgs.length, adressen: new Set(imgs.map(i => i.src)).size, data: imgs.every(i => i.src.startsWith("data:image/svg+xml")), geladen: imgs.every(i => i.naturalWidth > 0),
      inline: document.querySelectorAll(".emo svg").length, wangen: /url\(#n1f60a-SVGljKj4yZw\)|url\(#n1f60a-SVGBJFSCeLy\)/.test(smiley) };
  });
  erwarte(noto.anzahl >= 770 && noto.filter === 0 && noto.use === noto.anzahl, `Noto in Stil A: ${noto.anzahl} Bilder, keins mit SVG-Filter, jedes mit Kontur-Kopie über <use>`);
  erwarte(noto.imgs === 4 && noto.adressen === 2 && noto.data && noto.geladen && noto.inline === 0, "gleiches Emoji mehrfach: ein <img> je Anzeige, eine data:-Adresse je Emoji, alle geladen, kein Inline-SVG im DOM");
  // alle Noto-Bilder sind als eigenständiges Bild gültig (ein <img> verzeiht kein fehlerhaftes Markup)
  const kaputt = await p.evaluate(async () => {
    const schlecht = [];
    const ALLE = await __emoji.alle();
    for (const h of Object.keys(ALLE)) { const d = new DOMParser().parseFromString(ALLE[h], "image/svg+xml"); if (d.querySelector("parsererror")) schlecht.push(h); }
    return schlecht;
  });
  erwarte(kaputt.length === 0, "jedes Noto-Bild ist gültiges SVG-XML" + (kaputt.length ? ": " + kaputt.join(", ") : ""));
  erwarte(!noto.wangen, "keine rosa Wangen (😊 ohne Noto-Wangen)");
  // 📦 hat bei Noto ein großes Rechteck außerhalb des Bildes: es darf weder zu sehen sein noch Klicks abfangen
  await p.evaluate(() => {
    window.__klicks = { a: 0, b: 0 };
    const w = document.createElement("div"); w.style.cssText = "position:fixed;left:20px;top:300px;z-index:99;display:flex;gap:4px;font-size:40px";
    w.innerHTML = '<button id="pk-a" style="width:90px;height:90px">📦</button><button id="pk-b" style="width:90px;height:90px">B</button>';
    document.body.appendChild(w); w.querySelector("#pk-a").onclick = () => __klicks.a++; w.querySelector("#pk-b").onclick = () => __klicks.b++;
  });
  await p.waitForTimeout(150);
  await p.click("#pk-a", { timeout: 3000 }); await p.click("#pk-b", { timeout: 3000 });
  const pk = await p.evaluate(() => ({ k: __klicks, emo: !!document.querySelector("#pk-a .emo"), ov: getComputedStyle(document.querySelector("#pk-a .emo > img")).overflow }));
  erwarte(pk.emo && pk.k.a === 1 && pk.k.b === 1 && pk.ov === "hidden", "📦: Bild am Rand abgeschnitten, Klicks auf den Knopf und den Nachbarn kommen an");
  // Atelier: Stempel zeichnet das Noto-Bild (mit Kontur #3B1F63) auf die Leinwand
  await p.goto(BASIS + "spiele/atelier/"); await p.waitForLoadState("load");
  await p.evaluate(() => window.EmojiBereit.then(E => E.lade("🍎")));
  await p.evaluate(() => __atelier.oeffneMalen({})); await p.waitForTimeout(300);
  await p.click('.wz[data-w="stempel"]');
  const stempelKnopf = await p.evaluate(() => { const b = [...document.querySelectorAll("#stempel button")].find(x => x.dataset.s === "🍎"); return !!b; });
  if (stempelKnopf) await p.click('#stempel button[data-s="🍎"]');
  const st = await p.evaluate(async () => {
    const cv = document.getElementById("leinwand"), r = cv.getBoundingClientRect(), s = document.querySelector("#stempel .an, #stempel [aria-pressed='true']");
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, stempel: s ? s.dataset.s : null };
  });
  await p.evaluate(() => window.EmojiBereit.then(E => Promise.all([...document.querySelectorAll("#stempel button")].map(b => E.lade(b.dataset.s)))));
  await p.mouse.click(st.x, st.y); await p.waitForTimeout(150);
  const kontur = await p.evaluate(() => { const g = __atelier.g, d = g.getImageData(512 - 70, 384 - 70, 140, 140).data; let n = 0;
    for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - 0x3B) < 30 && Math.abs(d[i + 1] - 0x1F) < 30 && Math.abs(d[i + 2] - 0x63) < 30) n++; return n; });
  erwarte(kontur > 40, `Atelier: Stempel als Noto-Bild mit Kontur gezeichnet (${kontur} Konturpunkte)`);
  // Begleiter nie als Emoji (01.11.2026): Vorschul-Rucksack, Meine Ecke, Sachunterricht zeigen Zeichnungen, auf keiner Seite steht ein Begleiter-Emoji neben seinem Namen
  const BEGLEITER = { "🦊": "Fipsi", "🦉": "Ella", "🦫": "Benno", "🐻": "Bruni", "🦜": "Paula", "🐢": "Tilda", "🤖": "Robo" };
  for (const s of ["spiele/vorschule/", "spiele/ich/", "spiele/schach/", "spiele/gefuehle/", "spiele/heft/", "spiele/baeckerei/", "spiele/garten/", "spiele/tierstation/", "spiele/medien/", ""]) {
    await p.goto(BASIS + s); await p.waitForLoadState("load"); await p.waitForTimeout(450);
    const r = await p.evaluate((B) => {
      const text = document.body.innerText, falsch = [];
      for (const [e, n] of Object.entries(B)) { const i = text.indexOf(e); if (i >= 0 && text.slice(Math.max(0, i - 40), i + 40).includes(n)) falsch.push(e + " " + n); }
      return { falsch, fig: document.querySelectorAll(".emo.fig > img").length };
    }, BEGLEITER);
    erwarte(r.falsch.length === 0, `${s || "Startseite"}: kein Begleiter als Emoji (${r.fig} Begleiter-Zeichnungen)` + (r.falsch.length ? " – gefunden: " + r.falsch.join(", ") : ""));
  }
  await p.goto(BASIS + "spiele/vorschule/"); await p.waitForLoadState("load"); await p.waitForTimeout(450);
  const fipsi = await p.evaluate(() => ({ fig: !!document.querySelector(".intro .emo.fig > img"), noto: document.querySelector(".intro").textContent.includes("🦊"), zeichen: document.querySelector(".intro").textContent.includes("\uE103") }));
  erwarte(fipsi.fig && !fipsi.noto && fipsi.zeichen, "Vorschul-Rucksack: Fipsi als Zeichnung, nicht als Fuchs-Emoji");
  // Seiten mit vielen Emojis öffnen ohne Fehler
  for (const s of ["spiele/sachkunde/", "spiele/mathe/", "spiele/garten/", "spiele/ich/"]) { await p.goto(BASIS + s); await p.waitForLoadState("load"); await p.waitForTimeout(400); }
  erwarte(await p.evaluate(() => document.querySelectorAll(".emo").length > 0), "weitere Seiten (Sachunterricht, Mathe, Garten, Meine Ecke) laufen mit den Bildern");
  if (BILDER) await p.screenshot({ path: `${BILDER}/bilder-ich.png` });
  // Paket 5: die Noto-Bilder kommen erst nach dem ersten Bild – bis dahin hält span.emo.warte den Platz in derselben Größe frei (Emoji des Geräts), dann kommt das Bild.
  // Seit 07.11.2026 in Häppchen (shared/icons/<teil>.js): gesperrt werden alle Häppchen
  {
    const q = await ctx.newPage(); let freigeben; const gesperrt = new Promise(ok => { freigeben = ok; });
    await q.route(/shared\/icons\/[\w-]+\.js/, async (r) => { await gesperrt; await r.continue(); });
    await q.goto(BASIS + "spiele/sachkunde/", { waitUntil: "domcontentloaded" }); await q.waitForTimeout(800);   // „load“ wartet auf icons.js
    const vor = await q.evaluate(() => { const e = document.querySelector(".emo.warte:not(.fig)"); if (!e) return null; const r = e.getBoundingClientRect(), t = e.querySelector(".emo-t");
      return { n: document.querySelectorAll(".emo.warte").length, fig: document.querySelectorAll(".emo.fig > img").length, b: r.width, h: r.height, sichtbar: getComputedStyle(t).clipPath === "none", i: [...document.querySelectorAll(".emo")].indexOf(e) }; });
    erwarte(vor && vor.n > 5 && vor.sichtbar && vor.fig >= 0, `vor den Häppchen: ${vor && vor.n} Emojis halten den Platz frei und zeigen das Geräte-Emoji (Begleiter sofort als Zeichnung)`);
    freigeben(); await q.waitForFunction(() => __emoji.teile().length > 0 && !document.querySelector(".emo.warte"), null, { timeout: 10000 });
    const nach = await q.evaluate((i) => { const e = document.querySelectorAll(".emo")[i], r = e.getBoundingClientRect(); return { b: r.width, h: r.height, img: !!e.querySelector(":scope > img") }; }, vor ? vor.i : 0);
    erwarte(vor && nach.img && Math.abs(nach.b - vor.b) < 0.5 && Math.abs(nach.h - vor.h) < 0.5, `nach den Häppchen: Bild an derselben Stelle, gleiche Größe (${vor && vor.b.toFixed(1)} → ${nach.b.toFixed(1)} px)`);
    await q.close();
  }
  // Eltern-Wahl: Emojis des Geräts
  await p.evaluate(() => { const e = Spielwelt.lade("eltern"); e.bilder = "geraet"; Spielwelt.speichere("eltern", e); });
  await p.goto(BASIS); await p.waitForLoadState("load"); await p.waitForTimeout(500);
  erwarte(await p.evaluate(() => window.__emoji && __emoji.nurFiguren && document.querySelectorAll(".emo:not(.fig)").length === 0), "Eltern-Wahl „Emojis des Geräts“: keine Noto-Bilder (nur die Begleiter bleiben Zeichnungen)");
  await p.goto(BASIS + "spiele/vorschule/"); await p.waitForLoadState("load"); await p.waitForTimeout(500);
  erwarte(await p.evaluate(() => !!document.querySelector(".intro .emo.fig > img")), "auch mit Geräte-Emojis: Fipsi im Vorschul-Rucksack als Zeichnung");
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n  " + fehler.join("\n  ")); process.exit(1); }
  console.log("✅ Bilder-Test bestanden.");
})();
