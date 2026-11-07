// Auswertung des Erprobungsmodus (Paket K, 12.11.2026): liest beliebig viele Dateien lerninsel-erprobung-<kürzel>-<datum>.json
// (Format „lerninsel-erprobung“, Version 1, siehe shared/erprobung.js) und schreibt einen Bericht in Markdown:
// Dateien, Hänger (lange Verweildauer, lange Antwortzeiten, Abbrüche, übersprungene Szenen), Fehlerquoten je Inhalt, Zeiten,
// Meldungen nach Kategorie, Korrekturvorschläge je Datei:Inhalt, technische Fehler und was davon in den Prüfstand dürfte.
// Aufruf:
//   node quellen/erprobung-auswerten.js dateien/*.json                     Bericht auf die Konsole
//   node quellen/erprobung-auswerten.js a.json b.json --aus bericht.md      Bericht in eine Datei
//   node quellen/erprobung-auswerten.js *.json --pruefstand                 dazu Prüfungen in quellen/pruefstand.json übernehmen
//   (--pruefstand-datei <pfad> schreibt in eine andere Datei, für Tests)
// Regeln für den Prüfstand (Entscheidung 12.11.2026, siehe docs/PLAN.md):
//   Stufe 2 „fachlich geprüft“: Prüfungen der Rolle Lehrkraft (fachlich) mit der aktuellen Prüfsumme des Inhalts (sonst „veraltet“);
//     das letzte Urteil je Schritt zählt, kein Schritt darf „ändern“/„unklar“ sein; abgedeckt sein muss
//     – Werkstatt-Kapitel, Sachthemen, Fächer-Themen, Vorschul-Spiele: jeder Schritt des Inhalts (auch Info-Schritte – fachlich gelesen ist alles),
//     – Mathe-Stationen (Aufgaben werden erzeugt): mindestens 5 verschiedene Aufgaben (halbe Runde),
//     – Englisch-Lektionen (Schritte werden erzeugt): mindestens 6 verschiedene Schritte.
//   Stufe 3 „mit Kindern ausprobiert“: Stufe 2 (aus diesen Dateien oder schon im Prüfstand mit gleicher Prüfsumme) und in einer Datei mit
//     Rolle Spieler/in und „Ein Kind spielt“ eine ganz gespielte Runde dieses Inhalts, deren Aufgaben die aktuelle Prüfsumme tragen.
//   Nie wird eine Stufe gesenkt. Prüfer = Kürzel aus den Dateien. Russisch/Sorbisch stehen im Bericht (Korrekturen, bestätigte Texte),
//   der Prüfstand betrifft nur die Inhalte selbst.
const fs = require("fs"), path = require("path");
const PS = require("./pruefstand.js");
const BEREICHE_PS = ["mathe", "werkstatt", "sachkunde", "faecher", "englisch", "vorschule"];
const KAT = { fehler: "🐞 Fehler", unklar: "❓ Unverständlich", schwer: "🧗 Zu schwer", leicht: "🪶 Zu leicht", schoen: "💖 Schön", idee: "💡 Idee" };
const ROLLE = { fach: "Fachlich", ru: "Russisch", hsb: "Sorbisch" };
const LANGE_SEITE = 5 * 60000, LANGE_AUFGABE = 60000;

