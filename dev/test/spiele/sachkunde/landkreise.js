// Landkreise und kreisfreie Städte in Sachsen (30.10.2026, Sachunterricht Kl. 3: „Den eigenen Landkreis kennen“).
// window.LANDKREISE: Daten je Kreis; daraus entstehen window.LANDKREIS_THEMEN (ein Thema je Kreis, nur sichtbar für den Kreis, den die Eltern unter
// eltern.sachkunde.landkreis gewählt haben) und das Quiz „Sachsens Landkreise“ für alle Kinder aus Sachsen ab Kl. 2 (stufe 3).
// Russische Texte: Entwürfe aus Vorlagen (Ortsnamen bleiben lateinisch).
(function () {
  const L = [
    { id: "bautzen", name: "Landkreis Bautzen", art: "Landkreis", stadt: "Bautzen", kz: "BZ", fluss: "Spree", lage: "im Osten Sachsens, in der Oberlausitz",
      besonders: ["Die Altstadt von Bautzen mit Türmen und der Alten Wasserkunst", "Hier leben viele Sorben – Ortsschilder sind deutsch und sorbisch", "Bautzener Senf ist in ganz Deutschland bekannt"],
      brauch: "Zu Ostern reiten die sorbischen Osterreiter, und am 25. Januar feiern die Kinder Vogelhochzeit.", sage: "Die Sage vom Zauberlehrling Krabat und der Schwarzen Mühle spielt hier.", e: "🏰" },
    { id: "goerlitz", name: "Landkreis Görlitz", art: "Landkreis", stadt: "Görlitz", kz: "GR", fluss: "Neiße", lage: "ganz im Osten, an der Grenze zu Polen und Tschechien",
      besonders: ["Görlitz hat eine der schönsten Altstädte Deutschlands und wird oft für Filme genutzt", "Das Zittauer Gebirge ist das kleinste Gebirge Deutschlands", "In der Oberlausitz stehen viele Umgebindehäuser"],
      brauch: "In den Dörfern feiert man Osterbräuche und schmückt Brunnen.", sage: "Um die Burg- und Klosterruine auf dem Berg Oybin ranken sich viele Sagen von Rittern und Mönchen.", e: "🌉" },
    { id: "saechsische-schweiz", name: "Landkreis Sächsische Schweiz-Osterzgebirge", art: "Landkreis", stadt: "Pirna", kz: "PIR", fluss: "Elbe", lage: "südlich von Dresden bis zur Grenze nach Tschechien",
      besonders: ["Das Elbsandsteingebirge mit der Bastei und dem Nationalpark Sächsische Schweiz", "Die Festung Königstein hoch über der Elbe", "In Glashütte werden berühmte Uhren gebaut"],
      brauch: "Viele Menschen klettern und wandern hier; im Osterzgebirge gibt es Bergbau-Traditionen.", sage: "Man erzählt Sagen von Riesen und Zwergen in den Felsen.", e: "⛰️" },
    { id: "meissen", name: "Landkreis Meißen", art: "Landkreis", stadt: "Meißen", kz: "MEI", fluss: "Elbe", lage: "nordwestlich von Dresden",
      besonders: ["Meißener Porzellan mit den gekreuzten Schwertern", "Die Albrechtsburg und der Dom über der Elbe", "Schloss Moritzburg im Teich und Weinberge an der Elbe"],
      brauch: "Im Herbst feiert man Weinfeste.", sage: "Der Alchemist Böttger sollte eigentlich Gold machen – stattdessen erfand er mit anderen das erste europäische Porzellan.", e: "🏺" },
    { id: "mittelsachsen", name: "Landkreis Mittelsachsen", art: "Landkreis", stadt: "Freiberg", kz: "FG", fluss: "Freiberger Mulde", lage: "in der Mitte Sachsens zwischen Dresden, Leipzig und Chemnitz",
      besonders: ["Freiberg wurde durch den Silberbergbau reich", "Im Dom steht eine berühmte Silbermann-Orgel", "Die Bergakademie Freiberg ist eine sehr alte Bergbau-Hochschule"],
      brauch: "Bei Bergparaden ziehen Bergleute in festlicher Tracht durch die Stadt.", sage: "Sagen erzählen von Silberadern und Berggeistern.", e: "⛏️" },
    { id: "erzgebirge", name: "Erzgebirgskreis", art: "Landkreis", stadt: "Annaberg-Buchholz", kz: "ERZ", fluss: "Zschopau", lage: "im Süden an der Grenze zu Tschechien",
      besonders: ["Der Fichtelberg ist mit 1215 Metern der höchste Berg Sachsens", "Holzkunst: Räuchermännchen, Nussknacker, Schwibbögen und Pyramiden", "Früher wurde hier viel Erz abgebaut – daher der Name Erzgebirge"],
      brauch: "In der Weihnachtszeit leuchten Schwibbögen in den Fenstern, und Bergparaden ziehen durch die Städte.", sage: "Der Berggeist hilft fleißigen Bergleuten und ärgert die faulen.", e: "🕯️" },
    { id: "zwickau", name: "Landkreis Zwickau", art: "Landkreis", stadt: "Zwickau", kz: "Z", fluss: "Zwickauer Mulde", lage: "im Westen Sachsens",
      besonders: ["Zwickau ist eine Autostadt: Hier wurden Horch, Audi und der Trabant gebaut, heute Elektroautos", "Der Komponist Robert Schumann wurde in Zwickau geboren", "Früher gab es hier Steinkohlebergbau"],
      brauch: "Man pflegt Bergbau- und Musiktraditionen.", sage: "Man erzählt Geschichten von alten Bergwerken unter der Stadt.", e: "🚗" },
    { id: "vogtland", name: "Vogtlandkreis", art: "Landkreis", stadt: "Plauen", kz: "V", fluss: "Weiße Elster", lage: "ganz im Südwesten, an Bayern, Thüringen und Tschechien",
      besonders: ["Plauener Spitze ist auf der ganzen Welt bekannt", "Im Musikwinkel um Markneukirchen werden Musikinstrumente gebaut", "Die Göltzschtalbrücke ist die größte Ziegelsteinbrücke der Welt"],
      brauch: "Im Vogtland gibt es viele Heimat- und Spitzenfeste.", sage: "Sagen erzählen von Rittern auf alten Burgen.", e: "🎻" },
    { id: "leipzig-land", name: "Landkreis Leipzig", art: "Landkreis", stadt: "Borna", kz: "L", fluss: "Pleiße", lage: "rund um die Stadt Leipzig im Süden und Osten",
      besonders: ["Aus alten Braunkohle-Tagebauen ist das Leipziger Neuseenland entstanden", "Grimma liegt schön an der Mulde", "Hoch über der Mulde steht das Schloss Colditz"],
      brauch: "An den neuen Seen feiert man Badefeste.", sage: "Man erzählt von Dörfern, die dem Tagebau weichen mussten.", e: "🏊" },
    { id: "nordsachsen", name: "Landkreis Nordsachsen", art: "Landkreis", stadt: "Torgau", kz: "TDO", fluss: "Elbe", lage: "im Norden an Sachsen-Anhalt und Brandenburg",
      besonders: ["Schloss Hartenfels in Torgau mit seiner berühmten Wendeltreppe", "In Torgau trafen sich 1945 amerikanische und sowjetische Soldaten an der Elbe", "Die Dübener Heide ist ein großes Waldgebiet"],
      brauch: "In Torgau leben Bären im Schlossgraben – ein alter Brauch.", sage: "Man erzählt von Martin Luthers Frau Katharina, die in Torgau starb.", e: "🐻" },
    { id: "dresden", name: "Dresden", art: "kreisfreie Stadt", stadt: "Dresden", kz: "DD", fluss: "Elbe", lage: "an der Elbe – Dresden ist die Landeshauptstadt",
      besonders: ["Die Frauenkirche wurde nach dem Krieg wieder aufgebaut", "Der Zwinger und die Semperoper", "Hier arbeiten der Landtag und die Landesregierung"],
      brauch: "Der Striezelmarkt ist einer der ältesten Weihnachtsmärkte Deutschlands.", sage: "Man erzählt viele Geschichten über König August den Starken – sein Denkmal heißt Goldener Reiter.", e: "⛪" },
    { id: "leipzig", name: "Leipzig", art: "kreisfreie Stadt", stadt: "Leipzig", kz: "L", fluss: "Weiße Elster", lage: "im Nordwesten Sachsens – Leipzig ist die größte Stadt Sachsens",
      besonders: ["Das Völkerschlachtdenkmal", "Johann Sebastian Bach und der Thomanerchor", "1989 gingen hier viele Menschen friedlich für die Freiheit auf die Straße"],
      brauch: "Die Leipziger Messe gibt es schon seit über 800 Jahren.", sage: "In Auerbachs Keller soll der Zauberer Faust auf einem Fass geritten sein.", e: "🎶" },
    { id: "chemnitz", name: "Chemnitz", art: "kreisfreie Stadt", stadt: "Chemnitz", kz: "C", fluss: "Chemnitz", lage: "im Westen am Rand des Erzgebirges",
      besonders: ["Chemnitz war eine große Industriestadt mit Maschinenbau", "Der große Kopf von Karl Marx heißt in Chemnitz „Nischel“", "2025 war Chemnitz Kulturhauptstadt Europas"],
      brauch: "Auf dem Weihnachtsmarkt steht eine große Bergmannsfigur.", sage: "Man erzählt Geschichten aus der Zeit der Fabriken.", e: "🏭" }
  ];
  window.LANDKREISE = L;
  const andere = (feld, x, n = 2) => L.filter(y => y[feld] !== x[feld]).map(y => y[feld]).filter((v, i, a) => a.indexOf(v) === i).sort(() => Math.random() - 0.5).slice(0, n);
  const T = L.map((k, i) => ({
    id: "lk-" + k.id, lb: "rz", stufe: 3, land: "sn", landkreis: k.id, lz: ["su.ge.04", "su.so.05"], name: k.art === "Landkreis" ? `Unser Kreis: ${k.name}` : `Unsere Stadt: ${k.name}`,
    e: k.e, farbe: "#7B55B8", grund: "#EFE6FF", kurz: `${k.stadt}, ${k.fluss}, ${k.besonders[0]}`,
    schritte: [
      { typ: "info", titel: k.name, bild: k.e, text: `Du wohnst ${k.art === "Landkreis" ? "im " + k.name : "in der kreisfreien Stadt " + k.name}. Er liegt ${k.lage}.`.replace("Er liegt", k.art === "Landkreis" ? "Er liegt" : "Sie liegt"),
        ru: `Ты живёшь: ${k.name} (${k.art === "Landkreis" ? "район" : "город"}).`, fakten: [`Kreisstadt: ${k.stadt}`, `Fluss: ${k.fluss}`, `Autokennzeichen: ${k.kz}`] },
      { typ: "wahl", frage: k.art === "Landkreis" ? `Wie heißt die Kreisstadt des ${k.name.replace("Landkreis ", "Landkreises ")}?` : `Durch welchen Fluss fließt ${k.name}?`, ru: k.art === "Landkreis" ? "Как называется районный центр?" : "Какая река течёт через город?", bild: "🏛️",
        optionen: (k.art === "Landkreis" ? [k.stadt].concat(andere("stadt", k)) : [k.fluss].concat(andere("fluss", k))).map((t, j) => ({ t, ok: j === 0, warum: j === 0 ? "Richtig!" : `Nein – ${k.art === "Landkreis" ? "die Kreisstadt ist " + k.stadt : "der Fluss heißt " + k.fluss}.`, warumRu: j === 0 ? "Правильно!" : "Нет." })) },
      { typ: "wahl", frage: "Welches Autokennzeichen gehört hierher?", ru: "Какой автомобильный номер отсюда?", bild: "🚗",
        optionen: [k.kz].concat(andere("kz", k)).map((t, j) => ({ t, ok: j === 0, warum: j === 0 ? `Genau: ${k.kz}. Achte mal auf die Autos in deiner Straße!` : `Nein – hier steht ${k.kz} auf den Nummernschildern.`, warumRu: j === 0 ? "Точно!" : "Нет." })) },
      { typ: "info", titel: "Das ist besonders", bild: "⭐", text: k.besonders.join(". ") + ".", ru: "Вот что здесь особенного.", fakten: k.besonders },
      { typ: "daumen", satz: k.besonders[0] + ".", satzRu: "Это правда?", ok: true, warum: "Stimmt!", warumRu: "Верно!" },
      { typ: "daumen", satz: `${k.name} liegt am Meer.`, satzRu: "Это место у моря?", ok: false, warum: "Nein, Sachsen liegt nicht am Meer. Hier gibt es Flüsse, Seen und Berge.", warumRu: "Нет, у Саксонии нет моря." },
      { typ: "info", titel: "Bräuche und Sagen", bild: "📜", text: `${k.brauch} ${k.sage} Frag deine Familie, welche Geschichten sie kennt!`, ru: "Обычаи и легенды. Спроси у семьи, какие истории они знают!" }
    ]
  }));
  // Quiz für alle Kinder aus Sachsen: die 13 Kreise auf einen Blick
  T.push({ id: "lk-sachsen", lb: "rz", stufe: 3, land: "sn", lz: ["su.ge.04"], name: "Sachsens Landkreise und Städte", e: "🗺️", farbe: "#7B55B8", grund: "#EFE6FF",
    kurz: "10 Landkreise, 3 kreisfreie Städte, Kreisstädte und Kennzeichen",
    schritte: [
      { typ: "info", titel: "13 Kreise", bild: "🗺️", text: "Sachsen hat 10 Landkreise und 3 kreisfreie Städte: Dresden, Leipzig und Chemnitz. Wer weiß, wo was liegt?", ru: "В Саксонии 10 районов и 3 самостоятельных города.",
        fakten: L.filter(k => k.art === "Landkreis").map(k => `${k.name.replace("Landkreis ", "")}: ${k.stadt} (${k.kz})`) },
      ...[["erzgebirge", "Wo steht der Fichtelberg, der höchste Berg Sachsens?"], ["vogtland", "Wo werden Plauener Spitze und viele Musikinstrumente gemacht?"], ["meissen", "Woher kommt das berühmte Porzellan mit den Schwertern?"],
        ["bautzen", "Wo sind die Ortsschilder deutsch und sorbisch?"], ["zwickau", "Wo wurden Trabant und Audi gebaut?"], ["saechsische-schweiz", "Wo stehen die Bastei und die Festung Königstein?"]].map(([id, frage]) => {
        const k = L.find(x => x.id === id), falsch = L.filter(x => x.id !== id && x.art === "Landkreis").sort(() => Math.random() - 0.5).slice(0, 2);
        return { typ: "wahl", frage, ru: "Где это?", bild: k.e, optionen: [k].concat(falsch).map((x, j) => ({ t: x.name, ok: j === 0, warum: j === 0 ? `Richtig! ${k.besonders.find(b => b) || ""}` : `Nein – das ist im ${k.name}.`, warumRu: j === 0 ? "Правильно!" : "Нет." })) }; }),
      { typ: "info", titel: "Und dein Kreis?", bild: "🏡", text: "Deine Eltern können im Elternbereich deinen Landkreis einstellen. Dann zeige ich dir ein Thema nur über deinen Kreis!", ru: "Родители могут выбрать твой район в разделе для родителей." }
    ] });
  window.LANDKREIS_THEMEN = T;
})();
