// Lehrplan-Kern (NA-03): bundesweite Lernziele mit festen IDs `<fach>.<bereich>.<nr>`.
// Grundlage: KMK-Bildungsstandards Primarbereich Deutsch und Mathematik (Fassung 2022; Deutsch mit fünf Kompetenzbereichen),
// KMK-Strategie „Bildung in der digitalen Welt“ (2016), GDSU-Perspektivrahmen Sachunterricht (2013); Kunst, Musik, Bewegung und
// Ethik als gemeinsamer Nenner der Länderpläne, Vorschule nach den Kita-Bildungsplänen, DaZ nach SPRACHEN.md.
// Die Titel sind eigene Zusammenfassungen (nicht abgeschrieben) und werden vor dem Bau eines Inhalts am Original geprüft.
// stufe = Kern-Stufe, in der das Ziel typischerweise erreicht wird: "vs" (Vorschule), "1"–"4", "5" (Übergang).
// Länder weichen nur in shared/lehrplan/laender/<land>.js ab (andere Stufe, Zusatz-Ziele, Fachnamen).
// IDs NIE umnummerieren oder wiederverwenden: Inhalte und Spielstände verweisen darauf. Neue Ziele hinten anhängen.
(function () {
  const FAECHER = {
    ma: { name: "Mathematik", quelle: "KMK-M", bereiche: {
      zo: "Zahl und Operation", rf: "Raum und Form", ms: "Muster, Strukturen und funktionaler Zusammenhang",
      gm: "Größen und Messen", dz: "Daten und Zufall", pk: "Prozessbezogene Kompetenzen" } },
    de: { name: "Deutsch", quelle: "KMK-D", bereiche: {
      sz: "Sprechen und Zuhören", sc: "Schreiben", le: "Lesen",
      tm: "Sich mit Texten und anderen Medien auseinandersetzen", su: "Sprachgebrauch und Sprache untersuchen" } },
    su: { name: "Sachunterricht", quelle: "GDSU", bereiche: {
      so: "Sozialwissenschaftliche Perspektive", na: "Naturwissenschaftliche Perspektive", ge: "Geographische Perspektive",
      hi: "Historische Perspektive", te: "Technische Perspektive" } },
    me: { name: "Medienbildung", quelle: "KMK-DW", bereiche: {
      sv: "Suchen, Verarbeiten und Aufbewahren", kk: "Kommunizieren und Kooperieren", pp: "Produzieren und Präsentieren",
      sa: "Schützen und sicher Agieren", ph: "Problemlösen und Handeln", ar: "Analysieren und Reflektieren" } },
    ku: { name: "Kunst", quelle: "Länderpläne", bereiche: { ge: "Gestalten", be: "Betrachten" } },
    mu: { name: "Musik", quelle: "Länderpläne", bereiche: { ho: "Musik hören", ma: "Musik machen", no: "Musik lesen und aufschreiben" } },
    sp: { name: "Bewegung", quelle: "Länderpläne", bereiche: { be: "Sich bewegen" } },
    et: { name: "Ethik und soziales Lernen", quelle: "Länderpläne", bereiche: { ge: "Gefühle", mi: "Miteinander", we: "Werte" } },
    re: { name: "Religion (ev./kath.)", quelle: "Länderpläne", bereiche: { mi: "Miteinander leben", go: "Nach Gott fragen", bi: "Biblische Botschaft", fe: "Feste und Kirche" } },
    en: { name: "Englisch", quelle: "Länderpläne Fremdsprache Grundschule (GeR A1 angebahnt)", bereiche: {
      hv: "Hörverstehen", sp: "Sprechen", ws: "Wortschatz", le: "Lesen und Schreiben", ik: "Interkulturelles Lernen" } },
    so: { name: "Sorbisch (Obersorbisch)", quelle: "Lehrplan Sachsen „Sorbisch als Fremdsprache“ (Grundschule)", bereiche: {
      sp: "Sprechen", ws: "Wortschatz", le: "Lesen", ik: "Sorbische Kultur und Bräuche" } },
    sm: { name: "Sorbisch (Muttersprache)", quelle: "Lehrplan Sachsen Grundschule Sorbisch (2004)", bereiche: {
      sp: "Schriftspracherwerb", sz: "Sprechen und Zuhören", sc: "Schreiben", rs: "Richtig schreiben", le: "Lesen und Medien", su: "Sprache untersuchen", ku: "Sorbische Literatur und Kultur" } },
    daz: { name: "Deutsch als Zweitsprache", quelle: "SPRACHEN.md", bereiche: { d0: "D0 Ankommen", d1: "D1 Erste Sätze" } }
  };

  // [id, stufe, Titel (de)]
  const LISTE = [
    // ---------- Mathematik ----------
    ["ma.zo.01", "vs", "Kleine Mengen bis 10 auf einen Blick erfassen und zählen (Würfelbilder)"],
    ["ma.zo.02", "1", "Zahlen bis 20 darstellen, vergleichen und ordnen"],
    ["ma.zo.03", "1", "Plus und Minus im Zahlenraum bis 20"],
    ["ma.zo.04", "1", "Zahlen zerlegen, verdoppeln und halbieren"],
    ["ma.zo.05", "2", "Zahlen bis 100 mit Zehnern und Einern darstellen (Stellenwert)"],
    ["ma.zo.06", "2", "Zahlen bis 100 vergleichen und ordnen, gerade und ungerade Zahlen"],
    ["ma.zo.07", "2", "Plus und Minus bis 100 mit Rechenstrategien, auch über den Zehner"],
    ["ma.zo.08", "2", "Ergänzen und Umkehraufgaben nutzen"],
    ["ma.zo.09", "2", "Malnehmen verstehen und Kernaufgaben mit 2, 5 und 10 lösen"],
    ["ma.zo.10", "2", "Teilen als Aufteilen und Verteilen, Umkehrung des Malnehmens"],
    ["ma.zo.11", "3", "Das ganze Einmaleins sicher können, Teilen mit Rest"],
    ["ma.zo.12", "3", "Zahlen bis 1 000 verstehen und runden"],
    ["ma.zo.13", "3", "Halbschriftlich und schriftlich addieren und subtrahieren"],
    ["ma.zo.14", "3", "Einfache Bruchteile im Alltag (Hälfte, Viertel)"],
    ["ma.zo.15", "4", "Zahlen bis 1 Million verstehen"],
    ["ma.zo.16", "4", "Schriftlich multiplizieren und dividieren, Ergebnisse überschlagen"],
    ["ma.zo.17", "4", "Rechengesetze und Teilbarkeit nutzen"],
    ["ma.zo.18", "2", "Rechengeschichten und Sachaufgaben lösen"],
    ["ma.zo.19", "5", "Brüche und große Zahlen im Alltag"],
    ["ma.rf.01", "vs", "Lagebegriffe verstehen: oben, unten, neben, vor, hinter"],
    ["ma.rf.02", "1", "Lagebeziehungen und Wege beschreiben"],
    ["ma.rf.03", "1", "Ebene Figuren erkennen und benennen (Dreieck, Viereck, Kreis)"],
    ["ma.rf.04", "2", "Körper erkennen und benennen (Würfel, Quader, Kugel, Zylinder)"],
    ["ma.rf.05", "2", "Achsensymmetrie erkennen und ergänzen"],
    ["ma.rf.06", "2", "Würfelgebäude bauen und Baupläne lesen"],
    ["ma.rf.07", "3", "Netze von Würfel und Quader, einfache Pläne"],
    ["ma.rf.08", "3", "Flächen und Umfang vergleichen"],
    ["ma.rf.09", "4", "Maßstab, Schrägbilder und Flächeninhalt"],
    ["ma.rf.10", "5", "Koordinaten ablesen, Winkel unterscheiden (spitz, recht, stumpf)"],
    ["ma.ms.01", "vs", "Muster legen und fortsetzen"],
    ["ma.ms.02", "1", "Zahlenfolgen und Muster fortsetzen"],
    ["ma.ms.03", "2", "Rechenmuster und Tauschaufgaben entdecken"],
    ["ma.ms.04", "3", "Zahlenmuster beschreiben und begründen"],
    ["ma.ms.05", "4", "Einfache Zusammenhänge wie Menge und Preis nutzen"],
    ["ma.ms.06", "5", "Terme mit Klammern lesen: Klammer zuerst, Punkt vor Strich"],
    ["ma.gm.01", "vs", "Längen und Gewichte direkt vergleichen (länger, schwerer)"],
    ["ma.gm.02", "1", "Münzen und Scheine erkennen"],
    ["ma.gm.03", "1", "Zeitpunkte und Tagesablauf ordnen"],
    ["ma.gm.04", "2", "Mit Euro und Cent rechnen"],
    ["ma.gm.05", "2", "Längen schätzen und messen (cm, m)"],
    ["ma.gm.06", "2", "Die Uhr lesen (volle, halbe und Viertelstunden)"],
    ["ma.gm.07", "2", "Woche, Monat und Jahr im Kalender"],
    ["ma.gm.08", "3", "Gewichte (g, kg) und Zeitspannen"],
    ["ma.gm.09", "4", "Hohlmaße (l, ml) und Größen umrechnen"],
    ["ma.gm.10", "5", "Größen in Kommaschreibweise (Geld, Länge, Gewicht)"],
    ["ma.dz.01", "vs", "Dinge sortieren und vergleichen"],
    ["ma.dz.02", "1", "Strichlisten anlegen und lesen"],
    ["ma.dz.03", "2", "Tabellen und Diagramme lesen"],
    ["ma.dz.04", "2", "Sicher, möglich oder unmöglich einschätzen"],
    ["ma.dz.05", "3", "Einfache Kombinationen finden"],
    ["ma.dz.06", "3", "Diagramme selbst erstellen"],
    ["ma.dz.07", "4", "Gewinnchancen vergleichen"],
    ["ma.dz.08", "5", "Den Durchschnitt (Mittelwert) bestimmen"],
    ["ma.pk.01", "1", "Probleme lösen: Strategien ausprobieren"],
    ["ma.pk.02", "1", "Kommunizieren: Rechenwege erklären"],
    ["ma.pk.03", "2", "Argumentieren: Vermutungen prüfen und begründen"],
    ["ma.pk.04", "2", "Modellieren: Sachsituationen in Rechnungen übersetzen"],
    ["ma.pk.05", "1", "Darstellen: Material, Bilder und Zeichen nutzen"],
    ["ma.pk.06", "2", "Mit Zeichen, Fachbegriffen und Hilfsmitteln umgehen"],

    // ---------- Deutsch (fünf Bereiche, KMK 2022) ----------
    ["de.sz.01", "vs", "Zuhören und kurze Geschichten nacherzählen"],
    ["de.sz.02", "1", "Erzählen und Gesprächsregeln einhalten"],
    ["de.sz.03", "1", "Im Alltag grüßen, bitten und danken"],
    ["de.sz.04", "2", "Genau zuhören und Gehörtes verstehen"],
    ["de.sz.05", "2", "Etwas vortragen"],
    ["de.sz.06", "3", "Eine Meinung sagen und begründen"],
    ["de.sz.07", "4", "Etwas präsentieren"],
    ["de.sc.01", "vs", "Kritzeln und den eigenen Namen schreiben"],
    ["de.sc.02", "1", "Buchstaben in Druckschrift formen"],
    ["de.sc.03", "1", "Wörter lautgetreu schreiben"],
    ["de.sc.04", "2", "Rechtschreibstrategien nutzen: verlängern und ableiten"],
    ["de.sc.05", "2", "Nomen und Satzanfänge großschreiben, Satzschlusszeichen setzen"],
    ["de.sc.06", "2", "Kurze Texte für andere schreiben (Einladung, Glückwunsch)"],
    ["de.sc.07", "3", "Texte planen und überarbeiten"],
    ["de.sc.08", "3", "Lange und kurze Vokale, ck, tz, ss und ß"],
    ["de.sc.09", "4", "Textsorten wie Bericht und Brief, Wörterbuch nutzen"],
    ["de.le.01", "vs", "Anlaute hören"],
    ["de.le.02", "1", "Buchstaben und Laute einander zuordnen"],
    ["de.le.03", "1", "Silben und Wörter zusammenlesen"],
    ["de.le.04", "1", "Kurze Sätze lesen und verstehen"],
    ["de.le.05", "2", "Flüssig lesen und Fragen zum Text beantworten"],
    ["de.le.06", "3", "Lesestrategien anwenden, Sachtexte lesen"],
    ["de.le.07", "4", "Informationen aus Texten entnehmen und vergleichen"],
    ["de.le.08", "5", "Lesestrategien für lange Sachtexte sicher anwenden"],
    ["de.tm.01", "vs", "Geschichten und Bilderbücher erleben"],
    ["de.tm.02", "1", "Bilderbücher und Hörgeschichten verstehen"],
    ["de.tm.03", "2", "Kinderbücher, Märchen und Gedichte kennenlernen"],
    ["de.tm.04", "3", "Textsorten unterscheiden (Märchen, Fabel, Gedicht)"],
    ["de.tm.05", "4", "Texte und Medien vergleichen und bewerten"],
    ["de.su.01", "vs", "Silben klatschen und reimen"],
    ["de.su.02", "1", "Laute, Buchstaben und Silben unterscheiden"],
    ["de.su.03", "1", "Dinge benennen: Wortschatz mit Artikel"],
    ["de.su.04", "2", "Wortarten unterscheiden: Nomen, Verb, Adjektiv"],
    ["de.su.05", "2", "Artikel und Mehrzahl"],
    ["de.su.06", "2", "Sätze bilden und umstellen"],
    ["de.su.07", "2", "Lagewörter (Präpositionen) richtig nutzen"],
    ["de.su.08", "2", "Wortfamilien und zusammengesetzte Nomen"],
    ["de.su.09", "3", "Gegenwart und Vergangenheit (Präsens, Präteritum)"],
    ["de.su.10", "3", "Satzglieder: Subjekt und Prädikat"],
    ["de.su.11", "4", "Satzarten und einfache Fälle"],
    ["de.su.12", "4", "Perfekt und Futur"],
    ["de.su.13", "5", "Grammatik-Fachbegriffe nutzen (Substantiv, Pronomen, Präposition, Subjekt, Prädikat)"],

    // ---------- Sachunterricht (GDSU) ----------
    ["su.so.01", "vs", "Freunde und Familie"],
    ["su.so.02", "1", "Familie und Verwandtschaft"],
    ["su.so.03", "1", "Regeln vereinbaren und Streit lösen"],
    ["su.so.04", "2", "Feste und Bräuche in verschiedenen Kulturen"],
    ["su.so.05", "3", "Zusammenleben in der Gemeinde, mitbestimmen"],
    ["su.so.06", "4", "Kinderrechte und Umgang mit Geld"],
    ["su.so.07", "5", "Übergang: Lernen organisieren und die neue Schule kennenlernen"],
    ["su.na.01", "vs", "Tiere, Pflanzen und Wasser entdecken"],
    ["su.na.02", "1", "Körper und Gesundheit: Zähne, Essen, Bewegung"],
    ["su.na.03", "1", "Bäume, Vögel und Jahreszeiten"],
    ["su.na.04", "2", "Wetter beobachten und beschreiben"],
    ["su.na.05", "2", "Frühblüher, Keimen und Wachsen"],
    ["su.na.06", "2", "Haustiere und ihre Pflege"],
    ["su.na.07", "3", "Wasser: fest, flüssig, gasförmig, Wasserkreislauf"],
    ["su.na.08", "3", "Lebensräume wie Wiese und Wald"],
    ["su.na.09", "4", "Strom und Wärme einfach erklärt"],
    ["su.ge.01", "vs", "Wege und Orte in der Nähe"],
    ["su.ge.02", "1", "Schulweg und Verkehr"],
    ["su.ge.03", "3", "Karten lesen, Himmelsrichtungen"],
    ["su.ge.04", "4", "Heimatregion und Bundesland"],
    ["su.hi.01", "vs", "Gestern, heute, morgen"],
    ["su.hi.02", "1", "Zeit gliedern: Tag, Woche, Jahr"],
    ["su.hi.03", "2", "Die eigene Geschichte, früher und heute"],
    ["su.hi.04", "4", "Geschichte des Heimatortes"],
    ["su.te.01", "vs", "Bauen und konstruieren"],
    ["su.te.02", "1", "Stabile Türme und Brücken bauen"],
    ["su.te.03", "3", "Einfache Maschinen und das Fahrrad"],

    // ---------- Medienbildung (KMK „Bildung in der digitalen Welt“) ----------
    ["me.ph.01", "1", "Ein Tablet bedienen (tippen, wischen, ziehen)"],
    ["me.sa.01", "1", "Persönliche Daten schützen, vorsichtig mit Fremden im Netz"],
    ["me.sa.02", "1", "Geräte gesund nutzen (Pausen, Bildschirmzeit)"],
    ["me.kk.01", "1", "Freundlich kommunizieren und Regeln einhalten"],
    ["me.ar.01", "2", "Werbung erkennen"],
    ["me.ar.02", "3", "Wahres und Falsches unterscheiden"],
    ["me.sv.01", "2", "Informationen mit Kinderseiten suchen"],
    ["me.pp.01", "2", "Bilder und Töne gestalten und zeigen"],
    ["me.ph.02", "3", "Einfache Abläufe programmieren"],

    // ---------- Kunst, Musik, Bewegung, Ethik ----------
    ["ku.ge.01", "1", "Mit Farben malen und Farben mischen"],
    ["ku.ge.02", "1", "Formen und Muster gestalten"],
    ["ku.be.01", "3", "Bilder und Kunstwerke betrachten und beschreiben"],
    ["mu.ho.01", "1", "Klänge unterscheiden: hoch und tief, laut und leise"],
    ["mu.ma.01", "1", "Rhythmen klatschen und spielen"],
    ["mu.ma.02", "1", "Lieder singen und auf einem Instrument begleiten"],
    ["mu.ma.03", "2", "Eigene Melodien erfinden"],
    ["mu.no.01", "3", "Notenwerte und einfache Notation"],
    ["sp.be.01", "1", "Grundbewegungen: laufen, springen, balancieren"],
    ["sp.be.02", "1", "Bewegungspausen machen"],
    ["et.ge.01", "1", "Gefühle erkennen und benennen"],
    ["et.ge.02", "1", "Mit starken Gefühlen umgehen, zur Ruhe kommen"],
    ["et.mi.01", "1", "Freundschaft und Miteinander"],
    ["et.we.01", "3", "Gerechtigkeit und Vielfalt"],
    // Lehrpläne Sachsen 2019 Kunst, Musik, Werken, Sport, Ethik (28.10.2026)
    ["ku.ge.03", "1", "Plastisch gestalten: formen, bauen, Räume gestalten"],
    ["ku.be.02", "4", "Gestaltete Umwelt verstehen: Design, Architektur, Bilder in Medien"],
    ["mu.ho.02", "1", "Instrumente, Stimmen und ihren Klang kennen"],
    ["mu.ho.03", "3", "Musik im Leben der Menschen: Komponisten, Gattungen, Orte der Musik"],
    ["sp.be.03", "1", "Sicher und fair: Regeln beim Spielen, Turnen, Schwimmen und im Winter"],
    ["et.mi.02", "3", "Wahrheit, Vertrauen und Zivilcourage"],
    ["et.we.02", "1", "Feste, Religionen und Lebensweisen kennen und achten"],
    ["et.we.03", "1", "Über die Natur staunen und sie bewahren"],
    ["et.we.04", "4", "Philosophische Fragen: Glück, Zeit, Wünsche, Entscheidungen"],
    ["su.te.04", "3", "Werkstoffe und Werkzeuge sicher nutzen"],
    ["su.te.05", "4", "Technik pflegen, Roboter und Automaten verstehen"],
    // Religion (Lehrpläne Sachsen Ev. und Kath. Religion 2004/2009/2019, 28.10.2026)
    ["re.mi.01", "1", "Miteinander leben: Gefühle, Konflikte, Trost und Vergebung"],
    ["re.mi.02", "3", "Andere Religionen kennen: Judentum und Islam"],
    ["re.go.01", "1", "Schöpfung, Gottesbilder und Symbole"],
    ["re.go.02", "2", "Beten, Psalmen und Stille"],
    ["re.bi.01", "1", "Erzählungen des Alten Testaments"],
    ["re.bi.02", "1", "Leben, Taten und Gleichnisse Jesu"],
    ["re.bi.03", "4", "Die Bibel: Aufbau und Entstehung"],
    ["re.fe.01", "1", "Feste und Kirchenjahr"],
    ["re.fe.02", "2", "Kirche, Gottesdienst, Taufe und Ökumene"],

    // ---------- Englisch (Grundschule; Beginn je nach Land Kl. 1 oder 3) ----------
    ["en.hv.01", "3", "Einfache englische Wörter und Sätze hören und verstehen"],
    ["en.sp.01", "3", "Begrüßen, verabschieden, sich vorstellen"],
    ["en.ws.01", "3", "Grundwortschatz: Farben, Zahlen, Tiere, Körper, Essen"],
    ["en.sp.02", "4", "Einfache Sätze sprechen (I like …, I have …, This is …)"],
    ["en.ws.02", "4", "Wortschatz: Familie, Schule, Kleidung, Wetter, Hobbys"],
    ["en.le.01", "4", "Bekannte Wörter und kurze Sätze lesen"],
    ["en.sp.03", "5", "Über sich erzählen: Alter, Herkunft, Hobbys"],
    ["en.ik.01", "3", "Feste und Jahreslauf in englischsprachigen Ländern"],

    // ---------- Sorbisch als Fremdsprache (Sachsen, nur nach Eltern-Wahl) ----------
    ["so.sp.01", "1", "Auf Sorbisch grüßen, danken, sich vorstellen und sagen, wie es einem geht"],
    ["so.ws.01", "1", "Erste sorbische Wörter: Familie, Körper, Kleidung, Farben, Zahlen, Schule, Tiere"],
    ["so.ws.02", "3", "Sorbischer Wortschatz: Zuhause, Wochentage, Zahlen bis 100, Essen, Freizeit, Unterwegs, Monate, Natur"],
    ["so.sp.02", "3", "Kurze sorbische Sätze bilden (Ja rěkam …, Ja sym …, Ja rady …)"],
    ["so.le.01", "1", "Sorbische Wörter mit ihren Buchstaben (č, ć, ł, ř, š, ž, ě …) lesen"],
    ["so.ik.01", "1", "Sorbische Feste und Bräuche (Vogelhochzeit, Ostern) und die Lausitz als zweisprachige Heimat"],

    // ---------- Sorbisch als Muttersprache (Sachsen, Lehrplan 2004, nur nach Eltern-Wahl) ----------
    ["sm.sp.01", "1", "Sorbische Laute und Buchstaben (č, ć, dź, ł, š, ž …), Silben und erste Wörter"],
    ["sm.sz.01", "1", "Auf Sorbisch höflich sprechen, Gesprächsregeln einhalten, Nachrichten weitergeben"],
    ["sm.sc.01", "1", "Sorbische Texte für andere schreiben: Einladung, Geschichte, Brief"],
    ["sm.rs.01", "1", "Sorbisch richtig schreiben: Satzanfang, Auslaut (dub – duby), č/ć, ł/w, Alphabet im Wörterbuch"],
    ["sm.le.01", "1", "Sorbische Wörter, Sätze und Texte lesen und verstehen, sorbische Medien kennen"],
    ["sm.su.01", "3", "Sorbische Sprache untersuchen: Wortarten, Dual, Wortfamilien, slawische Verwandtschaft"],
    ["sm.ku.01", "1", "Sorbische Märchen, Sagen (Krabat), Feste, Theater und die mehrsprachige Lausitz"],

    // ---------- Deutsch als Zweitsprache ----------
    ["daz.d0.01", "1", "Erste Wörter für Schule und Alltag verstehen"],
    ["daz.d0.02", "1", "Sich vorstellen, grüßen, bitten und danken"],
    ["daz.d0.03", "1", "Den Artikel als Teil des Wortes lernen"],
    ["daz.d1.01", "1", "Einfache Sätze verstehen und bilden"]
  ];

  const ziele = {};
  LISTE.forEach(([id, stufe, de]) => {
    const [fach, bereich] = id.split(".");
    ziele[id] = { id, fach, bereich, stufe, titel: { de } };
  });
  const STUFEN = ["vs", "1", "2", "3", "4", "5"];

  window.LernzielKern = {
    FAECHER, STUFEN, ziele,
    ziel: (id) => ziele[id] || null,
    alle: () => LISTE.map(([id]) => ziele[id]),
    // Ziele eines Fachs (optional nur eines Bereichs)
    fach: (f, bereich) => LISTE.map(([id]) => ziele[id]).filter(z => z.fach === f && (!bereich || z.bereich === bereich)),
    bereichName: (id) => { const z = ziele[id] || {}; const f = FAECHER[z.fach]; return f ? f.bereiche[z.bereich] : ""; }
  };
})();
