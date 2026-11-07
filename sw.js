// Offline-Speicher (Paket 5, 07.11.2026): Jede Version der Lerninsel liegt vollständig in genau einem Cache (CACHE). Seiten und Skripte
// kommen immer aus diesem Cache (cache-first) – nie halb aus dem Netz und halb aus dem Speicher, und nichts wird im Hintergrund in einen
// alten Cache geschrieben. Eine neue Version wird im Hintergrund vorbereitet (nur geänderte Dateien werden geholt, unveränderte aus dem
// alten Cache kopiert, siehe PRUEFSUMMEN am Ende) und erst aktiv, wenn keine Seite der alten Version mehr offen ist: beim nächsten Start
// der App, oder wenn die Startseite allein offen ist (core.js fragt dann nach, die Startseite lädt neu). Test: tests/swupdate.js.
// /dev hat einen eigenen Cache, damit sich Test- und echte Seite nicht gegenseitig löschen
const VORSILBE = self.registration.scope.includes("/dev/test/") ? "test-" : self.registration.scope.includes("/dev/") ? "dev-" : "";
const CACHE = VORSILBE + "spielwelt-a34d1744ea";
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
  "shared/icons.js",
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
  "shared/charakter.js",
  "shared/lernfunde.js",
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
  "spiele/sachkunde/landkreise.js",
  "spiele/sachkunde/faecher.js",
  "spiele/sachkunde/religion.js",
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
const PRUEFSUMMEN = {"./":"376fbec65dc5","index.html":"376fbec65dc5","manifest.webmanifest":"66560cbbc52f","shared/style.css":"93db82b2c51e","shared/schrift/fredoka.css":"fe5045cb91a4","shared/schrift/fredoka-latin-400-normal.woff2":"c345033f24d8","shared/schrift/fredoka-latin-ext-400-normal.woff2":"a32fc9bb1a14","shared/schrift/fredoka-latin-500-normal.woff2":"84a3167d817d","shared/schrift/fredoka-latin-ext-500-normal.woff2":"082f6b7cfc93","shared/schrift/fredoka-latin-600-normal.woff2":"b9fca786c012","shared/schrift/fredoka-latin-ext-600-normal.woff2":"05bc54a8ba78","shared/schrift/fredoka-latin-700-normal.woff2":"8adf2df55ff4","shared/schrift/fredoka-latin-ext-700-normal.woff2":"56af6eb4dcbc","shared/config.js":"51f013c32e6e","shared/core.js":"2132d8c37b61","shared/icons.js":"b3514a2698bf","shared/icons-liste.js":"31d1cf4bc8eb","shared/emoji.js":"0b081a74943e","shared/ereignisse.js":"00fd280147aa","shared/geschenk.js":"272dc594176f","shared/zeige.js":"16ec67164921","shared/szene.js":"9d84e9078935","shared/szenen.js":"5e237c02e38f","shared/insel-kern.js":"bb559c7e52eb","shared/garten.js":"205c4cabbd97","shared/sprachkurs.js":"f9ee4d6a0964","spiele/garten/":"5516a76158f2","spiele/garten/beete.js":"d7937e0e86df","spiele/baeckerei/":"d4b31f136122","spiele/baeckerei/laden.js":"5331ab840207","spiele/tierstation/":"f4d9bee994af","spiele/angeln/":"157b1e5fd839","spiele/angeln/angeln.js":"1de83dcb70b8","spiele/rhythmus/":"ca3efa7b360b","spiele/rhythmus/boot.js":"69733a9fdec2","spiele/wetter/":"8167e7e718cd","spiele/wetter/drache.js":"cefe7ebe1092","spiele/expedition/":"19239fdb76ff","spiele/expedition/expedition.js":"9d71e2c936f9","spiele/leuchtturm/":"c5e2acc4247a","spiele/leuchtturm/leuchtturm.js":"486ec617f3c5","spiele/tierstation/station.js":"4a1dac2e7007","shared/einrichten.js":"b301790a127a","shared/spielstand.js":"8ba06301a535","shared/vendor/qrcodegen.js":"b16cb8d81007","shared/vendor/jsQR.js":"b421c6f794b9","icons/icon.svg":"64a219ea3abf","icons/icon-192.png":"88085b614a41","icons/icon-180.png":"af6805eb6332","spiele/anziehen/":"12e0207f6013","spiele/anziehen/teile.js":"4c8e12b09b23","spiele/anziehen/kind.js":"e8cc8b8b099b","spiele/anziehen/teile2.js":"b4ecb2262069","spiele/anziehen/spiel.js":"16c7544d1086","spiele/mathe/":"071531b6c4e7","spiele/mathe/aufgaben.js":"4c08b73fe9f2","spiele/mathe/fehler.js":"e333e8953c2b","spiele/mathe/erklaeren.js":"88568a45f280","spiele/mathe/hilfe-ru.js":"5e36ed1639d1","spiele/mathe/hilfe-ru-fragen.js":"9be5393c96b4","spiele/mathe/hilfe-ru-hilfen.js":"0b73428bd038","spiele/mathe/mathe.js":"b601b4c8dab8","shared/sprache.js":"54f1fae0fad5","shared/charakter.js":"6a8eb9001c62","shared/lernfunde.js":"383b23460fc2","shared/lernkartei.js":"e77baca5ca29","shared/lieder.js":"4c840fd2399d","shared/familie.js":"90b9d7ee3c9d","shared/echtewelt.js":"1e101cc9f43b","shared/schatz.js":"fc9b7b93679d","shared/staerken.js":"ec68ff83a4b9","spiele/schatz/":"297fea5c5621","spiele/schatz/kammer.js":"27aa61fb283f","spiele/atelier/":"e239770af87a","spiele/atelier/atelier.js":"3572dd365a0d","spiele/atelier/vorlagen.js":"14502f304173","spiele/atelier/musik.js":"49419002741d","shared/bilder.js":"20c464571194","shared/eigenes.js":"5624cb58d5f9","spiele/gefuehle/":"fa2c86a16ee7","spiele/gefuehle/gefuehle.js":"47b769ec1b8b","spiele/schach/":"a7a5c4029f33","spiele/schach/regeln.js":"b5eb2ac40da6","spiele/schach/schach.js":"3bf3f99abe76","spiele/familie/duell.html":"2d7b2c2ae217","spiele/familie/duell.js":"a7475d36b429","shared/zeit.js":"659c8c31ba68","shared/sticker.js":"5b70bc5ca22e","spiele/album/":"7cc19f511d5b","spiele/album/album.js":"568ad1ab8b58","shared/figuren.js":"4bb321003db2","shared/lehrplan.js":"043c6ee007df","shared/lehrplan/kern.js":"f289ae2ff727","shared/lehrplan/laender/sachsen.js":"7ef4f79911f3","shared/lehrplan/laender/sachsen-punkte.js":"f900540f3d2b","shared/inhalte.js":"8012be768cae","shared/koennen.js":"d8fb180bdecb","shared/woerter.js":"bf26cb3ac303","inhalte/woerter/bestand.js":"56cd4a6f84ca","inhalte/woerter/d0.js":"19845f030f89","shared/tiere.js":"792ad3709c7e","shared/tierpflege.js":"175b9c77d448","spiele/tier/":"9aac75e8b05b","spiele/tier/tier.js":"2a0291d12db8","spiele/anziehen/figur.js":"10e38891fa5b","spiele/ich/":"9919ad54c61c","spiele/ich/ich.js":"5dc76414fdb9","spiele/eltern/":"fba397df116f","spiele/eltern/eltern.js":"0f8b46cc3eb6","spiele/lesen/":"d440dc4cabb0","spiele/lesen/lesen.js":"381349efcfef","inhalte/deutsch/anlaute.js":"16164c1c9c4e","inhalte/deutsch/lesetexte.js":"1f53c1ab80b7","inhalte/deutsch/schreiben.js":"6a9c18c2341a","inhalte/deutsch/schreibschrift.js":"765f83d805c8","inhalte/woerter/anlaute.js":"b3a53e0217a5","spiele/daz/":"4b1dc462e968","spiele/daz/ankommen.js":"b44a8e97f6d0","shared/daz.js":"2fed4c8a40c3","spiele/deutsch/":"2dc361cad973","spiele/deutsch/geschichte.js":"d0f83e9f1db8","spiele/deutsch/werkstatt.js":"88d1ebfa5d89","spiele/deutsch/abenteuer.js":"5e8342bc72fe","spiele/sachkunde/":"9df8b5d64301","spiele/sachkunde/bilder.js":"1e6d91ab4d5c","spiele/sachkunde/themen.js":"e9f2eac3506b","spiele/sachkunde/landkreise.js":"eb90942d420f","spiele/sachkunde/faecher.js":"cfa203916547","spiele/sachkunde/religion.js":"cef363144021","spiele/sachkunde/sachkunde.js":"d31abcdccc18","spiele/englisch/":"a0b1cf04ecb5","spiele/englisch/lektionen.js":"36a1eb0aa4da","spiele/englisch/englisch.js":"336a776c7aaf","spiele/praesentieren/":"12b704802d33","spiele/praesentieren/praesentieren.js":"d975a2437391","spiele/vorlesen/":"490b38ecc34a","spiele/vorlesen/vorlesen.js":"e3329d95adc9","inhalte/deutsch/vorlesen.js":"ea426200bd02","spiele/robo/":"82c168c6ddc1","spiele/robo/robo.js":"95e768fbae98","spiele/heft/":"f61863d751e2","spiele/heft/heft.js":"3f35631f912c","spiele/sorbisch/":"abe36558ab16","spiele/sorbisch/lektionen.js":"93f41b45fdbf","spiele/sorbisch/mutter.js":"09bd6f72bdc5","spiele/vorschule/":"617dd16b1109","spiele/vorschule/aufgaben.js":"be73bcc81d6d","spiele/vorschule/vorschule.js":"f0dff2652992","spiele/sorbisch/geprueft.js":"d7c45f5c2046","spiele/sorbisch/sorbisch.js":"54bf3dcb532d","spiele/sorbisch/pruefen.html":"10206cb28a88","spiele/medien/":"255cd8b87a26","spiele/medien/lektionen.js":"52641343e420","spiele/medien/medien.js":"79589ff1b6d1","spiele/welt3d/":"53fce4e1123c","spiele/welt3d/welt3d.css":"5cde2767425e","spiele/welt3d/ballons.html":"49e01b625c97","spiele/welt3d/ballons.js":"3211a0a1ad32","spiele/welt3d/insel.html":"889f7fd2dd2f","spiele/welt3d/insel.js":"a890b2561505","spiele/insel/":"75ecde63a619","spiele/pixel/insel.html":"6b15650a34be","spiele/welt3d/gemeinsam-63Y3337S.js":"39ae17022112","spiele/welt3d/gemeinsam-JRKQATNJ.js":"e494f8d8dc2b","spiele/welt3d/gemeinsam-O25UZSSK.js":"9cb358d5c3d5","spiele/welt3d/heimat.html":"95a9b050210c","spiele/welt3d/heimat.js":"9be639466ad1","spiele/welt3d/lauf.html":"395e14c81b24","spiele/welt3d/lauf.js":"0ad3fc65f2e6","spiele/welt3d/kart.html":"31ff6658e119","spiele/welt3d/kart.js":"3ba8af0179aa","spiele/welt3d/bau.html":"4b3d4ac4ccdb","spiele/welt3d/bau.js":"f3fda75540c4"};

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
