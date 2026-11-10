// Playwright-Test: Installations-Hinweis beim Start im Browser (Muster aus dem Repo „idlegame“). iPad/Safari: Vollbild-Hinweis mit der
// Safari-Anleitung und der iOS-Warnung, „Ohne Installation im Browser weiter“ echt angetippt → 6 Stunden Ruhe, danach wieder; Android/Chrome
// mit „Jetzt installieren“ (nachgebildetes beforeinstallprompt); In-App-Browser mit „Adresse kopieren“; nie in der installierten App, nie am
// Computer, nie nach „Ausblenden“ im Elternbereich; Russisch nur mit Hilfesprache; Handy passt ins Bild. Dazu die Erkennung für 12 Browser.
// Aufruf: sh tests/laufen.sh installhinweis   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const I = require("../shared/installhinweis.js");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource|open-meteo/;
process.on("unhandledRejection", (e) => { console.log("❌ Abbruch: " + e.message + "\n  " + (global.__fehler || []).join("\n  ")); process.exit(1); });
const UA = {
  ipad: "Mozilla/5.0 (iPad; CPU OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1",
  ipadDesktop: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15",
  iphoneChrome: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/130.0.0.0 Mobile/15E148 Safari/604.1",
  iphoneFirefox: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/131.0 Mobile/15E148 Safari/605.1.15",
  android: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
  samsung: "Mozilla/5.0 (Linux; Android 14; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/26.0 Chrome/122.0.0.0 Safari/537.36",
  androidFirefox: "Mozilla/5.0 (Android 14; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0",
  whatsapp: "Mozilla/5.0 (Linux; Android 14; Pixel 8; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0.0.0 Mobile Safari/537.36 WhatsApp/2.24",
  pc: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
};

