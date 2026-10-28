// Test Inselchronik im Stickeralbum (NA-18, 30.10.2026): Reiter „📜 Inselchronik“ listet die gesehenen Szenen in Reihenfolge mit Figur,
// Titel und Datum; ▶ spielt eine Szene echt bis zum Ende ab (vorgelesen, Figur stimmt), ohne die Chronik doppelt zu füllen;
// leere Chronik mit freundlichem Hinweis; #chronik öffnet den Reiter direkt; quer und Handy ohne Scrollleiste; keine Konsolenfehler.
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };
  async function kind({ breite = 1180, hoehe = 820 } = {}) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true, serviceWorkers: "block" });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    return { ctx, p };
  }
  const passt = (p) => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);

  // ---------- Leere Chronik ----------
  {
    const { ctx, p } = await kind();
    await p.goto(BASIS + "spiele/album/"); await p.waitForTimeout(400);
    await p.click('#reiter [data-i]:last-child'); await p.waitForTimeout(200);
    erwarte(await p.evaluate(() => /Inselchronik/.test(document.querySelector("#reiter .an").textContent) && !!document.querySelector(".chronik-leer")), "leere Chronik: Reiter da, freundlicher Hinweis");
    await ctx.close();
  }

  // ---------- Chronik mit drei Szenen ----------
  for (const [breite, hoehe, art] of [[1180, 820, "quer"], [390, 760, "Handy"]]) {
    const { ctx, p } = await kind({ breite, hoehe });
    await p.evaluate(() => { ["sonne", "erste-frucht", "fipsis-karte"].forEach(s => Story.merkeSzene(s)); });
    await p.goto(BASIS + "spiele/album/#chronik"); await p.waitForTimeout(400);
    const l = await p.evaluate(() => [...document.querySelectorAll(".chronik li")].map(li => ({ s: li.dataset.s, titel: li.querySelector(".was b").textContent, datum: li.querySelector(".was span").textContent, fig: !!li.querySelector(".kopf svg") })));
    erwarte(l.map(x => x.s).join() === "sonne,erste-frucht,fipsis-karte" && l.every(x => x.fig && /Oktober/.test(x.datum)), `${art}: #chronik zeigt drei Szenen in Reihenfolge mit Figur und Datum (${l.map(x => x.titel).join(", ")})`);
    erwarte(await passt(p), `${art}: keine Scrollleiste`);
    await bild(p, `chronik-${art}`);
    if (art === "quer") {
      await p.evaluate(() => { window.__gesprochen = []; Sprache.verfuegbar = () => true; Sprache.hat = () => true;
        Sprache.sprich = (t, l, f) => { window.__gesprochen.push(t); if (f) setTimeout(f, 10); }; Sprache.stopp = () => {}; });
      await p.click('[data-spiele="fipsis-karte"]'); await p.waitForTimeout(400);
      const a = await p.evaluate(() => __szene.aktuell());
      erwarte(a && a.id === "fipsis-karte" && a.wer === "fipsi" && /Mira/.test(a.text), "▶ spielt „Fipsis Karte“ ab (Fipsi, mit Namen)");
      await bild(p, "chronik-abspielen");
      for (let i = 0; i < 4; i++) { await p.click("#szene-weiter", { force: true }); await p.waitForTimeout(300); }
      const z = await p.evaluate(() => ({ laeuft: !!__szene.aktuell(), n: Story.chronik().length, g: window.__gesprochen }));
      erwarte(!z.laeuft && z.n === 3, "Szene bis zum Ende, Chronik bleibt bei drei Einträgen");
      erwarte(z.g.some(t => /Schatzkarte/.test(t)), "Sprechblasen werden vorgelesen");
    }
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Chronik-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
