// Baut die Pixel-Probe (PixiJS) nach spiele/probe/ (eine Datei mit eingebündelter Engine).
// Verglichen wurden am 27.10.2026 auch PixiJS 2D/isometrisch, Babylon.js und PlayCanvas; der Auftraggeber hat auf
// „rund wie heute (three.js)“ oder „Pixel“ eingegrenzt, die anderen Proben wurden deshalb wieder entfernt.
// Die Engines liegen NICHT im Repo; sie werden als Quellcode von GitHub geholt (npm ist in der Arbeitsumgebung gesperrt):
//   ENGINES=<ordner> node quellen/probe/bauen.js
//   <ordner>/pixi  = github.com/pixijs/pixijs     (Tag v8.22.0, Ordner src)
//   <ordner>/dep/  = Abhängigkeiten von Pixi: eventemitter3, earcut, isMobile, xmldom, colord (pixijs), tiny-lru, parse-svg-path
// Mit npm geht es einfacher: npm i pixi.js und ENGINES weglassen (dann gilt der Paketname).
const path = require("path");
const fs = require("fs");
let esbuild; try { esbuild = require("esbuild"); } catch (e) { esbuild = require("/opt/npm-tools/node_modules/esbuild"); }
const WURZEL = path.resolve(__dirname, "../..");
const E = process.env.ENGINES ? path.resolve(process.env.ENGINES) : null;
const ALIAS = E ? {
  "pixi.js": `${E}/pixi/src/index.ts`,
  "eventemitter3": `${E}/dep/eventemitter3/index.mjs`, "earcut": `${E}/dep/earcut/src/earcut.js`, "ismobilejs": `${E}/dep/isMobile/src/index.ts`,
  "@xmldom/xmldom": `${E}/dep/xmldom/lib/index.js`, "@pixi/colord": `${E}/dep/colord/src/index.ts`, "@pixi/colord/plugins/names": `${E}/dep/colord/src/plugins/names.ts`,
  "tiny-lru": `${E}/dep/tiny-lru/dist/tiny-lru.js`, "parse-svg-path": `${E}/dep/parse-svg-path/src/index.ts`
} : {};
const LOADER = { ".wgsl": "text", ".frag": "text", ".vert": "text", ".glsl": "text" };
// Pixi lädt einige Worker über "worker:…" – hier werden sie eingebettet
const worker = {
  name: "worker",
  setup(b) {
    b.onResolve({ filter: /^worker:/ }, a => ({ path: path.resolve(a.resolveDir, a.path.slice(7)), namespace: "worker" }));
    b.onLoad({ filter: /.*/, namespace: "worker" }, async a => {
      const r = await esbuild.build({ entryPoints: [a.path], bundle: true, write: false, format: "iife", minify: true, loader: LOADER, alias: ALIAS });
      return { loader: "js", contents: `const src = ${JSON.stringify(r.outputFiles[0].text)}; let url = null;
export default class W { constructor() { url = url || URL.createObjectURL(new Blob([src], { type: "text/javascript" })); this.worker = new Worker(url); } static revokeObjectURL() { if (url) { URL.revokeObjectURL(url); url = null; } } }` };
    });
  }
};
const nur = process.argv[2];
(async () => {
  for (const name of ["pixel"]) {
    if (nur && nur !== name) continue;
    const ein = path.join(__dirname, name + (fs.existsSync(path.join(__dirname, name + ".ts")) ? ".ts" : ".js"));
    const r = await esbuild.build({
      entryPoints: [ein], bundle: true, format: "esm", minify: true, target: "es2022", outfile: path.join(WURZEL, "spiele/probe", name + ".js"),
      loader: LOADER, alias: ALIAS, plugins: [worker], legalComments: "none", metafile: true, ignoreAnnotations: !!E, logLevel: "warning"   // ignoreAnnotations: Pixis „sideEffects“-Liste passt nur zum npm-Paket, nicht zum Quellcode
    });
    const groesse = Object.values(r.metafile.outputs)[0].bytes;
    console.log(`${name}.js  ${(groesse / 1048576).toFixed(2)} MB`);
  }
})().catch(() => process.exit(1));
