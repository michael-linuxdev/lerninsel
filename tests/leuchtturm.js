// Playwright-Test (07.11.2026): Tildas Leuchtturm (Kapitel 6) – zu bis Kapitel 6; jedes Licht-Rätsel hat genau eine Lösung und ist am Anfang
// nicht gelöst; Kl. 2: eine ganze Runde echt durch Antippen der Spiegel gelöst (einmal absichtlich verdreht, einmal mit 💡 Tipp),
// Sterne nur für neue Rätsel, höchstens 3 am Tag; nächste Runde beginnt mit ungelösten Rätseln; Schatzkammer zeigt gefüllte und leere Truhen;
// Kl. 1 kleine Bretter, Kl. 3 zwei Kristalle; iPad hoch und Handy ohne Querscrollen, Spiegel-Knöpfe mindestens 40 px.
// Aufruf: sh tests/laufen.sh leuchtturm   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource|open-meteo/;
process.on("unhandledRejection", (e) => { console.log("❌ Abbruch: " + e.message + "\n  " + (global.__fehler || []).join("\n  ")); process.exit(1); });

(async () => {
  const browser = await chromium.launch();
  const fehler = global.__fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };
  async function kind(stufe, breite = 1180, hoehe = 820) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true, serviceWorkers: "block" });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__testSchnell = true; });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`Seitenfehler: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`Konsole: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok"); await p.waitForSelector("#e-name");
    await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", stufe); await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString())); await p.waitForTimeout(300);
    return { ctx, p };
  }
  const seite = async (p, hash = "") => { await p.goto(BASIS + "spiele/leuchtturm/" + hash); await p.waitForLoadState("load"); await p.waitForTimeout(300); };
  const sterne = (p) => p.evaluate(() => Spielwelt.sterne());
  // Spiegel, die noch anders stehen als in der Lösung
  const falsche = (p) => p.evaluate(() => { const b = __leuchtturm.brett; return __leuchtturm.spiegelVon(b.r.z).filter(([y, x]) => b.g[y][x] !== b.r.z[y][x]); });
  const tippe = async (p, y, x) => { await p.click(`#brett [data-y="${y}"][data-x="${x}"]`); await p.waitForTimeout(40); };
  // Rätsel echt lösen: jeden falschen Spiegel antippen
  const loese = async (p) => {
    const pos = await p.evaluate(() => __leuchtturm.lauf.pos), id = await p.evaluate(() => __leuchtturm.brett.r.id);
    for (const [y, x] of await falsche(p)) await tippe(p, y, x);
    await p.waitForFunction((pos) => !document.getElementById("raetselkarte") || __leuchtturm.lauf.pos > pos || !__leuchtturm.brett, pos, { timeout: 6000 });
    return id;
  };

  // ---------- Daten: genau eine Lösung, Start nicht gelöst ----------
  { const { ctx, p } = await kind("2");
    await seite(p);
    erwarte(await p.isVisible("#zu") && !(await p.isVisible("#reiter")), "vor Kapitel 6 ist der Leuchtturm zu");
    const pruef = await p.evaluate(() => { const L = __leuchtturm, aus = [];
      L.RAETSEL.forEach(r => {
        const sp = L.spiegelVon(r.z); let n = 0;
        for (let m = 0; m < 1 << sp.length; m++) { const g = r.z.map(z => [...z]); sp.forEach(([y, x], i) => { g[y][x] = (m >> i) & 1 ? "/" : "L"; }); if (L.geloest(g, r.q)) n++; }
        const groesse = { a: 4, b: 5, c: 6 }[r.stufe];
        if (n !== 1) aus.push(`${r.id}: ${n} Lösungen`);
        if (L.geloest(L.startFeld(r), r.q)) aus.push(`${r.id}: am Anfang schon gelöst`);
        if (!L.geloest(r.z, r.q)) aus.push(`${r.id}: Lösung trifft nicht`);
        if (r.z.length !== groesse || r.z.some(z => z.length !== groesse)) aus.push(`${r.id}: Größe`);
        if (r.stufe === "c" && L.kristalle(r.z).length !== 2) aus.push(`${r.id}: Stufe c braucht zwei Kristalle`);
      });
      return { aus, n: L.RAETSEL.length, je: L.STUFEN.map(s => L.RAETSEL.filter(r => r.stufe === s).length) }; });
    erwarte(!pruef.aus.length && pruef.je.every(n => n >= 8), `alle ${pruef.n} Licht-Rätsel (${pruef.je.join("/")} je Stufe) haben genau eine Lösung und sind am Anfang ungelöst ${pruef.aus.join("; ")}`);

    // ---------- Klasse 2: eine Runde echt ----------
    await p.evaluate(() => Story.setzeKapitel(6)); await seite(p);
    erwarte(await p.isVisible("#raetselkarte") && await p.evaluate(() => __leuchtturm.stufe() === "b" && __leuchtturm.lauf.liste.every(r => r.stufe === "b")), "Kapitel 6: Licht-Rätsel offen, Kl. 2 = Stufe b (5 × 5)");
    erwarte(await p.evaluate(() => document.querySelectorAll("#brett button.feld").length === __leuchtturm.spiegelVon(__leuchtturm.brett.r.z).length && !!document.querySelector("#brett .strahl polyline")), "jeder Spiegel ist ein Knopf, der Lichtstrahl ist gezeichnet");
    await bild(p, "leuchtturm-raetsel");
    const s0 = await sterne(p);
    // 1) einmal absichtlich einen richtigen Spiegel verdrehen und zurück, dann lösen
    { const sp = await p.evaluate(() => __leuchtturm.spiegelVon(__leuchtturm.brett.r.z)), f = await falsche(p);
      const richtig = sp.find(([y, x]) => !f.some(([a, b]) => a === y && b === x));
      if (richtig) { await tippe(p, ...richtig); erwarte(!(await p.evaluate(() => __leuchtturm.brett.fertig)), "falsch gedreht: noch nicht gelöst"); await tippe(p, ...richtig); }
      const pfad0 = await p.evaluate(() => __leuchtturm.strahl(__leuchtturm.brett.g, __leuchtturm.brett.r.q).weg.length);
      await loese(p);
      erwarte(pfad0 > 0 && (await sterne(p)) === s0 + 1, "Rätsel 1 durch Antippen gelöst: +1 ⭐"); }
    // 2) mit Tipp: der markierte Spiegel steht falsch
    await p.waitForSelector("#tipp");
    await p.click("#tipp"); await p.waitForTimeout(80);
    { const m = await p.evaluate(() => __leuchtturm.brett.markiert), f = await falsche(p);
      erwarte(m && f.some(x => x.join(",") === m) && await p.isVisible("#brett .markiert") && /falsch/.test(await p.textContent("#hinweis")), "💡 Tipp markiert einen Spiegel, der falsch steht");
      await bild(p, "leuchtturm-tipp");
      await loese(p); }
    // 3) letztes Rätsel
    await loese(p);
    await p.waitForSelector("#ende");
    const d = await p.evaluate(() => Spielwelt.lade("leuchtturm"));
    erwarte(Object.keys(d.geloest).length === 3 && d.runden === 1 && (await sterne(p)) === s0 + 3, "Runde fertig: 3 neue Rätsel, +3 ⭐, Runde gemerkt");
    erwarte(/strahlt/.test(await p.textContent("#ende")), "am Ende strahlt der Leuchtturm");
    await bild(p, "leuchtturm-ende");
    // nächste Runde: neue Rätsel, aber heute keine Sterne mehr (Deckel 3)
    await p.click("#nochmal"); await p.waitForTimeout(150);
    erwarte(await p.evaluate(() => __leuchtturm.lauf.liste.every(r => !Spielwelt.lade("leuchtturm").geloest[r.id])), "nächste Runde beginnt mit noch ungelösten Rätseln");
    await loese(p);
    erwarte((await sterne(p)) === s0 + 3, "viertes neues Rätsel am selben Tag: kein Stern (höchstens 3 am Tag)");
    // ---------- Review 07.11.2026: Wartezeit nach dem Lösen, Reiterwechsel, Können/Erfahrung nur beim ersten Lösen ----------
    // echte Wartezeit (1,8 s), damit der Reiterwechsel sicher davor liegt
    await p.evaluate(() => { window.__testSchnell = false; });
    const stand0 = await p.evaluate(() => ({ k: JSON.stringify(Spielwelt.lade("koennen")["ma.rf.02"] || null), xp: (Spielwelt.lade("charakter") || { xp: {} }).xp.mathe || 0 }));
    { const pos = await p.evaluate(() => __leuchtturm.lauf.pos);
      for (const [y, x] of await falsche(p)) await tippe(p, y, x);
      erwarte(await p.evaluate(() => __leuchtturm.brett.fertig && document.getElementById("tipp").disabled && document.getElementById("neu-start").disabled), "gelöst: 💡 Tipp und ↩ Von vorn sind aus");
      await p.click("#neu-start", { force: true }); await p.waitForTimeout(60);
      erwarte(await p.evaluate(() => __leuchtturm.brett.fertig && /Hell/.test(document.getElementById("hinweis").textContent) && __leuchtturm.geloest(__leuchtturm.brett.g, __leuchtturm.brett.r.q)), "↩ Von vorn nach dem Lösen verstellt das gelöste Brett nicht");
      const stand1 = await p.evaluate(() => ({ k: JSON.stringify(Spielwelt.lade("koennen")["ma.rf.02"] || null), xp: (Spielwelt.lade("charakter") || { xp: {} }).xp.mathe || 0 }));
      erwarte(stand1.k !== stand0.k && stand1.xp === stand0.xp + 1, "fünftes neues Rätsel: Können gemeldet, +1 Erfahrung Mathe");
      // sofort zur Schatzkammer: die Wartezeit darf sie nicht überschreiben
      await p.click('#reiter [data-reiter="kammer"]'); await p.waitForTimeout(2200);
      erwarte(await p.isVisible("#kammer") && !(await p.isVisible("#raetselkarte")) && (await p.evaluate(() => __leuchtturm.reiter)) === "kammer", "Schatzkammer direkt nach dem Lösen geöffnet: bleibt auch nach der Wartezeit stehen");
      // zurück zu den Rätseln: neue Runde fängt bei Rätsel 1 an und springt nicht weiter
      await p.click('#reiter [data-reiter="raetsel"]'); await p.waitForTimeout(2200);
      erwarte(await p.isVisible("#raetselkarte") && await p.evaluate(() => __leuchtturm.lauf.pos === 0 && !__leuchtturm.brett.fertig && !__leuchtturm.lauf.timer), `zurück zu den Rätseln: Runde beginnt bei Rätsel 1 und bleibt dort (vorher Rätsel ${pos + 1})`); }
    // alle Rätsel als gelöst markieren: Wiederholen gibt weder Können noch Erfahrung noch Sterne
    await p.evaluate(() => { window.__testSchnell = true; const d = Spielwelt.lade("leuchtturm"); __leuchtturm.RAETSEL.forEach(r => { d.geloest[r.id] = d.geloest[r.id] || 1; }); d.neu = {}; Spielwelt.speichere("leuchtturm", d); });
    await p.click("#nochmal").catch(() => {}); await p.evaluate(() => __leuchtturm.starteRunde()); await p.waitForTimeout(100);
    const stand2 = await p.evaluate(() => ({ k: JSON.stringify(Spielwelt.lade("koennen")["ma.rf.02"] || null), xp: (Spielwelt.lade("charakter") || { xp: {} }).xp.mathe || 0 }));
    const s2 = await sterne(p);
    await p.click("#tipp"); await p.waitForTimeout(60);
    await loese(p);
    const stand3 = await p.evaluate(() => ({ k: JSON.stringify(Spielwelt.lade("koennen")["ma.rf.02"] || null), xp: (Spielwelt.lade("charakter") || { xp: {} }).xp.mathe || 0 }));
    erwarte(stand3.k === stand2.k && stand3.xp === stand2.xp && (await sterne(p)) === s2 && (await p.evaluate(() => __leuchtturm.lauf.pos === 1)), "schon gelöstes Rätsel nochmal (mit Tipp): kein Können, keine Erfahrung, kein Stern – Runde geht weiter");
    // Schatzkammer
    await p.evaluate(() => { Spielwelt.speichere("garten", { beete: [], korb: {}, geerntet: { moehre: 1, radieschen: 1 }, fragen: {} }); });
    await p.click('#reiter [data-reiter="kammer"]'); await p.waitForTimeout(150);
    const truhen = await p.evaluate(() => [...document.querySelectorAll("#truhen .truhe")].map(t => ({ zu: t.classList.contains("zu"), t: t.textContent, n: t.querySelector("b").textContent })));
    erwarte(truhen.length >= 12 && truhen.some(t => !t.zu && /Licht-Rätsel/.test(t.t) && t.n === "24") && truhen.some(t => !t.zu && /Ernten/.test(t.t) && t.n === "2") && truhen.some(t => t.zu),
      "Schatzkammer: Truhen für Licht-Rätsel (24, alle als gelöst markiert) und Ernten (2) gefüllt, andere noch leer");
    erwarte(await p.isVisible('a[href="../schatz/"]'), "Schatzkammer verlinkt Pokale und Medaillen");
    erwarte(await p.evaluate(() => { const z = Story.KAPITEL_ZAHL; return z >= 6 && new RegExp(`Kapitel ${Math.min(z, Story.kapitel())} von ${z} erlebt`).test(document.querySelector("#kammer .stand").textContent); }), "„Kapitel x von y“ kommt aus Story.KAPITEL_ZAHL, nicht aus einer festen Zahl");
    await bild(p, "leuchtturm-kammer");
    await seite(p, "#kammer");
    erwarte(await p.isVisible("#kammer"), "#kammer öffnet direkt die Schatzkammer");
    await ctx.close(); }

  // ---------- Klasse 1, Klasse 3 hoch, Handy ----------
  for (const [stufe, breite, hoehe, art] of [["1", 1180, 820, "Kl. 1 quer"], ["3", 820, 1180, "Kl. 3 hoch"], ["3", 390, 760, "Kl. 3 Handy"]]) {
    const { ctx, p } = await kind(stufe, breite, hoehe);
    await p.evaluate(() => Story.setzeKapitel(6)); await seite(p);
    const st = await p.evaluate(() => ({ s: __leuchtturm.stufe(), n: __leuchtturm.brett.r.z.length, k: __leuchtturm.kristalle(__leuchtturm.brett.r.z).length }));
    if (stufe === "1") erwarte(st.s === "a" && st.n === 4, `${art}: Stufe a, Brett 4 × 4`);
    else erwarte(st.s === "c" && st.n === 6 && st.k === 2, `${art}: Stufe c, Brett 6 × 6 mit zwei Kristallen`);
    const m = await p.evaluate(() => ({ w: document.documentElement.scrollWidth, iw: innerWidth, k: Math.min(...[...document.querySelectorAll("#brett button.feld")].map(b => Math.min(b.getBoundingClientRect().width, b.getBoundingClientRect().height))) }));
    erwarte(m.w <= m.iw + 1 && m.k >= 40, `${art}: keine waagerechte Scrollleiste, Spiegel-Knöpfe ${Math.round(m.k)} px`);
    await bild(p, `leuchtturm-${art.replace(/[ .]/g, "-")}`);
    for (let i = 0; i < 3; i++) await loese(p);
    await p.waitForSelector("#ende");
    erwarte(true, `${art}: Runde echt bis zum Ende`);
    await ctx.close();
  }
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Leuchtturm-Test bestanden.");
})();
