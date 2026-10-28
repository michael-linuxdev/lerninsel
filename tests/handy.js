// Rechenaufwand der Looks auf kleinen Smartphones (27.10.2026): iPhone SE hoch/quer, kleines Android – je Look Zeichenaufrufe, Dreiecke,
// gerechnete Pixel pro Bild, Hauptthread-Zeit pro Bild (normal und mit 4× gedrosselter CPU), JS-Download, Speicher.
// Aufruf: sh tests/laufen.sh handy   (DROSSEL=6 für noch schwächere Geräte). Software-Grafik: Bilder/s nur als Verhältnis lesen.
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const GERAETE = [
  ["iPhone SE (375×667, ×2)", 375, 667, 2],
  ["kleines Android (360×640, ×3)", 360, 640, 3],
  ["iPhone SE quer (667×375, ×2)", 667, 375, 2]
];
const SZENEN = [
  ["Rund (schön)", "spiele/welt3d/heimat.html?stunde=14", "schoen"],
  ["Rund (einfach)", "spiele/welt3d/heimat.html?stunde=14", "einfach"],
  ["Rund (ohne Wahl → automatisch)", "spiele/welt3d/heimat.html?stunde=14", "auto"]
];
const DROSSEL = +(process.env.DROSSEL || 4);   // CPU 4× langsamer ≈ einfaches Handy

const MESSEN = () => {
  // Zählt WebGL-Zeichenaufrufe/Dreiecke und die Hauptthread-Zeit je Bild (Zeit in requestAnimationFrame-Rückrufen)
  const z = window.__mess = { aufrufe: 0, dreiecke: 0, ms: 0, bilder: 0, letztes: -1 };
  const tri = (m, n) => (m === 4 ? n / 3 : m === 5 || m === 6 ? Math.max(0, n - 2) : 0);
  for (const K of [window.WebGLRenderingContext, window.WebGL2RenderingContext]) {
    if (!K) continue;
    for (const [name, nP, iP] of [["drawArrays", 2, -1], ["drawElements", 1, -1], ["drawArraysInstanced", 2, 3], ["drawElementsInstanced", 1, 4], ["drawRangeElements", 3, -1]]) {
      const alt = K.prototype[name]; if (!alt) continue;
      K.prototype[name] = function (...a) { z.aufrufe++; z.dreiecke += tri(a[0], a[nP]) * (iP >= 0 ? a[iP] : 1); return alt.apply(this, a); };
    }
  }
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => raf((t) => { const s = performance.now(); try { cb(t); } finally { z.ms += performance.now() - s; if (t !== z.letztes) { z.bilder++; z.letztes = t; } } });
  window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__keinSparen = true;
};

