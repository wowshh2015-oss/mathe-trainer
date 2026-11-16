// ===== Kleine Fragezeichen: kurze Erklärung zu jedem wichtigen Teil des Programms =====
// komfort.js lädt diese Datei auf jeder Seite nach. Sie hängt an die unten genannten Stellen ein „?" – ein Tipp darauf
// öffnet eine kurze Erklärung, die man sich mit 🔈 auch vorlesen lassen kann. Die Seiten selbst müssen dafür nichts wissen:
// neue Erklärung = eine Zeile in REGELN (CSS-Auswahl → Text). Der Text darf auch eine Funktion sein (bekommt das Element).
(function(){
  const seite=(location.pathname.split("/").pop()||"index.html").toLowerCase().replace("-trainer.html","").replace(".html","") || "index";
  const txt=el=>(el.textContent||"").replace(/\s+/g," ").trim();

  // ---------- Texte, die auf mehreren Seiten gleich sind ----------
  const T={
    training:"<b>Trainingsraum:</b> Hier übst du in Ruhe – ohne Zeit. Nach einem Fehler zeigt dir das Programm ein Hilfe-Bild. Für eine Runde mit mindestens 8 richtigen Aufgaben gibt es Sterne und Sprit für die Spiele.",
    test:"<b>Test:</b> Aufgaben auf Zeit. Ab <b>90 % richtig</b> ist er bestanden – dann gibt es eine Urkunde und Gold-Sterne. Tipp: erst im Trainingsraum üben.",
    meine:"<b>Meine Aufgaben:</b> Das Programm merkt sich, was dir schwerfällt. Hier kommen genau diese Aufgaben wieder – so lange, bis du sie dreimal hintereinander richtig hast. Dafür gibt es 5 Sterne statt 3.",
    schwierig:"<b>Leicht, Mittel, Schwer:</b> Die Aufgaben sind gleich – nur die Zeit ist kürzer. Leicht bringt 1 Gold-Stern, Mittel 2, Schwer 3. Fang mit Leicht an.",
    stufen:"<b>Die Stufen</b> gehen vom Leichten zum Schweren. <b>Üben:</b> ohne Zeit, mit Erklärung nach einem Fehler. <b>Test:</b> auf Zeit – ab 90 % ist die Stufe geschafft und bekommt einen grünen Haken. Die gelb umrandete Stufe ist als Nächstes dran.",
    tank:"<b>Der Tank:</b> Rallye und Marathon brauchen Sprit. Eine Rallye-Runde kostet 1, eine Marathon-Etage 2. Sprit bekommst du fürs Lernen: Übungsrunde +10, „Meine Aufgaben“ +15, ein neues Thema +20, ein bestandener Test +30."
  };
  // ---------- Stufen der Trainer mit Stufen-Liste (Auswahl über den Namen der Stufe) ----------
  const STUFE={
    // Uhr
    "Nur der kleine Zeiger":"Nur der kurze Stundenzeiger ist zu sehen. Du lernst: Steht er genau auf einer Zahl, ist es „Punkt“. Steht er zwischen zwei Zahlen, ist es „halb“. <b>Klasse 1.</b>",
    "Volle und halbe Stunden":"Zum Beispiel <b>3 Uhr</b> und <b>halb 4</b>. Du liest die Uhr ab, stellst die Zeiger selbst und suchst die richtige Uhr aus. <b>Klasse 1.</b>",
    "Viertel nach und Viertel vor":"Der lange Zeiger steht auf der 3 (<b>Viertel nach</b>) oder auf der 9 (<b>Viertel vor</b>). <b>Klasse 2.</b>",
    "In Fünf-Minuten-Schritten":"Jede Zahl auf der Uhr sind 5 Minuten für den langen Zeiger: 3:20 Uhr, 3:55 Uhr. <b>Klasse 2.</b>",
    "Auf die Minute genau":"Jetzt zählen auch die kleinen Striche: 3:47 Uhr. <b>Klasse 2.</b>",
    "Vormittag und Nachmittag":"Der Tag hat 24 Stunden: 3 Uhr nachmittags heißt auch <b>15 Uhr</b>. <b>Klasse 2.</b>",
    "Die Zeit vergeht":"<b>Zeitspannen:</b> Wie spät ist es in einer halben Stunde? Wie lange dauert es von 3:15 Uhr bis 4:00 Uhr? <b>Klasse 3.</b>",
    "Fünf vor halb, zehn nach …":"So sagt man es im Alltag: „fünf vor halb 4“, „zwanzig nach 3“. Das ist die schwerste Stufe – <b>für Profis</b>.",
    // Sachaufgaben
    "Plus und Minus bis 20":"Kurze Geschichten mit kleinen Zahlen. Du überlegst zuerst: Kommt etwas dazu (<b>Plus</b>) oder geht etwas weg (<b>Minus</b>)? <b>Klasse 1.</b>",
    "Plus und Minus bis 100":"Geschichten mit Zahlen bis 100 – auch „Wie viele mehr?“ und „Wie viele fehlen noch?“. <b>Klasse 2.</b>",
    "Mal und Geteilt":"Gleiche Gruppen (<b>Mal</b>) und gerecht verteilen (<b>Geteilt</b>). <b>Klasse 2 und 3.</b>",
    "Alle vier Rechenarten":"Alles gemischt: Du musst genau lesen, welche Rechenart passt. <b>Klasse 3.</b>",
    "Mit unnötigen Angaben":"In der Geschichte steht eine Zahl, die du gar nicht brauchst. Finde heraus, welche. <b>Klasse 3.</b>",
    // Fehlende Zahl
    "Fachwörter: Plus und Minus":"So heißen die Zahlen: <b>Summand + Summand = Summe</b> und <b>Minuend − Subtrahend = Differenz</b>. <b>Klasse 2.</b>",
    "Fachwörter: Mal und Geteilt":"<b>Faktor × Faktor = Produkt</b> und <b>Dividend ÷ Divisor = Quotient</b>. <b>Klasse 3.</b>",
    "Fehlende Zahl bei Plus":"Aufgaben mit Lücke: ☐ + 5 = 13. Trick: <b>Summe minus die Zahl, die du kennst</b>. Erst bis 20, dann bis 100. <b>Klasse 2.</b>",
    "Fehlende Zahl bei Minus":"☐ − 5 = 8: Fehlt die erste Zahl, rechnest du <b>plus</b>. 13 − ☐ = 8: Fehlt die zweite, rechnest du <b>minus</b>. <b>Klasse 2.</b>",
    "Fehlende Zahl bei Mal und Geteilt":"☐ × 4 = 28 oder 28 ÷ ☐ = 7: Mal und Geteilt helfen sich gegenseitig. <b>Klasse 3.</b>",
    "Alles gemischt – mit Fachwörtern":"Aufgaben in Worten: „Die Summe ist 13, ein Summand ist 5.“ Alle vier Rechenarten. <b>Klasse 3.</b>",
    // Geld
    "Münzen zählen":"Du zählst Cent-Münzen zusammen. <b>Klasse 1.</b>",
    "Euro und Cent zählen":"Münzen und Scheine zusammen: Wie viel Geld ist das? <b>Klasse 1 und 2.</b>",
    "Umwandeln und Komma":"3 € 45 ct = 345 ct = <b>3,45 €</b>. Vor dem Komma stehen die Euro, dahinter die Cent. <b>Klasse 3.</b>",
    "Passend bezahlen":"Du legst einen Betrag selbst mit Münzen und Scheinen. <b>Klasse 2.</b>",
    "Einkaufen und Rückgeld":"Preise zusammenrechnen und ausrechnen, wie viel Geld du zurückbekommst. <b>Klasse 2 und 3.</b>",
    // Schriftlich rechnen
    "Plus ohne Übertrag":"Du rechnest Stelle für Stelle von rechts nach links: erst die Einer, dann die Zehner, dann die Hunderter. <b>Klasse 3.</b>",
    "Plus mit Übertrag":"Wird eine Stelle größer als 9, schreibst du nur die Einer hin und merkst dir die 1 für die nächste Stelle. Dafür sind die kleinen Kästchen da. <b>Klasse 3.</b>",
    "Plus mit drei Zahlen":"Drei Zahlen untereinander – hier kann man sich auch eine 2 merken müssen. <b>Klasse 3.</b>",
    "Minus ohne Entbündeln":"Oben steht in jeder Stelle genug: einfach Stelle für Stelle abziehen. <b>Klasse 3.</b>",
    "Minus mit Entbündeln":"Reicht es oben nicht, holst du dir einen von links: Ein Zehner wird zu 10 Einern. <b>Klasse 3.</b>",
    "Minus über die Null":"Steht links eine 0, musst du dir erst noch einen Stellenwert weiter links holen: 503 − 247. <b>Klasse 3 und 4.</b>",
    "Malnehmen":"Du nimmst jede Stelle einzeln mal, von rechts nach links, und merkst dir die Zehner. <b>Klasse 4.</b>",
    // Bunte Mischung
    "Klasse 1 – bunt gemischt":"Zehn Aufgaben aus allen Themen der 1. Klasse: Zehner und Einer, Formen, Münzen, Wochentage, Strichlisten.",
    "Klasse 2 – bunt gemischt":"Zehn Aufgaben aus allen Themen der 2. Klasse: Zahlenstrahl, Uhr und Kalender, Geld, Körper, Längen, Diagramme.",
    "Klasse 3 – bunt gemischt":"Zehn Aufgaben aus allen Themen der 3. Klasse: Zahlen bis 1000, schriftlich rechnen, Kommazahlen, Zeitspannen, Gewichte, Zufall. Jede Runde ist anders.",
    "Vorschau auf Klasse 4":"Für alle, die schon weiter sind: Tonnen, schriftlich malnehmen, lange Zeitspannen, Dreisatz.",
    // Kalender und Zeit
    "Wochentage und Monate":"Die Reihenfolge der sieben Wochentage und der zwölf Monate – auch „übermorgen“ und „vorgestern“. <b>Klasse 1 und 2.</b>",
    "Wie lang ist ein Monat?":"Welche Monate haben 30 und welche 31 Tage? Und: 1 Woche = 7 Tage. <b>Klasse 2.</b>",
    "Stunden und Minuten":"1 Stunde = 60 Minuten. Eine halbe Stunde sind 30, eine Viertelstunde 15 Minuten. <b>Klasse 2 und 3.</b>",
    "Sekunden, Stunden, Tage":"1 Minute = 60 Sekunden, 1 Tag = 24 Stunden. <b>Klasse 3.</b>",
    "Mit dem Datum rechnen":"Welches Datum ist in ein paar Tagen – auch über das Monatsende hinaus? <b>Klasse 3.</b>",
    "Umwandeln mit allen Zahlen":"Jetzt mit beliebigen Zahlen: 1 h 27 min = 87 min, 147 min = 2 h 27 min, 1 ¾ h = 105 min, 85 s = 1 min 25 s. <b>Klasse 3.</b>",
    "Wie spät ist es in …? Wie spät war es vor …?":"Von einer Uhrzeit vorwärts oder rückwärts rechnen – auf die Minute genau. Trick: erst bis zur vollen Stunde, dann den Rest. <b>Klasse 3.</b>",
    "Wie viel Zeit ist vergangen?":"Von 17.44 Uhr bis 18.12 Uhr: erst bis zur vollen Stunde (16 min), dann der Rest (12 min) – zusammen 28 min. <b>Klasse 3.</b>",
    "Zeit in Sachaufgaben":"Wie lange dauert das Training? Wann muss ich losgehen? Wann fährt der nächste Bus? Auch einen Fahrplan lesen. <b>Klasse 3.</b>",
    "Uhr: zwei Uhrzeiten, drei Schreibweisen":"Jede Uhr mit Zeigern zeigt zwei Uhrzeiten am Tag (3.10 Uhr und 15.10 Uhr). Und jede Uhrzeit gibt es dreimal: mit Zeigern, als Digitaluhr und in Worten. <b>Klasse 3.</b>",
    "Liter und Milliliter":"1 l = <b>1000 ml</b>. Schätzen, umwandeln und ausrechnen, wie viele Gläser man füllen kann. <b>Klasse 3.</b>",
    // Zahlen bis 1000
    "Zehner und Einer":"Jede Zahl bis 100 besteht aus Zehnern (vorn) und Einern (hinten): 37 = 3 Zehner und 7 Einer. <b>Klasse 1 und 2.</b>",
    "Nachbarzahlen und Zahlenstrahl":"Vorgänger (1 kleiner), Nachfolger (1 größer), Nachbarzehner – und Zahlen am Zahlenstrahl ablesen. <b>Klasse 2.</b>",
    "Zahlenstrahl: Wie groß ist ein Schritt?":"Nur Anfang und Ende sind beschriftet. So geht es: 1. Wie weit ist es vom Anfang bis zum Ende? 2. Zähle die Schritte (die Sprünge, nicht die Striche). 3. Teile – dann weißt du, wie groß ein Schritt ist. <b>Klasse 2.</b>",
    "Zahlenstrahl bis 1000":"Dasselbe mit großen Zahlen: Ein Schritt kann 10, 20, 25, 50 oder 100 sein. Immer zuerst den Schritt ausrechnen! <b>Klasse 3.</b>",
    "Vergleichen":"Größer (&gt;), kleiner (&lt;) oder gleich (=)? Das Zeichen schnappt wie ein Krokodil nach der größeren Zahl. <b>Klasse 2.</b>",
    "Verdoppeln, halbieren, gerade und ungerade":"Das Doppelte, die Hälfte – und: Gerade Zahlen enden auf 0, 2, 4, 6, 8. <b>Klasse 2.</b>",
    "Hunderter, Zehner, Einer":"Zahlen bis 1000: drei Stellen. Achtung bei der Null – 3 Hunderter und 5 Einer sind 305. <b>Klasse 3.</b>",
    "Runden":"Bei 0 bis 4 wird abgerundet, bei 5 bis 9 aufgerundet: 47 ≈ 50, 342 ≈ 300. <b>Klasse 3.</b>",
    "Teilen mit Rest":"Wenn es nicht aufgeht: 17 ÷ 5 = 3 Rest 2. Du schreibst das Ergebnis und den Rest in zwei Felder. <b>Klasse 3.</b>",
    // Formen und Körper
    "Flächen erkennen":"Kreis, Dreieck, Quadrat und Rechteck – später auch Fünfeck und Sechseck. <b>Klasse 1.</b>",
    "Ecken und Seiten":"Du zählst die Ecken und Seiten. Es sind immer gleich viele. <b>Klasse 2.</b>",
    "Körper erkennen":"Würfel, Quader, Kugel, Zylinder, Kegel und Pyramide – auch an Dingen aus dem Alltag. <b>Klasse 2.</b>",
    "Ecken, Kanten, Flächen":"Ein Würfel hat 8 Ecken, 12 Kanten und 6 Flächen. Eine Kante ist dort, wo zwei Flächen zusammenstoßen. <b>Klasse 3.</b>",
    "Symmetrie":"Kann man das Bild an der gestrichelten Linie falten, sodass beide Hälften genau aufeinanderliegen? <b>Klasse 2 und 3.</b>",
    "Umfang und Fläche":"Fläche: Wie viele Kästchen passen hinein? Umfang: Wie lang ist der Weg einmal außen herum? <b>Klasse 3 und 4.</b>",
    // Daten und Zufall
    "Strichlisten":"Gezählt wird in Fünferbündeln: vier Striche und ein Querstrich. <b>Klasse 1 und 2.</b>",
    "Diagramme lesen":"Ein Säulendiagramm zeigt, wie viele Kinder welches Tier mögen. Du liest die Zahlen ab. <b>Klasse 2.</b>",
    "Mit Diagrammen rechnen":"Wie viele mehr? Wie viele insgesamt? Erst ablesen, dann rechnen. <b>Klasse 3.</b>",
    "Sicher, möglich, unmöglich":"Du ziehst blind eine Kugel aus dem Beutel. Was passiert sicher, was vielleicht, was nie? <b>Klasse 3.</b>",
    "Kombinieren":"3 T-Shirts und 2 Hosen: Jedes T-Shirt passt zu jeder Hose – also 3 × 2 Möglichkeiten. <b>Klasse 3 und 4.</b>",
    // Gewichte
    "Leicht oder schwer?":"Du vergleichst, was schwerer ist, und schätzt: Wiegt das eher Gramm oder Kilogramm? <b>Klasse 2 und 3.</b>",
    "Mit Gewichtsstücken wiegen":"Auf der Waage liegen Gewichtsstücke. Du zählst zusammen, wie schwer sie sind. <b>Klasse 3.</b>",
    "Gramm und Kilogramm":"1 kg = <b>1000 g</b>. Umwandeln – auch ein halbes Kilo (500 g) und ein Viertel (250 g). <b>Klasse 3.</b>",
    "Mit Gewichten rechnen":"Zum Beispiel 1 kg − 350 g. Erst in Gramm umwandeln, dann rechnen. <b>Klasse 3.</b>",
    "Tonnen":"1 t = <b>1000 kg</b>. So schwer ist ein kleines Auto. <b>Klasse 4.</b>",
    "Kommazahlen sicher schreiben":"Das Komma trennt Euro und Cent, dahinter stehen immer zwei Stellen: 205 ct = 2,05 €, 7 ct = 0,07 €. <b>Klasse 3.</b>",
    "Mit Kommazahlen rechnen":"Plus und Minus mit Kommazahlen in zwei Schritten (erst die Euro, dann die Cent) – und überschlagen: Reicht das Geld? <b>Klasse 3.</b>",
    "Malnehmen und Teilen mit Geld":"3 · 1,40 € · Vier Anspitzer kosten 8,24 € – was kostet einer? · Fünf Karten kosten 3,45 € – was kosten zwei? <b>Klasse 3.</b>",
    "Schriftlich rechnen mit Komma":"Untereinander schreiben – Komma steht immer unter Komma. Dann rechnest du wie sonst von rechts nach links. <b>Klasse 3.</b>",
    "Große Geldbeträge":"Scheine bis 200 € zählen und einen Betrag mit möglichst wenigen Scheinen legen. <b>Klasse 3.</b>",
    // Längen
    "Mit dem Lineal messen":"Du liest am Lineal ab, wie lang etwas ist. Wichtig: bei der <b>0</b> anfangen! <b>Klasse 2.</b>",
    "Zentimeter und Millimeter":"1 cm = <b>10 mm</b>. Genau messen und umwandeln. <b>Klasse 3.</b>",
    "Meter und Zentimeter":"1 m = <b>100 cm</b>. Auch mit Komma: 1,50 m. <b>Klasse 2 und 3.</b>",
    "Welche Einheit passt?":"Schätzen: Misst man das in mm, cm, m oder km? <b>Klasse 3.</b>",
    "Mit Längen rechnen":"Zum Beispiel 1 m − 35 cm. Erst in dieselbe Einheit umwandeln, dann rechnen. <b>Klasse 3.</b>"
  };
  // ---------- Kacheln der Startseite ----------
  const KACHEL={
    zerlegen:"<b>Zerlegen:</b> Zahlen in zwei Teile zerlegen und ergänzen, zum Beispiel 8 + ☐ = 10. Das ist die Grundlage für alles Rechnen. <b>Klasse 1:</b> bis 10 und bis 20. <b>Klasse 2:</b> bis 100.",
    halbschriftlich:"<b>Rechenwege:</b> Große Aufgaben Schritt für Schritt lösen, so wie im Heft: 47 + 25 oder 6 × 15. <b>Klasse 2:</b> Plus und Minus. <b>Klasse 3:</b> Malnehmen.",
    plus:"<b>Plus:</b> Zusammenzählen – mit und ohne Zehnerübergang. <b>Klasse 1:</b> bis 20. <b>Klasse 2:</b> bis 100. <b>Klasse 3:</b> bis 1000.",
    minus:"<b>Minus:</b> Abziehen – mit und ohne Zehnerübergang. <b>Klasse 1:</b> bis 20. <b>Klasse 2:</b> bis 100. <b>Klasse 3:</b> bis 1000.",
    einmaleins:"<b>Einmaleins:</b> alle Malaufgaben von 1 × 1 bis 10 × 10. Innen: einzelne Reihen, Kernaufgaben, gemischt und der Test. <b>Klasse 2:</b> kennenlernen. <b>Klasse 3:</b> sicher und schnell.",
    einsdurcheins:"<b>Einsdurcheins:</b> Teilen bis 100 – die Umkehrung vom Einmaleins. Innen: einzelne Reihen, Kernaufgaben, gemischt und der Test. <b>Klasse 2 und 3.</b>",
    platz:"<b>Fehlende Zahl:</b> Du lernst, wie die Zahlen heißen (Summand, Summe, Minuend …), und findest die verlorene Zahl: ☐ + 5 = 13. <b>Klasse 2 und 3.</b>",
    rallye:"<b>Rechen-Rallye:</b> ein Spiel zum Wiederholen. Jede Runde hat 5 Aufgaben. Für viele Runden gibt es neue Fahrzeuge und Pokale. Jede Runde kostet 1 Sprit aus dem Tank.",
    marathon:"<b>Rechen-Marathon:</b> ein Spiel zum Wiederholen. Du kletterst ein Hochhaus hinauf: 10 richtige Aufgaben pro Etage. Jede 5. Etage ist eine Prüfung mit Medaille. Eine Etage kostet 2 Sprit.",
    uhr:"<b>Uhr-Trainer:</b> die Uhr mit Zeigern lesen und stellen – von vollen Stunden bis zu Zeitspannen. <b>Klasse 1 bis 3.</b>",
    sach:"<b>Sachaufgaben:</b> eine kurze Geschichte lesen, die passende Rechenart finden, rechnen und den Antwortsatz lesen. <b>Klasse 1 bis 3.</b>",
    geld:"<b>Geld:</b> Münzen und Scheine zählen, passend bezahlen, Rückgeld ausrechnen. <b>Klasse 1 bis 3.</b>",
    schrift:"<b>Schriftlich rechnen:</b> große Zahlen untereinander schreiben und Stelle für Stelle rechnen – immer rechts bei den Einern anfangen. <b>Klasse 3:</b> Plus und Minus. <b>Klasse 4:</b> Malnehmen.",
    mix:"<b>Bunte Mischung:</b> zehn Aufgaben aus ganz verschiedenen Themen – Zahlen, Uhr, Geld, Formen, Gewichte … Du wählst deine Klasse. Gut zum Wiederholen.",
    kalender:"<b>Kalender und Zeit:</b> Wochentage und Monate, wie viele Tage ein Monat hat, und Stunden, Minuten, Sekunden umrechnen. <b>Klasse 1 bis 3.</b>",
    zahlen:"<b>Zahlen bis 1000:</b> wie Zahlen aufgebaut sind – Zehner und Einer, der Zahlenstrahl, größer und kleiner, runden und Teilen mit Rest. <b>Klasse 2:</b> bis 100. <b>Klasse 3:</b> bis 1000.",
    geo:"<b>Formen und Körper:</b> Kreis, Dreieck, Würfel, Kugel … erkennen, Ecken und Kanten zählen, Spiegelachsen finden, Umfang und Fläche. <b>Klasse 1 bis 3.</b>",
    daten:"<b>Daten und Zufall:</b> Strichlisten und Diagramme lesen – und überlegen, was sicher, möglich oder unmöglich ist. <b>Klasse 2 und 3.</b>",
    gewichte:"<b>Gewichte und Liter:</b> schätzen, was schwerer ist, mit Gewichtsstücken wiegen, Gramm in Kilogramm umwandeln – und Liter und Milliliter. <b>Klasse 3</b>, Tonnen <b>Klasse 4</b>.",
    laengen:"<b>Längen:</b> mit dem Lineal messen und Millimeter, Zentimeter und Meter umwandeln. <b>Klasse 2 und 3.</b>"
  };
  const kachelText=el=>{ const app=(el.dataset.page||"").replace("-trainer.html",""); const t=KACHEL[app]||"";
    return t && el.classList.contains("gesperrt") ? t+" <br>🚧 <b>Öffnet bald:</b> Deine Lehrerin oder dein Lehrer schaltet diese Kachel frei, sobald das Thema im Unterricht dran war." : t; };
  // nur die Textknoten lesen – das angehängte Fragezeichen gehört nicht zum Namen
  const eigenerText=el=>[...el.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join("").replace(/\s+/g," ").trim();
  const stufenText=el=>{ const n=eigenerText(el); return n==="Meine Aufgaben" ? T.meine : (STUFE[n]||""); };

  // ---------- Regeln: [Auswahl, Text, Art]   Art: "ecke" = oben rechts in einer Karte · "nach" = hinter dem Element · sonst am Ende im Element ----------
  const ALLE=[
    ["#tkBox .tkKopf", T.tank],
    ["#modeTrain, #zumTraining", T.training, "ecke"],
    ["#modeTest, #zumTest", T.test, "ecke"],
    [".stufe .tx > b", stufenText]
  ];
  const zrPlusMinus=(wort,b20,b100,b1000)=>el=>{ const t=txt(el);
    const kl = t.includes("1000") ? ["Klasse 3",b1000] : t.includes("100") ? ["Klasse 2",b100] : ["Klasse 1",b20];
    return `<b>${t.split(" ").slice(1,3).join(" ")} – ${kl[0]}.</b> <b>Ohne Übergang:</b> Man bleibt im selben Zehner (${kl[1][0]}). <b>Mit Übergang:</b> Es geht über den Zehner (${kl[1][1]}) – das ist schwerer. <b>Gemischt:</b> beides durcheinander.`; };
  const testLabel=el=>{ const t=txt(el); return t.startsWith("Schwierigkeit") ? T.schwierig : t.startsWith("Zahlenraum") ? "<b>Zahlenraum:</b> Wie groß dürfen die Zahlen sein? Bei größeren Zahlen hast du mehr Zeit pro Aufgabe. Jeder Zahlenraum hat seinen eigenen Test – und seine eigenen Gold-Sterne." : ""; };
  const REGELN={
    index:[
      [".stBand .stZahl", el=>txt(el).includes("Gold")
         ? "<b>Gold-Sterne</b> gibt es für sicheres Können: für jeden Test, den du zum ersten Mal bestehst, und für jede gefestigte Stufe im Lernweg. Für Gold gibt es Glitzer-Sticker."
         : "<b>Sterne</b> gibt es für Fleiß: 3 für eine Übungsrunde, 5 für „Meine Aufgaben“ oder ein neues Thema, 2 extra für die erste Runde des Tages. Alle 10 Sterne öffnet sich ein neuer Sticker."],
      [".stBand .stKnopf", "<b>Mein Album:</b> Hier klebst du deine Sticker ein. Es gibt fünf Alben und ein Glitzer-Album für Gold-Sterne. Nur du siehst dein Album.", "nach"],
      [".stSerie", "<b>Lernflammen:</b> Jeder Tag, an dem du übst, bringt eine Flamme 🔥. Ein verpasster Schultag nimmt eine weg, das Wochenende kostet nichts. 10 Flammen = 🥉, 20 = 🥈, 30 = 🥇, 40 = 💎, 50 = 👑."],
      ["#schild", "<b>Dein Namensschild:</b> Die Farbe deines Namens zeigt, wie viele Lernflammen du hast: weiß am Anfang, dann Bronze, Silber, Gold, Diamantblau und Königslila.", "ecke"],
      [".haBox .haT", "<b>Hausaufgabe:</b> Das hat dir deine Lehrkraft aufgegeben. Tippe darauf, dann öffnet sich der richtige Trainer. Sie ist erledigt, sobald du die Runden gemacht hast – abhaken musst du nichts."],
      [".meldung b", "<b>Nachricht:</b> Das hat deine Lehrkraft an die ganze Klasse geschrieben."],
      [".hallo h4", "<b>Das lohnt sich heute:</b> Das Programm schlägt dir vor, was dir gerade am meisten hilft. Wenn du einem Vorschlag mit „⭐ +50 %“ folgst, bekommst du die Hälfte mehr Sterne."],
      [".erfolg", el=>txt(el).includes("Tank") ? T.tank : txt(el).includes("Test bestanden") ? "So viele <b>Tests</b> hast du schon bestanden. Für jeden gab es eine Urkunde und Gold-Sterne." : ""],
      [".pokalband .tx b", "<b>Rallye-Pokal:</b> Für viele Runden in der Rechen-Rallye gibt es Pokale – nach 50, 100 und 180 Runden und für Profi-Runden."],
      ["#lwOeffnen", "<b>Mein Lernweg:</b> sechs Stufen vom Leichten zum Schweren. Dort siehst du, was schon sitzt und was als Nächstes dran ist.", "nach"],
      [".lwAbschnitt", el=>{ const t=txt(el); return t.includes("Lernweg") ? "<b>Der Lernweg:</b> 😊 heißt gefestigt (Test mit mindestens 90 % bestanden), 😐 heißt angefangen, ⚪ heißt noch nicht begonnen. Die Stufe mit „👉 jetzt dran“ empfiehlt dir das Programm – dafür gibt es 50 % mehr Sterne."
          : t.includes("Spiele") ? "<b>Die Spiele</b> wiederholen alles durcheinander. Am meisten Spaß machen sie, wenn die sechs Stufen schon sitzen. Sie brauchen Sprit aus dem Tank." : ""; }],
      [".lwEin b", "<b>Einstufung:</b> ein kurzer Eingangstest. Für jede Stufe gibt es 5 Aufgaben. Schaffst du mindestens 4, gilt die Stufe als gefestigt und du musst sie nicht von vorn üben."],
      ["#klRow .lbl", "<b>Für welche Klasse?</b> Tippe auf deine Klasse. Dann steht auf jeder Kachel, was dort für dich dabei ist. Kacheln ohne passende Aufgaben werden blass – benutzen darfst du trotzdem alle."],
      [".tile[data-page]", kachelText, "ecke"],
      [".wuKarte .wuT", "<b>Wusstest du schon?</b> Jeden Tag ein kleiner Tipp, was du im Mathe-Trainer noch entdecken kannst."]
    ],
    einmaleins:[
      ["#trainSetup > label", "<b>Was möchtest du üben?</b> Eine <b>Reihe</b> (zum Beispiel die 3er-Reihe: 1 × 3, 2 × 3 … 10 × 3) ist am leichtesten. Fang mit den Reihen an, die ihr in der Schule gerade lernt."],
      ['[data-reihe="kern"]', "<b>Kernaufgaben:</b> die Aufgaben, die man zuerst auswendig lernt: 1er-, 2er-, 5er- und 10er-Reihe und die Quadrataufgaben (3 × 3, 4 × 4 …). Aus ihnen kannst du dir alle anderen herleiten. <b>Klasse 2.</b>", "ecke"],
      ['[data-reihe="mix"]', "<b>Gemischt:</b> Aufgaben aus allen Reihen durcheinander – so wie im Test. Gut, wenn die einzelnen Reihen schon sitzen. <b>Klasse 3.</b>", "ecke"],
      ['[data-reihe="mine"]', T.meine, "ecke"],
      ["#testSetup > label", testLabel]
    ],
    einsdurcheins:[
      ["#trainSetup > label", "<b>Was möchtest du üben?</b> „÷ 3“ heißt: alle Aufgaben, bei denen durch 3 geteilt wird (3 ÷ 3, 6 ÷ 3 … 30 ÷ 3). Wer die 3er-Reihe kann, kann auch durch 3 teilen."],
      ['[data-reihe="kern"]', "<b>Kernaufgaben:</b> Teilen durch 1, 2, 5 und 10 und die Umkehraufgaben der Quadratzahlen (49 ÷ 7). Damit fängt man an. <b>Klasse 2.</b>", "ecke"],
      ['[data-reihe="mix"]', "<b>Gemischt:</b> Geteilt-Aufgaben aus allen Reihen durcheinander – so wie im Test. <b>Klasse 3.</b>", "ecke"],
      ['[data-reihe="mine"]', T.meine, "ecke"],
      ["#testSetup > label", testLabel]
    ],
    plus:[
      [".zrhead", zrPlusMinus("Plus",["12 + 5","7 + 8"],["43 + 25","47 + 38"],["423 + 251","468 + 357"])],
      ['[data-reihe="mine"]', T.meine, "ecke"], ["#testSetup > label", testLabel]
    ],
    minus:[
      [".zrhead", zrPlusMinus("Minus",["17 − 5","13 − 5"],["68 − 25","72 − 25"],["768 − 251","723 − 357"])],
      ['[data-reihe="mine"]', T.meine, "ecke"], ["#testSetup > label", testLabel]
    ],
    zerlegen:[
      [".zrhead", el=>{ const t=txt(el);
        return t.includes("100") ? "<b>Bis 100 – Klasse 2.</b> <b>Zehner &amp; Einer:</b> 67 = 60 + 7. <b>Voller Zehner:</b> bis zum nächsten Zehner ergänzen (67 + ☐ = 70). <b>Über den Zehner:</b> 47 + 8 in zwei Schritten. <b>Frei zerlegen:</b> 54 = 26 + ☐. <b>Bis 100:</b> Welche Zahl fehlt bis 100?"
             : t.includes("20") ? "<b>Bis 20 – Klasse 1.</b> <b>Zerlegen:</b> 15 = 8 + ☐. <b>Zehner &amp; Einer:</b> 14 = 10 + 4 – jede Zahl bis 20 besteht aus einem Zehner und Einern."
             : "<b>Bis 10 – Klasse 1.</b> <b>Zerlegen:</b> 7 = 3 + ☐. <b>Partner zur 10:</b> Welche Zahl fehlt bis 10? (6 + ☐ = 10). Diese Paare braucht man später bei jeder Rechnung."; }],
      ['[data-reihe="mine"]', T.meine, "ecke"], ["#testSetup > label", testLabel]
    ],
    halbschriftlich:[
      ["#training h3", el=>{ const t=txt(el);
        return t.includes("Bis 20") ? "<b>Über den Zehner – Klasse 1.</b> In zwei Schritten: 8 + 5 → erst 8 + 2 = 10, dann noch + 3 = 13."
          : t.includes("Stellenweise") ? "<b>Stellenweise – Klasse 2.</b> Zehner und Einer getrennt rechnen: 47 + 25 → 40 + 20 = 60, 7 + 5 = 12, zusammen 72."
          : t.startsWith("➕") ? "<b>Schrittweise – Klasse 2.</b> Die zweite Zahl wird zerlegt: 47 + 25 → 47 + 20 = 67, dann 67 + 5 = 72. <b>Ohne Übergang</b> bleibt man im Zehner, <b>mit Übergang</b> geht es über den Zehner."
          : t.startsWith("➖") ? "<b>Minus schrittweise – Klasse 2.</b> 72 − 25 → 72 − 20 = 52, dann 52 − 5 = 47."
          : t.includes("Malnehmen") ? "<b>Malnehmen – Klasse 3.</b> <b>Mit Zehnerzahlen:</b> 6 × 20 → erst die kleine Aufgabe 6 × 2 = 12, dann die Null wieder dazu: 120. <b>Mit Zerlegen:</b> 6 × 15 = 6 × 10 + 6 × 5 = 60 + 30 = 90."
          : t.includes("Meine Aufgaben") ? T.meine : ""; }],
      ["#testwahl h3", el=>txt(el).includes("Stufe") ? T.schwierig.replace("Die Aufgaben sind gleich – nur die Zeit ist kürzer.","Du hast für jedes Feld weniger Zeit.") : "<b>Welches Verfahren?</b> Such dir den Rechenweg aus, den du im Test zeigen möchtest. Jeder Rechenweg hat seinen eigenen Test."]
    ],
    uhr:[
      ["#entdeckenBtn b", "<b>Die Uhr entdecken:</b> Hier gibt es keine Aufgaben. Du drehst selbst am langen Zeiger und siehst, wie der kurze mitwandert. Das Programm sagt dir die Uhrzeit."],
      ["#menue > h3", T.stufen]
    ],
    sach:[["#menue > h3", T.stufen+" In jeder Geschichte überlegst du zuerst die <b>Rechenart</b>, dann rechnest du."]],
    platz:[["#menue > h3", T.stufen], ["details.merk summary", "<b>Merkzettel:</b> Hier stehen alle Fachwörter und die Regeln für die fehlende Zahl. Du darfst jederzeit nachschauen."]],
    geld:[["#menue > h3, #start h3", T.stufen]],
    laengen:[["#menue > h3, #start h3", T.stufen]],
    gewichte:[["#menue > h3, #start h3", T.stufen]],
    schrift:[["#menue > h3, #start h3", T.stufen]],
    kalender:[["#menue > h3, #start h3", T.stufen]],
    mix:[["#menue > h3, #start h3", "<b>Bunte Mischung – dein Check:</b> Such dir deine Klasse aus. Jede Runde hat zehn Aufgaben aus ganz verschiedenen Themen – jedes Mal andere. Danach siehst du Thema für Thema, was sitzt und was du noch üben kannst. <b>Üben:</b> ohne Zeit, mit Erklärung. <b>Test:</b> auf Zeit – das ist dein Wochen-Check."]],
    zahlen:[["#menue > h3, #start h3", T.stufen]], geo:[["#menue > h3, #start h3", T.stufen]], daten:[["#menue > h3, #start h3", T.stufen]],
    rallye:[
      [".rundenzaehler .sub", "<b>Runden:</b> Eine Runde hat 5 Aufgaben (Hindernisse). Alle Runden werden zusammengezählt – dafür gibt es neue Fahrzeuge, Farben und Pokale."],
      ["#startBox > h3", el=>txt(el).includes("Strecke")
         ? "<b>Fünf Strecken</b>, von leicht nach schwer: <b>Stadt</b> – Plus und Minus bis 20 (Klasse 1). <b>Landstraße</b> – bis 100 ohne Übergang (Klasse 2). <b>Bergpass</b> – bis 100 mit Übergang (Klasse 2). <b>Rennstrecke</b> – Einmaleins (Klasse 2 und 3). <b>Formel 1</b> – alles auf Zeit (Klasse 3); sie öffnet nach 20 Runden auf Bergpass oder Rennstrecke."
         : "<b>Womit möchtest du fahren?</b> Das ist nur fürs Auge: Auto, Rakete, Schiff … Die Aufgaben bleiben gleich."],
      ["#garageBtn", "<b>Garage:</b> Hier siehst du alle Fahrzeuge und Farben, die du schon freigefahren hast – und was als Nächstes kommt.", "nach"]
    ],
    marathon:[
      ["#etageGross", "<b>Etagen:</b> Pro Etage brauchst du 10 richtige Aufgaben. Je höher du kommst, desto schwerer wird es: erst bis 20, dann bis 100, später Einmaleins und Teilen. Geschaffte Etagen verlierst du nie."],
      ["#naechsteSafe", "<b>Prüfungsetage:</b> Jede 5. Etage wiederholt alles, was bisher dran war. Dafür gibt es eine Medaille 🏅."]
    ]
  };

  // ---------- Aussehen ----------
  function stil(){
    if(document.getElementById("fqStil")) return;
    const s=document.createElement("style"); s.id="fqStil";
    s.textContent=`
    button.fq{all:unset;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;min-width:22px;border-radius:50%;
      border:1.5px solid #7dd3fc;color:#7dd3fc;background:rgba(11,18,32,.9);font:800 13px/1 "Segoe UI",system-ui,Arial,sans-serif;margin-left:7px;vertical-align:middle;
      cursor:pointer;pointer-events:auto;position:relative;flex:none;text-transform:none;letter-spacing:0;-webkit-tap-highlight-color:transparent}
    button.fq::after{content:"";position:absolute;inset:-9px}                      /* größere Tippfläche für kleine Finger */
    button.fq:hover,button.fq.an{background:#7dd3fc;color:#082f49}
    button.fq.ecke{position:absolute;top:6px;right:6px;margin:0;z-index:3}
    .fqEltern{position:relative}
    .fqBlase{position:fixed;z-index:2050;max-width:330px;width:calc(100vw - 24px);background:#f8fafc;color:#0f172a;border-radius:14px;padding:13px 14px 11px;
      box-shadow:0 12px 34px rgba(0,0,0,.55);font:500 15.5px/1.5 "Segoe UI",system-ui,Arial,sans-serif;text-align:left;border:2px solid #7dd3fc}
    .fqBlase b{font-weight:800} .fqBlase .fqFuss{display:flex;gap:8px;margin-top:10px}
    .fqBlase .fqFuss button{all:unset;box-sizing:border-box;cursor:pointer;font:700 14px/1 "Segoe UI",system-ui,Arial,sans-serif;border-radius:10px;padding:9px 12px;background:#e2e8f0;color:#0f172a}
    .fqBlase .fqFuss button.zu{margin-left:auto;background:#0284c7;color:#fff}
    @media print{ button.fq,.fqBlase{display:none!important} }`;
    document.head.appendChild(s);
  }
  // ---------- Blase ----------
  let offen=null;
  function zu(){ if(offen){ offen.blase.remove(); offen.knopf.classList.remove("an"); offen=null; try{ speechSynthesis.cancel(); }catch(e){} } }
  function vorlesen(html){
    if(!("speechSynthesis" in window)) return;
    const d=document.createElement("div"); d.innerHTML=html.replace(/<br>/g," ");
    const klar=d.textContent.replace(/☐/g,"Kästchen").replace(/×/g," mal ").replace(/÷/g," geteilt durch ").replace(/−/g," minus ").replace(/→/g,", dann ").replace(/[🥉🥈🥇💎👑🔥🚧😊😐⚪👉⭐🏅]/gu," ");
    try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(klar); u.lang="de-DE"; u.rate=0.9;
         const v=(window.Komfort && Komfort.stimme) ? Komfort.stimme() : null; if(v) u.voice=v; speechSynthesis.speak(u); }catch(e){}
  }
  function oeffne(knopf, html){
    if(offen && offen.knopf===knopf){ zu(); return; }
    zu();
    const b=document.createElement("div"); b.className="fqBlase"; b.setAttribute("role","dialog");
    b.innerHTML=`<div>${html}</div><div class="fqFuss">${"speechSynthesis" in window?`<button type="button" class="laut">🔈 Vorlesen</button>`:""}<button type="button" class="zu">Alles klar</button></div>`;
    document.body.appendChild(b);
    const r=knopf.getBoundingClientRect(), bw=b.offsetWidth, bh=b.offsetHeight;
    let x=Math.min(Math.max(12, r.left+r.width/2-bw/2), innerWidth-bw-12);
    let y=r.bottom+8; if(y+bh>innerHeight-8) y=Math.max(8, r.top-bh-8);
    b.style.left=x+"px"; b.style.top=y+"px";
    knopf.classList.add("an"); offen={blase:b, knopf, y:scrollY};
    b.querySelector(".zu").addEventListener("click", zu);
    const l=b.querySelector(".laut"); if(l) l.addEventListener("click", ()=>vorlesen(html));
  }
  document.addEventListener("click", e=>{ if(offen && !e.target.closest(".fqBlase") && !e.target.closest("button.fq")) zu(); }, true);
  // erst bei deutlichem Weiterblättern schließen – ein kleiner Ruck (z. B. Nachlaufen auf dem Tablet) darf die Erklärung nicht wegwischen
  addEventListener("scroll", ()=>{ if(offen && Math.abs(scrollY-offen.y)>80) zu(); }, true);
  addEventListener("pagehide", zu);

  // ---------- Fragezeichen anhängen ----------
  function haenge(el, text, art){
    const html = typeof text==="function" ? text(el) : text;
    if(!html) return;
    const k=document.createElement("button"); k.type="button"; k.className="fq"+(art==="ecke"?" ecke":""); k.textContent="?";
    k.setAttribute("aria-label","Erklärung"); k.title="Was ist das?";
    k.addEventListener("click", e=>{ e.preventDefault(); e.stopPropagation(); oeffne(k, typeof text==="function" ? (text(el)||html) : html); });
    ["mousedown","touchstart","pointerdown"].forEach(n=>k.addEventListener(n, e=>e.stopPropagation(), {passive:true}));
    if(art==="nach"){ el.insertAdjacentElement("afterend", k); el.dataset.fqNach="1"; }
    else{ if(art==="ecke") el.classList.add("fqEltern"); el.appendChild(k); }
  }
  function hat(el, art){
    if(art==="nach") return el.nextElementSibling && el.nextElementSibling.classList.contains("fq");
    return [...el.children].some(c=>c.classList && c.classList.contains("fq"));
  }
  let laeuft=false;
  function suche(){
    laeuft=false;
    (REGELN[seite]||[]).concat(ALLE).forEach(([sel, text, art])=>{
      let liste=[]; try{ liste=document.querySelectorAll(sel); }catch(e){}
      liste.forEach(el=>{ if(!hat(el, art)) haenge(el, text, art); });
    });
  }
  function plane(){ if(!laeuft){ laeuft=true; setTimeout(suche, 150); } }
  function start(){
    stil(); suche();
    // Menüs werden oft erst später aufgebaut oder neu gezeichnet – dann kommen die Fragezeichen von selbst nach
    try{ new MutationObserver(m=>{ if(m.some(x=>[...x.addedNodes].some(n=>n.nodeType===1 && !(n.classList && (n.classList.contains("fq")||n.classList.contains("fqBlase")))))) plane(); })
           .observe(document.body, {childList:true, subtree:true}); }catch(e){ setInterval(suche, 1500); }
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", start); else start();
  window.Info={ suche };
})();
