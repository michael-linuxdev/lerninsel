// Ladezeit-Test (Paket 5, 07.11.2026): Startseite, Elternbereich, Matheweg und Sachunterricht mit vierfach gedrosselter CPU (wie ein
// langsames Tablet, über CDP). Obergrenzen für DOM-Knoten und die längste lange Aufgabe (mit Puffer über den gemessenen Werten, damit
// nichts wackelt) – fällt ein Wert drüber, ist meist ein großer Baustein wieder synchron vor dem ersten Bild gelandet oder Emojis sind
// wieder Inline-SVG. Dazu echt durchgeklickt: die Bausteine, die erst später laden (Noto-Bilder nach dem ersten Bild, QR/Übertragen erst
// beim Antippen von „Spielstand“, Mathe-Daten im Elternbereich nach dem ersten Bild), die Karte „Zum Home-Bildschirm“ (nur ohne App-Modus)
// und der Leerlauf der Insel (~30 Bilder/s, wenn nichts passiert).
// Aufruf: sh tests/laufen.sh ladezeit   (MESSEN=1 zeigt nur die Werte)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const MESSEN = !!process.env.MESSEN;
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource|open-meteo/;
// Grenzen (gemessen 07.11.2026 mit Drossel 4: Start ~730 Knoten, Eltern ~3200, Mathe ~560, Sachkunde ~540; vorher 1000/7900/1220/2060)
const GRENZE = {
  "": { dom: 1100, lang: 700 },
  "spiele/eltern/": { dom: 4500, lang: 1200 },
  "spiele/mathe/": { dom: 1000, lang: 700 },
  "spiele/sachkunde/": { dom: 1000, lang: 900 }
};

