// Eigene Welt: Die Erzeugung aus Wünschen + seed liegt seit NA-24 im Insel-Kern (shared/insel-kern.js, window.InselKern),
// damit beide Looks („Rund“ und „Pixel“) dieselbe Welt bekommen. Diese Datei reicht sie nur an die 3D-Seiten weiter.
// Die Seite muss shared/insel-kern.js vor dem 3D-Bündel laden.
const K = window.InselKern;
export const { BIOME, GROESSEN, HUEGEL, STANDARD, FARBEN, erzeuge, neuerSeed } = K;
