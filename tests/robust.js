// Playwright-Test (Review 01.11.2026): Spielstand-Sicherung, Kinder löschen, Zeitkonto, Import, Elternbereich, Namen.
// Aufruf: sh tests/laufen.sh robust
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const neu = async () => {
    const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__elternAlle = true; window.__pinWarten = 0; });
    return ctx;
  };
  const seite = async (ctx, name) => {
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${name}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${name}: ${m.text()}`); });
    p.on("dialog", d => d.accept());
    return p;
  };
  const einrichten = async (p) => {
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok"); await p.waitForSelector("#e-name");
    await p.fill("#e-name", "Mira"); await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString())); await p.waitForLoadState("load");
    await p.waitForTimeout(800);
  };
  const dbStand = (p, schluessel) => p.evaluate((k) => new Promise((ok) => {
    const r = indexedDB.open("spielwelt", 1);
    r.onsuccess = () => { const g = r.result.transaction("stand").objectStore("stand").get(k); g.onsuccess = () => ok(g.result || null); g.onerror = () => ok(null); };
    r.onerror = () => ok(null);
  }), schluessel);

  // 1) Sicherung in IndexedDB: localStorage leer → Spielstand kommt zurück (früher überschrieb ein leerer Stand die Sicherung)
  {
    const ctx = await neu(), p = await seite(ctx, "sicherung");
    await einrichten(p);
    await p.evaluate(() => Spielwelt.gibSterne(7)); await p.waitForTimeout(800);
    const vorher = await dbStand(p, "spielwelt.profil.v1");
    erwarte(vorher && vorher.sterne === 7 && vorher.name === "Mira", "Spielstand liegt auch in IndexedDB");
    await p.evaluate(() => localStorage.clear());
    await p.goto(BASIS); await p.waitForLoadState("load"); await p.waitForTimeout(2500);
    const st = await p.evaluate(() => ({ name: Spielwelt.profil.name, sterne: Spielwelt.sterne(), lokal: !!localStorage.getItem("spielwelt.profil.v1") }));
    erwarte(st.name === "Mira" && st.sterne === 7 && st.lokal, `nach geleertem localStorage wiederhergestellt (${JSON.stringify(st)})`);
    const nachher = await dbStand(p, "spielwelt.profil.v1");
    erwarte(nachher && nachher.sterne === 7, "Sicherung in IndexedDB nicht mit leerem Stand überschrieben");
    await ctx.close();
  }

  // 2) Aktives Kind löschen: kommt nicht über pagehide zurück, ein neues Kind mit derselben Nummer startet leer
  {
    const ctx = await neu(), p = await seite(ctx, "kind löschen");
    await einrichten(p);
    await p.evaluate(() => { const id = Spielwelt.neuesKind(); Spielwelt.wechsleKind(id); });
    await p.reload(); await p.waitForLoadState("load"); await p.waitForTimeout(800);
    const id = await p.evaluate(() => { Spielwelt.setzeName("Ben"); Spielwelt.gibSterne(5); return Spielwelt.aktivesKind(); });
    await p.waitForTimeout(800);
    await p.evaluate((id) => Spielwelt.entferneKind(id), id);
    await p.goto(BASIS + "spiele/ich/"); await p.waitForLoadState("load"); await p.waitForTimeout(800);
    const weg = await dbStand(p, "spielwelt.profil.v1." + id);
    erwarte(!weg, `gelöschtes Kind ${id} steht nicht wieder in IndexedDB`);
    const id2 = await p.evaluate(() => { const n = Spielwelt.neuesKind(); Spielwelt.wechsleKind(n); return n; });
    await p.reload(); await p.waitForLoadState("load"); await p.waitForTimeout(1500);
    const st = await p.evaluate(() => ({ name: Spielwelt.profil.name, sterne: Spielwelt.sterne() }));
    erwarte(id2 === id && st.name === "" && st.sterne === 0, `neues Kind ${id2} erbt nichts (${JSON.stringify(st)})`);
    await ctx.close();
  }

  // 3) Zeitkonto: „0 Minuten“ lässt sich nicht weglernen; geladener Spielstand setzt das heutige Konto nicht zurück; Namen ohne HTML
  {
    const ctx = await neu(), p = await seite(ctx, "zeit");
    await einrichten(p);
    const r = await p.evaluate(() => {
      Zeit.noch(0);
      const d = Zeit.heute(); d.aufgaben += 200; d.lernSek += 7200; Spielwelt.speichere("zeit", d);
      return Zeit.status().rest;
    });
    erwarte(r === 0, `nach „0 Minuten“ bringt weiteres Lernen keine Spielzeit (rest ${r})`);
    const r2 = await p.evaluate(() => { Zeit.noch(10); const d = Zeit.heute(); d.aufgaben += 200; Spielwelt.speichere("zeit", d); return Zeit.status().rest; });
    erwarte(r2 === 600, `„noch 10 Minuten“ bleibt 10 Minuten (rest ${r2})`);
    const imp = await p.evaluate(() => {
      const morgens = Spielwelt.exportiere(); morgens.profil.daten.zeit = Object.assign({}, morgens.profil.daten.zeit, { spielSek: 0, extraMin: 0, deckel: undefined });
      const d = Zeit.heute(); d.spielSek = 1500; Spielwelt.speichere("zeit", d);
      const p = Spielwelt.pruefeImport(morgens); Spielwelt.importiere(p);
      return Spielwelt.lade("zeit").spielSek;
    });
    erwarte(imp === 1500, `Spielstand laden setzt die heutige Spielzeit nicht zurück (${imp} s)`);
    const name = await p.evaluate(() => {
      const x = Spielwelt.exportiere(); x.profil.name = "<img src=x onerror=alert(1)>"; x.profil.daten.tier = { phase: "tier", art: "fuchs", name: "<b onmouseover=x>Fu</b>" };
      const p = Spielwelt.pruefeImport(x); return p.name + "|" + p.daten.tier.name;
    });
    erwarte(!/[<>"]/.test(name), `Namen aus einem Spielstand ohne HTML-Zeichen (${name})`);
    const alter = await p.evaluate(() => [Spielwelt.alterAus("2016-02-29", new Date(2027, 1, 28)), Spielwelt.letzterGeburtstag("2016-02-29", new Date(2027, 1, 28)).alter,
      Spielwelt.alterAus("2016-02-29", new Date(2027, 1, 27))]);
    erwarte(alter[0] === 11 && alter[1] === 11 && alter[2] === 10, `Geburtstag 29.2.: am 28.2. stimmen beide Alter überein (${alter})`);
    await ctx.close();
  }

  // 4) Zwei Seiten gleichzeitig (Split View): die zweite überschreibt die Daten der ersten nicht
  {
    const ctx = await neu(), a = await seite(ctx, "tab a");
    await einrichten(a);
    const b = await seite(ctx, "tab b"); await b.goto(BASIS + "spiele/ich/"); await b.waitForLoadState("load"); await b.waitForTimeout(500);
    await a.evaluate(() => Spielwelt.speichere("mathe", Object.assign({}, Spielwelt.lade("mathe") || {}, { probe: 42 })));
    await b.waitForTimeout(300);
    await b.evaluate(() => Spielwelt.speichere("probeB", { ja: 1 }));
    await a.reload(); await a.waitForLoadState("load"); await a.waitForTimeout(500);
    const st = await a.evaluate(() => [(Spielwelt.lade("mathe") || {}).probe, (Spielwelt.lade("probeB") || {}).ja]);
    erwarte(st[0] === 42 && st[1] === 1, `beide Änderungen bleiben erhalten (${st})`);
    await ctx.close();
  }

  // 5) Elternbereich: Anmeldung läuft ab; „PIN vergessen?“ mit Zufallsaufgabe, danach Hinweis für die Eltern
  {
    const ctx = await neu(), p = await seite(ctx, "eltern");
    await einrichten(p);
    await p.evaluate(() => sessionStorage.removeItem(Spielwelt.vorsilbe + "eltern"));
    await p.goto(BASIS + "spiele/eltern/"); await p.waitForSelector("#pin1");
    await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.waitForSelector(".eltern-reiter");
    await p.reload(); await p.waitForTimeout(500);
    erwarte(!!(await p.$(".eltern-reiter")), "innerhalb der Frist bleibt der Elternbereich offen");
    await p.evaluate(() => sessionStorage.setItem(Spielwelt.vorsilbe + "eltern", String(Date.now() - 1000)));
    await p.reload(); await p.waitForTimeout(500);
    erwarte(!!(await p.$("#pin1")), "nach Ablauf fragt der Elternbereich wieder nach der PIN");
    await p.evaluate(() => sessionStorage.setItem(Spielwelt.vorsilbe + "eltern", "1"));
    await p.reload(); await p.waitForTimeout(500);
    erwarte(!!(await p.$("#pin1")), "alte Anmeldung ohne Zeitstempel gilt nicht mehr");
    await p.click("#pin-vergessen"); await p.waitForSelector("#pin-zurueck-karte");
    const t1 = await p.textContent("#pin-zurueck-karte b");
    await p.waitForFunction(() => !document.getElementById("pin-z-ok").disabled);
    await p.fill("#pin-z-antwort", "1"); await p.click("#pin-z-ok");
    erwarte(/falsch/.test(await p.textContent("#pin-z-fehler")) && !!(await p.$("#pin1")) === false, "falsche Antwort setzt nichts zurück");
    await p.waitForFunction((alt) => { const b = document.querySelector("#pin-zurueck-karte b"); return b && !document.getElementById("pin-z-fehler").textContent; }, t1, { timeout: 5000 });
    const t2 = await p.textContent("#pin-zurueck-karte b");
    const [x, y] = t2.split("×").map(s => +s.trim());
    erwarte(x >= 23 && y >= 23, `Zufallsaufgabe ${t1} / ${t2}`);
    await p.waitForFunction(() => !document.getElementById("pin-z-ok").disabled);
    await p.fill("#pin-z-antwort", String(x * y)); await p.click("#pin-z-ok");
    await p.waitForSelector("#pin2");
    await p.fill("#pin1", "4321"); await p.fill("#pin2", "4321"); await p.click("#pin-ok");
    await p.waitForSelector("#pin-hinweis");
    erwarte(/zurückgesetzt/.test(await p.textContent("#pin-hinweis")), "Eltern sehen den Hinweis „PIN wurde zurückgesetzt“");
    await p.click("#pin-hinweis-ok");
    await p.reload(); await p.waitForTimeout(500);
    erwarte(!(await p.$("#pin-hinweis")), "Hinweis verschwindet nach „Verstanden“");
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n  " + fehler.join("\n  ")); process.exit(1); }
  console.log("✅ Robustheit: alle Prüfungen bestanden.");
})();
