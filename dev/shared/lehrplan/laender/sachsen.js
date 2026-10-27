// Länderprofil Sachsen (NA-03b): Lernbereiche der sächsischen Grundschul-Lehrpläne mit Verweisen auf den Lehrplan-Kern (lz).
// Überführt aus dem früheren shared/lehrplan.js; window.LEHRPLAN baut daraus weiterhin dieselbe Struktur (Kompatibilität).
// app-Einträge: "mathe:<station>", "deutsch:<kapitel>", "sachkunde:<thema>", "medien:alle", "wort:tag", "sachkunde:alle", "deutsch:alle"
// abdeckung: "ja" | "teil" | "nein" – ehrliche Einschätzung von Hand; daneben errechnet shared/lehrplan.js die Abdeckung aus den lz.
// abweichungen: stufe = andere Stufe als im Kern, extra = Zusatz-Ziele nur in Sachsen, quelle = Fundstelle.
// Quellen: Sächsisches Staatsministerium für Kultus, Lehrpläne Grundschule (schulportal.sachsen.de/lplandb):
//   Mathematik Fassung 2025 (gültig ab 1.8.2025), Deutsch und Sachunterricht Fassung 2019.
(window.LehrplanLaender = window.LehrplanLaender || {}).sn = Object.assign({
  name: "Sachsen",
  faecher: {
    mathe: {
      name: "Mathematik", stand: "Lehrplan 2025, gültig ab 1.8.2025",
      stufen: {
        "1/2": [
          { nr: 1, lz: ["ma.rf.02", "ma.rf.03", "ma.rf.04", "ma.rf.05", "ma.rf.06"], titel: "Raum und Form", kmk: "Raum und Form", inhalte: ["Lagebeziehungen, Wege, Würfelgebäude", "Punkt, Gerade, Strecke, parallel, senkrecht", "Dreieck, Viereck, Rechteck, Quadrat, Kreis", "Würfel, Quader, Kugel", "Achsensymmetrie, Muster"], app: ["mathe:formen"], abdeckung: "teil", hinweis: "Formen, Ecken und Körper ja; Lagebeziehungen, Symmetrie und Würfelgebäude fehlen noch." },
          { nr: 2, lz: ["ma.zo.01", "ma.zo.02", "ma.zo.03", "ma.zo.04", "ma.zo.05", "ma.zo.06", "ma.zo.07", "ma.zo.08", "ma.zo.09", "ma.zo.10", "ma.zo.18"], titel: "Zahl und Operation", kmk: "Zahl und Operation", inhalte: ["Zahlen bis 100, Stellenwerttafel (E, Z, H)", "Vergleichen, Ordnen, Vorgänger/Nachfolger, gerade/ungerade", "Plus und Minus bis 100 mit Strategien", "Mal und Geteilt: Kernaufgaben 2, 5, 10, Quadratzahlen, Tausch- und Umkehraufgaben", "Sachaufgaben"],
            app: ["mathe:plus20", "mathe:minus20", "mathe:zehner", "mathe:vergleich", "mathe:gerade", "mathe:plus100", "mathe:minus100", "mathe:doppelt", "mathe:ergaenzen", "mathe:sachaufgaben", "mathe:mal1", "mathe:geteilt"], abdeckung: "ja",
            hinweis: "Quadratzahlen fehlen noch." },
          { nr: 3, lz: ["ma.gm.02", "ma.gm.03", "ma.gm.04", "ma.gm.05", "ma.gm.06", "ma.gm.07"], titel: "Größen und Messen", kmk: "Größen und Messen", inhalte: ["Geld: Euro und Cent", "Länge: mm, cm, dm, m, messen", "Zeit: Minute, Stunde, Tag, Woche, Monat, Jahr, Uhr, Kalender"], app: ["mathe:geld", "mathe:laenge", "mathe:uhr", "mathe:kalender"], abdeckung: "ja" },
          { nr: 4, lz: ["ma.dz.02", "ma.dz.03", "ma.dz.04", "ma.dz.05"], titel: "Daten und Zufall", kmk: "Daten und Zufall", inhalte: ["Strichlisten, Tabellen, Säulen- und Balkendiagramme", "Einfache Kombinationen", "Zufall: sicher, möglich, unmöglich"], app: ["mathe:daten", "mathe:zufall"], abdeckung: "ja", hinweis: "Einfache Kombinationen fehlen noch." }
        ],
        "3": [
          { nr: 1, lz: ["ma.rf.06", "ma.rf.07", "ma.rf.08"], titel: "Raum und Form", kmk: "Raum und Form", inhalte: ["Würfelgebäude und Baupläne", "Parallel und senkrecht zeichnen", "Parallelogramm, Flächeninhalt und Umfang vergleichen", "Pyramide, Kegel, Zylinder, Würfel- und Quadernetze", "Achsen-, Schiebe- und Drehsymmetrie"], app: ["mathe:k3netz", "mathe:k3spiegel", "mathe:k3flaeche", "mathe:k3wuerfelbau"], abdeckung: "teil", hinweis: "Würfelnetze, Achsensymmetrie, Flächen vergleichen und Würfelgebäude mit Bauplan ja; Zeichnen, Parallelogramm und Schiebe-/Drehsymmetrie fehlen." },
          { nr: 2, lz: ["ma.zo.11", "ma.zo.12", "ma.zo.13", "ma.zo.14", "ma.zo.16"], titel: "Zahl und Operation", kmk: "Zahl und Operation", inhalte: ["Zahlen bis 1 000, Runden", "Schriftliche Addition und Subtraktion", "Einmaleins (Kernaufgaben und Ableitungen), Division mit Rest", "Teilbarkeitsregeln, Quersumme", "Bruchteile ½, ¼, ¾", "Schriftliche Multiplikation (einstelliger Faktor), Überschlag"],
            app: ["mathe:mal2", "mathe:mal3", "mathe:k3stellen", "mathe:k3runden", "mathe:k3plus", "mathe:k3minus", "mathe:k3rest", "mathe:k3bruch", "mathe:k3schriftplus", "mathe:k3schriftminus"], abdeckung: "teil", hinweis: "Einmaleins, Zahlen bis 1000, Runden, Plus/Minus bis 1000, schriftliche Addition und Subtraktion, Teilen mit Rest, Hälfte/Viertel; Teilbarkeit und schriftliche Multiplikation fehlen." },
          { nr: 3, lz: ["ma.gm.04", "ma.gm.08"], titel: "Größen und Messen", kmk: "Größen und Messen", inhalte: ["Geld in Sachsituationen", "Kilometer", "Sekunde, Viertelstunde, Zeitspannen", "Gramm und Kilogramm"], app: ["mathe:k3gewicht", "mathe:k3zeit", "mathe:k3laenge", "mathe:k3geld"], abdeckung: "ja", hinweis: "Geld in Sachaufgaben, Gramm/Kilogramm, Kilometer und Zeitspannen." },
          { nr: 4, lz: ["ma.dz.05", "ma.dz.06", "ma.dz.07"], titel: "Daten und Zufall", kmk: "Daten und Zufall", inhalte: ["Diagramme anfertigen und lesen", "Kombinatorik", "Zufallsexperimente, Wahrscheinlichkeitsstreifen"], app: ["mathe:k3kombi", "mathe:k3diagramm", "mathe:k3zufall"], abdeckung: "ja", hinweis: "Kombinieren, Säulendiagramme (lesen, aus Strichliste anlegen) und Zufall am Glücksrad (sicher, möglich, unmöglich)." }
        ],
        "4": [
          { nr: 1, lz: ["ma.rf.07", "ma.rf.09"], titel: "Raum und Form", kmk: "Raum und Form", inhalte: ["Wegeskizzen, Schrägbilder", "Vierecke ordnen (Trapez, Raute, Drachen)", "Flächeninhalt (cm², m²), Umfang, Volumen mit Einheitswürfeln", "Körpernetze, Parkettierungen"], app: ["mathe:k4flaeche", "mathe:k3netz"], abdeckung: "teil", hinweis: "Flächeninhalt und Umfang in Kästchen, Würfelnetze; Schrägbilder, Vierecke, Volumen fehlen." },
          { nr: 2, lz: ["ma.zo.15", "ma.zo.16", "ma.zo.17"], titel: "Zahl und Operation", kmk: "Zahl und Operation", inhalte: ["Zahlen bis 1 000 000, römische Zahlen, Adam Ries", "Rechengesetze, Klammerregel", "Schriftliche Addition, Subtraktion, Multiplikation", "Einblick schriftliche Division", "Primzahlen, Teilbarkeit, Runden, Überschlag", "Einfache Maßstäbe"], app: ["mathe:k4million", "mathe:k4runden", "mathe:k4malschrift", "mathe:k4geteilt", "mathe:k4teilbar", "mathe:k4geschickt", "mathe:k4roemisch", "mathe:k4primzahl", "mathe:k4massstab", "mathe:k4plusviele"], abdeckung: "ja", hinweis: "Zahlen bis 1 Million, römische Zahlen, Runden/Überschlag, schriftlich plus (mehrere Zahlen), mal und geteilt (einstellig), Teilbarkeit, Primzahlen, Rechengesetze, Maßstab; Klammerregel und Adam Ries fehlen." },
          { nr: 3, lz: ["ma.gm.09"], titel: "Größen und Messen", kmk: "Größen und Messen", inhalte: ["(Details aus dem Lehrplan nachtragen)"], app: ["mathe:k4liter", "mathe:k4zeit"], abdeckung: "teil", hinweis: "Liter und Milliliter umrechnen und schätzen; Zeitspannen über Mittag, Stunden in Minuten, Datum im Kalender." },
          { nr: 4, lz: ["ma.dz.06", "ma.dz.07"], titel: "Daten und Zufall", kmk: "Daten und Zufall", inhalte: ["(Details aus dem Lehrplan nachtragen)"], app: ["mathe:k3diagramm", "mathe:k4chance"], abdeckung: "teil", hinweis: "Diagramme und Gewinnchancen vergleichen." }
        ]
      }
    },
    deutsch: {
      name: "Deutsch", stand: "Lehrplan 2019",
      stufen: {
        "1/2": [
          { nr: 1, lz: ["de.le.02", "de.le.03", "de.le.04", "de.su.02", "de.sc.02", "de.sc.03"], titel: "Schriftspracherwerb", kmk: "Lesen – mit Texten und Medien umgehen", inhalte: ["Laute und Buchstaben, Silben", "Wörter, Sätze und Texte sinnverstehend lesen", "Druckschrift, Schulausgangsschrift"], app: ["deutsch:alle", "werkstatt:w-silben"], abdeckung: "teil", hinweis: "Lesen von Wörtern und Sätzen und Silben ja; Laute und Schreiben mit der Hand fehlen." },
          { nr: 2, lz: ["de.sz.02", "de.sz.03", "de.sz.04"], titel: "Sprechen und Zuhören", kmk: "Sprechen und Zuhören", inhalte: ["Erzählen, Nacherzählen", "Zuhören, Gesprächsregeln", "Grüßen, Bitten, Danken"], app: ["deutsch:alle"], abdeckung: "teil", hinweis: "Zuhören über Vorlesen; eigenes Sprechen fehlt (geplant: sich aufnehmen)." },
          { nr: 3, lz: ["de.sc.06"], titel: "Für sich und andere schreiben", kmk: "Schreiben", inhalte: ["Erlebtes und Erdachtes schreiben", "Einladung, Glückwunsch, Brief", "Texte überarbeiten"], app: ["werkstatt:w-brief", "werkstatt:w-geschichte-ordnen"], abdeckung: "teil", hinweis: "Aufbau von Brief und Einladung (ordnen, Anrede, Gruß) und Geschichten ordnen ja; eigene Texte frei schreiben fehlt." },
          { nr: 4, lz: ["de.sc.04", "de.sc.05"], titel: "Richtig schreiben", kmk: "Schreiben", inhalte: ["Selbst-, Mit-, Zwielaute, Umlaute, Auslautverhärtung", "Großschreibung, Satzschlusszeichen", "Wortbausteine, Klassenwortschatz", "Alphabet, Wörterbuch"], app: ["wort:tag", "werkstatt:w-verlaengern", "werkstatt:w-woerterbuch"], abdeckung: "teil", hinweis: "Verlängern (d/t, g/k, b/p), Großschreibung von Nomen und Ordnen nach dem ABC ja; Umlaute, Zwielaute, Satzzeichen fehlen." },
          { nr: 5, lz: ["de.le.05", "de.tm.02", "de.tm.03"], titel: "Lesen/Mit Medien umgehen", kmk: "Lesen – mit Texten und Medien umgehen", inhalte: ["Lesesicherheit", "Märchen, Gedichte, Sachtexte", "Informationen finden"], app: ["deutsch:alle", "sachkunde:alle"], abdeckung: "teil", hinweis: "Kurze Texte ja; längere Lesetexte mit Fragen fehlen." },
          { nr: 6, lz: ["de.su.03", "de.su.04", "de.su.05", "de.su.06", "de.su.07", "de.su.08"], titel: "Sprache untersuchen", kmk: "Sprache und Sprachgebrauch untersuchen", inhalte: ["Verb, Substantiv, Artikel, Adjektiv", "Wortfamilien, zusammengesetzte Substantive", "Satzarten, Umstellprobe"], app: ["deutsch:alle", "wort:tag", "werkstatt:w-verben", "werkstatt:w-adjektive", "werkstatt:w-wortarten"], abdeckung: "ja", hinweis: "Wortfamilien und zusammengesetzte Nomen fehlen noch." },
          { nr: 7, lz: ["me.ph.01", "me.sa.01", "me.sa.02", "me.sv.01"], titel: "Mit digitalen Medien umgehen", kmk: "Lesen – mit Texten und Medien umgehen", inhalte: ["Bedienung", "Kindersuchmaschinen, Lernprogramme", "Chancen, Risiken, Verhaltensregeln"], app: ["medien:alle"], abdeckung: "ja" }
        ],
        "3": [
          { nr: 1, lz: ["de.sz.06"], titel: "Sprechen und Zuhören", kmk: "Sprechen und Zuhören", inhalte: ["Erzählen, Beschreiben", "Gespräche, Pro und Kontra"], app: ["werkstatt:w-meinung"], abdeckung: "teil", hinweis: "Meinung mit weil begründen; Erzählen und Beschreiben fehlen." },
          { nr: 2, lz: ["de.sc.07"], titel: "Für sich und andere schreiben", kmk: "Schreiben", inhalte: ["Erzählen und Beschreiben schreiben", "Stichwortzettel", "Texte überarbeiten, E-Mail"], app: ["werkstatt:w-geschichte-ordnen", "werkstatt:w-satzanfaenge", "werkstatt:w-brief", "werkstatt:w-vortrag"], abdeckung: "teil", hinweis: "Geschichten planen und ordnen, Satzanfänge überarbeiten, Brief, Stichwortzettel ja; eigene Texte frei schreiben und E-Mail fehlen." },
          { nr: 3, lz: ["de.sc.08"], titel: "Richtig schreiben", kmk: "Schreiben", inhalte: ["Lange und kurze Vokale, Dehnungs-h, ck/tz, ss/ß", "Wörtliche Rede, Komma bei Aufzählung"], app: ["werkstatt:w-kurz-lang", "werkstatt:w-dehnung", "werkstatt:w-rede", "werkstatt:w-ableiten", "werkstatt:w-komma"], abdeckung: "ja", hinweis: "ck/tz, ss/ß, Dehnungs-h, wörtliche Rede, Ableiten ä/äu, Komma bei Aufzählung." },
          { nr: 4, lz: ["de.tm.04", "de.le.06"], titel: "Lesen/Mit Medien umgehen", kmk: "Lesen – mit Texten und Medien umgehen", inhalte: ["Erzählung, Märchen, Gedicht, Fabel", "Sachtexte, Informationen erschließen"], app: ["sachkunde:alle", "werkstatt:w-textsorten", "werkstatt:w-lesen-igel"], abdeckung: "ja", hinweis: "Märchen, Fabel, Gedicht, Sachtext unterscheiden; Sachtext mit Fragen; Sachthemen bei Eule Ella." },
          { nr: 5, lz: ["de.su.09", "de.su.10"], titel: "Sprache untersuchen", kmk: "Sprache und Sprachgebrauch untersuchen", inhalte: ["Präsens, Präteritum", "Steigerung von Adjektiven, Personalpronomen", "Vor- und Nachsilben", "Subjekt, Prädikat"], app: ["werkstatt:w-praeteritum", "werkstatt:w-satzglieder", "werkstatt:w-steigerung", "werkstatt:w-pronomen", "werkstatt:w-vornach"], abdeckung: "ja", hinweis: "Präsens/Präteritum, Steigerung, Personalpronomen, Vor-/Nachsilben, Subjekt und Prädikat." },
          { nr: 6, lz: ["me.sv.01", "me.sa.01"], titel: "Mit digitalen Medien umgehen", kmk: "Lesen – mit Texten und Medien umgehen", inhalte: ["Texte speichern und wiederfinden", "Suchstrategien, Schutz persönlicher Daten"], app: ["medien:alle"], abdeckung: "teil" }
        ],
        "4": [
          { nr: 1, lz: ["de.sz.07"], titel: "Sprechen und Zuhören", kmk: "Sprechen und Zuhören", inhalte: ["Spannend erzählen", "Streit schlichten", "Medienabsichten erkennen"], app: ["werkstatt:w-vortrag"], abdeckung: "teil", hinweis: "Vortrag vorbereiten (Stichwortzettel, Tipps fürs Vortragen) ja; Streit schlichten, Medienabsichten und eigenes Sprechen fehlen." },
          { nr: 2, lz: ["de.sc.07", "de.sc.09"], titel: "Für sich und andere schreiben", kmk: "Schreiben", inhalte: ["Texte planen, schreiben, überarbeiten", "Notizen, Merktexte"], app: ["werkstatt:w-bericht", "werkstatt:w-geschichte-ordnen", "werkstatt:w-satzanfaenge", "werkstatt:w-vortrag"], abdeckung: "teil", hinweis: "Bericht mit W-Fragen, Texte planen und überarbeiten (ordnen, Wörter ersetzen), Stichwortzettel ja; freies Schreiben fehlt." },
          { nr: 3, lz: ["de.sc.09"], titel: "Richtig schreiben", kmk: "Schreiben", inhalte: ["Rechtschreibregeln anwenden", "Wörterbuch nutzen"], app: ["werkstatt:w-woerterbuch", "werkstatt:w-kurz-lang", "werkstatt:w-dehnung", "werkstatt:w-ableiten"], abdeckung: "teil", hinweis: "ABC-Ordnung und Grundform zum Nachschlagen, Rechtschreibregeln aus Kl. 3 ja; Nachschlagen im echten Wörterbuch und Fehler im eigenen Text finden fehlen." },
          { nr: 4, lz: ["de.tm.04", "de.tm.05"], titel: "Lesen/Mit Medien umgehen", kmk: "Lesen – mit Texten und Medien umgehen", inhalte: ["Fabel, Märchen, Gedicht unterscheiden", "auch herkunftssprachliche Texte", "eigene Medienbeiträge"], app: ["werkstatt:w-textsorten", "werkstatt:w-lesen-vergleich"], abdeckung: "teil", hinweis: "Textsorten und zwei Sachtexte vergleichen ja; herkunftssprachliche Texte und eigene Medienbeiträge fehlen." },
          { nr: 5, lz: ["de.su.11", "de.su.12"], titel: "Sprache untersuchen", kmk: "Sprache und Sprachgebrauch untersuchen", inhalte: ["Perfekt und Futur", "Substantiv im Satz, Subjekt", "Satzglieder, Ergänzungen"], app: ["werkstatt:w-perfekt", "werkstatt:w-satzzeichen", "werkstatt:w-faelle"], abdeckung: "teil", hinweis: "Perfekt/Futur, Satzarten, Fälle mit wer/wen/wem ja; Ergänzungen und Satzglieder umstellen fehlen." },
          { nr: 6, lz: ["me.sv.01", "me.ar.02", "me.sa.01"], titel: "Mit digitalen Medien umgehen", kmk: "Lesen – mit Texten und Medien umgehen", inhalte: ["Formatieren", "Informationen beschaffen und bewerten", "Datenschutz, Urheberrecht"], app: ["medien:alle"], abdeckung: "teil" }
        ]
      }
    },
    sachkunde: {
      name: "Sachunterricht", stand: "Lehrplan 2019",
      stufen: {
        "1/2": [
          { nr: 1, lz: ["su.so.02", "su.so.03"], titel: "Zusammen leben und lernen", inhalte: ["Rituale, Tagesrhythmus", "Regeln, Konflikte lösen", "Informieren in Medien"], app: ["sachkunde:familie", "sachkunde:regeln"], abdeckung: "ja", hinweis: "Familie, Regeln und Streit lösen; Rituale fehlen noch." },
          { nr: 2, lz: ["su.na.02"], titel: "Mein Körper und meine Gesundheit", inhalte: ["Hygiene, Zähne, Bewegung", "Gesunde Ernährung, Trinken", "Erste Hilfe, Unfälle vermeiden"], app: ["sachkunde:gesundheit"], abdeckung: "ja", hinweis: "Thema „Gesund und munter“; dazu Trink- und Bewegungserinnerungen." },
          { nr: 3, lz: ["su.na.03", "su.na.05", "su.na.06"], titel: "Begegnungen mit Pflanzen und Tieren", inhalte: ["Jahreszeiten, Vogelzug", "Laub- und Nadelbäume", "Frühblüher, Keimen und Wachsen", "Vögel, Haustiere und ihre Pflege"], app: ["sachkunde:baeume-voegel", "sachkunde:pflanzen"], abdeckung: "ja", hinweis: "Bäume, Vögel, Frühblüher und Keimen; Haustierpflege spielerisch mit dem eigenen Tier." },
          { nr: 4, lz: ["su.na.04"], titel: "Phänomene der unbelebten Natur", inhalte: ["Licht und Schatten", "Luft, Wind, Schall", "Wetter beobachten, Temperatur", "Wasser: lösen, trennen, schützen"], app: ["sachkunde:wasser"], abdeckung: "teil", hinweis: "Wasser (Eis, Dampf, Kreislauf, sparen) und echtes Wetter auf der Insel; Licht, Luft, Schall fehlen." },
          { nr: 5, lz: ["su.ge.02", "su.hi.02"], titel: "Raum und Zeit", inhalte: ["Schule und Heimatort, Ortsplan", "Tag, Woche, Jahr, Uhr, Kalender", "Schulweg und Verkehr"], app: ["mathe:uhr", "mathe:kalender", "sachkunde:schulweg"], abdeckung: "teil", hinweis: "Uhr, Kalender und Schulweg ja; Ortsplan fehlt." },
          { nr: 6, lz: ["su.hi.03"], titel: "Durch unsere ersten Schuljahre", inhalte: ["Portfolio, Zeitleiste", "Steckbriefe zu Lieblingstieren"], app: ["sachkunde:frueher"], abdeckung: "teil", hinweis: "„Früher und heute“ mit eigener Lebensgeschichte; Portfolio fehlt." }
        ],
        "3": [
          { nr: 1, lz: ["su.so.04", "su.hi.03"], titel: "Zusammen leben und lernen", inhalte: ["Menschen anderer Kulturen, kulturelle Verschiedenheit", "Leben auf dem Land früher und heute", "Medien als Informationsquelle"], app: ["sachkunde:geschenkebringer"], abdeckung: "teil", hinweis: "Feste in verschiedenen Kulturen (Weihnachten/Neujahr)." },
          { nr: 2, lz: ["su.na.02"], titel: "Mein Körper und meine Gesundheit", inhalte: ["Sinnesorgane", "Gefahren durch Drogen, Gruppendruck"], app: ["sachkunde:sinne"], abdeckung: "teil", hinweis: "Fünf Sinne ja; Drogen und Gruppendruck fehlen." },
          { nr: 3, lz: ["su.na.08"], titel: "Pflanzen und Tiere", inhalte: ["Getreide und Kartoffel, vom Korn zum Brot", "Lebensraum Wiese"], app: ["sachkunde:wald", "sachkunde:brot"], abdeckung: "ja", hinweis: "Lebensraum Wiese (mit Wald), vom Korn zum Brot, Kartoffel." },
          { nr: 4, lz: ["su.na.04", "su.na.07"], titel: "Unbelebte Natur", inhalte: ["Wetterberichte, Wetterkarten", "Wasser: fest, flüssig, gasförmig, Wasserkreislauf", "Schwimmen und Sinken"], app: ["sachkunde:wasser", "sachkunde:schwimmen", "sachkunde:wetterkarte"], abdeckung: "ja", hinweis: "Wasserkreislauf, Schwimmen/Sinken, Wetterkarte." },
          { nr: 5, lz: ["su.ge.02", "su.ge.03"], titel: "Raum und Zeit", inhalte: ["Himmelsrichtungen, Kompass", "Der eigene Landkreis", "Mit dem Fahrrad im Verkehr"], app: ["sachkunde:kompass", "sachkunde:fahrrad"], abdeckung: "teil", hinweis: "Himmelsrichtungen, Kompass und sicheres Fahrrad ja; der eigene Landkreis fehlt." },
          { nr: 6, lz: [], titel: "Experimentieren", inhalte: ["Ein Experiment planen, durchführen, auswerten"], app: [], abdeckung: "nein" }
        ],
        "4": [
          { nr: 1, lz: ["su.so.06", "su.hi.04", "me.sa.01"], titel: "Zusammen leben und lernen", inhalte: ["Schule früher, Kinderrechte", "Medien: Nutzen, Gefahren, Datenschutz, Urheberrecht", "Stadt früher und heute"], app: ["medien:alle", "sachkunde:kinderrechte"], abdeckung: "teil", hinweis: "Medien und Kinderrechte ja; Schule und Stadt früher fehlen." },
          { nr: 2, lz: ["su.na.02"], titel: "Mein Körper und meine Gesundheit", inhalte: ["Pubertät", "Atmung und Herzschlag", "Sucht und Vorbeugung"], app: [], abdeckung: "nein" },
          { nr: 3, lz: ["su.na.08"], titel: "Pflanzen und Tiere", inhalte: ["Wald als Lebensgemeinschaft", "Säugetiere", "Boden und Kompost", "Gewässer, Umweltschutz"], app: ["sachkunde:wald"], abdeckung: "teil", hinweis: "Stockwerke des Waldes, Nahrungskette, Laub wird Erde; Säugetiere und Gewässer fehlen." },
          { nr: 4, lz: ["su.na.09"], titel: "Unbelebte Natur", inhalte: ["Feuer und Brandschutz", "Wärmeleitung und Dämmung"], app: ["sachkunde:feuer", "sachkunde:strom"], abdeckung: "teil", hinweis: "Feuer und Brandschutz, Strom (Stromkreis, Leiter, Sicherheit) ja; Wärmeleitung fehlt." },
          { nr: 5, lz: ["su.ge.04", "su.hi.04", "su.hi.sn01"], titel: "Raum und Zeit", inhalte: ["Karte von Sachsen, Maßstab", "Dresden", "Sorbische Kultur", "Radfahrprüfung"], app: [], abdeckung: "nein" },
          { nr: 6, lz: ["me.pp.01", "me.sv.01"], titel: "Medien – Informationen beschaffen", inhalte: ["Präsentation erstellen", "Quellen, Urheberrecht, Datenschutz"], app: [], abdeckung: "nein" }
        ]
      }
    }
  }
}, {
  code: "sn", schluessel: "sachsen",
  abweichungen: {
    stufe: { "ma.dz.05": "2" },
    extra: [["su.hi.sn01", "4", "Sorbische Kultur kennenlernen"]],
    quelle: {
      "ma.dz.05": "Mathematik 2025, Kl. 1/2, Lernbereich Daten und Zufall (einfache Kombinationen)",
      "ma.zo.11": "Mathematik 2025: vollständiges Einmaleins erst in Kl. 3",
      "su.hi.sn01": "Sachunterricht 2019, Kl. 4, Lernbereich Raum und Zeit"
    }
  }
});
