// ===== Mein Wolkenkratzer: Städte der Weltreise, Zimmer und Dächer =====
// Gebraucht von turm-trainer.html (Spiel) und lehrer.html (Skyline der Klasse).
// Neue Stadt (Wunsch eines Kindes): einfach hinten an STAEDTE anfügen.
window.TurmDaten=(function(){
  const STAEDTE=[
  {id:"hamburg",  name:"Hamburg",       land:"Deutschland", b:"⚓",  c:"#ef4444", fakt:"Hamburg hat einen der größten Häfen Europas – und mehr Brücken als Venedig.",
   wand:"#9a3b2a", kante:"#f1f5f9", fenster:"rect", rahmen:"#f8fafc", deko:"ziegel"},
  {id:"istanbul", name:"Istanbul",      land:"Türkei",      b:"🕌",  c:"#e11d48", fakt:"Istanbul liegt auf zwei Kontinenten: ein Teil in Europa, ein Teil in Asien.",
   wand:"#f5efe2", kante:"#1d4ed8", fenster:"spitz", rahmen:"#1e40af", deko:"kacheln"},
  {id:"accra",    name:"Accra",         land:"Ghana",       b:"🌴",  c:"#16a34a", fakt:"Accra ist die Hauptstadt von Ghana und liegt direkt am Atlantik.",
   wand:"#f59e0b", kante:"#15803d", fenster:"rect", rahmen:"#7c2d12", deko:"kente"},
  {id:"damaskus", name:"Damaskus",      land:"Syrien",      b:"🏺",  c:"#a16207", fakt:"Damaskus gehört zu den ältesten Städten der Welt, in denen bis heute Menschen wohnen.",
   wand:"#e7d7b5", kante:"#57534e", fenster:"bogen", rahmen:"#78716c", deko:"streifen"},
  {id:"teheran",  name:"Teheran",       land:"Iran",        b:"🏔️", c:"#0891b2", fakt:"Teheran ist die Hauptstadt des Iran. Im Norden stehen hohe Berge, auf denen im Winter Schnee liegt.",
   wand:"#0e7490", kante:"#facc15", fenster:"spitz", rahmen:"#fde68a", deko:"kacheln"},
  {id:"kyjiw",    name:"Kyjiw",         land:"Ukraine",     b:"🌻",  c:"#2563eb", fakt:"Kyjiw ist die Hauptstadt der Ukraine und liegt am großen Fluss Dnipro.",
   wand:"#bfdbfe", kante:"#eab308", fenster:"bogen", rahmen:"#1d4ed8", deko:"gold"},
  {id:"hanoi",    name:"Hanoi",         land:"Vietnam",     b:"🏮",  c:"#dc2626", fakt:"Hanoi ist die Hauptstadt von Vietnam. Mitten in der Stadt liegen viele Seen.",
   wand:"#fcd34d", kante:"#166534", fenster:"rect", rahmen:"#166534", deko:"laden"},
  {id:"kairo",    name:"Kairo",         land:"Ägypten",     b:"🐫",  c:"#d97706", fakt:"Bei Kairo stehen die Pyramiden von Gizeh – sie sind über 4500 Jahre alt.",
   wand:"#d6b06b", kante:"#92400e", fenster:"klein", rahmen:"#78350f", deko:"zinnen"},
  {id:"nairobi",  name:"Nairobi",       land:"Kenia",       b:"🦒",  c:"#ea580c", fakt:"In Nairobi gibt es einen Nationalpark mit Löwen und Giraffen – direkt neben der Großstadt.",
   wand:"#c2410c", kante:"#fde68a", fenster:"rect", rahmen:"#fde68a", deko:"zacken"},
  {id:"paris",    name:"Paris",         land:"Frankreich",  b:"🗼",  c:"#6366f1", fakt:"Der Eiffelturm in Paris ist über 300 Meter hoch.",
   wand:"#f3ead8", kante:"#475569", fenster:"hoch", rahmen:"#334155", deko:"balkon"},
  {id:"rom",      name:"Rom",           land:"Italien",     b:"🏛️", c:"#b45309", fakt:"Ins Kolosseum in Rom passten vor fast 2000 Jahren rund 50 000 Zuschauer.",
   wand:"#e8a85f", kante:"#fef3c7", fenster:"bogen", rahmen:"#fef3c7", deko:"saeulen"},
  {id:"tokio",    name:"Tokio",         land:"Japan",       b:"🏯",  c:"#be123c", fakt:"In Tokio und um Tokio herum leben mehr Menschen als in jeder anderen Stadt der Welt.",
   wand:"#7f1d1d", kante:"#1f2937", fenster:"papier", rahmen:"#fef2f2", deko:"pagode"},
  {id:"rio",      name:"Rio de Janeiro",land:"Brasilien",   b:"⛱️", c:"#0d9488", fakt:"Über Rio de Janeiro steht auf einem Berg eine riesige Christus-Statue.",
   wand:"#f9a8d4", kante:"#0f172a", fenster:"rect", rahmen:"#ffffff", deko:"wellen"},
  {id:"newyork",  name:"New York",      land:"USA",         b:"🗽",  c:"#0f766e", fakt:"Die Freiheitsstatue in New York war ein Geschenk aus Frankreich.",
   wand:"#64748b", kante:"#facc15", fenster:"hoch", rahmen:"#facc15", deko:"artdeco"},
  {id:"sydney",   name:"Sydney",        land:"Australien",  b:"🦘",  c:"#0284c7", fakt:"Das Opernhaus in Sydney sieht aus wie große weiße Segel.",
   wand:"#f8fafc", kante:"#0284c7", fenster:"glas", rahmen:"#0369a1", deko:"segel"}
];
  const ZIMMER=[
  ["schlaf","🛏️","Schlafzimmer",1],["kueche","🍳","Küche",1],["biblio","📚","Bibliothek",1],["mal","🎨","Malzimmer",1],["spiel","🧸","Spielzimmer",1],
  ["games","🎮","Spielehöhle",1],["musik","🎸","Musikzimmer",1],["pingpong","🏓","Tischtennis",1],["pizza","🍕","Pizzeria",1],["eis","🍦","Eisdiele",1],
  ["garten","🌱","Gewächshaus",1],["aqua","🐠","Aquarium",1],["labor","🧪","Labor",1],["fussball","⚽","Fußballhalle",1],["bowling","🎳","Bowling",1],["werk","🔧","Werkstatt",1],
  ["kino","🎬","Kino",2],["pool","🏊","Schwimmbad",2],["zirkus","🎪","Zirkus",2],["achter","🎢","Achterbahn",2],["dino","🦖","Dino-Museum",2],
  ["stern","🔭","Sternwarte",2],["karaoke","🎤","Karaoke",2],["panda","🐼","Panda-Zimmer",2],["eisbahn","⛸️","Eisbahn",2],["burg","🏰","Ritterzimmer",2],
  ["drache","🐉","Drachenhöhle",3],["schatz","💎","Schatzkammer",3],["rakete","🚀","Raketenstart",3],["zauber","🧙","Zauberschule",3],
  ["einhorn","🦄","Einhornstall",3],["thron","👑","Thronsaal",3],["ufo","🛸","Ufo-Landeplatz",3],["vulkan","🌋","Vulkanlabor",3]
];
  const DAECHER=[
  ["flach","Flachdach mit Antenne"],["spitze","Turmspitze"],["kuppel","Goldene Kuppel"],["garten","Dachgarten"],
  ["heli","Hubschrauber-Platz"],["stern","Sternwarte"],["fahne","Fahnenturm"],["rad","Riesenrad"],["burg","Burgtürme"],["krone","Kronen-Dach"]
];
  return { STAEDTE, ZIMMER, DAECHER, REISE:5, DACH:25 };
})();
