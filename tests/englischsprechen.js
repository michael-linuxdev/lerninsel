// Test „Englisch: Sprechen, Hören, kleine Dialoge“ (07.11.2026): echt durchgeklickt bis zum Ende
// - Dialog: Begleiter (Zeichnung, kein Emoji) fragt, Frage erst nach 🔊 sichtbar und auf Englisch gesprochen (nachgebildete Gerätestimme), falsche Karte zählt einmal,
//   richtige Karte → „Jetzt du!“ mit 🔊 Vorsprechen; mit Eltern-Erlaubnis (eigener Schalter im Elternbereich) Aufnahme mit Fake-Mikrofon, sich anhören, 🔁 nochmal, 👍
// - Nachsprechen-Schritt nur mit Erlaubnis; ohne Erlaubnis kein Mikrofon-Knopf; Mikrofon verweigert → freundlich weiter
// - Hörgeschichte: Text erst nach dem Hören, Fragen mit Bild-Antworten (eine falsch), danach Text zum Mitlesen; ohne englische Stimme steht der Text gleich da
// - Rollenspiel mit Paula im Café: Verlauf wächst Zug um Zug
// - Vorlesen nur auf Knopfdruck: ohne Antippen von 🔊 wird nichts Englisches gesprochen
// - Russisch: Anleitung als Entwurf über den RU-Knopf; Handy 390 × 760 und iPad hoch ohne Scrollleiste
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch({ args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", "--autoplay-policy=no-user-gesture-required"] });
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };
  const passt = (p) => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);

  async function kind({ stufe = "4", breite = 1180, hoehe = 820, stimme = true, ohneMikro = false, ru = false } = {}) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true, serviceWorkers: "block" });
    await ctx.addInitScript((stimme) => {
      window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__elternAlle = true; window.__testSchnell = true;
      // Gerätestimme nachbilden (die echte Sprache.sprich mit der Knopfdruck-Regel läuft): zeichnet Text und Sprache auf
      window.__gesagt = [];
      const stimmen = stimme ? [{ lang: "en-GB", name: "Daniel", default: true, localService: true }, { lang: "de-DE", name: "Anna", default: false, localService: true }] : [{ lang: "de-DE", name: "Anna", default: true, localService: true }];
      const fake = { speaking: false, pending: false, paused: false, speak(u) { window.__gesagt.push([u.text, u.lang]); setTimeout(() => u.onend && u.onend(), 20); }, cancel() {}, resume() {}, getVoices() { return stimmen; }, addEventListener() {} };
      Object.defineProperty(window, "speechSynthesis", { value: fake, configurable: true });
      window.SpeechSynthesisUtterance = function (t) { this.text = t; };
    }, stimme);
    if (ohneMikro) await ctx.addInitScript(() => { navigator.mediaDevices.getUserMedia = () => Promise.reject(new DOMException("verweigert", "NotAllowedError")); });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", stufe);
    if (ru) { await p.selectOption("#e-sprache", "ru"); await p.selectOption("#e-dosis", "immer"); }
    await p.click("#e-ok"); await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    return { ctx, p };
  }
  // Elternbereich: eigener Schalter „Englisch: sich beim Nachsprechen aufnehmen“ echt angetippt
  async function erlaube(p, an) {
    await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(300);
    if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); }
    await p.waitForSelector("#en-aufnehmen"); await p.setChecked("#en-aufnehmen", an); await p.click("#en-speichern"); await p.waitForTimeout(150);
    await p.goto(BASIS + "spiele/englisch/"); await p.waitForTimeout(400);
  }
  const starte = (p, id) => p.evaluate((id) => { window.__gesagt = []; __englisch.starte(ENGLISCH.findIndex(k => k.id === id)); }, id);
  const lage = (p) => p.evaluate(() => { const l = __englisch.lauf; return { ende: !document.getElementById("ende-ansicht").hidden, pos: l && l.pos, s: l && l.schritte[l.pos] && JSON.parse(JSON.stringify(l.schritte[l.pos])) }; });
  const englischGesagt = (p) => p.evaluate(() => window.__gesagt.filter(([t, l]) => /^en/.test(l) && String(t).trim()).map(([t]) => t));
  const nr = (p, t) => p.evaluate((t) => [...document.querySelectorAll("#aufgabe .option")].findIndex(b => b.textContent.trim() === t), t);
  const tippe = async (p, t) => { const n = await nr(p, t); if (n < 0) throw new Error("Karte fehlt: " + t); await p.click(`#aufgabe .option >> nth=${n}`); };
  async function aufnehmen(p) {
    await p.click("#en-aufnahme"); await p.waitForSelector("#en-aufnahme.laeuft", { timeout: 5000 }); await p.waitForTimeout(1200);
    await p.click("#en-aufnahme", { force: true }); await p.waitForSelector("#vergleich:not([hidden])", { timeout: 5000 });
  }

  // Eine Lektion echt durchspielen. hooks: { dialog(p, s, l), hg(p, s), frage(p, s), nachsprechen(p, s) } – ohne Hook gilt der kürzeste Weg.
  async function durch(p, id, hooks = {}, art = "quer") {
    await starte(p, id); await p.waitForTimeout(150);
    let ok = true;
    for (let runde = 0; runde < 90; runde++) {
      const l = await lage(p);
      if (l.ende || !l.s) break;
      if (!(await passt(p))) { ok = false; console.log(`    Scrollleiste: ${id} Schritt ${l.pos} (${l.s.typ}, ${art})`); }
      const s = l.s;
      if (s.typ === "lied") { await p.click("#weiter"); continue; }
      if (["sag", "karten", "buch", "sachtext", "rolle", "hg-text"].includes(s.typ)) { if (s.typ === "hg-text" && hooks.text) await hooks.text(p, s); await p.click("#weiter"); await p.waitForTimeout(40); continue; }
      if (s.typ === "hg") { if (hooks.hg) await hooks.hg(p, s); else { if (await p.$("#hg-hoeren")) await p.click("#hg-hoeren"); await p.click("#weiter"); } await p.waitForTimeout(40); continue; }
      if (s.typ === "nachsprechen") { if (hooks.nachsprechen) await hooks.nachsprechen(p, s); else await p.click("#sprech #weiter"); await p.waitForTimeout(40); continue; }
      if (s.typ === "dialog") {
        if (hooks.dialog && await hooks.dialog(p, s, l)) continue;
        await tippe(p, s.optionen[0].replace("{name}", "Mira")); await p.waitForSelector("#sprech #weiter", { timeout: 3000 }); await p.click("#sprech #weiter"); await p.waitForTimeout(40); continue;
      }
      if (s.typ === "hg-frage") { if (hooks.frage) await hooks.frage(p, s); await tippe(p, s.f.optionen[0]); }
      else if (s.typ === "lesen" || s.typ === "hoeren") { if (s.typ === "hoeren") await p.click("#hoeren"); await p.locator("#aufgabe .option", { hasText: s.wort.e }).first().click(); }
      else if (s.typ === "deutsch") await tippe(p, s.wort.en);
      else if (s.typ === "wahl") await tippe(p, s.optionen[0]);
      else if (s.typ === "satz") { for (const w of s.woerter) await p.click(`#chips .chip:not(.weg) >> text="${w}"`); await p.click("#pruefen"); }
      else { ok = false; console.log(`    unbekannter Schritt ${s.typ}`); break; }
      await p.waitForTimeout(40);
      if (!(await p.evaluate(() => document.getElementById("hinweis").classList.contains("gut")))) { ok = false; console.log(`    nicht angenommen: ${id} Schritt ${l.pos} (${s.typ})`); break; }
      await p.evaluate((pos) => __englisch.schritt(pos + 1), l.pos);
    }
    const ende = await p.evaluate(() => ({ an: !document.getElementById("ende-ansicht").hidden, text: document.getElementById("ende-text").textContent }));
    return { ok: ok && ende.an, text: ende.text };
  }

  // ---------- 1. iPad quer, Kl. 4, Hilfesprache Russisch, Aufnahme erlaubt: Dialog mit Fehler, Nachsprechen mit Fake-Mikrofon ----------
  {
    const { ctx, p } = await kind({ ru: true });
    await erlaube(p, true);
    erwarte(await p.evaluate(() => Spielwelt.lade("eltern").englisch.aufnehmen === true && Eigenes.darfAufnehmen("englisch") && !Eigenes.darfAufnehmen("deutsch")),
      "Elternbereich: eigener Schalter für Englisch-Aufnahmen gespeichert (Deutsch bleibt aus)");
    let erster = true, dialoge = 0, nachgesprochen = 0;
    const r = await durch(p, "en-hello", {
      async dialog(p, s) {
        dialoge++;
        if (!erster) return false;
        erster = false;
        await p.waitForTimeout(2700); await p.evaluate(() => { window.__gesagt = []; }); await p.waitForTimeout(400);   // Knopfdruck-Fenster des vorigen 🔊 abwarten
        const vorher = await p.evaluate(() => ({ versteckt: document.getElementById("dlg-frage").hidden, figur: !!document.querySelector(".dlg-figur svg"),
          emoji: /[\u{1F916}\u{1F989}\u{1F98A}\u{1F9AB}\u{1F43B}\u{1F99C}\u{1F422}]/u.test(document.querySelector(".dlg-zeile").textContent) }));
        erwarte(vorher.versteckt && vorher.figur && !vorher.emoji, "Dialog: Robo als Zeichnung (kein Emoji), die Frage ist vor dem Hören versteckt");
        erwarte((await englischGesagt(p)).length === 0, "Vorlesen nur auf Knopfdruck: ohne 🔊 wird nichts Englisches gesprochen");
        await bild(p, "ensprechen-dialog-quer");
        // Russisch: Anleitung über den RU-Knopf, englische Sätze bleiben englisch
        await p.click("#ru-knopf"); await p.waitForTimeout(100);
        const ru = await p.evaluate(() => document.getElementById("ru-text").textContent);
        erwarte(/[А-Яа-я]/.test(ru) && !/What's your name/.test(ru), `Russisch: Anleitung als Entwurf („${ru.slice(0, 40)} …“), die englische Frage nicht übersetzt`);
        await bild(p, "ensprechen-dialog-russisch");
        await p.click("#dlg-hoeren"); await p.waitForTimeout(100);
        const g = await englischGesagt(p);
        erwarte(g.some(t => /What's your name/.test(t)) && await p.evaluate(() => !document.getElementById("dlg-frage").hidden), `🔊: Robos Frage auf Englisch gesprochen („${g[0] || ""}“) und jetzt sichtbar`);
        await tippe(p, "Good night! I'm eight."); await p.waitForTimeout(80);
        erwarte(await p.evaluate(() => document.getElementById("hinweis").classList.contains("nein") && __englisch.lauf.fehler === 1 && !document.getElementById("sprech")), "falsche Antwortkarte: „Fast!“, zählt einmal, noch kein Nachsprechen");
        await tippe(p, "Good morning! My name is Mira.");
        await p.waitForSelector("#sprech", { timeout: 3000 });
        const sp = await p.evaluate(() => ({ satz: document.querySelector(".sprech-satz").textContent, mikro: !!document.getElementById("en-aufnahme") }));
        erwarte(sp.satz === "Good morning! My name is Mira." && sp.mikro, "richtige Karte → „Jetzt du!“ mit dem Satz (Name des Kindes eingesetzt) und Mikrofon");
        await p.evaluate(() => { window.__gesagt = []; }); await p.click("#vorbild"); await p.waitForTimeout(100);
        erwarte((await englischGesagt(p)).includes("Good morning! My name is Mira."), "🔊 Vorsprechen: der Satz wird auf Englisch vorgesprochen");
        await aufnehmen(p);
        await bild(p, "ensprechen-vergleich-quer");
        await p.click("#mich-hoeren"); await p.waitForTimeout(200);
        await p.click("#noch-einmal"); await p.waitForSelector("#en-aufnahme.laeuft", { timeout: 5000 }); await p.waitForTimeout(900);
        await p.click("#en-aufnahme", { force: true }); await p.waitForSelector("#vergleich:not([hidden])", { timeout: 5000 });
        const pos = await p.evaluate(() => __englisch.lauf.pos);
        await p.click("#gleich"); await p.waitForTimeout(80);
        erwarte(await p.evaluate((pos) => __englisch.lauf.pos === pos + 1 && __englisch.lauf.fehler === 1, pos), "Aufnehmen, anhören, 🔁 nochmal, 👍 „Klang es gleich?“ → weiter, die Selbsteinschätzung zählt nicht als Fehler");
        return true;
      },
      async nachsprechen(p, s) {
        nachgesprochen++;
        const t = await p.evaluate(() => document.querySelector(".sprech-satz").textContent);
        await aufnehmen(p); await p.click("#gleich");
        erwarte(t === "Thank you!", "Nachsprechen-Schritt „Thank you!“ mit Aufnahme und Selbstvergleich");
      }
    });
    erwarte(r.ok && /zweiten Versuch/.test(r.text) && dialoge === 3 && nachgesprochen === 1, `„Hello!“ mit drei Dialogen und Nachsprechen bis zum Ende, der eine Fehler steht am Ende (${r.text})`);
    const heft = await p.evaluate(() => Eigenes.alle().then(l => l.length));
    erwarte(heft === 0, "Nachsprech-Aufnahmen werden nicht gespeichert (Mein Heft bleibt leer)");

    // Hörgeschichte „Paula's house“: Text erst nach dem Hören, eine Frage zuerst falsch
    let hgOk = false, textOk = false, falsch = true;
    const r2 = await durch(p, "en-home", {
      async hg(p, s) {
        await p.waitForTimeout(2700); await p.evaluate(() => { window.__gesagt = []; }); await p.waitForTimeout(400);
        const vor = await p.evaluate(() => ({ text: !!document.querySelector(".hg-text"), weiter: document.getElementById("weiter").disabled }));
        const stumm = (await englischGesagt(p)).length === 0;
        await bild(p, "ensprechen-hoergeschichte-quer");
        await p.click("#hg-hoeren"); await p.waitForTimeout(100);
        const g = await englischGesagt(p);
        hgOk = !vor.text && vor.weiter && stumm && g.some(t => /Welcome to my house/.test(t) && /garden/.test(t)) && await p.evaluate(() => !document.getElementById("weiter").disabled);
        await p.click("#weiter");
      },
      async frage(p, s) {
        if (!falsch) return;
        falsch = false;
        erwarte(await p.evaluate(() => !document.querySelector(".hg-text") && !!document.getElementById("hg-nochmal")), "Frage zur Hörgeschichte: Text noch versteckt, 🔊 „Nochmal anhören“ da");
        await tippe(p, s.f.optionen[1]); await p.waitForTimeout(60);
        erwarte(await p.evaluate(() => document.getElementById("hinweis").classList.contains("nein")), "falsches Bild bei der Hörfrage wird erkannt");
        await bild(p, "ensprechen-hoerfrage-quer");
      },
      async text(p) { textOk = await p.evaluate(() => /Welcome to my house/.test(document.querySelector(".hg-text").textContent)); await bild(p, "ensprechen-hoertext-quer"); }
    });
    erwarte(hgOk, "Hörgeschichte: erst nichts gesprochen und kein Text, 🔊 liest die ganze Geschichte auf Englisch, dann „Zu den Fragen“");
    erwarte(r2.ok && textOk && /zweiten Versuch/.test(r2.text), "„At home“: Hörgeschichte mit drei Bildfragen, danach der Text zum Mitlesen, bis zum Ende");

    // Rollenspiel mit Paula im Café: der Verlauf wächst Zug um Zug
    const verlauf = [];
    const r3 = await durch(p, "en-cafe", { async dialog(p, s) { verlauf.push(await p.evaluate(() => document.querySelectorAll(".dlg-verlauf p").length)); if (verlauf.length === 3) await bild(p, "ensprechen-cafe-quer"); return false; } });
    erwarte(r3.ok && verlauf.join() === "0,2,4,6", `Rollenspiel „In Paula's café“: vier Züge, Verlauf ${verlauf.join("/")} Zeilen, bis zum Ende`);
    await ctx.close();
  }

  // ---------- 2. Ohne Erlaubnis: kein Nachsprech-Schritt, kein Mikrofon; Mikrofon verweigert → freundlich weiter ----------
  {
    const { ctx, p } = await kind({ stufe: "3" });
    await p.goto(BASIS + "spiele/englisch/"); await p.waitForTimeout(400);
    let mikro = false;
    const r = await durch(p, "en-hello", { async dialog(p, s) { await tippe(p, s.optionen[0].replace("{name}", "Mira")); await p.waitForSelector("#sprech #weiter");
      mikro = mikro || await p.evaluate(() => !!document.getElementById("en-aufnahme") || document.getElementById("weiter").textContent !== "✅ Gesagt!"); await p.click("#sprech #weiter"); return true; } });
    const schritte = await p.evaluate(() => __englisch.lauf.schritte.map(s => s.typ));
    erwarte(r.ok && !mikro && !schritte.includes("nachsprechen") && schritte.filter(t => t === "dialog").length === 3, "ohne Eltern-Erlaubnis: Dialoge mit „✅ Gesagt!“, kein Mikrofon, der Nachsprech-Schritt fällt still weg");
    await ctx.close();
  }
  {
    const { ctx, p } = await kind({ stufe: "3", ohneMikro: true });
    await erlaube(p, true);
    const r = await durch(p, "en-feelings", {
      async nachsprechen(p) {
        await p.click("#en-aufnahme"); await p.waitForFunction(() => /Mikrofon ist gerade aus/.test(document.getElementById("aufnahme-zeit").textContent));
        erwarte(await p.evaluate(() => document.getElementById("en-aufnahme").disabled && document.querySelector("#sprech #weiter").textContent === "✅ Gesagt!"), "Mikrofon verweigert: freundlicher Hinweis, „✅ Gesagt!“ führt weiter");
        await p.click("#sprech #weiter");
      }
    });
    erwarte(r.ok, "„How are you?“ trotz verweigertem Mikrofon bis zum Ende");
    await ctx.close();
  }

  // ---------- 3. Ohne englische Stimme: Frage und Geschichte stehen gleich zum Lesen da ----------
  {
    const { ctx, p } = await kind({ stimme: false });
    await p.goto(BASIS + "spiele/englisch/"); await p.waitForTimeout(400);
    let d = null, h = null;
    const r = await durch(p, "en-family", {
      async dialog(p) { d = await p.evaluate(() => !document.getElementById("dlg-frage").hidden && !document.getElementById("dlg-hoeren")); return false; },
      async hg(p) { h = await p.evaluate(() => !!document.querySelector(".hg-text") && !document.getElementById("weiter").disabled); await p.click("#weiter"); }
    });
    erwarte(r.ok && d && h, "ohne englische Stimme: Dialogfrage und Hörgeschichte stehen zum Lesen da, „Family“ bis zum Ende");
    await ctx.close();
  }

  // ---------- 4. Handy 390 × 760 (Russisch) und iPad hoch: ohne Scrollleiste bis zum Ende ----------
  for (const [breite, hoehe, art] of [[390, 760, "handy"], [820, 1180, "hoch"]]) {
    const { ctx, p } = await kind({ breite, hoehe, ru: art === "handy" });
    await erlaube(p, true);
    let gezeigt = false;
    const hooks = { async dialog(p, s) { if (gezeigt) return false; gezeigt = true; await bild(p, `ensprechen-dialog-${art}`);
      await tippe(p, s.optionen[0].replace("{name}", "Mira")); await p.waitForSelector("#sprech #weiter"); await bild(p, `ensprechen-sagen-${art}`);
      erwarte(await passt(p), `${art}: Nachsprechen ohne Scrollleiste`); await p.click("#sprech #weiter"); return true; },
      async frage(p) { await bild(p, `ensprechen-hoerfrage-${art}`); } };
    let ok = true;
    for (const id of ["en-subjects", "en-shopping", "en-trip"]) { gezeigt = false; const r = await durch(p, id, hooks, art); if (!r.ok || !/beim ersten Mal/.test(r.text)) { ok = false; console.log(`    ${art}: ${id} ${r.text}`); } }
    erwarte(ok, `${art}: „At school“ (Hörgeschichte, Uhrzeit), „Let's go shopping“ (Rollenspiel, Wunschliste) und „Trip“ (Fahrkarte, Weg) ohne Scrollleiste bis zum Ende`);
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Englisch-Sprechen-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
