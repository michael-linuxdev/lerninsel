# Lerninsel – Gesamtkonzept

> Überarbeitet am 26.10.2026 (Neuausrichtung). Die Grundprinzipien sind unverändert.
> Neu: Story-Rahmen, Tutorial, Verzahnungs-Landkarte, Individualisierungs-Modell.
> Verwandte Dokumente: [`LEHRPLAN.md`](LEHRPLAN.md) · [`SPRACHEN.md`](SPRACHEN.md) · [`GRAFIK.md`](GRAFIK.md) ·
> [`MINISPIELE.md`](MINISPIELE.md) · [`PLAN.md`](PLAN.md) (Abschnitt „Neuausrichtung 26.10.2026“).

## In einem Satz
Eine Lern-Gewohnheits-App für Kinder von der Vorschule bis zum Übergang in Klasse 5: jeden Tag ein kurzer, verbindlicher
Lernblock nach Lehrplan, danach freies Spielen auf der eigenen 3D-Insel – offline, ohne Werbung, ohne Käufe, mit Eltern als
letzter Instanz. Gemacht auch für Kinder mit anderer Muttersprache und für Kinder, die gerade erst Deutsch lernen.

## Grundprinzipien (unverändert)
1. **Erst lernen, dann spielen.** Der Lernblock (10–15 min) ist der Kern, Spiele sind Belohnung.
2. **Gesunde Bildschirmzeit** nach DGKJ-Leitlinie: Standardwerte nach Alter, bildschirmfreie Zeiten, die App schickt ins echte Leben.
3. **Eltern entscheiden:** Ersteinrichtung und alle Regeln im Elternbereich (PIN). Erwachsene dürfen immer spielen (ohne Sterne).
4. **Datenschutz zuerst:** alles bleibt auf dem Tablet, kein Bezug zu einem echten Kind im Code, kein Server bis echter Bedarf.
5. **Integration:** Hilfesprache (zuerst Russisch), später jede Muttersprache; Elternbereich in der Sprache der Eltern.
6. **Rücksicht auf Unterschiede:** Fokus-Hilfen (z. B. ADHS), kurze Häppchen, keine Strafen, ruhige Darstellung möglich.
7. **Nie Werbung, nie In-App-Käufe.** Sterne gibt es nur durchs Lernen und Spielen.

Dazu gelten die festen Regeln: keine Daten verlassen das Gerät (einzige Ausnahme: Wetter von Open-Meteo ohne GPS), keine
Lootboxen, kein Druck durch Serien, keine Ranglisten zwischen Kindern, mehrere Kinder pro Tablet, QR-Übertragung bleibt.

## Was die Rückmeldung vom 26.10.2026 verändert
Die App ist in kurzer Zeit breit geworden (Fächer, Insel, Atelier, Schach, Gefühle, Schatzkammer …), aber die Teile stehen
nebeneinander wie einzelne Inseln. Ein Kind versteht nicht, **warum** es lernt, was Sterne, Lernfunde, Wissensbaum und Spielzeit
miteinander zu tun haben, und die Inhalte sind an vielen Stellen dünn. Die Neuausrichtung setzt deshalb fünf Schwerpunkte:

| # | Schwerpunkt | Dokument |
|---|---|---|
| 1 | Eine durchgehende Geschichte und ein Tutorial, das zeigt statt erklärt | dieses Dokument |
| 2 | Verzahnung der Features und Anpassung an das einzelne Kind | dieses Dokument |
| 3 | Inhaltliche Tiefe nach Lehrplänen, Vorschule bis Übergang Klasse 5, acht Fächer | `LEHRPLAN.md` |
| 4 | Muttersprachen nach Statistik, Deutsch als Zweitsprache als eigener Schwerpunkt | `SPRACHEN.md` |
| 5 | Grafik vom Prototyp zum Stil – grundlegend neu erlaubt, mit Leistungsbudget fürs iPad 10 | `GRAFIK.md` |
| 6 | Mehr und vielfältigere Minispiele, jedes mit Lern- oder Story-Bezug | `MINISPIELE.md` |

**Reihenfolge (entschieden 26.10.2026):** Story und Tutorial kommen nach vorn. Weihnachten ist kein Endpunkt mehr, sondern
ein **Sonder-Start**: Wer die App im Dezember erstmals startet (oder ein Weihnachts-QR-Geschenk scannt), erlebt die Ankunft
verschneit und bekommt ein Geschenk. Das Grundgerüst muss deshalb vor Mitte Dezember stehen (siehe `PLAN.md`).

