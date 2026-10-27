// Playwright-Test (NA-10): Szenen-Baustein und Zeigehand auf Startseite und Insel.
// Aufruf: sh tests/laufen.sh szene  bzw.  PFAD=dev/ sh tests/laufen.sh szene  (in /dev sind Übersetzungs-Entwürfe sichtbar)
// Screenshots: BILDER=<ordner>
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const DEV = /\/dev\/$/.test(BASIS);
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };

  for (const [b, h, lage] of [[1180, 820, "quer"], [820, 1180, "hoch"]]) {
    const ctx = await browser.newContext({ viewport: { width: b, height: h }, hasTouch: true });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
    const seite = async (name) => {
      const p = await ctx.newPage();
      p.on("pageerror", e => fehler.push(`${name}: ${e.message}`));
      p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${name}: ${m.text()}`); });
      return p;
    };
    // Ersteinrichtung mit Russisch als Hilfesprache, Deutschstand „Alltag“
    const e = await seite("einrichtung");
    await e.goto(BASIS); await e.waitForURL(/eltern/); await e.waitForLoadState("load"); await e.waitForTimeout(300);
    await e.fill("#pin1", "1234"); await e.fill("#pin2", "1234"); await e.click("#pin-ok");
    await e.waitForSelector("#e-name"); await e.fill("#e-name", "Mira"); await e.selectOption("#e-mutter", "ru"); await e.selectOption("#e-deutsch", "alltag");
    await e.click("#e-ok"); await e.waitForURL(u => !/eltern/.test(u.toString()));
    await e.evaluate(() => { const m = Spielwelt.lade("medien") || {}; m.fuehrerschein = "2026-10-01"; Spielwelt.speichere("medien", m); });
    await e.close();

    // 1) Startseite: Probeszene läuft durch, Zeigehand in Blase 2, kein Überlauf
    const s = await seite(`start ${lage}`);
    await s.goto(BASIS + "?szene=probe"); await s.waitForFunction(() => window.__szene && window.__szene.aktuell(), null, { timeout: 5000 });
    let a = await s.evaluate(() => __szene.aktuell());
    erwarte(a.nr === 0 && a.anzahl === 3 && /Mira/.test(a.text), `Startseite: Probeszene beginnt mit Namen (${lage})`);
    erwarte(!!a.hilfe, DEV ? `Entwurf der Hilfesprache in /dev verfügbar (${lage})` : `russischer Entwurf ist auf der Hauptseite freigegeben (${lage})`);
    erwarte(!a.hilfeSichtbar, `bei Deutschstand „Alltag“ ist die Hilfe erst auf Knopfdruck sichtbar (${lage})`);
    if (DEV) { await s.click("#szene-hk"); await s.waitForTimeout(150); }
    const ueber = await s.evaluate(() => { const r = document.getElementById("szene").getBoundingClientRect(); return r.left < 0 || r.right > innerWidth || r.bottom > innerHeight || document.documentElement.scrollWidth > innerWidth; });
    erwarte(!ueber, `Sprechblase passt auf den Bildschirm (${lage})`);
    await bild(s, `szene-start-1-${lage}`);
    await s.click("#szene-weiter"); await s.waitForTimeout(400);
    a = await s.evaluate(() => __szene.aktuell());
    const ring = await s.evaluate(() => { const r = document.querySelector(".zeige-ring"); return r ? r.getBoundingClientRect().width > 0 && getComputedStyle(r).opacity !== "0" : false; });
    erwarte(a.nr === 1 && a.zeigt && ring, `Blase 2 zeigt mit Hand und Leuchten (${lage})`);
    await bild(s, `szene-start-2-${lage}`);
    await s.click("#szene-weiter"); await s.waitForTimeout(200);
    const ohneHand = await s.evaluate(() => Zeige.anzahl);
    erwarte(ohneHand === 0, `Zeigehand verschwindet mit der Blase (${lage})`);
    await s.click("#szene-weiter"); await s.waitForTimeout(200);
    erwarte(await s.evaluate(() => !__szene.aktuell() && document.getElementById("szene").hidden && !Story.gesehen("probe")), `Probeszene endet und landet nicht in der Chronik (${lage})`);

    if (lage === "quer") {
      // 2) Höchstens 4 Blasen, Chronik, Überspringen, Warten auf eine Handlung
      const r = await s.evaluate(async () => {
        const out = {};
        Szene.registriere("test-lang", { blasen: [1, 2, 3, 4, 5].map(n => ({ wer: "eule", text: { de: "Blase " + n } })) });
        const p = Szene.spiele("test-lang"); out.anzahl = __szene.aktuell().anzahl;
        for (let i = 0; i < 4; i++) __szene.weiter();
        out.ergebnis = await p; out.chronik = Story.chronik().map(x => x.s);
        const p2 = Szene.spiele({ id: "test-weg", blasen: [{ wer: "baer", text: { de: "Hallo" } }, { wer: "baer", text: { de: "Tschüss" } }] });
        document.getElementById("szene-weg").click(); out.weg = await p2; out.wegGesehen = Story.gesehen("test-weg");
        let los = null;
        const p3 = Szene.spiele({ id: "test-bis", blasen: [{ wer: "robo", text: { de: "Schieb den Knopf!" }, bis: (w) => { los = w; } }, { wer: "robo", text: { de: "Super!" } }] });
        out.wartet = __szene.aktuell().wartet; los(); out.nachBis = __szene.aktuell().nr; __szene.weiter(); await p3;
        return out;
      });
      erwarte(r.anzahl === 4, "eine Szene hat höchstens 4 Sprechblasen");
      erwarte(!r.ergebnis.uebersprungen && r.chronik.includes("test-lang"), "gesehene Szene steht in story.chronik");
      erwarte(r.weg.uebersprungen && r.wegGesehen, "Überspringen zählt als gesehen (kein Wiederholen ohne Wunsch)");
      erwarte(r.wartet && r.nachBis === 1, "Blase mit Bedingung wartet ohne „Weiter“ auf die Handlung");
      // 3) Deutschstand „wenig“: Hilfe gleich sichtbar (nur wo eine Hilfe da ist)
      if (DEV) {
        const w = await s.evaluate(() => { const k = Spielwelt.lade("eltern"); k.kind.deutschstand = "wenig"; Spielwelt.speichere("eltern", k); Szene.spiele("probe"); const x = __szene.aktuell(); Szene.abbrechen(); return x.hilfeSichtbar; });
        erwarte(w, "bei wenig Deutsch ist die Hilfesprache gleich sichtbar");
        await s.evaluate(() => { const k = Spielwelt.lade("eltern"); k.kind.deutschstand = "alltag"; Spielwelt.speichere("eltern", k); });
      }
    }
    await s.close();

    // 4) Insel: Szene über der 3D-Welt, Hand zeigt auf das Haus
    const i = await seite(`insel ${lage}`);
    await i.goto(BASIS + "spiele/welt3d/heimat.html?stunde=14&szene=probe");
    await i.waitForFunction(() => window.__szene && window.__szene.aktuell() && window.Insel, null, { timeout: 15000 });
    await i.click("#szene-weiter", { force: true }); await i.waitForTimeout(800);
    const haus = await i.evaluate(() => { const p = Insel.ort("haus")(); const r = document.querySelector(".zeige-ring"); const rr = r && r.getBoundingClientRect();
      return { p, ring: rr ? { x: rr.left + rr.width / 2, y: rr.top + rr.height / 2 } : null, rand: r && r.classList.contains("rand"), a: __szene.aktuell() }; });
    if (haus.p && haus.p.sichtbar) erwarte(haus.a && haus.a.zeigt && haus.ring && Math.abs(haus.ring.x - haus.p.x) < 3 && Math.abs(haus.ring.y - haus.p.y) < 3, `Insel: Leuchten liegt auf dem Haus (${lage})`);
    else erwarte(haus.a && haus.a.zeigt && haus.ring && haus.ring.x > 0 && haus.ring.x < b && haus.ring.y > 0 && haus.ring.y < h && haus.rand, `Insel: Haus außerhalb des Bildes → Pfeil am Rand zeigt die Richtung (${lage})`);
    await bild(i, `szene-insel-${lage}`);
    await i.click("#szene-weiter", { force: true }); await i.click("#szene-weiter", { force: true }); await i.waitForTimeout(200);
    erwarte(await i.evaluate(() => !__szene.aktuell()), `Insel: Szene endet (${lage})`);
    await i.close();
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Szenen-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
