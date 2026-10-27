// Inhalt NA-31: erste Lesetexte (Kl. 1–2) mit Bild und Verständnisfragen – Format nach docs/LEHRPLAN.md „Inhalte als Daten“.
// text: Sprechsilben mit „-“ getrennt (für Silbenbögen und Silbenfarben); angezeigt und vorgelesen ohne Trennstriche.
// fragen: erste Option ist richtig (wird beim Spielen gemischt), e = Bild, damit man die Antwort auch ohne Lesen der Option findet.
// lz: Lesen (de.le.04 Kl. 1, de.le.05 Kl. 2) plus das Sachthema, mit dem der Text verknüpft ist. Texte sind eigene, frei erfundene Texte.
// Kein Bezug zu echten Kindern: Namen sind ausgedacht (Mia, Tom, Lea, Ben) oder Figuren der Insel.
(function () {
  const T = [
    // ---------- Klasse 1: zwei bis drei kurze Sätze ----------
    { id: "lt.01", stufe: "1", titel: "Fipsi", bild: "🦊", lz: ["de.le.04"],
      text: "Fip-si ist ein Fuchs. Fip-si ist rot. Er hat ei-nen lan-gen Schwanz.",
      fragen: [{ frage: "Wer ist Fipsi?", optionen: [{ t: "ein Fuchs", e: "🦊" }, { t: "ein Hund", e: "🐶" }, { t: "ein Bär", e: "🐻" }] },
        { frage: "Welche Farbe hat Fipsi?", optionen: [{ t: "rot", e: "🔴" }, { t: "blau", e: "🔵" }, { t: "grün", e: "🟢" }] }] },
    { id: "lt.02", stufe: "1", titel: "Im Park", bild: "⚽", lz: ["de.le.04", "su.na.04"],
      text: "Die Son-ne scheint. Mi-a geht in den Park. Sie hat ei-nen Ball.",
      fragen: [{ frage: "Was hat Mia?", optionen: [{ t: "einen Ball", e: "⚽" }, { t: "ein Buch", e: "📖" }, { t: "einen Hut", e: "🎩" }] },
        { frage: "Wie ist das Wetter?", optionen: [{ t: "Die Sonne scheint.", e: "☀️" }, { t: "Es regnet.", e: "🌧️" }, { t: "Es schneit.", e: "❄️" }] }] },
    { id: "lt.03", stufe: "1", titel: "Benno baut", bild: "🦫", lz: ["de.le.04", "su.te.02"],
      text: "Ben-no ist ein Bi-ber. Er baut ei-nen Damm. Er zählt die Stäm-me.",
      fragen: [{ frage: "Was baut Benno?", optionen: [{ t: "einen Damm", e: "🪵" }, { t: "ein Haus", e: "🏠" }, { t: "ein Auto", e: "🚗" }] },
        { frage: "Wer ist Benno?", optionen: [{ t: "ein Biber", e: "🦫" }, { t: "ein Fuchs", e: "🦊" }, { t: "eine Eule", e: "🦉" }] }] },
    { id: "lt.04", stufe: "1", titel: "Regen", bild: "☂️", lz: ["de.le.04", "su.na.04"],
      text: "Es reg-net. Le-a nimmt den Schirm. Sie springt in die Pfüt-ze.",
      fragen: [{ frage: "Was nimmt Lea?", optionen: [{ t: "den Schirm", e: "☂️" }, { t: "den Ball", e: "⚽" }, { t: "ein Eis", e: "🍦" }] },
        { frage: "Wohin springt Lea?", optionen: [{ t: "in die Pfütze", e: "💦" }, { t: "ins Bett", e: "🛏️" }, { t: "auf den Baum", e: "🌳" }] }] },
    { id: "lt.05", stufe: "1", titel: "Das Nest", bild: "🪺", lz: ["de.le.04", "su.na.03"],
      text: "Im Nest sind drei Ei-er. Die Vo-gel-ma-ma sitzt auf dem Nest. Bald schlüp-fen die Kü-ken.",
      fragen: [{ frage: "Wie viele Eier sind im Nest?", optionen: [{ t: "drei", e: "3️⃣" }, { t: "zwei", e: "2️⃣" }, { t: "fünf", e: "5️⃣" }] },
        { frage: "Wer sitzt auf dem Nest?", optionen: [{ t: "die Vogelmama", e: "🐦" }, { t: "die Katze", e: "🐱" }, { t: "der Hund", e: "🐶" }] }] },
    { id: "lt.06", stufe: "1", titel: "Hunger", bild: "🍎", lz: ["de.le.04", "su.na.02"],
      text: "Tom hat Hun-ger. Er isst ei-nen Ap-fel. Der Ap-fel ist rot und süß.",
      fragen: [{ frage: "Was isst Tom?", optionen: [{ t: "einen Apfel", e: "🍎" }, { t: "ein Brot", e: "🍞" }, { t: "ein Eis", e: "🍦" }] },
        { frage: "Wie schmeckt der Apfel?", optionen: [{ t: "süß", e: "😋" }, { t: "sauer", e: "🍋" }, { t: "salzig", e: "🧂" }] }] },
    { id: "lt.07", stufe: "1", titel: "Zähne putzen", bild: "🪥", lz: ["de.le.04", "su.na.02"],
      text: "Ich put-ze mir die Zäh-ne. Mor-gens und a-bends. So blei-ben die Zäh-ne ge-sund.",
      fragen: [{ frage: "Wann putzt das Kind die Zähne?", optionen: [{ t: "morgens und abends", e: "🌅🌙" }, { t: "nur mittags", e: "🕛" }, { t: "nie", e: "🚫" }] }] },
    { id: "lt.08", stufe: "1", titel: "Katze und Maus", bild: "🐱", lz: ["de.le.04"],
      text: "Die Kat-ze schläft auf dem So-fa. Die Maus läuft schnell weg. Die Kat-ze merkt nichts.",
      fragen: [{ frage: "Wo schläft die Katze?", optionen: [{ t: "auf dem Sofa", e: "🛋️" }, { t: "im Bett", e: "🛏️" }, { t: "auf dem Baum", e: "🌳" }] },
        { frage: "Wer läuft weg?", optionen: [{ t: "die Maus", e: "🐭" }, { t: "der Hund", e: "🐶" }, { t: "die Katze", e: "🐱" }] }] },
    { id: "lt.09", stufe: "1", titel: "Paula singt", bild: "🎤", lz: ["de.le.04", "mu.ma.02"],
      text: "Pau-la singt ein Lied. Al-le Tie-re hö-ren zu. Der Bär klatscht.",
      fragen: [{ frage: "Was macht Paula?", optionen: [{ t: "Sie singt.", e: "🎤" }, { t: "Sie schläft.", e: "😴" }, { t: "Sie malt.", e: "🎨" }] },
        { frage: "Wer klatscht?", optionen: [{ t: "der Bär", e: "🐻" }, { t: "der Fuchs", e: "🦊" }, { t: "der Fisch", e: "🐟" }] }] },
    { id: "lt.10", stufe: "1", titel: "Winter", bild: "☃️", lz: ["de.le.04", "su.na.03"],
      text: "Heu-te ist Win-ter. Es schneit. Mi-a baut ei-nen Schnee-mann.",
      fragen: [{ frage: "Was baut Mia?", optionen: [{ t: "einen Schneemann", e: "☃️" }, { t: "eine Sandburg", e: "🏖️" }, { t: "einen Turm", e: "🗼" }] },
        { frage: "Welche Jahreszeit ist es?", optionen: [{ t: "Winter", e: "❄️" }, { t: "Sommer", e: "☀️" }, { t: "Herbst", e: "🍂" }] }] },

    // ---------- Klasse 2: drei bis fünf Sätze, oft mit Sachwissen ----------
    { id: "lt.11", stufe: "2", titel: "Der Igel im Herbst", bild: "🦔", lz: ["de.le.05", "su.na.03"],
      text: "Im Herbst wer-den die Blät-ter bunt. Sie fal-len vom Baum. Der I-gel sucht sich ein war-mes Ver-steck aus Laub. Dort schläft er bis zum Früh-ling.",
      fragen: [{ frage: "Was macht der Igel im Winter?", optionen: [{ t: "Er schläft.", e: "😴" }, { t: "Er schwimmt.", e: "🏊" }, { t: "Er singt.", e: "🎤" }] },
        { frage: "Woraus ist sein Versteck?", optionen: [{ t: "aus Laub", e: "🍂" }, { t: "aus Steinen", e: "🪨" }, { t: "aus Schnee", e: "❄️" }] }] },
    { id: "lt.12", stufe: "2", titel: "Die Schwalbe", bild: "🐦", lz: ["de.le.05", "su.na.03"],
      text: "Die Schwal-be ist ein Zug-vo-gel. Im Herbst fliegt sie in den Sü-den. Dort ist es warm. Im Früh-ling kommt sie zu-rück.",
      fragen: [{ frage: "Wohin fliegt die Schwalbe im Herbst?", optionen: [{ t: "in den Süden", e: "☀️" }, { t: "in den Norden", e: "🧊" }, { t: "in den Wald", e: "🌲" }] },
        { frage: "Wann kommt sie zurück?", optionen: [{ t: "im Frühling", e: "🌷" }, { t: "im Winter", e: "❄️" }, { t: "nie", e: "🚫" }] }] },
    { id: "lt.13", stufe: "2", titel: "Die Tanne", bild: "🌲", lz: ["de.le.05", "su.na.03"],
      text: "Die Tan-ne ist ein Na-del-baum. Sie hat Na-deln statt Blät-ter. Auch im Win-ter bleibt sie grün.",
      fragen: [{ frage: "Was hat die Tanne?", optionen: [{ t: "Nadeln", e: "🌲" }, { t: "große Blätter", e: "🍁" }, { t: "Blüten", e: "🌸" }] },
        { frage: "Wie sieht die Tanne im Winter aus?", optionen: [{ t: "grün", e: "🟢" }, { t: "bunt", e: "🍂" }, { t: "ganz kahl", e: "🪵" }] }] },
    { id: "lt.14", stufe: "2", titel: "Viel trinken", bild: "💧", lz: ["de.le.05", "su.na.02"],
      text: "Was-ser ist wich-tig. Kin-der sol-len je-den Tag viel trin-ken. Am bes-ten Was-ser o-der Tee. Saft hat viel Zu-cker.",
      fragen: [{ frage: "Was trinkt man am besten?", optionen: [{ t: "Wasser oder Tee", e: "💧" }, { t: "Limo", e: "🥤" }, { t: "nur Saft", e: "🧃" }] },
        { frage: "Was hat viel Zucker?", optionen: [{ t: "Saft", e: "🧃" }, { t: "Wasser", e: "💧" }, { t: "Tee", e: "🍵" }] }] },
    { id: "lt.15", stufe: "2", titel: "Omas Geburtstag", bild: "🎂", lz: ["de.le.05", "su.so.02"],
      text: "Mi-as O-ma hat Ge-burts-tag. Die Fa-mi-li-e backt ei-nen Ku-chen. Mi-a malt ein Bild für O-ma. O-ma freut sich sehr.",
      fragen: [{ frage: "Wer hat Geburtstag?", optionen: [{ t: "Oma", e: "👵" }, { t: "Mia", e: "👧" }, { t: "Papa", e: "👨" }] },
        { frage: "Was macht Mia für Oma?", optionen: [{ t: "Sie malt ein Bild.", e: "🎨" }, { t: "Sie singt ein Lied.", e: "🎤" }, { t: "Sie kauft Blumen.", e: "💐" }] }] },
    { id: "lt.16", stufe: "2", titel: "An der Ampel", bild: "🚦", lz: ["de.le.05", "su.ge.02"],
      text: "An der Am-pel ist es rot. Ben bleibt ste-hen. Erst bei Grün geht er ü-ber die Stra-ße. Er schaut nach links und nach rechts.",
      fragen: [{ frage: "Was macht Ben bei Rot?", optionen: [{ t: "Er bleibt stehen.", e: "🛑" }, { t: "Er rennt los.", e: "🏃" }, { t: "Er hüpft.", e: "🦘" }] },
        { frage: "Wann geht Ben über die Straße?", optionen: [{ t: "bei Grün", e: "🟢" }, { t: "bei Rot", e: "🔴" }, { t: "sofort", e: "⚡" }] }] },
    { id: "lt.17", stufe: "2", titel: "Ein Kartenteil", bild: "🗺️", lz: ["de.le.05"],
      text: "Fip-si hat ein Teil der Schatz-kar-te ge-fun-den. Es lag un-ter ei-nem Baum. Jetzt feh-len noch vier Tei-le. Fip-si ist froh und hüpft.",
      fragen: [{ frage: "Wo lag das Kartenteil?", optionen: [{ t: "unter einem Baum", e: "🌳" }, { t: "im Wasser", e: "🌊" }, { t: "im Haus", e: "🏠" }] },
        { frage: "Wie viele Teile fehlen noch?", optionen: [{ t: "vier", e: "4️⃣" }, { t: "zwei", e: "2️⃣" }, { t: "keins", e: "0️⃣" }] }] },
    { id: "lt.18", stufe: "2", titel: "Die Biene", bild: "🐝", lz: ["de.le.05", "su.na.05"],
      text: "Die Bie-ne fliegt von Blü-te zu Blü-te. Sie sam-melt Nek-tar. Da-raus macht sie Ho-nig. Bie-nen sind wich-tig für die Pflan-zen.",
      fragen: [{ frage: "Was macht die Biene aus Nektar?", optionen: [{ t: "Honig", e: "🍯" }, { t: "Milch", e: "🥛" }, { t: "Saft", e: "🧃" }] },
        { frage: "Wohin fliegt die Biene?", optionen: [{ t: "zu den Blüten", e: "🌸" }, { t: "ans Meer", e: "🌊" }, { t: "ins Haus", e: "🏠" }] }] },
    { id: "lt.19", stufe: "2", titel: "Streit", bild: "🗣️", lz: ["de.le.05", "su.so.03", "et.mi.01"],
      text: "Wenn zwei Kin-der strei-ten, hilft Re-den. Je-des Kind sagt, was es fühlt. Dann su-chen bei-de zu-sam-men ei-ne Lö-sung.",
      fragen: [{ frage: "Was hilft bei einem Streit?", optionen: [{ t: "Reden", e: "🗣️" }, { t: "Schreien", e: "😡" }, { t: "Weglaufen", e: "🏃" }] },
        { frage: "Was sagt jedes Kind?", optionen: [{ t: "was es fühlt", e: "💬" }, { t: "gar nichts", e: "🤐" }, { t: "ein Lied", e: "🎵" }] }] },
    { id: "lt.20", stufe: "2", titel: "Pause machen", bild: "🌳", lz: ["de.le.05", "me.sa.02", "sp.be.02"],
      text: "Das Tab-let braucht Pau-sen, und du auch. Nach dem Spie-len ge-hen wir raus. Drau-ßen kann man ren-nen und klet-tern.",
      fragen: [{ frage: "Was machen wir nach dem Spielen?", optionen: [{ t: "Wir gehen raus.", e: "🌳" }, { t: "Wir spielen weiter.", e: "📱" }, { t: "Wir schlafen.", e: "😴" }] },
        { frage: "Was kann man draußen machen?", optionen: [{ t: "rennen und klettern", e: "🧗" }, { t: "fernsehen", e: "📺" }, { t: "Zähne putzen", e: "🪥" }] }] }
  ];
  window.LESETEXTE = T;

  if (window.Inhalte) {
    // Fragen zählen je Lernziel (alle Lernziele des Textes)
    const je = {};
    T.forEach(t => t.lz.forEach(z => { je[z] = (je[z] || 0) + t.fragen.length; }));
    const fragen = T.reduce((n, t) => n + t.fragen.length, 0);
    Inhalte.registriere({ id: "de.lesen.texte", fach: "deutsch", titel: "Erste Lesetexte", lz: Object.keys(je).concat(["de.tm.02"]),
      stufe: ["1", "2"], laender: null, aufgaben: fragen, aufgabenJe: Object.assign({ "de.tm.02": fragen }, je), lernkartei: false, quelle: "spiele/lesen/" });
    // „Silben lesen“: Bildwörter aus dem Wortschatz-Kern in Silbenbögen (spiele/lesen/, Lernkartei „silbenwort“)
    Inhalte.registriere({ id: "de.lesen.silben", fach: "deutsch", titel: "Silben lesen", lz: ["de.le.03", "de.su.02"], stufe: ["1"], laender: null,
      aufgaben: 80, lernkartei: true, quelle: "spiele/lesen/" });
  }
})();