---

## 1. Leitidee mit Story-Rahmen: „Die Insel erwacht“

### Die Welt
Die Insel liegt seit langer Zeit im Nebel und schläft. Ihr Herz ist der **Wissensbaum** – er ist nur noch ein Spross.
Die Nachbarn sind da, aber jeder hat ein Problem, das er allein nicht lösen kann. Das Kind kommt mit dem Boot von Robo Pixel an,
bekommt ein Ei geschenkt und zieht in das kleine Haus.

**Warum lernen?** Weil **Wissen die Insel aufweckt**. Jedes Mal, wenn das Kind etwas Neues kann, wächst eine Frucht am
Wissensbaum (ein Lernfund). Der Baum treibt den Nebel zurück, Wege und Orte tauchen auf, Nachbarn bekommen ihre Hilfe.
Die Geschichte erklärt so in Bildern, was heute in Zahlen versteckt ist: **Man lernt nicht für Sterne, sondern weil man dann
etwas kann – und das sieht man auf der Insel.**

### Die Begriffe der Insel, so wie ein Kind sie verstehen soll
Jeder Begriff bekommt **ein Bild, einen Satz und einen Moment im Tutorial**, in dem er zum ersten Mal vorkommt.

| Begriff | Ein Satz fürs Kind | Bild auf der Insel | Wer erklärt es | Heute im Code |
|---|---|---|---|---|
| Lernfund | „Das kannst du jetzt neu!“ | leuchtende Frucht | Ella | `shared/lernfunde.js` |
| Wissensbaum | „Alles, was du gelernt hast, wächst hier.“ | Baum vor dem Haus, vertreibt den Nebel | Ella | `heimat.js` (Wissensbaum) |
| Stern | „Damit gestaltest du dein Zuhause.“ | Sternenglas im Zimmer | Benno | `S.sterne` in `shared/core.js` |
| Spielzeit | „Die Sonne für die Spielorte – sie geht auf, wenn du gelernt hast.“ | Sonnenuhr am Steg, Spielorte schlafen sonst | Pixel | `shared/zeit.js` |
| Lernkartei | „Was schwer war, kommt nochmal – bis es leicht ist.“ | Fipsis Merkkiste | Fipsi | `shared/lernkartei.js` |
| Nachbarn | „Jeder kann etwas anderes und braucht deine Hilfe.“ | Häuser/Plätze der Figuren | alle | `heimat.js` |
| Zimmer | „Dein Zuhause – richte es ein, wie du willst.“ | Haus mit Tür | Benno | `heimat.js` (Zimmer) |
| Atelier | „Hier entsteht, was es noch nicht gibt.“ | Paulas Werkstatt, Bühne | Paula | `spiele/atelier/` |
| Fähigkeiten | „Was du übst, wird stärker.“ | Spiegel im Zimmer | Bruni | `shared/charakter.js` |
| Tier | „Dein Freund, der mit dir wächst.“ | läuft mit | Pixel | `shared/tierpflege.js` |
| Schatzkammer | „Hier liegt alles, was du je geschafft hast.“ | Höhle unter dem Wissensbaum (Kapitel 4) | Tilda | `spiele/schatz/` |

### Figuren und Rollen
Jede Figur hat ein Fach, ein Problem in der Geschichte und eine Rolle im Tutorial. Steckbriefe fürs Aussehen in `GRAFIK.md`.

| Figur | Fach / Bereich | Rolle in der Geschichte | Rolle im Tutorial |
|---|---|---|---|
| Robo Pixel | Medienbildung | Fährmann und Funker: bringt das Kind, fährt später zu neuen Inseln | Ankunft, Bedienung, Spielzeit |
| Eule Ella | Sachunterricht | Hüterin des Wissensbaums, kennt Natur und Wetter | erster Lernfund, Wissensbaum |
| Fuchs Fipsi | Deutsch, DaZ | sucht seine Schatzkarte (Deutsch-Abenteuer) – die Karte zeigt neue Orte | Lernkartei, Wörter |
| Biber Benno | Mathematik | will die Brücke zum Nachbar-Eiland bauen | Sterne, Zimmer, Bauplatz |
| Bärin Bruni | Gefühle, Miteinander, Bewegung | hält die Inselgemeinschaft zusammen, hat Angst vor Stürmen | Wie geht's dir?, Pausen |
| Papagei Paula | Kunst, Musik | will ein Inselfest feiern, aber niemand hat Bilder und Lieder | Atelier, Bühne |
| Schildkröte Tilda | Denken, Schach, Rätsel | alt und weise, kennt den Weg zum Leuchtturm | Schatzkammer, Rätsel |
| Kind-Figur | – | Hauptfigur, sieht aus, wie das Kind es will | – |
| eigenes Tier | – | Begleiter, wächst mit der Freundschaft | – |