(async () => {
  const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
  const zeilen = [], fehler = [];
  for (const [gname, b, h, dpr] of GERAETE) {
    const ctx = await browser.newContext({ viewport: { width: b, height: h }, deviceScaleFactor: dpr, hasTouch: true, isMobile: true });
    await ctx.addInitScript(MESSEN);
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${gname} ${p.url()}: ${e.message}`));
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    await p.evaluate(() => { const m = Spielwelt.lade("medien") || {}; m.lektionen = { bedienung: 3 }; m.fuehrerschein = "2026-10-01"; Spielwelt.speichere("medien", m);
      ["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8"].forEach(e => Story.etappeFertig(e, true)); Story.merkeSzene("sonne"); for (let i = 0; i < 12; i++) Zeit.aufgabe(); });
    const cdp = await ctx.newCDPSession(p);
    for (const [sname, url, grafik] of SZENEN) {
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
      if (grafik === "auto") await p.evaluate(() => { const e = Spielwelt.lade("eltern") || {}; if (e.insel) delete e.insel.grafik; Spielwelt.speichere("eltern", e); try { localStorage.removeItem("lerninsel.grafik"); } catch (er) { /* egal */ } });
      else if (grafik) await p.evaluate((g) => { const e = Spielwelt.lade("eltern") || {}; e.insel = Object.assign({}, e.insel || {}, { grafik: g }); Spielwelt.speichere("eltern", e); try { localStorage.removeItem("lerninsel.sparen"); } catch (x) { /* egal */ } }, grafik);
      await p.goto(BASIS + url); await p.waitForTimeout(4000);
      await p.evaluate(() => { if (window.__szene && __szene.aktuell()) Szene.abbrechen(); const t = document.querySelector(".pixelbox"); if (t) t.hidden = true; });
      await p.waitForTimeout(800);
      // Wasser liegt flach (30.10.2026: in „einfach“ stand es als senkrechte Wand im Bild)
      if (/welt3d/.test(url)) { const hoch = await p.evaluate(() => { const g = __heimat.wasser.geometry; g.computeBoundingBox(); return g.boundingBox.max.y - g.boundingBox.min.y; }); if (hoch > 1) fehler.push(`${gname}: Wasser steht senkrecht (${hoch.toFixed(1)} hoch)`); else console.log(`  ✓ ${gname}: Wasser liegt flach`); }
      // Seit 30.10.2026: ohne gespeicherte Wahl startet die Insel auf kleinen Bildschirmen (kürzere Seite < 500) in „einfach“
      if (grafik === "auto") { const g = await p.evaluate(() => document.getElementById("grafik").textContent); if (!/einfach/.test(g)) fehler.push(`${gname}: ohne Wahl nicht „einfach“ (${g})`); else console.log(`  ✓ ${gname}: ohne Wahl automatisch „einfach“`); }
      // Messfenster 1: ohne Drosselung (Zeichenaufrufe, Dreiecke, Bildgröße), Messfenster 2: CPU gedrosselt (Hauptthread-Zeit)
      const fenster = async (ms) => { await p.evaluate(() => Object.assign(window.__mess, { aufrufe: 0, dreiecke: 0, ms: 0, bilder: 0 })); const t0 = Date.now(); await p.waitForTimeout(ms); return p.evaluate((dauer) => { const z = window.__mess; return { bilder: z.bilder, proBild: { aufrufe: z.aufrufe / Math.max(1, z.bilder), dreiecke: z.dreiecke / Math.max(1, z.bilder), ms: z.ms / Math.max(1, z.bilder) }, fps: z.bilder / (dauer / 1000) }; }, Date.now() - t0); };
      const a = await fenster(4000);
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: DROSSEL });
      const d = await fenster(5000);
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
      const extra = await p.evaluate(() => {
        const cs = [...document.querySelectorAll("canvas")].map(c => c.width * c.height).sort((x, y) => y - x);
        const js = performance.getEntriesByType("resource").filter(r => /\.js(\?|$)/.test(r.name)).reduce((s, r) => s + (r.encodedBodySize || r.transferSize || 0), 0);
        const c = [...document.querySelectorAll("canvas")].sort((x, y) => y.width * y.height - x.width * x.height)[0];
        return { pixel: cs[0] || 0, groesse: c ? `${c.width}×${c.height}` : "–", jsKB: Math.round(js / 1024), heapMB: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : null };
      });
      zeilen.push({ gerät: gname, szene: sname, aufrufe: Math.round(a.proBild.aufrufe), dreiecke: Math.round(a.proBild.dreiecke), groesse: extra.groesse, pixel: extra.pixel,
        msUngedrosselt: +a.proBild.ms.toFixed(1), msGedrosselt: +d.proBild.ms.toFixed(1), fps: Math.round(a.fps), fpsGedrosselt: Math.round(d.fps), jsKB: extra.jsKB, heapMB: extra.heapMB });
      console.error(`${gname} · ${sname}: ok`);
    }
    await ctx.close();
  }
  await browser.close();
  console.log("| Gerät | Look | Zeichenaufrufe | Dreiecke | Bild (Pixel) | ms/Bild | ms/Bild gedrosselt | Bilder/s (Software) | JS KB |\n|---|---|---:|---:|---|---:|---:|---:|---:|");
  zeilen.forEach(r => console.log(`| ${r.gerät} | ${r.szene} | ${r.aufrufe} | ${r.dreiecke.toLocaleString("de-DE")} | ${r.groesse} | ${r.msUngedrosselt} | ${r.msGedrosselt} | ${r.fps} | ${r.jsKB} |`));
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log(`✅ Handy-Messung: ${zeilen.length} Messungen.`);
})().catch(e => { console.error(e); process.exit(1); });
