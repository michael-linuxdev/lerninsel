// Playwright-Test (NA-02): Profil mit Stufe, Bundesland, Muttersprache und Deutschstand.
// Aufruf: sh tests/laufen.sh profil   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const neu = async (breite = 1180, hoehe = 820) => {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
    return ctx;
  };
  const seite = async (ctx, name) => {
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${name}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${name}: ${m.text()}`); });
    return p;
  };
  const pin = async (p) => { await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok"); await p.waitForSelector("#e-name"); };

  // 1) Ersteinrichtung: Vorschule, Bayern, Ukrainisch, noch kein Deutsch
  for (const [b, h, lage] of [[1180, 820, "quer"], [820, 1180, "hoch"]]) {
    const ctx = await neu(b, h), p = await seite(ctx, `einrichtung ${lage}`);
    await pin(p);
    await p.fill("#e-name", "Mira");
    await p.selectOption("#e-stufe", "vs"); await p.selectOption("#e-land", "by");
    await p.selectOption("#e-mutter", "uk"); await p.selectOption("#e-deutsch", "keine");
    const hinweise = await p.evaluate(() => ({ stufe: !document.getElementById("e-stufe-hinweis").hidden, land: !document.getElementById("e-land-hinweis").hidden,
      deutsch: document.getElementById("e-deutsch-text").textContent, sprache: document.getElementById("e-sprache").value }));
    erwarte(hinweise.stufe && hinweise.land && /neu in Deutschland/.test(hinweise.deutsch), `ehrliche Hinweise für Vorschule und Bayern sichtbar (${lage})`);
    erwarte(hinweise.sprache === "", `Ukrainisch ist noch nicht fertig → keine Hilfesprache vorgewählt (${lage})`);
    const ueberlauf = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    erwarte(!ueberlauf, `kein waagerechter Überlauf (${lage})`);
    if (BILDER) await p.screenshot({ path: `${BILDER}/profil-einrichtung-${lage}.png`, fullPage: true });
    await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString())); await p.waitForTimeout(400);
    const k = await p.evaluate(() => Spielwelt.kind());
    erwarte(k.stufe === "vs" && k.klasse === 1 && k.land === "by" && k.muttersprache === "uk" && k.deutschstand === "keine", `Profil gespeichert: ${JSON.stringify({ stufe: k.stufe, klasse: k.klasse, land: k.land, mutter: k.muttersprache, deutsch: k.deutschstand })} (${lage})`);
    await ctx.close();
  }

  // 2) Jede Stufe einstellen, Startseite, Mathe und Elternbereich öffnen sich ohne Fehler
  {
    const ctx = await neu(), p = await seite(ctx, "stufen");
    await pin(p); await p.fill("#e-name", "Testkind"); await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    for (const st of ["vs", "1", "2", "3", "4", "5"]) {
      await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(300);
      if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); }
      await p.click("#kind-aendern"); await p.waitForSelector("#e-stufe");
      await p.selectOption("#e-stufe", st); await p.click("#e-ok"); await p.waitForTimeout(400);
      const k = await p.evaluate(() => Spielwelt.kind());
      const klasse = { vs: 1, 5: 4 }[st] || +st;
      erwarte(k.stufe === st && k.klasse === klasse, `Stufe ${st} → Klasse ${k.klasse} für alte Abfragen`);
      const lp = await p.evaluate(() => !!document.querySelector(".lp-liste"));
      erwarte(lp, `„Was übt die App?“ zeigt Lernbereiche bei Stufe ${st}`);
      for (const s of ["", "spiele/mathe/", "spiele/deutsch/"]) { await p.goto(BASIS + s); await p.waitForTimeout(400); }
    }
    await ctx.close();
  }

  // 3) Alter Spielstand mit Klasse 2 und Land "sachsen" → stufe "2", land "sn"; Russisch → Hilfesprache Russisch
  {
    const ctx = await neu(), p = await seite(ctx, "migration");
    await pin(p); await p.fill("#e-name", "Altkind"); await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    await p.evaluate(() => { const key = Spielwelt.vorsilbe + "profil.v1", pr = JSON.parse(localStorage.getItem(key));
      pr.daten.eltern.kind = { alter: 8, klasse: 2, geschlecht: "w", hilfesprache: "ru", land: "sachsen" }; pr.stand = Date.now() + 60000; localStorage.setItem(key, JSON.stringify(pr)); });
    await p.reload(); await p.waitForTimeout(500);
    const k = await p.evaluate(() => Spielwelt.profil.daten.eltern.kind);
    erwarte(k.stufe === "2" && k.klasse === 2 && k.land === "sn" && k.muttersprache === "ru" && k.deutschstand === "gut", `alter Spielstand migriert: ${JSON.stringify(k)}`);
    await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(300);
    if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); }
    await p.click("#kind-aendern"); await p.waitForSelector("#e-mutter");
    await p.selectOption("#e-mutter", "de"); await p.selectOption("#e-mutter", "ru");
    erwarte(await p.inputValue("#e-sprache") === "ru", "Muttersprache Russisch schlägt Hilfesprache Russisch vor");
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Profil-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