Eine Figur für Englisch (ab Klasse 3, z. B. ein Pinguin) und eine Figur für die Vorschule (Spielzeug-Ecke) sind vorgesehen,
werden aber erst gebaut, wenn die Inhalte dafür stehen.

### Kapitelbogen
Kapitel öffnen sich über den **Wissensbaum** (die bestehenden Stufen 1, 5, 15, 35, 70, 120 Lernfunde, später erweitert)
**und** über eine kleine Bedingung im Fach der jeweiligen Figur. So treibt Lernen die Geschichte voran, und kein Fach wird
dauerhaft übergangen. Es gibt nie eine Frist und nie einen Rückschritt.

| Kapitel | Öffnet bei | Was passiert | Verzahnung |
|---|---|---|---|
| Prolog „Ankunft“ | Erststart | Pixel bringt das Kind, Ei, Haus, erste Schritte (Tutorial E1–E3) | Weihnachts-Sonderstart im Dezember / per QR |
| 1 „Der Spross“ | 1 Lernfund | Ella zeigt den Wissensbaum; der Nebel weicht vom Haus | Sternenlauf öffnet sich |
| 2 „Fipsis Karte“ | 5 Funde + 1 Deutsch-Kapitel | Fipsi findet ein Stück Karte, ein neuer Weg erscheint | Wörter aus Deutsch stehen auf Schildern |
| 3 „Bennos Brücke“ | 15 Funde + 1 Mathe-Station mit 2 ⭐ | Mathe-Aufgaben am Bauplatz liefern die Pläne, die Brücke entsteht in der Welt | Bauwerk vom Bauplatz in der Welt |
| 4 „Paulas Fest“ | 35 Funde + 1 Bild und 1 Melodie | Inselfest: eigene Bilder als Plakate, eigene Melodie auf der Bühne | Atelier → Story, Bühne |
| 5 „Der Sturm“ | 70 Funde + 1 Sachthema „Wetter“ | Bruni und Ella bereiten die Insel vor, danach räumen alle gemeinsam auf | echtes Wetter, Gefühle, Bewegung |
| 6 „Der Leuchtturm“ | 120 Funde + 3 Schach-Rätsel | Tilda führt zum Leuchtturm, nachts leuchtet die Insel | Schatzkammer in der Höhle |
| 7 „Neue Ufer“ | 200 Funde (neu) | Pixel fährt zu einem Nachbar-Eiland (eigene Welt aus dem Wünsche-Assistenten) | Übergang Klasse 5, neue Themen |

**Episoden** (wiederkehrend, unabhängig von den Kapiteln): Jahreszeiten, Feste in Deutschland und in den Herkunftsländern
(Nikolaus, Ded Moros, Nouruz, Zuckerfest, Ostern …), Geburtstag des Kindes, Weihnachten. Sie dauern ein paar Tage und
verschwinden ohne Verlust wieder.

**Regeln für die Geschichte**
- Szenen sind kurz (höchstens 4 Sprechblasen), jede Zeile wird vorgelesen und hat Muttersprach-Hilfe.
- Keine Szene blockiert das Lernen: Story-Szenen sind nur auf der Insel, nie vor dem Lernblock.
- Jede Szene lässt sich in der „Inselchronik“ (Seite im Stickeralbum) noch einmal ansehen.
- Kein Druck: Ein Kapitel wartet, bis es soweit ist. Nichts geht verloren.

---

## 2. Tutorial: „zeigen statt erklären“

### Grundsätze
1. **Genau dann, wenn es gebraucht wird:** Ein Begriff wird erklärt, wenn er das erste Mal auftaucht, nicht vorher.
2. **Erst tun, dann benennen:** Das Kind läuft zuerst zum Baum, dann sagt Ella, was er ist.
3. **Ohne Lesen bedienbar:** Jede Zeile wird automatisch vorgelesen (abschaltbar), Zeigehand und Leuchten führen zum Ziel,
   Muttersprache als Ton, wenn eingestellt (siehe `SPRACHEN.md`).
