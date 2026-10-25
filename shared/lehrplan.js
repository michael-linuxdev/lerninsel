// Lehrplan-Gerüst: KMK-Bildungsstandards (bundesweit) + Länder-Lehrplan (zuerst Sachsen).
// Jeder Lernbereich nennt die passenden Inhalte der App ("app"); leere Liste = Lücke.
// app-Einträge: "mathe:<station>", "deutsch:<kapitel>", "sachkunde:<thema>", "medien:alle", "wort:tag", "sachkunde:alle", "deutsch:alle"
// abdeckung: "ja" | "teil" | "nein" – ehrliche Einschätzung, wie gut die App den Lernbereich übt.
// Quellen: Sächsisches Staatsministerium für Kultus, Lehrpläne Grundschule (schulportal.sachsen.de/lplandb):
//   Mathematik Fassung 2025 (gültig ab 1.8.2025), Deutsch und Sachunterricht Fassung 2019. KMK-Bildungsstandards Primarbereich 2022.
window.LEHRPLAN = {
  kmk: {
    mathe: ["Zahl und Operation", "Raum und Form", "Muster, Strukturen und funktionaler Zusammenhang", "Größen und Messen", "Daten und Zufall"],
    deutsch: ["Sprechen und Zuhören", "Schreiben", "Lesen – mit Texten und Medien umgehen", "Sprache und Sprachgebrauch untersuchen"]
  },
  laender: {
    sachsen: {
      name: "Sachsen",
      faecher: {
        mathe: {
          name: "Mathematik", stand: "Lehrplan 2025, gültig ab 1.8.2025",
          stufen: {
            "1/2": [
              { nr: 1, titel: "Raum und Form", kmk: "Raum und Form", inhalte: ["Lagebeziehungen, Wege, Würfelgebäude", "Punkt, Gerade, Strecke, parallel, senkrecht", "Dreieck, Viereck, Rechteck, Quadrat, Kreis", "Würfel, Quader, Kugel", "Achsensymmetrie, Muster"], app: ["mathe:formen"], abdeckung: "teil", hinweis: "Formen, Ecken und Körper ja; Lagebeziehungen, Symmetrie und Würfelgebäude fehlen noch." },
              { nr: 2, titel: "Zahl und Operation", kmk: "Zahl und Operation", inhalte: ["Zahlen bis 100, Stellenwerttafel (E, Z, H)", "Vergleichen, Ordnen, Vorgänger/Nachfolger, gerade/ungerade", "Plus und Minus bis 100 mit Strategien", "Mal und Geteilt: Kernaufgaben 2, 5, 10, Quadratzahlen, Tausch- und Umkehraufgaben", "Sachaufgaben"],
                app: ["mathe:plus20", "mathe:minus20", "mathe:zehner", "mathe:vergleich", "mathe:plus100", "mathe:minus100", "mathe:doppelt", "mathe:ergaenzen", "mathe:mal1", "mathe:geteilt"], abdeckung: "ja",
                hinweis: "Sachaufgaben, gerade/ungerade und Quadratzahlen fehlen noch." },
              { nr: 3, titel: "Größen und Messen", kmk: "Größen und Messen", inhalte: ["Geld: Euro und Cent", "Länge: mm, cm, dm, m, messen", "Zeit: Minute, Stunde, Tag, Woche, Monat, Jahr, Uhr, Kalender"], app: ["mathe:geld", "mathe:uhr"], abdeckung: "teil", hinweis: "Länge und Kalender fehlen." },
              { nr: 4, titel: "Daten und Zufall", kmk: "Daten und Zufall", inhalte: ["Strichlisten, Tabellen, Säulen- und Balkendiagramme", "Einfache Kombinationen", "Zufall: sicher, möglich, unmöglich"], app: ["mathe:daten", "mathe:zufall"], abdeckung: "ja", hinweis: "Einfache Kombinationen fehlen noch." }
            ],
            "3": [
              { nr: 1, titel: "Raum und Form", kmk: "Raum und Form", inhalte: ["Würfelgebäude und Baupläne", "Parallel und senkrecht zeichnen", "Parallelogramm, Flächeninhalt und Umfang vergleichen", "Pyramide, Kegel, Zylinder, Würfel- und Quadernetze", "Achsen-, Schiebe- und Drehsymmetrie"], app: [], abdeckung: "nein" },
              { nr: 2, titel: "Zahl und Operation", kmk: "Zahl und Operation", inhalte: ["Zahlen bis 1 000, Runden", "Schriftliche Addition und Subtraktion", "Einmaleins (Kernaufgaben und Ableitungen), Division mit Rest", "Teilbarkeitsregeln, Quersumme", "Bruchteile ½, ¼, ¾", "Schriftliche Multiplikation (einstelliger Faktor), Überschlag"],
                app: ["mathe:mal2", "mathe:mal3"], abdeckung: "teil", hinweis: "Die Einmaleins-Stationen mit 3, 4 und 6–9 gehören laut Lehrplan 2025 eher zu Klasse 3." },
              { nr: 3, titel: "Größen und Messen", kmk: "Größen und Messen", inhalte: ["Geld in Sachsituationen", "Kilometer", "Sekunde, Viertelstunde, Zeitspannen", "Gramm und Kilogramm"], app: [], abdeckung: "nein" },
              { nr: 4, titel: "Daten und Zufall", kmk: "Daten und Zufall", inhalte: ["Diagramme anfertigen und lesen", "Kombinatorik", "Zufallsexperimente, Wahrscheinlichkeitsstreifen"], app: [], abdeckung: "nein" }
            ],
            "4": [
              { nr: 1, titel: "Raum und Form", kmk: "Raum und Form", inhalte: ["Wegeskizzen, Schrägbilder", "Vierecke ordnen (Trapez, Raute, Drachen)", "Flächeninhalt (cm², m²), Umfang, Volumen mit Einheitswürfeln", "Körpernetze, Parkettierungen"], app: [], abdeckung: "nein" },
              { nr: 2, titel: "Zahl und Operation", kmk: "Zahl und Operation", inhalte: ["Zahlen bis 1 000 000, römische Zahlen, Adam Ries", "Rechengesetze, Klammerregel", "Schriftliche Addition, Subtraktion, Multiplikation", "Einblick schriftliche Division", "Primzahlen, Teilbarkeit, Runden, Überschlag", "Einfache Maßstäbe"], app: [], abdeckung: "nein" },
              { nr: 3, titel: "Größen und Messen", kmk: "Größen und Messen", inhalte: ["(Details aus dem Lehrplan nachtragen)"], app: [], abdeckung: "nein" },
              { nr: 4, titel: "Daten und Zufall", kmk: "Daten und Zufall", inhalte: ["(Details aus dem Lehrplan nachtragen)"], app: [], abdeckung: "nein" }
            ]
          }
        },
        deutsch: {
          name: "Deutsch", stand: "Lehrplan 2019",
          stufen: {
            "1/2": [
              { nr: 1, titel: "Schriftspracherwerb", kmk: "Lesen – mit Texten und Medien umgehen", inhalte: ["Laute und Buchstaben, Silben", "Wörter, Sätze und Texte sinnverstehend lesen", "Druckschrift, Schulausgangsschrift"], app: ["deutsch:alle"], abdeckung: "teil", hinweis: "Lesen von Wörtern und Sätzen ja; Laute, Silben und Schreiben mit der Hand fehlen." },
              { nr: 2, titel: "Sprechen und Zuhören", kmk: "Sprechen und Zuhören", inhalte: ["Erzählen, Nacherzählen", "Zuhören, Gesprächsregeln", "Grüßen, Bitten, Danken"], app: ["deutsch:alle"], abdeckung: "teil", hinweis: "Zuhören über Vorlesen; eigenes Sprechen fehlt (geplant: sich aufnehmen)." },
              { nr: 3, titel: "Für sich und andere schreiben", kmk: "Schreiben", inhalte: ["Erlebtes und Erdachtes schreiben", "Einladung, Glückwunsch, Brief", "Texte überarbeiten"], app: [], abdeckung: "nein" },
              { nr: 4, titel: "Richtig schreiben", kmk: "Schreiben", inhalte: ["Selbst-, Mit-, Zwielaute, Umlaute, Auslautverhärtung", "Großschreibung, Satzschlusszeichen", "Wortbausteine, Klassenwortschatz", "Alphabet, Wörterbuch"], app: ["wort:tag"], abdeckung: "teil", hinweis: "Großschreibung über Nomen mit Artikel; Rechtschreibregeln fehlen." },
              { nr: 5, titel: "Lesen/Mit Medien umgehen", kmk: "Lesen – mit Texten und Medien umgehen", inhalte: ["Lesesicherheit", "Märchen, Gedichte, Sachtexte", "Informationen finden"], app: ["deutsch:alle", "sachkunde:alle"], abdeckung: "teil", hinweis: "Kurze Texte ja; längere Lesetexte mit Fragen fehlen." },
              { nr: 6, titel: "Sprache untersuchen", kmk: "Sprache und Sprachgebrauch untersuchen", inhalte: ["Verb, Substantiv, Artikel, Adjektiv", "Wortfamilien, zusammengesetzte Substantive", "Satzarten, Umstellprobe"], app: ["deutsch:alle", "wort:tag"], abdeckung: "teil", hinweis: "Artikel, Mehrzahl und Satzbau ja; Verben und Adjektive fehlen." },
              { nr: 7, titel: "Mit digitalen Medien umgehen", kmk: "Lesen – mit Texten und Medien umgehen", inhalte: ["Bedienung", "Kindersuchmaschinen, Lernprogramme", "Chancen, Risiken, Verhaltensregeln"], app: ["medien:alle"], abdeckung: "ja" }
            ],
            "3": [
              { nr: 1, titel: "Sprechen und Zuhören", kmk: "Sprechen und Zuhören", inhalte: ["Erzählen, Beschreiben", "Gespräche, Pro und Kontra"], app: [], abdeckung: "nein" },
              { nr: 2, titel: "Für sich und andere schreiben", kmk: "Schreiben", inhalte: ["Erzählen und Beschreiben schreiben", "Stichwortzettel", "Texte überarbeiten, E-Mail"], app: [], abdeckung: "nein" },
              { nr: 3, titel: "Richtig schreiben", kmk: "Schreiben", inhalte: ["Lange und kurze Vokale, Dehnungs-h, ck/tz, ss/ß", "Wörtliche Rede, Komma bei Aufzählung"], app: [], abdeckung: "nein" },
              { nr: 4, titel: "Lesen/Mit Medien umgehen", kmk: "Lesen – mit Texten und Medien umgehen", inhalte: ["Erzählung, Märchen, Gedicht, Fabel", "Sachtexte, Informationen erschließen"], app: ["sachkunde:alle"], abdeckung: "teil" },
              { nr: 5, titel: "Sprache untersuchen", kmk: "Sprache und Sprachgebrauch untersuchen", inhalte: ["Präsens, Präteritum", "Steigerung von Adjektiven, Personalpronomen", "Vor- und Nachsilben", "Subjekt, Prädikat"], app: [], abdeckung: "nein" },
              { nr: 6, titel: "Mit digitalen Medien umgehen", kmk: "Lesen – mit Texten und Medien umgehen", inhalte: ["Texte speichern und wiederfinden", "Suchstrategien, Schutz persönlicher Daten"], app: ["medien:alle"], abdeckung: "teil" }
            ],
            "4": [
              { nr: 1, titel: "Sprechen und Zuhören", kmk: "Sprechen und Zuhören", inhalte: ["Spannend erzählen", "Streit schlichten", "Medienabsichten erkennen"], app: [], abdeckung: "nein" },
              { nr: 2, titel: "Für sich und andere schreiben", kmk: "Schreiben", inhalte: ["Texte planen, schreiben, überarbeiten", "Notizen, Merktexte"], app: [], abdeckung: "nein" },
              { nr: 3, titel: "Richtig schreiben", kmk: "Schreiben", inhalte: ["Rechtschreibregeln anwenden", "Wörterbuch nutzen"], app: [], abdeckung: "nein" },
              { nr: 4, titel: "Lesen/Mit Medien umgehen", kmk: "Lesen – mit Texten und Medien umgehen", inhalte: ["Fabel, Märchen, Gedicht unterscheiden", "auch herkunftssprachliche Texte", "eigene Medienbeiträge"], app: [], abdeckung: "nein" },
              { nr: 5, titel: "Sprache untersuchen", kmk: "Sprache und Sprachgebrauch untersuchen", inhalte: ["Perfekt und Futur", "Substantiv im Satz, Subjekt", "Satzglieder, Ergänzungen"], app: [], abdeckung: "nein" },
              { nr: 6, titel: "Mit digitalen Medien umgehen", kmk: "Lesen – mit Texten und Medien umgehen", inhalte: ["Formatieren", "Informationen beschaffen und bewerten", "Datenschutz, Urheberrecht"], app: ["medien:alle"], abdeckung: "teil" }
            ]
          }
        },
        sachkunde: {
          name: "Sachunterricht", stand: "Lehrplan 2019",
          stufen: {
            "1/2": [
              { nr: 1, titel: "Zusammen leben und lernen", inhalte: ["Rituale, Tagesrhythmus", "Regeln, Konflikte lösen", "Informieren in Medien"], app: ["sachkunde:familie"], abdeckung: "teil", hinweis: "Familie und Zusammenleben ja; Regeln und Konflikte fehlen." },
              { nr: 2, titel: "Mein Körper und meine Gesundheit", inhalte: ["Hygiene, Zähne, Bewegung", "Gesunde Ernährung, Trinken", "Erste Hilfe, Unfälle vermeiden"], app: [], abdeckung: "nein", hinweis: "Erinnerungen ans Trinken und Bewegungspausen gibt es, aber noch kein Thema." },
              { nr: 3, titel: "Begegnungen mit Pflanzen und Tieren", inhalte: ["Jahreszeiten, Vogelzug", "Laub- und Nadelbäume", "Frühblüher, Keimen und Wachsen", "Vögel, Haustiere und ihre Pflege"], app: [], abdeckung: "nein", hinweis: "Haustierpflege üben die Kinder spielerisch mit dem eigenen Tier." },
              { nr: 4, titel: "Phänomene der unbelebten Natur", inhalte: ["Licht und Schatten", "Luft, Wind, Schall", "Wetter beobachten, Temperatur", "Wasser: lösen, trennen, schützen"], app: [], abdeckung: "nein", hinweis: "Geplant: Wetterstation auf der Insel." },
              { nr: 5, titel: "Raum und Zeit", inhalte: ["Schule und Heimatort, Ortsplan", "Tag, Woche, Jahr, Uhr, Kalender", "Schulweg und Verkehr"], app: ["mathe:uhr"], abdeckung: "teil" },
              { nr: 6, titel: "Durch unsere ersten Schuljahre", inhalte: ["Portfolio, Zeitleiste", "Steckbriefe zu Lieblingstieren"], app: [], abdeckung: "nein" }
            ],
            "3": [
              { nr: 1, titel: "Zusammen leben und lernen", inhalte: ["Menschen anderer Kulturen, kulturelle Verschiedenheit", "Leben auf dem Land früher und heute", "Medien als Informationsquelle"], app: ["sachkunde:geschenkebringer"], abdeckung: "teil", hinweis: "Feste in verschiedenen Kulturen (Weihnachten/Neujahr)." },
              { nr: 2, titel: "Mein Körper und meine Gesundheit", inhalte: ["Sinnesorgane", "Gefahren durch Drogen, Gruppendruck"], app: [], abdeckung: "nein" },
              { nr: 3, titel: "Pflanzen und Tiere", inhalte: ["Getreide und Kartoffel, vom Korn zum Brot", "Lebensraum Wiese"], app: [], abdeckung: "nein" },
              { nr: 4, titel: "Unbelebte Natur", inhalte: ["Wetterberichte, Wetterkarten", "Wasser: fest, flüssig, gasförmig, Wasserkreislauf", "Schwimmen und Sinken"], app: [], abdeckung: "nein" },
              { nr: 5, titel: "Raum und Zeit", inhalte: ["Himmelsrichtungen, Kompass", "Der eigene Landkreis", "Mit dem Fahrrad im Verkehr"], app: [], abdeckung: "nein" },
              { nr: 6, titel: "Experimentieren", inhalte: ["Ein Experiment planen, durchführen, auswerten"], app: [], abdeckung: "nein" }
            ],
            "4": [
              { nr: 1, titel: "Zusammen leben und lernen", inhalte: ["Schule früher, Kinderrechte", "Medien: Nutzen, Gefahren, Datenschutz, Urheberrecht", "Stadt früher und heute"], app: ["medien:alle"], abdeckung: "teil" },
              { nr: 2, titel: "Mein Körper und meine Gesundheit", inhalte: ["Pubertät", "Atmung und Herzschlag", "Sucht und Vorbeugung"], app: [], abdeckung: "nein" },
              { nr: 3, titel: "Pflanzen und Tiere", inhalte: ["Wald als Lebensgemeinschaft", "Säugetiere", "Boden und Kompost", "Gewässer, Umweltschutz"], app: [], abdeckung: "nein" },
              { nr: 4, titel: "Unbelebte Natur", inhalte: ["Feuer und Brandschutz", "Wärmeleitung und Dämmung"], app: [], abdeckung: "nein" },
              { nr: 5, titel: "Raum und Zeit", inhalte: ["Karte von Sachsen, Maßstab", "Dresden", "Sorbische Kultur", "Radfahrprüfung"], app: [], abdeckung: "nein" },
              { nr: 6, titel: "Medien – Informationen beschaffen", inhalte: ["Präsentation erstellen", "Quellen, Urheberrecht, Datenschutz"], app: [], abdeckung: "nein" }
            ]
          }
        }
      }
    }
  },
  // Lernbereiche für eine Klasse (1 und 2 teilen sich die Stufe „1/2“)
  fuer(land, fach, klasse) {
    const f = this.laender[land] && this.laender[land].faecher[fach]; if (!f) return [];
    const stufe = klasse <= 2 ? "1/2" : String(klasse);
    return f.stufen[stufe] || [];
  }
};
