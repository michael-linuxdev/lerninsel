// Prüfbogen eines Teils als Bild: node quellen/icons-bogen-bild.js <teil> <ausgabe.png>
// (baut vorher den Bogen; braucht Playwright – ggf. NODE_PATH=$(npm root -g))
const { execFileSync } = require("child_process"), path = require("path");
const [teil, aus] = process.argv.slice(2);
if (!teil || !aus) { console.log("Aufruf: node quellen/icons-bogen-bild.js <teil> <ausgabe.png>"); process.exit(1); }
execFileSync("node", [path.join(__dirname, "icons-bauen.js"), "--teil", teil], { stdio: "inherit" });
const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1100, height: 800 } });
  await p.goto("file://" + path.join(__dirname, "icons", `bogen-${teil}.html`));
  await p.screenshot({ path: aus, fullPage: true }); await b.close(); console.log("Bild: " + aus);
})();