4. **Höchstens zwei neue Etappen pro Tag**, damit die ersten Tage nicht zu voll werden.
5. **Nie gesperrt:** Eltern können das Tutorial überspringen; Kinder können jede Etappe bei Pixel („Wie ging das nochmal?“) wiederholen.

### Etappen
| Etappe | Auslöser | Was das Kind tut | Was es danach versteht |
|---|---|---|---|
| E0 Eltern | Ersteinrichtung | Eltern: PIN, Kind, Alter/Stufe, Bundesland, Muttersprache, Deutschstand (neu) | – |
| E1 Ankunft | erster Besuch der Insel | mit Pixel ans Ufer, Joystick schieben (Zeigehand), zum Haus laufen, Aktionsknopf „Reingehen“ | Laufen, Aktionsknopf |
| E2 Erst lernen | erster Lernblock | Sonnenuhr am Steg ist dunkel → Pixel führt zu einer Nachbarin → 5 Aufgaben → Sonne geht auf | Lernen öffnet Spielzeit |
| E3 Erste Frucht | erster Lernfund | Frucht ploppt am Spross, Ella erklärt den Wissensbaum, Nebel weicht ein Stück | Lernfund, Wissensbaum |
| E4 Sterne | erste Sterne | Benno zeigt das Sternenglas im Zimmer, Kind kauft das erste Möbel | Sterne gestalten das Zuhause |
| E5 Das Ei | Tag 1 oder 2 | Ei wärmen, schlüpfen, Namen geben | Tier, Freundschaft ohne Strafe |
| E6 Spielorte | erste Spielzeit | ein Spielort wacht auf, Kind spielt eine Runde | Spielorte, Spielzeit läuft ab |
| E7 Wiederholen | erste fällige Karte | Fipsi holt eine Karte aus der Merkkiste | Lernkartei |
| E8 Wie geht's dir? | Tag 2–3 | Bruni fragt freundlich | Gefühls-Barometer, Pausen |
| E9 Atelier | Kapitel 1 erreicht | Paula zeigt Malen und Xylofon | Atelier, Bilder an der Wand |
| E10 Meine Ecke | Tag 3–4 | Spiegel: Fähigkeiten, „Was ich gut kann“ | Fähigkeiten, Stärken |

Heutiger Zugang: Die Insel öffnet sich erst mit dem kompletten Tablet-Führerschein (6 Lektionen, `index.html`).
**Vorschlag:** Im Prolog öffnet die Lektion „Bedienung“ die Insel; die übrigen Lektionen werden Aufgaben in Kapitel 1–2.
Eltern können die alte Regel per Schalter behalten. (Offene Frage an den Auftraggeber, siehe `PLAN.md`.)

### Weihnachts-Sonderstart
- Erststart zwischen 1. und 26. Dezember **oder** Scan eines Weihnachts-QR-Codes (auch später im Jahr): Ankunft im Schnee,
  ein Paket am Steg (Ei mit Schleife oder Weihnachtsmütze, Tannenbaum fürs Zimmer), Pixel mit Lichterkette.
- QR-Geschenke werden signiert (öffentlicher Schlüssel in der App, privater nur beim Auftraggeber), jeder Code einmal pro Kind.
- Ohne QR und außerhalb des Dezembers ist der Prolog gleich, nur ohne Schnee und Paket.

---

## 3. Verzahnungs-Landkarte
Ziel: Jedes Feature gibt etwas an andere weiter. Technisch über **gemeinsame Daten** (Lernziel-IDs, Wortschatz-Kern,
Lernfunde) und **Insel-Ereignisse** (`shared/ereignisse.js`, neu: kleine Nachrichten wie `fund`, `bild`, `melodie`, `bauwerk`).

