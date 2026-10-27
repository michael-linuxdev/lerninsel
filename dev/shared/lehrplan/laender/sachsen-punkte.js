// Sachsen in voller Tiefe („wie ein Schuljahr“, Entscheidung 27.10.2026): Inhaltspunkte je Lernbereich, aus dem Lehrplantext zusammengefasst
// (nie wörtlich), mit Zuordnung zu Inhalten der App. Ergänzt das Profil aus sachsen.js um `punkte` – darum NACH sachsen.js und VOR
// shared/lehrplan.js laden.
// Punkt: [id, Text, Klasse ("1" | "2" | "1/2" | "3" | "4"), app[], abdeckung]
//   abdeckung: "ja" = in der App geübt · "teil" = teilweise · "nein" = fehlt noch · "aussen" = gehört nach draußen/aufs Papier
//   (Zeichnen mit Lineal und Zirkel, echtes Messen, Bauen) – dafür gibt es Echte-Welt-Aufgaben, die App übt es nicht selbst.
// Quellen: Mathematik 2025 (Lehrplan Grundschule Sachsen, Fassung 2025, gültig ab 1.8.2025; vom Auftraggeber als PDF bereitgestellt), Kl. 1/2, 3 und 4;
//   Deutsch 2025 (Fachlehrplan Deutsch, gültig ab 1.8.2025, kommentierte Fassung; PDF vom Auftraggeber, 28.10.2026), Kl. 1/2, 3 und 4.
// app-Zuordnungen: mathe:<station>, werkstatt:<kapitel>, deutsch:<abenteuer-kapitel>, lesen:<anlaute|silben|texte|spuren|legen|tafel>,
//   medien:<lektion>, sachkunde:<thema>, echtewelt:<id>
(function () {
  const P = window.LehrplanLaender && window.LehrplanLaender.sn; if (!P) return;
  const PUNKTE = {
    deutsch: {
      "1/2": {
        1: [ // Sprechen und Zuhören
          ["sn.de12.sz.01", "Erlebtes und Erfundenes erzählen, nacherzählen, sich über Erzähltes austauschen", "1/2", ["werkstatt:w-erzaehlen", "werkstatt:w-bildergeschichte"], "ja"],
          ["sn.de12.sz.02", "Alltagssituationen genau beschreiben, Fragen stellen und beantworten, einfach erklären", "1/2", ["werkstatt:w-sprechen"], "ja"],
          ["sn.de12.sz.03", "Von der Alltagssprache zur Bildungssprache: passende, genaue Wörter wählen", "2", ["werkstatt:w-sprachen", "werkstatt:w-sprechen"], "ja"],
          ["sn.de12.sz.04", "Digitale Werkzeuge erproben: die eigene Stimme aufnehmen und anhören (mit Eltern-Erlaubnis)", "1/2", ["werkstatt:w-reime", "werkstatt:w-erzaehlen", "werkstatt:w-auswendig"], "ja"],
          ["sn.de12.sz.05", "Beim Sprechen: Körperhaltung, Tempo, Lautstärke, Betonung; Gedichtvortrag und szenisches Spiel", "1/2", ["werkstatt:w-sprechen", "werkstatt:w-gedicht-vortragen"], "ja"],
          ["sn.de12.sz.06", "Sprachvarietäten kennen: Dialekt, Erst- und Zweitsprache, Alltags- und Bildungssprache", "2", ["werkstatt:w-sprachen"], "ja"],
          ["sn.de12.sz.07", "Wertschätzend sprechen: grüßen, bitten, entschuldigen, danken, gratulieren, einladen, loben", "1/2", ["werkstatt:w-gespraech", "deutsch:baeckerei"], "ja"],
          ["sn.de12.sz.08", "Gemeinsame Gesprächsregeln: zuhören, melden, deutlich sprechen, Blickkontakt, ausreden lassen", "1/2", ["werkstatt:w-gespraech"], "ja"],
          ["sn.de12.sz.09", "Konflikte mit Worten lösen, andere Meinungen akzeptieren", "1/2", ["werkstatt:w-gespraech"], "ja"],
          ["sn.de12.sz.10", "Reime, Gedichte, Märchen und Witze auswendig oder vorlesend vortragen", "1/2", ["werkstatt:w-reime", "werkstatt:w-auswendig", "werkstatt:w-gedicht-vortragen"], "ja"],
          ["sn.de12.sz.11", "Techniken des Auswendiglernens: wiederholen, Bilder als Gedächtnisstütze, mit mehreren Sinnen", "2", ["werkstatt:w-auswendig"], "ja"],
          ["sn.de12.sz.12", "Zuhören vorbereiten: Hörerwartung, Vorwissen, gute Hörbedingungen, Lauschübungen", "1/2", ["werkstatt:w-zuhoeren", "deutsch:hof"], "ja"],
          ["sn.de12.sz.13", "Hörtexte verstehen (Durchsagen, Hörgeschichten): Kernaussage, Details, Tonfall", "1/2", ["werkstatt:w-zuhoeren", "werkstatt:w-maerchen"], "ja"],
          ["sn.de12.sz.14", "Nach dem Zuhören: nachfragen, einfache Schlussfolgerungen, Fragen beantworten", "1/2", ["werkstatt:w-zuhoeren"], "ja"]
        ],
        2: [ // Schreiben
          ["sn.de12.sc.01", "Vorläuferfähigkeiten: Auge-Hand-Koordination, Formen und Raum-Lage erkennen, Laute hören", "1", ["lesen:spuren", "lesen:anlaute", "werkstatt:w-laute"], "ja"],
          ["sn.de12.sc.02", "Gute Sitz- und Schreibhaltung, Stifthaltung (auch für Linkshänder), passende Schreibgeräte", "1", ["echtewelt:schreibhaltung"], "aussen"],
          ["sn.de12.sc.03", "Druckschrift als erste Schrift schreiben", "1", ["lesen:spuren", "lesen:legen"], "ja"],
          ["sn.de12.sc.04", "Schulausgangsschrift lernen und zunehmend flüssig schreiben; Schrift prüfen (Größe, Abstände, Form)", "2", ["echtewelt:schreibschrift"], "aussen"],
          ["sn.de12.sc.05", "Laute und Buchstaben zuordnen: Selbstlaute, Umlaute, Zwielaute, Mitlaute; Laute im Wort finden", "1", ["lesen:anlaute", "lesen:legen", "werkstatt:w-laute"], "ja"],
          ["sn.de12.sc.06", "Zweisilber: offene und geschlossene Silbe, ie-Schreibung, doppelte Mitlaute", "2", ["werkstatt:w-silbe-lang-kurz"], "ja"],
          ["sn.de12.sc.07", "Wortstamm bleibt gleich: verlängern und ableiten (Ball – Bälle, Berg – Berge)", "2", ["werkstatt:w-verlaengern", "werkstatt:w-detektiv"], "ja"],
          ["sn.de12.sc.08", "Wortbildung beim Schreiben: zusammengesetzte Nomen, vorangestellte Wortbausteine", "2", ["werkstatt:w-wortbau", "werkstatt:w-vornach"], "ja"],
          ["sn.de12.sc.09", "Großschreibung: Nomen, Namen, Satzanfänge, Überschriften, auch mit Wiewort davor", "1/2", ["werkstatt:w-begleiter", "werkstatt:w-wortarten", "werkstatt:w-ueberarbeiten"], "ja"],
          ["sn.de12.sc.10", "Satzschlusszeichen: Punkt, Fragezeichen, Ausrufezeichen", "1/2", ["werkstatt:w-satzarten", "werkstatt:w-satzzeichen"], "ja"],
          ["sn.de12.sc.11", "Rechtschreibstrategien und Arbeitstechniken: kontrollieren, abschreiben, berichtigen", "2", ["werkstatt:w-detektiv"], "ja"],
          ["sn.de12.sc.12", "Häufige Wörter und Funktionswörter sicher schreiben", "1/2", ["werkstatt:w-merkwoerter", "lesen:legen"], "ja"],
          ["sn.de12.sc.13", "Merkwörter, die keiner Regel folgen (Vogel, vier, Vater)", "2", ["werkstatt:w-merkwoerter"], "ja"],
          ["sn.de12.sc.14", "Das Alphabet als Ordnung; im Wörterbuch nach dem Anfangsbuchstaben suchen", "2", ["werkstatt:w-laute", "werkstatt:w-woerterbuch"], "ja"],
          ["sn.de12.sc.15", "Für andere schreiben: Brief, Glückwunsch, Einladung, Einkaufs- und Wunschzettel", "2", ["werkstatt:w-einladung", "werkstatt:w-glueckwunsch"], "ja"],
          ["sn.de12.sc.16", "Texte planen: Schreibanlass klären, Stichwörter und Wörter sammeln", "2", ["werkstatt:w-beschreiben", "werkstatt:w-wortbau"], "ja"],
          ["sn.de12.sc.17", "Erlebtes und Erdachtes aufschreiben, kleine Gedichtformen", "2", ["werkstatt:w-erzaehlen", "werkstatt:w-elfchen", "werkstatt:w-maerchen"], "ja"],
          ["sn.de12.sc.18", "Beschreiben: Gegenstand, Person, Tier", "2", ["werkstatt:w-beschreiben"], "ja"],
          ["sn.de12.sc.19", "Texte gestalten: Überschrift, Platz einteilen, hervorheben, am Gerät schreiben", "2", ["werkstatt:w-beschreiben", "werkstatt:w-einladung"], "teil"],
          ["sn.de12.sc.20", "Texte überarbeiten nach Kriterien (Aufbau, Wörter, Rechtschreibung), Rückmeldungen und Checklisten nutzen", "2", ["werkstatt:w-ueberarbeiten"], "ja"],
          ["sn.de12.sc.21", "Fachbegriffe: Buchstabe, Laut, Silbe, Wortstamm, Selbst-, Mit-, Um- und Zwielaut, Strategie, Verlängern, Ableiten, Zerlegen", "2", ["werkstatt:w-laute", "werkstatt:w-detektiv"], "ja"]
        ],
        3: [ // Lesen
          ["sn.de12.le.01", "Schrift als Zeichensystem entdecken: Zeichen, Buchstaben, Wörter erkennen", "1", ["lesen:anlaute", "lesen:tafel"], "ja"],
          ["sn.de12.le.02", "Laute unterscheiden, Buchstaben erkennen, Silben zusammenziehen", "1", ["lesen:anlaute", "lesen:silben", "werkstatt:w-silben"], "ja"],
          ["sn.de12.le.03", "Buchstaben-Laut-Zuordnung, Lautposition im Wort, Aufbau von Wörtern", "1", ["lesen:anlaute", "lesen:legen", "werkstatt:w-laute"], "ja"],
          ["sn.de12.le.04", "Wörter über Silben und Wortbausteine lesen", "1/2", ["lesen:silben", "werkstatt:w-silben", "werkstatt:w-wortbau"], "ja"],
          ["sn.de12.le.05", "Häufige Wörter blitzschnell lesen (Blitzlesen)", "1/2", ["werkstatt:w-merkwoerter"], "ja"],
          ["sn.de12.le.06", "Sätze und kurze Texte lesen: Wort- und Satzgrenzen, Satzmelodie", "1/2", ["lesen:texte", "werkstatt:w-satzarten", "deutsch:wald"], "ja"],
          ["sn.de12.le.07", "Flüssig lesen: still, leise und laut, genau, im passenden Tempo; Lautleseverfahren", "2", ["werkstatt:w-lautlesen", "lesen:texte"], "teil"],
          ["sn.de12.le.08", "Vor dem Lesen: Vermutungen, Bilder betrachten, Vorwissen nutzen", "2", ["werkstatt:w-lesedetektiv"], "ja"],
          ["sn.de12.le.09", "Beim Lesen: Informationen finden, Wichtiges erkennen, unbekannte Wörter klären", "2", ["werkstatt:w-lesedetektiv", "lesen:texte"], "ja"],
          ["sn.de12.le.10", "Nach dem Lesen: Überschrift finden, mit eigenen Worten wiedergeben, Schlussfolgerungen ziehen", "2", ["werkstatt:w-lesedetektiv", "lesen:texte"], "ja"]
        ],
        4: [ // Sich mit Texten und anderen Medien auseinandersetzen
          ["sn.de12.tm.01", "Gedichte, Bilderbücher, Erstlesebücher und Märchen kennenlernen", "1/2", ["werkstatt:w-maerchen", "werkstatt:w-reime", "deutsch:schloss"], "ja"],
          ["sn.de12.tm.02", "Sach- und Gebrauchstexte: informieren, anleiten, regeln", "2", ["werkstatt:w-sachtexte"], "ja"],
          ["sn.de12.tm.03", "Hörspiele, Hörbücher, Podcasts und Erklärvideos kennen", "2", ["werkstatt:w-medien"], "ja"],
          ["sn.de12.tm.04", "Bücher nach Interesse auswählen, über Lieblingsbücher sprechen", "2", ["werkstatt:w-medien"], "ja"],
          ["sn.de12.tm.05", "Die Bibliothek als Bezugsquelle nutzen", "2", ["werkstatt:w-medien", "echtewelt:bibliothek"], "aussen"],
          ["sn.de12.tm.06", "Vorlesen erleben, über Texte sprechen, Figuren verstehen", "1/2", ["werkstatt:w-maerchen", "deutsch:wald"], "ja"],
          ["sn.de12.tm.07", "Text, Bilder und Grafiken in Sachtexten verbinden", "2", ["werkstatt:w-sachtexte"], "ja"],
          ["sn.de12.tm.08", "Tablet und Computer bedienen: starten, beenden, tippen, Tastatur", "1", ["medien:bedienung", "werkstatt:w-glueckwunsch"], "ja"],
          ["sn.de12.tm.09", "Digitale Formate erproben, Chancen und Risiken", "1/2", ["medien:daten", "medien:fremde", "medien:werbung"], "ja"],
          ["sn.de12.tm.10", "Gedichte vortragen, sinngestaltend vorlesen, szenisch gestalten", "2", ["werkstatt:w-gedicht-vortragen", "werkstatt:w-lautlesen", "werkstatt:w-auswendig"], "ja"],
          ["sn.de12.tm.11", "Eigene Produkte in Text und Bild: Leporello, Faltbuch, Lapbook", "2", ["echtewelt:faltbuch"], "aussen"],
          ["sn.de12.tm.12", "Fachbegriffe: Autor/Autorin, Titel, Reim, Vers, Strophe, Zeile", "2", ["werkstatt:w-medien", "werkstatt:w-elfchen", "werkstatt:w-reime"], "ja"]
        ],
        5: [ // Sprache und Sprachgebrauch untersuchen
          ["sn.de12.su.01", "Wirkung von Bitten und Aufforderungen; Wortbedeutungen klären, Mehrdeutigkeit entdecken", "2", ["werkstatt:w-teekessel"], "ja"],
          ["sn.de12.su.02", "Mündlich und schriftlich vergleichen: Gespräch und Brief, Mimik und Satzzeichen", "2", ["werkstatt:w-sprachen"], "ja"],
          ["sn.de12.su.03", "Sprachliche Vielfalt: Dialekt, Hochdeutsch, Alltagssprache, Mehrsprachigkeit", "2", ["werkstatt:w-sprachen"], "ja"],
          ["sn.de12.su.04", "Verb: Tätigkeit, Grundform und Personalform, Zentrum des Satzes", "1/2", ["werkstatt:w-verben", "werkstatt:w-verbformen"], "ja"],
          ["sn.de12.su.05", "Nomen: Menschen, Tiere, Pflanzen, Dinge; mit Artikel, Einzahl und Mehrzahl", "1/2", ["werkstatt:w-wortarten", "deutsch:hof"], "ja"],
          ["sn.de12.su.06", "Artikel: bestimmt und unbestimmt, Begleiter des Nomens", "2", ["werkstatt:w-begleiter", "deutsch:hof"], "ja"],
          ["sn.de12.su.07", "Adjektiv: Eigenschaften, steht zwischen Artikel und Nomen", "2", ["werkstatt:w-adjektive", "werkstatt:w-begleiter"], "ja"],
          ["sn.de12.su.08", "Wortbildung: zusammengesetzte Nomen, Wortstamm und vorangestellte Wortbausteine", "2", ["werkstatt:w-wortbau", "werkstatt:w-vornach"], "ja"],
          ["sn.de12.su.09", "Wortschatz erweitern: Wortfamilien und Wortfelder", "2", ["werkstatt:w-wortbau"], "ja"],
          ["sn.de12.su.10", "Satzarten: Aussage-, Frage-, Aufforderungs- und Ausrufesatz; Klangprobe", "2", ["werkstatt:w-satzarten"], "ja"],
          ["sn.de12.su.11", "Wortgruppen und Treppensätze (Erweiterungsprobe)", "2", ["werkstatt:w-begleiter"], "ja"],
          ["sn.de12.su.12", "Fachbegriffe: Verb, Nomen, Artikel, Adjektiv, Einzahl, Mehrzahl, Grundform, Personalform, Satzarten", "2", ["werkstatt:w-verbformen", "werkstatt:w-satzarten", "werkstatt:w-wortarten"], "ja"]
        ]
      },
      "3": {
        1: [
          ["sn.de3.sz.01", "Zusammenhängend erzählen und über Alltagssituationen berichten", "3", ["werkstatt:w-bildergeschichte", "werkstatt:w-geschichte-ordnen", "werkstatt:w-bericht"], "ja"],
          ["sn.de3.sz.02", "Bildungs- und Fachsprache erwerben, passenden Wortschatz verwenden", "3", ["werkstatt:w-sprachvielfalt", "werkstatt:w-fachbegriffe"], "ja"],
          ["sn.de3.sz.03", "Rückmeldungen zu Redebeiträgen geben und erfragen, Kriterien vereinbaren", "3", ["werkstatt:w-rueckmeldung"], "ja"],
          ["sn.de3.sz.04", "Digitale Werkzeuge nutzen: Diktierfunktion", "3", ["werkstatt:w-digital-schreiben"], "ja"],
          ["sn.de3.sz.05", "Körpersprache, Pausen und Sprachmelodie bewusst einsetzen; Sprachvarietäten", "3", ["werkstatt:w-gedicht-vortragen", "werkstatt:w-theater", "werkstatt:w-sprachvielfalt"], "ja"],
          ["sn.de3.sz.06", "Gesprächsformen: Pro und Kontra, Sach-, Nachdenk- und Schreibgespräche, Mitbestimmung", "3", ["werkstatt:w-pro-kontra", "werkstatt:w-textlupe"], "ja"],
          ["sn.de3.sz.07", "Eigene Meinung finden und begründen, aktiv zuhören, an Gesagtes anknüpfen, Mehrheiten akzeptieren", "3", ["werkstatt:w-meinung", "werkstatt:w-pro-kontra", "werkstatt:w-rueckmeldung"], "ja"],
          ["sn.de3.sz.08", "Gesprächsregeln auch in Videogesprächen einhalten", "3", ["werkstatt:w-rueckmeldung"], "ja"],
          ["sn.de3.sz.09", "Vortragen: Gedicht, Buchvorstellung, eigene Beobachtungen, Rollen im szenischen Spiel", "3", ["werkstatt:w-gedicht-vortragen", "werkstatt:w-buch-finden", "werkstatt:w-theater"], "ja"],
          ["sn.de3.sz.10", "Präsentieren: Inhalte auswählen, Stichwortzettel, üben, auswendig lernen", "3", ["werkstatt:w-vortrag", "werkstatt:w-auswendig"], "ja"],
          ["sn.de3.sz.11", "Zielgerichtet zuhören: Aussage und Absicht erfassen, Zusatzinformationen beachten", "3", ["werkstatt:w-zuhoeren-profi"], "ja"],
          ["sn.de3.sz.12", "Nach dem Zuhören: gezielt nachfragen, wiedergeben, versteckte Informationen finden, Rätsel lösen", "3", ["werkstatt:w-zuhoeren-profi"], "ja"]
        ],
        2: [
          ["sn.de3.sc.01", "Individuelle Handschrift: automatisiert, leserlich, flüssig", "3", ["echtewelt:schreibschrift"], "aussen"],
          ["sn.de3.sc.02", "Seiten gestalten: Schriftgröße, Ränder, Absätze; über die eigene Schrift sprechen", "3", ["werkstatt:w-digital-schreiben"], "ja"],
          ["sn.de3.sc.03", "Doppelte Mitlaute, ck und tz", "3", ["werkstatt:w-kurz-lang"], "ja"],
          ["sn.de3.sc.04", "Silbentrennendes h, doppelte Selbstlaute (Merkwörter)", "3", ["werkstatt:w-merkwoerter3"], "ja"],
          ["sn.de3.sc.05", "Wortstamm bleibt gleich: verlängern und ableiten (packt – packen, stündlich – Stunde)", "3", ["werkstatt:w-ableiten", "werkstatt:w-verlaengern"], "ja"],
          ["sn.de3.sc.06", "Zusammensetzungen und Ableitungen (-ung, -heit, -bar) richtig schreiben", "3", ["werkstatt:w-vornach", "werkstatt:w-wortbau"], "ja"],
          ["sn.de3.sc.07", "Anredepronomen Sie und Ihnen großschreiben", "3", ["werkstatt:w-email", "werkstatt:w-brief"], "ja"],
          ["sn.de3.sc.08", "Großschreibung von Nomen in Wortgruppen erkennen (das laute Bellen, das Rot)", "3", ["werkstatt:w-nomen-erkennen"], "ja"],
          ["sn.de3.sc.09", "Komma, Doppelpunkt, Trennstrich am Zeilenende, Anführungszeichen der wörtlichen Rede", "3", ["werkstatt:w-komma", "werkstatt:w-trennen", "werkstatt:w-rede"], "ja"],
          ["sn.de3.sc.10", "Häufige Wörter und Funktionswörter routiniert richtig schreiben", "3", ["werkstatt:w-merkwoerter", "werkstatt:w-detektiv"], "ja"],
          ["sn.de3.sc.11", "Wörterbuch: nach zweitem und drittem Buchstaben suchen, Grundformen bilden, Wortteile nachschlagen", "3", ["werkstatt:w-woerterbuch"], "ja"],
          ["sn.de3.sc.12", "Adressatengerecht schreiben: E-Mail, Freundebuch, Klassenzeitung", "3", ["werkstatt:w-email", "werkstatt:w-brief"], "ja"],
          ["sn.de3.sc.13", "Texte planen: Schreibziel, Cluster, Gliederung, Satzanfänge, passende Wörter", "3", ["werkstatt:w-satzanfaenge", "werkstatt:w-geschichte-ordnen"], "ja"],
          ["sn.de3.sc.14", "Gedanken, Gefühle und Beobachtungen ausdrücken", "3", ["werkstatt:w-tagebuch"], "ja"],
          ["sn.de3.sc.15", "Beschreiben, erklären, anleiten: Orts- und Bildbeschreibung, Anleitung, Rezept, Lexikoneintrag", "3", ["werkstatt:w-anleitung"], "ja"],
          ["sn.de3.sc.16", "Bitten, wünschen, danken: Einladung, Glückwunsch, Brief", "3", ["werkstatt:w-brief", "werkstatt:w-einladung", "werkstatt:w-glueckwunsch"], "ja"],
          ["sn.de3.sc.17", "Digitale Texte gestalten: Schriftart, Größe, hervorheben, Absatz", "3", ["werkstatt:w-digital-schreiben"], "teil"],
          ["sn.de3.sc.18", "Kreativ und produktiv schreiben: nach Bildern, Musik, Fantasie; weiterschreiben, umschreiben, gemeinsam", "3", ["werkstatt:w-weiterschreiben", "werkstatt:w-bildergeschichte"], "ja"],
          ["sn.de3.sc.19", "Überarbeiten: stilistisch, grammatisch, orthografisch; Textlupe und Schreibkonferenz", "3", ["werkstatt:w-textlupe", "werkstatt:w-ueberarbeiten"], "ja"],
          ["sn.de3.sc.20", "Digitale Schreibwerkzeuge zum Überarbeiten (Rechtschreibprüfung)", "3", ["werkstatt:w-textlupe", "werkstatt:w-digital-schreiben"], "teil"],
          ["sn.de3.sc.21", "Fachbegriffe: nachgestellter Wortbaustein, Komma, Doppelpunkt, Anführungszeichen, Trennstrich", "3", ["werkstatt:w-trennen", "werkstatt:w-vornach", "werkstatt:w-rede"], "ja"]
        ],
        3: [
          ["sn.de3.le.01", "Flüssig, zügig und sinngestaltend lesen; Lautleseverfahren, Lesetheater", "3", ["werkstatt:w-lautlesen", "werkstatt:w-theater"], "teil"],
          ["sn.de3.le.02", "Vor dem Lesen: Leseziel, Vorwissen, Textsorte erkennen, Vermutungen", "3", ["werkstatt:w-lesen-fledermaus", "werkstatt:w-lesen-igel"], "ja"],
          ["sn.de3.le.03", "Beim Lesen: Schlüsselwörter markieren, Grafiken zuordnen, Unverstandenes nochmals lesen", "3", ["werkstatt:w-lesen-fledermaus"], "ja"],
          ["sn.de3.le.04", "Nach dem Lesen: Abschnitte gliedern, Wörter nachschlagen, Informationen finden, Schlussfolgerungen begründen", "3", ["werkstatt:w-lesen-fledermaus", "werkstatt:w-lesen-igel"], "ja"]
        ],
        4: [
          ["sn.de3.tm.01", "Literarische Texte: Witze, Erzählungen, Kinderromane, Fabeln, fantastische Geschichten, Krimis", "3", ["werkstatt:w-fabel", "werkstatt:w-textsorten"], "ja"],
          ["sn.de3.tm.02", "Sach- und Gebrauchstexte: Lexikonartikel, Spielanleitungen, Klassenregeln", "3", ["werkstatt:w-anleitung", "werkstatt:w-textsorten"], "ja"],
          ["sn.de3.tm.03", "Gestaltungsmittel in Bild und Ton (Hörspiel, Film)", "3", ["werkstatt:w-hoerspiel"], "ja"],
          ["sn.de3.tm.04", "Medien begründet auswählen; Bezugsquellen und Ordnung nach Themen und Autoren", "3", ["werkstatt:w-buch-finden"], "ja"],
          ["sn.de3.tm.05", "Lieblingsbücher vorstellen", "3", ["werkstatt:w-buch-finden", "werkstatt:w-buchtipp"], "ja"],
          ["sn.de3.tm.06", "Stellung nehmen zu Texten, Figuren und Handlung verstehen", "3", ["werkstatt:w-fabel", "werkstatt:w-maerchen"], "ja"],
          ["sn.de3.tm.07", "Informationen aus verschiedenen Medien vergleichen, Stichwortzettel", "3", ["werkstatt:w-lesen-vergleich", "werkstatt:w-vortrag"], "ja"],
          ["sn.de3.tm.08", "Kindersuchmaschinen und Suchstrategien, Chancen und Risiken", "3", ["werkstatt:w-medien4", "sachkunde:medien-info"], "ja"],
          ["sn.de3.tm.09", "Websites und Apps kritisch prüfen, eigenes Nutzungsverhalten bedenken", "3", ["werkstatt:w-medien4", "medien:pflege"], "ja"],
          ["sn.de3.tm.10", "Szenisches Gestalten: Lesetheater, Aufführung", "3", ["werkstatt:w-theater"], "ja"],
          ["sn.de3.tm.11", "Fachbegriffe: Handlung, Figur, Erzähler, Sprecher, Illustration, Kapitel, Inhaltsverzeichnis", "3", ["werkstatt:w-buch-finden", "werkstatt:w-hoerspiel"], "ja"]
        ],
        5: [
          ["sn.de3.su.01", "Gesagtes und Gemeintes, Lügen, Witze mit sprachlicher Pointe", "3", ["werkstatt:w-gemeint", "werkstatt:w-fabel"], "ja"],
          ["sn.de3.su.02", "Sprichwörter, Redensarten, Namen und besondere Wörter erforschen", "3", ["werkstatt:w-gemeint"], "ja"],
          ["sn.de3.su.03", "Telefonat und digitale Kommunikation: Kurz- und Sprachnachricht, Chat, Emojis – kritisch", "3", ["werkstatt:w-email", "medien:fremde"], "ja"],
          ["sn.de3.su.04", "Sprachliche Vielfalt: Dialekt, Gebärdensprache, Umgangssprache, Herkunfts- und Fremdsprachen", "3", ["werkstatt:w-sprachvielfalt"], "ja"],
          ["sn.de3.su.05", "Verb: Präsens und Präteritum; Prädikat, ein- und zweiteilig", "3", ["werkstatt:w-praeteritum", "werkstatt:w-proben"], "ja"],
          ["sn.de3.su.06", "Nomen für Gefühle und Nichtgegenständliches", "3", ["werkstatt:w-tagebuch", "werkstatt:w-nomen-erkennen"], "ja"],
          ["sn.de3.su.07", "Weitere Artikelwörter: mein, dieses", "3", ["werkstatt:w-nomen-erkennen"], "ja"],
          ["sn.de3.su.08", "Adjektiv: Grund-, Mehr- und Meiststufe, Vergleich mit als und wie", "3", ["werkstatt:w-steigerung"], "ja"],
          ["sn.de3.su.09", "Personalpronomen als Stellvertreter", "3", ["werkstatt:w-pronomen", "werkstatt:w-proben"], "ja"],
          ["sn.de3.su.10", "Wörter für Zeitstufen: heute, gestern, damals, gerade", "3", ["werkstatt:w-praeteritum"], "ja"],
          ["sn.de3.su.11", "Wortstamm, Oberbegriffe, Assoziationen, Teekesselwörter", "3", ["werkstatt:w-ableiten", "werkstatt:w-nomen-erkennen", "werkstatt:w-teekessel"], "ja"],
          ["sn.de3.su.12", "Satzglieder: Subjekt und Prädikat", "3", ["werkstatt:w-satzglieder"], "ja"],
          ["sn.de3.su.13", "Wörtliche Rede mit vorangestelltem Begleitsatz", "3", ["werkstatt:w-rede"], "ja"],
          ["sn.de3.su.14", "Ersatz-, Umstell- und Weglassprobe", "3", ["werkstatt:w-proben"], "ja"],
          ["sn.de3.su.15", "Fachbegriffe: Präsens, Präteritum, Subjekt, Prädikat, Pronomen, Steigerungsstufen, Satzglied, Begleitsatz", "3", ["werkstatt:w-proben", "werkstatt:w-satzglieder", "werkstatt:w-steigerung"], "ja"]
        ]
      },
      "4": {
        1: [
          ["sn.de4.sz.01", "Appellieren und argumentieren, verständlich und nachvollziehbar", "4", ["werkstatt:w-ueberzeugen", "werkstatt:w-meinung"], "ja"],
          ["sn.de4.sz.02", "Bildungs- und Fachsprache, umfangreicher Wortschatz", "4", ["werkstatt:w-fachbegriffe", "werkstatt:w-sprachvielfalt"], "ja"],
          ["sn.de4.sz.03", "Rückmeldungen zu Redebeiträgen geben (Reflexionsgespräch)", "4", ["werkstatt:w-rueckmeldung"], "ja"],
          ["sn.de4.sz.04", "Dialoge und Regieanweisungen gestalten", "4", ["werkstatt:w-theater"], "ja"],
          ["sn.de4.sz.05", "Gesprächsformen: Interview, Diskussion, Streitschlichtung", "4", ["werkstatt:w-interview", "werkstatt:w-pro-kontra"], "ja"],
          ["sn.de4.sz.06", "Diskriminierende Sprache erkennen, digitale Gesprächsregeln, andere Meinungen akzeptieren", "4", ["werkstatt:w-fair"], "ja"],
          ["sn.de4.sz.07", "Präsentieren mit Plakat, Tafel oder digital; Inhalte auswählen und ordnen", "4", ["werkstatt:w-vortrag"], "ja"],
          ["sn.de4.sz.08", "Gestaltend vortragen: szenische Lesung, Improvisation, Hörspiel", "4", ["werkstatt:w-theater", "werkstatt:w-hoerspiel"], "ja"],
          ["sn.de4.sz.09", "Verstehend zuhören: Aufmerksamkeit fokussieren, Aussage, Absicht und Aufbau erfassen, beurteilen, eigene Fragen", "4", ["werkstatt:w-zuhoeren-profi", "werkstatt:w-interview"], "ja"]
        ],
        2: [
          ["sn.de4.sc.01", "Individuelle, flüssige und leserliche Handschrift im angemessenen Tempo", "4", ["echtewelt:schreibschrift"], "aussen"],
          ["sn.de4.sc.02", "Rechtschreibregeln auf Wort- und Satzebene sicher, Bindestrich", "4", ["werkstatt:w-rechtschreib4"], "ja"],
          ["sn.de4.sc.03", "Rechtschreibstrategien beherrschen, eigene Fehleraufmerksamkeit", "4", ["werkstatt:w-rechtschreib4", "werkstatt:w-detektiv"], "ja"],
          ["sn.de4.sc.04", "Merkwörter mit Dehnungs-h", "4", ["werkstatt:w-dehnung"], "ja"],
          ["sn.de4.sc.05", "Rechtschreibwörterbuch und digitale Rechtschreibhilfen nutzen", "4", ["werkstatt:w-woerterbuch", "werkstatt:w-textlupe"], "ja"],
          ["sn.de4.sc.06", "Texte planen: Textfunktion, Adressat, Textsorte, Gliederung", "4", ["werkstatt:w-bericht", "werkstatt:w-vortrag"], "ja"],
          ["sn.de4.sc.07", "Eine Meinung schriftlich begründen: Buch-, Spiel- oder Filmtipp", "4", ["werkstatt:w-buchtipp", "werkstatt:w-ueberzeugen"], "ja"],
          ["sn.de4.sc.08", "Kreativ, produktiv und gemeinsam schreiben, analog und digital", "4", ["werkstatt:w-weiterschreiben", "werkstatt:w-ergaenzungen"], "ja"],
          ["sn.de4.sc.09", "Eigene und fremde Texte nach Kriterien der Textsorte überarbeiten", "4", ["werkstatt:w-textlupe", "werkstatt:w-bericht"], "ja"],
          ["sn.de4.sc.10", "Fachbegriffe: Vokal, Konsonant, Bindestrich", "4", ["werkstatt:w-rechtschreib4"], "ja"]
        ],
        3: [
          ["sn.de4.le.01", "Selbstbestimmt lesen; Laut- und Vielleseverfahren", "4", ["werkstatt:w-lautlesen", "lesen:texte"], "teil"],
          ["sn.de4.le.02", "Vor dem Lesen: Erwartungen formulieren, Textsorte klären", "4", ["werkstatt:w-lesen4", "werkstatt:w-lesestrategien"], "ja"],
          ["sn.de4.le.03", "Beim Lesen: Wichtiges markieren, Bild und Ton in digitalen Texten, Hyperlinks", "4", ["werkstatt:w-lesen4"], "ja"],
          ["sn.de4.le.04", "Textverstehen prüfen, Sinnabschnitte erfassen", "4", ["werkstatt:w-lesen4", "werkstatt:w-lesen-vergleich"], "ja"],
          ["sn.de4.le.05", "Nach dem Lesen: zentrale Aussagen wiedergeben, kurz zusammenfassen, eigene Fragen stellen", "4", ["werkstatt:w-lesen4"], "ja"],
          ["sn.de4.le.06", "Sprachliche Mittel bewerten, wertende Einschätzungen abgeben", "4", ["werkstatt:w-sage-comic", "werkstatt:w-buchtipp"], "ja"]
        ],
        4: [
          ["sn.de4.tm.01", "Literarische Texte: Comic, Sage, Schwank", "4", ["werkstatt:w-sage-comic"], "ja"],
          ["sn.de4.tm.02", "Sach- und Gebrauchstexte in verschiedenen Medien", "4", ["werkstatt:w-lesen-vergleich", "werkstatt:w-lesen4"], "ja"],
          ["sn.de4.tm.03", "Eigene Lese- und Medienerfahrungen beschreiben (Medientagebuch)", "4", ["werkstatt:w-medien4"], "ja"],
          ["sn.de4.tm.04", "Informationen auf Glaubwürdigkeit prüfen, Fake News", "4", ["werkstatt:w-medien4", "medien:freundlich"], "ja"],
          ["sn.de4.tm.05", "Deutungen mit Textstellen belegen, Fassungen vergleichen, Bezüge zwischen Texten", "4", ["werkstatt:w-sage-comic"], "ja"],
          ["sn.de4.tm.06", "Weitere Kinderbücher kennen, themenbezogen auswählen", "4", ["werkstatt:w-buchtipp", "werkstatt:w-buch-finden"], "ja"],
          ["sn.de4.tm.07", "Digitale Werkzeuge für Präsentationen, Podcasts und Wikis nutzen", "4", ["werkstatt:w-hoerspiel", "werkstatt:w-vortrag"], "teil"],
          ["sn.de4.tm.08", "Datenschutz, Schutz der eigenen Identität, Persönlichkeits- und Urheberrechte", "4", ["werkstatt:w-medien4", "medien:daten"], "ja"],
          ["sn.de4.tm.09", "Selbstgewählte Texte vortragen, szenisch darstellen, kurze Texte auswendig", "4", ["werkstatt:w-gedicht-vortragen", "werkstatt:w-theater", "werkstatt:w-auswendig"], "ja"],
          ["sn.de4.tm.10", "Fachbegriffe: Absatz, Dialog", "4", ["werkstatt:w-theater", "werkstatt:w-lesen4"], "ja"]
        ],
        5: [
          ["sn.de4.su.01", "Überzeugen: Sprache in Werbung und Politik, bildhafte Vergleiche, Übertreibungen", "4", ["werkstatt:w-ueberzeugen", "medien:werbung"], "ja"],
          ["sn.de4.su.02", "Höflichkeitsformen und Beziehungsebene beachten", "4", ["werkstatt:w-ueberzeugen", "werkstatt:w-email"], "ja"],
          ["sn.de4.su.03", "Perspektiven untersuchen, in den Rollen Sprecher und Hörer handeln", "4", ["werkstatt:w-interview", "werkstatt:w-weiterschreiben"], "ja"],
          ["sn.de4.su.04", "Sprachliche Vielfalt: Anglizismen", "4", ["werkstatt:w-sprachvielfalt"], "ja"],
          ["sn.de4.su.05", "Bekannte Wortarten sicher bestimmen", "4", ["werkstatt:w-fachbegriffe", "werkstatt:w-wortarten"], "ja"],
          ["sn.de4.su.06", "Verb: Perfekt und Futur, Hilfsverben", "4", ["werkstatt:w-perfekt"], "ja"],
          ["sn.de4.su.07", "Nomen verändern sich im Satz (Fälle)", "4", ["werkstatt:w-faelle"], "ja"],
          ["sn.de4.su.08", "Wörter für Zeitstufen: bald, morgen, nächstes Jahr", "4", ["werkstatt:w-perfekt"], "ja"],
          ["sn.de4.su.09", "Wortbildung und Wortschatzerweiterung sicher anwenden", "4", ["werkstatt:w-vornach", "werkstatt:w-wortbau"], "ja"],
          ["sn.de4.su.10", "Ergänzungen: Sätze um Satzglieder erweitern", "4", ["werkstatt:w-ergaenzungen"], "ja"],
          ["sn.de4.su.11", "Kreativ mit Sprache: Sprachspiele, Würfelsätze", "4", ["werkstatt:w-ergaenzungen"], "ja"],
          ["sn.de4.su.12", "Fachbegriffe: Singular, Plural, Perfekt, Futur, Ergänzung", "4", ["werkstatt:w-ergaenzungen", "werkstatt:w-perfekt"], "ja"]
        ]
      }
    },
    mathe: {
      "1/2": {
        1: [ // Raum und Form
          ["sn.ma12.rf.01", "Rechts und links am eigenen Körper unterscheiden", "1", ["mathe:k1rechtslinks", "mathe:k1lage", "mathe:lage", "echtewelt:rechtslinks"], "ja"],
          ["sn.ma12.rf.02", "Lage zwischen Dingen beschreiben: oben, unten, über, unter, links, rechts, neben, zwischen", "1/2", ["mathe:k1lage", "mathe:lage"], "ja"],
          ["sn.ma12.rf.03", "Vorn, hinten, vor, hinter im Raum", "1/2", ["mathe:k1vornhinten", "mathe:wuerfelbau2"], "ja"],
          ["sn.ma12.rf.04", "Würfelgebäude frei und nach Bauplan bauen, eigene Baupläne finden", "2", ["mathe:bauplaene", "mathe:wuerfelbau2", "echtewelt:bauplan"], "ja"],
          ["sn.ma12.rf.05", "Wege nach Beschreibung gehen, sichtbare Wege und Wege aus der Vorstellung beschreiben", "2", ["mathe:wege"], "ja"],
          ["sn.ma12.rf.06", "Linie, Punkt, Gerade, Strahl und Strecke unterscheiden", "2", ["mathe:linien"], "ja"],
          ["sn.ma12.rf.07", "Linien und Figuren zeichnen – frei, mit Lineal, Schablone und Geodreieck", "1/2", ["echtewelt:lineal"], "aussen"],
          ["sn.ma12.rf.08", "Parallel, senkrecht, schneiden sich, rechter Winkel (Faltwinkel)", "2", ["mathe:linien"], "ja"],
          ["sn.ma12.rf.09", "Ebene Figuren erkennen, benennen und vergleichen: Dreieck, Viereck, Rechteck, Quadrat, Vieleck, Kreis", "1/2", ["mathe:k1formen", "mathe:formen", "mathe:figuren"], "ja"],
          ["sn.ma12.rf.10", "Ebene Figuren zeichnen, auch Kreise mit dem Zirkel", "2", ["echtewelt:zirkel"], "aussen"],
          ["sn.ma12.rf.11", "Kreis: Mittelpunkt, Radius und Durchmesser (doppelt so lang)", "2", ["mathe:figuren"], "ja"],
          ["sn.ma12.rf.12", "Geometrische Muster erkennen und fortsetzen", "1/2", ["mathe:k1muster", "mathe:spiegeln2"], "ja"],
          ["sn.ma12.rf.13", "Figuren auslegen und nachlegen (z. B. Tangram)", "1/2", ["mathe:k1legen"], "ja"],
          ["sn.ma12.rf.14", "Körper Würfel, Quader, Kugel erkennen und vergleichen: Ecken, Kanten, Flächen, rund, eckig", "1/2", ["mathe:k1formen", "mathe:formen", "mathe:figuren"], "ja"],
          ["sn.ma12.rf.15", "Spiegelungen und Symmetrie entdecken, Symmetrieachsen erkennen, spiegelbildlich ergänzen", "2", ["mathe:spiegeln2"], "ja"]
        ],
        2: [ // Zahl und Operation
          ["sn.ma12.zo.01", "Zahlen bis 100 lesen, sprechen und schreiben – mit Ziffern und als Zahlwort", "1/2", ["mathe:k1zahlen20", "mathe:zahlen100"], "ja"],
          ["sn.ma12.zo.02", "Zahlen als Anzahl und als Platz in einer Reihe verstehen", "1", ["mathe:k1zaehlen", "mathe:k1zahlen20", "mathe:zahlen100"], "ja"],
          ["sn.ma12.zo.03", "Mengen schnell und strukturiert erfassen, ordnen, vergleichen und zerlegen (Zwanziger- und Hunderterfeld)", "1/2", ["mathe:k1wuerfel", "mathe:k1zwanzig", "mathe:k1zerlegen", "mathe:zahlen100"], "ja"],
          ["sn.ma12.zo.04", "Vorwärts, rückwärts und in Schritten zählen; Vorgänger, Nachfolger, Nachbarzehner", "1/2", ["mathe:k1nachbar", "mathe:k1zahlen20", "mathe:zahlen100"], "ja"],
          ["sn.ma12.zo.05", "Zahlen vergleichen und ordnen (<, >, =), gerade und ungerade Zahlen", "1/2", ["mathe:k1vergleich", "mathe:vergleich", "mathe:gerade"], "ja"],
          ["sn.ma12.zo.06", "Das Doppelte und die Hälfte", "1/2", ["mathe:k1doppelt", "mathe:doppelt"], "ja"],
          ["sn.ma12.zo.07", "Bündeln, Stellenwerte Hunderter, Zehner, Einer, Bedeutung der Null", "2", ["mathe:zehner", "mathe:zahlen100"], "ja"],
          ["sn.ma12.zo.08", "Zwischen Handlung, Bild, Sprache, Zeichen und Sachsituation wechseln", "1/2", ["mathe:darstellungen", "mathe:zahlen100", "mathe:detektiv"], "ja"],
          ["sn.ma12.zo.09", "Plus und Minus verstehen: hinzufügen, vereinigen, wegnehmen, ergänzen, Unterschied", "1", ["mathe:k1plus10", "mathe:k1minus10", "mathe:k1plus20", "mathe:ergaenzen", "mathe:detektiv"], "ja"],
          ["sn.ma12.zo.10", "Grundaufgaben plus und minus bis 20 sicher können", "1", ["mathe:k1plus20", "mathe:plus20", "mathe:minus20"], "ja"],
          ["sn.ma12.zo.11", "Plus und Minus bis 100 mit Strategien: schrittweise, Tausch-, Umkehr-, Nachbaraufgaben, gleich- und gegensinnig verändern", "2", ["mathe:plus100", "mathe:minus100", "mathe:plusUeber", "mathe:minusUeber", "mathe:rechentricks"], "ja"],
          ["sn.ma12.zo.12", "Lösungswege vergleichen, begründen und mit der Umkehraufgabe prüfen", "2", ["mathe:rechenwege", "mathe:rechentricks"], "ja"],
          ["sn.ma12.zo.13", "Platzhalter, Gleichungen und Ungleichungen", "1/2", ["mathe:k1plus20", "mathe:k1vergleich", "mathe:ergaenzen", "mathe:zahlenmauer"], "ja"],
          ["sn.ma12.zo.14", "Zahlenfolgen und Formate wie Zahlenmauern, Zauberquadrate, Entdeckerpäckchen", "1/2", ["mathe:rechenwege", "mathe:zahlenmauer"], "ja"],
          ["sn.ma12.zo.15", "Mal und geteilt verstehen: vervielfachen, verteilen, aufteilen, Punktefelder", "2", ["mathe:mal1", "mathe:geteilt", "mathe:detektiv"], "ja"],
          ["sn.ma12.zo.16", "Alle Mal- und Geteiltaufgaben bis 100 mit Strategien (Kern-, Tausch-, Umkehr-, Nachbaraufgaben, Quadratzahlen)", "2", ["mathe:mal2", "mathe:mal3", "mathe:rechentricks", "mathe:quadratzahlen"], "ja"],
          ["sn.ma12.zo.17", "Kernaufgaben mit 2, 5 und 10 sicher können", "2", ["mathe:mal1"], "ja"],
          ["sn.ma12.zo.18", "Fachbegriffe: Summe, Summand, Differenz, Minuend, Subtrahend, Produkt, Faktor, Quotient …", "2", ["mathe:matheworte"], "ja"],
          ["sn.ma12.zo.19", "Sachaufgaben: Fragen stellen, fehlende oder zu viele Angaben erkennen, passende Rechnung finden, Menge und Preis", "2", ["mathe:sachaufgaben", "mathe:detektiv"], "ja"],
          ["sn.ma12.zo.20", "Rechengeschichten zu Aufgaben erfinden und aufschreiben", "2", ["werkstatt:w-rechengeschichten", "mathe:detektiv"], "ja"],
          ["sn.ma12.zo.21", "Muster und Strategien in Spielen beschreiben (Nim-Spiel, Würfelspiele)", "2", ["mathe:strategie", "mathe:detektiv"], "ja"]
        ],
        3: [ // Größen und Messen
          ["sn.ma12.gm.01", "Geld: Euro und Cent erfassen, vergleichen, ordnen, auch mit Komma", "1/2", ["mathe:k1geld", "mathe:geld", "mathe:euro"], "ja"],
          ["sn.ma12.gm.02", "Geld: Preise kennen (Stützpunkte), wechseln, umrechnen", "2", ["mathe:euro"], "ja"],
          ["sn.ma12.gm.03", "Geld: einfache Sachaufgaben", "2", ["mathe:euro", "mathe:sachaufgaben"], "ja"],
          ["sn.ma12.gm.04", "Länge: direkt vergleichen; mm, cm, dm, m mit einer und zwei Einheiten und mit Komma", "1/2", ["mathe:k1messen", "mathe:laenge", "mathe:massband"], "ja"],
          ["sn.ma12.gm.05", "Längen am Lineal ablesen und messen", "2", ["mathe:laenge"], "ja"],
          ["sn.ma12.gm.11", "Mit Lineal und Maßband selbst messen", "2", ["echtewelt:messen"], "aussen"],
          ["sn.ma12.gm.06", "Längen: Stützpunkte, schätzen, umrechnen, Sachaufgaben", "2", ["mathe:laenge", "mathe:massband"], "ja"],
          ["sn.ma12.gm.07", "Uhren und Kalender als Zeitmesser", "1/2", ["mathe:k1zeit", "mathe:uhr", "mathe:kalender"], "ja"],
          ["sn.ma12.gm.08", "Zeitspannen: Minuten, Stunden, Tag, Woche, Monat, Jahr; halbe und Viertelstunde", "2", ["mathe:kalender", "mathe:zeitspanne"], "ja"],
          ["sn.ma12.gm.09", "Uhrzeit auf 5 Minuten genau lesen, Datum am Kalender", "2", ["mathe:uhr", "mathe:zeitspanne"], "ja"],
          ["sn.ma12.gm.10", "Zeitspannen schätzen, umrechnen, Sachaufgaben (volle Stunden, innerhalb einer Stunde)", "2", ["mathe:zeitspanne"], "ja"]
        ],
        4: [ // Daten und Zufall
          ["sn.ma12.dz.01", "Strichlisten führen und auswerten", "1/2", ["mathe:tabelle2", "mathe:k1daten", "mathe:daten", "mathe:tabelle"], "ja"],
          ["sn.ma12.dz.02", "Tabellen anlegen und ausfüllen, Fachbegriffe Zeile, Spalte", "2", ["mathe:tabelle2", "mathe:tabelle"], "ja"],
          ["sn.ma12.dz.07", "Eine eigene Umfrage durchführen", "1/2", ["echtewelt:umfrage"], "aussen"],
          ["sn.ma12.dz.03", "Säulen- und Balkendiagramm anlegen", "2", ["mathe:tabelle"], "ja"],
          ["sn.ma12.dz.04", "Werte aus Tabellen und Schaubildern ablesen und vergleichen", "1/2", ["mathe:daten", "mathe:tabelle"], "ja"],
          ["sn.ma12.dz.05", "Kombinationen finden und darstellen", "2", ["mathe:kombinieren2"], "ja"],
          ["sn.ma12.dz.06", "Einfache Zufallsexperimente: sicher, möglich, unmöglich", "2", ["mathe:zufall"], "ja"]
        ]
      },
      "3": {
        1: [ // Raum und Form
          ["sn.ma3.rf.01", "Lagebeziehungen und Wege aus verschiedenen Blickwinkeln beschreiben, Pläne und Ansichten nutzen", "3", ["mathe:k3plaene", "mathe:k3ansicht", "mathe:wege"], "ja"],
          ["sn.ma3.rf.02", "Würfelgebäude nach Bauplan und umgekehrt, verändern, zum Quader ergänzen, Würfel zählen", "3", ["mathe:k3wuerfelbau", "mathe:k3ansicht", "echtewelt:bauplan"], "ja"],
          ["sn.ma3.rf.03", "Parallele, senkrechte und sich schneidende Geraden millimetergenau zeichnen", "3", ["echtewelt:lineal"], "aussen"],
          ["sn.ma3.rf.04", "Parallelogramm und weitere Drei- und Vierecke erkennen, beschreiben, ergänzen", "3", ["mathe:k3vierecke"], "ja"],
          ["sn.ma3.rf.05", "Flächen vergleichen, zerlegen, auslegen, auszählen und schätzen; Umfang bestimmen", "3", ["mathe:k3umfang", "mathe:k3flaeche", "mathe:k4flaeche"], "ja"],
          ["sn.ma3.rf.06", "Pyramide, Kegel, Zylinder erkennen, vergleichen, aus verschiedenen Blickwinkeln erkennen", "3", ["mathe:k3koerper"], "ja"],
          ["sn.ma3.rf.07", "Würfel- und Quadernetze herstellen, prüfen, beschreiben", "3", ["mathe:k3netze", "mathe:k3netz"], "ja"],
          ["sn.ma3.rf.08", "Bandornamente fortsetzen; Achsen-, Schiebe- und Drehsymmetrie nutzen", "3", ["mathe:k3ornament", "mathe:k3spiegel"], "ja"]
        ],
        2: [ // Zahl und Operation
          ["sn.ma3.zo.01", "Zahlen bis 1000 lesen, sprechen, schreiben, als Zahlwort", "3", ["mathe:k3stellen", "mathe:k3zahlen1000"], "ja"],
          ["sn.ma3.zo.02", "Zahlen bis 1000 bilden, zerlegen, in Schritten zählen, vergleichen, Nachbarzehner und -hunderter, Doppeltes und Hälfte", "3", ["mathe:k3zahlen1000"], "ja"],
          ["sn.ma3.zo.03", "Runden", "3", ["mathe:k3runden"], "ja"],
          ["sn.ma3.zo.04", "Stellenwerte Tausender, Hunderter, Zehner, Einer; Bündeln, Bedeutung der Null", "3", ["mathe:k3stellen", "mathe:k3zahlen1000"], "ja"],
          ["sn.ma3.zo.05", "Plus und Minus bis 1000 mit Strategien, Rechenwege vergleichen, Umkehrprobe", "3", ["mathe:k3plus", "mathe:k3minus", "mathe:k3vorteil"], "ja"],
          ["sn.ma3.zo.06", "Zahlenfolgen untersuchen, Zahlenmauern mit Zielzahl, Zahlenketten, Rechendreiecke", "3", ["mathe:k3muster"], "ja"],
          ["sn.ma3.zo.07", "Schriftliche Addition mit bis zu drei Summanden", "3", ["mathe:k3schriftplus", "mathe:k4plusviele"], "ja"],
          ["sn.ma3.zo.08", "Schriftliche Subtraktion", "3", ["mathe:k3schriftminus"], "ja"],
          ["sn.ma3.zo.09", "Mal und geteilt bis 1000: Vielfache von 10, Nachbaraufgaben, gleich-/gegensinnig verändern, Zerlegen", "3", ["mathe:k3malgeteilt", "mathe:k3sach"], "ja"],
          ["sn.ma3.zo.10", "Teilbarkeit, Division mit Rest, Teilbarkeitsregeln 2, 3, 5, 9, 10, 100, Quersumme", "3", ["mathe:k3rest", "mathe:k4teilbar", "mathe:k3muster"], "ja"],
          ["sn.ma3.zo.11", "Bruchteile bilden: Hälfte, Viertel, drei Viertel von …", "3", ["mathe:k3bruch"], "ja"],
          ["sn.ma3.zo.12", "Einmaleins automatisiert", "3", ["mathe:mal2", "mathe:mal3"], "ja"],
          ["sn.ma3.zo.13", "Rechenvorteile und Rechenfehler finden, Punkt vor Strich", "3", ["mathe:k3vorteil", "mathe:k4geschickt"], "ja"],
          ["sn.ma3.zo.14", "Schriftliche Multiplikation (dreistellig mal einstellig)", "3", ["mathe:k4malschrift"], "ja"],
          ["sn.ma3.zo.15", "Überschlag und Umkehrprobe bei schriftlichen Verfahren", "3", ["mathe:k3vorteil", "mathe:k4runden"], "ja"],
          ["sn.ma3.zo.16", "Sachaufgaben: Lösungsansätze, Tabellen, Skizzen, Vermutungen, Ergebnisse prüfen", "3", ["mathe:k3skizze", "mathe:k3sach", "mathe:k3geld"], "ja"],
          ["sn.ma3.zo.17", "Zahlenspiele, Denk- und Legespiele, Lösungsstrategien beschreiben", "3", ["mathe:k3knobeln", "mathe:detektiv"], "ja"]
        ],
        3: [ // Größen und Messen
          ["sn.ma3.gm.01", "Geld: Sachaufgaben, Tabellen und Diagramme", "3", ["mathe:k3geld"], "ja"],
          ["sn.ma3.gm.02", "Länge: Kilometer, zwei Einheiten, Komma, ½ cm/m/km, Stützpunkt 1 km, umrechnen, Sachaufgaben", "3", ["mathe:k3laenge", "mathe:k3groessen"], "ja"],
          ["sn.ma3.gm.03", "Zeit: Sekunde, minutengenau, ¼ h, ½ h, ¾ h, umrechnen, Sachaufgaben", "3", ["mathe:k3zeit", "mathe:k3groessen"], "ja"],
          ["sn.ma3.gm.04", "Masse: Gramm und Kilogramm, zwei Einheiten, ½ kg, Stützpunkte, schätzen, umrechnen", "3", ["mathe:k3gewicht", "mathe:k3groessen"], "ja"],
          ["sn.ma3.gm.05", "Messen mit Messrad, Waage und verschiedenen Uhren", "3", ["echtewelt:backen", "echtewelt:messen"], "aussen"]
        ],
        4: [ // Daten und Zufall
          ["sn.ma3.dz.01", "Säulen- und Balkendiagramme anfertigen", "3", ["mathe:k3diagramm", "mathe:tabelle"], "ja"],
          ["sn.ma3.dz.02", "Fragen an Daten stellen, Werte aus einem Fahrplan entnehmen", "3", ["mathe:k3daten", "mathe:k3diagramm"], "ja"],
          ["sn.ma3.dz.03", "Kombinieren mit Strategien (Gegenpaare, Tachometer-Prinzip), alle Möglichkeiten finden", "3", ["mathe:k3kombi", "mathe:k3daten"], "ja"],
          ["sn.ma3.dz.04", "Zufallsexperimente: vermuten, prüfen, nach Wahrscheinlichkeit ordnen", "3", ["mathe:k3zufall", "mathe:k3daten"], "ja"]
        ]
      },
      "4": {
        1: [ // Raum und Form
          ["sn.ma4.rf.01", "Wegeskizzen lesen, Wege vergleichen, Entfernungen schätzen", "4", ["mathe:k4wegeskizze", "mathe:k4massstab"], "ja"],
          ["sn.ma4.rf.13", "Eine eigene Wegeskizze zeichnen", "4", ["echtewelt:wegskizze"], "aussen"],
          ["sn.ma4.rf.02", "Schrägbilder aus verschiedenen Blickwinkeln lesen (verdeckte Teile, Ansichten)", "4", ["mathe:k4schraegbild", "mathe:k3ansicht"], "ja"],
          ["sn.ma4.rf.03", "Trapez erkennen, beschreiben, zeichnen, ergänzen", "4", ["mathe:k4vierecke"], "ja"],
          ["sn.ma4.rf.04", "Vierecke ordnen und einteilen (Haus der Vierecke, Drachen, Raute)", "4", ["mathe:k4vierecke"], "ja"],
          ["sn.ma4.rf.05", "Kreise, Dreiecke und Vierecke in Mustern genau zeichnen", "4", ["echtewelt:zirkel"], "aussen"],
          ["sn.ma4.rf.06", "Dreiecke mit und ohne rechten Winkel unterscheiden", "4", ["mathe:k4vierecke"], "ja"],
          ["sn.ma4.rf.07", "Figuren vergrößern und verkleinern", "4", ["mathe:k4vergroessern"], "ja"],
          ["sn.ma4.rf.08", "Flächeninhalt mit Einheitsquadraten, Umfang messen und berechnen, cm² und m², Stützpunkte, schätzen", "4", ["mathe:k4flaeche", "mathe:k4volumen"], "ja"],
          ["sn.ma4.rf.09", "Körper als Schrägbild skizzieren", "4", [], "aussen"],
          ["sn.ma4.rf.10", "Volumen über Einheitswürfel in Quadern bestimmen", "4", ["mathe:k4volumen"], "ja"],
          ["sn.ma4.rf.11", "Körpernetze zuordnen und vergleichen", "4", ["mathe:k3netze", "mathe:k3netz"], "ja"],
          ["sn.ma4.rf.12", "Parkettierungen; Achsen-, Schiebe- und Drehsymmetrie beschreiben", "4", ["mathe:k4parkett"], "ja"]
        ],
        2: [ // Zahl und Operation
          ["sn.ma4.zo.01", "Zahlen bis 1 Million und darüber lesen, schreiben, darstellen", "4", ["mathe:k4million"], "ja"],
          ["sn.ma4.zo.02", "Zahlbeziehungen bis 1 Million: zerlegen, in Schritten zählen, vergleichen, Nachbarzahlen, runden", "4", ["mathe:k4million", "mathe:k4runden"], "ja"],
          ["sn.ma4.zo.03", "Stellenwertsystem erweitern, Stellen verändern, Bedeutung der Null", "4", ["mathe:k4million"], "ja"],
          ["sn.ma4.zo.04", "Adam Ries: Rechnen auf den Linien, römische Zahlzeichen, Leben und Wirken", "4", ["mathe:k4rechenbrett", "mathe:k4roemisch", "mathe:k4rechenmeister"], "ja"],
          ["sn.ma4.zo.05", "Rechengesetze und Rechenvorteile, Rechenfehler finden und korrigieren", "4", ["mathe:k4geschickt", "mathe:k5klammer", "mathe:k4rechenmeister"], "ja"],
          ["sn.ma4.zo.06", "Schriftlich addieren (bis drei Summanden) und subtrahieren (bis zwei Subtrahenden)", "4", ["mathe:k4plusviele", "mathe:k4rechenmeister"], "ja"],
          ["sn.ma4.zo.07", "Schriftliche Multiplikation mit bis zu dreistelligem zweiten Faktor", "4", ["mathe:k4malschrift", "mathe:k4malmehr"], "ja"],
          ["sn.ma4.zo.08", "Schriftliche Division (einstelliger Divisor), Teilbarkeit 4 und 6, Primzahlen, Überschlag", "4", ["mathe:k4geteilt", "mathe:k4teilbar", "mathe:k4primzahl", "mathe:k4runden"], "ja"],
          ["sn.ma4.zo.09", "Zahlenmuster in geometrischen Mustern erkennen (figurierte Zahlen)", "4", ["mathe:k4rechenmeister"], "ja"],
          ["sn.ma4.zo.10", "Funktionale Beziehungen: Maßstab, Menge und Preis, Tabellen", "4", ["mathe:k4massstab", "mathe:k4reise"], "ja"]
        ],
        3: [ // Größen und Messen
          ["sn.ma4.gm.01", "Geld, Länge und Zeit in größeren Sachsituationen (Reiseplanung, Preistafeln, Fahrpläne, Wanderkarten)", "4", ["mathe:k4reise", "mathe:k4zeit"], "ja"],
          ["sn.ma4.gm.02", "Bruchteile ¼, ½, ¾ von Größen", "4", ["mathe:k4reise", "mathe:k4tonne"], "ja"],
          ["sn.ma4.gm.03", "Masse: Tonne, zwei Einheiten, Komma, Stützpunkte, schätzen, umrechnen, Sachaufgaben", "4", ["mathe:k4tonne"], "ja"],
          ["sn.ma4.gm.04", "Volumen: Liter und Milliliter, Komma, messen, Stützpunkte, schätzen, umrechnen", "4", ["mathe:k4liter"], "ja"]
        ],
        4: [ // Daten und Zufall
          ["sn.ma4.dz.01", "Daten selbst erheben, auswerten und dokumentieren (Umfragen)", "4", ["echtewelt:umfrage"], "aussen"],
          ["sn.ma4.dz.02", "Balken- und gestapelte Säulendiagramme lesen und erstellen, Achsen", "4", ["mathe:k4diagramme", "mathe:k3diagramm"], "ja"],
          ["sn.ma4.dz.03", "Fragen über den Datensatz hinaus, fehlende Informationen erkennen", "4", ["mathe:k4diagramme"], "ja"],
          ["sn.ma4.dz.04", "Alle Möglichkeiten mit Multiplikation, Baumdiagramm und Tabelle finden (z. B. zwei Würfel)", "4", ["mathe:k4diagramme"], "ja"],
          ["sn.ma4.dz.05", "Wahrscheinlichkeiten vergleichen und ordnen, gleich wahrscheinlich", "4", ["mathe:k4chance", "mathe:k4diagramme"], "ja"]
        ]
      }
    }
  };
  // Übergang in Klasse 5 (Mathe): VORLÄUFIG – der Lehrplantext Kl. 5 (Oberschule/Gymnasium) liegt noch nicht vor. Grundlage: was der
  // Grundschul-Lehrplan Kl. 4 als Basis legt, und die üblichen Startthemen der 5. Klasse (beide Schularten). Kein Lernbereich des
  // Grundschul-Profils – wird nur für Kinder in der Stufe „Übergang 5“ im Elternbereich gezeigt.
  P.uebergang = { stand: "vorläufig – ohne Lehrplantext Klasse 5", mathe: [
    ["sn.ue5.ma.01", "Schriftlich rechnen in allen vier Grundrechenarten sicher, mit Überschlag (Basis aus Kl. 4)", "5", ["mathe:k5fit", "mathe:k4malmehr", "mathe:k4geteilt"], "ja"],
    ["sn.ue5.ma.02", "Große Zahlen bis zur Milliarde, Zehnerpotenzen, runden", "5", ["mathe:k5grosszahl", "mathe:k4million"], "ja"],
    ["sn.ue5.ma.03", "Teiler, Vielfache, Primzahlen, Primfaktorzerlegung, größter gemeinsamer Teiler, kleinstes gemeinsames Vielfaches", "5", ["mathe:k5teiler", "mathe:k4primzahl"], "ja"],
    ["sn.ue5.ma.04", "Terme mit Klammern, Punkt vor Strich, Rechengesetze, Variable und einfache Gleichungen", "5", ["mathe:k5klammer", "mathe:k5terme"], "ja"],
    ["sn.ue5.ma.05", "Brüche: Bruchteile darstellen, von Mengen bestimmen, vergleichen", "5", ["mathe:k5bruchbild", "mathe:k5bruchvon", "mathe:k5bruchvergleich"], "ja"],
    ["sn.ue5.ma.06", "Kommazahlen bei Größen", "5", ["mathe:k5komma", "mathe:k5groessen"], "ja"],
    ["sn.ue5.ma.07", "Koordinatensystem", "5", ["mathe:k5koordinaten"], "ja"],
    ["sn.ue5.ma.08", "Winkelarten, Winkelgröße in Grad schätzen und messen", "5", ["mathe:k5winkel", "mathe:k5geometrie"], "teil"],
    ["sn.ue5.ma.09", "Symmetrieachsen, Abstand Punkt–Gerade", "5", ["mathe:k5geometrie"], "ja"],
    ["sn.ue5.ma.10", "Flächeninhalt und Umfang von Rechteck und Quadrat berechnen, Flächeneinheiten umrechnen", "5", ["mathe:k5raum", "mathe:k4flaeche"], "ja"],
    ["sn.ue5.ma.11", "Volumen und Oberfläche von Quader und Würfel", "5", ["mathe:k5raum", "mathe:k4volumen"], "ja"],
    ["sn.ue5.ma.12", "Genau zeichnen mit Geodreieck und Zirkel", "5", ["echtewelt:lineal", "echtewelt:zirkel"], "aussen"],
    ["sn.ue5.ma.13", "Größen über mehrere Einheiten umrechnen, Maßstab", "5", ["mathe:k5groessen", "mathe:k4massstab"], "ja"],
    ["sn.ue5.ma.14", "Sachaufgaben in mehreren Schritten", "5", ["mathe:k5sach"], "ja"],
    ["sn.ue5.ma.15", "Daten auswerten: Mittelwert, Diagramme", "5", ["mathe:k5mittel", "mathe:k4diagramme"], "ja"]
  ].map(([id, text, kl, app, abdeckung]) => ({ id, text, kl, app, abdeckung })) };
  Object.entries(PUNKTE).forEach(([fach, stufen]) => Object.entries(stufen).forEach(([st, lbs]) => Object.entries(lbs).forEach(([nr, liste]) => {
    const lb = (((P.faecher[fach] || {}).stufen || {})[st] || []).find(x => x.nr === +nr);
    if (lb) lb.punkte = liste.map(([id, text, kl, app, abdeckung]) => ({ id, text, kl, app, abdeckung }));
  })));
})();
