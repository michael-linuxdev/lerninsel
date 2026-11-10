// Installations-Hinweis beim Start im Browser (Muster aus dem Repo „idlegame“, dort InstallGate): Auf Tablet und Handy im Browser erscheint
// ein Vollbild-Hinweis „Zuerst die App installieren“ mit der Anleitung, die zu Gerät und Browser passt. „Ohne Installation im Browser weiter“
// gilt 6 Stunden, danach kommt der Hinweis wieder. Nie in der installierten App (Home-Bildschirm), nie am Computer, nie, wenn die Eltern die
// Karte „Home-Bildschirm“ im Elternbereich ausgeblendet haben (eltern.homeHinweis = "aus"). Automatische Browser (Tests) sehen ihn nur mit
// ?installHinweis=1. Warum so deutlich: Safari löscht die Daten einer Webseite nach 7 Tagen ohne Besuch – als App passiert das nicht –, und auf
// iPhone/iPad hat die App einen eigenen Speicher (was im Browser gespielt wurde, kommt nicht von selbst mit).
// Eingebunden auf der Startseite und im Elternbereich (dort landet der erste Besuch). Test-Haken window.__installHinweis.
(function () {
  "use strict";
  const KEY = "lerninsel.installhinweis", STUNDEN = 6;
  const T = {
    fuer: { de: "Für Erwachsene", ru: "Для взрослых" },
    titel: { de: "Zuerst die App installieren", ru: "Сначала установите приложение" },
    so: { de: "So geht’s", ru: "Как это сделать" },
    erkannt: { de: "Erkannt", ru: "Определено" },
    jetzt: { de: "📲 Jetzt installieren", ru: "📲 Установить сейчас" },
    warum: [
      { de: ["Immer auf dem Home-Bildschirm", " – wie eine richtige App, ohne Adressleiste."], ru: "Всегда на экране «Домой» – как настоящее приложение." },
      { de: ["Geht auch ohne Internet", " – die Lerninsel läuft offline."], ru: "Работает и без интернета." },
      { de: ["Sterne und Fortschritt bleiben", " – der Browser löscht den Spielstand sonst nach 7 Tagen ohne Besuch."], ru: "Звёзды и успехи сохраняются – иначе браузер удаляет игру через 7 дней без посещения." }
    ],
    ios: { de: "Wichtig auf iPad und iPhone: Was hier im Browser gespielt wird, kommt nicht von selbst in die installierte App. Darum jetzt zuerst installieren.",
      ru: "Важно на iPad и iPhone: то, что сыграно здесь в браузере, само не попадёт в установленное приложение. Поэтому сначала установите." },
    schon: { de: "Schon im Browser gespielt? Erst den Spielstand sichern (Startseite → 💾 Spielstand → „Als Datei sichern“) und in der App mit „Datei laden“ holen.",
      ru: "Уже играли в браузере? Сначала сохраните игру (главная страница → 💾 Spielstand → «Als Datei sichern») и загрузите её в приложении через «Datei laden»." },
    kopieren: { de: "🔗 Adresse kopieren", ru: "🔗 Скопировать адрес" },
    kopiert: { de: "Adresse kopiert – im Browser einfügen", ru: "Адрес скопирован – вставьте в браузер" },
    weiter: { de: "Ohne Installation im Browser weiter", ru: "Продолжить в браузере без установки" },
    spaeter: { de: "Der Hinweis kommt in ein paar Stunden wieder. Dauerhaft ausblenden: Elternbereich → Kinder & Gerät → Karte „Home-Bildschirm“.",
      ru: "Подсказка появится снова через несколько часов. Отключить навсегда: раздел для родителей → «Kinder & Gerät» → карточка «Home-Bildschirm»." },
    geraet: { ios: "iPad / iPhone", android: "Android", desktop: "Computer" },
    browser: { safari: "Safari", chrome: "Chrome", firefox: "Firefox", edge: "Edge", samsung: "Samsung Internet", opera: "Opera", inapp: "In-App-Browser", other: "Browser" },
    // {S} = Teilen-Symbol
    schritte: {
      "ios-safari": [
        { de: "Oben (iPad) bzw. unten (iPhone) auf das Teilen-Symbol {S} tippen.", ru: "Нажмите значок «Поделиться» {S} вверху (iPad) или внизу (iPhone)." },
        { de: "Nach unten scrollen und „Zum Home-Bildschirm“ wählen.", ru: "Прокрутите вниз и выберите «На экран „Домой“»." },
        { de: "Oben rechts auf „Hinzufügen“ tippen. Ab jetzt die Lerninsel über das neue Symbol öffnen.", ru: "Нажмите «Добавить» справа вверху. Теперь открывайте Лерн-инзель через новый значок." }
      ],
      "ios-chrome": [
        { de: "Oben rechts in der Adresszeile auf das Teilen-Symbol {S} tippen.", ru: "Нажмите значок «Поделиться» {S} справа в адресной строке." },
        { de: "„Zum Home-Bildschirm“ wählen (eventuell erst „Mehr“ antippen).", ru: "Выберите «На экран „Домой“» (возможно, сначала «Ещё»)." },
        { de: "Auf „Hinzufügen“ tippen.", ru: "Нажмите «Добавить»." }
      ],
      "ios-firefox": [
        { de: "Unten rechts auf das Menü ☰ tippen.", ru: "Нажмите меню ☰ справа внизу." },
        { de: "„Teilen“ wählen, dann „Zum Home-Bildschirm“.", ru: "Выберите «Поделиться», затем «На экран „Домой“»." },
        { de: "Auf „Hinzufügen“ tippen.", ru: "Нажмите «Добавить»." }
      ],
      "ios-edge": [
        { de: "Unten auf das Menü ⋯ tippen, dann auf „Teilen“ {S}.", ru: "Нажмите меню ⋯ внизу, затем «Поделиться» {S}." },
        { de: "„Zum Home-Bildschirm“ wählen.", ru: "Выберите «На экран „Домой“»." },
        { de: "Auf „Hinzufügen“ tippen.", ru: "Нажмите «Добавить»." }
      ],
      "ios-other": [
        { de: "Diese Seite in Safari öffnen (Adresse kopieren und in Safari einfügen).", ru: "Откройте эту страницу в Safari (скопируйте адрес и вставьте в Safari)." },
        { de: "Dann Teilen {S} → „Zum Home-Bildschirm“ → „Hinzufügen“.", ru: "Затем «Поделиться» {S} → «На экран „Домой“» → «Добавить»." }
      ],
      "android-chrome": [
        { de: "Oben rechts auf das Menü ⋮ tippen.", ru: "Нажмите меню ⋮ справа вверху." },
        { de: "„App installieren“ oder „Zum Startbildschirm hinzufügen“ wählen.", ru: "Выберите «Установить приложение» или «Добавить на главный экран»." },
        { de: "Mit „Installieren“ bestätigen.", ru: "Подтвердите кнопкой «Установить»." }
      ],
      "android-samsung": [
        { de: "Unten rechts auf das Menü ☰ tippen.", ru: "Нажмите меню ☰ справа внизу." },
        { de: "„Seite hinzufügen zu“ wählen, dann „Startbildschirm“.", ru: "Выберите «Добавить страницу в», затем «Главный экран»." },
        { de: "Mit „Hinzufügen“ bestätigen.", ru: "Подтвердите кнопкой «Добавить»." }
      ],
      "android-firefox": [
        { de: "Auf das Menü ⋮ tippen.", ru: "Нажмите меню ⋮." },
        { de: "„Installieren“ bzw. „Zum Startbildschirm hinzufügen“ wählen.", ru: "Выберите «Установить» или «Добавить на главный экран»." },
        { de: "Mit „Hinzufügen“ bestätigen.", ru: "Подтвердите кнопкой «Добавить»." }
      ],
      "android-edge": [
        { de: "Unten auf das Menü ⋯ tippen.", ru: "Нажмите меню ⋯ внизу." },
        { de: "„Zum Telefon hinzufügen“ bzw. „App installieren“ wählen.", ru: "Выберите «Добавить на телефон» или «Установить приложение»." },
        { de: "Bestätigen.", ru: "Подтвердите." }
      ],
      "android-opera": [
        { de: "Auf das Menü ⋮ tippen.", ru: "Нажмите меню ⋮." },
        { de: "„Zum Startbildschirm hinzufügen“ wählen.", ru: "Выберите «Добавить на главный экран»." },
        { de: "Bestätigen.", ru: "Подтвердите." }
      ],
      "android-other": [
        { de: "Diese Seite am besten in Chrome öffnen.", ru: "Лучше откройте эту страницу в Chrome." },
        { de: "Menü ⋮ → „App installieren“.", ru: "Меню ⋮ → «Установить приложение»." }
      ],
      inapp: [
        { de: "Die Seite wurde aus einer App geöffnet (z. B. WhatsApp oder Telegram). Von dort lässt sich nichts installieren.", ru: "Страница открыта из приложения (например, WhatsApp или Telegram). Оттуда установить нельзя." },
        { de: "Oben rechts auf ⋯ bzw. ⋮ tippen und „Im Browser öffnen“ wählen.", ru: "Нажмите ⋯ или ⋮ справа вверху и выберите «Открыть в браузере»." },
        { de: "Dann erscheint die passende Anleitung.", ru: "Тогда появится подходящая инструкция." }
      ]
    },
    status: { ru: "entwurf" }
  };

  // ---------- Erkennen (ohne DOM, auch in Node testbar) ----------
  function plattform(ua, maxTouchPoints, platform) {
    ua = String(ua || "");
    const ios = /iPhone|iPad|iPod/.test(ua) || (platform === "MacIntel" && maxTouchPoints > 1);
    const android = /Android/.test(ua);
    const inapp = /Instagram|FBAN|FBAV|Line\/|Telegram|WhatsApp|TikTok|; wv\)/i.test(ua);
    let browser = "other";
    if (inapp) browser = "inapp";
    else if (ios) browser = /CriOS/.test(ua) ? "chrome" : /FxiOS/.test(ua) ? "firefox" : /EdgiOS/.test(ua) ? "edge" : /Safari/.test(ua) ? "safari" : "other";
    else if (android) browser = /SamsungBrowser/.test(ua) ? "samsung" : /Firefox/.test(ua) ? "firefox" : /EdgA/.test(ua) ? "edge" : /OPR|Opera/.test(ua) ? "opera" : /Chrome/.test(ua) ? "chrome" : "other";
    return { os: ios ? "ios" : android ? "android" : "desktop", browser };
  }
  function schritteKey(os, browser) {
    if (browser === "inapp") return "inapp";
    if (os === "ios") return ["safari", "chrome", "firefox", "edge"].includes(browser) ? "ios-" + browser : "ios-other";
    return ["chrome", "samsung", "firefox", "edge", "opera"].includes(browser) ? "android-" + browser : "android-other";
  }
  function sollZeigen(o) {
    if (o.aus || o.alsApp || o.os === "desktop") return false;
    if (o.erzwungen) return true;
    if (o.webdriver) return false;
    return !o.uebersprungen;
  }
  if (typeof module !== "undefined" && module.exports) { module.exports = { plattform, schritteKey, sollZeigen, T, STUNDEN }; return; }

  // ---------- Im Browser ----------
  const S = window.Spielwelt;
  const jetzt = () => window.__jetzt || Date.now();
  const alsApp = () => {
    if (typeof window.__standalone === "boolean") return window.__standalone;
    try { return navigator.standalone === true || matchMedia("(display-mode: standalone)").matches || matchMedia("(display-mode: fullscreen)").matches; } catch (e) { return false; }
  };
  const uebersprungen = () => { try { return jetzt() - Number(localStorage.getItem(KEY) || 0) < STUNDEN * 3600000; } catch (e) { return false; } };
  const elternAus = () => { try { return !!(S && S.lade && (S.lade("eltern") || {}).homeHinweis === "aus"); } catch (e) { return false; } };
  const hilfeRu = () => { try { const h = S && S.hilfe && S.hilfe(); return !!(h && h.code === "ru"); } catch (e) { return false; } };
  const esc = (t) => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const TEILEN = `<svg class="ih-teilen" viewBox="0 0 24 24" aria-label="Teilen" role="img"><path d="M12 15V3M8 7l4-4 4 4M6 11H5v9h14v-9h-1" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const mitS = (t) => esc(t).replace(/\{S\}/g, TEILEN);

  let angebot = null, el = null;   // Android: beforeinstallprompt
  addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); angebot = e; const b = document.getElementById("ih-jetzt"); if (b) b.hidden = false; });
  addEventListener("appinstalled", () => { angebot = null; schliesse(); });

  function stil() {
    if (document.getElementById("ih-stil")) return;
    const s = document.createElement("style"); s.id = "ih-stil";
    s.textContent = `
#installhinweis{position:fixed;inset:0;z-index:200;background:rgba(40,30,80,.72);display:grid;place-items:center;padding:14px;padding-top:max(14px,env(safe-area-inset-top));padding-bottom:max(14px,env(safe-area-inset-bottom));overflow:auto}
.ih-karte{background:#fff;color:#3B1F63;border:3px solid #3B1F63;border-radius:28px;box-shadow:0 8px 0 #3B1F63;padding:18px 20px 16px;width:min(560px,100%);font:500 1.05rem/1.4 Fredoka,system-ui,sans-serif;text-align:left}
.ih-kopf{display:flex;align-items:center;gap:14px;margin-bottom:8px}.ih-kopf img{width:72px;height:72px;border-radius:17px;border:3px solid #3B1F63;flex:none}
.ih-fuer{margin:0;font-size:.85rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#7B55B8}.ih-karte h2{margin:0;font-size:1.5rem;line-height:1.2}
.ih-erkannt{margin:2px 0 0;font-size:.9rem;color:#6B5A8C}
.ih-karte h3{margin:12px 0 6px;font-size:1.1rem}
.ih-schritte{margin:0;padding:0;list-style:none;counter-reset:ih;display:grid;gap:8px}
.ih-schritte li{counter-increment:ih;display:grid;grid-template-columns:34px 1fr;gap:10px;align-items:start;background:#F6F2FF;border-radius:16px;padding:10px 12px;font-weight:600}
.ih-schritte li::before{content:counter(ih);width:34px;height:34px;border-radius:50%;background:#3B1F63;color:#fff;display:grid;place-items:center;font-weight:700}
.ih-teilen{width:1.25em;height:1.25em;vertical-align:-.25em;color:#2F86C8}
.ih-warum{margin:12px 0 0;padding:0;list-style:none;display:grid;gap:4px;font-size:.98rem}.ih-warum li::before{content:"✓ ";color:#2FA37C;font-weight:700}
.ih-wichtig{margin:12px 0 0;background:#FFF6D6;border-radius:14px;padding:10px 12px;font-size:.95rem}
.ih-wichtig + .ih-wichtig{margin-top:6px;background:#EEF6FF}
.ih-karte .ru{display:block;font-size:.88em;font-weight:500;color:#7A4A10}
.ih-knoepfe{display:grid;gap:10px;margin-top:14px}
.ih-knoepfe button{min-height:56px;border-radius:18px;font:inherit;font-weight:700;font-size:1.1rem;cursor:pointer;padding:6px 14px}
.ih-knoepfe button[hidden]{display:none}
#ih-jetzt{background:#2FA37C;color:#fff;border:3px solid #3B1F63;box-shadow:0 5px 0 #3B1F63}
#ih-kopieren{background:#fff;color:#3B1F63;border:3px solid #3B1F63;box-shadow:0 5px 0 #3B1F63}
#ih-weiter{background:none;border:0;color:#3B1F63;text-decoration:underline;font-weight:600;font-size:1rem}
.ih-spaeter{margin:2px 0 0;font-size:.82rem;color:#6B5A8C;text-align:center}
@media (max-height:700px){.ih-kopf img{width:52px;height:52px}.ih-karte h2{font-size:1.25rem}.ih-karte{font-size:.98rem;padding:14px 16px 12px}}`;
    document.head.appendChild(s);
  }
  function wurzel() { const k = document.querySelector('script[src*="shared/installhinweis.js"]'); return k ? k.getAttribute("src").replace(/shared\/installhinweis\.js.*$/, "") : "./"; }

  function zeige(pl) {
    if (el || !document.body) return;
    stil();
    const ru = hilfeRu(), zwei = (x) => `${mitS(x.de)}${ru && x.ru ? `<span class="ru" lang="ru">${mitS(x.ru)}</span>` : ""}`;
    const key = schritteKey(pl.os, pl.browser), schritte = T.schritte[key] || T.schritte["android-other"];
    const adresse = key === "inapp" || key === "ios-other" || key === "android-other";
    el = document.createElement("div"); el.id = "installhinweis"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-labelledby", "ih-titel");
    el.dataset.emoji = "aus"; el.dataset.schritte = key;
    el.innerHTML = `<div class="ih-karte">
      <div class="ih-kopf"><img src="${wurzel()}icons/icon-192.png" alt="" width="72" height="72">
        <div><p class="ih-fuer">${zwei(T.fuer)}</p><h2 id="ih-titel">${zwei(T.titel)}</h2>
        <p class="ih-erkannt">${esc(T.erkannt.de)}: ${esc(T.geraet[pl.os])} · ${esc(T.browser[pl.browser])}</p></div></div>
      <h3>${zwei(T.so)}</h3>
      <ol class="ih-schritte">${schritte.map(x => `<li><span>${zwei(x)}</span></li>`).join("")}</ol>
      <ul class="ih-warum">${T.warum.map(x => `<li><b>${esc(x.de[0])}</b>${esc(x.de[1])}${ru ? `<span class="ru" lang="ru">${esc(x.ru)}</span>` : ""}</li>`).join("")}</ul>
      ${pl.os === "ios" ? `<p class="ih-wichtig">${zwei(T.ios)}</p>` : ""}
      <p class="ih-wichtig">${zwei(T.schon)}</p>
      <div class="ih-knoepfe">
        <button type="button" id="ih-jetzt"${angebot ? "" : " hidden"}>${esc(T.jetzt.de)}</button>
        <button type="button" id="ih-kopieren"${adresse ? "" : " hidden"}>${esc(T.kopieren.de)}</button>
        <button type="button" id="ih-weiter">${zwei(T.weiter)}</button>
      </div>
      <p class="ih-spaeter">${zwei(T.spaeter)}</p></div>`;
    document.body.appendChild(el);
    el.querySelector("#ih-weiter").addEventListener("click", () => { try { localStorage.setItem(KEY, String(jetzt())); } catch (e) { /* privater Modus */ } schliesse(); });
    el.querySelector("#ih-jetzt").addEventListener("click", async () => {
      const a = angebot; if (!a) return;
      try { await a.prompt(); const w = await a.userChoice; angebot = null; if (w && w.outcome === "accepted") schliesse(); else el && (el.querySelector("#ih-jetzt").hidden = true); } catch (e) { /* Anleitung bleibt stehen */ }
    });
    el.querySelector("#ih-kopieren").addEventListener("click", async (ev) => {
      const b = ev.currentTarget, adr = location.origin + location.pathname.replace(/spiele\/.*$/, "");
      try { await navigator.clipboard.writeText(adr); b.textContent = T.kopiert.de; } catch (e) { b.textContent = adr; }
    });
    const erster = el.querySelector("#ih-jetzt:not([hidden])") || el.querySelector("#ih-weiter"); if (erster && erster.focus) erster.focus({ preventScroll: true });
  }
  function schliesse() { if (el) { el.remove(); el = null; } }

  function pruefe() {
    const pl = plattform(navigator.userAgent, navigator.maxTouchPoints, navigator.platform);
    const erzwungen = new URLSearchParams(location.search).get("installHinweis") === "1";
    const zeigen = sollZeigen({ aus: elternAus(), alsApp: alsApp(), os: pl.os, uebersprungen: uebersprungen(), webdriver: navigator.webdriver === true, erzwungen: erzwungen && !uebersprungen() });
    if (zeigen) zeige(pl);
    return zeigen;
  }
  window.__installHinweis = { pruefe, plattform, schritteKey, sollZeigen, schliesse, get offen() { return !!el; }, KEY, STUNDEN };
  // kurz warten, bis die Seite gemalt hat (wie im Vorbild 700 ms)
  const los = () => setTimeout(pruefe, 700);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", los); else los();
})();