| Von | gibt | an | Beispiel |
|---|---|---|---|
| Deutsch / DaZ | Wörter (mit Bild, Artikel, Mehrzahl, Übersetzung) | Sachunterricht, Insel-Schilder, Tier, Wort des Tages, Minispiele | „der Ahorn“ aus Fipsis Kapitel steht am Baum und kommt in Ellas Quiz |
| Sachunterricht | Themen und Fachwörter | Deutsch-Lesetexte, Malaufträge, Echte-Welt-Aufgaben | Thema „Zugvögel“ → Lesetext über Störche, Malauftrag „Vogel im Flug“ |
| Mathematik | gelöste Stationen | Bauplatz (Baupläne), Kart (Strecken-Länge), Bäckerei-Minispiel (Geld) | Station „Länge“ → Bennos Brücke braucht 12 Bretter |
| Atelier | Bilder, Melodien | Zimmer, Bühne, Story (Festplakate), Tier tanzt | Kapitel 4 nutzt eigene Bilder als Plakate |
| Gefühle / Miteinander | Ruhe-Übungen, Gesprächsimpulse | Zeitsystem-Pausen, Story (Sturm), Wochenbericht | Pause nach 5 min nutzt „Ballon-Atmen“ |
| Lernkartei | schwere Aufgaben | Tagesaufgaben, Mini-Wiederholung in Minispielen (freiwillig) | Sternenlauf zeigt nach dem Lauf ein gemeistertes Wort |
| Lernfunde | Früchte, Zähler | Wissensbaum, Kapitel, Spielorte, Pinnwand, Schatzkammer, Nachbarn | 15 Funde → Kapitel 3 und Bauplatz |
| Wetter (echt) | Wetterart | Insel, Sachunterricht, Sticker, Story (Sturm) | Regen draußen → Ella erklärt Regen |
| Stärken | bemerkte Stärken | Minispiel-Vorschläge, Story-Texte | „Du baust gern“ → Benno lädt zum Bauplatz ein |
| Wünsche-Assistent | Lieblingslandschaft, Farbe | Aufgaben-Themen, Minispiel-Kulissen | Wüste gewählt → Rechenaufgaben mit Kamelen |
| Echte Welt | erledigte Aufgaben | Lernfund, Wochenbericht | Messen in der Küche → grüne Frucht |
| Eltern | Freigaben, Thema der Woche | Tagesaufgaben, Erklär-Moment | Thema „Uhr“ → Tagesaufgabe Uhr |

**Regel:** Die Verzahnung darf nie das Lernen ersetzen oder eine zweite Währung schaffen. Es gibt nur Sterne;
Lernfunde sind sichtbar, aber keine Währung.

---

## 4. Individualisierungs-Modell (alles lokal)

### Welche Daten
| Datum | Woher | Wofür | Wo gespeichert |
|---|---|---|---|
| Stufe (Vorschule, Klasse 1–4, Übergang 5) und Alter | Eltern (E0) | Inhalte, Zeitsystem-Standards | Profil |
| Bundesland | Eltern | Lehrplan-Filter, Feste, Schreibschrift | Profil |
| Muttersprache(n) | Eltern | Hilfesprache, Tonhilfe | Profil |
| Deutschstand (neu: „keine“, „wenig“, „Alltag“, „gut“) | Eltern, später Einstufung | DaZ-Pfad, Vorlesen, Bildhilfe | Profil |
| Können je Lernziel | Aufgaben, Lernkartei | nächste Aufgabe, Schwierigkeit | Profil (kompakt: Lernziel-ID → Stand 0–4) |
| Fehlermuster | Lernkartei | Wiederholung, Arbeitsblätter | Profil |
| Interessen | Wünsche-Assistent, Minispiel-Wahl, Themenwahl | Aufgaben-Kulissen, Vorschläge | Profil |
| Stärken | Kind, App, Eltern (bestehend) | Lob, Vorschläge | Profil |
| Fokus-Hilfen, ruhige Darstellung | Eltern | Häppchen, Effekte | Profil |

Keine Diagnosen, keine Persönlichkeits-Einschätzungen, nichts verlässt das Gerät (außer über QR/Datei auf Wunsch).

### Welche Anpassungen
1. **Niveau:** Jedes Lernziel hat einen Stand 0–4 (neu, geübt, sicher, gemeistert, wiederholt). Die nächste Aufgabe kommt aus dem
   niedrigsten offenen Lernziel der eigenen Stufe; Ziel ist eine Trefferquote von etwa 70–85 %. Nach zwei Fehlern in Folge
   wird die Aufgabe leichter (kleinere Zahlen, Bild statt Text, Auswahl statt Eingabe).
2. **Stufe beweglich:** Ein Kind darf Lernziele aus der Stufe darunter wiederholen und aus der Stufe darüber probieren,
   ohne dass die Eltern die Klasse ändern müssen.
