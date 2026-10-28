#!/usr/bin/env node
// QR-Geschenk-Codes für die Lerninsel erzeugen (NA-16). Läuft NUR beim Auftraggeber; der private Schlüssel liegt NIE im Repo.
//
// 1) Einmalig ein Schlüsselpaar anlegen (Ordner AUSSERHALB des Repos, z. B. auf einem USB-Stick):
//      node quellen/geschenk-erzeugen.js schluessel ~/lerninsel-geheim
//    → schreibt ~/lerninsel-geheim/geschenk-privat.jwk und zeigt den öffentlichen Schlüssel.
//    Den öffentlichen Schlüssel (x, y) in shared/geschenk.js bei OEFFENTLICH eintragen (oder Claude geben) – der private bleibt geheim.
// 2) Codes erzeugen:
//      node quellen/geschenk-erzeugen.js code ~/lerninsel-geheim/geschenk-privat.jwk <id> <geschenk> ["Text auf dem Zettel"] [--svg datei.svg]
//    id: 2–32 Zeichen a–z, 0–9, - (z. B. weihnachten-2026); jeder Code gilt einmal je Kind.
//    geschenk: tannenbaum | schleife | moebel:<lampe|baer|sitzsack|kiste|korb|globus|regal|staffelei|tisch|aquarium> | zubehoer:<schleife|brille|halstuch|hut|krone> | sterne:<1–10>
//    → gibt den Code aus (zum Einfügen im Elternbereich) und schreibt mit --svg einen QR-Code zum Ausdrucken.
const fs = require("fs"), path = require("path"), vm = require("vm");
const { webcrypto } = require("crypto");
const subtle = webcrypto.subtle;
const REPO = path.resolve(__dirname, "..");
const b64url = (buf) => Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const GESCHENK = /^(tannenbaum|schleife|moebel:(lampe|baer|sitzsack|kiste|korb|globus|regal|staffelei|tisch|aquarium|tannenbaum)|zubehoer:(schleife|brille|halstuch|hut|krone)|sterne:([1-9]|10))$/;

async function schluessel(ordner) {
  if (!ordner) throw new Error("Bitte einen Ordner angeben (außerhalb des Repos).");
  const ziel = path.resolve(ordner.replace(/^~/, process.env.HOME || "~"));
  if (ziel === REPO || ziel.startsWith(REPO + path.sep)) throw new Error("Der private Schlüssel darf nicht im Repo liegen. Bitte einen Ordner außerhalb wählen.");
  fs.mkdirSync(ziel, { recursive: true });
  const datei = path.join(ziel, "geschenk-privat.jwk");
  if (fs.existsSync(datei)) throw new Error(`${datei} gibt es schon – nicht überschreiben (sonst gelten alte Codes nicht mehr).`);
  const paar = await subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
  const privat = await subtle.exportKey("jwk", paar.privateKey), oeffentlich = await subtle.exportKey("jwk", paar.publicKey);
  fs.writeFileSync(datei, JSON.stringify(privat), { mode: 0o600 });
  console.log(`Privater Schlüssel: ${datei} (geheim halten, sichern!)`);
  console.log("Öffentlicher Schlüssel für shared/geschenk.js (OEFFENTLICH):");
  console.log(JSON.stringify({ x: oeffentlich.x, y: oeffentlich.y }));
}

// Code bauen (auch für Tests): privates JWK + Daten → "LG1.<daten>.<signatur>"
async function baueCode(privatJwk, daten) {
  const k = await subtle.importKey("jwk", privatJwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  const teil = b64url(Buffer.from(JSON.stringify(daten), "utf8"));
  const sig = await subtle.sign({ name: "ECDSA", hash: "SHA-256" }, k, Buffer.from(teil, "utf8"));
  return `LG1.${teil}.${b64url(sig)}`;
}

function qrSvg(text) {
  const kontext = { qrcodegen: undefined };
  vm.runInNewContext(fs.readFileSync(path.join(REPO, "shared/vendor/qrcodegen.js"), "utf8") + "\nthis.qrcodegen = qrcodegen;", kontext);
  const qr = kontext.qrcodegen.QrCode.encodeText(text, kontext.qrcodegen.QrCode.Ecc.MEDIUM), n = qr.size, rand = 4;
  let pfad = "";
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (qr.getModule(x, y)) pfad += `M${x + rand},${y + rand}h1v1h-1z`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n + rand * 2} ${n + rand * 2}" width="${(n + rand * 2) * 8}"><rect width="100%" height="100%" fill="#fff"/><path d="${pfad}" fill="#000"/></svg>`;
}

async function code(args) {
  const [datei, id, geschenk, ...rest] = args;
  const i = rest.indexOf("--svg"), svg = i >= 0 ? rest[i + 1] : null, text = rest.filter((x, j) => j !== i && j !== i + 1 || i < 0)[0];
  if (!datei || !id || !geschenk) throw new Error("Aufruf: code <privat.jwk> <id> <geschenk> [\"Text\"] [--svg datei.svg]");
  if (!/^[a-z0-9-]{2,32}$/.test(id)) throw new Error("id: 2–32 Zeichen a–z, 0–9, -");
  if (!GESCHENK.test(geschenk)) throw new Error("Unbekanntes Geschenk. Erlaubt: tannenbaum, schleife, moebel:<id>, zubehoer:<id>, sterne:<1–10>");
  const daten = { i: id, g: geschenk }; if (text && text !== "--svg") daten.n = String(text).slice(0, 80);
  const c = await baueCode(JSON.parse(fs.readFileSync(datei.replace(/^~/, process.env.HOME || "~"), "utf8")), daten);
  console.log(c);
  if (svg) { fs.writeFileSync(svg, qrSvg(c)); console.log(`QR-Code: ${svg}`); }
}

if (require.main === module) {
  const [befehl, ...args] = process.argv.slice(2);
  (befehl === "schluessel" ? schluessel(args[0]) : befehl === "code" ? code(args) : Promise.reject(new Error("Befehl: schluessel <ordner> | code <privat.jwk> <id> <geschenk> [Text] [--svg datei]")))
    .catch(e => { console.error("Fehler: " + e.message); process.exit(1); });
}
module.exports = { baueCode, qrSvg, GESCHENK };
