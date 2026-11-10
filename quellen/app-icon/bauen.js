// Baut das App-Icon aus quellen/app-icon/icon-inhalt.svg:
//   icons/icon.svg      – Favicon mit runden Ecken (Browser-Reiter)
//   icons/icon-180.png  – iPad/iPhone Home-Bildschirm (vollflächig, ohne Transparenz – iOS rundet selbst)
//   icons/icon-192.png, icons/icon-512.png – Manifest (auch „maskable“: Wichtiges liegt im mittleren 80-%-Kreis)
// Aufruf: node quellen/app-icon/bauen.js [ordner-fuer-vorschau]   (braucht Playwright + Chromium wie die Tests)
const fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const WURZEL = path.join(__dirname, "..", ".."), roh = fs.readFileSync(path.join(__dirname, "icon-inhalt.svg"), "utf8");
const innen = roh.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").replace(/<!--[\s\S]*?-->/g, "").trim();
const rund = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">\n  <clipPath id="r"><rect width="512" height="512" rx="112"/></clipPath>\n  <g clip-path="url(#r)">\n  ${innen}\n  </g>\n  <rect x="6" y="6" width="500" height="500" rx="106" fill="none" stroke="#3B1F63" stroke-width="12"/>\n</svg>\n`;
(async () => {
  fs.writeFileSync(path.join(WURZEL, "icons", "icon.svg"), rund);
  const browser = await chromium.launch();
  for (const g of [180, 192, 512]) {
    const p = await (await browser.newContext({ viewport: { width: g, height: g }, deviceScaleFactor: 1 })).newPage();
    await p.setContent(`<style>html,body{margin:0}svg{display:block;width:${g}px;height:${g}px}</style>${roh}`);
    await p.screenshot({ path: path.join(WURZEL, "icons", `icon-${g}.png`), omitBackground: false });
    await p.close();
  }
  const vor = process.argv[2];
  if (vor) {   // Vorschau: groß, klein (60 px), mit iOS-Rundung und als Kreis (Android)
    const p = await (await browser.newContext({ viewport: { width: 900, height: 420 }, deviceScaleFactor: 2 })).newPage();
    const uri = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(roh);
    await p.setContent(`<body style="margin:0;background:#2b2b3a;display:flex;gap:28px;align-items:center;padding:30px;font:14px sans-serif;color:#fff">
      <img src="${uri}" style="width:300px;height:300px;border-radius:67px"><img src="${uri}" style="width:180px;height:180px;border-radius:50%">
      <img src="${uri}" style="width:76px;height:76px;border-radius:17px"><img src="${uri}" style="width:40px;height:40px;border-radius:9px"><img src="${uri}" style="width:20px;height:20px;border-radius:4px"></body>`);
    await p.waitForTimeout(200); await p.screenshot({ path: path.join(vor, "app-icon-vorschau.png") });
  }
  await browser.close();
  console.log("✅ App-Icon gebaut: icons/icon.svg, icon-180.png, icon-192.png, icon-512.png");
})();
