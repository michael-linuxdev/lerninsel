// Offline-Speicher (Paket 5, 07.11.2026): Jede Version der Lerninsel liegt vollständig in genau einem Cache (CACHE). Seiten und Skripte
// kommen immer aus diesem Cache (cache-first) – nie halb aus dem Netz und halb aus dem Speicher, und nichts wird im Hintergrund in einen
// alten Cache geschrieben. Eine neue Version wird im Hintergrund vorbereitet (nur geänderte Dateien werden geholt, unveränderte aus dem
// alten Cache kopiert, siehe PRUEFSUMMEN am Ende) und erst aktiv, wenn keine Seite der alten Version mehr offen ist: beim nächsten Start
// der App, oder wenn die Startseite allein offen ist (core.js fragt dann nach, die Startseite lädt neu). Test: tests/swupdate.js.
// /dev hat einen eigenen Cache, damit sich Test- und echte Seite nicht gegenseitig löschen
const VORSILBE = self.registration.scope.includes("/dev/test/") ? "test-" : self.registration.scope.includes("/dev/") ? "dev-" : "";
const CACHE = VORSILBE + "spielwelt-78ba5f08ca";
const START = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "shared/style.css",
  "shared/schrift/fredoka.css",
  "shared/schrift/fredoka-latin-400-normal.woff2",
  "shared/schrift/fredoka-latin-ext-400-normal.woff2",
  "shared/schrift/fredoka-latin-500-normal.woff2",
  "shared/schrift/fredoka-latin-ext-500-normal.woff2",
  "shared/schrift/fredoka-latin-600-normal.woff2",
  "shared/schrift/fredoka-latin-ext-600-normal.woff2",
  "shared/schrift/fredoka-latin-700-normal.woff2",
  "shared/schrift/fredoka-latin-ext-700-normal.woff2",
  "shared/config.js",
  "shared/core.js",
  // Emoji-Bilder in Häppchen (quellen/noto-stil-a.py, seit 07.11.2026 statt einer großen shared/icons.js; emoji.js lädt sie nach Bedarf)
  "shared/icons/leute-1.js",
  "shared/icons/leute-2.js",
  "shared/icons/leute-3.js",
  "shared/icons/leute-4.js",
  "shared/icons/tiere-1.js",
  "shared/icons/tiere-2.js",
  "shared/icons/tiere-3.js",
  "shared/icons/tiere-4.js",
  "shared/icons/essen-sport-1.js",
  "shared/icons/essen-sport-2.js",
  "shared/icons/essen-sport-3.js",
  "shared/icons/essen-sport-4.js",
  "shared/icons/orte-1.js",
  "shared/icons/orte-2.js",
  "shared/icons/orte-3.js",
  "shared/icons/orte-4.js",
  "shared/icons/dinge-1.js",
  "shared/icons/dinge-2.js",
  "shared/icons/dinge-3.js",
  "shared/icons/dinge-4.js",
  "shared/icons/zeichen-1.js",
  "shared/icons/zeichen-2.js",
  "shared/icons/zeichen-3.js",
  "shared/icons/zeichen-4.js",
  "shared/icons-liste.js",
  "shared/emoji.js",
  "shared/ereignisse.js",
  "shared/geschenk.js",
  "shared/zeige.js",
  "shared/szene.js",
  "shared/szenen.js",
  "shared/insel-kern.js",
  "shared/garten.js",
  "shared/sprachkurs.js",
  "spiele/garten/",
  "spiele/garten/beete.js",
  "spiele/baeckerei/",
  "spiele/baeckerei/laden.js",
  "spiele/tierstation/",
  "spiele/angeln/",
  "spiele/angeln/angeln.js",
  "spiele/rhythmus/",
  "spiele/rhythmus/boot.js",
  "spiele/wetter/",
  "spiele/wetter/drache.js",
  "spiele/expedition/",
  "spiele/expedition/expedition.js",
  "spiele/leuchtturm/",
  "spiele/leuchtturm/leuchtturm.js",
  "spiele/bruecke/",
  "spiele/bruecke/bruecke.js",
  "spiele/tierstation/station.js",
  "shared/einrichten.js",
  "shared/spielstand.js",
  "shared/vendor/qrcodegen.js",
  "shared/vendor/jsQR.js",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-180.png",
  "spiele/anziehen/",
  "spiele/anziehen/teile.js",
  "spiele/anziehen/kind.js",
  "spiele/anziehen/teile2.js",
  "spiele/anziehen/spiel.js",
  "spiele/mathe/",
  "spiele/mathe/aufgaben.js",
  "spiele/mathe/fehler.js",
  "spiele/mathe/erklaeren.js",
  "spiele/mathe/hilfe-ru.js",
  "spiele/mathe/hilfe-ru-fragen.js",
  "spiele/mathe/hilfe-ru-hilfen.js",
  "spiele/mathe/mathe.js",
  "shared/sprache.js",
  "shared/vorleser.js",
  "shared/charakter.js",
  "shared/lernfunde.js",
  "shared/woerterbuch.js",
  "shared/lernkartei.js",
  "shared/lieder.js",
  "shared/familie.js",
  "shared/echtewelt.js",
  "shared/schatz.js",
  "shared/staerken.js",
  "spiele/schatz/",
  "spiele/schatz/kammer.js",
  "spiele/atelier/",
  "spiele/atelier/atelier.js",
  "spiele/atelier/vorlagen.js",
  "spiele/atelier/musik.js",
  "shared/bilder.js",
  "shared/eigenes.js",
  "spiele/gefuehle/",
  "spiele/gefuehle/gefuehle.js",
  "spiele/schach/",
  "spiele/schach/regeln.js",
  "spiele/schach/schach.js",
  "spiele/familie/duell.html",
  "spiele/familie/duell.js",
  "shared/zeit.js",
  "shared/sticker.js",
  "shared/inseltuer.js",
  "spiele/album/",
  "spiele/album/album.js",
  "shared/figuren.js",
  "shared/lehrplan.js",
  "shared/lehrplan/kern.js",
  "shared/lehrplan/laender/sachsen.js",
  "shared/lehrplan/laender/sachsen-punkte.js",
  "shared/inhalte.js",
  "shared/koennen.js",
  "shared/woerter.js",
  "inhalte/woerter/bestand.js",
  "inhalte/woerter/d0.js",
  "shared/tiere.js",
  "shared/tierpflege.js",
  "spiele/tier/",
  "spiele/tier/tier.js",
  "spiele/anziehen/figur.js",
  "spiele/ich/",
  "spiele/ich/ich.js",
  "spiele/eltern/",
  "spiele/eltern/eltern.js",
  "spiele/lesen/",
  "spiele/lesen/lesen.js",
  "inhalte/deutsch/anlaute.js",
  "inhalte/deutsch/lesetexte.js",
  "inhalte/deutsch/schreiben.js",
  "inhalte/deutsch/schreibschrift.js",
  "inhalte/woerter/anlaute.js",
  "spiele/daz/",
  "spiele/daz/ankommen.js",
  "shared/daz.js",
  "spiele/deutsch/",
  "spiele/deutsch/geschichte.js",
  "spiele/deutsch/werkstatt.js",
  "spiele/deutsch/abenteuer.js",
  "spiele/sachkunde/",
  "spiele/sachkunde/bilder.js",
  "spiele/sachkunde/themen.js",
  "spiele/sachkunde/transfer.js",
  "spiele/sachkunde/landkreise.js",
  "spiele/sachkunde/faecher.js",
  "spiele/sachkunde/religion.js",
  "spiele/sachkunde/bewegung.js",
  "spiele/sachkunde/klang.js",
  "spiele/sachkunde/sachkunde.js",
  "spiele/englisch/",
  "spiele/englisch/lektionen.js",
  "spiele/englisch/englisch.js",
  "spiele/praesentieren/",
  "spiele/praesentieren/praesentieren.js",
  "spiele/vorlesen/",
  "spiele/vorlesen/vorlesen.js",
  "inhalte/deutsch/vorlesen.js",
  "spiele/robo/",
  "spiele/robo/robo.js",
  "spiele/heft/",
  "spiele/heft/heft.js",
  "spiele/sorbisch/",
  "spiele/sorbisch/lektionen.js",
  "spiele/sorbisch/mutter.js",
  "spiele/vorschule/",
  "spiele/vorschule/aufgaben.js",
  "spiele/vorschule/vorschule.js",
  "spiele/sorbisch/geprueft.js",
  "spiele/sorbisch/sorbisch.js",
  "spiele/sorbisch/pruefen.html",
  "spiele/medien/",
  "spiele/medien/lektionen.js",
  "spiele/medien/medien.js",
  "spiele/welt3d/",
  "spiele/welt3d/welt3d.css",
  "spiele/welt3d/ballons.html",
  "spiele/welt3d/ballons.js",
  "spiele/welt3d/insel.html",
  "spiele/welt3d/insel.js",
  "spiele/insel/",
  "spiele/pixel/insel.html",
  "spiele/welt3d/gemeinsam-63Y3337S.js",
  "spiele/welt3d/gemeinsam-JRKQATNJ.js",
  "spiele/welt3d/gemeinsam-O25UZSSK.js",
  "spiele/welt3d/heimat.html",
  "spiele/welt3d/heimat.js",
  "spiele/welt3d/lauf.html",
  "spiele/welt3d/lauf.js",
  "spiele/welt3d/kart.html",
  "spiele/welt3d/kart.js",
  "spiele/welt3d/bau.html",
  "spiele/welt3d/bau.js",
];

