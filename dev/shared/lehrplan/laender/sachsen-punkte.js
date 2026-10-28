// Sachsen in voller Tiefe („wie ein Schuljahr“, Entscheidung 27.10.2026): Inhaltspunkte je Lernbereich, aus dem Lehrplantext zusammengefasst
// (nie wörtlich), mit Zuordnung zu Inhalten der App. Ergänzt das Profil aus sachsen.js um `punkte` – darum NACH sachsen.js und VOR
// shared/lehrplan.js laden.
// Punkt: [id, Text, Klasse ("1" | "2" | "1/2" | "3" | "4"), app[], abdeckung]
//   abdeckung: "ja" = in der App geübt · "teil" = teilweise · "nein" = fehlt noch · "aussen" = gehört nach draußen/aufs Papier
//   (Zeichnen mit Lineal und Zirkel, echtes Messen, Bauen) – dafür gibt es Echte-Welt-Aufgaben, die App übt es nicht selbst.
// Quellen: Mathematik 2025 (Lehrplan Grundschule Sachsen, Fassung 2025, gültig ab 1.8.2025; vom Auftraggeber als PDF bereitgestellt), Kl. 1/2, 3 und 4;
//   Deutsch 2025 (Fachlehrplan Deutsch, gültig ab 1.8.2025, kommentierte Fassung; PDF vom Auftraggeber, 28.10.2026), Kl. 1/2, 3 und 4;
//   Sachunterricht 2019 (Lehrplan Grundschule, gültig ab 1.8.2019; PDF vom Auftraggeber, 28.10.2026), Kl. 1/2, 3 und 4 – nur die Pflicht-Lernbereiche,
//   die Wahlbereiche (z. B. Abfall, Steine, Himmelsraum) sind freiwillig und nicht gezählt;
//   Englisch 2019 (Lehrplan Grundschule, Kl. 3 und 4; PDF vom Auftraggeber, 28.10.2026) – zehn Themen-Lernbereiche und „My Portfolio“.
// app-Zuordnungen: mathe:<station>, werkstatt:<kapitel>, deutsch:<abenteuer-kapitel>, lesen:<anlaute|silben|texte|spuren|legen|tafel>,
//   medien:<lektion>, sachkunde:<thema>, echtewelt:<id>
(function () {
  const P = window.LehrplanLaender && window.LehrplanLaender.sn; if (!P) return;
  const PUNKTE = {
    englisch: {
      "3": {
        1: [ // Me, my family and my friends
          ["sn.en3.mf.01", "Englisch als neue Sprache erleben: Klang, Rhythmus, Lieder und Reime", "3", ["englisch:en-hello", "englisch:en-numbers", "englisch:en-year", "englisch:en-party"], "ja"],
          ["sn.en3.mf.02", "Englische Wörter im Alltag entdecken (Computer, Essen, Kleidung, Spiele)", "3", ["englisch:en-everywhere"], "ja"],
          ["sn.en3.mf.03", "Begrüßen, verabschieden, sich vorstellen", "3", ["englisch:en-hello"], "ja"],
          ["sn.en3.mf.04", "Über sich, Familie und Freunde Auskunft geben: Name, Alter, Geschwister", "3", ["englisch:en-family", "englisch:en-numbers2"], "ja"],
          ["sn.en3.mf.05", "Befinden ausdrücken: How are you? I'm fine.", "3", ["englisch:en-feelings", "englisch:en-hello"], "ja"],
          ["sn.en3.mf.06", "Zahlen von 0 bis 12", "3", ["englisch:en-numbers", "englisch:en-numbers2"], "ja"],
          ["sn.en3.mf.07", "Beim Hören helfen Tonfall, Bilder und Töne", "3", ["englisch:en-hello", "englisch:en-animals"], "ja"]
        ],
        2: [ // My body and my clothes
          ["sn.en3.bc.01", "Körperteile benennen", "3", ["englisch:en-body"], "ja"],
          ["sn.en3.bc.02", "Kleidungsstücke benennen", "3", ["englisch:en-clothes"], "ja"],
          ["sn.en3.bc.03", "Wetter: It's rainy. It's sunny.", "3", ["englisch:en-weather"], "ja"],
          ["sn.en3.bc.04", "Grund- und Mischfarben", "3", ["englisch:en-colours"], "ja"],
          ["sn.en3.bc.05", "Lieblingsfarbe und -kleidung nennen, Besitz ausdrücken (Is this your jacket?)", "3", ["englisch:en-colours", "englisch:en-clothes"], "ja"]
        ],
        3: [ // At home
          ["sn.en3.ah.01", "Zimmer benennen", "3", ["englisch:en-home"], "ja"],
          ["sn.en3.ah.02", "Einrichtungs- und Gebrauchsgegenstände", "3", ["englisch:en-furniture", "englisch:en-home"], "ja"],
          ["sn.en3.ah.03", "Sagen, wo jemand oder etwas ist", "3", ["englisch:en-home", "englisch:en-furniture"], "ja"],
          ["sn.en3.ah.04", "Wohnen in englischsprachigen Ländern (Kamin, bunte Haustüren)", "3", ["englisch:en-furniture"], "ja"]
        ],
        4: [ // Food and drink
          ["sn.en3.fd.01", "Mahlzeiten, Tischsitten und typische Speisen (fish and chips, Pancake Day)", "3", ["englisch:en-cafe", "englisch:en-food"], "ja"],
          ["sn.en3.fd.02", "Lebensmittel: Obst, Gemüse, Süßes, Käse", "3", ["englisch:en-food"], "ja"],
          ["sn.en3.fd.03", "Zahlen bis 100", "3", ["englisch:en-numbers2"], "ja"],
          ["sn.en3.fd.04", "Hunger und Durst, Vorlieben, Wünsche, bitten und danken", "3", ["englisch:en-food", "englisch:en-feelings", "englisch:en-cafe"], "ja"]
        ],
        5: [ // Let's go shopping
          ["sn.en3.sh.01", "Kleidung, Lebensmittel und Spielsachen im Laden", "3", ["englisch:en-shopping", "englisch:en-clothes"], "ja"],
          ["sn.en3.sh.02", "Mengen und Preise, britisches Geld (penny, pound)", "3", ["englisch:en-shopping"], "ja"],
          ["sn.en3.sh.03", "Einkaufsgespräch: bitten, wünschen, Preis erfragen, bedauern", "3", ["englisch:en-shopping"], "ja"]
        ],
        6: [ // At school
          ["sn.en3.sc.01", "Schulalltag in englischsprachigen Ländern (Schuluniform)", "3", ["englisch:en-subjects"], "ja"],
          ["sn.en3.sc.02", "Schulsachen, Fächer, Wochentage, volle Stunden", "3", ["englisch:en-school", "englisch:en-subjects"], "ja"],
          ["sn.en3.sc.03", "Nach Schulsachen fragen, Besitz ausdrücken (Have you got a pen? This is my pencil.)", "3", ["englisch:en-school"], "ja"]
        ],
        7: [ // My hobbies
          ["sn.en3.ho.01", "Sportarten, Spiele, Musik, Malen und Basteln", "3", ["englisch:en-hobbies", "englisch:en-sports"], "ja"],
          ["sn.en3.ho.02", "Vorlieben ausdrücken: Do you like …?", "3", ["englisch:en-hobbies", "englisch:en-sports"], "ja"]
        ],
        8: [ // Animals
          ["sn.en3.an.01", "Haustiere und Tiere auf dem Bauernhof", "3", ["englisch:en-animals"], "ja"],
          ["sn.en3.an.02", "Tiere beschreiben: It's brown. It has got four legs. It can …", "3", ["englisch:en-zoo", "englisch:en-animals"], "ja"],
          ["sn.en3.an.03", "Lieblingstiere, Besitz und Wünsche (What would you like for your birthday?)", "3", ["englisch:en-animals", "englisch:en-party"], "ja"]
        ],
        9: [ // Let's go on a trip
          ["sn.en3.tr.01", "Ausflugsziele und Verkehrsmittel", "3", ["englisch:en-trip"], "ja"],
          ["sn.en3.tr.02", "Sehenswürdigkeiten", "3", ["englisch:en-london"], "ja"],
          ["sn.en3.tr.03", "Fahrkarte kaufen, nach dem Weg fragen", "3", ["englisch:en-trip"], "ja"]
        ],
        10: [ // Around the year
          ["sn.en3.yr.01", "Feste: Easter, Halloween, Christmas, New Year, Birthday", "3", ["englisch:en-year", "englisch:en-party"], "ja"],
          ["sn.en3.yr.02", "Monate und Jahreszeiten", "3", ["englisch:en-year"], "ja"],
          ["sn.en3.yr.03", "Gratulieren mündlich und schriftlich, Grußkarten", "3", ["englisch:en-party"], "ja"],
          ["sn.en3.yr.04", "Lieder, Reime und szenisches Spiel zu den Festen", "3", ["englisch:en-act", "englisch:en-party", "englisch:en-year"], "ja"]
        ],
        11: [ // My Portfolio
          ["sn.en3.pf.01", "Sprachenpass: Sprachen nennen, die ich lerne und spreche (auch Familiensprachen)", "3", ["englisch:en-portfolio"], "ja"],
          ["sn.en3.pf.02", "Sprachenbiografie und Dossier: Lernerfolge und gelungene Arbeiten sammeln", "3", ["englisch:en-portfolio", "echtewelt:sprachenmappe"], "aussen"]
        ]
      },
      "4": {
        1: [
          ["sn.en4.mf.01", "Englisch im Alltag: wozu man es braucht (Handy, Computer)", "4", ["englisch:en-everywhere"], "ja"],
          ["sn.en4.mf.02", "Mimik und Gestik beim Sprechen einsetzen", "4", ["englisch:en-faces", "englisch:en-feelings", "englisch:en-act"], "ja"],
          ["sn.en4.mf.03", "Sich und andere vorstellen, Herkunft, Interviews", "4", ["englisch:en-portfolio", "englisch:en-family", "englisch:en-hello"], "ja"],
          ["sn.en4.mf.04", "Befinden und Gefühle ausdrücken", "4", ["englisch:en-feelings"], "ja"]
        ],
        2: [
          ["sn.en4.bc.01", "Körper, Kleidung, Farbnuancen (light green, dark blue), Wetter (foggy, snowy)", "4", ["englisch:en-colours", "englisch:en-weather", "englisch:en-body"], "ja"],
          ["sn.en4.bc.02", "Passende Kleidung zum Wetter wählen, Lieblingskleidung erfragen", "4", ["englisch:en-weather", "englisch:en-clothes"], "ja"]
        ],
        3: [
          ["sn.en4.ah.01", "Zimmer, Möbel und Gebrauchsgegenstände", "4", ["englisch:en-home", "englisch:en-furniture"], "ja"],
          ["sn.en4.ah.02", "Lage beschreiben: in, on, under, next to", "4", ["englisch:en-furniture", "englisch:en-home"], "ja"]
        ],
        4: [
          ["sn.en4.fd.01", "Im Café oder Restaurant bestellen, Preise erfragen, höflich sein", "4", ["englisch:en-cafe"], "ja"],
          ["sn.en4.fd.02", "Typische Speisen und Getränke englischsprachiger Länder", "4", ["englisch:en-cafe", "englisch:en-dates"], "ja"],
          ["sn.en4.fd.03", "Gesunde Ernährung", "4", ["englisch:en-cafe", "englisch:en-food"], "ja"],
          ["sn.en4.fd.04", "Rezeptbuch oder Speisekarte gestalten", "4", ["echtewelt:speisekarte"], "aussen"]
        ],
        5: [
          ["sn.en4.sh.01", "Kleidung, Spielsachen, Preise bis 100", "4", ["englisch:en-shopping", "englisch:en-numbers2"], "ja"],
          ["sn.en4.sh.02", "Verkaufsgespräch beginnen und beenden, Wunschliste", "4", ["englisch:en-shopping"], "ja"]
        ],
        6: [
          ["sn.en4.sc.01", "Tagesabschnitte, Schulfächer, Wochentage", "4", ["englisch:en-subjects"], "ja"],
          ["sn.en4.sc.02", "Uhrzeit erfragen und angeben (It's nine thirty.)", "4", ["englisch:en-subjects"], "ja"],
          ["sn.en4.sc.03", "Deutsche und britische Schulen vergleichen", "4", ["englisch:en-subjects"], "ja"],
          ["sn.en4.sc.04", "Hilfe anbieten und suchen, sich entschuldigen (Sorry, I'm late.)", "4", ["englisch:en-subjects", "englisch:en-school"], "ja"]
        ],
        7: [
          ["sn.en4.ho.01", "Englische und amerikanische Sportarten (cricket, American football)", "4", ["englisch:en-sports"], "ja"],
          ["sn.en4.ho.02", "Lesen und Medien: englische Kinderbücher und Angebote", "4", ["englisch:en-book", "englisch:en-everywhere"], "ja"],
          ["sn.en4.ho.03", "Zum Spielen einladen: Would you like to play with me?", "4", ["englisch:en-sports"], "ja"]
        ],
        8: [
          ["sn.en4.an.01", "Zoo- und Wildtiere, Lebensräume, bedrohte Tiere", "4", ["englisch:en-zoo"], "ja"],
          ["sn.en4.an.02", "Tiere beschreiben, Ratespiele mit Steckbriefen", "4", ["englisch:en-zoo"], "ja"],
          ["sn.en4.an.03", "Einen englischen Text über Tiere verstehen (Schlüsselwörter)", "4", ["englisch:en-hedgehog", "englisch:en-zoo"], "ja"]
        ],
        9: [
          ["sn.en4.tr.01", "Ausflugsziele und Verkehrsmittel", "4", ["englisch:en-trip"], "ja"],
          ["sn.en4.tr.02", "Sehenswürdigkeiten in London", "4", ["englisch:en-london"], "ja"],
          ["sn.en4.tr.03", "Fahrkarte kaufen, Preisauskunft", "4", ["englisch:en-trip"], "ja"]
        ],
        10: [
          ["sn.en4.yr.01", "Weitere Feste: Valentine's Day, Pancake Day, Mother's Day, Thanksgiving, St Patrick's Day", "4", ["englisch:en-dates"], "ja"],
          ["sn.en4.yr.02", "Ordnungszahlen und Datum", "4", ["englisch:en-dates"], "ja"],
          ["sn.en4.yr.03", "Wochentage, Monate und Jahreszeiten sicher", "4", ["englisch:en-subjects", "englisch:en-year"], "ja"],
          ["sn.en4.yr.04", "Glückwunschkarten schreiben, britische und deutsche Traditionen vergleichen", "4", ["englisch:en-party", "englisch:en-dates"], "ja"]
        ],
        11: [
          ["sn.en4.pf.01", "Sprachenpass aktualisieren, eigene Fortschritte beschreiben", "4", ["englisch:en-portfolio"], "ja"],
          ["sn.en4.pf.02", "Etwa zehn gelungene Arbeiten für das Dossier auswählen", "4", ["echtewelt:sprachenmappe"], "aussen"]
        ]
      }
    },
    sachkunde: {
      "1/2": {
        1: [ // Zusammen leben und lernen
          ["sn.su12.zl.01", "Tagesrhythmus in der Schule: Morgenkreis, Lernen und Bewegung im Wechsel, Mahlzeiten, Rituale", "1/2", ["sachkunde:zusammen-lernen"], "ja"],
          ["sn.su12.zl.02", "Voneinander und miteinander lernen: allein, zu zweit, in der Gruppe; aus Fehlern lernen, eigene Gedächtnisstützen", "1/2", ["sachkunde:zusammen-lernen"], "ja"],
          ["sn.su12.zl.03", "Lerngemeinschaft mitgestalten: Rechte und Pflichten, Dienste, Eigentum achten, Konflikte gemeinsam lösen", "1/2", ["sachkunde:zusammen-lernen", "sachkunde:regeln"], "ja"],
          ["sn.su12.zl.04", "Unter Anleitung in Büchern und digitalen Medien Informationen suchen", "2", ["sachkunde:medien-info", "medien:bedienung"], "ja"]
        ],
        2: [ // Mein Körper und meine Gesundheit
          ["sn.su12.kg.01", "Körperhygiene und Zahnpflege, Ansteckung vermeiden, Abhärtung", "1/2", ["sachkunde:gesundheit"], "ja"],
          ["sn.su12.kg.02", "Passende Kleidung, gute Sitzhaltung, genug Bewegung", "1/2", ["sachkunde:gesund-essen", "sachkunde:wetter"], "ja"],
          ["sn.su12.kg.03", "Gesunde Ernährung: Grundnahrungsmittel, genug trinken, Kräuter, Werbung kritisch sehen", "1/2", ["sachkunde:gesund-essen", "sachkunde:gesundheit"], "ja"],
          ["sn.su12.kg.04", "Ernährung, Bewegung, Ruhe und Schlaf hängen zusammen", "1/2", ["sachkunde:gesund-essen"], "ja"],
          ["sn.su12.kg.05", "Ein gesundes Frühstück; Obst und Gemüse von nah und fern, fairer Handel", "1/2", ["sachkunde:gesund-essen", "sachkunde:gesundheit"], "ja"],
          ["sn.su12.kg.06", "Körperteile von Jungen und Mädchen mit den richtigen Namen kennen, Intimsphäre", "1/2", ["sachkunde:mein-koerper"], "ja"],
          ["sn.su12.kg.07", "Schutz vor Missbrauch: Nein sagen, gute und schlechte Geheimnisse, Hilfe holen (Nummer gegen Kummer)", "1/2", ["sachkunde:mein-koerper"], "ja"],
          ["sn.su12.kg.08", "Erste Hilfe bei kleinen Verletzungen: Verbrennung, Wunde, Nasenbluten", "1/2", ["sachkunde:erstehilfe", "sachkunde:gesundheit"], "ja"],
          ["sn.su12.kg.09", "Unfälle vermeiden in Schule, Wohnung und Wohngebiet; Notruf und Rettungskette", "1/2", ["sachkunde:erstehilfe"], "ja"]
        ],
        3: [ // Begegnungen mit Pflanzen und Tieren
          ["sn.su12.pt.01", "Jahreszeitliche Veränderungen in der Natur beobachten, die Natur achten", "1/2", ["sachkunde:jahreszeiten", "sachkunde:baeume-voegel"], "ja"],
          ["sn.su12.pt.02", "Vögel im Jahreslauf: Vogelzug, Nestbau, Brutpflege", "1/2", ["sachkunde:jahreszeiten", "sachkunde:baeume-voegel"], "ja"],
          ["sn.su12.pt.03", "Fünf Laubbäume und drei Nadelbäume unterscheiden; Wurzel, Stamm, Ast, Zweig, Krone; Jahresringe", "1/2", ["sachkunde:baeume", "sachkunde:baeume-voegel"], "ja"],
          ["sn.su12.pt.04", "Frühblüher unterscheiden", "1/2", ["sachkunde:pflanzen"], "ja"],
          ["sn.su12.pt.05", "Keimen und Wachsen; Wurzel, Stängel, Blatt, Blüte, Frucht, Samen", "1/2", ["sachkunde:pflanzen", "sachkunde:obst-garten"], "ja"],
          ["sn.su12.pt.06", "Obst: Kern-, Stein- und Beerenobst, Frucht und Samen, Früchte verarbeiten", "2", ["sachkunde:obst-garten"], "ja"],
          ["sn.su12.pt.07", "Gärtnern: säen, pflanzen, pflegen, ernten, Gartengeräte sicher benutzen", "2", ["sachkunde:obst-garten", "echtewelt:pflanze"], "ja"],
          ["sn.su12.pt.08", "Vier Vogelarten unterscheiden", "1/2", ["sachkunde:kleintiere", "sachkunde:baeume-voegel"], "ja"],
          ["sn.su12.pt.09", "Frei lebende Kleintiere der Region beobachten, Artenvielfalt", "1/2", ["sachkunde:kleintiere"], "ja"],
          ["sn.su12.pt.10", "Heimtiere pflegen: Futter, Körpersprache, Gefahren", "1/2", ["sachkunde:haustiere"], "ja"],
          ["sn.su12.pt.11", "Haustiere auf dem Bauernhof, Haltung, Erzeugnisse (Milch, Eier, Wolle)", "2", ["sachkunde:haustiere", "sachkunde:brot"], "ja"]
        ],
        4: [ // Begegnung mit Phänomenen der unbelebten Natur
          ["sn.su12.un.01", "Sonnenlicht: Licht und Wärme, Schatten, Sonnenschutz; Mond und Sterne", "1/2", ["sachkunde:licht-schatten"], "ja"],
          ["sn.su12.un.02", "Künstliche Lichtquellen; durchsichtige, undurchsichtige und spiegelnde Stoffe (Reflektoren)", "2", ["sachkunde:licht-schatten"], "ja"],
          ["sn.su12.un.03", "Schatten: Lichtquelle, Gegenstand und Schatten, Lage und Form des Schattens", "2", ["sachkunde:licht-schatten"], "ja"],
          ["sn.su12.un.04", "Luft braucht Platz, bremst (Luftwiderstand) und dehnt sich bei Wärme aus", "2", ["sachkunde:luft-schall"], "ja"],
          ["sn.su12.un.05", "Töne durch bewegte Luft, Schall, Echo", "2", ["sachkunde:luft-schall"], "ja"],
          ["sn.su12.un.06", "Wind als bewegte Luft: Nutzen und Gefahren", "1/2", ["sachkunde:luft-schall"], "ja"],
          ["sn.su12.un.07", "Wetter beobachten und in eine Tabelle eintragen, Thermometer, Gefrierpunkt", "2", ["sachkunde:wetter", "sachkunde:wetterkarte"], "ja"],
          ["sn.su12.un.08", "Sich dem Wetter anpassen: Kleidung, Nebel und Dunkelheit, nasse Straße", "1/2", ["sachkunde:wetter"], "ja"],
          ["sn.su12.un.09", "Wasser als Lösungsmittel: lösen, trennen, verdunsten, Kristalle", "2", ["sachkunde:loesen-trennen", "sachkunde:wasser"], "ja"],
          ["sn.su12.un.10", "Gefährliche Flüssigkeiten im Haushalt, Warnzeichen, richtig aufbewahren", "2", ["sachkunde:loesen-trennen"], "ja"],
          ["sn.su12.un.11", "Bedeutung des Wassers, Wassermangel, Wasser sparen", "1/2", ["sachkunde:wasser"], "ja"],
          ["sn.su12.un.12", "Selbst experimentieren: Vermutung, Versuch, Beobachtung festhalten", "2", ["sachkunde:experiment", "echtewelt:versuch"], "aussen"]
        ],
        5: [ // Begegnung mit Raum und Zeit
          ["sn.su12.rz.01", "Sich im Schulhaus und Gelände orientieren, Fluchtweg und Brandschutz", "1", ["sachkunde:schule-ort"], "ja"],
          ["sn.su12.rz.02", "Zeit: Tagesablauf, gestern und vorgestern, Uhr, Kalender, Woche und Jahr", "1/2", ["mathe:uhr", "mathe:kalender", "mathe:k1zeit", "sachkunde:jahreszeiten"], "ja"],
          ["sn.su12.rz.03", "Öffentliche Einrichtungen im Wohnort, Wegskizze, Ortsplan mit Legende", "2", ["sachkunde:schule-ort", "sachkunde:gemeinde", "echtewelt:wegskizze"], "ja"],
          ["sn.su12.rz.04", "Feste und Höhepunkte im Jahreskreis", "1/2", ["sachkunde:jahreszeiten", "sachkunde:geschenkebringer"], "ja"],
          ["sn.su12.rz.05", "Spuren der Vergangenheit im Ort: Museum, Straßennamen, Menschen befragen", "2", ["sachkunde:schule-ort", "sachkunde:frueher"], "ja"],
          ["sn.su12.rz.06", "Wichtige Verkehrswege und Nahverkehr", "2", ["sachkunde:schule-ort", "sachkunde:schulweg"], "ja"],
          ["sn.su12.rz.07", "Sicher über die Straße gehen", "1", ["sachkunde:schulweg"], "ja"],
          ["sn.su12.rz.08", "An der Haltestelle und in Bus und Bahn; nicht mit Fremden mitgehen", "1/2", ["sachkunde:schule-ort", "sachkunde:schulweg"], "ja"]
        ],
        6: [ // Durch unsere ersten Schuljahre
          ["sn.su12.ss.01", "Rückschau: erster Schultag, erstes Zeugnis; Zeitleiste und Portfolio", "2", ["sachkunde:meine-schulzeit", "sachkunde:frueher"], "ja"],
          ["sn.su12.ss.02", "Höhepunkte und gemeisterte Schwierigkeiten, gelungene Arbeiten vorstellen", "2", ["sachkunde:meine-schulzeit"], "ja"],
          ["sn.su12.ss.03", "Steckbriefe zu Lieblingspflanzen und -tieren", "2", ["sachkunde:meine-schulzeit", "werkstatt:w-beschreiben"], "ja"]
        ]
      },
      "3": {
        1: [
          ["sn.su3.zl.01", "Menschen anderer Kulturen begegnen, Feste und Gewohnheiten, Globus und Atlas", "3", ["sachkunde:kulturen", "sachkunde:geschenkebringer"], "ja"],
          ["sn.su3.zl.02", "Leben auf dem Land früher und heute: Arbeit, Geräte, Berufe, Rollen, Freizeit", "3", ["sachkunde:land-frueher"], "ja"],
          ["sn.su3.zl.03", "Bücher, Lexika, Kindersuchmaschinen und Nachrichten als Informationsquelle", "3", ["sachkunde:medien-info", "werkstatt:w-buch-finden"], "ja"]
        ],
        2: [
          ["sn.su3.kg.01", "Sinnesorgane, Sinnestäuschungen, Hilfe für Menschen mit Behinderung", "3", ["sachkunde:sinne", "sachkunde:sinne-genau"], "ja"],
          ["sn.su3.kg.02", "Aufbau und Leistung eines Sinnesorgans (Auge, Ohr)", "3", ["sachkunde:sinne-genau"], "ja"],
          ["sn.su3.kg.03", "Sinnesorgane schützen", "3", ["sachkunde:sinne-genau", "sachkunde:sinne"], "ja"],
          ["sn.su3.kg.04", "Gefahren durch Rauchen, Alkohol, Medikamente; Nein sagen, Gruppendruck", "3", ["sachkunde:nein-sagen"], "ja"]
        ],
        3: [
          ["sn.su3.pt.01", "Drei Getreidearten unterscheiden; Ähre, Rispe, Kolben", "3", ["sachkunde:getreide", "sachkunde:brot"], "ja"],
          ["sn.su3.pt.02", "Vom Korn zum Brot", "3", ["sachkunde:brot"], "ja"],
          ["sn.su3.pt.03", "Die Kartoffel: Anbau, Knollen, giftige Beeren, Kartoffelkäfer", "3", ["sachkunde:getreide", "sachkunde:brot"], "ja"],
          ["sn.su3.pt.04", "Lebensmittel wertschätzen, Hunger in der Welt", "3", ["sachkunde:getreide"], "ja"],
          ["sn.su3.pt.05", "Lebensraum Wiese: Stockwerke, Kleintiere und ihre Entwicklung", "3", ["sachkunde:wiese", "sachkunde:wald"], "ja"],
          ["sn.su3.pt.06", "Wiesenpflanzen bestimmen, Artenschutz", "3", ["sachkunde:wiese"], "ja"]
        ],
        4: [
          ["sn.su3.un.01", "Wettervorhersage, Wetterkarten, Bauernregeln, Wetter-Apps", "3", ["sachkunde:wetterkarte", "sachkunde:wetter"], "ja"],
          ["sn.su3.un.02", "Wasser fest, flüssig, gasförmig; gefrieren, schmelzen, verdampfen, verdunsten, kondensieren", "3", ["sachkunde:wasserkreislauf", "sachkunde:wasser"], "ja"],
          ["sn.su3.un.03", "Kreislauf des Wassers, die Sonne als Antrieb, Wasser schützen", "3", ["sachkunde:wasserkreislauf"], "ja"],
          ["sn.su3.un.04", "Schwimmen und Sinken: Material, Form, Salzwasser", "3", ["sachkunde:schwimmen"], "ja"]
        ],
        5: [
          ["sn.su3.rz.01", "Haupt- und Nebenhimmelsrichtungen, Tagbogen der Sonne", "3", ["sachkunde:kompass", "sachkunde:karten-lesen"], "ja"],
          ["sn.su3.rz.02", "Mit Plan und Kompass orientieren, Grundriss, Karte einnorden", "3", ["sachkunde:karten-lesen", "sachkunde:kompass"], "ja"],
          ["sn.su3.rz.03", "Karten lesen: Nordpfeil, Legende, Lage beschreiben", "3", ["sachkunde:karten-lesen"], "ja"],
          ["sn.su3.rz.04", "Den eigenen Landkreis kennen: Lage, Städte, Gewässer, Wirtschaft, Kreisstadt, Bräuche", "3", ["sachkunde:landkreis", "sachkunde:lk-sachsen", "sachkunde:lk-bautzen", "sachkunde:lk-goerlitz", "sachkunde:lk-saechsische-schweiz", "sachkunde:lk-meissen", "sachkunde:lk-mittelsachsen", "sachkunde:lk-erzgebirge", "sachkunde:lk-zwickau", "sachkunde:lk-vogtland", "sachkunde:lk-leipzig-land", "sachkunde:lk-nordsachsen", "sachkunde:lk-dresden", "sachkunde:lk-leipzig", "sachkunde:lk-chemnitz"], "ja"],
          ["sn.su3.rz.05", "Verkehrsregeln für Fußgänger und Radfahrer, verkehrssicheres Fahrrad", "3", ["sachkunde:fahrrad"], "ja"],
          ["sn.su3.rz.06", "Rad fahren üben, Helm", "3", ["sachkunde:fahrrad", "echtewelt:radfahren"], "aussen"]
        ],
        6: [
          ["sn.su3.ex.01", "Ein Experiment planen, durchführen, auswerten und darauf zurückblicken", "3", ["sachkunde:experiment"], "ja"]
        ]
      },
      "4": {
        1: [
          ["sn.su4.zl.01", "Schule früher und in anderen Ländern, Recht auf Bildung, Kinderrechte", "4", ["sachkunde:schule-frueher", "sachkunde:kinderrechte"], "ja"],
          ["sn.su4.zl.02", "Bildungswege nach der Grundschule, Befragung vorbereiten", "4", ["sachkunde:neue-schule", "werkstatt:w-interview"], "ja"],
          ["sn.su4.zl.03", "Medien zum Informieren und Lernen: Vor- und Nachteile, Nachrichten, Finanzierung", "4", ["sachkunde:medien-welt", "sachkunde:medien-info"], "ja"],
          ["sn.su4.zl.04", "Digitale Kommunikation: Vor- und Nachteile, Regeln", "4", ["sachkunde:medien-welt", "werkstatt:w-email"], "ja"],
          ["sn.su4.zl.05", "Urheber- und Persönlichkeitsrechte, Datenschutz", "4", ["sachkunde:medien-welt", "medien:daten"], "ja"],
          ["sn.su4.zl.06", "Wie Medien Gefühle, Freizeit, Kaufen und Essen beeinflussen", "4", ["sachkunde:medien-welt", "medien:werbung"], "ja"],
          ["sn.su4.zl.07", "Leben in einer Stadt früher und heute: Familie, Arbeit, Berufe", "4", ["sachkunde:stadt-frueher"], "ja"],
          ["sn.su4.zl.08", "Veränderungen in der Stadt, Zukunft mitgestalten", "4", ["sachkunde:stadt-frueher", "sachkunde:gemeinde"], "ja"]
        ],
        2: [
          ["sn.su4.kg.01", "Pubertät, Hygiene, Schutz vor sexueller Gewalt, gegenseitige Achtung", "4", ["sachkunde:gross-werden"], "ja"],
          ["sn.su4.kg.02", "Atmung und Herzschlag, Puls in Ruhe und nach Anstrengung", "4", ["sachkunde:herz-lunge"], "ja"],
          ["sn.su4.kg.03", "Sucht: Ursachen, Wirkung, Vorbeugung", "4", ["sachkunde:nein-sagen"], "ja"]
        ],
        3: [
          ["sn.su4.pt.01", "Wald als Lebensgemeinschaft; Pflanzen bestimmen, giftige Pilze und Beeren", "4", ["sachkunde:wald", "sachkunde:waldtiere"], "ja"],
          ["sn.su4.pt.02", "Säugetiere des Waldes: Körperbau, Nahrung, Spuren, Junge, Tollwut", "4", ["sachkunde:waldtiere"], "ja"],
          ["sn.su4.pt.03", "Bedeutung und Gefährdung des Waldes", "4", ["sachkunde:waldtiere"], "ja"],
          ["sn.su4.pt.04", "Boden: Leben im Boden, Humus, Kompost, Grundwasser, Boden pflegen", "4", ["sachkunde:boden"], "ja"],
          ["sn.su4.pt.05", "Gewässer: fließend und stehend, Pflanzen und Tiere, Angepasstheit", "4", ["sachkunde:gewaesser"], "ja"],
          ["sn.su4.pt.06", "Natur schützen: Arten, Klima, Wald und Gewässer", "4", ["sachkunde:gewaesser", "sachkunde:waldtiere", "sachkunde:boden"], "ja"]
        ],
        4: [
          ["sn.su4.un.01", "Feuer: Nutzen, Gefahren, Brandschutz", "4", ["sachkunde:feuer"], "ja"],
          ["sn.su4.un.02", "Was ein Feuer braucht, Brennbarkeit verschiedener Stoffe", "4", ["sachkunde:feuer"], "ja"],
          ["sn.su4.un.03", "Gute und schlechte Wärmeleiter, Dämmung im Haushalt", "4", ["sachkunde:waerme"], "ja"]
        ],
        5: [
          ["sn.su4.rz.01", "Karte von Sachsen: Himmelsrichtungen, Farben, Entfernungen mit dem Maßstab", "4", ["sachkunde:sachsen", "sachkunde:karten-lesen", "mathe:k4massstab"], "ja"],
          ["sn.su4.rz.02", "Sachsen: Lage, Größe, Einwohner, Gebirge, Flüsse, Regionen und Städte", "4", ["sachkunde:sachsen", "sachkunde:sachsen-entdecken"], "ja"],
          ["sn.su4.rz.03", "Dresden: Sitz der Landesregierung, Kunst und Kultur", "4", ["sachkunde:sachsen-entdecken", "sachkunde:sachsen"], "ja"],
          ["sn.su4.rz.04", "Sorbische Kultur: Zweisprachigkeit, Bräuche", "4", ["sachkunde:sachsen-entdecken", "sachkunde:sachsen"], "ja"],
          ["sn.su4.rz.05", "Radfahrprüfung: Vorfahrt, Linksabbiegen, Überholen, Verkehrszeichen", "4", ["sachkunde:radfahrpruefung", "sachkunde:fahrrad"], "ja"],
          ["sn.su4.rz.06", "Abschlusskontrollfahrt mit dem Rad", "4", ["echtewelt:radfahren"], "aussen"]
        ],
        6: [
          ["sn.su4.me.01", "Informationen aus verschiedenen Quellen auswählen, Urheberrecht beachten", "4", ["sachkunde:medien-info", "sachkunde:medien-welt"], "ja"],
          ["sn.su4.me.02", "Eine Präsentation zu einem Thema gestalten und vortragen, Kriterien zur Bewertung", "4", ["praesentieren:folien", "werkstatt:w-vortrag", "werkstatt:w-rueckmeldung"], "ja"]
        ]
      }
    },
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
          ["sn.de12.sc.04", "Schulausgangsschrift lernen und zunehmend flüssig schreiben; Schrift prüfen (Größe, Abstände, Form)", "2", ["lesen:schreibschrift", "echtewelt:schreibschrift"], "aussen"],
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
          ["sn.de12.sc.19", "Texte gestalten: Überschrift, Platz einteilen, hervorheben, am Gerät schreiben", "2", ["praesentieren:gestalten", "werkstatt:w-beschreiben", "werkstatt:w-einladung"], "ja"],
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
          ["sn.de12.le.07", "Flüssig lesen: still, leise und laut, genau, im passenden Tempo; Lautleseverfahren", "2", ["vorlesen:laut", "werkstatt:w-lautlesen", "lesen:texte"], "ja"],
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
          ["sn.de3.sc.01", "Individuelle Handschrift: automatisiert, leserlich, flüssig", "3", ["lesen:schreibschrift", "echtewelt:schreibschrift"], "aussen"],
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
          ["sn.de3.sc.17", "Digitale Texte gestalten: Schriftart, Größe, hervorheben, Absatz", "3", ["praesentieren:gestalten", "werkstatt:w-digital-schreiben"], "ja"],
          ["sn.de3.sc.18", "Kreativ und produktiv schreiben: nach Bildern, Musik, Fantasie; weiterschreiben, umschreiben, gemeinsam", "3", ["werkstatt:w-weiterschreiben", "werkstatt:w-bildergeschichte"], "ja"],
          ["sn.de3.sc.19", "Überarbeiten: stilistisch, grammatisch, orthografisch; Textlupe und Schreibkonferenz", "3", ["werkstatt:w-textlupe", "werkstatt:w-ueberarbeiten"], "ja"],
          ["sn.de3.sc.20", "Digitale Schreibwerkzeuge zum Überarbeiten (Rechtschreibprüfung)", "3", ["praesentieren:pruefen", "werkstatt:w-textlupe", "werkstatt:w-digital-schreiben"], "ja"],
          ["sn.de3.sc.21", "Fachbegriffe: nachgestellter Wortbaustein, Komma, Doppelpunkt, Anführungszeichen, Trennstrich", "3", ["werkstatt:w-trennen", "werkstatt:w-vornach", "werkstatt:w-rede"], "ja"]
        ],
        3: [
          ["sn.de3.le.01", "Flüssig, zügig und sinngestaltend lesen; Lautleseverfahren, Lesetheater", "3", ["vorlesen:laut", "vorlesen:theater", "werkstatt:w-lautlesen", "werkstatt:w-theater"], "ja"],
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
          ["sn.de4.le.01", "Selbstbestimmt lesen; Laut- und Vielleseverfahren", "4", ["vorlesen:laut", "vorlesen:pass", "werkstatt:w-lautlesen"], "ja"],
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
          ["sn.de4.tm.07", "Digitale Werkzeuge für Präsentationen, Podcasts und Wikis nutzen", "4", ["praesentieren:folien", "praesentieren:podcast", "praesentieren:wiki", "werkstatt:w-vortrag"], "ja"],
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
    },
    // Sorbisch als Muttersprache (Lehrplan Grundschule Sorbisch 2004): Inhaltspunkte je Lernbereich, nur zusammengefasst
    sorbischmutter: {
      "1/2": {
        1: [ // Schriftspracherwerb (Přiswojenje spisowneje rěče)
          ["sn.sm12.1.01", "Bedeutung von Lesen und Schreiben, Schrift als Zeichensystem", "1/2", ["sorbisch:sm-pismiki", "sorbisch:sm-slowa"], "ja"],
          ["sn.sm12.1.02", "Laute hören und unterscheiden, Wörter in Silben gliedern, reimen", "1/2", ["sorbisch:sm-zlozki"], "teil"],
          ["sn.sm12.1.03", "Buchstaben und Laut-Buchstaben-Beziehungen, auch č, ć, dź, ł, š, ž", "1/2", ["sorbisch:sm-pismiki"], "ja"],
          ["sn.sm12.1.04", "Lesetechnik: Wörter, Sätze und kurze Texte lesen", "1/2", ["sorbisch:sm-slowa", "sorbisch:sm-mica"], "ja"],
          ["sn.sm12.1.05", "Druckschrift und Schulausgangsschrift schreiben", "1/2", ["lesen:schreibschrift"], "teil"]
        ],
        2: [ // Sprechen und Zuhören (Rěčeć a připosłuchać)
          ["sn.sm12.2.01", "Erlebnisse und Geschichten zusammenhängend erzählen", "1/2", [], "nein"],
          ["sn.sm12.2.02", "Einander aktiv zuhören, Gesprächsregeln finden und einhalten", "1/2", ["sorbisch:sm-rozmolwa"], "teil"],
          ["sn.sm12.2.03", "Grüßen, sich entschuldigen, bitten, danken, wünschen, einladen", "1/2", ["sorbisch:sm-zdwoliwy"], "ja"],
          ["sn.sm12.2.04", "Ausdrucksmittel: Stimme, Mimik, Gestik; Dialekt, Umgangs- und Standardsprache", "1/2", ["sorbisch:sm-dziwadlo"], "teil"]
        ],
        3: [ // Für sich und andere schreiben (Za sebje a druhich pisać)
          ["sn.sm12.3.01", "Schreibanlässe nutzen, Ideen sammeln, für andere verständlich schreiben", "1/2", ["sorbisch:sm-preprosenje"], "teil"],
          ["sn.sm12.3.02", "Gebrauchsformen: Einladung, Glückwunsch, Brief", "1/2", ["sorbisch:sm-preprosenje", "sorbisch:sm-zdwoliwy"], "ja"],
          ["sn.sm12.3.03", "Texte überarbeiten, gestalten und präsentieren", "1/2", ["praesentieren:gestalten"], "teil"]
        ],
        4: [ // Richtig schreiben (Prawje pisać)
          ["sn.sm12.4.01", "Laute und Buchstaben: stimmhafte und stimmlose Konsonanten, stumme h/ł/w, ähnliche Laute č/ć, ł/w", "1/2", ["sorbisch:sm-cc", "sorbisch:sm-zwuki"], "ja"],
          ["sn.sm12.4.02", "Großschreibung von Vornamen, Familiennamen und Satzanfängen, Satzzeichen", "1/2", ["sorbisch:sm-wulke1"], "ja"],
          ["sn.sm12.4.03", "Orientierungswortschatz und eigene Wörterkartei", "1/2", ["sorbisch:sm-slowa", "sorbisch:sm-cc"], "teil"]
        ],
        5: [ // Lesen und Umgang mit Medien (Čitanje/Wobchad z medijemi)
          ["sn.sm12.5.01", "Sinnentnehmend lesen, Fragen zum Text beantworten", "1/2", ["sorbisch:sm-mica"], "ja"],
          ["sn.sm12.5.02", "Über Gelesenes sprechen, laut und leise lesen", "1/2", ["sorbisch:sm-mica"], "teil"]
        ],
        6: [ // Sprache untersuchen (Rěč přepytować)
          ["sn.sm12.6.01", "Wörter, Silben und Buchstaben untersuchen, Sorbisch und Deutsch vergleichen", "1/2", ["sorbisch:sm-zlozki", "sorbisch:sm-druziny"], "ja"],
          ["sn.sm12.6.02", "Erste Wortarten kennenlernen", "1/2", ["sorbisch:sm-druziny"], "ja"]
        ],
        7: [ // Wahlbereiche (freiwillig)
          ["sn.sm12.7.01", "Wahlbereich Buchstabenfest", "1/2", ["sorbisch:sm-pismiki"], "teil"],
          ["sn.sm12.7.02", "Wahlbereich Sorbische Volksmärchen", "1/2", ["sorbisch:sm-bajki"], "ja"],
          ["sn.sm12.7.03", "Wahlbereich Sorbische Sagengestalten", "1/2", ["sorbisch:sm-bajki", "echtewelt:sage"], "ja"],
          ["sn.sm12.7.04", "Wahlbereich Kasperletheater", "1/2", ["sorbisch:sm-bajki", "sorbisch:sm-dziwadlo"], "ja"]
        ]
      },
      "3": {
        2: [ // Sprechen und Zuhören (Rěčeć a připosłuchać)
          ["sn.sm3.2.01", "Gesprächsregeln und Gesprächsformen (Gespräch über Lerninhalte, Diskussion)", "3", ["sorbisch:sm-rozmolwa"], "ja"],
          ["sn.sm3.2.02", "Zuhören und nachfragen, wenn man etwas nicht versteht", "3", ["sorbisch:sm-rozmolwa"], "teil"],
          ["sn.sm3.2.03", "Erzählen und vortragen", "3", [], "nein"]
        ],
        3: [ // Für sich und andere schreiben (Za sebje a druhich pisać)
          ["sn.sm3.3.01", "Texte planen, Geschichten aufbauen (Anfang, Höhepunkt, Schluss)", "3", ["sorbisch:sm-stawizna"], "ja"],
          ["sn.sm3.3.02", "Texte überarbeiten und präsentieren", "3", ["praesentieren:gestalten"], "teil"]
        ],
        4: [ // Richtig schreiben (Prawje pisać)
          ["sn.sm3.4.01", "Auslaut und Verlängerungsprobe (dub – duby)", "3", ["sorbisch:sm-zwuki"], "ja"],
          ["sn.sm3.4.02", "Ähnlich klingende Laute (č/ć, ł/w)", "3", ["sorbisch:sm-cc"], "ja"],
          ["sn.sm3.4.03", "Kleinschreibung der Substantive, Großschreibung von Namen und Satzanfang", "3", ["sorbisch:sm-druziny", "sorbisch:sm-wulke1"], "ja"]
        ],
        5: [ // Lesen und Umgang mit Medien (Čitanje/Wobchad z medijemi)
          ["sn.sm3.5.01", "Texte lesen und verstehen", "3", ["sorbisch:sm-ptaci"], "ja"],
          ["sn.sm3.5.02", "Kinderzeitschrift und Bibliothek nutzen", "3", ["sorbisch:sm-plomjo"], "ja"]
        ],
        6: [ // Sprache untersuchen (Rěč přepytować)
          ["sn.sm3.6.01", "Wortarten: Substantiv, Verb, Adjektiv", "3", ["sorbisch:sm-druziny"], "ja"],
          ["sn.sm3.6.02", "Den Dual kennen und bilden", "3", ["sorbisch:sm-dual"], "ja"]
        ],
        7: [ // Wahlbereiche (freiwillig)
          ["sn.sm3.7.01", "Wahlbereich Rund um die Płomjo", "3", ["sorbisch:sm-plomjo"], "ja"],
          ["sn.sm3.7.02", "Wahlbereich Mehrsprachigkeit der Lausitz", "3", ["sorbisch:sm-plomjo"], "ja"],
          ["sn.sm3.7.03", "Wahlbereich Zweisprachig Theater spielen", "3", ["sorbisch:sm-dziwadlo"], "ja"]
        ]
      },
      "4": {
        2: [ // Sprechen und Zuhören (Rěčeć a připosłuchać)
          ["sn.sm4.2.01", "Nachrichten und Informationen weitergeben", "4", ["sorbisch:sm-powesc"], "ja"],
          ["sn.sm4.2.02", "Diskutieren und die eigene Meinung sagen", "4", ["sorbisch:sm-rozmolwa"], "teil"]
        ],
        3: [ // Für sich und andere schreiben (Za sebje a druhich pisać)
          ["sn.sm4.3.01", "Einen Brief schreiben (Anrede, Text, Gruß)", "4", ["sorbisch:sm-list"], "ja"],
          ["sn.sm4.3.02", "Eigene Texte schreiben und überarbeiten", "4", ["sorbisch:sm-stawizna", "praesentieren:gestalten"], "teil"]
        ],
        4: [ // Richtig schreiben (Prawje pisać)
          ["sn.sm4.4.01", "Alphabet und Wörterbuch nutzen", "4", ["sorbisch:sm-slownik"], "ja"],
          ["sn.sm4.4.02", "Rechtschreibstrategien anwenden", "4", ["sorbisch:sm-zwuki", "sorbisch:sm-cc"], "ja"]
        ],
        5: [ // Lesen und Umgang mit Medien (Čitanje/Wobchad z medijemi)
          ["sn.sm4.5.01", "Sagen und längere Texte lesen", "4", ["sorbisch:sm-krabat"], "ja"],
          ["sn.sm4.5.02", "Sorbische Medien: Zeitung, Radio, Fernsehen, Verlag", "4", ["sorbisch:sm-medije"], "ja"]
        ],
        6: [ // Sprache untersuchen (Rěč přepytować)
          ["sn.sm4.6.01", "Wortfamilien und Wortstamm", "4", ["sorbisch:sm-swojba"], "ja"],
          ["sn.sm4.6.02", "Wortarten und Formen (auch Dual)", "4", ["sorbisch:sm-druziny", "sorbisch:sm-dual"], "ja"]
        ],
        7: [ // Wahlbereiche (freiwillig)
          ["sn.sm4.7.01", "Wahlbereich Slawische Sprachverwandtschaft", "4", ["sorbisch:sm-slowjan"], "ja"],
          ["sn.sm4.7.02", "Wahlbereich Zweisprachig Theater spielen", "4", ["sorbisch:sm-dziwadlo"], "ja"],
          ["sn.sm4.7.03", "Wahlbereich Sorbisches Fest", "4", ["sorbisch:sm-swjedzen"], "ja"]
        ]
      }
    },
    // Kunst, Musik, Werken, Sport (Kl. 1/2 und 3/4: dieselben Punkte für Kl. 3 und 4), Ethik – Lehrpläne Grundschule Sachsen 2019 (PDFs vom Auftraggeber, 28.10.2026)
    sorbisch: {
      "1/2": {
        1: [ // Meine Familie, meine Freunde und ich
          ["sn.so12.1.01", "Sich kennenlernen, vorstellen, begrüßen und verabschieden", "1/2", ["sorbisch:so-witaj"], "ja"],
          ["sn.so12.1.02", "Die eigene Familie vorstellen", "1/2", ["sorbisch:so-swojba"], "ja"],
          ["sn.so12.1.03", "Das sorbische Lautsystem hören und nachsprechen (Lieder, Reime, Spiele)", "1/2", [], "nein"]
        ],
        2: [ // Mein Körper, meine Kleidung und mein Befinden
          ["sn.so12.2.01", "Körperteile benennen", "1/2", ["sorbisch:so-cylo"], "ja"],
          ["sn.so12.2.02", "Kleidung benennen", "1/2", ["sorbisch:so-drasta"], "ja"],
          ["sn.so12.2.03", "Befinden als Grußformel ausdrücken (Kak so tebi wjedźe?)", "1/2", ["sorbisch:so-witaj"], "ja"]
        ],
        4: [ // In der Schule
          ["sn.so12.4.01", "Schulsachen benennen und nach Anweisung benutzen", "1/2", ["sorbisch:so-sula", "sorbisch:so-prosy"], "ja"],
          ["sn.so12.4.02", "Zahlen bis 20 benennen", "1/2", ["sorbisch:so-licby", "sorbisch:so-licby20"], "ja"],
          ["sn.so12.4.03", "Farben benennen", "1/2", ["sorbisch:so-barby"], "ja"]
        ],
        5: [ // Haus- und Zootiere
          ["sn.so12.5.01", "Ausgewählte Haus- und Bauernhoftiere benennen", "1/2", ["sorbisch:so-zwerjata"], "ja"],
          ["sn.so12.5.02", "Weitere Tiere (Zoo, Wald) kennenlernen", "1/2", ["sorbisch:so-zoo"], "ja"]
        ],
        8: [ // Feste und Bräuche
          ["sn.so12.8.01", "Sorbische Feste und Bräuche kennenlernen: Vogelhochzeit, Ostern, Weihnachten, Geburtstag", "1/2", ["sorbisch:so-swjedzenje"], "ja"],
          ["sn.so12.8.02", "Feste mitfeiern (Vogelhochzeit, Ostereier verzieren)", "1/2", ["sorbisch:so-swjedzenje", "echtewelt:vogelhochzeit", "echtewelt:ostereier"], "ja"]
        ],
        10: [ // Jahreszeiten
          ["sn.so12.10.01", "Jahreszeiten benennen", "1/2", ["sorbisch:so-leto"], "ja"],
          ["sn.so12.10.02", "Typische Naturerscheinungen benennen (Regen, Schnee, Wind, Sonne)", "1/2", ["sorbisch:so-leto"], "ja"],
          ["sn.so12.10.03", "Jahrestypische Aktivitäten benennen", "1/2", ["sorbisch:so-letne"], "ja"]
        ]
      },
      "3": {
        1: [ // Meine Familie, meine Freunde und ich
          ["sn.so34.1.01", "Begrüßen, vorstellen, verabschieden, bedauern", "3", ["sorbisch:so-witaj", "sorbisch:so-preceljo"], "ja"],
          ["sn.so34.1.02", "Auskunft zur eigenen Person: Name, Alter, Wohnort, Familie", "3", ["sorbisch:so-preceljo", "sorbisch:so-swojba"], "ja"],
          ["sn.so34.1.03", "Eine Person beschreiben", "3", ["sorbisch:so-wosoby"], "ja"],
          ["sn.so34.1.04", "Verschiedene Sprecher verstehen, Mimik und Gestik beobachten", "3", ["sorbisch:so-mimika"], "teil"]
        ],
        2: [ // Mein Körper, meine Kleidung und mein Befinden
          ["sn.so34.2.01", "Körperteile, Kleidung, Grund- und Mischfarben", "3", ["sorbisch:so-cylo", "sorbisch:so-drasta", "sorbisch:so-barby"], "ja"],
          ["sn.so34.2.02", "Befinden, Gefühle und Schmerzen ausdrücken und erfragen", "3", ["sorbisch:so-pocucy"], "ja"],
          ["sn.so34.2.03", "Vorlieben und Abneigungen ausdrücken (Lieblingskleidung)", "3", ["sorbisch:so-lubi"], "ja"]
        ],
        3: [ // Zuhause
          ["sn.so34.3.01", "Zimmer, Einrichtungs- und Gebrauchsgegenstände", "3", ["sorbisch:so-doma"], "ja"],
          ["sn.so34.3.02", "Lagebeziehungen, Besitz und Tätigkeiten im Haus", "3", ["sorbisch:so-doma", "sorbisch:so-hdze"], "ja"]
        ],
        4: [ // In der Schule
          ["sn.so34.4.01", "Schulsachen, Inhalt der Federtasche, Klassenzimmer", "3", ["sorbisch:so-sula"], "ja"],
          ["sn.so34.4.02", "Wochentage, Tagesabschnitte, Schulfächer", "3", ["sorbisch:so-tydzen", "sorbisch:so-predmety", "sorbisch:so-dzen"], "ja"],
          ["sn.so34.4.03", "Uhrzeit erfragen und angeben (volle Stunden)", "3", ["sorbisch:so-hodzina"], "ja"]
        ],
        5: [ // Haus- und Zootiere
          ["sn.so34.5.01", "Haustiere, Tiere auf dem Bauernhof und im Zoo", "3", ["sorbisch:so-zwerjata", "sorbisch:so-zoo"], "ja"],
          ["sn.so34.5.02", "Tiere beschreiben: Eigenschaften, Lebensraum, Wunschtier", "3", ["sorbisch:so-zoo", "sorbisch:so-wopis"], "ja"]
        ],
        6: [ // Sport und Freizeit
          ["sn.so34.6.01", "Hobbys, Spiel- und Sportmöglichkeiten benennen", "3", ["sorbisch:so-sport"], "ja"],
          ["sn.so34.6.02", "Vorlieben ausdrücken (Ja rady …), sich austauschen", "3", ["sorbisch:so-sport", "sorbisch:so-rady"], "ja"]
        ],
        7: [ // Beim Einkaufen
          ["sn.so34.7.01", "Zahlwörter bis 100", "3", ["sorbisch:so-licby100", "sorbisch:so-dzesatki"], "ja"],
          ["sn.so34.7.02", "Lebensmittel, Speisen und Getränke, typisch sorbische Speisen", "3", ["sorbisch:so-jedz"], "ja"],
          ["sn.so34.7.03", "Kleine Verkaufsgespräche: Preise, bitten, danken, höflich sein", "3", ["sorbisch:so-wobchod", "sorbisch:so-witaj"], "ja"]
        ],
        8: [ // Feste und Bräuche
          ["sn.so34.8.01", "Sorbische Feste und Bräuche im Jahreskreis (Vogelhochzeit, Osterreiten, Ostereier)", "3", ["sorbisch:so-swjedzenje", "sorbisch:so-jutry", "echtewelt:osterreiten", "echtewelt:ostereier"], "ja"],
          ["sn.so34.8.02", "Grüße und Wünsche formulieren", "3", ["sorbisch:so-jutry"], "ja"],
          ["sn.so34.8.03", "Geburtstage, Namenstage, Kalender", "3", ["sorbisch:so-mesacy", "sorbisch:so-mjeniny", "echtewelt:namenstag"], "ja"]
        ],
        9: [ // Unterwegs und auf Reisen
          ["sn.so34.9.01", "Sehenswürdigkeiten und Ausflugsziele in Ober- und Niederlausitz", "3", ["sorbisch:so-puc", "sorbisch:so-luzica", "sorbisch:so-mjena", "echtewelt:ortsschild"], "ja"],
          ["sn.so34.9.02", "Verkehrsmittel", "3", ["sorbisch:so-puc"], "ja"],
          ["sn.so34.9.03", "Orientierung im Ort, einfache Wegbeschreibung", "3", ["sorbisch:so-wjes"], "ja"]
        ],
        10: [ // Die Natur im Laufe des Jahres
          ["sn.so34.10.01", "Monate (sorbische Monatsnamen) und Jahreszeiten", "3", ["sorbisch:so-mesacy", "sorbisch:so-leto"], "ja"],
          ["sn.so34.10.02", "Wetter, Himmelsrichtungen", "3", ["sorbisch:so-leto", "sorbisch:so-strony"], "ja"],
          ["sn.so34.10.03", "Pflanzen und Tiere von Wald, Wiese, Gewässer", "3", ["sorbisch:so-priroda", "sorbisch:so-zoo"], "ja"],
          ["sn.so34.10.04", "Datum angeben, Ordnungszahlen", "3", ["sorbisch:so-datum"], "ja"]
        ],
        11: [ // Mein Portfolio
          ["sn.so34.11.01", "Sprachen nennen, die man lernt und benutzt (auch Familiensprachen)", "3", ["sorbisch:so-rece"], "ja"],
          ["sn.so34.11.02", "Sprachenbiografie und Dossier: Lernerfolge zeigen", "3", ["sorbisch:so-rece", "echtewelt:sorbischmappe"], "ja"]
        ],
        12: [ // Wahlbereiche (freiwillig)
          ["sn.so34.w.01", "Wahlbereich Heimatregion: Lausitz, Ober- und Niederlausitz, Dorf und Stadt, sorbische Fahne", "3", ["sorbisch:so-domizna"], "ja"],
          ["sn.so34.w.02", "Wahlbereich Eine Stadt in der Lausitz (Bautzen)", "3", ["sorbisch:so-budysin"], "ja"],
          ["sn.so34.w.03", "Wahlbereich Sagengestalten (Krabat, Wassermann, Mittagsfrau, Lutki)", "3", ["sorbisch:so-baje", "echtewelt:sage"], "ja"],
          ["sn.so34.w.04", "Wahlbereich Osterbräuche (Ostereier, Osterreiten, Osterwasser, Osterfeuer)", "3", ["sorbisch:so-jutrowne", "echtewelt:ostereier"], "ja"]
        ]
      },
      "4": {
        1: [ // Meine Familie, meine Freunde und ich
          ["sn.so34.1.01", "Begrüßen, vorstellen, verabschieden, bedauern", "4", ["sorbisch:so-witaj", "sorbisch:so-preceljo"], "ja"],
          ["sn.so34.1.02", "Auskunft zur eigenen Person: Name, Alter, Wohnort, Familie", "4", ["sorbisch:so-preceljo", "sorbisch:so-swojba"], "ja"],
          ["sn.so34.1.03", "Eine Person beschreiben", "4", ["sorbisch:so-wosoby"], "ja"],
          ["sn.so34.1.04", "Verschiedene Sprecher verstehen, Mimik und Gestik beobachten", "4", ["sorbisch:so-mimika"], "teil"]
        ],
        2: [ // Mein Körper, meine Kleidung und mein Befinden
          ["sn.so34.2.01", "Körperteile, Kleidung, Grund- und Mischfarben", "4", ["sorbisch:so-cylo", "sorbisch:so-drasta", "sorbisch:so-barby"], "ja"],
          ["sn.so34.2.02", "Befinden, Gefühle und Schmerzen ausdrücken und erfragen", "4", ["sorbisch:so-pocucy"], "ja"],
          ["sn.so34.2.03", "Vorlieben und Abneigungen ausdrücken (Lieblingskleidung)", "4", ["sorbisch:so-lubi"], "ja"]
        ],
        3: [ // Zuhause
          ["sn.so34.3.01", "Zimmer, Einrichtungs- und Gebrauchsgegenstände", "4", ["sorbisch:so-doma"], "ja"],
          ["sn.so34.3.02", "Lagebeziehungen, Besitz und Tätigkeiten im Haus", "4", ["sorbisch:so-doma", "sorbisch:so-hdze"], "ja"]
        ],
        4: [ // In der Schule
          ["sn.so34.4.01", "Schulsachen, Inhalt der Federtasche, Klassenzimmer", "4", ["sorbisch:so-sula"], "ja"],
          ["sn.so34.4.02", "Wochentage, Tagesabschnitte, Schulfächer", "4", ["sorbisch:so-tydzen", "sorbisch:so-predmety", "sorbisch:so-dzen"], "ja"],
          ["sn.so34.4.03", "Uhrzeit erfragen und angeben (volle Stunden)", "4", ["sorbisch:so-hodzina"], "ja"]
        ],
        5: [ // Haus- und Zootiere
          ["sn.so34.5.01", "Haustiere, Tiere auf dem Bauernhof und im Zoo", "4", ["sorbisch:so-zwerjata", "sorbisch:so-zoo"], "ja"],
          ["sn.so34.5.02", "Tiere beschreiben: Eigenschaften, Lebensraum, Wunschtier", "4", ["sorbisch:so-zoo", "sorbisch:so-wopis"], "ja"]
        ],
        6: [ // Sport und Freizeit
          ["sn.so34.6.01", "Hobbys, Spiel- und Sportmöglichkeiten benennen", "4", ["sorbisch:so-sport"], "ja"],
          ["sn.so34.6.02", "Vorlieben ausdrücken (Ja rady …), sich austauschen", "4", ["sorbisch:so-sport", "sorbisch:so-rady"], "ja"]
        ],
        7: [ // Beim Einkaufen
          ["sn.so34.7.01", "Zahlwörter bis 100", "4", ["sorbisch:so-licby100", "sorbisch:so-dzesatki"], "ja"],
          ["sn.so34.7.02", "Lebensmittel, Speisen und Getränke, typisch sorbische Speisen", "4", ["sorbisch:so-jedz"], "ja"],
          ["sn.so34.7.03", "Kleine Verkaufsgespräche: Preise, bitten, danken, höflich sein", "4", ["sorbisch:so-wobchod", "sorbisch:so-witaj"], "ja"]
        ],
        8: [ // Feste und Bräuche
          ["sn.so34.8.01", "Sorbische Feste und Bräuche im Jahreskreis (Vogelhochzeit, Osterreiten, Ostereier)", "4", ["sorbisch:so-swjedzenje", "sorbisch:so-jutry", "echtewelt:osterreiten", "echtewelt:ostereier"], "ja"],
          ["sn.so34.8.02", "Grüße und Wünsche formulieren", "4", ["sorbisch:so-jutry"], "ja"],
          ["sn.so34.8.03", "Geburtstage, Namenstage, Kalender", "4", ["sorbisch:so-mesacy", "sorbisch:so-mjeniny", "echtewelt:namenstag"], "ja"]
        ],
        9: [ // Unterwegs und auf Reisen
          ["sn.so34.9.01", "Sehenswürdigkeiten und Ausflugsziele in Ober- und Niederlausitz", "4", ["sorbisch:so-puc", "sorbisch:so-luzica", "sorbisch:so-mjena", "echtewelt:ortsschild"], "ja"],
          ["sn.so34.9.02", "Verkehrsmittel", "4", ["sorbisch:so-puc"], "ja"],
          ["sn.so34.9.03", "Orientierung im Ort, einfache Wegbeschreibung", "4", ["sorbisch:so-wjes"], "ja"]
        ],
        10: [ // Die Natur im Laufe des Jahres
          ["sn.so34.10.01", "Monate (sorbische Monatsnamen) und Jahreszeiten", "4", ["sorbisch:so-mesacy", "sorbisch:so-leto"], "ja"],
          ["sn.so34.10.02", "Wetter, Himmelsrichtungen", "4", ["sorbisch:so-leto", "sorbisch:so-strony"], "ja"],
          ["sn.so34.10.03", "Pflanzen und Tiere von Wald, Wiese, Gewässer", "4", ["sorbisch:so-priroda", "sorbisch:so-zoo"], "ja"],
          ["sn.so34.10.04", "Datum angeben, Ordnungszahlen", "4", ["sorbisch:so-datum"], "ja"]
        ],
        11: [ // Mein Portfolio
          ["sn.so34.11.01", "Sprachen nennen, die man lernt und benutzt (auch Familiensprachen)", "4", ["sorbisch:so-rece"], "ja"],
          ["sn.so34.11.02", "Sprachenbiografie und Dossier: Lernerfolge zeigen", "4", ["sorbisch:so-rece", "echtewelt:sorbischmappe"], "ja"]
        ],
        12: [ // Wahlbereiche (freiwillig)
          ["sn.so34.w.01", "Wahlbereich Heimatregion: Lausitz, Ober- und Niederlausitz, Dorf und Stadt, sorbische Fahne", "4", ["sorbisch:so-domizna"], "ja"],
          ["sn.so34.w.02", "Wahlbereich Eine Stadt in der Lausitz (Bautzen)", "4", ["sorbisch:so-budysin"], "ja"],
          ["sn.so34.w.03", "Wahlbereich Sagengestalten (Krabat, Wassermann, Mittagsfrau, Lutki)", "4", ["sorbisch:so-baje", "echtewelt:sage"], "ja"],
          ["sn.so34.w.04", "Wahlbereich Osterbräuche (Ostereier, Osterreiten, Osterwasser, Osterfeuer)", "4", ["sorbisch:so-jutrowne", "echtewelt:ostereier"], "ja"]
        ]
      }
    },
    kunst: {
      "1/2": {
        1: [ // Flächiges Gestalten
          ["sn.ku12.1.01", "Bildträger, Mal- und Zeichenwerkzeuge und Techniken erproben (Stifte, Kreide, Wasserfarbe, Scherenschnitt)", "1/2", ["atelier:malen", "echtewelt:collage"], "aussen"],
          ["sn.ku12.1.02", "Grund- und Mischfarben, Farbkreis, aufhellen und abdunkeln", "1/2", ["sachkunde:ku-farben", "echtewelt:farbkreis"], "ja"],
          ["sn.ku12.1.03", "Farbauftrag: deckend, lasierend, tupfen, klecksen, spritzen; Werke dazu betrachten", "1/2", ["sachkunde:ku-farbauftrag"], "ja"],
          ["sn.ku12.1.04", "Punkt, Linie und Muster, Linie als Bewegungsspur, digital malen", "1/2", ["sachkunde:ku-linie", "atelier:malen"], "ja"],
          ["sn.ku12.1.05", "Einfache Druckverfahren: Finger-, Stempel-, Materialdruck, Abklatsch, Abdrücke", "1/2", ["sachkunde:ku-drucken", "echtewelt:stempel"], "ja"],
          ["sn.ku12.1.06", "Formen und Bildaufbau: rund–eckig, offen–geschlossen, Reihen, Ballen, Streuen", "1/2", ["sachkunde:ku-formen"], "ja"],
          ["sn.ku12.1.07", "Buchstaben und Ziffern als Gestaltungsmittel", "1/2", ["sachkunde:ku-formen"], "ja"],
          ["sn.ku12.1.08", "Gestaltungspraktiken kombinieren: Collage, Frottage, einfaches Malprogramm", "1/2", ["sachkunde:ku-formen", "atelier:malen"], "ja"]
        ],
        2: [ // Körperhaft-räumliches Gestalten
          ["sn.ku12.2.01", "Plastische Objekte betrachten, betasten, beschreiben; Begriff Plastik", "1/2", ["sachkunde:ku-plastik"], "ja"],
          ["sn.ku12.2.02", "Modellieren mit Ton, Knete, Salzteig, Sand: antragen, abtragen, Abdrücke", "1/2", ["sachkunde:ku-plastik", "echtewelt:kneten"], "aussen"],
          ["sn.ku12.2.03", "Mit Kartons, Rollen, Korken und Naturfundstücken bauen", "1/2", ["sachkunde:ku-plastik", "echtewelt:turm"], "aussen"],
          ["sn.ku12.2.04", "Innen- und Außenräume erleben und umgestalten, Labyrinthe, Tierbauten", "1/2", ["sachkunde:ku-plastik", "echtewelt:hoehle"], "aussen"]
        ],
        3: [ // Aktionsbetontes Gestalten
          ["sn.ku12.3.01", "Spielerische Zugänge zu Kunstwerken: Ich sehe was, Geräusche erfinden, Titel und Geschichten", "1/2", ["sachkunde:ku-sinne"], "ja"],
          ["sn.ku12.3.02", "Szenisches Spiel mit Figuren, Puppen und Schattenfiguren", "1/2", ["sachkunde:ku-sinne", "echtewelt:lebendesbild"], "aussen"],
          ["sn.ku12.3.03", "Farb- und Formaktionen: sammeln, sortieren, arrangieren, große Malaktionen", "1/2", ["echtewelt:landart"], "aussen"],
          ["sn.ku12.3.04", "Körperhaltungen, Mimik, Gestik, Verkleiden und Masken", "1/2", ["sachkunde:ku-sinne"], "ja"]
        ]
      },
      "3": {
        1: [ // Flächiges Gestalten
          ["sn.ku3.1.01", "Bekannte Techniken erweitern: skizzieren, drucken, schneiden, fotografieren", "3", ["atelier:malen", "echtewelt:frottage"], "aussen"],
          ["sn.ku3.1.02", "Farben als Träger von Stimmungen: Harmonie, Kontraste, Signalfarben", "3", ["sachkunde:ku-farbgefuehl"], "ja"],
          ["sn.ku3.1.03", "Farben abstufen (trüben, tönen), Pinselführung und Farbverlauf", "3", ["sachkunde:ku-farbgefuehl", "sachkunde:ku-farbauftrag"], "ja"],
          ["sn.ku3.1.04", "Hell-Dunkel-Kontrast, Oberflächenstrukturen, optische Täuschungen", "3", ["sachkunde:ku-hell-dunkel"], "ja"],
          ["sn.ku3.1.05", "Ein besonderes Druckverfahren: Monotypie, Frottage, Materialdruck", "3", ["sachkunde:ku-hell-dunkel", "echtewelt:frottage"], "ja"],
          ["sn.ku3.1.06", "Bildaufbau: Überdeckung, Größe, Farbabstufung, Figur und Grund", "3", ["sachkunde:ku-bildraum"], "ja"],
          ["sn.ku3.1.07", "Schrift als Gestaltungsmittel: Monogramm, Geheimschrift, Kalligrafie", "3", ["sachkunde:ku-schrift-foto"], "ja"],
          ["sn.ku3.1.08", "Fotografie: Bildausschnitt, Lochkamera, Licht und Schatten", "3", ["sachkunde:ku-schrift-foto"], "ja"],
          ["sn.ku3.1.09", "Persönlichkeitsrechte und Urheberrecht bei Bildern", "3", ["sachkunde:ku-schrift-foto"], "ja"],
          ["sn.ku3.1.10", "Bilder digital bearbeiten und verfremden", "3", ["atelier:verfremden", "atelier:malen"], "ja"]
        ],
        2: [ // Körperhaft-räumliches Gestalten
          ["sn.ku3.2.01", "Bildhauer und ihre Arbeitsweise, Formbarkeit von Materialien", "3", ["sachkunde:ku-bildhauer"], "ja"],
          ["sn.ku3.2.02", "Modellieren mit Ton, Gips und Pappmaché, Figuren", "3", ["echtewelt:kneten"], "aussen"],
          ["sn.ku3.2.03", "Montagen aus Fundstücken, Upcycling", "3", ["sachkunde:ku-bildhauer"], "ja"],
          ["sn.ku3.2.04", "Design: Gebrauchsgegenstände gestalten und prüfen", "3", ["sachkunde:ku-bildhauer"], "ja"],
          ["sn.ku3.2.05", "Kunst in Außenräumen: Land-Art, Urban Art", "3", ["sachkunde:ku-bildhauer", "echtewelt:landart"], "ja"]
        ],
        3: [ // Aktionsbetontes Gestalten
          ["sn.ku3.3.01", "Spielerische Methoden der Kunstbetrachtung: verdecken, Puzzle, Klanggeschichten, Elfchen, Brief an das Werk", "3", ["sachkunde:ku-aktion3"], "ja"],
          ["sn.ku3.3.02", "Körper und Bewegung: Rollenspiel, Pantomime, Schattenfiguren", "3", ["sachkunde:ku-aktion3"], "ja"],
          ["sn.ku3.3.03", "Lebende Bilder und Aktionen mit Farben und Formen, dokumentieren", "3", ["sachkunde:ku-aktion3", "echtewelt:lebendesbild"], "aussen"]
        ]
      },
      "4": {
        1: [ // Flächiges Gestalten
          ["sn.ku4.1.01", "Material, Format und Technik passend zur Gestaltungsabsicht wählen", "4", ["atelier:malen", "echtewelt:collage"], "aussen"],
          ["sn.ku4.1.02", "Gemälde und Grafik; Farben und Formen für Stimmung, Signal und Raum", "4", ["sachkunde:ku-gemaelde", "sachkunde:ku-farbgefuehl"], "ja"],
          ["sn.ku4.1.03", "Darstellungsweisen vergleichen: Landschaft, Porträt, Stillleben, Urban Art", "4", ["sachkunde:ku-gemaelde"], "ja"],
          ["sn.ku4.1.04", "Druckverfahren variieren: Monogramme, Piktogramme, Logos", "4", ["sachkunde:ku-medienbild"], "ja"],
          ["sn.ku4.1.05", "Bildsprache in Medien: Werbung prüfen, Plakat, Comic, Collage", "4", ["sachkunde:ku-medienbild"], "ja"]
        ],
        2: [ // Körperhaft-räumliches Gestalten
          ["sn.ku4.2.01", "Relief, bewegliche Objekte, Windspiele, Klangskulpturen", "4", ["sachkunde:ku-architektur", "echtewelt:windspiel"], "ja"],
          ["sn.ku4.2.02", "Rauminstallationen und Raummodelle", "4", ["echtewelt:hoehle"], "aussen"],
          ["sn.ku4.2.03", "Architektur: Form und Funktion, Kirchen, Brücken, Gewölbe", "4", ["sachkunde:ku-architektur", "echtewelt:architektur"], "ja"]
        ],
        3: [ // Aktionsbetontes Gestalten
          ["sn.ku4.3.01", "Aktionsmethoden: Bilddiktat, fiktives Interview, Motive weiterspinnen", "4", ["sachkunde:ku-aktion4"], "ja"],
          ["sn.ku4.3.02", "Eine Aktion planen und durchführen: lebende Bilder, Schattenspiel, Performance", "4", ["sachkunde:ku-aktion4", "echtewelt:lebendesbild"], "aussen"],
          ["sn.ku4.3.03", "Aktionskunst kennenlernen und dokumentieren", "4", ["sachkunde:ku-aktion4"], "ja"]
        ]
      }
    },
    musik: {
      "1/2": {
        1: [ // Musik erfinden, wiedergeben und gestalten mit der Stimme
          ["sn.mu12.1.01", "Stimme als Instrument: Geräusche nachahmen, Texte und Bilder verklanglichen", "1/2", ["sachkunde:mu-stimme"], "ja"],
          ["sn.mu12.1.02", "Grundton spüren, Melodiebausteine wiedererkennen", "1/2", ["atelier:erkennen", "atelier:musik"], "ja"],
          ["sn.mu12.1.03", "Rhythmus und Melodie beim Sprechen: Verse rhythmisieren", "1/2", ["sachkunde:mu-rhythmus", "lesen:silben"], "ja"],
          ["sn.mu12.1.04", "Grundlagen des Singens: Haltung, Atmung, Tonbildung", "1/2", ["sachkunde:mu-stimme"], "ja"],
          ["sn.mu12.1.05", "Im Klassengesang singen, Kanon-Vorübungen, etwa sechs Lieder auswendig", "1/2", ["atelier:lieder", "echtewelt:singen"], "aussen"]
        ],
        2: [ // Musik erfinden, wiedergeben und gestalten mit Instrumenten
          ["sn.mu12.2.01", "Klänge erzeugen, Klangeigenschaften und Klangfarben untersuchen", "1/2", ["sachkunde:mu-instrumente1", "atelier:musik"], "ja"],
          ["sn.mu12.2.02", "Themen verklanglichen, eigene grafische Notation", "1/2", ["sachkunde:mu-rhythmus", "atelier:musik"], "ja"],
          ["sn.mu12.2.03", "Grundschlag und Metrum spüren, Rhythmusbausteine (gleich, doppelt, halb so lang)", "1/2", ["sachkunde:mu-rhythmus", "atelier:musik"], "ja"],
          ["sn.mu12.2.04", "Erstes Spiel auf Melodieinstrumenten, Lieder begleiten", "1/2", ["atelier:musik", "echtewelt:instrument"], "ja"]
        ],
        3: [ // Musik umsetzen, verbinden und in Beziehung bringen
          ["sn.mu12.3.01", "Musik in freie Bewegung und Tanz umsetzen, Stimmungen darstellen", "1/2", ["sachkunde:mu-bewegung", "echtewelt:tanzen"], "aussen"],
          ["sn.mu12.3.02", "Einfache Tänze, Schritte, Aufstellungen und Fassungen", "1/2", ["sachkunde:mu-bewegung", "echtewelt:tanzschritte"], "aussen"],
          ["sn.mu12.3.03", "Musik in Bilder und Sprache umsetzen: Tempo, Stimmung, Überschriften", "1/2", ["sachkunde:mu-bewegung", "sachkunde:mu-laut-leise"], "ja"],
          ["sn.mu12.3.04", "Szenisches Spiel zu Musik: Puppen, Schattenspiel, Pantomime", "1/2", ["echtewelt:lebendesbild"], "aussen"]
        ],
        4: [ // Musik wahrnehmen, verstehen und deuten
          ["sn.mu12.4.01", "Ausdruck von Musik erleben: Stimmungen, Gefühle, Bilder", "1/2", ["sachkunde:mu-laut-leise"], "ja"],
          ["sn.mu12.4.02", "Lautstärke und Tempo, einfache Formen", "1/2", ["sachkunde:mu-laut-leise", "atelier:musik"], "ja"],
          ["sn.mu12.4.03", "Instrumente und Stimmen: Material, Bauweise, Tonerzeugung; Männer-, Frauen-, Kinderstimmen", "1/2", ["sachkunde:mu-instrumente1", "sachkunde:mu-orchester"], "ja"],
          ["sn.mu12.4.04", "Musik in Schule, Freizeit, Familie und zu besonderen Anlässen", "1/2", ["sachkunde:mu-mozart"], "ja"],
          ["sn.mu12.4.05", "Leben und Schaffen von Komponisten und Kinderliedermachern", "1/2", ["sachkunde:mu-mozart"], "ja"]
        ]
      },
      "3": {
        1: [ // Musik erfinden, wiedergeben und gestalten mit der Stimme
          ["sn.mu3.1.01", "Melodie- und Rhythmusbausteine singen und wiedererkennen", "3", ["atelier:erkennen", "atelier:lieder", "atelier:musik"], "ja"],
          ["sn.mu3.1.02", "Haltung, Atmung und Tonraum beim Singen", "3", ["sachkunde:mu-stimme"], "ja"],
          ["sn.mu3.1.03", "Kanon und Quodlibet, solistisch und mehrstimmig singen", "3", ["sachkunde:mu-singen3", "echtewelt:singen"], "aussen"],
          ["sn.mu3.1.04", "Gestaltungsmittel beim Singen: Lautstärke, Tempo, Stimmklang, Fachbegriffe", "3", ["sachkunde:mu-singen3"], "ja"],
          ["sn.mu3.1.05", "Lieder verschiedener Stile und Länder, etwa fünf auswendig", "3", ["sachkunde:mu-welt", "echtewelt:singen"], "aussen"]
        ],
        2: [ // Musik erfinden, wiedergeben und gestalten mit Instrumenten
          ["sn.mu3.2.01", "Mit Klängen experimentieren, Klangflächen, eigene Notation", "3", ["atelier:musik"], "ja"],
          ["sn.mu3.2.02", "Rhythmusbausteine im Zweier- und Dreiertakt", "3", ["sachkunde:mu-taenze", "atelier:musik"], "ja"],
          ["sn.mu3.2.03", "Rhythmusbausteine notieren", "3", ["sachkunde:mu-noten"], "ja"]
        ],
        3: [ // Musik umsetzen, verbinden und in Beziehung bringen
          ["sn.mu3.3.01", "Musik in Bewegung: Spiegel- und Echotanzen", "3", ["sachkunde:mu-welt", "echtewelt:tanzen"], "aussen"],
          ["sn.mu3.3.02", "Tänze verschiedener Stile und Länder", "3", ["sachkunde:mu-welt", "echtewelt:tanzschritte"], "aussen"],
          ["sn.mu3.3.03", "Musik in Bilder und Sprache umsetzen: Klangfarben, Formverläufe, Tempo", "3", ["sachkunde:mu-laut-leise"], "ja"]
        ],
        4: [ // Musik wahrnehmen, verstehen und deuten
          ["sn.mu3.4.01", "Gestaltungsmittel hören: Lautstärke, Tempo, Artikulation, Klangfarbe, Form", "3", ["sachkunde:mu-laut-leise", "sachkunde:mu-singen3"], "ja"],
          ["sn.mu3.4.02", "Instrumentengruppen, Bauweise und Spielweise", "3", ["sachkunde:mu-gruppen"], "ja"],
          ["sn.mu3.4.03", "Musik in Freizeit und Kirche, eigene Meinung zu Musikstilen", "3", ["sachkunde:mu-bach"], "ja"],
          ["sn.mu3.4.04", "Leben und Schaffen von Komponisten, Musik anderer Länder", "3", ["sachkunde:mu-bach", "sachkunde:mu-welt"], "ja"]
        ]
      },
      "4": {
        1: [ // Musik erfinden, wiedergeben und gestalten mit der Stimme
          ["sn.mu4.1.01", "Mit Melodie- und Rhythmusbausteinen Musik erfinden", "4", ["atelier:musik", "sachkunde:mu-rhythmus4"], "ja"],
          ["sn.mu4.1.02", "Singen: Haltung, Atmung, Tonraum, zweistimmige Lieder", "4", ["sachkunde:mu-stimme", "echtewelt:singen"], "aussen"],
          ["sn.mu4.1.03", "Lieder verschiedener Zeiten und Kulturen, auch englische, etwa zehn auswendig", "4", ["atelier:lieder", "echtewelt:singen", "englisch:en-year"], "aussen"]
        ],
        2: [ // Musik erfinden, wiedergeben und gestalten mit Instrumenten
          ["sn.mu4.2.01", "Improvisieren, Themen verklanglichen", "4", ["atelier:musik"], "ja"],
          ["sn.mu4.2.02", "Rhythmusbausteine im Zweier- und Dreiertakt kombinieren", "4", ["sachkunde:mu-rhythmus4", "sachkunde:mu-taenze"], "ja"],
          ["sn.mu4.2.03", "Lieder mit Melodieinstrumenten begleiten; Viertel, Achtel, halbe und ganze Noten notieren", "4", ["sachkunde:mu-rhythmus4", "sachkunde:mu-noten", "atelier:musik"], "ja"]
        ],
        3: [ // Musik umsetzen, verbinden und in Beziehung bringen
          ["sn.mu4.3.01", "Musik differenziert in Bewegung umsetzen, Schattentanzen", "4", ["echtewelt:tanzen"], "aussen"],
          ["sn.mu4.3.02", "Tänze verschiedener Stile, Zeiten und Kulturen", "4", ["sachkunde:mu-taenze", "echtewelt:tanzschritte"], "ja"],
          ["sn.mu4.3.03", "Musik in Bilder, Geschichten und Gedichte umsetzen", "4", ["sachkunde:mu-bewegung"], "ja"]
        ],
        4: [ // Musik wahrnehmen, verstehen und deuten
          ["sn.mu4.4.01", "Gattungen: Lied, Suite, Kindermusical, Oper", "4", ["sachkunde:mu-gattungen"], "ja"],
          ["sn.mu4.4.02", "Instrumente von Orchester, Band und Folklore, Orgel; Chöre, Sopran, Alt, Tenor, Bass", "4", ["sachkunde:mu-orchester"], "ja"],
          ["sn.mu4.4.03", "Über Musik sprechen, Informationen sammeln und präsentieren", "4", ["praesentieren:folien", "sachkunde:mu-komponisten"], "ja"],
          ["sn.mu4.4.04", "Musizierstätten in Sachsen kennen und besuchen", "4", ["sachkunde:mu-sachsen", "echtewelt:musizierstaette"], "ja"],
          ["sn.mu4.4.05", "Tonträger, Musik- und Videoplattformen, rechtliche Regeln", "4", ["sachkunde:mu-medien"], "ja"],
          ["sn.mu4.4.06", "Komponisten und Musik verschiedener Zeiten und Kulturen", "4", ["sachkunde:mu-komponisten", "sachkunde:mu-taenze"], "ja"]
        ]
      }
    },
    werken: {
      "1/2": {
        1: [ // Entdecken von Technik im Alltag
          ["sn.we12.1.01", "Technik im Alltag wahrnehmen: Spielzeug, Haushalt, Schule, Freizeit", "1/2", ["sachkunde:we-fahrzeuge"], "ja"],
          ["sn.we12.1.02", "Fahrzeuge zu Wasser, Land und Luft: Zweck, Kufen, Räder, Flügel", "1/2", ["sachkunde:we-fahrzeuge"], "ja"],
          ["sn.we12.1.03", "Funktionsweise: bewegliche Teile, Welle und Achse, Rad", "1/2", ["sachkunde:we-fahrzeuge"], "ja"],
          ["sn.we12.1.04", "Ein technisches Objekt bauen (Windrad, Papierflieger, Fahrzeug) und prüfen", "1/2", ["echtewelt:papierflieger"], "aussen"]
        ],
        2: [ // Umgehen mit Material und Werkzeug
          ["sn.we12.2.01", "Vom Bedarf zur Idee: planen, Skizzen lesen und anfertigen", "1/2", ["sachkunde:we-werkzeug", "echtewelt:bruecke"], "aussen"],
          ["sn.we12.2.02", "Papierwerkstoffe mit anderen Werkstoffen vergleichen", "1/2", ["sachkunde:we-papier"], "ja"],
          ["sn.we12.2.03", "Werkzeuge sicher handhaben: Arbeitsschutz, messen, anreißen mit Lineal, Zirkel, Schablone", "1/2", ["sachkunde:we-werkzeug", "echtewelt:werkzeug"], "ja"],
          ["sn.we12.2.04", "Falten, falzen, biegen, schneiden, lochen, kleben", "1/2", ["sachkunde:we-papier", "echtewelt:papierflieger"], "ja"],
          ["sn.we12.2.05", "Technische Objekte herstellen und prüfen (Drachen, Modelle)", "1/2", ["echtewelt:bruecke"], "aussen"],
          ["sn.we12.2.06", "Papier verwenden, Recyclingpapier, Abfall vermeiden", "1/2", ["sachkunde:we-papier"], "ja"]
        ],
        3: [ // Bauen stabiler Konstruktionen
          ["sn.we12.3.01", "Bau- und Tragwerke der Umgebung und ihr Zweck", "1/2", ["sachkunde:we-bauen"], "ja"],
          ["sn.we12.3.02", "Stabilität: Profile, Bauweisen, Steck- und Schraubverbindungen", "1/2", ["sachkunde:we-bauen"], "ja"],
          ["sn.we12.3.03", "Türme und Brücken bauen und beurteilen", "1/2", ["echtewelt:bruecke", "echtewelt:turm"], "aussen"]
        ]
      },
      "3": {
        1: [ // Nutzen von elektrischem Strom
          ["sn.we3.1.01", "Erneuerbare Energiequellen: Sonne, Wind, Wasser, Biomasse", "3", ["sachkunde:we-strom"], "ja"],
          ["sn.we3.1.02", "Bauteile und Schaltplan: Spannungsquelle, Leitung, Schalter, Summer, Leuchtmittel, Motor", "3", ["sachkunde:we-strom", "sachkunde:strom"], "ja"],
          ["sn.we3.1.03", "Mit Baukästen elektrische Objekte bauen (Solarlüfter, Elektrofahrzeug)", "3", ["echtewelt:stromkreis"], "aussen"],
          ["sn.we3.1.04", "Leiter und Isolatoren, Strom im Alltag, sparsame Geräte", "3", ["sachkunde:we-strom", "sachkunde:strom"], "ja"],
          ["sn.we3.1.05", "Regeln und Schutz im Umgang mit Strom", "3", ["sachkunde:we-strom", "sachkunde:strom"], "ja"]
        ],
        2: [ // Planen und Herstellen eines Gegenstandes
          ["sn.we3.2.01", "Holz als nachwachsender Rohstoff: Eigenschaften und Einsatz", "3", ["sachkunde:we-holz"], "ja"],
          ["sn.we3.2.02", "Planen: Werkstoff wählen, Skizze, Arbeitsschritte, Arbeitsplatz einrichten", "3", ["sachkunde:we-holz", "sachkunde:we-werkzeug"], "ja"],
          ["sn.we3.2.03", "Sägen, feilen, raspeln, schleifen, nageln, schrauben, streichen", "3", ["sachkunde:we-holz", "echtewelt:holz"], "aussen"],
          ["sn.we3.2.04", "Messen in Millimetern, anreißen, sparsam mit dem Werkstoff", "3", ["sachkunde:we-werkzeug"], "ja"],
          ["sn.we3.2.05", "Ergebnis beurteilen: Funktion, Aussehen, Sicherheit, Preis", "3", ["echtewelt:holz"], "aussen"]
        ]
      },
      "4": {
        1: [ // Warten und Pflegen technischer Objekte
          ["sn.we4.1.01", "Aufbau technischer Objekte: Antrieb, Übertragung, Abtrieb", "4", ["sachkunde:we-fahrrad"], "ja"],
          ["sn.we4.1.02", "Fehlersuche: Funktionsprobe, Bedienungsanleitung, Demontage", "4", ["sachkunde:we-fahrrad"], "ja"],
          ["sn.we4.1.03", "Pflege und Wartung, zum Beispiel am Fahrrad", "4", ["sachkunde:we-fahrrad", "echtewelt:fahrradpflege"], "ja"],
          ["sn.we4.1.04", "Reparieren statt wegwerfen, Werkstoffe trennen, Batterien entsorgen", "4", ["sachkunde:we-fahrrad", "echtewelt:reparieren"], "ja"]
        ],
        2: [ // Vergleichen von Werkstoffen und Herstellen eines Produkts
          ["sn.we4.2.01", "Holzwerkstoffe und Kunststoffe: Eigenschaften, Einsatz, Vor- und Nachteile, Umwelt", "4", ["sachkunde:we-werkstoffe"], "ja"],
          ["sn.we4.2.02", "Werkstoffe vergleichen: trennen, umformen, fügen, Oberfläche", "4", ["sachkunde:we-werkstoffe", "sachkunde:we-holz"], "ja"],
          ["sn.we4.2.03", "Arbeitsvorbereitung: technische Skizze, Stückliste, Arbeitsschritte", "4", ["sachkunde:we-werkstoffe"], "ja"],
          ["sn.we4.2.04", "Ein Produkt fertigen und prüfen (Bücherstütze, Staffelei)", "4", ["echtewelt:holz"], "aussen"]
        ],
        3: [ // Begegnung mit Robotern und Automaten
          ["sn.we4.3.01", "Roboter und Automaten im Alltag: Eingabe – Verarbeitung – Ausgabe, Sensor, Aktor", "4", ["sachkunde:we-roboter", "echtewelt:automat"], "ja"],
          ["sn.we4.3.02", "Einfache Programmierumgebung: kurze Befehlsfolgen", "4", ["robo:alle", "sachkunde:we-roboter"], "ja"],
          ["sn.we4.3.03", "Ein Modell bauen und programmieren, Fehler suchen", "4", ["echtewelt:automat"], "aussen"]
        ]
      }
    },
    ethik: {
      "1/2": {
        1: [ // Ich im Wir
          ["sn.et12.1.01", "Eigene Einmaligkeit: Aussehen, Name, Lebenswelt", "1/2", ["sachkunde:et-einmalig"], "ja"],
          ["sn.et12.1.02", "Eigenschaften und Gefühle, mit Mimik und Körper ausdrücken", "1/2", ["sachkunde:et-einmalig", "gefuehle:alle"], "ja"],
          ["sn.et12.1.03", "Unterschiedlichkeit: Neigungen, Begabungen, Handicaps, anders sein", "1/2", ["sachkunde:et-einmalig"], "ja"],
          ["sn.et12.1.04", "Eigene Fähigkeiten und Grenzen, Selbstwert", "1/2", ["sachkunde:et-einmalig"], "ja"]
        ],
        2: [ // Miteinander
          ["sn.et12.2.01", "Familienformen, mein Zuhause", "1/2", ["sachkunde:et-familie", "sachkunde:familie"], "ja"],
          ["sn.et12.2.02", "Geborgenheit, Verlässlichkeit, Aufgaben in der Familie", "1/2", ["sachkunde:et-familie"], "ja"],
          ["sn.et12.2.03", "Schule als Gemeinschaft: Umgangsformen, Regeln, streiten und versöhnen", "1/2", ["sachkunde:et-klasse", "gefuehle:alle"], "ja"],
          ["sn.et12.2.04", "Kritik, Meinungen, Ausgrenzung; um Hilfe bitten", "1/2", ["sachkunde:et-klasse"], "ja"]
        ],
        3: [ // Voneinander
          ["sn.et12.3.01", "Persönliche Feste: Geburtstag und Rituale", "1/2", ["sachkunde:et-herbstfeste"], "ja"],
          ["sn.et12.3.02", "Erntedank, St. Martin, Advent, Nikolaus", "1/2", ["sachkunde:et-herbstfeste"], "ja"],
          ["sn.et12.3.03", "Weihnachten, Silvester, Fasching, Ostern; Wünsche und Schenken", "1/2", ["sachkunde:et-winterfeste"], "ja"]
        ],
        4: [ // Wir in der Welt
          ["sn.et12.4.01", "Das Wunderbare der Natur, Sonne, Mond und Sterne", "1/2", ["sachkunde:et-natur"], "ja"],
          ["sn.et12.4.02", "Werden, Wachsen, Vergehen; eine Pflanze aufziehen", "1/2", ["sachkunde:et-natur", "echtewelt:pflanze"], "ja"],
          ["sn.et12.4.03", "Umgang mit der Natur, Tier- und Umweltschutz", "1/2", ["sachkunde:et-natur", "echtewelt:staunen"], "ja"]
        ]
      },
      "3": {
        1: [ // Ich im Wir
          ["sn.et3.1.01", "Kinder und Erwachsene: Gemeinsamkeiten und Unterschiede", "3", ["sachkunde:et-staerken"], "ja"],
          ["sn.et3.1.02", "Stärken und Schwächen, Angst bewältigen, Erfolg und Misserfolg", "3", ["sachkunde:et-staerken"], "ja"],
          ["sn.et3.1.03", "Geschlechterrollen hinterfragen, Vielfalt achten", "3", ["sachkunde:et-staerken"], "ja"],
          ["sn.et3.1.04", "Gemeinsamkeiten und Unterschiede der Menschen, Herkunft", "3", ["sachkunde:kulturen"], "ja"],
          ["sn.et3.1.05", "Gut und Böse im eigenen Handeln, Nein sagen, verzeihen", "3", ["sachkunde:et-staerken", "sachkunde:nein-sagen"], "ja"],
          ["sn.et3.1.06", "Persönliche Konflikte, Kompromisse, Hilfe suchen", "3", ["gefuehle:alle", "sachkunde:et-freundschaft"], "ja"]
        ],
        2: [ // Miteinander
          ["sn.et3.2.01", "Freundschaft finden und pflegen, Vertrauen", "3", ["sachkunde:et-freundschaft"], "ja"],
          ["sn.et3.2.02", "Konflikte in Freundschaften: Streitregeln, Mobbing, Internet, Goldene Regel, Geheimnisse", "3", ["sachkunde:et-freundschaft"], "ja"],
          ["sn.et3.2.03", "Wahrheit und Lüge, Notlüge, Vertrauen", "3", ["sachkunde:et-wahrheit"], "ja"]
        ],
        3: [ // Voneinander
          ["sn.et3.3.01", "Ethik und Religion: die Begriffe", "3", ["sachkunde:et-kirchenjahr"], "ja"],
          ["sn.et3.3.02", "Christlicher Glaube: Kreuz, Kirche, Bibel", "3", ["sachkunde:et-kirchenjahr"], "ja"],
          ["sn.et3.3.03", "Christlich geprägte Zeiten: Weihnachten, Fastenzeit, Ostern, Pfingsten", "3", ["sachkunde:et-kirchenjahr", "sachkunde:et-winterfeste"], "ja"],
          ["sn.et3.3.04", "Feiertage in Sachsen und das Kirchenjahr: Reformationstag, sorbische Feiertage", "3", ["sachkunde:et-kirchenjahr"], "ja"]
        ],
        4: [ // Wir in der Welt
          ["sn.et3.4.01", "Symbole wahrnehmen und deuten", "3", ["sachkunde:et-symbole"], "ja"],
          ["sn.et3.4.02", "Natürliche Welt, vom Menschen gemachte Welt und Gedankenwelt", "3", ["sachkunde:et-symbole"], "ja"],
          ["sn.et3.4.03", "Die Welt gestalten und bewahren", "3", ["sachkunde:et-symbole"], "ja"],
          ["sn.et3.4.04", "Die vier Elemente Feuer, Wasser, Erde, Luft", "3", ["sachkunde:et-symbole"], "ja"]
        ]
      },
      "4": {
        1: [ // Ich im Wir
          ["sn.et4.1.01", "Eigene Identität, Vorbilder, Selbstwert", "4", ["sachkunde:et-wuensche"], "ja"],
          ["sn.et4.1.02", "Wünsche, Träume, Lebensvorstellungen", "4", ["sachkunde:et-wuensche", "echtewelt:wuensche"], "ja"],
          ["sn.et4.1.03", "Entscheidungen treffen, Gewissen, Folgen; Übergang zur neuen Schule", "4", ["sachkunde:et-wuensche"], "ja"]
        ],
        2: [ // Miteinander
          ["sn.et4.2.01", "Beziehungen zwischen den Generationen", "4", ["sachkunde:et-miteinander4", "echtewelt:frage"], "ja"],
          ["sn.et4.2.02", "Goldene Regel in Religionen und Philosophie, Umgangsformen, Zivilcourage", "4", ["sachkunde:et-miteinander4"], "ja"]
        ],
        3: [ // Voneinander
          ["sn.et4.3.01", "Judentum und Islam: Symbole, Gebetshäuser, heilige Bücher, Feste", "4", ["sachkunde:et-religionen"], "ja"],
          ["sn.et4.3.02", "Gemeinsamkeiten von Judentum, Christentum und Islam", "4", ["sachkunde:et-religionen"], "ja"],
          ["sn.et4.3.03", "Religiöse Persönlichkeiten und karitative Hilfe; selbst helfen", "4", ["sachkunde:et-religionen", "echtewelt:helfenprojekt"], "ja"],
          ["sn.et4.3.04", "Werte und Traditionen anderer Kulturen, Toleranz", "4", ["sachkunde:et-religionen", "sachkunde:kulturen"], "ja"]
        ],
        4: [ // Wir in der Welt
          ["sn.et4.4.01", "Gerechtigkeit und Ungerechtigkeit", "4", ["sachkunde:et-gerechtigkeit"], "ja"],
          ["sn.et4.4.02", "Kinderrechte und Menschenrechte", "4", ["sachkunde:et-gerechtigkeit", "sachkunde:kinderrechte"], "ja"],
          ["sn.et4.4.03", "Philosophische Fragen: Glück, Zeit, was den Menschen ausmacht, Abschied", "4", ["sachkunde:et-glueck-zeit"], "ja"]
        ]
      }
    },
    sport: {
      "1/2": {
        1: [ // Leichtathletische Übungen
          ["sn.sp12.1.01", "Schnell laufen in spielerischen Formen, Startkommando und Hochstart", "1/2", ["sachkunde:sp-laufen", "echtewelt:sprint"], "aussen"],
          ["sn.sp12.1.02", "Weit und hoch springen: Sprunggarten, Hock- und Schersprung", "1/2", ["sachkunde:sp-laufen", "echtewelt:huepfen"], "aussen"],
          ["sn.sp12.1.03", "Werfen mit verschiedenen Geräten, Schlagwurf", "1/2", ["sachkunde:sp-laufen", "echtewelt:werfen"], "aussen"],
          ["sn.sp12.1.04", "Ausdauernd laufen bis zehn Minuten", "1/2", ["sachkunde:sp-laufen", "echtewelt:ausdauer"], "aussen"],
          ["sn.sp12.1.05", "In der Natur bewegen, Spielregeln, Fairness", "1/2", ["echtewelt:fangen"], "aussen"]
        ],
        2: [ // Spiele und Spielformen
          ["sn.sp12.2.01", "Laufspiele: Wettläufe, Staffeln, Platzsuch- und Fangspiele", "1/2", ["sachkunde:sp-fair", "echtewelt:fangen"], "aussen"],
          ["sn.sp12.2.02", "Mit Bällen und Spielgeräten üben: werfen, treffen, fangen", "1/2", ["echtewelt:werfen"], "aussen"],
          ["sn.sp12.2.03", "Fair mit- und gegeneinander spielen, Gruppen bilden", "1/2", ["sachkunde:sp-fair"], "ja"],
          ["sn.sp12.2.04", "Freizeit- und Pausenspiele, Regeln aushandeln und verändern", "1/2", ["sachkunde:sp-fair", "echtewelt:spielregeln"], "ja"]
        ],
        3: [ // Turnerische Übungen
          ["sn.sp12.3.01", "An Geräten balancieren, klettern, hangeln, rollen; sicherer Geräteaufbau", "1/2", ["sachkunde:sp-turnen", "echtewelt:balance"], "aussen"],
          ["sn.sp12.3.02", "Rolle vorwärts und rückwärts", "1/2", ["sachkunde:sp-turnen", "echtewelt:rolle"], "aussen"],
          ["sn.sp12.3.03", "Helfen und sich helfen lassen", "1/2", ["sachkunde:sp-turnen"], "ja"],
          ["sn.sp12.3.04", "Beidbeinig abspringen: Auf- und Niedersprünge", "1/2", ["echtewelt:huepfen"], "aussen"],
          ["sn.sp12.3.05", "Gleichgewicht und Kraft, Spannung und Entspannung", "1/2", ["sachkunde:sp-turnen", "echtewelt:balance"], "aussen"]
        ],
        4: [ // Gymnastisch-tänzerische Übungen
          ["sn.sp12.4.01", "Bewegen mit Materialien und Handgeräten", "1/2", ["sachkunde:sp-tanz", "echtewelt:werfen"], "aussen"],
          ["sn.sp12.4.02", "Rhythmus: Schrittarten, klatschen, stampfen", "1/2", ["sachkunde:sp-tanz", "sachkunde:mu-rhythmus", "atelier:musik"], "ja"],
          ["sn.sp12.4.03", "Bewegungslieder, Grundschritte, Kindertänze", "1/2", ["echtewelt:tanzschritte"], "aussen"],
          ["sn.sp12.4.04", "Sinne schulen, gute Körperhaltung, Entspannung", "1/2", ["sachkunde:sp-tanz", "gefuehle:alle"], "ja"]
        ],
        5: [ // Schwimmen
          ["sn.sp12.5.01", "Wassergewöhnung: atmen, springen, gleiten, fortbewegen", "1/2", ["echtewelt:schwimmen"], "aussen"],
          ["sn.sp12.5.02", "Eine Schwimmtechnik (meist Brustschwimmen), tauchen", "1/2", ["echtewelt:schwimmen"], "aussen"],
          ["sn.sp12.5.03", "Baderegeln und Badeordnung", "1/2", ["sachkunde:sp-baderegeln"], "ja"],
          ["sn.sp12.5.04", "Spiele, Sprünge, erste Elemente der Wasserrettung", "1/2", ["sachkunde:sp-baderegeln", "echtewelt:schwimmen"], "aussen"]
        ],
        6: [ // Wintersport
          ["sn.sp12.6.01", "Gewöhnung an Schnee und Eis, kleine Spiele", "1/2", ["echtewelt:schnee"], "aussen"],
          ["sn.sp12.6.02", "Ski- oder Eislaufen: gleiten, bremsen, Kurven", "1/2", ["echtewelt:schnee"], "aussen"],
          ["sn.sp12.6.03", "Regeln, Kleidung und Umwelt im Winter", "1/2", ["sachkunde:sp-winter"], "ja"]
        ]
      },
      "3": {
        1: [ // Leichtathletische Übungen
          ["sn.sp34.1.01", "Lauf-ABC, Startformen und Sprint bis 50 m", "3/4", ["sachkunde:sp-ausdauer", "echtewelt:sprint"], "aussen"],
          ["sn.sp34.1.02", "Weitsprung- und Hochsprungtechnik, Leistung messen", "3/4", ["sachkunde:sp-laufen", "echtewelt:huepfen"], "aussen"],
          ["sn.sp34.1.03", "Werfen und Stoßen, Schlagwurf verbessern", "3/4", ["sachkunde:sp-laufen", "echtewelt:werfen"], "aussen"],
          ["sn.sp34.1.04", "Bis 15 Minuten ausdauernd laufen, Puls fühlen, eigene Bestleistung, Gesundheit", "3/4", ["sachkunde:sp-ausdauer", "echtewelt:ausdauer"], "ja"]
        ],
        2: [ // Spiele und Spielformen
          ["sn.sp34.2.01", "Lauf- und Ballspiele, prellen, dribbeln, freilaufen", "3/4", ["echtewelt:fangen"], "aussen"],
          ["sn.sp34.2.02", "Spielrollen, Sieg und Niederlage, Regeln erklären, Schiedsrichter sein", "3/4", ["sachkunde:sp-regeln"], "ja"],
          ["sn.sp34.2.03", "Freizeit- und Trendsportarten, Spiele anderer Länder", "3/4", ["sachkunde:sp-regeln"], "ja"]
        ],
        3: [ // Turnerische Übungen
          ["sn.sp34.3.01", "Gerätebahnen, Sicherheit, Geräteaufbau", "3/4", ["sachkunde:sp-turnen", "echtewelt:balance"], "aussen"],
          ["sn.sp34.3.02", "Rollen in Verbindungen, Handstand, Kopfstand, Rad-Vorübungen", "3/4", ["echtewelt:rolle"], "aussen"],
          ["sn.sp34.3.03", "Sprunggrätsche und Aufhocken, helfen und sichern", "3/4", ["sachkunde:sp-turnen", "echtewelt:huepfen"], "aussen"],
          ["sn.sp34.3.04", "Gleichgewicht, Kraft, Dehnen, gesunde Haltung", "3/4", ["sachkunde:sp-ruecken", "echtewelt:ruecken"], "ja"]
        ],
        4: [ // Gymnastisch-tänzerische Übungen
          ["sn.sp34.4.01", "Seilspringen und Handgeräte", "3/4", ["sachkunde:sp-ruecken", "echtewelt:huepfen"], "aussen"],
          ["sn.sp34.4.02", "Aerobic-Grundschritte und Rhythmus", "3/4", ["sachkunde:sp-ruecken"], "ja"],
          ["sn.sp34.4.03", "Tänze gestalten, auch aus anderen Ländern", "3/4", ["sachkunde:mu-welt", "echtewelt:tanzschritte"], "aussen"],
          ["sn.sp34.4.04", "Orientierung, Körperhaltung, Kräftigen, Dehnen und Entspannen", "3/4", ["sachkunde:sp-ruecken"], "ja"]
        ],
        6: [ // Wintersport
          ["sn.sp34.6.01", "Ski- oder Eislauftechnik: Aufstieg, Schussfahrt, Bremsen, Bögen, Lift", "3/4", ["echtewelt:schnee"], "aussen"],
          ["sn.sp34.6.02", "Pistenregeln, Rücksicht, Umwelt", "3/4", ["sachkunde:sp-piste"], "ja"]
        ]
      },
      "4": {
        1: [ // Leichtathletische Übungen
          ["sn.sp34.1.01", "Lauf-ABC, Startformen und Sprint bis 50 m", "3/4", ["sachkunde:sp-ausdauer", "echtewelt:sprint"], "aussen"],
          ["sn.sp34.1.02", "Weitsprung- und Hochsprungtechnik, Leistung messen", "3/4", ["sachkunde:sp-laufen", "echtewelt:huepfen"], "aussen"],
          ["sn.sp34.1.03", "Werfen und Stoßen, Schlagwurf verbessern", "3/4", ["sachkunde:sp-laufen", "echtewelt:werfen"], "aussen"],
          ["sn.sp34.1.04", "Bis 15 Minuten ausdauernd laufen, Puls fühlen, eigene Bestleistung, Gesundheit", "3/4", ["sachkunde:sp-ausdauer", "echtewelt:ausdauer"], "ja"]
        ],
        2: [ // Spiele und Spielformen
          ["sn.sp34.2.01", "Lauf- und Ballspiele, prellen, dribbeln, freilaufen", "3/4", ["echtewelt:fangen"], "aussen"],
          ["sn.sp34.2.02", "Spielrollen, Sieg und Niederlage, Regeln erklären, Schiedsrichter sein", "3/4", ["sachkunde:sp-regeln"], "ja"],
          ["sn.sp34.2.03", "Freizeit- und Trendsportarten, Spiele anderer Länder", "3/4", ["sachkunde:sp-regeln"], "ja"]
        ],
        3: [ // Turnerische Übungen
          ["sn.sp34.3.01", "Gerätebahnen, Sicherheit, Geräteaufbau", "3/4", ["sachkunde:sp-turnen", "echtewelt:balance"], "aussen"],
          ["sn.sp34.3.02", "Rollen in Verbindungen, Handstand, Kopfstand, Rad-Vorübungen", "3/4", ["echtewelt:rolle"], "aussen"],
          ["sn.sp34.3.03", "Sprunggrätsche und Aufhocken, helfen und sichern", "3/4", ["sachkunde:sp-turnen", "echtewelt:huepfen"], "aussen"],
          ["sn.sp34.3.04", "Gleichgewicht, Kraft, Dehnen, gesunde Haltung", "3/4", ["sachkunde:sp-ruecken", "echtewelt:ruecken"], "ja"]
        ],
        4: [ // Gymnastisch-tänzerische Übungen
          ["sn.sp34.4.01", "Seilspringen und Handgeräte", "3/4", ["sachkunde:sp-ruecken", "echtewelt:huepfen"], "aussen"],
          ["sn.sp34.4.02", "Aerobic-Grundschritte und Rhythmus", "3/4", ["sachkunde:sp-ruecken"], "ja"],
          ["sn.sp34.4.03", "Tänze gestalten, auch aus anderen Ländern", "3/4", ["sachkunde:mu-welt", "echtewelt:tanzschritte"], "aussen"],
          ["sn.sp34.4.04", "Orientierung, Körperhaltung, Kräftigen, Dehnen und Entspannen", "3/4", ["sachkunde:sp-ruecken"], "ja"]
        ],
        6: [ // Wintersport
          ["sn.sp34.6.01", "Ski- oder Eislauftechnik: Aufstieg, Schussfahrt, Bremsen, Bögen, Lift", "3/4", ["echtewelt:schnee"], "aussen"],
          ["sn.sp34.6.02", "Pistenregeln, Rücksicht, Umwelt", "3/4", ["sachkunde:sp-piste"], "ja"]
        ]
      }
    },
    // Evangelische und Katholische Religion – Lehrpläne Grundschule Sachsen 2004/2009/2019 (PDFs vom Auftraggeber, 28.10.2026)
    evreligion: {
      "1/2": {
        1: [ // Miteinander leben
          ["sn.rev12.1.01", "Gemeinschaft, Rituale, Regeln und eigene Fähigkeiten", "1/2", ["sachkunde:re-gefuehle", "sachkunde:et-klasse"], "ja"],
          ["sn.rev12.1.02", "Gefühle und Bedürfnisse wahrnehmen und ausdrücken", "1/2", ["sachkunde:re-gefuehle", "gefuehle:alle"], "ja"],
          ["sn.rev12.1.03", "Konflikte: Neid, Wut, Lösungen finden", "1/2", ["sachkunde:re-gefuehle", "sachkunde:et-klasse"], "ja"],
          ["sn.rev12.1.04", "Angst überwinden: Sturmstillung und Jona", "1/2", ["sachkunde:re-gefuehle"], "ja"]
        ],
        2: [ // Nach Gott und dem Sinn der Welt fragen
          ["sn.rev12.2.01", "Vielfalt der Schöpfung mit allen Sinnen, Achtsamkeit", "1/2", ["sachkunde:re-schoepfung", "echtewelt:staunen"], "ja"],
          ["sn.rev12.2.02", "Ein biblisches Schöpfungslob (Psalmen)", "1/2", ["sachkunde:re-schoepfung"], "ja"],
          ["sn.rev12.2.03", "Biblische Rede von Gott: Hirte, Fels; eigene Gottesvorstellungen", "1/2", ["sachkunde:re-gottesbilder"], "ja"],
          ["sn.rev12.2.04", "Wasser als Quelle des Lebens", "1/2", ["sachkunde:re-licht-wasser"], "ja"],
          ["sn.rev12.2.05", "Die Erzählung von Noah", "1/2", ["sachkunde:re-noah"], "ja"]
        ],
        3: [ // Die biblische Botschaft kennen lernen
          ["sn.rev12.3.01", "Land und Leben zur Zeit Jesu", "1/2", ["sachkunde:re-zeit-jesu"], "ja"],
          ["sn.rev12.3.02", "Jesusgeschichten: Levi, Kindersegnung, Bartimäus", "1/2", ["sachkunde:re-jesus-hilft"], "ja"],
          ["sn.rev12.3.03", "Abraham und Sara", "1/2", ["sachkunde:re-abraham"], "ja"],
          ["sn.rev12.3.04", "Segen und Segenshandlungen", "1/2", ["sachkunde:re-abraham"], "ja"],
          ["sn.rev12.3.05", "Die Josefsgeschichte", "1/2", ["sachkunde:re-josef"], "ja"]
        ],
        4: [ // Mit der Gemeinde feiern
          ["sn.rev12.4.01", "Erntedank, Nikolaus, Advent, Weihnachten, Ostern im Schulalltag", "1/2", ["sachkunde:re-feste12", "sachkunde:re-ostern12"], "ja"],
          ["sn.rev12.4.02", "Die Weihnachtsgeschichte", "1/2", ["sachkunde:re-feste12"], "ja"],
          ["sn.rev12.4.03", "Passion und Ostern", "1/2", ["sachkunde:re-ostern12"], "ja"],
          ["sn.rev12.4.04", "Sonntag, Kirche und Taufe", "1/2", ["sachkunde:re-kirche-taufe"], "ja"],
          ["sn.rev12.4.05", "Eine Kirche erleben und erkunden", "1/2", ["echtewelt:kirche"], "aussen"]
        ]
      },
      "3": {
        1: [ // Miteinander leben
          ["sn.rev3.1.01", "Ermutigung und eigene Stärken", "3", ["sachkunde:et-staerken"], "ja"],
          ["sn.rev3.1.02", "Konflikte, Symbol Brücke, Mobbing, Vergebung", "3", ["sachkunde:re-bruecken"], "ja"],
          ["sn.rev3.1.03", "Die Goldene Regel", "3", ["sachkunde:re-bruecken", "sachkunde:et-freundschaft"], "ja"],
          ["sn.rev3.1.04", "Jüdische Religion: Synagoge, Thora, Sabbat", "3", ["sachkunde:re-judentum"], "ja"],
          ["sn.rev3.1.05", "Jesus als Jude", "3", ["sachkunde:re-judentum"], "ja"]
        ],
        2: [ // Nach Gott und dem Sinn der Welt fragen
          ["sn.rev3.2.01", "Bildworte in Alltagssprache und Bibel", "3", ["sachkunde:re-bildworte"], "ja"],
          ["sn.rev3.2.02", "Gott in Metaphern: Hirte und Licht", "3", ["sachkunde:re-bildworte", "sachkunde:re-gottesbilder"], "ja"],
          ["sn.rev3.2.03", "Reich Gottes in Gleichnissen: Samariter, Senfkorn, verlorener Sohn", "3", ["sachkunde:re-gleichnisse"], "ja"],
          ["sn.rev3.2.04", "Die erste Schöpfungsgeschichte", "3", ["sachkunde:re-schoepfung3"], "ja"]
        ],
        3: [ // Die biblische Botschaft kennen lernen
          ["sn.rev3.3.01", "Jesusgeschichten: ein Aussätziger, Zachäus", "3", ["sachkunde:re-ausgegrenzte"], "ja"],
          ["sn.rev3.3.02", "Ausgegrenzte Menschen heute", "3", ["sachkunde:re-ausgegrenzte"], "ja"],
          ["sn.rev3.3.03", "Menschen, die aus christlicher Überzeugung anderen geholfen haben", "3", ["sachkunde:re-ausgegrenzte"], "ja"],
          ["sn.rev3.3.04", "Die Mosegeschichte bis zu den Zehn Geboten", "3", ["sachkunde:re-mose"], "ja"]
        ],
        4: [ // Mit der Gemeinde feiern
          ["sn.rev3.4.01", "Jesus im Mittelpunkt des Kirchenjahres", "3", ["sachkunde:re-pfingsten"], "ja"],
          ["sn.rev3.4.02", "Pfingsten als Geburtsfest der Kirche", "3", ["sachkunde:re-pfingsten"], "ja"],
          ["sn.rev3.4.03", "Einen Gottesdienst mitgestalten", "3", ["sachkunde:re-pfingsten", "echtewelt:kirche"], "aussen"]
        ]
      },
      "4": {
        1: [ // Miteinander leben
          ["sn.rev4.1.01", "Die Zehn Gebote und das eigene Leben", "4", ["sachkunde:re-gebote"], "ja"],
          ["sn.rev4.1.02", "Zeit, Werden und Vergehen, Abschied und Hoffnung", "4", ["sachkunde:re-zeit-abschied"], "ja"],
          ["sn.rev4.1.03", "Die Religion des Islam", "4", ["sachkunde:re-islam"], "ja"]
        ],
        2: [ // Nach Gott und dem Sinn der Welt fragen
          ["sn.rev4.2.01", "Biblische Gebete, Vaterunser, Gebetsformen", "4", ["sachkunde:re-beten"], "ja"],
          ["sn.rev4.2.02", "Symbole: Baum, Sonne, Weg", "4", ["sachkunde:re-symbole"], "ja"],
          ["sn.rev4.2.03", "Ein Schöpfungslob gestalten", "4", ["sachkunde:re-beten"], "ja"]
        ],
        3: [ // Die biblische Botschaft kennen lernen
          ["sn.rev4.3.01", "Das Mahl in der Bibel und die Mahlgemeinschaft Jesu", "4", ["sachkunde:re-mahl"], "ja"],
          ["sn.rev4.3.02", "Die Jakobsgeschichte", "4", ["sachkunde:re-jakob"], "ja"],
          ["sn.rev4.3.03", "Entstehung und Aufbau der Bibel, Bibelstellen finden", "4", ["sachkunde:re-bibel"], "ja"]
        ],
        4: [ // Mit der Gemeinde feiern
          ["sn.rev4.4.01", "Das Kirchenjahr und das eigene Leben", "4", ["sachkunde:re-kirchenjahr"], "ja"],
          ["sn.rev4.4.02", "Reformationstag und Martin Luther", "4", ["sachkunde:re-reformation"], "ja"],
          ["sn.rev4.4.03", "Gemeinsamkeiten und Unterschiede evangelischer und katholischer Feste, Ökumene", "4", ["sachkunde:re-oekumene"], "ja"]
        ]
      }
    },
    kareligion: {
      "1/2": {
        1: [ // Miteinander leben
          ["sn.rka12.1.01", "Leben in Gemeinschaft, Rituale, Regeln", "1/2", ["sachkunde:re-gefuehle", "sachkunde:et-klasse"], "ja"],
          ["sn.rka12.1.02", "Freude und Leid bei sich und anderen", "1/2", ["sachkunde:re-gefuehle"], "ja"],
          ["sn.rka12.1.03", "Trost finden und andere trösten", "1/2", ["sachkunde:re-gefuehle"], "ja"],
          ["sn.rka12.1.04", "Religiöse Vorerfahrungen und Zugehörigkeit zu einer Religionsgemeinschaft", "1/2", ["sachkunde:re-kirche-taufe"], "ja"]
        ],
        2: [ // Das Geheimnis entdecken
          ["sn.rka12.2.01", "Licht als Symbol im Kirchenjahr, Licht für andere sein", "1/2", ["sachkunde:re-licht-wasser"], "ja"],
          ["sn.rka12.2.02", "Wasser als Symbol und Taufwasser", "1/2", ["sachkunde:re-licht-wasser"], "ja"],
          ["sn.rka12.2.03", "Stille und meditative Übungen", "1/2", ["sachkunde:re-vaterunser", "echtewelt:stille"], "ja"],
          ["sn.rka12.2.04", "Bildsprache der Bibel: Gott ist mein Licht, mein Hirte", "1/2", ["sachkunde:re-gottesbilder"], "ja"],
          ["sn.rka12.2.05", "Fragen nach Gott und eigene Vorstellungen", "1/2", ["sachkunde:re-gottesbilder"], "ja"],
          ["sn.rka12.2.06", "Schöpfung und Gott als Schöpfer", "1/2", ["sachkunde:re-schoepfung"], "ja"],
          ["sn.rka12.2.07", "Die Erzählung von Noah", "1/2", ["sachkunde:re-noah"], "ja"],
          ["sn.rka12.2.08", "Segen und Segenshandlungen", "1/2", ["sachkunde:re-abraham"], "ja"]
        ],
        3: [ // Die biblische Botschaft kennen lernen
          ["sn.rka12.3.01", "Die Bartimäusgeschichte", "1/2", ["sachkunde:re-jesus-hilft"], "ja"],
          ["sn.rka12.3.02", "Jesus segnet die Kinder", "1/2", ["sachkunde:re-jesus-hilft"], "ja"],
          ["sn.rka12.3.03", "Die Heimat Jesu", "1/2", ["sachkunde:re-zeit-jesu"], "ja"],
          ["sn.rka12.3.04", "Gott als guter Vater und liebende Mutter", "1/2", ["sachkunde:re-gottesbilder"], "ja"],
          ["sn.rka12.3.05", "Das Vaterunser", "1/2", ["sachkunde:re-vaterunser"], "ja"],
          ["sn.rka12.3.06", "Abraham und Sara", "1/2", ["sachkunde:re-abraham"], "ja"],
          ["sn.rka12.3.07", "Die Josefserzählung", "1/2", ["sachkunde:re-josef"], "ja"]
        ],
        4: [ // Mit der Kirche feiern
          ["sn.rka12.4.01", "Erntedank", "1/2", ["sachkunde:re-feste12"], "ja"],
          ["sn.rka12.4.02", "Advent, Brauchtum und die Weihnachtsgeschichte", "1/2", ["sachkunde:re-feste12"], "ja"],
          ["sn.rka12.4.03", "Leiden, Sterben und Auferstehung Jesu, Lichtsymbolik zu Ostern", "1/2", ["sachkunde:re-ostern12"], "ja"],
          ["sn.rka12.4.04", "Die Karwoche", "1/2", ["sachkunde:re-ostern12"], "ja"],
          ["sn.rka12.4.05", "Der Kirchenraum und seine Ausstattung", "1/2", ["sachkunde:re-kirche-taufe", "echtewelt:kirche"], "ja"],
          ["sn.rka12.4.06", "Die Taufe", "1/2", ["sachkunde:re-kirche-taufe"], "ja"]
        ]
      },
      "3": {
        1: [ // Miteinander leben
          ["sn.rka3.1.01", "Regeln und Gebote zum Schutz des Lebens, Goldene Regel", "3", ["sachkunde:re-mose", "sachkunde:et-freundschaft"], "ja"],
          ["sn.rka3.1.02", "Rache und Vergebung", "3", ["sachkunde:re-bruecken"], "ja"],
          ["sn.rka3.1.03", "Konflikte lösen, Brücken bauen", "3", ["sachkunde:re-bruecken"], "ja"],
          ["sn.rka3.1.04", "Das Judentum als Wurzel des christlichen Glaubens", "3", ["sachkunde:re-judentum"], "ja"]
        ],
        2: [ // Das Geheimnis entdecken
          ["sn.rka3.2.01", "Brot als Symbol, Speisung der Fünftausend, Eucharistie", "3", ["sachkunde:re-brot"], "ja"],
          ["sn.rka3.2.02", "Stille und Hören: Samuel", "3", ["sachkunde:re-brot"], "ja"],
          ["sn.rka3.2.03", "Bildrede von Gott, eigene Gottesvorstellungen", "3", ["sachkunde:re-bildworte"], "ja"],
          ["sn.rka3.2.04", "Die Bildsprache der Gleichnisse, Reich Gottes", "3", ["sachkunde:re-gleichnisse"], "ja"]
        ],
        3: [ // Die biblische Botschaft kennen lernen
          ["sn.rka3.3.01", "Die Zachäusgeschichte", "3", ["sachkunde:re-ausgegrenzte"], "ja"],
          ["sn.rka3.3.02", "Gleichnisse vom Schatz im Acker und vom Festmahl", "3", ["sachkunde:re-gleichnisse"], "ja"],
          ["sn.rka3.3.03", "Der barmherzige Samariter", "3", ["sachkunde:re-gleichnisse"], "ja"],
          ["sn.rka3.3.04", "Die Mosegeschichte, der Bund und die Zehn Gebote", "3", ["sachkunde:re-mose"], "ja"]
        ],
        4: [ // Mit der Kirche feiern
          ["sn.rka3.4.01", "Verkündigung des Herrn", "3", ["sachkunde:re-emmaus"], "ja"],
          ["sn.rka3.4.02", "Menschwerdung Gottes, die Weisen aus dem Osten", "3", ["sachkunde:re-feste12"], "ja"],
          ["sn.rka3.4.03", "Das Weizenkorn als Bild für Ostern", "3", ["sachkunde:re-emmaus"], "ja"],
          ["sn.rka3.4.04", "Der Emmausgang", "3", ["sachkunde:re-emmaus"], "ja"],
          ["sn.rka3.4.05", "Pfingsten als Geburtsstunde der Kirche", "3", ["sachkunde:re-pfingsten"], "ja"],
          ["sn.rka3.4.06", "Gottesdienst und eine liturgische Feier gestalten", "3", ["sachkunde:re-pfingsten", "echtewelt:kirche"], "aussen"]
        ]
      },
      "4": {
        1: [ // Miteinander leben
          ["sn.rka4.1.01", "Selbstvertrauen, Talente, Ermutigung", "4", ["sachkunde:re-verantwortung"], "ja"],
          ["sn.rka4.1.02", "Verantwortung für Menschen und Natur", "4", ["sachkunde:re-verantwortung"], "ja"],
          ["sn.rka4.1.03", "Gerechtigkeit und Ungerechtigkeit, Mobbing", "4", ["sachkunde:re-verantwortung", "sachkunde:et-gerechtigkeit"], "ja"],
          ["sn.rka4.1.04", "Kinderrechte", "4", ["sachkunde:re-verantwortung", "sachkunde:kinderrechte"], "ja"],
          ["sn.rka4.1.05", "Leben von Muslimen und die islamische Religion", "4", ["sachkunde:re-islam"], "ja"]
        ],
        2: [ // Das Geheimnis entdecken
          ["sn.rka4.2.01", "Das Symbol Baum", "4", ["sachkunde:re-symbole"], "ja"],
          ["sn.rka4.2.02", "Stilleübungen und das Labyrinth", "4", ["sachkunde:re-symbole", "echtewelt:stille"], "ja"],
          ["sn.rka4.2.03", "Psalmen und Gebete, eigene Psalmen", "4", ["sachkunde:re-beten"], "ja"]
        ],
        3: [ // Die biblische Botschaft kennen lernen
          ["sn.rka4.3.01", "Jesus setzt sich für Benachteiligte ein: Aussätziger, Hauptmann", "4", ["sachkunde:re-heilungen"], "ja"],
          ["sn.rka4.3.02", "Die Bibel als Buch des Lebens, Jesus und die Heilige Schrift", "4", ["sachkunde:re-heilungen", "sachkunde:re-bibel"], "ja"],
          ["sn.rka4.3.03", "Entstehung und Aufbau der Bibel", "4", ["sachkunde:re-bibel"], "ja"],
          ["sn.rka4.3.04", "Die Jakobserzählung", "4", ["sachkunde:re-jakob"], "ja"]
        ],
        4: [ // Mit der Kirche feiern
          ["sn.rka4.4.01", "Die Passionsgeschichte und das Kreuz", "4", ["sachkunde:re-passion"], "ja"],
          ["sn.rka4.4.02", "Der zweifelnde Tomas", "4", ["sachkunde:re-passion"], "ja"],
          ["sn.rka4.4.03", "Inhalt und Verlauf des Kirchenjahres", "4", ["sachkunde:re-kirchenjahr"], "ja"],
          ["sn.rka4.4.04", "Der Sonntag", "4", ["sachkunde:re-passion", "sachkunde:re-kirchenjahr"], "ja"],
          ["sn.rka4.4.05", "Die Ökumene", "4", ["sachkunde:re-oekumene"], "ja"]
        ]
      }
    }
  };
  // Übergang in Klasse 5 (Mathe) nach den Lehrplänen Oberschule (2019) und Gymnasium (2021) Sachsen, Klassenstufe 5 (29.10.2026; PDFs vom
  // Auftraggeber, nur zusammengefasst). Kein Lernbereich des Grundschul-Profils – wird nur für Kinder in der Stufe „Übergang 5“ im
  // Elternbereich gezeigt, je nach Eltern-Wahl eltern.mathe.schulart = "os" | "gy" (Standard Oberschule). P.uebergang.mathe = alle Punkte beider Schularten.
  const zuPunkt = ([id, text, kl, app, abdeckung]) => ({ id, text, kl, app, abdeckung });
  P.uebergang = { stand: "Lehrplan Mathematik Klasse 5: Oberschule 2019, Gymnasium 2021", schularten: {
    os: { name: "Oberschule", quelle: "Lehrplan Oberschule Mathematik (2019), Klassenstufe 5", lb: [
      { nr: 1, titel: "Natürliche Zahlen", punkte: [
        ["sn.os5.1.01", "Natürliche Zahlen veranschaulichen, schätzen, runden, vergleichen und ordnen – auch große Zahlen, am Zahlenstrahl", "5", ["mathe:k5grosszahl", "mathe:k4million", "mathe:k4runden"], "ja"],
        ["sn.os5.1.02", "Potenzschreibweise, abgetrennte Zehnerpotenzen", "5", ["mathe:k5grosszahl"], "ja"],
        ["sn.os5.1.03", "Grundrechenarten mündlich, halbschriftlich und schriftlich, Überschlag", "5", ["mathe:k5fit", "mathe:k4malmehr", "mathe:k4runden"], "ja"],
        ["sn.os5.1.04", "Rechenstrategien, Rechengesetze und Vorrangregeln", "5", ["mathe:k5klammer", "mathe:k5terme", "mathe:k4geschickt"], "ja"],
        ["sn.os5.1.05", "Schriftlich dividieren durch einen einstelligen Divisor", "5", ["mathe:k4geteilt", "mathe:k5fit"], "ja"],
        ["sn.os5.1.06", "Quadratzahlen bis 20² im Kopf, Quadratwurzel als Umkehrung", "5", ["mathe:k5quadrat"], "ja"],
        ["sn.os5.1.07", "Einfache Gleichungen und Ungleichungen inhaltlich lösen, Textgleichungen", "5", ["mathe:k5gleichung", "mathe:k5terme"], "ja"],
        ["sn.os5.1.08", "Teilbarkeit: Vielfache, Teiler, Regeln für 3, 4 und 6, Primzahlen", "5", ["mathe:k5teiler", "mathe:k4teilbar", "mathe:k4primzahl"], "ja"]
      ].map(zuPunkt) },
      { nr: 2, titel: "Gemeine Brüche, Dezimalzahlen und Größen", punkte: [
        ["sn.os5.2.01", "Brüche erkennen und darstellen: an Figuren, echte und unechte Brüche, am Zahlenstrahl", "5", ["mathe:k5bruchbild", "mathe:k5bruchvon", "mathe:k5kuerzen"], "teil"],
        ["sn.os5.2.02", "Zehnerbrüche und Dezimalzahlen ineinander umwandeln, Stellenwerttafel erweitern", "5", ["mathe:k5dezimal"], "ja"],
        ["sn.os5.2.03", "Brüche vergleichen, ordnen und abschätzen", "5", ["mathe:k5bruchvergleich"], "ja"],
        ["sn.os5.2.04", "Dezimalzahlen runden", "5", ["mathe:k5dezimal"], "ja"],
        ["sn.os5.2.05", "Dezimalzahlen addieren, subtrahieren, mit einstelligen Zahlen und Zehnerpotenzen multiplizieren und dividieren", "5", ["mathe:k5dezrechnen"], "ja"],
        ["sn.os5.2.06", "Prozentschreibweise für einfache Anteile (1 %, 10 %, 20 %, 25 %, 50 %, 75 %, 100 %)", "5", ["mathe:k5prozent"], "ja"],
        ["sn.os5.2.07", "Sachaufgaben mit Geld, Länge, Masse und Zeit: Schreibweisen, Umrechnen, Dezi, Zenti, Milli", "5", ["mathe:k5komma", "mathe:k5groessen", "mathe:k5sach"], "ja"]
      ].map(zuPunkt) },
      { nr: 3, titel: "Geometrische Grundformen", punkte: [
        ["sn.os5.3.01", "Koordinate und Koordinatensystem (erster Quadrant)", "5", ["mathe:k5koordinaten"], "ja"],
        ["sn.os5.3.02", "Parallel, senkrecht, schneiden einander", "5", ["mathe:k5lage"], "ja"],
        ["sn.os5.3.03", "Winkel messen und zeichnen, Winkelarten", "5", ["mathe:k5lage", "mathe:k5winkel", "echtewelt:lineal"], "aussen"],
        ["sn.os5.3.04", "Würfel skizzieren, Körpernetz, Schrägbild, Körpermodell bauen", "5", ["mathe:k3netze", "mathe:k4schraegbild", "echtewelt:bauplan"], "teil"],
        ["sn.os5.3.05", "Umfang und Flächeninhalt von Figuren aus Rechtecken, Flächeneinheiten", "5", ["mathe:k5raum", "mathe:k4flaeche", "mathe:k3umfang"], "ja"],
        ["sn.os5.3.06", "Oberfläche und Volumen des Würfels, Volumeneinheiten", "5", ["mathe:k5raum", "mathe:k4volumen"], "ja"]
      ].map(zuPunkt) },
      { nr: 4, titel: "Symmetrie und deckungsgleiche Figuren", punkte: [
        ["sn.os5.4.01", "Spiegelungen und Verschiebungen in Natur, Kunst und Technik, Symmetrieachse", "5", ["mathe:k5bewegung", "mathe:k5geometrie", "mathe:k3spiegel"], "ja"],
        ["sn.os5.4.02", "Symmetrische und deckungsgleiche Figuren zeichnen: Geradenspiegelung, Verschiebung, Original und Bild", "5", ["mathe:k5bewegung", "echtewelt:lineal"], "aussen"]
      ].map(zuPunkt) },
      { nr: 9, titel: "Wahlbereiche (freiwillig)", punkte: [
        ["sn.os5.9.01", "Wie die Menschen zählen und rechnen lernten: Zahlzeichen, Rechnen auf den Linien", "5", ["mathe:k4roemisch", "mathe:k4rechenbrett"], "ja"],
        ["sn.os5.9.02", "Meine neue Klasse: Daten erfassen, Mittelwert, Möglichkeiten zählen", "5", ["mathe:k5mittel", "mathe:k5moeglich", "echtewelt:umfrage"], "ja"]
      ].map(zuPunkt) }
    ] },
    gy: { name: "Gymnasium", quelle: "Lehrplan Gymnasium Mathematik (2019/2021), Klassenstufe 5", lb: [
      { nr: 1, titel: "Arbeiten mit natürlichen Zahlen", punkte: [
        ["sn.gy5.1.01", "Natürliche Zahlen veranschaulichen, schätzen, runden, vergleichen und ordnen", "5", ["mathe:k5grosszahl", "mathe:k4runden"], "ja"],
        ["sn.gy5.1.02", "Rechenstrategien, Rechengesetze, Überschlag; einfache Gleichungen inhaltlich lösen", "5", ["mathe:k5klammer", "mathe:k5terme", "mathe:k5gleichung", "mathe:k5fit"], "ja"],
        ["sn.gy5.1.03", "Potenzieren: Zehnerpotenzen, Quadratzahlen bis 20²", "5", ["mathe:k5grosszahl", "mathe:k5quadrat"], "ja"],
        ["sn.gy5.1.04", "Dividieren im Kopf und schriftlich (bis dreistellig durch einstellig, auch mit Rest), Probe", "5", ["mathe:k4geteilt", "mathe:k3rest"], "ja"],
        ["sn.gy5.1.05", "Teiler, Primzahlen, Teilbarkeitsregeln für 3, 4 und 6, einfache Primfaktorzerlegung", "5", ["mathe:k5teiler", "mathe:k4teilbar", "mathe:k4primzahl"], "ja"]
      ].map(zuPunkt) },
      { nr: 2, titel: "Gemeine Brüche und Dezimalzahlen", punkte: [
        ["sn.gy5.2.01", "Brüche darstellen an Figuren, Körpern und am Zahlenstrahl, Anteile von Größen", "5", ["mathe:k5bruchbild", "mathe:k5bruchvon"], "teil"],
        ["sn.gy5.2.02", "Kürzen und Erweitern, echte und unechte Brüche", "5", ["mathe:k5kuerzen"], "ja"],
        ["sn.gy5.2.03", "Stellenwerttafel erweitern, Prozentschreibweise für ausgewählte Anteile", "5", ["mathe:k5dezimal", "mathe:k5prozent"], "ja"],
        ["sn.gy5.2.04", "Brüche, Dezimalzahlen und Prozentangaben ineinander umwandeln", "5", ["mathe:k5dezimal", "mathe:k5prozent"], "ja"],
        ["sn.gy5.2.05", "Vergleichen, ordnen, abschätzen und runden", "5", ["mathe:k5bruchvergleich", "mathe:k5dezimal"], "ja"],
        ["sn.gy5.2.06", "Dezimalzahlen addieren, subtrahieren, mit einstelligen Zahlen und Zehnerpotenzen multiplizieren und dividieren", "5", ["mathe:k5dezrechnen"], "ja"],
        ["sn.gy5.2.07", "Arithmetisches Mittel", "5", ["mathe:k5mittel"], "ja"]
      ].map(zuPunkt) },
      { nr: 3, titel: "Lagebeziehungen geometrischer Objekte", punkte: [
        ["sn.gy5.3.01", "Punkte und Strecken im Koordinatensystem, parallele und senkrechte Geraden", "5", ["mathe:k5koordinaten", "mathe:k5lage"], "ja"],
        ["sn.gy5.3.02", "Winkel zeichnen, messen und bezeichnen, Winkelarten", "5", ["mathe:k5winkel", "mathe:k5lage", "echtewelt:lineal"], "aussen"],
        ["sn.gy5.3.03", "Scheitel-, Neben-, Stufen- und Wechselwinkel und ihre Eigenschaften", "5", ["mathe:k5winkelpaare"], "ja"],
        ["sn.gy5.3.04", "Symmetrie im Alltag: Muster, Achsen- und Punktsymmetrie, Verschiebung, Drehung und Spiegelung unterscheiden", "5", ["mathe:k5bewegung", "mathe:k3ornament", "mathe:k4parkett"], "ja"],
        ["sn.gy5.3.05", "Geradenspiegelung zeichnen und beschreiben, gleiche Seiten und Winkel", "5", ["mathe:k5bewegung", "mathe:k3spiegel", "echtewelt:lineal"], "aussen"]
      ].map(zuPunkt) },
      { nr: 4, titel: "Rechtecke und Quader", punkte: [
        ["sn.gy5.4.01", "Umfang und Flächeninhalt von Rechtecken: Formeln, Einheiten, zusammengesetzte Figuren", "5", ["mathe:k5raum", "mathe:k4flaeche", "mathe:k3umfang"], "ja"],
        ["sn.gy5.4.02", "Quader darstellen: Grundriss, Seitenansichten, Schrägbild, Körpernetz", "5", ["mathe:k3ansicht", "mathe:k3plaene", "mathe:k4schraegbild", "mathe:k3netze"], "ja"],
        ["sn.gy5.4.03", "Aus Quadern zusammengesetzte Körper", "5", ["mathe:k3wuerfelbau", "mathe:k4schraegbild"], "ja"],
        ["sn.gy5.4.04", "Oberfläche und Volumen von Quadern, Volumeneinheiten und Hohlmaße", "5", ["mathe:k5raum", "mathe:k4volumen", "mathe:k4liter"], "ja"]
      ].map(zuPunkt) },
      { nr: 5, titel: "Vernetzung: Mathematik im Alltag", punkte: [
        ["sn.gy5.5.01", "Sachaufgaben mit Größen, Einheiten von Zeit, Masse, Länge, Fläche und Volumen umrechnen", "5", ["mathe:k5sach", "mathe:k5groessen"], "ja"],
        ["sn.gy5.5.02", "Sinnvoll runden, mit Näherungswerten umgehen, Fahrpläne, Schätzaufgaben (Fermi)", "5", ["mathe:k4reise", "mathe:k3daten", "mathe:k4runden"], "teil"],
        ["sn.gy5.5.03", "Ein Alltagsprojekt mathematisch planen (Spendenaktion, Sportfest, weniger Verpackungsmüll)", "5", ["echtewelt:umfrage", "echtewelt:einkauf"], "aussen"]
      ].map(zuPunkt) },
      { nr: 9, titel: "Wahlbereiche (freiwillig)", punkte: [
        ["sn.gy5.9.01", "Mathematische Puzzles und Spiele", "5", ["mathe:k3knobeln", "mathe:k5moeglich"], "ja"],
        ["sn.gy5.9.02", "Zählen und Rechnen – einst und jetzt", "5", ["mathe:k4roemisch", "mathe:k4rechenbrett"], "ja"]
      ].map(zuPunkt) }
    ] } } };
  P.uebergang.mathe = [].concat(...Object.values(P.uebergang.schularten).map(s => [].concat(...s.lb.map(l => l.punkte))));
  Object.entries(PUNKTE).forEach(([fach, stufen]) => Object.entries(stufen).forEach(([st, lbs]) => Object.entries(lbs).forEach(([nr, liste]) => {
    const lb = (((P.faecher[fach] || {}).stufen || {})[st] || []).find(x => x.nr === +nr);
    if (lb) lb.punkte = liste.map(([id, text, kl, app, abdeckung]) => ({ id, text, kl, app, abdeckung }));
  })));
})();
