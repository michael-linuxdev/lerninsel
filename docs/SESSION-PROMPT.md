# Prompt für die nächste Arbeitssitzung

Diesen Text als erste Nachricht in eine neue Sitzung mit dem Repo `michael-linuxdev/lerninsel` kopieren.

---

Du arbeitest an der **Lerninsel** (Repo `michael-linuxdev/lerninsel`, online unter lerninsel.micana.de).
Lies zuerst `README.md`, `docs/KONZEPT.md` und `docs/PLAN.md`. Sie sind die Grundlage für alles.

**Ablauf dieser Sitzung**
1. **Fragerunde zuerst:** Stelle mir mit dem Frage-Werkzeug bis zu 4 Fragen, bevor du baust:
   welche Phase/welche Punkte diese Sitzung Vorrang haben, ob es neues Feedback (Kind, Eltern, Lehrkraft) gibt,
   ob sich Entscheidungen geändert haben, und was du keinesfalls anfassen sollst.
2. **Dann selbstständig arbeiten**, bis die Sitzung aufgebraucht ist, in der Reihenfolge aus `docs/KONZEPT.md`
   (Entwicklungsreihenfolge) bzw. meinen Antworten. Lege eine Aufgabenliste an und hake ab.
   Frag nur nach, wenn eine Entscheidung nicht rückgängig zu machen ist; sonst triff die vernünftigste Wahl und notiere sie.
3. **Zwischendurch pushen:** nach jedem fertigen, getesteten Schritt (spätestens alle ~45 Minuten Arbeit) committen und pushen.
   Lieber kleine fertige Schritte als ein großer halbfertiger.
4. **Am Ende** (oder wenn das Kontingent knapp wird): in `docs/PLAN.md` einen Abschnitt „Stand <Datum>“ ergänzen
   (was fertig ist, was offen ist, nächster Schritt), pushen und mir kurz berichten.

**Regeln**
- Sprache: Deutsch, kindgerecht in der App; Texte mit Sprachschlüsseln (de/ru …), RU nur wenn Hilfesprache gewählt.
- **Kein Bezug zu einem echten Kind** im Repo (keine Namen, kein Alter, keine Klasse). Beispielnamen sind ausgedacht.
- Commits als `michael-linuxdev <336864235+michael-linuxdev@users.noreply.github.com>`, Nachricht auf Deutsch.
- Vor jedem Push `sh quellen/dev-bauen.sh` (setzt Cache-Version automatisch, baut /dev). 3D vorher mit
  `ESBUILD=/opt/npm-tools/node_modules/esbuild/bin/esbuild sh quellen/bauen.sh` bauen.
- Nie Werbung, nie Käufe, kein Server, keine Daten ins Internet (Ausnahme geplant: Wetter von Open-Meteo ohne GPS).
- Grafikstil der Insel: Stil B (rund, Toon-Licht, Konturen), Stufe „einfach“ für schwache Tablets mitdenken.
- Bildschirmzeit-Standards nach DGKJ; Erwachsene (PIN) dürfen immer spielen, ohne Sterne.

**Testen (Pflicht vor jedem Push)**
- Server: `python3 -m http.server 8766` im Repo-Ordner.
- Playwright: `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`, für 3D Startoptionen `--enable-unsafe-swiftshader --use-angle=swiftshader`.
- Ersteinrichtung ist Pflicht: im Test zuerst PIN `1234` zweimal, dann Vorname eingeben.
- Jede geänderte Seite einmal öffnen, auf Fehler in der Konsole achten, Screenshots ansehen (Quer- und Hochformat).

**Praktische Hinweise aus den bisherigen Sitzungen**
- Rauchtest über alle Seiten: `sh tests/laufen.sh` (für /dev: `PFAD=dev/ sh tests/laufen.sh`).
- In eigenen Tests `addInitScript(() => { window.__jetzt = new Date(2026,9,25,15,0).getTime(); })` setzen, sonst greift nachts die Ruhezeit.
  Die Insel nutzt die echte Uhr: für Tag `heimat.html?stunde=14`, Jahreszeit `?monat=12`, Wetter `?wetter=regen|schnee|nebel|gewitter|klar`.
- Server im selben Befehl starten: `(python3 -m http.server 8766 >/dev/null 2>&1 &) ; sleep 1; …` (Hintergrund-Server enden zwischen Befehlen).
- Swiftshader läuft mit wenigen Bildern pro Sekunde: Bewegungen im Test langsam, zeitabhängige Logik mit Uhrzeit statt dt prüfen.
- Pulsierende Knöpfe (Aktionsknopf) im Test mit `click(…, { force: true })`.
- Test-Haken der Insel: `window.__heimat` (blick, ich, reingehen, rausgehen, laufeZu, tippe, station, laden, zimmerDaten, aktion, druecke, rennt, wetter).
- Externe Seiten (Open-Meteo, Google Fonts) sind aus der Sandbox meist nicht erreichbar – mit Cache-Daten in localStorage testen.

**Aktueller Stand (26.10.2026)** – Einzelheiten in `docs/PLAN.md` (Nachträge 26.10.2026 und „Stand 26.10.2026“)
- Fertig: Phase 0/1, Lehrplan-Gerüst Sachsen, Insel bzw. eigene generierte Welt (Wünsche-Assistent, bis 5 Welten), Zimmer,
  Lernfunde/Wissensbaum/Pinnwand, Biber Benno (Mathe), Minispiele Sternenlauf/Kart/Bauplatz, Eltern als Mitspieler (Duell, Erklären),
  Echte-Welt-Aufgaben, Schatzkammer und Wochen-Challenge, „Heute noch x Minuten spielen“ (Eltern), Leistungsmodus fürs iPad.
- 8b komplett: Bärin Bruni (Gefühle, Ruhe-Übungen, Bewegung, Miteinander-Geschichten), Schach mit Tilda, „Was ich gut kann“ (Stärken),
  Atelier mit Papagei Paula (Malen mit Galerie, Bilder als Poster im Zimmer; Musik-Ecke mit Xylofon, Rhythmus, Hörtest, eigener Melodie),
  Insel-Bühne: Paula spielt die eigene Melodie, alle tanzen.
- Test-Haken: `__heimat`, `__atelier`, `__musik`, `__schach`, `__gefuehle`, `__lauf`, `__kart`, `__bau`, `__duell`, `__ich`, `__mathe`.
- Gemalte Bilder liegen in einer eigenen IndexedDB (`shared/bilder.js`), nicht im Spielstand (nicht im QR-Transfer/Backup).
- Offen/als Nächstes: iPad-10-Test (Leistung, Atelier, Musik-Ton), Bauwerk vom Bauplatz in der Welt aufstellen, Kart-Strecke passend zur Landschaft,
  Lehrplan-Inhalte, russische Volkslied-Melodien (Noten prüfen), Punkt 5 Muttersprache als Stärke (übersprungen),
  **zuletzt** Weihnachts-Erststart mit QR-Geschenk und Tutorial.

**Berichten**
- Kurz und auf Deutsch: was fertig ist (mit Bildern, wenn es etwas zu sehen gibt), was ich testen soll, was als Nächstes kommt.
