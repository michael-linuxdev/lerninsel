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
          { nr: 2, lz: ["ma.zo.02", "ma.zo.03", "ma.zo.04", "ma.zo.05", "ma.zo.06", "ma.zo.07", "ma.zo.08", "ma.zo.09", "ma.zo.10", "ma.zo.18"], titel: "Zahl und Operation", kmk: "Zahl und Operation", inhalte: ["Zahlen bis 100, Stellenwerttafel (E, Z, H)", "Vergleichen, Ordnen, Vorgänger/Nachfolger, gerade/ungerade", "Plus und Minus bis 100 mit Strategien", "Mal und Geteilt: Kernaufgaben 2, 5, 10, Quadratzahlen, Tausch- und Umkehraufgaben", "Sachaufgaben"],
            app: ["mathe:plus20", "mathe:minus20", "mathe:zehner", "mathe:vergleich", "mathe:gerade", "mathe:plus100", "mathe:minus100", "mathe:doppelt", "mathe:ergaenzen", "mathe:sachaufgaben", "mathe:mal1", "mathe:geteilt"], abdeckung: "ja",
            hinweis: "Quadratzahlen fehlen noch." },
          { nr: 3, lz: ["ma.gm.02", "ma.gm.03", "ma.gm.04", "ma.gm.05", "ma.gm.06", "ma.gm.07"], titel: "Größen und Messen", kmk: "Größen und Messen", inhalte: ["Geld: Euro und Cent", "Länge: mm, cm, dm, m, messen", "Zeit: Minute, Stunde, Tag, Woche, Monat, Jahr, Uhr, Kalender"], app: ["mathe:geld", "mathe:laenge", "mathe:uhr", "mathe:kalender"], abdeckung: "ja" },
          { nr: 4, lz: ["ma.dz.02", "ma.dz.03", "ma.dz.04", "ma.dz.05"], titel: "Daten und Zufall", kmk: "Daten und Zufall", inhalte: ["Strichlisten, Tabellen, Säulen- und Balkendiagramme", "Einfache Kombinationen", "Zufall: sicher, möglich, unmöglich"], app: ["mathe:daten", "mathe:zufall"], abdeckung: "ja", hinweis: "Einfache Kombinationen fehlen noch." }
        ],
        "3": [
          { nr: 1, lz: ["ma.rf.06", "ma.rf.07", "ma.rf.08"], titel: "Raum und Form", kmk: "Raum und Form", inhalte: ["Würfelgebäude und Baupläne", "Parallel und senkrecht zeichnen", "Parallelogramm, Flächeninhalt und Umfang vergleichen", "Pyramide, Kegel, Zylinder, Würfel- und Quadernetze", "Achsen-, Schiebe- und Drehsymmetrie"], app: [], abdeckung: "nein" },
          { nr: 2, lz: ["ma.zo.11", "ma.zo.12", "ma.zo.13", "ma.zo.14", "ma.zo.16"], titel: "Zahl und Operation", kmk: "Zahl und Operation", inhalte: ["Zahlen bis 1 000, Runden", "Schriftliche Addition und Subtraktion", "Einmaleins (Kernaufgaben und Ableitungen), Division mit Rest", "Teilbarkeitsregeln, Quersumme", "Bruchteile ½, ¼, ¾", "Schriftliche Multiplikation (einstelliger Faktor), Überschlag"],
            app: ["mathe:mal2", "mathe:mal3"], abdeckung: "teil", hinweis: "Die Einmaleins-Stationen mit 3, 4 und 6–9 gehören laut Lehrplan 2025 eher zu Klasse 3." },
          { nr: 3, lz: ["ma.gm.04", "ma.gm.08"], titel: "Größen und Messen", kmk: "Größen und Messen", inhalte: ["Geld in Sachsituationen", "Kilometer", "Sekunde, Viertelstunde, Zeitspannen", "Gramm und Kilogramm"], app: [], abdeckung: "nein" },
          { nr: 4, lz: ["ma.dz.05", "ma.dz.06", "ma.dz.07"], titel: "Daten und Zufall", kmk: "Daten und Zufall", inhalte: ["Diagramme anfertigen und lesen", "Kombinatorik", "Zufallsexperimente, Wahrscheinlichkeitsstreifen"], app: [], abdeckung: "nein" }
        ],
        "4": [
          { nr: 1, lz: ["ma.rf.07", "ma.rf.09"], titel: "Raum und Form", kmk: "Raum und Form", inhalte: ["Wegeskizzen, Schrägbilder", "Vierecke ordnen (Trapez, Raute, Drachen)", "Flächeninhalt (cm², m²), Umfang, Volumen mit Einheitswürfeln", "Körpernetze, Parkettierungen"], app: [], abdeckung: "nein" },
          { nr: 2, lz: ["ma.zo.15", "ma.zo.16", "ma.zo.17"], titel: "Zahl und Operation", kmk: "Zahl und Operation", inhalte: ["Zahlen bis 1 000 000, römische Zahlen, Adam Ries", "Rechengesetze, Klammerregel", "Schriftliche Addition, Subtraktion, Multiplikation", "Einblick schriftliche Division", "Primzahlen, Teilbarkeit, Runden, Überschlag", "Einfache Maßstäbe"], app: [], abdeckung: "nein" },
          { nr: 3, lz: ["ma.gm.09"], titel: "Größen und Messen", kmk: "Größen und Messen", inhalte: ["(Details aus dem Lehrplan nachtragen)"], app: [], abdeckung: "nein" },
          { nr: 4, lz: ["ma.dz.06", "ma.dz.07"], titel: "Daten und Zufall", kmk: "Daten und Zufall", inhalte: ["(Details aus dem Lehrplan nachtragen)"], app: [], abdeckung: "nein" }
        ]
      }
    },
    deutsch: {
      name: "Deutsch", stand: "Lehrplan 2019",
      stufen: {
        "1/2": [
          { nr: 1, lz: ["de.le.02", "de.le.03", "de.le.04", "de.su.02", "de.sc.02", "de.sc.03"], titel: "Schriftspracherwerb", kmk: "Lesen – mit Texten und Medien umgehen", inhalte: ["Laute und Buchstaben, Silben", "Wörter, Sätze und Texte sinnverstehend lesen", "Druckschrift, Schulausgangsschrift"], app: ["deutsch:alle", "werkstatt:w-silben"], abdeckung: "teil", hinweis: "Lesen von Wörtern und Sätzen und Silben ja; Laute und Schreiben mit der Hand fehlen." },
          { nr: 2, lz: ["de.sz.02", "de.sz.03", "de.sz.04"], titel: "Sprechen und Zuhören", kmk: "Sprechen und Zuhören", inhalte: ["Erzählen, Nacherzählen", "Zuhören, Gesprächsregeln", "Grüßen, Bitten, Danken"], app: ["deutsch:alle"], abdeckung: "teil", hinweis: "Zuhören über Vorlesen; eigenes Sprechen fehlt (geplant: sich aufnehmen)." },
          { nr: 3, lz: ["de.sc.06"], titel: "Für sich und andere schreiben", kmk: "Schreiben", inhalte: ["Erlebtes und Erdachtes schreiben", "Einladung, Glückwunsch, Brief", "Texte überarbeiten"], app: [], abdeckung: "nein" },
          { nr: 4, lz: ["de.sc.04", "de.sc.05"], titel: "Richtig schreiben", kmk: "Schreiben", inhalte: ["Selbst-, Mit-, Zwielaute, Umlaute, Auslautverhärtung", "Großschreibung, Satzschlusszeichen", "Wortbausteine, Klassenwortschatz", "Alphabet, Wörterbuch"], app: ["wort:tag", "werkstatt:w-verlaengern"], abdeckung: "teil", hinweis: "Verlängern (d/t, g/k, b/p) und Großschreibung von Nomen ja; Umlaute, Zwielaute, Satzzeichen fehlen." },
          { nr: 5, lz: ["de.le.05", "de.tm.02", "de.tm.03"], titel: "Lesen/Mit Medien umgehen", kmk: "Lesen – mit Texten und Medien umgehen", inhalte: ["Lesesicherheit", "Märchen, Gedichte, Sachtexte", "Informationen finden"], app: ["deutsch:alle", "sachkunde:alle"], abdeckung: "teil", hinweis: "Kurze Texte ja; längere Lesetexte mit Fragen fehlen." },
          { nr: 6, lz: ["de.su.03", "de.su.04", "de.su.05", "de.su.06", "de.su.07", "de.su.08"], titel: "Sprache untersuchen", kmk: "Sprache und Sprachgebrauch untersuchen", inhalte: ["Verb, Substantiv, Artikel, Adjektiv", "Wortfamilien, zusammengesetzte Substantive", "Satzarten, Umstellprobe"], app: ["deutsch:alle", "wort:tag", "werkstatt:w-verben", "werkstatt:w-adjektive", "werkstatt:w-wortarten"], abdeckung: "ja", hinweis: "Wortfamilien und zusammengesetzte Nomen fehlen noch." },
          { nr: 7, lz: ["me.ph.01", "me.sa.01", "me.sa.02", "me.sv.01"], titel: "Mit digitalen Medien umgehen", kmk: "Lesen – mit Texten und Medien umgehen", inhalte: ["Bedienung", "Kindersuchmaschinen, Lernprogramme", "Chancen, Risiken, Verhaltensregeln"], app: ["medien:alle"], abdeckung: "ja" }
        ],
        "3": [
          { nr: 1, lz: ["de.sz.06"], titel: "Sprechen und Zuhören", kmk: "Sprechen und Zuhören", inhalte: ["Erzählen, Beschreiben", "Gespräche, Pro und Kontra"], app: [], abdeckung: "nein" },
          { nr: 2, lz: ["de.sc.07"], titel: "Für sich und andere schreiben", kmk: "Schreiben", inhalte: ["Erzählen und Beschreiben schreiben", "Stichwortzettel", "Texte überarbeiten, E-Mail"], app: [], abdeckung: "nein" },
          { nr: 3, lz: ["de.sc.08"], titel: "Richtig schreiben", kmk: "Schreiben", inhalte: ["Lange und kurze Vokale, Dehnungs-h, ck/tz, ss/ß", "Wörtliche Rede, Komma bei Aufzählung"], app: [], abdeckung: "nein" },
          { nr: 4, lz: ["de.tm.04", "de.le.06"], titel: "Lesen/Mit Medien umgehen", kmk: "Lesen – mit Texten und Medien umgehen", inhalte: ["Erzählung, Märchen, Gedicht, Fabel", "Sachtexte, Informationen erschließen"], app: ["sachkunde:alle"], abdeckung: "teil" },
          { nr: 5, lz: ["de.su.09", "de.su.10"], titel: "Sprache untersuchen", kmk: "Sprache und Sprachgebrauch untersuchen", inhalte: ["Präsens, Präteritum", "Steigerung von Adjektiven, Personalpronomen", "Vor- und Nachsilben", "Subjekt, Prädikat"], app: [], abdeckung: "nein" },
          { nr: 6, lz: ["me.sv.01", "me.sa.01"], titel: "Mit digitalen Medien umgehen", kmk: "Lesen – mit Texten und Medien umgehen", inhalte: ["Texte speichern und wiederfinden", "Suchstrategien, Schutz persönlicher Daten"], app: ["medien:alle"], abdeckung: "teil" }
        ],
        "4": [
          { nr: 1, lz: ["de.sz.07"], titel: "Sprechen und Zuhören", kmk: "Sprechen und Zuhören", inhalte: ["Spannend erzählen", "Streit schlichten", "Medienabsichten erkennen"], app: [], abdeckung: "nein" },
          { nr: 2, lz: ["de.sc.07", "de.sc.09"], titel: "Für sich und andere schreiben", kmk: "Schreiben", inhalte: ["Texte planen, schreiben, überarbeiten", "Notizen, Merktexte"], app: [], abdeckung: "nein" },
          { nr: 3, lz: ["de.sc.09"], titel: "Richtig schreiben", kmk: "Schreiben", inhalte: ["Rechtschreibregeln anwenden", "Wörterbuch nutzen"], app: [], abdeckung: "nein" },
          { nr: 4, lz: ["de.tm.04", "de.tm.05"], titel: "Lesen/Mit Medien umgehen", kmk: "Lesen – mit Texten und Medien umgehen", inhalte: ["Fabel, Märchen, Gedicht unterscheiden", "auch herkunftssprachliche Texte", "eigene Medienbeiträge"], app: [], abdeckung: "nein" },
          { nr: 5, lz: ["de.su.11", "de.su.12"], titel: "Sprache untersuchen", kmk: "Sprache und Sprachgebrauch untersuchen", inhalte: ["Perfekt und Futur", "Substantiv im Satz, Subjekt", "Satzglieder, Ergänzungen"], app: [], abdeckung: "nein" },
          { nr: 6, lz: ["me.sv.01", "me.ar.02", "me.sa.01"], titel: "Mit digitalen Medien umgehen", kmk: "Lesen – mit Texten und Medien umgehen", inhalte: ["Formatieren", "Informationen beschaffen und bewerten", "Datenschutz, Urheberrecht"], app: ["medien:alle"], abdeckung: "teil" }
        ]
      }
    },
    sachkunde: {
      name: "Sachunterricht", stand: "Lehrplan 2019",
      stufen: {
        "1/2": [
          { nr: 1, lz: ["su.so.02", "su.so.03"], titel: "Zusammen leben und lernen", inhalte: ["Rituale, Tagesrhythmus", "Regeln, Konflikte lösen", "Informieren in Medien"], app: ["sachkunde:familie"], abdeckung: "teil", hinweis: "Familie und Zusammenleben ja; Regeln und Konflikte fehlen." },
          { nr: 2, lz: ["su.na.02"], titel: "Mein Körper und meine Gesundheit", inhalte: ["Hygiene, Zähne, Bewegung", "Gesunde Ernährung, Trinken", "Erste Hilfe, Unfälle vermeiden"], app: ["sachkunde:gesundheit"], abdeckung: "ja", hinweis: "Thema „Gesund und munter“; dazu Trink- und Bewegungserinnerungen." },
          { nr: 3, lz: ["su.na.03", "su.na.05", "su.na.06"], titel: "Begegnungen mit Pflanzen und Tieren", inhalte: ["Jahreszeiten, Vogelzug", "Laub- und Nadelbäume", "Frühblüher, Keimen und Wachsen", "Vögel, Haustiere und ihre Pflege"], app: ["sachkunde:baeume-voegel"], abdeckung: "teil", hinweis: "Bäume und Vögel ja; Frühblüher und Keimen fehlen. Haustierpflege spielerisch mit dem eigenen Tier." },
          { nr: 4, lz: ["su.na.04"], titel: "Phänomene der unbelebten Natur", inhalte: ["Licht und Schatten", "Luft, Wind, Schall", "Wetter beobachten, Temperatur", "Wasser: lösen, trennen, schützen"], app: [], abdeckung: "nein", hinweis: "Geplant: Wetterstation auf der Insel." },
          { nr: 5, lz: ["su.ge.02", "su.hi.02"], titel: "Raum und Zeit", inhalte: ["Schule und Heimatort, Ortsplan", "Tag, Woche, Jahr, Uhr, Kalender", "Schulweg und Verkehr"], app: ["mathe:uhr"], abdeckung: "teil" },
          { nr: 6, lz: ["su.hi.03"], titel: "Durch unsere ersten Schuljahre", inhalte: ["Portfolio, Zeitleiste", "Steckbriefe zu Lieblingstieren"], app: [], abdeckung: "nein" }
        ],
        "3": [
          { nr: 1, lz: ["su.so.04", "su.hi.03"], titel: "Zusammen leben und lernen", inhalte: ["Menschen anderer Kulturen, kulturelle Verschiedenheit", "Leben auf dem Land früher und heute", "Medien als Informationsquelle"], app: ["sachkunde:geschenkebringer"], abdeckung: "teil", hinweis: "Feste in verschiedenen Kulturen (Weihnachten/Neujahr)." },
          { nr: 2, lz: ["su.na.02"], titel: "Mein Körper und meine Gesundheit", inhalte: ["Sinnesorgane", "Gefahren durch Drogen, Gruppendruck"], app: [], abdeckung: "nein" },
          { nr: 3, lz: ["su.na.08"], titel: "Pflanzen und Tiere", inhalte: ["Getreide und Kartoffel, vom Korn zum Brot", "Lebensraum Wiese"], app: [], abdeckung: "nein" },
          { nr: 4, lz: ["su.na.04", "su.na.07"], titel: "Unbelebte Natur", inhalte: ["Wetterberichte, Wetterkarten", "Wasser: fest, flüssig, gasförmig, Wasserkreislauf", "Schwimmen und Sinken"], app: [], abdeckung: "nein" },
          { nr: 5, lz: ["su.ge.02", "su.ge.03"], titel: "Raum und Zeit", inhalte: ["Himmelsrichtungen, Kompass", "Der eigene Landkreis", "Mit dem Fahrrad im Verkehr"], app: [], abdeckung: "nein" },
          { nr: 6, lz: [], titel: "Experimentieren", inhalte: ["Ein Experiment planen, durchführen, auswerten"], app: [], abdeckung: "nein" }
        ],
        "4": [
          { nr: 1, lz: ["su.so.06", "su.hi.04", "me.sa.01"], titel: "Zusammen leben und lernen", inhalte: ["Schule früher, Kinderrechte", "Medien: Nutzen, Gefahren, Datenschutz, Urheberrecht", "Stadt früher und heute"], app: ["medien:alle"], abdeckung: "teil" },
          { nr: 2, lz: ["su.na.02"], titel: "Mein Körper und meine Gesundheit", inhalte: ["Pubertät", "Atmung und Herzschlag", "Sucht und Vorbeugung"], app: [], abdeckung: "nein" },
          { nr: 3, lz: ["su.na.08"], titel: "Pflanzen und Tiere", inhalte: ["Wald als Lebensgemeinschaft", "Säugetiere", "Boden und Kompost", "Gewässer, Umweltschutz"], app: [], abdeckung: "nein" },
          { nr: 4, lz: ["su.na.09"], titel: "Unbelebte Natur", inhalte: ["Feuer und Brandschutz", "Wärmeleitung und Dämmung"], app: [], abdeckung: "nein" },
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
