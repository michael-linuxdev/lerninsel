// Vorlesen und Lesetheater (30.10.2026, Lehrplan Deutsch 2025: flüssig und sinngestaltend lesen, Lautleseverfahren, Lesetheater, Viellesen).
// window.VORLESETEXTE: längere eigene Texte für Kl. 3/4 (die Kl.-1/2-Texte kommen aus LESETEXTE). Texte frei erfunden, Namen ausgedacht.
// window.LESETHEATER: kurze Stücke mit Rollen; { id, stufe, titel, bild, rollen: [{ id, name, e }], zeilen: [[rolle, Text], …] }.
(function () {
  window.VORLESETEXTE = [
    { id: "vt.01", stufe: "3", titel: "Der verschwundene Schlüssel", bild: "🔑",
      text: "Am Montagmorgen suchte Jonas überall nach seinem Haustürschlüssel. Er schaute unter das Sofa, in die Jackentasche und sogar in den Kühlschrank. Nichts! „Hast du ihn vielleicht im Garten verloren?“, fragte seine Schwester. Gemeinsam liefen sie hinaus. Neben dem Beet saß Kater Moritz und spielte mit etwas Glänzendem. Klirr! Da lag der Schlüssel. Jonas lachte: „Du kleiner Dieb!“ Seitdem hängt der Schlüssel immer an einem Haken neben der Tür." },
    { id: "vt.02", stufe: "3", titel: "Wie Igel überwintern", bild: "🦔",
      text: "Wenn es im Herbst kälter wird, finden Igel immer weniger Käfer und Würmer. Darum fressen sie sich vorher ein dickes Fettpolster an. Dann suchen sie einen geschützten Platz, zum Beispiel einen Laubhaufen oder eine Hecke. Dort rollen sie sich zusammen und schlafen den ganzen Winter. Ihr Herz schlägt dann ganz langsam, und sie atmen nur wenige Male in der Minute. Erst im Frühling, wenn es wieder warm wird, wachen sie auf. Deshalb sollte man im Herbst Laub im Garten liegen lassen." },
    { id: "vt.03", stufe: "3", titel: "Das Baumhaus", bild: "🌳",
      text: "Lea und Paul wollten ein Baumhaus bauen. Opa half ihnen. Zuerst zeichneten sie einen Plan. Dann sägten sie Bretter und schliffen die Kanten glatt, damit sich niemand einen Splitter holt. Paul hielt die Bretter fest, Lea schraubte. Am Abend war das Baumhaus fertig. Es hatte ein Fenster, eine Strickleiter und ein Schild: „Nur für Freunde!“ Stolz saßen die beiden oben und tranken Kakao. Da rief Opa: „Darf ich auch hinauf?“ – „Na klar“, riefen beide, „du bist doch unser Freund!“" },
    { id: "vt.04", stufe: "3", titel: "Ein Tag ohne Strom", bild: "🕯️",
      text: "Plötzlich war es dunkel. Der Fernseher war aus, der Kühlschrank brummte nicht mehr. „Stromausfall“, sagte Mama. Zuerst fand Mia das unheimlich. Dann holte Papa Kerzen und Taschenlampen. Sie spielten Karten am Küchentisch, und Mama erzählte Geschichten aus ihrer Kindheit. Draußen leuchteten die Sterne heller als sonst. Nach zwei Stunden ging das Licht wieder an. „Schade“, sagte Mia, „es war gerade so gemütlich.“" },
    { id: "vt.05", stufe: "4", titel: "Die Brücke über die Elbe", bild: "🌉",
      text: "Früher war die Elbe für viele Menschen ein großes Hindernis. Wer auf die andere Seite wollte, musste mit einer Fähre übersetzen. Bei Hochwasser oder Eisgang war das gefährlich oder gar nicht möglich. Deshalb bauten die Menschen Brücken. Die ersten waren aus Holz, später aus Stein und schließlich aus Stahl und Beton. Eine Brücke muss sehr viel tragen: Autos, Straßenbahnen, Fußgänger und sogar ihr eigenes Gewicht. Ingenieurinnen und Ingenieure berechnen genau, wie stark jeder Pfeiler sein muss. Heute verbinden viele Brücken die Stadtteile von Dresden, und manche sind selbst zu Sehenswürdigkeiten geworden." },
    { id: "vt.06", stufe: "4", titel: "Die Wette", bild: "🏃",
      text: "„Ich wette, ich bin schneller als du!“, rief Finn und rannte los. Emil zögerte nicht lange und lief hinterher. Bis zur Laterne lagen sie gleichauf, doch dann stolperte Finn über eine Wurzel und fiel hin. Emil blieb sofort stehen. „Hast du dir wehgetan?“, fragte er und half ihm auf. Das Knie blutete ein bisschen. Langsam gingen die beiden nach Hause. „Und wer hat jetzt gewonnen?“, fragte Finn. Emil grinste: „Wir beide. Wir sind ja zusammen angekommen.“" },
    { id: "vt.07", stufe: "4", titel: "Warum der Mond seine Form ändert", bild: "🌓",
      text: "Der Mond leuchtet nicht selbst. Er wird von der Sonne angestrahlt, so wie eine Kugel von einer Taschenlampe. Weil der Mond in etwa vier Wochen einmal um die Erde wandert, sehen wir die beleuchtete Seite jeden Abend ein wenig anders. Bei Neumond ist sie von uns abgewandt, und der Mond ist kaum zu sehen. Dann wächst die helle Sichel von Tag zu Tag, bis wir den runden Vollmond sehen. Danach nimmt der Mond wieder ab. Eine alte Merkhilfe sagt: Sieht der Mond aus wie ein „a“, nimmt er ab; sieht er aus wie ein „z“, nimmt er zu." },
    { id: "vt.08", stufe: "4", titel: "Das Klassenfest", bild: "🎉",
      text: "Die Klasse 4b plante ein Fest zum Ende des Schuljahres. Jede Gruppe bekam eine Aufgabe. Die erste Gruppe schrieb Einladungen an die Eltern, die zweite übte ein kleines Theaterstück, und die dritte kümmerte sich um das Essen. Es gab Streit, weil alle Pizza wollten, nur Aylin nicht. „Dann machen wir ein Büfett“, schlug Frau Weber vor, „jeder bringt etwas anderes mit.“ So kamen Pizza, Obstspieße, Salat und Kuchen auf den Tisch. Am Ende waren sich alle einig: Das war das beste Fest der ganzen Grundschulzeit." }
  ];
  window.LESETHEATER = [
    { id: "th.01", stufe: "2", titel: "Die Rübe", bild: "🥕", rollen: [{ id: "e", name: "Erzähler", e: "📖" }, { id: "o", name: "Opa", e: "👴" }, { id: "m", name: "Maus", e: "🐭" }],
      zeilen: [["e", "Opa hat eine Rübe gepflanzt. Sie ist riesengroß geworden."], ["o", "Ich ziehe die Rübe heraus. Hau ruck!"], ["e", "Aber die Rübe bewegt sich nicht."],
        ["o", "Puh! Allein schaffe ich das nicht. Wer hilft mir?"], ["m", "Ich! Ich bin zwar klein, aber stark."], ["o", "Du? Na gut. Fass mit an!"],
        ["e", "Die Maus hält Opa fest. Beide ziehen."], ["o", "Hau ruck!"], ["m", "Hau ruck!"], ["e", "Und – plopp! – die Rübe ist draußen."],
        ["m", "Siehst du? Zusammen geht es leichter."], ["o", "Danke, kleine Maus. Heute Abend gibt es Rübensuppe für uns beide."]] },
    { id: "th.02", stufe: "3", titel: "Im Fundbüro", bild: "🧤", rollen: [{ id: "f", name: "Frau Klein (Fundbüro)", e: "👩‍💼" }, { id: "k", name: "Kind", e: "🧒" }, { id: "h", name: "Hund", e: "🐶" }],
      zeilen: [["k", "Guten Tag! Ich habe meinen Handschuh verloren. Er ist rot und hat einen Stern."], ["f", "Guten Tag! Rote Handschuhe habe ich viele. Schauen wir mal."],
        ["f", "Ist es dieser hier?"], ["k", "Nein, der ist ja blau!"], ["h", "Wuff!"], ["f", "Und dieser?"], ["k", "Der hat keinen Stern."],
        ["h", "Wuff! Wuff!"], ["k", "Was hat denn dein Hund?"], ["f", "Oh! Er sitzt auf etwas … Ein roter Handschuh mit Stern!"],
        ["k", "Das ist meiner! Danke, Hund!"], ["h", "Wuff!"], ["f", "Er sagt: Gern geschehen. Und pass gut auf deine Sachen auf!"]] },
    { id: "th.03", stufe: "3", titel: "Der Fuchs und der Rabe", bild: "🦊", rollen: [{ id: "e", name: "Erzählerin", e: "📖" }, { id: "f", name: "Fuchs", e: "🦊" }, { id: "r", name: "Rabe", e: "🐦‍⬛" }],
      zeilen: [["e", "Ein Rabe sitzt auf einem Ast. Im Schnabel hält er ein Stück Käse. Da kommt ein hungriger Fuchs vorbei."],
        ["f", "Oh, guten Tag, lieber Rabe! Wie schön deine Federn glänzen!"], ["r", "…"], ["f", "Du bist bestimmt der schönste Vogel im ganzen Wald."],
        ["e", "Der Rabe ist stolz und plustert sich auf."], ["f", "Wenn deine Stimme so schön ist wie deine Federn, dann bist du der König der Vögel. Sing doch einmal!"],
        ["r", "Kraah!"], ["e", "Da fällt der Käse herunter. Der Fuchs schnappt ihn sich."], ["f", "Danke! Merk dir: Wer anderen schmeichelt, will oft etwas von ihnen."],
        ["r", "Das merke ich mir! Nächstes Mal halte ich den Schnabel."]] },
    { id: "th.04", stufe: "4", titel: "Streit um die Schaukel", bild: "🛝", rollen: [{ id: "a", name: "Ali", e: "👦" }, { id: "s", name: "Sophie", e: "👧" }, { id: "l", name: "Lehrer Herr Berg", e: "👨‍🏫" }],
      zeilen: [["a", "Ich war zuerst an der Schaukel!"], ["s", "Gar nicht! Ich warte schon die ganze Pause!"], ["a", "Du lügst!"], ["s", "Du schubst immer!"],
        ["l", "Stopp, ihr beiden. Holt erst einmal tief Luft."], ["l", "Ali, was ist passiert? Und Sophie, du hörst zu, ohne zu unterbrechen."],
        ["a", "Ich wollte schaukeln. Dann kam Sophie und hat gedrängelt."], ["l", "Danke. Sophie, jetzt du."], ["s", "Ich habe gewartet, und dann hat Ali sich vorgedrängelt."],
        ["l", "Ihr wollt also beide schaukeln. Habt ihr eine Idee, wie das gerecht geht?"], ["s", "Jeder darf fünf Minuten?"], ["a", "Und wer zuerst?"],
        ["s", "Wir losen. Schere, Stein, Papier!"], ["a", "Einverstanden."], ["l", "Super. So löst man einen Streit."]] }
  ];
})();