3. **Muttersprache dosiert:** Bei „keine/wenig Deutsch“ ist die Hilfe sichtbar und wird automatisch vorgelesen; mit wachsendem
   Deutschstand wird sie erst auf Knopfdruck angeboten, dann nur noch bei neuen Wörtern („Ausschleichen“).
4. **Interessen als Kulisse:** Gleiche Aufgabe, andere Bilder (Tiere, Fahrzeuge, Weltraum, Natur).
5. **Fehler gezielt:** Lernkartei in allen Fächern, Arbeitsblätter aus den eigenen Fehlern.
6. **Alter:** Vorschule und Klasse 1 ohne Lesepflicht (alles mit Ton und Bildern), große Ziele; ab Klasse 3 mehr Text.
7. **Fokus:** kürzere Häppchen, weniger Effekte, gleiche Reihenfolge jeden Tag.

---

## 5. Bausteine (aktualisiert)
| Bereich | Inhalt |
|---|---|
| Lernen | Mathematik (Benno), Deutsch (Fipsi), DaZ (Fipsi, neu), Sachunterricht (Ella), Kunst und Musik (Paula), Bewegung und Gefühle (Bruni), Ethik/Miteinander (Bruni), Medienbildung (Pixel), Denken/Schach (Tilda), Englisch ab Kl. 3 (später). Lehrplan: KMK-Kern + Länder (Sachsen, NRW, Bayern, Baden-Württemberg, Niedersachsen, Berlin/Brandenburg). |
| Geschichte | Prolog, 7 Kapitel, Episoden, Inselchronik |
| Gewohnheit | Tagesaufgaben, Zeitsystem, Erinnerungen der Figuren, Lernfunde, Lernkartei in allen Fächern |
| Charakter | Fähigkeiten, Stärken, Stickeralbum, Schatzkammer |
| Spielen | 3D-Insel und eigene Welten, Minispiele nach Vorlieben (`MINISPIELE.md`) |
| Familie & Papier | Duell, Erklär-Moment, Echte-Welt-Aufgaben, Arbeitsblätter |
| Sozial ohne Server | QR-Geschenke, Sticker tauschen, Insel-Besuchskarte |
| Später | Sicherheits-Insel mit Server (unverändert: erst bei echtem Bedarf) |

## 6. Schärfung (Oktober 2026): Fortschritt statt Eintrittskarte
Unverändert gültig (Lernfunde, Brücke ins echte Leben, Eltern als Mitspieler, Langzeit-Motivation). Punkt 5 „Muttersprache als
Stärke“ ist nach `SPRACHEN.md` umgezogen. Die offenen Fragen von damals sind beantwortet: Lernfunde wandern in die Schatzkammer
(erledigt), Eltern bestätigen Funde beim Erklär-Moment (erledigt). Offen bleibt: Wie viel Muttersprache zeigen, wenn die
Hilfesprache aus ist – Antwort jetzt im DaZ-Konzept (Ausschleichen statt Ausschalten).

## 7. Wo Feedback einholen – von wem und warum
| Wann | Von wem | Warum | Wie |
|---|---|---|---|
| Laufend | **das erste Testkind** | zeigt, was Spaß macht, was verwirrt, was frustriert | Beobachten statt fragen, 2–3 kurze Fragen danach |
| Nach dem Prolog/Tutorial | **ein Kind, das die App nicht kennt** | Versteht man die Insel ohne Erklärung? | Erstes Spielen beobachten, nicht helfen |
| Lehrplan-Inhalte | **Grundschullehrkraft** (Sachsen) und **DaZ-Lehrkraft** | fachliche Richtigkeit, kindgerechte Sprache | Inhalte je Lernbereich durchsehen |
| Je Sprache | **zwei Muttersprachler** (Eltern, Lehrkräfte) | richtige, kindgerechte Übersetzung, Tonaufnahmen | Prüfliste in `SPRACHEN.md` |
| Grafik | **2–3 Kinder** (auch Jungen), Eltern | Gefallen die neuen Figuren? | Probeszenen nebeneinander zeigen |
| Zeitsystem, Fokus | **Kinderärztin oder Ergotherapeutin** | soll helfen, nicht schaden | 30 min Gespräch |
| Vor jeder Öffnung | **Datenschutzberatung** | Kinderdaten | Prüfung |
| Öffnung | **5–10 Familien**, gemischt (wenig Zeit, nicht deutschsprachige Eltern, Kind mit ADHS) | schwierige Fälle | 4 Wochen Nutzung |
