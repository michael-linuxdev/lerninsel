// Test QR-Geschenk (NA-16, 30.10.2026): signierte Codes mit dem TEST-Schlüssel (tests/geschenk-testschluessel.json, nie der echte).
// Elternbereich „Kinder & Gerät“: ohne Schlüssel freundlich abgelehnt; echter Code eingelöst (echt getippt), doppelt/gefälscht/verändert/
// unbekannt/falsches Format abgelehnt; zweites Kind darf denselben Code einmal. Insel: Paket am Steg, Szene „Ein Geschenk am Steg“,
// Paket öffnen → Tannenbaum steht im Zimmer, Zettel-Text; Sterne-Geschenk zählt. Generator: Schlüssel nie im Repo, QR als SVG.
// Aufruf: sh tests/laufen.sh geschenk (allein laufen lassen, 3D)
const { chromium } = require("playwright");
const path = require("path"), fs = require("fs"), { execFileSync } = require("child_process");
const { baueCode, qrSvg } = require("../quellen/geschenk-erzeugen.js");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;
const TEST = JSON.parse(fs.readFileSync(path.join(__dirname, "geschenk-testschluessel.json"), "utf8"));

(async () => {
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };

  // ---------- Codes (Node) ----------
  const echt = await baueCode(TEST.privat, { i: "test-tanne", g: "tannenbaum", n: "Frohe Weihnachten!" });
  const sterne = await baueCode(TEST.privat, { i: "test-sterne", g: "sterne:5" });
  const unbekannt = await baueCode(TEST.privat, { i: "test-drache", g: "drache" });
  const { webcrypto } = require("crypto");
  const fremd = await webcrypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign"]);
  const gefaelscht = await baueCode(await webcrypto.subtle.exportKey("jwk", fremd.privateKey), { i: "test-tanne2", g: "tannenbaum" });
  const [, d, s] = echt.split("."), verändert = `LG1.${Buffer.from(JSON.stringify({ i: "test-tanne", g: "sterne:10" })).toString("base64url")}.${s}`;
  erwarte(/^LG1\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(echt) && d.length > 10, "Generator baut Codes im Format LG1.<Daten>.<Signatur>");
  erwarte(/^<svg/.test(qrSvg(echt)), "Generator schreibt den QR-Code als SVG");
  let imRepo = false; try { execFileSync("node", [path.join(__dirname, "../quellen/geschenk-erzeugen.js"), "schluessel", path.join(__dirname, "tmp-geheim")], { stdio: "pipe" }); } catch (e) { imRepo = /nicht im Repo/.test(String(e.stderr)); }
  erwarte(imRepo && !fs.existsSync(path.join(__dirname, "tmp-geheim")), "Generator legt den privaten Schlüssel nie im Repo ab");
  erwarte(await page_check_echt_schluessel(), "In der App steht kein Test-Schlüssel (OEFFENTLICH ist nicht der Test-Schlüssel)");
  async function page_check_echt_schluessel() { const t = fs.readFileSync(path.join(__dirname, "../shared/geschenk.js"), "utf8"); return !t.includes(TEST.oeffentlich.x) && !/"d"\s*:/.test(t); }

  const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
  const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true, serviceWorkers: "block" });
  await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__elternAlle = true; window.__keinSparen = true; });
  const p = await ctx.newPage();
  p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
  p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
  await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
  await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
  await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
  await p.evaluate(() => { const m = Spielwelt.lade("medien") || {}; m.lektionen = { bedienung: 3 }; Spielwelt.speichere("medien", m);
    ["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9"].forEach(e => Story.etappeFertig(e, true)); Story.merkeSzene("sonne"); Story.setzeKapitel(1); for (let i = 0; i < 12; i++) Zeit.aufgabe(); });

  const eltern = async () => {
    await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(400);
    if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.waitForTimeout(500); }
    await p.click('.eltern-reiter [data-teil="kinder"]').catch(() => {});
  };
  const loese = async (code) => { await p.fill("#geschenk-text", ""); await p.type("#geschenk-text", code, { delay: 0 }); await p.click("#geschenk-ok"); await p.waitForTimeout(300); return p.evaluate(() => document.getElementById("geschenk-meldung").textContent); };

  // ---------- Elternbereich ohne Schlüssel ----------
  await eltern();
  erwarte(await p.evaluate(() => !!document.getElementById("geschenk-karte") && /noch nicht eingerichtet/.test(document.getElementById("geschenk-karte").textContent)), "Karte „Geschenk-Code einlösen“ im Teil „Kinder & Gerät“, Hinweis: noch nicht eingerichtet");
  erwarte(/noch nicht eingerichtet/.test(await loese(echt)) && await p.evaluate(() => Geschenk.pakete().length === 0), "ohne öffentlichen Schlüssel wird auch ein echter Code abgelehnt");

  // ---------- mit Test-Schlüssel ----------
  await p.evaluate((k) => Geschenk._testSchluessel(k), TEST.oeffentlich);
  let m = await loese(echt);
  erwarte(/Eingelöst/.test(m) && /Tannenbaum/.test(m) && await p.evaluate(() => Geschenk.pakete().length === 1 && Story.hatGeschenk("qr:test-tanne")), `echter Code eingelöst: „${m}“`);
  await bild(p, "geschenk-eltern");
  erwarte(/schon eingelöst/.test(await loese(echt)) && await p.evaluate(() => Geschenk.pakete().length === 1), "derselbe Code ein zweites Mal: freundlich abgelehnt");
  erwarte(/nicht echt/.test(await loese(gefaelscht)), "Code mit fremdem Schlüssel: als gefälscht erkannt");
  erwarte(/nicht echt/.test(await loese(verändert)), "veränderter Inhalt (Sterne statt Tanne): als gefälscht erkannt");
  erwarte(/kennt die App nicht/.test(await loese(unbekannt)), "unbekanntes Geschenk: abgelehnt");
  erwarte(/kein Geschenk-Code/.test(await loese("Hallo Welt")), "Text ohne Code: abgelehnt");
  erwarte(/Eingelöst/.test(await loese(sterne)), "Sterne-Geschenk eingelöst");

  // ---------- Insel: Paket am Steg ----------
  await p.addInitScript((k) => { addEventListener("DOMContentLoaded", () => { if (window.Geschenk) Geschenk._testSchluessel(k); }); }, TEST.oeffentlich);
  await p.goto(BASIS + "spiele/welt3d/heimat.html?stunde=14");
  await p.waitForFunction(() => window.__szene && __szene.aktuell() && __szene.aktuell().id === "geschenkpaket", null, { timeout: 20000 });
  erwarte(await p.evaluate(() => !!__heimat.paket && __szene.aktuell().wer === "robo" && /Geschenk/.test(__szene.aktuell().text)), "Insel: Paket am Steg, Robo erzählt vom Geschenk (nicht weihnachtlich)");
  erwarte(await p.evaluate(() => { const a = InselKern.MOEBEL.map(x => x.id).sort().join(), b = InselKern.MOEBEL.filter(x => Geschenk.beschreibe("moebel:" + x.id)).map(x => x.id).sort().join(); return a === b; }), "alle Möbel des Ladens sind als Geschenk bekannt (Liste in geschenk.js aktuell)");
  await bild(p, "geschenk-insel");
  await p.evaluate(() => { Szene.abbrechen(); });
  const sterneVorher = await p.evaluate(() => Spielwelt.sterne());
  await p.evaluate(() => __heimat.oeffnePaket()); await p.waitForTimeout(400);
  const b1 = await p.evaluate(() => ({ titel: document.getElementById("blase-titel").textContent, text: document.getElementById("blase-text").textContent, zimmer: JSON.stringify(__heimat.zimmerDaten().plaetze), paket: !!__heimat.paket }));
  erwarte(/Geschenk/.test(b1.titel) && /Tannenbaum/.test(b1.text) && /Frohe Weihnachten!/.test(b1.text) && /tannenbaum/.test(b1.zimmer), `Paket geöffnet: Tannenbaum steht im Zimmer, Zettel „Frohe Weihnachten!“ (${b1.text})`);
  erwarte(b1.paket, "das zweite Paket (Sterne) liegt danach am Steg");
  await p.evaluate(() => { document.getElementById("blase").hidden = true; __heimat.oeffnePaket(); }); await p.waitForTimeout(400);
  erwarte(await p.evaluate((v) => Spielwelt.sterne() === v + 5 && !__heimat.paket && Geschenk.pakete().length === 0, sterneVorher), "zweites Paket: +5 Sterne, kein Paket mehr");
  await p.goto(BASIS + "spiele/welt3d/heimat.html?stunde=14"); await p.waitForTimeout(3000);
  erwarte(await p.evaluate(() => !__heimat.paket && !(window.__szene && __szene.aktuell() && __szene.aktuell().id === "geschenkpaket")), "nach dem Neuladen: kein Paket, keine Szene");

  // ---------- zweites Kind: derselbe Code einmal ----------
  await p.evaluate(() => { const id = Spielwelt.neuesKind(); Spielwelt.wechsleKind ? Spielwelt.wechsleKind(id) : null; });
  await eltern();
  if (await p.$("#e-name")) { await p.fill("#e-name", "Leon"); await p.click("#e-ok"); await eltern(); }
  await p.evaluate((k) => Geschenk._testSchluessel(k), TEST.oeffentlich);
  const kind2 = await p.evaluate(() => Spielwelt.profil.name);
  erwarte(kind2 !== "Mira" && /Eingelöst/.test(await loese(echt)), `zweites Kind (${kind2}): derselbe Code gilt einmal je Kind`);

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Geschenk-Test (QR, signiert) bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