// Prüfsummen der Dateien aus START (die ersten 12 Zeichen von SHA-1) – GEBAUT von quellen/sw-pruefsummen.js (läuft in quellen/dev-bauen.sh), nicht von Hand ändern
const PRUEFSUMMEN = {"./":"f6b3d1d0570c","index.html":"f6b3d1d0570c","manifest.webmanifest":"6f4fb122f92f","shared/style.css":"3f42cf199e2b","shared/schrift/fredoka.css":"fe5045cb91a4","shared/schrift/fredoka-latin-400-normal.woff2":"c345033f24d8","shared/schrift/fredoka-latin-ext-400-normal.woff2":"a32fc9bb1a14","shared/schrift/fredoka-latin-500-normal.woff2":"84a3167d817d","shared/schrift/fredoka-latin-ext-500-normal.woff2":"082f6b7cfc93","shared/schrift/fredoka-latin-600-normal.woff2":"b9fca786c012","shared/schrift/fredoka-latin-ext-600-normal.woff2":"05bc54a8ba78","shared/schrift/fredoka-latin-700-normal.woff2":"8adf2df55ff4","shared/schrift/fredoka-latin-ext-700-normal.woff2":"56af6eb4dcbc","shared/config.js":"9864478ca498","shared/core.js":"a62d91d6711b","shared/icons/leute-1.js":"786211c96517","shared/icons/leute-2.js":"5f38384d49fa","shared/icons/leute-3.js":"f67538541b97","shared/icons/leute-4.js":"cf9e2c53f7c7","shared/icons/tiere-1.js":"579ba4ad6448","shared/icons/tiere-2.js":"f01435c6516c","shared/icons/tiere-3.js":"38d3319a2ff0","shared/icons/tiere-4.js":"4d3ece9e74b2","shared/icons/essen-sport-1.js":"94a58ea61e03","shared/icons/essen-sport-2.js":"382ff5ad2232","shared/icons/essen-sport-3.js":"99310536b54b","shared/icons/essen-sport-4.js":"5a484eb7d007","shared/icons/orte-1.js":"0422b29108fb","shared/icons/orte-2.js":"9e579bbff226","shared/icons/orte-3.js":"0891dd4cefc3","shared/icons/orte-4.js":"6b9147dad3de","shared/icons/dinge-1.js":"d8c95ca62f69","shared/icons/dinge-2.js":"1d00cb48942b","shared/icons/dinge-3.js":"9e8411c2c76b","shared/icons/dinge-4.js":"a92786e02333","shared/icons/zeichen-1.js":"861c03002744","shared/icons/zeichen-2.js":"5943ceb31c5b","shared/icons/zeichen-3.js":"54eefaf2b4cc","shared/icons/zeichen-4.js":"9cfce4a575da","shared/icons-liste.js":"1a901357a633","shared/emoji.js":"e02d427c3fe8","shared/ereignisse.js":"33722a09bf74","shared/geschenk.js":"272dc594176f","shared/zeige.js":"16ec67164921","shared/szene.js":"67170d0e4e7a","shared/szenen.js":"89da4d0e6eeb","shared/insel-kern.js":"1b0394d6ef42","shared/garten.js":"205c4cabbd97","shared/sprachkurs.js":"f9ee4d6a0964","spiele/garten/":"c27faa2179a5","spiele/garten/beete.js":"d7937e0e86df","spiele/baeckerei/":"c7411f05b2b4","spiele/baeckerei/laden.js":"5331ab840207","spiele/tierstation/":"fe5875557b3f","spiele/angeln/":"e8d28d5e58a9","spiele/angeln/angeln.js":"1de83dcb70b8","spiele/rhythmus/":"83234f0959d0","spiele/rhythmus/boot.js":"69733a9fdec2","spiele/wetter/":"cd8ca622dca2","spiele/wetter/drache.js":"cefe7ebe1092","spiele/expedition/":"45bbfed93e7e","spiele/expedition/expedition.js":"2ef6e751ed70","spiele/leuchtturm/":"e201fd0f52f0","spiele/leuchtturm/leuchtturm.js":"99063fc47a7e","spiele/bruecke/":"6dd65d409323","spiele/bruecke/bruecke.js":"86589229daa0","spiele/tierstation/station.js":"8ea4a74f6a47","shared/einrichten.js":"b301790a127a","shared/spielstand.js":"8ba06301a535","shared/vendor/qrcodegen.js":"b16cb8d81007","shared/vendor/jsQR.js":"b421c6f794b9","icons/icon.svg":"64a219ea3abf","icons/icon-192.png":"88085b614a41","icons/icon-180.png":"af6805eb6332","spiele/anziehen/":"bd6d8db6bd5c","spiele/anziehen/teile.js":"4c8e12b09b23","spiele/anziehen/kind.js":"e8cc8b8b099b","spiele/anziehen/teile2.js":"3d0eb42554e2","spiele/anziehen/spiel.js":"16c7544d1086","spiele/mathe/":"3c7d6c0c02fc","spiele/mathe/aufgaben.js":"1fc1f4b2d673","spiele/mathe/fehler.js":"e333e8953c2b","spiele/mathe/erklaeren.js":"2359ea65cbdc","spiele/mathe/hilfe-ru.js":"5e36ed1639d1","spiele/mathe/hilfe-ru-fragen.js":"9be5393c96b4","spiele/mathe/hilfe-ru-hilfen.js":"0b73428bd038","spiele/mathe/mathe.js":"dd761731491e","shared/sprache.js":"54f1fae0fad5","shared/vorleser.js":"1f227416a8c7","shared/charakter.js":"6a8eb9001c62","shared/lernfunde.js":"383b23460fc2","shared/woerterbuch.js":"0c5aef250361","shared/lernkartei.js":"e77baca5ca29","shared/lieder.js":"4c840fd2399d","shared/familie.js":"90b9d7ee3c9d","shared/echtewelt.js":"f4272402ebca","shared/schatz.js":"fc9b7b93679d","shared/staerken.js":"ec68ff83a4b9","spiele/schatz/":"9853f5bddc8b","spiele/schatz/kammer.js":"27aa61fb283f","spiele/atelier/":"e239770af87a","spiele/atelier/atelier.js":"3572dd365a0d","spiele/atelier/vorlagen.js":"14502f304173","spiele/atelier/musik.js":"49419002741d","shared/bilder.js":"20c464571194","shared/eigenes.js":"320d44362022","spiele/gefuehle/":"fa2c86a16ee7","spiele/gefuehle/gefuehle.js":"47b769ec1b8b","spiele/schach/":"a7a5c4029f33","spiele/schach/regeln.js":"b5eb2ac40da6","spiele/schach/schach.js":"3bf3f99abe76","spiele/familie/duell.html":"2d7b2c2ae217","spiele/familie/duell.js":"a7475d36b429","shared/zeit.js":"659c8c31ba68","shared/sticker.js":"0c21dda037df","shared/inseltuer.js":"082117da494e","spiele/album/":"5256cceccc7d","spiele/album/album.js":"dbae6babd172","shared/figuren.js":"4bb321003db2","shared/lehrplan.js":"043c6ee007df","shared/lehrplan/kern.js":"f289ae2ff727","shared/lehrplan/laender/sachsen.js":"a83bcc2510cf","shared/lehrplan/laender/sachsen-punkte.js":"ef9d126e39b6","shared/inhalte.js":"8012be768cae","shared/koennen.js":"d8fb180bdecb","shared/woerter.js":"bf26cb3ac303","inhalte/woerter/bestand.js":"56cd4a6f84ca","inhalte/woerter/d0.js":"19845f030f89","shared/tiere.js":"792ad3709c7e","shared/tierpflege.js":"175b9c77d448","spiele/tier/":"39687971d81c","spiele/tier/tier.js":"2a0291d12db8","spiele/anziehen/figur.js":"10e38891fa5b","spiele/ich/":"45750b953dc4","spiele/ich/ich.js":"5dc76414fdb9","spiele/eltern/":"e93ac936c59a","spiele/eltern/eltern.js":"3821c0d15dfe","spiele/lesen/":"82b839e7a186","spiele/lesen/lesen.js":"f050a95739d7","inhalte/deutsch/anlaute.js":"16164c1c9c4e","inhalte/deutsch/lesetexte.js":"1f53c1ab80b7","inhalte/deutsch/schreiben.js":"6a9c18c2341a","inhalte/deutsch/schreibschrift.js":"765f83d805c8","inhalte/woerter/anlaute.js":"b3a53e0217a5","spiele/daz/":"078065ce285d","spiele/daz/ankommen.js":"b44a8e97f6d0","shared/daz.js":"2fed4c8a40c3","spiele/deutsch/":"9373083831c7","spiele/deutsch/geschichte.js":"d0f83e9f1db8","spiele/deutsch/werkstatt.js":"24293783c45b","spiele/deutsch/abenteuer.js":"2700292a57bd","spiele/sachkunde/":"3aeff782fc82","spiele/sachkunde/bilder.js":"1e6d91ab4d5c","spiele/sachkunde/themen.js":"feb4926236f5","spiele/sachkunde/transfer.js":"869800c686f9","spiele/sachkunde/landkreise.js":"eb90942d420f","spiele/sachkunde/faecher.js":"f862a3858f64","spiele/sachkunde/religion.js":"18a565a0d1a3","spiele/sachkunde/bewegung.js":"288cba789635","spiele/sachkunde/klang.js":"fdc29a7cfd21","spiele/sachkunde/sachkunde.js":"39627f1033e7","spiele/englisch/":"4f4263149dc1","spiele/englisch/lektionen.js":"5167f0e30a8c","spiele/englisch/englisch.js":"8ad9c9f4a676","spiele/praesentieren/":"fb95e02f9cef","spiele/praesentieren/praesentieren.js":"d975a2437391","spiele/vorlesen/":"dbac7ef04e89","spiele/vorlesen/vorlesen.js":"e3329d95adc9","inhalte/deutsch/vorlesen.js":"ea426200bd02","spiele/robo/":"91bdf3e0f45f","spiele/robo/robo.js":"95e768fbae98","spiele/heft/":"0bd064b63380","spiele/heft/heft.js":"3f35631f912c","spiele/sorbisch/":"af1f3e7a2e6a","spiele/sorbisch/lektionen.js":"93f41b45fdbf","spiele/sorbisch/mutter.js":"09bd6f72bdc5","spiele/vorschule/":"6a5614d4f34b","spiele/vorschule/aufgaben.js":"978a47289646","spiele/vorschule/vorschule.js":"3af280ea3afc","spiele/sorbisch/geprueft.js":"d7c45f5c2046","spiele/sorbisch/sorbisch.js":"54bf3dcb532d","spiele/sorbisch/pruefen.html":"10206cb28a88","spiele/medien/":"98fcb10e6e96","spiele/medien/lektionen.js":"52641343e420","spiele/medien/medien.js":"f6a3062d9e36","spiele/welt3d/":"53fce4e1123c","spiele/welt3d/welt3d.css":"5cde2767425e","spiele/welt3d/ballons.html":"49e01b625c97","spiele/welt3d/ballons.js":"3211a0a1ad32","spiele/welt3d/insel.html":"889f7fd2dd2f","spiele/welt3d/insel.js":"a890b2561505","spiele/insel/":"75ecde63a619","spiele/pixel/insel.html":"6b15650a34be","spiele/welt3d/gemeinsam-63Y3337S.js":"39ae17022112","spiele/welt3d/gemeinsam-JRKQATNJ.js":"e494f8d8dc2b","spiele/welt3d/gemeinsam-O25UZSSK.js":"9cb358d5c3d5","spiele/welt3d/heimat.html":"d84afc05d9eb","spiele/welt3d/heimat.js":"ecf462bed50e","spiele/welt3d/lauf.html":"395e14c81b24","spiele/welt3d/lauf.js":"0ad3fc65f2e6","spiele/welt3d/kart.html":"31ff6658e119","spiele/welt3d/kart.js":"3ba8af0179aa","spiele/welt3d/bau.html":"4b3d4ac4ccdb","spiele/welt3d/bau.js":"f3fda75540c4"};

