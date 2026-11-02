// Offline-Speicher: Seiten werden beim ersten Besuch gemerkt und
// danach auch ohne Internet geladen. Bei Internet wird im Hintergrund aktualisiert.
// /dev hat einen eigenen Cache, damit sich Test- und echte Seite nicht gegenseitig löschen
const VORSILBE = self.registration.scope.includes("/dev/test/") ? "test-" : self.registration.scope.includes("/dev/") ? "dev-" : "";
const CACHE = VORSILBE + "spielwelt-aee5ab7c4c";
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
  "spiele/welt3d/gemeinsam-7QWMQZPP.js",
  "spiele/welt3d/gemeinsam-D64NT744.js",
  "spiele/welt3d/heimat.html",
  "spiele/welt3d/heimat.js",
  "spiele/welt3d/lauf.html",
  "spiele/welt3d/lauf.js",
  "spiele/welt3d/kart.html",
  "spiele/welt3d/kart.js",
  "spiele/welt3d/bau.html",
  "spiele/welt3d/bau.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(START)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith(VORSILBE + "spielwelt-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  const eigen = url.origin === location.origin;
  if (!eigen) return;   // seit 01.11.2026 keine fremden Schriften mehr (Fredoka liegt in shared/schrift/)

  // Seiten (HTML) zuerst aus dem Netz (höchstens 3 s), damit HTML und Skripte derselben Version zusammenpassen; offline aus dem Speicher
  if (e.request.mode === "navigate") {
    e.respondWith(caches.open(CACHE).then(async (cache) => {
      const alt = await cache.match(e.request, { ignoreSearch: true });
      const netz = fetch(e.request).then((antwort) => { if (antwort && antwort.ok) cache.put(e.request, antwort.clone()); return antwort; });
      if (!alt) return netz;
      const frist = new Promise((ok) => setTimeout(() => ok(alt), 3000));
      return Promise.race([netz.then((a) => (a && a.ok ? a : alt)).catch(() => alt), frist]);
    }));
    return;
  }

  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const alt = await cache.match(e.request, { ignoreSearch: eigen });
      const neu = fetch(e.request).then((antwort) => {
        if (antwort && (antwort.ok || antwort.type === "opaque")) cache.put(e.request, antwort.clone());
        return antwort;
      }).catch(() => alt);
      return alt || neu;
    })
  );
});
