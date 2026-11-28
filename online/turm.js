// ===== Mein Wolkenkratzer: Städte der Weltreise, Zimmer und Dächer =====
// Gebraucht von turm-trainer.html (Spiel) und lehrer.html (Skyline der Klasse).
// Neue Stadt (Wunsch eines Kindes): einfach hinten an STAEDTE anfügen.
window.TurmDaten=(function(){
  // Reihenfolge der Weltreise: zuerst die Städte, aus denen Familien der Klasse kommen
  const STAEDTE=[
  {id:"hamburg",  name:"Hamburg",       land:"Deutschland", b:"⚓",  c:"#ef4444", fakt:"Hamburg hat einen der größten Häfen Europas – und mehr Brücken als Venedig.",
   wand:"#9a3b2a", kante:"#f1f5f9", fenster:"rect", rahmen:"#f8fafc", deko:"ziegel"},
  {id:"istanbul", name:"Istanbul",      land:"Türkei",      b:"🕌",  c:"#e11d48", fakt:"Istanbul liegt auf zwei Kontinenten: ein Teil in Europa, ein Teil in Asien.",
   wand:"#f5efe2", kante:"#1d4ed8", fenster:"spitz", rahmen:"#1e40af", deko:"kacheln"},
  {id:"accra",    name:"Accra",         land:"Ghana",       b:"🌴",  c:"#16a34a", fakt:"Accra ist die Hauptstadt von Ghana und liegt direkt am Atlantik.",
   wand:"#f59e0b", kante:"#15803d", fenster:"rect", rahmen:"#7c2d12", deko:"kente"},
  {id:"santiago", name:"Santiago",      land:"Chile",       b:"🦙",  c:"#dc2626", fakt:"Santiago ist die Hauptstadt von Chile. Hinter der Stadt ragen die Anden auf – oft mit Schnee auf den Gipfeln.",
   wand:"#f1e7d4", kante:"#1d4ed8", fenster:"hoch", rahmen:"#7c2d12", deko:"saeulen"},
  {id:"porto",    name:"Porto",         land:"Portugal",    b:"🌉",  c:"#2563eb", fakt:"Porto liegt am Fluss Douro. Über den Fluss führt die große Eisenbrücke Dom Luís I.",
   wand:"#fde68a", kante:"#1e40af", fenster:"rect", rahmen:"#1e3a8a", deko:"kacheln"},
  {id:"damaskus", name:"Damaskus",      land:"Syrien",      b:"🏺",  c:"#a16207", fakt:"Damaskus gehört zu den ältesten Städten der Welt, in denen bis heute Menschen wohnen.",
   wand:"#e7d7b5", kante:"#57534e", fenster:"bogen", rahmen:"#78716c", deko:"streifen"},
  {id:"teheran",  name:"Teheran",       land:"Iran",        b:"🏔️", c:"#0891b2", fakt:"Teheran ist die Hauptstadt des Iran. Im Norden stehen hohe Berge, auf denen im Winter Schnee liegt.",
   wand:"#0e7490", kante:"#facc15", fenster:"spitz", rahmen:"#fde68a", deko:"kacheln"},
  {id:"kyjiw",    name:"Kyjiw",         land:"Ukraine",     b:"🌻",  c:"#2563eb", fakt:"Kyjiw ist die Hauptstadt der Ukraine und liegt am großen Fluss Dnipro.",
   wand:"#bfdbfe", kante:"#eab308", fenster:"bogen", rahmen:"#1d4ed8", deko:"gold"},
  {id:"hanoi",    name:"Hanoi",         land:"Vietnam",     b:"🏮",  c:"#dc2626", fakt:"Hanoi ist die Hauptstadt von Vietnam. Mitten in der Stadt liegen viele Seen.",
   wand:"#fcd34d", kante:"#166534", fenster:"rect", rahmen:"#166534", deko:"laden"},
  {id:"athen",    name:"Athen",         land:"Griechenland",b:"🦉",  c:"#0284c7", fakt:"Auf dem Felsen Akropolis in Athen steht der Parthenon – ein Tempel, der fast 2500 Jahre alt ist.",
   wand:"#f8fafc", kante:"#0284c7", fenster:"bogen", rahmen:"#0369a1", deko:"saeulen"},
  {id:"kreta",    name:"Kreta",         land:"Griechenland",b:"⛵",  c:"#0ea5e9", fakt:"Kreta ist die größte Insel Griechenlands. Im Hafen von Chania steht ein alter Leuchtturm.",
   wand:"#fcd9a8", kante:"#0e7490", fenster:"bogen", rahmen:"#0e7490", deko:"wellen"},
  {id:"paris",    name:"Paris",         land:"Frankreich",  b:"🗼",  c:"#6366f1", fakt:"Der Eiffelturm in Paris ist über 300 Meter hoch.",
   wand:"#f3ead8", kante:"#475569", fenster:"hoch", rahmen:"#334155", deko:"balkon"},
  {id:"london",   name:"London",        land:"Großbritannien", b:"🕰️", c:"#1d4ed8", fakt:"„Big Ben“ ist eigentlich der Name der großen Glocke im Uhrturm in London.",
   wand:"#d6c49a", kante:"#1f2937", fenster:"hoch", rahmen:"#1f2937", deko:"zinnen"},
  {id:"barcelona",name:"Barcelona",     land:"Spanien",     b:"⛪",  c:"#ea580c", fakt:"An der Kirche Sagrada Família in Barcelona wird schon seit über 140 Jahren gebaut.",
   wand:"#fde4c8", kante:"#0f766e", fenster:"bogen", rahmen:"#9a3412", deko:"kacheln"},
  {id:"madrid",   name:"Madrid",        land:"Spanien",     b:"👑",  c:"#ca8a04", fakt:"Madrid ist die Hauptstadt von Spanien. Der Königspalast dort hat über 3000 Räume.",
   wand:"#f5f0e6", kante:"#a16207", fenster:"hoch", rahmen:"#57534e", deko:"balkon"},
  {id:"rom",      name:"Rom",           land:"Italien",     b:"🏛️", c:"#b45309", fakt:"Ins Kolosseum in Rom passten vor fast 2000 Jahren rund 50 000 Zuschauer.",
   wand:"#e8a85f", kante:"#fef3c7", fenster:"bogen", rahmen:"#fef3c7", deko:"saeulen"},
  {id:"prag",     name:"Prag",          land:"Tschechien",  b:"🏰",  c:"#b91c1c", fakt:"Die Karlsbrücke in Prag ist fast 700 Jahre alt – auf ihr stehen 30 Figuren aus Stein.",
   wand:"#fbe8c8", kante:"#7f1d1d", fenster:"bogen", rahmen:"#7f1d1d", deko:"gold"},
  {id:"wien",     name:"Wien",          land:"Österreich",  b:"🎻",  c:"#ca8a04", fakt:"In Wien steht das Schloss Schönbrunn – mit dem ältesten Zoo der Welt, den es heute noch gibt.",
   wand:"#fde68a", kante:"#a16207", fenster:"hoch", rahmen:"#ffffff", deko:"balkon"},
  {id:"mumbai",   name:"Mumbai",        land:"Indien",      b:"🐘",  c:"#ea580c", fakt:"Am Hafen von Mumbai steht ein riesiges Tor aus Stein: das „Gateway of India“.",
   wand:"#f5d0a9", kante:"#b91c1c", fenster:"bogen", rahmen:"#9a3412", deko:"kacheln"},
  {id:"peking",   name:"Peking",        land:"China",       b:"🏯",  c:"#b91c1c", fakt:"Der Himmelstempel in Peking ist rund 600 Jahre alt – sein rundes Dach ist blau wie der Himmel.",
   wand:"#b91c1c", kante:"#facc15", fenster:"papier", rahmen:"#fde68a", deko:"pagode"},
  {id:"tokio",    name:"Tokio",         land:"Japan",       b:"🏯",  c:"#be123c", fakt:"Tokio ist eine der größten Städte der Welt – mit Umgebung leben dort fast 37 Millionen Menschen.",
   wand:"#7f1d1d", kante:"#1f2937", fenster:"papier", rahmen:"#fef2f2", deko:"pagode"},
  {id:"kairo",    name:"Kairo",         land:"Ägypten",     b:"🐫",  c:"#d97706", fakt:"Bei Kairo stehen die Pyramiden von Gizeh – sie sind über 4500 Jahre alt.",
   wand:"#d6b06b", kante:"#92400e", fenster:"klein", rahmen:"#78350f", deko:"zinnen"},
  {id:"nairobi",  name:"Nairobi",       land:"Kenia",       b:"🦒",  c:"#ea580c", fakt:"In Nairobi gibt es einen Nationalpark mit Löwen und Giraffen – direkt neben der Großstadt.",
   wand:"#c2410c", kante:"#fde68a", fenster:"rect", rahmen:"#fde68a", deko:"zacken"},
  {id:"rio",      name:"Rio de Janeiro",land:"Brasilien",   b:"⛱️", c:"#0d9488", fakt:"Über Rio de Janeiro steht auf einem Berg eine riesige Christus-Statue.",
   wand:"#f9a8d4", kante:"#0f172a", fenster:"rect", rahmen:"#ffffff", deko:"wellen"},
  {id:"newyork",  name:"New York",      land:"USA",         b:"🗽",  c:"#0f766e", fakt:"Die Freiheitsstatue in New York war ein Geschenk aus Frankreich.",
   wand:"#64748b", kante:"#facc15", fenster:"hoch", rahmen:"#facc15", deko:"artdeco"},
  {id:"sydney",   name:"Sydney",        land:"Australien",  b:"🦘",  c:"#0284c7", fakt:"Das Opernhaus in Sydney sieht aus wie große weiße Segel.",
   wand:"#f8fafc", kante:"#0284c7", fenster:"glas", rahmen:"#0369a1", deko:"segel"},
  {id:"nordpol",  name:"Nordpol",       land:"Arktis",      b:"🐻‍❄️", c:"#0ea5e9", fakt:"Am Nordpol gibt es kein Land – nur dickes Eis auf dem Meer. In der Arktis leben Eisbären.",
   wand:"#e0f2fe", kante:"#38bdf8", fenster:"glas", rahmen:"#0284c7", deko:"zacken"}
];
  // 80 Zimmer: 37 häufige (1), 28 seltene (2), 15 einzigartige (3) – ein einzigartiges Zimmer gibt es in jedem Turm nur einmal
  const ZIMMER=[
  ["schlaf","🛏️","Schlafzimmer",1],["wohn","🛋️","Wohnzimmer",1],["kueche","🍳","Küche",1],["bad","🛁","Badezimmer",1],["spiel","🧸","Spielzimmer",1],
  ["biblio","📚","Bibliothek",1],["klasse","🏫","Klassenzimmer",1],["mal","🎨","Malatelier",1],["musik","🎹","Musikzimmer",1],["baeckerei","🥐","Bäckerei",1],
  ["eis","🍦","Eisdiele",1],["werk","🔧","Werkstatt",1],["garten","🌿","Wintergarten",1],["katzen","🐱","Katzenzimmer",1],["lobby","🛎️","Empfangshalle",1],
  ["games","🎮","Videospielzimmer",1],["pizza","🍕","Pizzeria",1],["fussball","⚽","Fußballhalle",1],["bowling","🎳","Bowling",1],
  ["kino","🎬","Kino",2],["aqua","🐠","Aquarium",2],["pool","🏊","Schwimmbad",2],["disco","🪩","Disco",2],["labor","🧪","Forschungslabor",2],
  ["stern","🔭","Sternwarte",2],["dino","🦖","Dinosauriermuseum",2],["roboter","🤖","Roboterwerkstatt",2],["dschungel","🦜","Dschungelzimmer",2],["piraten","🏴‍☠️","Piratenkajüte",2],
  ["zirkus","🎪","Zirkus",2],["panda","🐼","Bambusgarten der Pandas",2],["eisbahn","⛸️","Eisbahn",2],["burg","🛡️","Rittersaal",2],
  ["drache","🐉","Drachenhöhle",3],["thron","👑","Königlicher Thronsaal",3],["zauber","🧙","Zauberzimmer",3],["weltraum","🚀","Weltraumstation",3],["kristall","💎","Kristallgrotte",3],
  ["schatz","💰","Schatzkammer",3],["einhorn","🦄","Einhornstall",3],
  // 25.11.2026: 40 neue Zimmer (Wunsch der Kinder: ab Etage 50 kam nichts Neues mehr) – 18 häufige, 14 seltene, 8 einzigartige
  ["hund","🐶","Hundezimmer",1],["hase","🐰","Hasenstall",1],["puzzle","🧩","Puzzlezimmer",1],["wasch","🧺","Waschküche",1],["burger","🍔","Burgerladen",1],
  ["nudel","🍜","Nudelrestaurant",1],["obst","🍓","Obstladen",1],["basket","🏀","Basketballhalle",1],["turn","🤸","Turnhalle",1],["tennis","🎾","Tennishalle",1],
  ["kletter","🧗","Kletterhalle",1],["arzt","🩺","Arztpraxis",1],["feuer","🚒","Feuerwache",1],["friseur","💇","Friseursalon",1],["markt","🛒","Supermarkt",1],
  ["naeh","🧵","Nähzimmer",1],["post","📮","Postamt",1],["brett","🎲","Brettspielzimmer",1],
  ["schoko","🍫","Schokoladenfabrik",2],["schmetterling","🦋","Schmetterlingshaus",2],["pinguin","🐧","Pinguinbecken",2],["hai","🦈","Haifischtunnel",2],
  ["karussell","🎠","Karussell",2],["baelle","🔴","Bällebad",2],["kart","🏎️","Kartbahn",2],["eisenbahn","🚂","Modelleisenbahn",2],["theater","🎭","Theater",2],
  ["baumhaus","🌳","Baumhaus",2],["iglu","❄️","Iglu",2],["pharao","🏺","Pharaonengrab",2],["ninja","🥷","Ninja-Dojo",2],["suess","🍭","Süßigkeitenladen",2],
  ["meerjungfrau","🧜‍♀️","Meerjungfrauengrotte",3],["zeitmaschine","⏰","Zeitmaschine",3],["pokal","🏆","Pokalsaal",3],["regenbogen","🌈","Regenbogenrutsche",3],
  ["wolkenschloss","☁️","Wolkenschloss",3],["phoenix","🔥","Phönixnest",3],["karte","🗺️","Geheimes Kartenzimmer",3],["unterwasser","🐋","Unterwasserkuppel",3]
];
  // frühere Zimmer – nur damit schon gebaute Etagen weiter richtig aussehen
  const ZIMMER_ALT=[["pingpong","🏓","Tischtennis",1],
  ["achter","🎢","Achterbahn",2],["karaoke","🎤","Karaoke",2],
  ["rakete","🚀","Raketenstart",3],["ufo","🛸","UFO-Zimmer",3],["vulkan","🌋","Vulkanlabor",3]];
  // Dächer in der Reihenfolge, in der sie frei werden (jede 20. Etage eines mehr) – alle gemalt
  const DAECHER=[
  ["flach","Flachdach mit Antenne"],["garten","Dachgarten"],["kuppel","Goldene Kuppel"],["heli","Hubschrauber-Platz"],["achter","Achterbahn"],["stern","Sternwarte"],
  ["rad","Riesenrad"],["burg","Burgtürme"],["rakete","Raketenstart"],["krone","Kronen-Dach"],["spitze","Turmspitze"],["fahne","Fahnenturm"]
];
  // Gemalte Bilder (bilder/turm): Fassade je Stadt mit durchsichtiger Öffnung [x, y, Breite, Höhe] als Anteil, Zimmer als Innenansicht 2:1.
  // Fehlt ein Bild, zeichnet das Spiel die Etage selbst. Neue Bilder: aufbereiten mit scratchpad/bilder_bauen.py, dann hier eintragen.
  // Dächer: [Sockel links, Sockel rechts] als Anteil der Bildbreite und Höhe/Breite – der Sockel wird genau auf die Turmbreite gelegt
  const BILDER={ baender:{"accra":[0.37,0.425,0.62,0.59],"athen":[0.36,0.385,0.628,0.56],"barcelona":[0.363,0.415,0.632,0.59],"damaskus":[0.365,0.52,0.603,0.665],"hamburg":[0.358,0.53,0.627,0.68],"hanoi":[0.382,0.385,0.607,0.555],"istanbul":[0.382,0.425,0.602,0.58],"kairo":[0.393,0.41,0.608,0.55],"kreta":[0.385,0.365,0.605,0.52],"kyjiw":[0.368,0.285,0.63,0.45],"london":[0.392,0.49,0.61,0.64],"madrid":[0.387,0.38,0.593,0.555],"mumbai":[0.383,0.275,0.605,0.42],"nairobi":[0.358,0.435,0.625,0.595],"newyork":[0.377,0.42,0.622,0.575],"nordpol":[0.377,0.375,0.612,0.565],"paris":[0.382,0.33,0.608,0.48],"peking":[0.388,0.44,0.602,0.59],"porto":[0.382,0.375,0.6,0.535],"prag":[0.375,0.44,0.615,0.61],"rio":[0.395,0.37,0.587,0.525],"rom":[0.368,0.46,0.633,0.635],"santiago":[0.373,0.335,0.618,0.475],"sydney":[0.377,0.385,0.605,0.535],"teheran":[0.372,0.385,0.613,0.545],"tokio":[0.355,0.385,0.613,0.555],"wien":[0.338,0.53,0.617,0.695]}, daecher:{"flach": [0.0075, 0.9925, 0.5], "garten": [0.0088, 0.9912, 0.5], "kuppel": [0.0025, 0.9975, 0.5], "heli": [0.0025, 0.9975, 0.5], "achter": [0.0088, 0.9912, 0.5], "stern": [0.0112, 0.9888, 0.5012], "rad": [0.0038, 0.9962, 0.5], "burg": [0.0038, 0.9962, 0.5], "rakete": [0.0025, 0.9975, 0.5], "krone": [0.0025, 0.9975, 0.5], "spitze": [0.0038, 0.9962, 0.5], "fahne": [0.0038, 0.9962, 0.5]}, karten:["accra", "athen", "barcelona", "damaskus", "hamburg", "hanoi", "istanbul", "kairo", "kreta", "kyjiw", "london", "madrid", "mumbai", "nairobi", "newyork", "nordpol", "paris", "peking", "porto", "prag", "rio", "rom", "santiago", "sydney", "teheran", "tokio", "wien"], hintergrund:["hamburg"], kran:true, band:true, eingang:true, fassaden:{"hamburg": [0.1161, 0.1172, 0.7678, 0.7678], "paris": [0.1172, 0.1297, 0.7655, 0.7396]}, zimmer:["aqua", "bad", "baeckerei", "biblio", "bowling", "burg", "dino", "disco", "drache", "dschungel", "einhorn", "eis", "eisbahn", "fussball", "games", "garten", "katzen", "kino", "klasse", "kristall", "kueche", "labor", "lobby", "mal", "musik", "panda", "piraten", "pizza", "pool", "roboter", "schatz", "schlaf", "spiel", "stern", "thron", "weltraum", "werk", "wohn", "zauber", "zirkus", "hund", "hase", "puzzle", "wasch", "burger", "nudel", "obst", "basket", "turn", "tennis", "kletter", "arzt", "feuer", "friseur", "markt", "naeh", "post", "brett", "schoko", "schmetterling", "pinguin", "hai", "karussell", "baelle", "kart", "eisenbahn", "theater", "baumhaus", "iglu", "pharao", "ninja", "suess", "meerjungfrau", "zeitmaschine", "pokal", "regenbogen", "wolkenschloss", "phoenix", "karte", "unterwasser"] };
  // Drachenbuch (27.11.2026): 20 Drachenzimmer – nur mit dem goldenen Schlüssel (jede 10. Etage einer), gemalt von der Lehrkraft.
  // Bild: bilder/turm/drache_<id>.webp (800×400). Ein Drachenzimmer zieht in eine Reise-Etage ein.
  const DRACHEN=[
  {id:"flamme",     name:"Flammo",              art:"Feuerdrache",          ort:"Backstube",          text:"Flammo backt jeden Morgen 120 Brötchen – mit seinem eigenen Feuer. Sein Ofen wird 250 Grad heiß. Am liebsten isst er Brezeln mit Butter."},
  {id:"frost",      name:"Frostina",            art:"Eisdrache",            ort:"Eispalast",          text:"Frostina rutscht jeden Tag 30-mal ihre Eisrutsche hinunter. In ihrem Palast ist es immer kälter als 0 Grad. Sie schläft unter einer Decke aus Schnee."},
  {id:"kristall",   name:"Prisma",              art:"Kristalldrache",       ort:"Spiegelsaal",        text:"Prisma ist aus Kristall – das Licht scheint durch sie hindurch und malt Regenbögen an die Wände. Sie ist 3 Meter lang. Ihre Lieblingsfarbe: alle sieben Farben des Regenbogens."},
  {id:"welle",      name:"Perla",               art:"Wasserdrache",         ort:"Unterwassergrotte",  text:"Perla schwimmt schneller als ein Delfin: 60 Kilometer in einer Stunde. Sie schläft in einer Riesenmuschel. Die Perle auf ihrer Stirn leuchtet im Dunkeln."},
  {id:"moos",       name:"Moosbart",            art:"Walddrache",           ort:"Baumhaus",           text:"Moosbart ist 500 Jahre alt – so alt wie sein Baum. Auf seinem Kopf wohnt ein kleiner Vogel. Seine besten Freunde sind ein Eichhörnchen und ein Igel."},
  {id:"sand",       name:"Dattel",              art:"Wüstendrache",         ort:"Wüstenzelt",         text:"Mit ihren großen Ohren hört Dattel einen Käfer 1 Kilometer weit. Sie trinkt am liebsten süßen Tee. Ihre Sanduhr zeigt ihr, wann Teezeit ist."},
  {id:"blitz",      name:"Zappel",              art:"Gewitterdrache",       ort:"Wolkenturm",         text:"Zappel kann nicht stillsitzen! Bei jedem Gewitter zählt er die Blitze – sein Rekord sind 87 Blitze in einer Nacht. Seine Hörner knistern wie Funken."},
  {id:"regenbogen", name:"Kunterbunt",          art:"Regenbogendrache",     ort:"Malatelier",         text:"Kunterbunt malt mit ihrer Schwanzspitze. Sie hat schon 365 Bilder gemalt – eins für jeden Tag im Jahr. Jede Reihe ihrer Schuppen hat eine andere Farbe."},
  {id:"schatten",   name:"Schummel",            art:"Schattendrache",       ort:"Kuschelhöhle",       text:"Schummel ist ein bisschen schüchtern und wohnt in einer Höhle aus Decken. Seine gelben Augen leuchten in der Nacht. Er schläft nie ohne seine 12 Kuscheltiere."},
  {id:"lava",       name:"Glut",                art:"Lavadrache",           ort:"Vulkankammer",       text:"Glut badet in heißer Lava – für ihn ist das wie eine warme Badewanne. Er wiegt 2 Tonnen, so viel wie zwei Autos. Seine Sonnenbrille trägt er immer, auch nachts."},
  {id:"wolke",      name:"Watte",               art:"Wolkendrache",         ort:"Himmelsbett",        text:"Watte ist so leicht wie eine Wolke und schwebt einfach in der Luft. Sie wiegt nur 5 Kilogramm. Am liebsten beobachtet sie die Heißluftballons."},
  {id:"blume",      name:"Rosalie",             art:"Blumendrache",         ort:"Gewächshaus",        text:"Rosalie gießt jeden Tag 40 Blumen. Auf ihrem Rücken wachsen echte Blüten. Die Bienen und Schmetterlinge sind ihre Freunde."},
  {id:"suess",      name:"Zuckerschnute",       art:"Süßigkeitendrache",    ort:"Bonbonladen",        text:"Zuckerschnute isst jeden Tag einen Lolli, der so groß ist wie ein Teller. Danach putzt sie 3 Minuten lang ihre Zähne. Ihre Streifen sind rosa und weiß."},
  {id:"stern",      name:"Komet",               art:"Sternendrache",        ort:"Planetarium",        text:"Auf Komets Schuppen leuchten Sternbilder. Er kennt alle 8 Planeten unseres Sonnensystems. Sein Schweif glitzert wie ein Komet."},
  {id:"musik",      name:"Rocky",               art:"Musikdrache",          ort:"Proberaum",          text:"Rocky spielt Schlagzeug – mit seinem Schwanz und zwei Trommelstöcken gleichzeitig. Sein schnellstes Lied hat 200 Schläge in einer Minute. Er übt jeden Tag eine Stunde."},
  {id:"baby",       name:"Krümel und Co.",      art:"Babydrachen",          ort:"Drachen-Kita",       text:"In der Drachen-Kita spielen 5 kleine Drachen: rot, blau, grün, gelb und lila. Jedes Baby ist erst 1 Jahr alt. Der kleine blaue Drache schläft am liebsten in seiner Eierschale."},
  {id:"ei",         name:"Oma Schuppe",         art:"Großmutterdrache",     ort:"Drachennest",        text:"Oma Schuppe passt auf die Dracheneier auf und strickt dabei einen 10 Meter langen Schal. Sie ist 900 Jahre alt. Gerade schlüpft ein Baby aus einem Ei!"},
  {id:"buch",       name:"Professor Pergament", art:"Bücherdrache",         ort:"Zauberbibliothek",   text:"Professor Pergament hat 10 000 Bücher gelesen. In seiner Bibliothek fliegen die Bücher wie Vögel. Er weiß fast alles – nur nicht, wo seine Brille ist."},
  {id:"koenig",     name:"König Smaragd",       art:"Drachenkönig",         ort:"Thronsaal",          text:"König Smaragd ist der König aller Drachen. Seine Krone ist aus Gold, sein Umhang aus rotem Samt. Er ist 8 Meter lang – der größte Drache im Drachenbuch."},
  {id:"mini",       name:"Pips",                art:"Taschendrache",        ort:"Federmäppchen",      text:"Pips ist der kleinste Drache: nur 6 Zentimeter groß, kleiner als ein Radiergummi. Er wohnt in einem Federmäppchen auf einem Schultisch. Er hilft gern beim Rechnen."}
  ];
  return { STAEDTE, ZIMMER, ZIMMER_ALT, DAECHER, BILDER, DRACHEN, REISE:10, DACH:20 };
})();