function lies(datei) {
  const d = JSON.parse(fs.readFileSync(datei, "utf8"));
  if (d.format !== "lerninsel-erprobung") throw new Error("kein Erprobungs-Format");
  if (d.version !== 1) throw new Error("unbekannte Version " + d.version);
  if (!Array.isArray(d.eintraege)) throw new Error("keine Einträge");
  d.datei = path.basename(datei);
  d.kuerzel = String(d.kuerzel || "ohne").replace(/[^\wÄÖÜäöüß-]/g, "").slice(0, 12) || "ohne";
  d.eintraege.forEach(e => { e.__d = d; });
  return d;
}
const md = (t) => String(t == null ? "" : t).replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
const sek = (ms) => ms == null ? "–" : ms < 60000 ? Math.round(ms / 1000) + " s" : (ms / 60000).toFixed(1).replace(".", ",") + " min";
const median = (l) => { if (!l.length) return null; const s = l.slice().sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const tabelle = (kopf, zeilen) => zeilen.length ? `| ${kopf.join(" | ")} |\n| ${kopf.map(() => "---").join(" | ")} |\n` + zeilen.map(z => `| ${z.map(md).join(" | ")} |`).join("\n") + "\n" : "_keine_\n";
const gruppiere = (l, f) => l.reduce((m, x) => { const k = f(x); (m[k] = m[k] || []).push(x); return m; }, {});

// Prüfstand: aktuelle Inhalte und Regeln
function inhaltVon(B, inhalt) {
  const [bereich, ...rest] = String(inhalt || "").split(":"), id = rest.join(":");
  if (!BEREICHE_PS.includes(bereich) || !B[bereich]) return null;
  const x = B[bereich].liste.find(y => y.id === id);
  return x ? { bereich, id, inhalt: x.inhalt, hash: PS.hash(x.inhalt), key: bereich + ":" + id } : null;
}
function schrittZahl(x) {
  if (["werkstatt", "sachkunde", "faecher"].includes(x.bereich)) return (x.inhalt.schritte || []).length;
  if (x.bereich === "vorschule") return (x.inhalt.aufgaben || []).length;
  return null;
}
function pruefstandPlan(dateien, vermerke) {
  const B = PS.bereiche(), plan = [], heute = new Date().toISOString().slice(0, 10);
  const fach = dateien.filter(d => (d.rollen || []).includes("lehrkraft")).flatMap(d => d.eintraege.filter(e => e.art === "pruefung" && e.rolle === "fach"));
  const kindDateien = dateien.filter(d => d.kindSpielt && (d.rollen || []).includes("spieler"));
  const keys = new Set(fach.map(e => e.inhalt).concat(kindDateien.flatMap(d => d.eintraege.filter(e => e.art === "runde").map(e => e.inhalt))));
  for (const inhalt of keys) {
    const x = inhaltVon(B, inhalt); if (!x) continue;
    const alt = vermerke[x.key], altStufe = alt && alt.hash === x.hash ? alt.stufe : 0;
    const p = fach.filter(e => e.inhalt === inhalt), aktuell = p.filter(e => e.h === x.hash), veraltet = p.length - aktuell.length;
    // letztes Urteil je Prüfer und Schritt
    const letzte = {}; aktuell.sort((a, b) => a.t - b.t).forEach(e => { letzte[(e.__d.kuerzel) + "|" + e.schritt] = e; });
    const urteile = Object.values(letzte), offen = urteile.filter(e => e.urteil !== "ok");
    const okSchritte = new Set(urteile.filter(e => e.urteil === "ok").map(e => String(e.schritt)));
    offen.forEach(e => okSchritte.delete(String(e.schritt)));
    const n = schrittZahl(x), noetig = n != null ? n : x.bereich === "mathe" ? 5 : 6;
    const abgedeckt = n != null ? [...Array(n).keys()].filter(i => okSchritte.has(String(i))).length : okSchritte.size;
    let stufe2 = !offen.length && abgedeckt >= noetig && urteile.length > 0, grund;
    if (!urteile.length) grund = veraltet ? `${veraltet} Prüfung(en) veraltet – Inhalt seitdem geändert` : "keine fachliche Prüfung";
    else if (offen.length) grund = `${offen.length} Schritt(e) mit ✏️/❓ offen`;
    else if (abgedeckt < noetig) grund = n != null ? `${abgedeckt} von ${n} Schritten 👍` : `${abgedeckt} von mindestens ${noetig} Aufgaben 👍`;
    else grund = n != null ? `alle ${n} Schritte 👍` : `${abgedeckt} Aufgaben 👍`;
    const pruefer = [...new Set(urteile.map(e => e.__d.kuerzel))];
    // Stufe 3: ein Kind hat eine ganze Runde mit genau diesem Inhalt gespielt
    const kind = kindDateien.filter(d => d.eintraege.some(e => e.art === "runde" && e.inhalt === inhalt) &&
      d.eintraege.some(e => e.art === "aufgabe" && e.inhalt === inhalt && e.h === x.hash) && !d.eintraege.some(e => e.art === "aufgabe" && e.inhalt === inhalt && e.h && e.h !== x.hash));
    const basis2 = stufe2 || altStufe >= 2;
    const ziel = basis2 && kind.length ? 3 : stufe2 ? 2 : 0;
    const wer = [...new Set(pruefer.concat(ziel === 3 ? kind.map(d => d.kuerzel) : []))].join("+").slice(0, 30) || "Erprobung";
    plan.push({ key: x.key, hash: x.hash, alt: altStufe, ziel: Math.max(ziel, 0), neu: ziel > altStufe, grund: grund + (kind.length ? `; Runde mit Kind (${kind.map(d => d.kuerzel).join(", ")})` : ""), pruefer: wer, am: heute, veraltet });
  }
  return plan.sort((a, b) => a.key.localeCompare(b.key));
}

function bericht(dateien, opt = {}) {
  const alle = dateien.flatMap(d => d.eintraege), art = (a) => alle.filter(e => e.art === a);
  const B = PS.bereiche(), wer = (e) => e.__d.kuerzel;
  const zustand = (e) => { const x = inhaltVon(B, e.inhalt); if (!x || !e.h) return "–"; return e.h === x.hash ? "aktuell" : "veraltet"; };
  let t = `# Auswertung Erprobung\n\nErstellt am ${new Date().toISOString().slice(0, 10)} aus ${dateien.length} Datei(en), ${alle.length} Einträgen.\n\n`;
  t += "## Dateien\n\n" + tabelle(["Datei", "Kürzel", "Rollen", "Kind spielt", "Gerät", "App", "Zeitraum", "Einträge", "überschrieben"], dateien.map(d => [d.datei, d.kuerzel, (d.rollen || []).join(", ") +
    ((d.rollen || []).includes("lehrkraft") && ((d.faecher || []).length || (d.klassen || []).length) ? ` (${(d.faecher || []).join("/") || "alle"}; Kl. ${(d.klassen || []).join("/") || "alle"})` : ""),
    d.kindSpielt ? "ja" : "nein", d.geraet ? `${d.geraet.bildschirm || ""}${/iPad|Macintosh.*Mobile|iPhone/.test(d.geraet.ua || "") || (d.geraet.touch > 1 && /Mac/.test(d.geraet.ua || "")) ? " (iPad/iPhone)" : ""}` : "",
    d.app ? `${d.app.version || ""} ${d.app.umgebung || ""} ${d.app.cache || ""}`.trim() : "", `${(d.von || "").slice(0, 16).replace("T", " ")} – ${(d.bis || "").slice(0, 16).replace("T", " ")}`, d.eintraege.length, d.verworfen || 0]));

  // Hänger
  t += "\n## Hänger\n\n### Seiten (sichtbare Verweildauer)\n\n";
  const seiten = gruppiere(art("seite"), e => e.seite);
  t += tabelle(["Seite", "Besuche", "Median", "längste", "auffällig"], Object.entries(seiten).map(([s, l]) => { const ms = l.map(e => e.ms || 0); return [s, l.length, sek(median(ms)), sek(Math.max(...ms)), Math.max(...ms) > LANGE_SEITE ? "⚠️ über 5 min" : ""]; })
    .sort((a, b) => b[1] - a[1]));
  const lang = art("aufgabe").filter(e => (e.versuch || 1) === 1 && e.ms > LANGE_AUFGABE).sort((a, b) => b.ms - a.ms).slice(0, 30);
  t += "\n### Lange Zeit bis zur Antwort (über 1 min, erster Versuch)\n\n" + tabelle(["Datei", "Inhalt", "Schritt", "Aufgabe", "Zeit", "Hilfe"], lang.map(e => [wer(e), e.inhalt, e.schritt, e.text, sek(e.ms), (e.hilfe || []).join(", ")]));
  const abbr = gruppiere(art("abbruch"), e => e.inhalt), fertig = gruppiere(art("runde"), e => e.inhalt);
  t += "\n### Abgebrochene Runden\n\n" + tabelle(["Inhalt", "Abbrüche", "fertige Runden", "Abbruchquote", "beantwortet bis zum Abbruch (Median)", "Dateien"],
    Object.entries(abbr).map(([i, l]) => { const f = (fertig[i] || []).length; return [i, l.length, f, Math.round(l.length / (l.length + f) * 100) + " %", `${median(l.map(e => e.beantwortet || 0))} von ${median(l.map(e => e.n || 0))}`, [...new Set(l.map(wer))].join(", ")]; })
      .sort((a, b) => b[1] - a[1]));
  const sz = gruppiere(art("szene"), e => e.inhalt);
  t += "\n### Szenen\n\n" + tabelle(["Szene", "gesehen", "übersprungen"], Object.entries(sz).map(([i, l]) => [i, l.length, l.filter(e => e.uebersprungen).length]).sort((a, b) => b[2] - a[2]));

  // Fehlerquoten
  const auf = gruppiere(art("aufgabe").filter(e => (e.versuch || 1) === 1), e => e.inhalt);
  t += "\n## Fehlerquoten und Zeiten je Inhalt (erster Versuch)\n\n" + tabelle(["Inhalt", "Aufgaben", "richtig beim 1. Versuch", "Zeit (Median)", "Hilfe genutzt", "Prüfsumme"],
    Object.entries(auf).map(([i, l]) => { const r = l.filter(e => e.richtig).length; return { q: r / l.length, z: [i, l.length, Math.round(r / l.length * 100) + " %", sek(median(l.map(e => e.ms || 0))), Math.round(l.filter(e => (e.hilfe || []).length).length / l.length * 100) + " %", zustand(l[l.length - 1])] }; })
      .sort((a, b) => a.q - b.q).map(x => x.z));
  const oft = gruppiere(art("aufgabe").filter(e => !e.richtig && e.antwort != null), e => e.inhalt + "|" + e.antwort);
  const haeufig = Object.entries(oft).filter(([, l]) => l.length >= 2).sort((a, b) => b[1].length - a[1].length).slice(0, 20);
  if (haeufig.length) t += "\n### Häufige falsche Antworten\n\n" + tabelle(["Inhalt", "Antwort", "wie oft"], haeufig.map(([k, l]) => [k.split("|")[0], k.split("|").slice(1).join("|"), l.length]));

  // Meldungen
  t += "\n## Meldungen nach Kategorie\n\n";
  const mg = gruppiere(art("meldung"), e => e.kat);
  if (!art("meldung").length) t += "_keine_\n";
  Object.keys(KAT).filter(k => mg[k]).forEach(k => { t += `### ${KAT[k]} (${mg[k].length})\n\n` + tabelle(["Datei", "Seite", "Inhalt", "Schritt", "Klasse", "Text"], mg[k].map(e => [wer(e), e.seite, e.inhalt || "", e.schritt == null ? "" : e.schritt, e.klasse || "", e.text || "(ohne Text)"])) + "\n"; });

  // Korrekturen
  t += "## Korrekturvorschläge (je Datei:Inhalt)\n\n";
  const korr = art("pruefung").filter(e => e.urteil !== "ok");
  if (!korr.length) t += "_keine_\n";
  Object.entries(gruppiere(korr, e => wer(e) + ":" + e.inhalt)).forEach(([k, l]) => {
    t += `### ${k}\n\n` + l.map(e => `- **${ROLLE[e.rolle] || e.rolle} ${e.urteil === "unklar" ? "❓ unklar" : "✏️ ändern"}**${e.schritt != null ? ` (Schritt ${e.schritt})` : ""}${e.text ? ` – Aufgabe: „${md(e.text)}“` : ""}` +
      `${e.ruText ? ` – Text: „${md(e.ruText)}“` : ""}${e.de ? ` – Deutsch: „${md(e.de)}“` : ""}\n  → ${e.korrektur ? `„${md(e.korrektur)}“` : "_(ohne Vorschlag)_"} · Prüfsumme ${e.rolle === "fach" ? zustand(e) : (e.h || "–")}`).join("\n") + "\n\n";
  });
  const ok = gruppiere(art("pruefung").filter(e => e.urteil === "ok"), e => e.rolle);
  t += "## Bestätigt (👍)\n\n" + tabelle(["Rolle", "Urteile", "Inhalte", "Prüfer"], Object.entries(ok).map(([r, l]) => [ROLLE[r] || r, l.length, new Set(l.map(e => e.inhalt)).size, [...new Set(l.map(wer))].join(", ")]));
  const ruOk = (ok.ru || []).concat(ok.hsb || []).filter(e => /^(ru|hsb)-text:/.test(e.inhalt));
  if (ruOk.length) t += "\nAus den Prüflisten als richtig bestätigt (Schlüssel): " + [...new Set(ruOk.map(e => e.inhalt))].join(" ") + "\n";

  // Technik
  const tech = art("technik").concat(dateien.flatMap(d => (d.protokoll || []).map(p => ({ __d: d, typ: p.art, text: p.text, seite: p.seite, n: p.n }))));
  const tg = gruppiere(tech, e => e.typ + "|" + e.text + "|" + e.seite);
  t += "\n## Technische Fehler\n\n" + tabelle(["Art", "Seite", "Text", "wie oft", "Dateien"], Object.entries(tg).map(([, l]) => [l[0].typ, l[0].seite, l[0].text, l.reduce((n, e) => n + (e.n || 1), 0), [...new Set(l.map(wer))].join(", ")]));

  // Prüfstand
  const plan = opt.plan || [];
  t += `\n## Prüfstand${opt.geschrieben ? " (übernommen)" : " (Vorschau – mit --pruefstand übernehmen)"}\n\n` + tabelle(["Inhalt", "bisher", "neu", "Begründung", "Prüfer"],
    plan.map(p => [p.key, p.alt, p.neu ? `**${p.ziel}**` : p.alt, p.grund + (p.veraltet && p.ziel ? ` (${p.veraltet} veraltete ignoriert)` : ""), p.neu ? p.pruefer : ""]));
  return t;
}

if (require.main === module) {
  const args = process.argv.slice(2), dateien = [], fehler = [];
  let aus = null, pruefstand = false, psDatei = path.join(__dirname, "pruefstand.json");
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--aus") aus = args[++i];
    else if (args[i] === "--pruefstand" || args[i] === "--pruefen") pruefstand = true;
    else if (args[i] === "--pruefstand-datei") { psDatei = args[++i]; }
    else { try { dateien.push(lies(args[i])); } catch (e) { fehler.push(`${args[i]}: ${e.message}`); } }
  }
  if (!dateien.length) { console.log("Aufruf: node quellen/erprobung-auswerten.js <dateien…> [--aus bericht.md] [--pruefstand]" + (fehler.length ? "\n" + fehler.join("\n") : "")); process.exit(1); }
  const vermerke = fs.existsSync(psDatei) ? JSON.parse(fs.readFileSync(psDatei, "utf8")) : {};
  const plan = pruefstandPlan(dateien, vermerke);
  if (pruefstand) {
    plan.filter(p => p.neu).forEach(p => { vermerke[p.key] = { stufe: p.ziel, pruefer: p.pruefer, am: p.am, hash: p.hash }; });
    fs.writeFileSync(psDatei, JSON.stringify(vermerke, null, 1) + "\n");
  }
  let t = bericht(dateien, { plan, geschrieben: pruefstand });
  if (fehler.length) t += "\n## Nicht gelesen\n\n" + fehler.map(f => "- " + f).join("\n") + "\n";
  if (aus) { fs.writeFileSync(aus, t); console.log(`Bericht: ${aus} (${dateien.length} Dateien${pruefstand ? `, ${plan.filter(p => p.neu).length} Vermerke übernommen` : ""})`); } else console.log(t);
}
module.exports = { lies, bericht, pruefstandPlan };
