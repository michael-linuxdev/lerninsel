// Lebendige Insel-Tür (Eine Welt, eigene Idee, 07.11.2026): Das kleine Bild der Insel auf der Startseite zeigt dieselbe Tages- und Jahreszeit
// wie die 3D-Insel (gleiche Regeln wie InselKern.zeit: Nacht ab 20 Uhr bis 6:30, Dämmerung bis 8 und ab 18 Uhr; Winter Dez–Feb usw.) und das zuletzt
// gemessene Wetter aus dem Insel-Speicher (localStorage „lerninsel.wetter“, kein neuer Abruf). Nachts Mond und Sterne auf dunklem Grund,
// im Winter Schnee auf Dach und Wiese, im Herbst ein bunter Busch, bei Regen Tropfen. Rein dekorativ, nichts wird gespeichert.
// Test-Haken: window.__inseltuer() → { nacht, daemmer, saison, wetter }. Test: ?stunde=21, ?monat=12 auf der Startseite wie auf der Insel.
(function () {
  const svg = document.querySelector("#tuer-insel svg.insel-bild"), tuer = document.getElementById("tuer-insel");
  if (!svg || !tuer) return;
  const q = new URLSearchParams(location.search), jetzt = new Date(window.__jetzt || Date.now());
  const STUNDE = q.has("stunde") ? +q.get("stunde") : jetzt.getHours() + jetzt.getMinutes() / 60;
  const MONAT = q.has("monat") ? +q.get("monat") : jetzt.getMonth() + 1;
  const SAISON = [12, 1, 2].includes(MONAT) ? "winter" : [3, 4, 5].includes(MONAT) ? "fruehling" : [9, 10, 11].includes(MONAT) ? "herbst" : "sommer";
  const NACHT = STUNDE >= 20 || STUNDE < 6.5, DAEMMER = !NACHT && (STUNDE >= 18 || STUNDE < 8);
  let wetter = q.get("wetter") || "";
  if (!wetter) try { const w = JSON.parse(localStorage.getItem("lerninsel.wetter") || "null"); if (w && w.art && Date.now() - (w.zeit || 0) < 6 * 3600e3) wetter = w.art; } catch (e) { /* egal */ }
  const $ = (k) => svg.querySelector(".it-" + k), zeige = (k, an) => { const e = $(k); if (e) e.style.display = an ? "" : "none"; };
  zeige("sonne", !NACHT && !["regen", "gewitter"].includes(wetter)); zeige("mond", NACHT);
  zeige("regen", ["regen", "gewitter"].includes(wetter)); zeige("flocken", wetter === "schnee");
  zeige("schnee", SAISON === "winter");
  if (DAEMMER && $("sonne")) $("sonne").setAttribute("fill", "#FF9E5E");
  if (SAISON === "winter" && $("gras")) $("gras").setAttribute("fill", "#EEF5FB");
  const busch = { fruehling: "#FF9BC8", sommer: "#5DBB5A", herbst: "#F08A3C", winter: "#FFFFFF" }[SAISON];
  if ($("busch")) $("busch").setAttribute("fill", busch);
  if (NACHT && $("fenster")) $("fenster").setAttribute("fill", "#FFD46B");   // Licht im Fenster, wie auf der Insel
  tuer.classList.toggle("nacht", NACHT); tuer.classList.toggle("daemmer", DAEMMER);
  tuer.dataset.saison = SAISON;
  window.__inseltuer = () => ({ nacht: NACHT, daemmer: DAEMMER, saison: SAISON, wetter });
})();
