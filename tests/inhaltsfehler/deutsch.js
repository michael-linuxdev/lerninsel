// Paket C: Deutsch-Werkstatt, Fipsis Geschichte, Lesen, Wortschatz, Vorschule, Tablet-Führerschein
const assert = require("assert"), fs = require("fs"), path = require("path"), vm = require("vm");
module.exports = function (wurzel) {
  let n = 0;
  const lies = (d) => fs.readFileSync(path.join(wurzel, d), "utf8");
  const lade = (dateien) => {
    const window = {}; const ctx = vm.createContext({ window, console });
    dateien.forEach(d => vm.runInContext(lies(d), ctx, { filename: d }));
    return window;
  };
  const w = lade(["spiele/deutsch/geschichte.js", "spiele/deutsch/werkstatt.js", "inhalte/deutsch/schreibschrift.js",
    "inhalte/woerter/anlaute.js", "inhalte/woerter/bestand.js", "inhalte/woerter/d0.js", "shared/woerter.js",
    "spiele/vorschule/aufgaben.js"]);
  const W = w.WERKSTATT, G = w.GESCHICHTE;
  const alle = (k) => [].concat(...k.map(x => x.schritte.map(s => Object.assign({ __k: x.id }, s))));
  const SW = alle(W), SG = alle(G);

  // 1 Lücken: keine falschen oder doppelt richtigen Sätze mehr
  SW.filter(s => s.typ === "luecke").forEach(s => {
    assert.ok(!/\S ___liest/.test(s.satz), "Vorsilbe vor gebeugtem Verb: " + s.satz);
    assert.ok(!/gehört ___ Jungen/.test(s.satz), s.satz);
    assert.ok(!/^Im Sommer ___ Ben/.test(s.satz), s.satz);
    assert.ok(s.optionen.length >= 2 && new Set(s.optionen).size === s.optionen.length, "doppelte Option: " + s.satz);
    if (/Wir haben einen Hund|Erdbeere, Vanille/.test(s.satz)) assert.ok(!s.optionen.includes(","), "Komma als Ablenker: " + s.satz);
    if (/liegen___ |brauchst du___ /.test(s.satz)) assert.fail("Doppelpunkt ohne Ankündigung: " + s.satz);
  });
  n++;
  // 2 Regeltexte
  const wt = lies("spiele/deutsch/werkstatt.js");
  assert.ok(!wt.includes("Bal-le"), "„Bal-le“ ist kein Wort");
  assert.ok(!/Dehnungs-h[^"]*Kuh|Kuh, Zahn/.test(wt), "Kuh ist kein Beispiel für das Dehnungs-h");
  assert.ok(!wt.includes("Viele Grüße, Tom"), "kein Komma nach der Grußformel");
  n++;
  // 3 Sätze legen: Großbuchstabe am Anfang, Satzzeichen am Ende, kein zweites großgeschriebenes Nicht-Nomen (sonst zwei Lösungen)
  SW.concat(SG).filter(s => s.typ === "satz").forEach(s => {
    assert.ok(/^[A-ZÄÖÜ„]/.test(s.woerter[0]), "Satzanfang: " + s.woerter.join(" "));
    assert.ok(/[.!?]“?$/.test(s.woerter[s.woerter.length - 1]), "Satzende: " + s.woerter.join(" "));
    const klein = s.woerter.map(x => x.toLowerCase());
    assert.ok(new Set(klein).size === klein.length, "Wort doppelt (auch groß/klein): " + s.woerter.join(" "));
  });
  n++;
  // 4 Ordnen: keine bekannten vertauschbaren Karten; Vortrag höchstens ein Hauptteil
  SW.filter(s => s.typ === "ordnen").forEach(s => {
    assert.ok(s.teile.filter(t => /^(Aussehen|Nahrung|Wohnung):/.test(t)).length <= 1, "Vortrag: Mittelteile vertauschbar");
    assert.ok(!(s.teile.includes("Bemale sie bunt.") || s.teile.includes("Er hat dicke Backentaschen.") || s.teile.includes("Wir treffen uns bei mir zu Hause.")), s.teile.join(" | "));
    assert.ok(new Set(s.teile).size === s.teile.length);
  });
  n++;
  // 5 Russische Hilfe verrät bei „verbessern“ die Lösung nicht
  SW.filter(s => s.typ === "verbessern").forEach(s => {
    assert.ok(!(s.ru || "").includes(s.optionen[0]), `ru nennt die Lösung „${s.optionen[0]}“: ${s.satz}`);
    const i = s.satz.split(" ").findIndex((x, j) => (s.stelle == null || j === s.stelle) && x.replace(/[.,!?]/g, "") === s.falsch);
    assert.ok(i >= 0, "Wort nicht im Satz: " + s.satz);
  });
  n++;
  // 6 Fragen zu einem Lesetext finden ihren Text; keine Absatznummern mehr
  W.forEach(k => k.schritte.forEach((s, i) => {
    if (s.zumText) assert.ok(k.schritte.slice(0, i).some(x => x.gedicht && x.art === "text"), k.id + ": zumText ohne Text davor");
    if (s.typ === "luecke") assert.ok(!/(ersten|zweiten|dritten|vierten|letzten) (Absatz|Sinnabschnitt)|Im letzten geht/.test(s.satz), s.satz);
  }));
  assert.ok(SW.filter(s => s.zumText).length >= 12);
  const ab = lies("spiele/deutsch/abenteuer.js");
  assert.ok(ab.includes('id="text-nochmal"') && ab.includes('s.art === "text" ? "Text" : "Gedicht"'));
  n++;
  // 7 Fipsis Geschichte: Fipsi nie als Emoji, russische Ansprache in beiden Formen
  const gt = lies("spiele/deutsch/geschichte.js");
  assert.ok(!gt.includes("🦊"), "Fipsi als Emoji");
  assert.ok(!/Ты нашла |Я бы хотела |счастлива\./.test(gt), "nur weibliche Form");
  n++;
  // 8 Schreibschrift: Nomen groß, alle Buchstaben vorhanden
  const S = w.SCHREIBSCHRIFT, NOMEN = ["oma", "opa", "mama", "papa", "eis", "uhr", "igel", "hut", "auto", "ente", "maus", "nase", "rose", "tor", "kino", "ball", "baum", "fisch", "sonne", "dorf", "garten", "pferd", "vogel", "wald", "zebra", "quark", "clown", "öl", "übung"];
  S.woerter.forEach(x => {
    assert.ok(!NOMEN.includes(x), "Nomen kleingeschrieben: " + x);
    [...x].forEach(z => assert.ok(S.buchstaben[z], `Buchstabe ${z} fehlt (${x})`));
    assert.ok(S.baue(x).striche.length > 0);
  });
  assert.ok(S.woerter.includes("Papa") && new Set(S.woerter).size === S.woerter.length);
  n++;
  // 9 Wörter legen: wirklich lautgetreu (Filter aus lesen.js echt ausgewertet)
  const lt = lies("spiele/lesen/lesen.js");
  const m = lt.match(/const LEGEWOERTER = ([\s\S]*?);\n\s*let leg/);
  assert.ok(m, "LEGEWOERTER nicht gefunden");
  const LEGE = new Function("W", "return " + m[1])(w.Wortschatz).map(x => x.de);
  assert.ok(LEGE.length >= 40, "genug Wörter zum Legen: " + LEGE.length);
  LEGE.forEach(x => assert.ok(!/^(st|sp|c)|pf|ng|[bdg]$/i.test(x) && !["Orange", "Clown"].includes(x), "nicht lautgetreu: " + x));
  ["Hund", "Hand", "Mond", "Kind", "Zug", "Stern", "Stift", "Pferd", "Hunger", "Kleid", "Mund"].forEach(x => assert.ok(!LEGE.includes(x), x));
  n++;
  // 10 Silben lesen: keine Wörter ohne klares Bild, Doppelbilder nie zusammen (Liste und Prüfung aus lesen.js)
  const m2 = lt.match(/const DOPPELBILDER = ([\s\S]*?);\n\s*const verwechselbar = ([\s\S]*?);\n/), m3 = lt.match(/const OHNE_BILD = ([\s\S]*?);\n\s*const SILBENWOERTER = ([\s\S]*?);\n/);
  assert.ok(m2 && m3, "Silben-Listen nicht gefunden");
  const { SILBEN, verw } = new Function("W", `const DOPPELBILDER = ${m2[1]}; const verwechselbar = ${m2[2]}; const OHNE_BILD = ${m3[1]}; const SILBENWOERTER = ${m3[2]}; return { SILBEN: SILBENWOERTER, verw: verwechselbar };`)(w.Wortschatz);
  assert.ok(SILBEN.length >= 100);
  ["w.hilfe", "w.name", "w.hunger", "w.durst", "w.pause", "w.freund", "w.kopf"].forEach(id => assert.ok(!SILBEN.some(x => x.id === id), id));
  [["w.kind", "w.bruder"], ["w.regen", "w.wolke"], ["w.mama", "w.lehrerin"], ["w.papa", "w.lehrer"], ["w.tasche", "w.schulranzen"], ["w.brot", "w.broetchen"], ["w.wasser", "w.regen"]]
    .forEach(([a, b]) => assert.ok(verw(a, b) && verw(b, a), a + "/" + b));
  assert.ok(!verw("w.hund", "w.katze") && !verw("w.kind", "w.kind"));
  assert.ok(/!verwechselbar\(x\.id, w\.id\)/.test(lt) && /!verwechselbar\(id, richtigesWort\)/.test(lt), "Ablenker prüfen Doppelbilder");
  n++;
  // 11 Wortschatz-Bilder
  const wort = (id) => w.Wortschatz.wort(id);
  assert.notStrictEqual(wort("w.nuss").bild, "🌰");
  assert.ok(!lies("inhalte/woerter/d0.js").includes('"Mein Bauch tut weh.", bild: "🤕"'));
  const bilder = w.Wortschatz.alle().map(x => x.bild);
  assert.ok(bilder.filter(b => b === wort("w.nuss").bild).length === 1, "neues Bild ist einmalig");
  n++;
  // 12 Vorschule: kein Zebra-Tier als Zebrastreifen, Muster sichtbar, „sag“ nie nur Emojis, Kachel verrät nichts
  const ohneEmoji = (t) => t.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, "").trim();
  w.VORSCHULE.forEach(sp => sp.aufgaben.forEach(a => {
    const o = a.optionen || a.teile;
    assert.ok(o[0] !== "🦓", "Zebra als richtige Antwort");
    if (a.sag) assert.ok(ohneEmoji(a.sag).length > 0, "sag nur aus Emojis: " + a.frage);
    if (a.optionen) assert.ok(a.optionen[0] !== sp.e, sp.id + ": Kachel-Bild ist die richtige Antwort");
    assert.ok(new Set(o).size === o.length);
  }));
  const muster = w.VORSCHULE.find(x => x.id === "vs-muster").aufgaben;
  assert.ok(muster.slice(0, 3).every(a => /^\p{Extended_Pictographic}/u.test(a.frage)), "Muster steht als Bild in der Frage");
  n++;
  // 13 Tablet-Führerschein: Daumen etwa halb/halb, kein festes Alter
  const mt = lies("spiele/medien/lektionen.js");
  const wahr = (mt.match(/typ: "daumen"[^\n]*ok: true/g) || []).length, falsch = (mt.match(/typ: "daumen"[^\n]*ok: false/g) || []).length;
  assert.ok(wahr + falsch >= 8 && wahr / (wahr + falsch) >= 0.4 && wahr / (wahr + falsch) <= 0.6, `Daumen ${wahr} wahr / ${falsch} falsch`);
  assert.ok(!mt.includes("Ich bin auch 8"));
  n++;
  // 14 Lesetext „An der Ampel“: erst schauen, dann gehen; Zähler stimmen
  const le = lies("inhalte/deutsch/lesetexte.js");
  assert.ok(le.indexOf("schaut er nach links") < le.indexOf("Dann geht er ü-ber die Stra-ße") && le.indexOf("schaut er nach links") > 0);
  assert.ok(le.includes(`aufgaben: ${SILBEN.length},`), "Zähler Silben lesen = " + SILBEN.length);
  assert.ok(lies("inhalte/deutsch/schreiben.js").includes(`aufgaben: ${LEGE.length},`), "Zähler Wörter legen = " + LEGE.length);
  n++;
  return n;
};
if (require.main === module) console.log("Paket C:", module.exports(process.argv[2] || process.cwd()), "Prüfungen bestanden");
