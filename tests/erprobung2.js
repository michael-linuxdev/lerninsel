// Playwright-Test (Erprobungsdatei „ohne“, 11.11.2026): Benno steht innen auf dem Tafelrand neben der runden Ecke; Mein Tier scrollt auf dem iPad quer
// (1180 × 788, Home-Bildschirm-App) nicht mehr, der Ei-Hinweis ist ein helles Schild mit Umbruch; das Tier auf der Startseite hat mitwachsende Konturen;
// „Gemeinsam“ steht links unter den Tagesaufgaben; Kulissen-Meldung im richtigen Fall; „Heute noch spielen dürfen“ als erste Karte im Elternbereich
// (Knopf 35 Minuten und eigene Zahl echt angetippt); Leckerli-Meldung führt zum Tier.
// Aufruf: sh tests/laufen.sh erprobung2   (Screenshots mit BILDER=<ordner>)
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
  const ctx = await browser.newContext({ viewport: { width: 1180, height: 788 }, hasTouch: true, serviceWorkers: "block" });
  await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
  const p = await ctx.newPage();
  p.on("pageerror", e => fehler.push(`Seitenfehler ${p.url()}: ${e.message}`));
  p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`Konsole ${p.url()}: ${m.text()}`); });
  await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
  await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok"); await p.waitForSelector("#e-name");
  await p.fill("#e-name", "Mira"); await p.click("#e-ok"); await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString())); await p.waitForTimeout(400);
  const pin = async () => { if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.waitForTimeout(500); } };

  // 1 Matheweg: Benno innen auf dem unteren Rand, rechts neben der runden Ecke
  await p.goto(BASIS + "spiele/mathe/"); await p.waitForTimeout(800);
  await p.evaluate(() => __mathe.starte(Mathe.STATIONEN.findIndex(x => x.id === "formen"))); await p.waitForTimeout(500);
  const m = await p.evaluate(() => { const b = document.getElementById("tafel-begleiter").getBoundingClientRect(), t = document.getElementById("tafel").getBoundingClientRect(), r = parseFloat(getComputedStyle(document.getElementById("tafel")).borderTopLeftRadius);
    return { links: b.left - t.left, unten: t.bottom - b.bottom, r, breit: b.width }; });
  erwarte(m.links >= m.r - 6 && m.unten >= 2 && m.unten <= 4 && m.breit > 40, `Matheweg: Benno steht innen auf dem Rand (${m.unten} px über der Kante) und rechts neben der runden Ecke (${Math.round(m.links)} px, Radius ${m.r})`);
  await bild(p, "erp2-mathe");

  // 2 Elternbereich: Spielzeit als erste Karte, Knopf und eigene Zahl
  await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(700); await pin();
  const e1 = await p.evaluate(() => { const teil = document.querySelector('.eltern-teil[data-teil="ueberblick"]'), k = teil.querySelector(".karte"); return { erste: k && k.id, knoepfe: [...document.querySelectorAll(".sz-knopf")].map(b => b.dataset.min).join(","), alt: !!document.getElementById("z-noch") }; });
  erwarte(e1.erste === "spielzeit-karte" && e1.knoepfe === "20,35,60" && e1.alt, `Elternbereich: „Heute noch spielen dürfen“ ist die erste Karte im Überblick (Knöpfe ${e1.knoepfe}), die Zeile in „Zeit & Regeln“ bleibt`);
  await bild(p, "erp2-eltern");
  await p.click('.sz-knopf[data-min="35"]'); await p.waitForTimeout(400);
  erwarte(await p.evaluate(() => Math.round(Zeit.status().rest / 60) === 35 && /35 Minuten/.test(document.getElementById("sz-stand").textContent)), "Elternbereich: „35 Minuten“ angetippt → 35 Minuten Spielzeit, die Karte zeigt es");
  await p.fill("#sz-min", "50"); await p.click("#sz-ok"); await p.waitForTimeout(400);
  erwarte(await p.evaluate(() => Math.round(Zeit.status().rest / 60) === 50), "Elternbereich: eigene Zahl 50 → 50 Minuten Spielzeit");

  // 3 Mein Tier: Ei-Hinweis als Schild mit Umbruch, nichts scrollt
  await p.goto(BASIS + "spiele/tier/"); await p.waitForTimeout(600);
  await p.evaluate(() => TierPflege.waehleEi("kuschel")); await p.reload(); await p.waitForTimeout(700);
  const ei = await p.evaluate(() => { const h = document.getElementById("ei-hilfe"), c = getComputedStyle(h); return { text: h.textContent, br: h.querySelectorAll("br").length, bg: c.backgroundColor, px: parseFloat(c.fontSize), hoch: document.documentElement.scrollHeight, fenster: innerHeight, unten: h.getBoundingClientRect().bottom }; });
  erwarte(/Jede geschaffte Tagesaufgabe wärmt das Ei\.Einmal am Tag/.test(ei.text) && ei.br === 1 && ei.bg === "rgb(255, 255, 255)" && ei.px >= 20, `Mein Tier: Ei-Hinweis als weißes Schild, ${ei.px} px, Umbruch nach dem ersten Satz`);
  erwarte(ei.hoch <= ei.fenster + 1 && ei.unten <= ei.fenster, `Mein Tier (Ei) 1180 × 788: Seite scrollt nicht (${ei.hoch} ≤ ${ei.fenster})`);
  await bild(p, "erp2-ei");
  await p.evaluate(() => { const t = TierPflege.lade(); t.phase = "tier"; t.art = "hund"; t.name = "Mimi"; Spielwelt.speichere("tier", t); }); await p.reload(); await p.waitForTimeout(700);
  const ti = await p.evaluate(() => ({ hoch: document.documentElement.scrollHeight, fenster: innerHeight, knopf: document.getElementById("umbenennen").getBoundingClientRect().bottom, bild: document.getElementById("tier-bild").getBoundingClientRect().height }));
  erwarte(ti.hoch <= ti.fenster + 1 && ti.knopf <= ti.fenster && ti.bild >= 180, `Mein Tier (Tier) 1180 × 788: Seite scrollt nicht (${ti.hoch} ≤ ${ti.fenster}), Knöpfe im Bild, Tier ${Math.round(ti.bild)} px hoch`);
  await bild(p, "erp2-tier");
  for (const [b, h] of [[820, 1180], [390, 760]]) { await p.setViewportSize({ width: b, height: h }); await p.waitForTimeout(300);
    const g = await p.evaluate(() => ({ quer: document.documentElement.scrollWidth <= innerWidth + 1, bild: document.getElementById("tier-bild").getBoundingClientRect().width }));
    erwarte(g.quer && g.bild >= 200, `Mein Tier ${b} × ${h}: kein Querscrollen, Tier ${Math.round(g.bild)} px breit`); }
  await p.setViewportSize({ width: 1180, height: 788 });

  // 4 Startseite: Tier-Bild mit mitwachsender Kontur wie die Kinderfigur
  await p.goto(BASIS); await p.waitForTimeout(800);
  const s = await p.evaluate(() => { const t = document.querySelector("#tier-bild svg"), i = document.querySelector("#ich-bild svg"), el = t.querySelector("[vector-effect]");
    return { klasse: t.classList.contains("fig-klein"), ich: i.classList.contains("fig-klein"), effekt: el ? getComputedStyle(el).vectorEffect : "" }; });
  erwarte(s.klasse && s.ich && s.effekt === "none", "Startseite: Tier-Bild hat wie die Kinderfigur mitwachsende Konturen (fig-klein, kein non-scaling-stroke)");
  await bild(p, "erp2-start");

  // 5 Meine Ecke: „Gemeinsam“ links unter den Tagesaufgaben, Kulissen-Meldung im richtigen Fall
  await p.goto(BASIS + "spiele/ich/"); await p.waitForTimeout(700);
  const g = await p.evaluate(() => { const k = document.getElementById("gemeinsam-karte").getBoundingClientRect(), a = document.getElementById("aufgaben").getBoundingClientRect(), w = document.getElementById("ew-karte").getBoundingClientRect();
    return { links: Math.abs(k.left - a.left) < 40 && k.right < w.left + 5, unter: k.top > a.bottom }; });
  erwarte(g.links && g.unter, "Meine Ecke: Karte „Gemeinsam“ steht links unter den Tagesaufgaben");
  await bild(p, "erp2-ich");
  await p.click('.ich-reiter [data-reiter="sachen"]'); await p.waitForTimeout(300);
  const meld = async (id) => { await p.click(`#kulissen [data-kulisse="${id}"]`); await p.waitForTimeout(350); return p.evaluate(() => document.body.innerText); };
  erwarte(/Ab jetzt rechnest du mit Fahrzeugen!/.test(await meld("fahrzeuge")), "Meine Ecke: „Ab jetzt rechnest du mit Fahrzeugen!“ (richtiger Fall)");
  erwarte(/Ab jetzt rechnest du mit Bildern aus dem Weltraum!/.test(await meld("weltraum")), "Meine Ecke: „… mit Bildern aus dem Weltraum!“");
  erwarte(/wieder bunt gemischt/.test(await meld("")), "Meine Ecke: zurück auf bunt gemischt");

  // 6 Leckerli-Meldung führt zum Tier
  await p.evaluate(() => Charakter.hinweis("🍪 +1 Leckerli", "für Mimi", "#E8A33D", "spiele/tier/")); await p.waitForTimeout(500);
  const quelle = await p.evaluate(() => fetch("../../shared/charakter.js").then(r => r.text()));
  erwarte(/Leckerli`, `für \$\{t\.name \|\| "dein Tier"\}`, "#E8A33D", "spiele\/tier\/"\)/.test(quelle), "Leckerli-Meldung trägt das Ziel „spiele/tier/“");
  await p.click("#belohnung", { force: true }); await p.waitForURL(/spiele\/tier\//); await p.waitForTimeout(300);
  erwarte(/spiele\/tier\//.test(p.url()), "Leckerli-Meldung angetippt → Mein Tier");

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n  " + fehler.join("\n  ")); process.exit(1); }
  console.log("✅ Erprobung-2-Test (Datei „ohne“, 11.11.) bestanden.");
})();
