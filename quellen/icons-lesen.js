// Emoji-Bilder in Node lesen (seit 07.11.2026 in Häppchen shared/icons/<teil>.js in Kurzform, siehe quellen/noto-stil-a.py):
// require("./icons-lesen.js")(wurzel) → { liste: [hex], teile: [name], wo: { hex: teil }, kurz: { hex: Kurzform }, svg: { hex: vollständiges SVG } }
// Genutzt von quellen/noto-pruefbogen.js und tests/icons.js.
const fs = require("fs"), path = require("path"), vm = require("vm");
module.exports = function lies(wurzel) {
  const w = { document: {} }; w.window = w; vm.createContext(w);
  vm.runInContext(fs.readFileSync(path.join(wurzel, "shared/icons-liste.js"), "utf8"), w, { filename: "icons-liste.js" });
  const liste = w.LERN_ICON_LISTE.split(","), teile = [...w.LERN_ICON_TEILE], wo = {};
  liste.forEach((h, i) => { wo[h] = teile[parseInt(w.LERN_ICON_WO[i], 36)]; });
  const inTeil = {};
  for (const t of teile) {
    const f = path.join(wurzel, "shared/icons", t + ".js");
    if (!fs.existsSync(f)) continue;
    const vorher = new Set(Object.keys(w.LERN_ICONS_KURZ));
    vm.runInContext(fs.readFileSync(f, "utf8"), w, { filename: t + ".js" });
    for (const h of Object.keys(w.LERN_ICONS_KURZ)) if (!vorher.has(h)) inTeil[h] = t;
  }
  const kurz = { ...w.LERN_ICONS_KURZ }, svg = {};
  for (const h of liste) if (kurz[h]) svg[h] = w.LernIconAuf(h, kurz[h]);
  return { liste, teile, wo, inTeil, kurz, svg, auf: (h, k) => w.LernIconAuf(h, k) };
};