// ---------- Einrichten einer Version ----------
// Jede Datei kommt mit ihrer Prüfsumme (Kopfzeile X-Lerninsel-PS) in den Cache. Hat eine ältere Version dieselbe Datei mit derselben
// Prüfsumme, wird sie von dort kopiert; sonst aus dem Netz geholt (am HTTP-Cache vorbei) und nachgerechnet. Passt eine geholte Datei
// nicht zur Prüfsumme (z. B. der Server verteilt gerade erst die neue Version), wird nichts aktiv: der nächste Seitenaufruf versucht es neu.
const PS_KOPF = "X-Lerninsel-PS";
const absolut = (e) => new URL(e, self.registration.scope).href;
const norm = (href) => { const u = new URL(href); u.search = ""; u.hash = ""; return u.pathname.endsWith("/") ? u.href + "index.html" : u.href; };
const LISTE = new Map(START.map((e) => [norm(absolut(e)), absolut(e)]));   // normalisierte Adresse → Schlüssel im Cache
const PS = new Map(Object.entries(typeof PRUEFSUMMEN === "object" ? PRUEFSUMMEN : {}).map(([e, h]) => [absolut(e), h]));
const warte = (ms) => new Promise((ok) => setTimeout(ok, ms));
async function pruefsumme(buf) {
  const h = new Uint8Array(await crypto.subtle.digest("SHA-1", buf));
  return [...h].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 12);
}
async function holeGeprueft(schluessel, soll) {
  let letzter = null;
  for (let versuch = 0; versuch < 3; versuch++) {
    if (versuch) await warte(versuch * 1500);
    try {
      const a = await fetch(schluessel, { cache: versuch ? "reload" : "no-cache", credentials: "same-origin" });
      if (!a.ok) { letzter = new Error(a.status + " " + schluessel); continue; }
      const buf = await a.arrayBuffer(), ist = await pruefsumme(buf);
      if (soll && ist !== soll) { letzter = new Error("Prüfsumme passt nicht: " + schluessel); continue; }
      const kopf = new Headers(a.headers); kopf.set(PS_KOPF, ist); kopf.set("X-Lerninsel-Groesse", String(buf.byteLength)); kopf.delete("Content-Length"); kopf.delete("Content-Encoding");
      return new Response(buf, { status: 200, statusText: "OK", headers: kopf });
    } catch (f) { letzter = f; }
  }
  throw letzter || new Error("nicht geladen: " + schluessel);
}
async function installiere() {
  const neu = await caches.open(CACHE);
  const alteNamen = (await caches.keys()).filter((k) => k.startsWith(VORSILBE + "spielwelt-") && k !== CACHE);
  const alte = await Promise.all(alteNamen.map((k) => caches.open(k)));
  const offen = [...new Set(LISTE.values())];
  let geholt = 0, kopiert = 0;
  // höchstens 6 Dateien gleichzeitig (wie ein Browser je Server)
  async function arbeite() {
    for (let s = offen.shift(); s; s = offen.shift()) {
      const soll = PS.get(s) || "";
      const schon = await neu.match(s);   // abgebrochene Einrichtung wird fortgesetzt
      if (schon && soll && schon.headers.get(PS_KOPF) === soll) { kopiert++; continue; }
      let kopie = null;
      if (soll) for (const c of alte) { const a = await c.match(s); if (a && a.headers.get(PS_KOPF) === soll) { kopie = a; break; } }
      if (kopie) { await neu.put(s, kopie); kopiert++; continue; }
      await neu.put(s, await holeGeprueft(s, soll)); geholt++;
    }
  }
  await Promise.all(Array.from({ length: 6 }, arbeite));
  self.__einrichtung = { geholt, kopiert };
}
self.addEventListener("install", (e) => {
  // kein skipWaiting: die neue Version wartet, bis keine Seite der alten mehr offen ist (oder die Startseite allein darum bittet)
  e.waitUntil(installiere());
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith(VORSILBE + "spielwelt-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Die Startseite bittet um die neue Version: nur wenn sie die einzige offene Seite ist (sonst würden andere Fenster mitten in ihrer
// Version umgestellt und lüden danach Skripte der neuen) – dann wird die neue Version aktiv und die Startseite lädt neu.
self.addEventListener("message", (e) => {
  const d = e.data || {};
  if (d.typ === "aktivieren") {
    e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((alle) => {
      if (alle.length <= 1) return self.skipWaiting();
      if (e.source) e.source.postMessage({ typ: "warten", fenster: alle.length });
    }));
  } else if (d.typ === "stand" && e.source) {
    // Elternbereich „Technik & Speicher“ (Paket 5, eigene Idee): Ist diese Version vollständig offline da?
    e.waitUntil(caches.open(CACHE).then(async (c) => {
      const schluessel = [...new Set(LISTE.values())]; let da = 0, bytes = 0;
      for (const s of schluessel) { const a = await c.match(s); if (a) { da++; const l = +(a.headers.get("X-Lerninsel-Groesse") || a.headers.get("Content-Length") || 0); bytes += l || (await a.clone().arrayBuffer()).byteLength; } }
      e.source.postMessage({ typ: "stand", version: CACHE.split("-").pop(), dateien: schluessel.length, da, bytes });
    }));
  }
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;   // seit 01.11.2026 keine fremden Schriften mehr (Fredoka liegt in shared/schrift/)
  const schluessel = LISTE.get(norm(url.href));
  if (schluessel) {
    // Teil der Version: immer aus dem eigenen Cache – so passen Seite und Skripte immer zusammen. Fehlt etwas (sollte nicht vorkommen), aus dem Netz.
    e.respondWith(caches.open(CACHE).then((c) => c.match(schluessel)).then((a) => a || fetch(e.request)));
    return;
  }
  // Nicht in der Offline-Liste (Prüfseiten, Probeszene …): aus dem Netz, offline aus dem Speicher dieser Version
  e.respondWith(caches.open(CACHE).then(async (cache) => {
    try {
      const a = await fetch(e.request);
      if (a && a.ok) cache.put(e.request, a.clone());
      return a;
    } catch (f) {
      const alt = await cache.match(e.request, { ignoreSearch: true });
      if (alt) return alt;
      throw f;
    }
  }));
});
