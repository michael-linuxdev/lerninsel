// Prüfbogen der Emoji-Bilder: node quellen/noto-pruefbogen.js <ordner> [64|24] [orig]
// 64 orig = gebautes Bild links, Noto-Original rechts; Seiten als PNG <ordner>/bogen-<größe>-<n>.png (braucht Playwright).
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const R = path.resolve(__dirname, '..'), S = process.argv[2], gr = +process.argv[3] || 64, orig = process.argv[4] === 'orig';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 900, height: 800 } });
  const icons = fs.readFileSync(R + '/shared/icons.js', 'utf8');
  const quellen = {}; for (const f of fs.readdirSync(R + '/quellen/noto')) quellen[f.replace('.svg', '')] = fs.readFileSync(R + '/quellen/noto/' + f, 'utf8');
  await p.setContent(`<html><body style="margin:0;background:#FFF8E7;font:10px sans-serif"><div id=g style="display:flex;flex-wrap:wrap;gap:4px;padding:6px"></div></body></html>`);
  await p.addScriptTag({ content: icons });
  await p.evaluate(({ gr, orig, quellen }) => {
    const g = document.getElementById('g');
    Object.keys(window.LERN_ICONS).forEach((h, i) => {
      const d = document.createElement('div'); d.style.cssText = `width:${gr * (orig ? 2 : 1) + 8}px;text-align:center`;
      const svg = window.LERN_ICONS[h].split('n' + h.replace(/-/g, '') + '-').join('x' + i + '-');
      d.innerHTML = `<div style="display:flex"><div style="width:${gr}px;height:${gr}px">${svg.replace('<svg ', `<svg width="${gr}" height="${gr}" `)}</div>` +
        (orig ? `<div style="width:${gr}px;height:${gr}px">${quellen[h].replace(/id="/g, 'id="o' + i).replace(/#([\w-]+)\)/g, '#o' + i + '$1)').replace(/href="#/g, 'href="#o' + i).replace('<svg ', `<svg width="${gr}" height="${gr}" `)}</div>` : '') +
        `</div>${gr >= 48 ? i + ' ' + h : ''}`;
      g.appendChild(d);
    });
  }, { gr, orig, quellen });
  const h = await p.evaluate(() => document.body.scrollHeight);
  const seite = 900; let n = 0;
  for (let y = 0; y < h; y += seite, n++) await p.screenshot({ path: `${S}/bogen-${gr}${orig ? 'o' : ''}-${n}.png`, clip: { x: 0, y, width: 900, height: Math.min(seite, h - y) }, fullPage: true });
  console.log(n, 'Bilder');
  await b.close();
})();