(async () => {
  const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true, serviceWorkers: "block" });
  await ctx.addInitScript(() => {
    window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__elternAlle = sessionStorage.getItem("__alle") === "1";
    requestAnimationFrame(() => { window.__iconsBeimErstenBild = !!window.LERN_ICONS; });
    window.__lang = []; try { new PerformanceObserver(l => l.getEntries().forEach(e => window.__lang.push(Math.round(e.duration)))).observe({ type: "longtask", buffered: true }); } catch (e) { /* egal */ }
  });
  const p = await ctx.newPage();
  p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
  p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
  await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
  await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
  await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.click("#e-ok"); await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString()));
  await p.evaluate(() => { const m = Spielwelt.lade("medien") || {}; m.lektionen = { bedienung: 3 }; Spielwelt.speichere("medien", m); });

  // ---------- 1. Messwerte mit vierfacher Drossel ----------
  const cdp = await ctx.newCDPSession(p);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  const werte = {};
  await p.evaluate(() => sessionStorage.setItem("__alle", "1"));   // Elternbereich mit allen Teilen messen (wie im Review)
  for (const s of Object.keys(GRENZE)) {
    await p.goto(BASIS + s, { waitUntil: "load" }); await p.waitForTimeout(3000);
    if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.goto(BASIS + s, { waitUntil: "load" }); await p.waitForTimeout(3000); }
    const r = await p.evaluate(() => {
      const res = performance.getEntriesByType("resource"), fcp = (performance.getEntriesByType("paint").find(x => x.name === "first-contentful-paint") || {}).startTime || 0;
      const icons = res.find(x => /shared\/icons\.js/.test(x.name));
      return { dom: document.getElementsByTagName("*").length, lang: Math.max(0, ...window.__lang), fcp: Math.round(fcp), dcl: Math.round(performance.getEntriesByType("navigation")[0].domContentLoadedEventEnd),
        iconsNach: icons && !window.__iconsBeimErstenBild ? Math.round(icons.startTime - fcp) : null, emoSvg: document.querySelectorAll(".emo svg").length, emo: document.querySelectorAll(".emo").length,
        qr: res.some(x => /qrcodegen\.js|spielstand\.js/.test(x.name)) };
    });
    werte[s || "start"] = r;
    console.log(`    ${(s || "Startseite").padEnd(18)} DOM ${String(r.dom).padStart(5)} · längste Aufgabe ${String(r.lang).padStart(4)} ms · erstes Bild ${r.fcp} ms · DOMContentLoaded ${r.dcl} ms · ${r.emo} Emojis`);
    if (MESSEN) continue;
    const g = GRENZE[s];
    erwarte(r.dom <= g.dom, `${s || "Startseite"}: ${r.dom} DOM-Knoten (≤ ${g.dom})`);
    erwarte(r.lang <= g.lang, `${s || "Startseite"}: längste lange Aufgabe ${r.lang} ms (≤ ${g.lang} ms bei Drossel 4)`);
    erwarte(r.emoSvg === 0 && r.emo > 0, `${s || "Startseite"}: ${r.emo} Emojis als <img>, kein Inline-SVG`);
    erwarte(r.iconsNach !== null, `${s || "Startseite"}: Noto-Bilder (icons.js) erst nach dem ersten Bild geladen`);
  }
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  await p.evaluate(() => sessionStorage.removeItem("__alle"));
  if (MESSEN) { await browser.close(); console.log(JSON.stringify(werte)); return; }

  // ---------- 2. Startseite: QR und Übertragen erst beim Antippen ----------
  await p.goto(BASIS, { waitUntil: "load" }); await p.waitForTimeout(500);
  erwarte(!werte.start.qr && await p.evaluate(() => !window.qrcodegen && !document.getElementById("stand-dialog")), "Startseite: QR-Baustein und Übertragen noch nicht geladen");
  await p.click("#spielstand");
  await p.waitForSelector("#stand-dialog:not([hidden])", { timeout: 5000 });
  erwarte(await p.evaluate(() => !!window.qrcodegen && typeof Spielstand.oeffnen === "function"), "„Spielstand“ angetippt: Baustein nachgeladen, Dialog offen");
  await p.click('[data-tun="senden"]'); await p.waitForTimeout(500);
  erwarte(await p.evaluate(() => { const c = document.getElementById("stand-qr"); return c && c.width > 50 && !c.closest("[hidden]"); }), "„Zum anderen Tablet schicken“ zeigt einen QR-Code");
  await p.click('[data-ansicht="senden"] [data-tun="zurueck"]'); await p.waitForTimeout(200);

  // ---------- 3. Elternbereich: Mathe-Daten nach dem ersten Bild, Karte „Zum Home-Bildschirm“ ----------
  await p.goto(BASIS + "spiele/eltern/", { waitUntil: "load" }); await p.waitForTimeout(300);
  if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.waitForTimeout(300); }   // Übergabe: Elternbereich nur mit PIN
  await p.goto(BASIS + "spiele/eltern/", { waitUntil: "domcontentloaded" });
  erwarte(await p.evaluate(() => !window.Mathe), "Elternbereich: Matheweg-Aufgaben nicht vor dem ersten Bild");
  await p.waitForFunction(() => window.__eltern && __eltern.fachBereit && __eltern.fachBereit(), null, { timeout: 15000 });
  erwarte(await p.evaluate(() => !!window.Mathe && !!window.MatheFehler), "… danach nachgeladen (mit den übrigen Fachdaten)");
  await p.click('.eltern-reiter [data-teil="lernstand"]'); await p.waitForTimeout(400);
  erwarte(await p.evaluate(() => /Matheweg/.test(document.querySelector('.eltern-teil[data-teil="lernstand"]').textContent)), "Reiter „Lernstand“ zeigt den Matheweg");
  await p.click('.eltern-reiter [data-teil="kinder"]'); await p.waitForTimeout(300);
  const home = await p.evaluate(() => { const k = document.getElementById("home-karte"); return k && !k.closest("[hidden]") ? k.textContent : ""; });
  erwarte(/Home-Bildschirm/.test(home) && /7 Tage/.test(home) && /Teilen/.test(home), "Kinder & Gerät: Karte „Zum Home-Bildschirm“ mit Anleitung (nicht als App geöffnet)");
  await p.click("#home-weg"); await p.waitForTimeout(300);
  erwarte(await p.evaluate(() => !document.getElementById("home-karte") && (Spielwelt.lade("eltern") || {}).homeHinweis === "aus"), "„Erledigt – ausblenden“ blendet die Karte dauerhaft aus");
  await p.evaluate(() => { const e = Spielwelt.lade("eltern"); delete e.homeHinweis; Spielwelt.speichere("eltern", e); });
  {
    const q = await ctx.newPage();
    await q.addInitScript(() => { window.__standalone = true; });
    await q.goto(BASIS + "spiele/eltern/#kinder"); await q.waitForTimeout(500);
    if (await q.$("#pin1")) { await q.fill("#pin1", "1234"); await q.click("#pin-ok"); await q.waitForTimeout(800); }
    erwarte(await q.evaluate(() => !document.getElementById("home-karte") && !!document.querySelector('.eltern-teil[data-teil="kinder"]')), "als App geöffnet: keine Karte");
    await q.close();
  }
  // Hilfesprache Russisch: russischer Entwurf darunter
  await p.evaluate(() => { const e = Spielwelt.lade("eltern"); e.kind = Object.assign({}, e.kind, { hilfesprache: "ru", hilfedosis: "immer" }); Spielwelt.speichere("eltern", e); });
  await p.goto(BASIS + "spiele/eltern/#kinder"); await p.reload(); await p.waitForTimeout(800);   // nur der Anker ändert sich: neu laden
  erwarte(await p.evaluate(() => document.querySelectorAll('#home-karte .ru[lang="ru"]').length >= 4), "mit Hilfesprache Russisch: Karte mit russischen Zeilen (Entwurf)");
  // NA-54: gesehene Hilfezeilen als Set (einmal gelesen), bleiben über das Neuladen
  const hg = await p.evaluate(() => { Spielwelt.merkeHilfe("probe-1"); Spielwelt.merkeHilfe("probe-1"); return Spielwelt.hilfeGesehen("probe-1") && !Spielwelt.hilfeGesehen("probe-2"); });
  await p.reload(); await p.waitForTimeout(300);
  erwarte(hg && await p.evaluate(() => Spielwelt.hilfeGesehen("probe-1")), "gesehene Hilfezeilen gemerkt (auch nach dem Neuladen)");

  // ---------- 4. Insel: Leerlauf mit ~30 Bildern/s ----------
  await p.evaluate(() => { const e = Spielwelt.lade("eltern"); e.kind = Object.assign({}, e.kind, { hilfesprache: "" }); Spielwelt.speichere("eltern", e); });
  await p.goto(BASIS + "spiele/welt3d/heimat.html?stunde=14&wetter=klar", { waitUntil: "domcontentloaded" });
  await p.waitForFunction(() => window.__heimat && document.getElementById("insel-laedt") && document.getElementById("insel-laedt").hidden, null, { timeout: 90000 });
  if (await p.$("#szene-weiter")) await p.evaluate(() => window.__szene && __szene.abbrechen());
  if (process.env.DBG) console.log(await p.evaluate(() => ({ szene: window.Szene && Szene.laeuft, ziel: !!__heimat.ziel, w: __heimat.wetter, tanzt: __heimat.tanzt, blase: !!document.querySelector(".szene:not([hidden])") })));
  const still = await p.waitForFunction(() => __heimat.leerlauf(), null, { timeout: 15000 }).then(() => true, () => false);
  await p.mouse.move(600, 400); await p.mouse.move(620, 420); await p.waitForTimeout(150);
  const bewegt = await p.evaluate(() => __heimat.leerlauf());
  erwarte(still && !bewegt, `Insel: im Leerlauf gedrosselt (${still}), nach einer Berührung sofort wieder volle Bildrate (${!bewegt})`);

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Ladezeit-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