(async () => {
  const fehler = global.__fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  // ---------- Erkennung und Regeln (ohne Browser) ----------
  const k = (ua, touch = 5, platform = "") => { const p = I.plattform(ua, touch, platform); return p.os === "desktop" ? "desktop" : I.schritteKey(p.os, p.browser); };
  const soll = { ipad: "ios-safari", iphoneChrome: "ios-chrome", iphoneFirefox: "ios-firefox", android: "android-chrome", samsung: "android-samsung", androidFirefox: "android-firefox", whatsapp: "inapp" };
  erwarte(Object.keys(soll).every(n => k(UA[n]) === soll[n]), `Erkennung: ${Object.keys(soll).map(n => `${n} → ${k(UA[n])}`).join(", ")}`);
  erwarte(k(UA.ipadDesktop, 5, "MacIntel") === "ios-safari" && k(UA.ipadDesktop, 0, "MacIntel") === "desktop" && k(UA.pc, 0, "Win32") === "desktop", "iPad mit Desktop-Kennung (MacIntel + Touch) zählt als iPad, Mac und PC als Computer");
  erwarte(Object.values(I.T.schritte).every(l => l.length >= 2 && l.every(x => x.de && x.ru)), "jede Anleitung hat mindestens 2 Schritte, je deutsch und russisch");
  const r = (o) => I.sollZeigen(Object.assign({ aus: false, alsApp: false, os: "ios", uebersprungen: false, webdriver: false, erzwungen: false }, o));
  erwarte(r({}) && !r({ alsApp: true }) && !r({ os: "desktop" }) && !r({ uebersprungen: true }) && !r({ aus: true }) && !r({ webdriver: true }) && r({ webdriver: true, erzwungen: true }) && !r({ alsApp: true, erzwungen: true }),
    "Regeln: im Browser ja – nicht als App, nicht am Computer, nicht nach „weiter“, nicht nach Ausblenden, im Test nur erzwungen");

  const browser = await chromium.launch();
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };
  async function seite(ua, { breite = 820, hoehe = 1148, init = null } = {}) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true, userAgent: ua, serviceWorkers: "block", permissions: ["clipboard-read", "clipboard-write"] });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
    if (init) await ctx.addInitScript(init);
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    return { ctx, p };
  }
  const offen = (p) => p.evaluate(() => !!document.getElementById("installhinweis"));
  const warte = (p) => p.waitForFunction(() => window.__installHinweis, null, { timeout: 15000 }).then(() => p.waitForTimeout(1100));

  // ---------- iPad, Safari: erster Besuch landet im Elternbereich ----------
  {
    const { ctx, p } = await seite(UA.ipad);
    await p.goto(BASIS + "?installHinweis=1"); await p.waitForURL(/eltern/);
    await p.goto(p.url().split("?")[0] + "?installHinweis=1"); await warte(p);
    erwarte(await offen(p), "iPad/Safari, erster Besuch (Elternbereich): der Hinweis erscheint");
    const t = await p.evaluate(() => { const e = document.getElementById("installhinweis"), k = e.querySelector(".ih-karte").getBoundingClientRect();
      return { key: e.dataset.schritte, titel: e.querySelector("h2").textContent, erkannt: e.querySelector(".ih-erkannt").textContent, schritte: [...e.querySelectorAll(".ih-schritte li")].map(x => x.textContent.trim()),
        teilen: e.querySelectorAll(".ih-schritte .ih-teilen").length, warnung: [...e.querySelectorAll(".ih-wichtig")].map(x => x.textContent), jetzt: e.querySelector("#ih-jetzt").hidden, kopieren: e.querySelector("#ih-kopieren").hidden,
        imBild: k.top >= 0 && k.left >= 0 && k.right <= innerWidth && k.bottom <= innerHeight, ru: e.querySelectorAll(".ru").length, icon: e.querySelector("img").naturalWidth, modal: e.getAttribute("aria-modal") }; });
    erwarte(t.key === "ios-safari" && /Zuerst die App installieren/.test(t.titel) && /iPad \/ iPhone · Safari/.test(t.erkannt), `Titel und „Erkannt: iPad / iPhone · Safari“ (${t.erkannt.trim()})`);
    erwarte(t.schritte.length === 3 && /Teilen-Symbol/.test(t.schritte[0]) && /Zum Home-Bildschirm/.test(t.schritte[1]) && /Hinzufügen/.test(t.schritte[2]) && t.teilen === 1, "drei Schritte für Safari mit gezeichnetem Teilen-Symbol");
    erwarte(t.warnung.length === 2 && /nicht von selbst in die installierte App/.test(t.warnung[0]) && /Spielstand sichern/.test(t.warnung[1]), "iOS-Warnung (eigener Speicher der App) und Hinweis zum Mitnehmen des Spielstands");
    erwarte(t.jetzt && t.kopieren && t.imBild && t.ru === 0 && t.icon === 192 && t.modal === "true", "kein Installieren-Knopf auf iOS, Karte ganz im Bild, ohne Hilfesprache kein Russisch, neues Icon geladen");
    await bild(p, "installhinweis-ipad");
    // „Ohne Installation im Browser weiter“ echt antippen
    await p.click("#ih-weiter"); await p.waitForTimeout(150);
    erwarte(!(await offen(p)) && await p.isVisible("#pin1"), "„Ohne Installation im Browser weiter“ schließt – die Einrichtung geht weiter");
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok"); await p.waitForSelector("#e-name");
    await p.fill("#e-name", "Mira"); await p.selectOption("#e-sprache", "ru"); await p.click("#e-ok"); await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    await p.goto(BASIS + "?installHinweis=1"); await warte(p);
    erwarte(!(await offen(p)), "Startseite gleich danach: kein Hinweis (6 Stunden Ruhe)");
    // 7 Stunden später: wieder da, jetzt mit Russisch (Hilfesprache gewählt), auf der Startseite
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 22, 5).getTime(); });
    await p.goto(BASIS + "?installHinweis=1"); await warte(p);
    const sp = await p.evaluate(() => { const e = document.getElementById("installhinweis"); return e ? { ru: e.querySelectorAll('.ru[lang="ru"]').length, kyr: /[а-яё]/i.test(e.textContent) } : null; });
    erwarte(sp && sp.ru >= 8 && sp.kyr, `7 Stunden später kommt der Hinweis wieder – mit Hilfesprache Russisch zweisprachig (${sp ? sp.ru : 0} russische Zeilen)`);
    await bild(p, "installhinweis-ipad-ru");
    // Eltern blenden die Karte „Home-Bildschirm“ aus → nie wieder
    await p.evaluate(() => { const e = Spielwelt.lade("eltern"); e.homeHinweis = "aus"; Spielwelt.speichere("eltern", e); localStorage.removeItem(__installHinweis.KEY); });
    await p.goto(BASIS + "?installHinweis=1"); await warte(p);
    erwarte(!(await offen(p)), "nach „Ausblenden“ im Elternbereich erscheint der Hinweis nicht mehr");
    await ctx.close();
  }
  // ---------- als App vom Home-Bildschirm und am Computer: nie ----------
  {
    const a = await seite(UA.ipad, { init: () => { window.__standalone = true; } });
    await a.p.goto(BASIS + "spiele/eltern/?installHinweis=1"); await warte(a.p);
    erwarte(!(await offen(a.p)), "installierte App (Home-Bildschirm): kein Hinweis");
    await a.ctx.close();
    const c = await seite(UA.pc, { breite: 1280, hoehe: 800 });
    await c.p.goto(BASIS + "spiele/eltern/?installHinweis=1"); await warte(c.p);
    erwarte(!(await offen(c.p)), "Computer: kein Hinweis");
    await c.ctx.close();
    const o = await seite(UA.ipad);
    await o.p.goto(BASIS + "spiele/eltern/"); await warte(o.p);
    erwarte(!(await offen(o.p)), "automatischer Browser ohne ?installHinweis=1: kein Hinweis (andere Tests bleiben ungestört)");
    await o.ctx.close();
  }
  // ---------- Android, Chrome auf dem Handy: „Jetzt installieren“ ----------
  {
    const { ctx, p } = await seite(UA.android, { breite: 390, hoehe: 760 });
    await p.goto(BASIS + "spiele/eltern/?installHinweis=1"); await warte(p);
    const t = await p.evaluate(() => { const e = document.getElementById("installhinweis"), k = e.querySelector(".ih-karte").getBoundingClientRect();
      return { key: e.dataset.schritte, jetzt: e.querySelector("#ih-jetzt").hidden, warnungen: e.querySelectorAll(".ih-wichtig").length, breit: k.right <= innerWidth && k.left >= 0, rollbar: e.scrollHeight >= e.clientHeight, sw: document.documentElement.scrollWidth <= innerWidth }; });
    erwarte(t.key === "android-chrome" && t.jetzt && t.warnungen === 1 && t.breit && t.sw, "Android/Chrome auf dem Handy: Menü-Anleitung, keine iOS-Warnung, Karte passt in die Breite");
    // der Browser bietet die Installation an
    await p.evaluate(() => { window.__gefragt = 0; const e = new Event("beforeinstallprompt"); e.prompt = () => { window.__gefragt++; return Promise.resolve(); }; e.userChoice = Promise.resolve({ outcome: "accepted" }); window.dispatchEvent(e); });
    erwarte(await p.isVisible("#ih-jetzt"), "sobald der Browser die Installation anbietet, erscheint „📲 Jetzt installieren“");
    await bild(p, "installhinweis-android");
    await p.click("#ih-jetzt"); await p.waitForTimeout(200);
    erwarte(await p.evaluate(() => window.__gefragt) === 1 && !(await offen(p)), "Antippen öffnet die Installation des Browsers; nach „Installieren“ schließt der Hinweis");
    await ctx.close();
  }
  // ---------- In-App-Browser (z. B. aus WhatsApp): Adresse kopieren ----------
  {
    const { ctx, p } = await seite(UA.whatsapp, { breite: 390, hoehe: 760 });
    await p.goto(BASIS + "spiele/eltern/?installHinweis=1"); await warte(p);
    const t = await p.evaluate(() => { const e = document.getElementById("installhinweis"); return { key: e.dataset.schritte, kopieren: !e.querySelector("#ih-kopieren").hidden, text: e.querySelector(".ih-schritte").textContent }; });
    erwarte(t.key === "inapp" && t.kopieren && /Im Browser öffnen/.test(t.text), "In-App-Browser: Erklärung „Im Browser öffnen“ und Knopf „Adresse kopieren“");
    await p.click("#ih-kopieren"); await p.waitForTimeout(200);
    const adr = await p.evaluate(() => navigator.clipboard.readText().catch(() => ""));
    erwarte(adr === BASIS && /kopiert/.test(await p.textContent("#ih-kopieren")), `„Adresse kopieren“ legt die Startadresse in die Zwischenablage (${adr})`);
    await ctx.close();
  }
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Installations-Hinweis: Test bestanden.");
})();
