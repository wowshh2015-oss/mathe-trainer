// Deutschlandreise der Auto-Rallye (25.11.2026, Bilder von der Lehrkraft):
// Mit jedem neuen Auto kommt man in eine neue Stadt – 16 Landeshauptstädte und 4 besondere Orte (⭐).
// Hier: die Deutschlandkarte (echte Lage der Städte) und je Stadt ein Steckbrief mit vier Sätzen.
// Aufruf: DReise.oeffnen({i}) – i = Nummer der erreichten Stadt (0–19). Die Reihenfolge ist dieselbe wie STADT in rallye-trainer.html.
(function(){
  const B="bilder/rallye/de_";
  // id, Name, Bundesland, Länge, Breite, Beschriftung (r/l/o/u), besonders = keine Landeshauptstadt
  const ORTE=[
    ["hamburg","Hamburg","Hamburg",10.00,53.55,"l"],
    ["kiel","Kiel","Schleswig-Holstein",10.14,54.32,"r"],
    ["schwerin","Schwerin","Mecklenburg-Vorpommern",11.41,53.63,"r"],
    ["berlin","Berlin","Berlin",13.40,52.52,"r"],
    ["potsdam","Potsdam","Brandenburg",13.06,52.39,"l"],
    ["dresden","Dresden","Sachsen",13.74,51.05,"r"],
    ["erfurt","Erfurt","Thüringen",11.03,50.98,"r"],
    ["magdeburg","Magdeburg","Sachsen-Anhalt",11.63,52.13,"u"],
    ["hannover","Hannover","Niedersachsen",9.73,52.37,"r"],
    ["bremen","Bremen","Bremen",8.80,53.08,"l"],
    ["duesseldorf","Düsseldorf","Nordrhein-Westfalen",6.78,51.23,"r"],
    ["koeln","Köln","Nordrhein-Westfalen",6.96,50.94,"u",1],
    ["mainz","Mainz","Rheinland-Pfalz",8.27,50.00,"l"],
    ["wiesbaden","Wiesbaden","Hessen",8.24,50.08,"o"],
    ["frankfurt","Frankfurt","Hessen",8.68,50.11,"r",1],
    ["saarbruecken","Saarbrücken","Saarland",7.00,49.23,"u"],
    ["stuttgart","Stuttgart","Baden-Württemberg",9.18,48.78,"r"],
    ["nuernberg","Nürnberg","Bayern",11.08,49.45,"r",1],
    ["muenchen","München","Bayern",11.58,48.14,"r"],
    ["zugspitze","Zugspitze","Bayern",10.99,47.42,"l",1]];
  // Wissen für Kinder (Klasse 2–4): Steckbrief + vier Sätze (von der Lehrkraft zu prüfen)
  const INFO={
    hamburg:{steck:[["Bundesland","Hamburg – eine Stadt und ein Bundesland zugleich"],["Einwohner","etwa 1,9 Millionen"],["Wasser","Elbe und Alster"],["Wahrzeichen","Elbphilharmonie"]],
      s:["Hamburg ist die zweitgrößte Stadt Deutschlands.","Der Hamburger Hafen ist einer der größten Häfen Europas. Riesige Containerschiffe kommen aus der ganzen Welt.","Hamburg hat über 2 500 Brücken – mehr als Venedig und Amsterdam zusammen.","Die Elbphilharmonie ist ein Konzerthaus aus Glas, gebaut auf einem alten Speicher aus Backstein."]},
    kiel:{steck:[["Bundesland","Schleswig-Holstein"],["Einwohner","etwa 250 000"],["Wasser","Ostsee (Kieler Förde)"],["Bekannt für","Segeln und Schiffe"]],
      s:["Kiel liegt direkt an der Ostsee.","Jedes Jahr im Juni ist die Kieler Woche – das größte Segelfest der Welt.","In Kiel beginnt der Nord-Ostsee-Kanal. Durch ihn fahren Schiffe von der Ostsee in die Nordsee.","Leuchttürme zeigen den Schiffen nachts mit ihrem Licht den Weg."]},
    schwerin:{steck:[["Bundesland","Mecklenburg-Vorpommern"],["Einwohner","fast 100 000"],["Wasser","Schweriner See und viele kleine Seen"],["Wahrzeichen","Schweriner Schloss"]],
      s:["Schwerin ist die kleinste Landeshauptstadt in Deutschland.","Das Schloss steht auf einer Insel im Schweriner See.","Im Schloss arbeitet heute der Landtag. Dort werden Gesetze für Mecklenburg-Vorpommern beschlossen.","Eine Sage erzählt, dass im Schloss ein kleiner Geist wohnt: das Petermännchen."]},
    berlin:{steck:[["Bundesland","Berlin – eine Stadt und ein Bundesland zugleich"],["Einwohner","etwa 3,8 Millionen"],["Wasser","Spree und Havel"],["Wahrzeichen","Brandenburger Tor"]],
      s:["Berlin ist die Hauptstadt und die größte Stadt Deutschlands.","Das Brandenburger Tor wurde vor über 230 Jahren gebaut.","Oben auf dem Tor steht die Quadriga: eine Göttin auf einem Wagen mit vier Pferden.","Früher teilte eine Mauer Berlin in zwei Hälften. 1989 ist die Mauer gefallen."]},
    potsdam:{steck:[["Bundesland","Brandenburg"],["Einwohner","etwa 185 000"],["Wasser","Havel und viele Seen"],["Wahrzeichen","Schloss Sanssouci"]],
      s:["Schloss Sanssouci war das Sommerschloss von König Friedrich dem Großen.","„Sanssouci“ ist Französisch und heißt „ohne Sorge“.","Vor dem Schloss liegen Terrassen mit Weinreben und eine lange Treppe.","Friedrich der Große ließ in seinem Land Kartoffeln anbauen. Darum legen Besucher heute Kartoffeln auf sein Grab."]},
    dresden:{steck:[["Bundesland","Sachsen"],["Einwohner","etwa 560 000"],["Wasser","Elbe"],["Wahrzeichen","Frauenkirche"]],
      s:["Dresden liegt an der Elbe – am selben Fluss wie Hamburg.","Die Frauenkirche wurde im Krieg zerstört und bis 2005 wieder aufgebaut.","Beim Wiederaufbau hat man viele alte Steine wieder eingesetzt. Sie sind dunkler als die neuen – so sieht man sie.","Der Dresdner Stollen ist ein berühmter Weihnachtskuchen."]},
    erfurt:{steck:[["Bundesland","Thüringen"],["Einwohner","etwa 215 000"],["Wasser","Gera"],["Wahrzeichen","Krämerbrücke"]],
      s:["Auf der Krämerbrücke stehen Häuser – man sieht fast nicht, dass man über eine Brücke geht.","Sie ist die längste Brücke in Europa, die ganz mit Häusern bebaut ist und in der Menschen wohnen.","In den kleinen Häusern gibt es Läden und Werkstätten.","Der Kinderkanal KiKA hat seinen Sitz in Erfurt."]},
    magdeburg:{steck:[["Bundesland","Sachsen-Anhalt"],["Einwohner","etwa 240 000"],["Wasser","Elbe"],["Wahrzeichen","Grüne Zitadelle und Dom"]],
      s:["Die Grüne Zitadelle ist ein rosa Haus mit Bäumen und Gras auf dem Dach.","Der Künstler Friedensreich Hundertwasser hat es entworfen. Er mochte keine geraden Linien.","Fast kein Fenster sieht aus wie das andere.","In Magdeburg fahren Schiffe auf einer Brücke über die Elbe – auf der Kanalbrücke."]},
    hannover:{steck:[["Bundesland","Niedersachsen"],["Einwohner","etwa 545 000"],["Wasser","Leine und Maschsee"],["Wahrzeichen","Neues Rathaus"]],
      s:["Im Neuen Rathaus fährt ein Aufzug schräg in einem Bogen bis hinauf in die Kuppel.","Im Rathaus zeigen Modelle, wie Hannover früher aussah.","Der Maschsee ist ein großer See mitten in der Stadt. Menschen haben ihn angelegt.","Eine rote Linie auf dem Boden führt Besucher zu den Sehenswürdigkeiten der Stadt."]},
    bremen:{steck:[["Bundesland","Bremen – das kleinste Bundesland"],["Einwohner","etwa 570 000"],["Wasser","Weser"],["Wahrzeichen","Bremer Stadtmusikanten und Rathaus"]],
      s:["Esel, Hund, Katze und Hahn: Die Bremer Stadtmusikanten sind ein Märchen der Brüder Grimm.","Im Märchen kommen die vier Tiere übrigens nie in Bremen an!","Ihr Denkmal steht neben dem Rathaus. Wer die Vorderbeine des Esels anfasst, soll Glück haben.","Zum Bundesland Bremen gehören zwei Städte: Bremen und Bremerhaven."]},
    duesseldorf:{steck:[["Bundesland","Nordrhein-Westfalen"],["Einwohner","etwa 630 000"],["Wasser","Rhein"],["Wahrzeichen","Rheinturm"]],
      s:["Düsseldorf ist die Landeshauptstadt von Nordrhein-Westfalen.","Der Rheinturm ist 240 Meter hoch.","Lichter am Rheinturm zeigen die Uhrzeit an – wer sie zählen kann, kann die Uhr lesen.","Die schiefen, gebogenen Häuser am Hafen hat der Architekt Frank Gehry entworfen."]},
    koeln:{steck:[["Bundesland","Nordrhein-Westfalen"],["Einwohner","etwa 1,1 Millionen"],["Wasser","Rhein"],["Wahrzeichen","Kölner Dom"],["Besonders","⭐ keine Landeshauptstadt – aber die größte Stadt in NRW"]],
      s:["Der Kölner Dom ist eine der größten Kirchen der Welt: über 157 Meter hoch.","An ihm wurde über 600 Jahre lang gebaut – fertig war er erst 1880.","Bis hinauf auf den Südturm führen 533 Stufen.","Am Geländer der Hohenzollernbrücke daneben hängen Tausende Liebesschlösser."]},
    mainz:{steck:[["Bundesland","Rheinland-Pfalz"],["Einwohner","etwa 220 000"],["Wasser","Rhein und Main"],["Wahrzeichen","Mainzer Dom"]],
      s:["Mit dem Bau des Mainzer Doms wurde vor über 1 000 Jahren begonnen.","In Mainz lebte Johannes Gutenberg. Er erfand um 1450 den Buchdruck mit beweglichen Buchstaben.","Bei Mainz fließt der Main in den Rhein.","Der Fernsehsender ZDF – mit den Mainzelmännchen – hat seinen Sitz in Mainz."]},
    wiesbaden:{steck:[["Bundesland","Hessen"],["Einwohner","etwa 280 000"],["Wasser","Rhein und heiße Quellen"],["Wahrzeichen","Kurhaus"]],
      s:["Wiesbaden ist die Landeshauptstadt von Hessen – nicht das größere Frankfurt!","In Wiesbaden kommt heißes Wasser aus der Erde. Es gibt über 20 heiße Quellen.","Im Kurhaus gibt es große, prächtige Säle für Konzerte und Feste.","Die Nerobergbahn fährt mit Wasser als Gewicht den Berg hinauf."]},
    frankfurt:{steck:[["Bundesland","Hessen"],["Einwohner","etwa 775 000"],["Wasser","Main"],["Wahrzeichen","Hochhäuser und Römer"],["Besonders","⭐ keine Landeshauptstadt – aber die größte Stadt in Hessen"]],
      s:["Frankfurt hat die meisten Hochhäuser in Deutschland. Man nennt die Stadt auch „Mainhattan“.","Der Römer ist das alte Rathaus mit den spitzen Giebeln.","Der Frankfurter Flughafen ist der größte Flughafen Deutschlands.","Der Dichter Johann Wolfgang von Goethe wurde 1749 in Frankfurt geboren."]},
    saarbruecken:{steck:[["Bundesland","Saarland"],["Einwohner","etwa 180 000"],["Wasser","Saar"],["Wahrzeichen","Ludwigskirche"]],
      s:["Das Saarland ist das kleinste Bundesland, das keine Stadt ist.","Saarbrücken liegt ganz nah an der Grenze zu Frankreich.","Die Ludwigskirche ist über 250 Jahre alt. Auf ihrem Dachrand stehen viele Figuren aus Stein.","Früher holten im Saarland viele Bergleute Kohle aus der Erde."]},
    stuttgart:{steck:[["Bundesland","Baden-Württemberg"],["Einwohner","etwa 630 000"],["Wasser","Neckar"],["Wahrzeichen","Fernsehturm"]],
      s:["Der Stuttgarter Fernsehturm wurde 1956 fertig. Er war der erste Fernsehturm der Welt aus Beton.","Er ist 217 Meter hoch. Oben kann man weit ins Land schauen.","In Stuttgart haben Mercedes-Benz und Porsche ihren Sitz – mit großen Auto-Museen.","Mitten in der Stadt wachsen Weinberge."]},
    nuernberg:{steck:[["Bundesland","Bayern"],["Einwohner","etwa 530 000"],["Wasser","Pegnitz"],["Wahrzeichen","Kaiserburg"],["Besonders","⭐ keine Landeshauptstadt"]],
      s:["Die Kaiserburg steht auf einem Felsen hoch über der Altstadt.","Früher wohnten dort Kaiser und Könige, wenn sie auf Reisen waren.","Der Christkindlesmarkt ist einer der berühmtesten Weihnachtsmärkte der Welt.","1835 fuhr von Nürnberg nach Fürth die erste Eisenbahn in Deutschland."]},
    muenchen:{steck:[["Bundesland","Bayern"],["Einwohner","etwa 1,5 Millionen"],["Wasser","Isar"],["Wahrzeichen","Frauenkirche"]],
      s:["München ist die drittgrößte Stadt Deutschlands.","Die Frauenkirche hat zwei Türme mit runden, grünen Hauben. Sie sind fast 100 Meter hoch.","Im Boden der Kirche sieht man einen Fußabdruck. Eine Sage erzählt, der Teufel habe ihn hinterlassen.","Im Rathausturm am Marienplatz tanzen bunte Figuren zum Glockenspiel."]},
    zugspitze:{steck:[["Bundesland","Bayern"],["Höhe","2 962 Meter"],["Lage","an der Grenze zu Österreich"],["Besonders","⭐ der höchste Berg Deutschlands"]],
      s:["Die Zugspitze ist der höchste Berg Deutschlands.","Auf dem Gipfel steht ein goldenes Kreuz.","Mit der Seilbahn fährt man in wenigen Minuten bis ganz nach oben.","Oben liegt oft auch im Sommer Schnee, und es gibt kleine Gletscher."]}
  };
  // Umriss Deutschlands (vereinfacht, Länge/Breite)
  const UMRISS=[[8.66,54.91],[9.42,54.83],[9.94,54.78],[10.03,54.55],[10.2,54.45],[10.95,54.38],[11.25,54.45],[11.05,54.2],[10.85,54.0],[11.1,53.95],[11.45,53.92],[12.1,54.18],
    [12.5,54.47],[13.1,54.45],[13.25,54.65],[13.65,54.6],[13.75,54.3],[14.0,54.05],[14.22,53.93],[14.42,53.27],[14.12,52.85],[14.62,52.6],[14.53,52.35],[14.72,52.0],[14.6,51.55],
    [14.98,51.1],[14.82,50.87],[14.3,51.0],[13.6,50.72],[13.0,50.45],[12.33,50.2],[12.1,50.3],[12.5,49.95],[12.4,49.75],[12.6,49.45],[13.0,49.3],[13.4,49.05],[13.84,48.77],
    [13.45,48.57],[13.0,48.3],[12.75,48.12],[13.0,47.85],[12.98,47.47],[12.7,47.68],[12.2,47.6],[11.6,47.58],[11.1,47.4],[10.45,47.55],[10.18,47.27],[9.95,47.54],[9.56,47.53],
    [9.18,47.66],[8.6,47.65],[7.6,47.58],[7.55,47.9],[7.75,48.4],[7.8,48.6],[8.2,48.97],[7.6,49.05],[7.0,49.15],[6.73,49.17],[6.36,49.47],[6.5,49.8],[6.13,50.13],[6.4,50.32],
    [6.0,50.6],[6.02,50.75],[5.97,50.98],[6.15,51.2],[5.95,51.78],[6.4,51.85],[6.8,52.1],[7.05,52.4],[6.7,52.6],[7.2,53.25],[7.0,53.55],[7.6,53.7],[8.1,53.55],[8.5,53.6],
    [8.7,53.9],[9.0,53.85],[8.85,54.15],[8.6,54.3],[8.9,54.6],[8.66,54.91]];
  const P=(lon,lat)=>[((lon-5.75)*0.63*60).toFixed(1), ((55.15-lat)*60).toFixed(1)];
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const css=`
  #dk{position:fixed;inset:0;z-index:3000;background:#0b1424;color:#e2e8f0;overflow-y:auto;overscroll-behavior:contain;
    font-family:"Segoe UI",system-ui,-apple-system,Arial,sans-serif;-webkit-overflow-scrolling:touch}
  #dk .dkin{max-width:980px;margin:0 auto;padding:14px 14px 40px}
  #dk .dkkopf{display:flex;align-items:center;gap:10px;justify-content:space-between;margin-bottom:8px}
  #dk h2{margin:0;font-size:21px}
  #dk button{font:inherit;font-size:15px;font-weight:700;border-radius:12px;border:2px solid #334155;background:#0f172a;color:#e2e8f0;padding:8px 14px;cursor:pointer}
  #dk button.haupt{background:linear-gradient(180deg,#38bdf8,#0284c7);border-color:#38bdf8;color:#042433}
  #dk .dktipp{color:#94a3b8;font-size:14px;margin:0 0 10px}
  #dk .dkgrid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px;align-items:start}
  @media (max-width:720px){ #dk .dkgrid{grid-template-columns:1fr} }
  #dk .karte{background:#10213b;border:1px solid #1e3a5f;border-radius:16px;padding:8px}
  #dk .karte svg{display:block;width:100%;height:auto;max-height:78vh}
  #dk .stadt{cursor:pointer}
  #dk .liste{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px}
  #dk .lk{position:relative;background:#0f172a;border:2px solid #1e293b;border-radius:12px;padding:6px;text-align:center;cursor:pointer;font-size:13px;font-weight:700;line-height:1.2}
  #dk .lk img{display:block;width:100%;height:78px;object-fit:contain;margin-bottom:4px}
  #dk .lk.zu{cursor:default;color:#64748b} #dk .lk.zu img{filter:grayscale(1) brightness(.35)}
  #dk .lk.hier{border-color:#fbbf24;background:rgba(251,191,36,.1)} #dk .lk.naechst{border-color:#38bdf8}
  #dk .lk .nr{position:absolute;top:4px;left:6px;font-size:11px;color:#94a3b8}
  #dk .lk .marke{position:absolute;top:3px;right:4px;font-size:10.5px;font-weight:800;background:#fbbf24;color:#1f2937;border-radius:8px;padding:1px 6px}
  #dk .lk.naechst .marke{background:#38bdf8;color:#042433}
  #dk .bildbox{background:linear-gradient(180deg,#1e3a8a,#6d5bd0 70%,#c084fc);border-radius:16px;display:flex;align-items:flex-end;justify-content:center;min-height:240px;padding:14px 14px 0}
  #dk .bildbox img{display:block;max-width:100%;max-height:330px}
  #dk h3{margin:0 0 4px;font-size:25px} #dk .land{color:#94a3b8;font-weight:700;margin-bottom:10px}
  #dk .steck{display:grid;grid-template-columns:auto 1fr;gap:4px 12px;background:#0f172a;border:1px solid #1e293b;border-radius:12px;padding:10px 12px;font-size:14.5px;margin:0 0 10px}
  #dk .steck dt{color:#94a3b8} #dk .steck dd{margin:0;font-weight:700}
  #dk .saetze{margin:0;padding-left:20px;font-size:16px;line-height:1.5} #dk .saetze li{margin:5px 0}
  #dk .mini{margin-top:12px;background:#10213b;border:1px solid #1e3a5f;border-radius:12px;padding:8px 10px;font-size:13px;color:#94a3b8;font-weight:700}
  #dk .mini svg{display:block;width:100%;max-width:230px;height:auto;margin:4px auto 0}
  #dk .nav{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
  #dk .vl.an{border-color:#fbbf24;color:#fbbf24}
  #dk .meldung{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#1e293b;border:1px solid #475569;border-radius:12px;padding:10px 16px;font-size:15px;z-index:3001}`;
  let stand={i:0}, el=null;
  const offen=k=>k<=stand.i;
  function sprich(text,knopf){
    try{
      if(!("speechSynthesis" in window)) return;
      if(speechSynthesis.speaking){ speechSynthesis.cancel(); knopf.classList.remove("an"); return; }
      const u=new SpeechSynthesisUtterance(text.replace(/–/g,",")); u.lang="de-DE"; u.rate=0.92;
      const st=window.Komfort && Komfort.stimme && Komfort.stimme(); if(st) u.voice=st;
      u.onend=u.onerror=()=>knopf.classList.remove("an"); knopf.classList.add("an"); speechSynthesis.speak(u);
    }catch(e){}
  }
  function still(){ try{ speechSynthesis.cancel(); }catch(e){} }
  function meldung(t){ const m=document.createElement("div"); m.className="meldung"; m.textContent=t; el.appendChild(m); setTimeout(()=>m.remove(),2200); }
  // Karte als SVG. gross = Übersicht mit Namen und Route, sonst kleine Lagekarte für eine Stadt
  function karteSVG(gross, nur){
    const pfad=UMRISS.map((p,j)=>(j?"L":"M")+P(p[0],p[1]).join(",")).join("")+"Z";
    let s=`<svg viewBox="0 0 360 480"><path d="${pfad}" fill="#2f6b3a" stroke="#a7f3d0" stroke-width="2" stroke-linejoin="round"/>`;
    if(gross){
      // gefahrene Strecke gelb, der Rest gestrichelt
      const pts=ORTE.map(o=>P(o[3],o[4]).join(","));
      s+=`<polyline points="${pts.join(" ")}" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="4 5" opacity=".55"/>`;
      if(stand.i>0) s+=`<polyline points="${pts.slice(0,stand.i+1).join(" ")}" fill="none" stroke="#fbbf24" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
      ORTE.forEach((o,k)=>{
        const [x,y]=P(o[3],o[4]), auf=offen(k), hier=k===stand.i, naechst=k===stand.i+1;
        const dx={r:9,l:-9,o:0,u:0}[o[5]], dy={r:4,l:4,o:-9,u:15}[o[5]], anker={r:"start",l:"end",o:"middle",u:"middle"}[o[5]];
        s+=`<g class="stadt" data-k="${k}">${hier?`<circle cx="${x}" cy="${y}" r="11" fill="none" stroke="#fbbf24" stroke-width="2.5"><animate attributeName="r" values="8;13;8" dur="1.6s" repeatCount="indefinite"/></circle>`:""}
          <circle cx="${x}" cy="${y}" r="${o[6]?6:5}" fill="${auf?"#fbbf24":naechst?"#38bdf8":"#64748b"}" stroke="#0b1424" stroke-width="1.5"/>
          ${o[6]?`<text x="${x}" y="${(+y+3).toFixed(1)}" font-size="7" text-anchor="middle" fill="#0b1424">★</text>`:""}
          <text x="${(+x+dx).toFixed(1)}" y="${(+y+dy).toFixed(1)}" text-anchor="${anker}" font-size="11.5" font-weight="700" fill="${auf?"#fff":"#94a3b8"}"
            stroke="#0b1424" stroke-width="3" paint-order="stroke">${auf||naechst?esc(o[1]):"?"}${hier?" 🚗":""}</text>
          <circle cx="${x}" cy="${y}" r="16" fill="transparent"/></g>`;
      });
    } else {
      const o=ORTE[nur], [x,y]=P(o[3],o[4]);
      s+=`<circle cx="${x}" cy="${y}" r="14" fill="none" stroke="#fbbf24" stroke-width="3"/><circle cx="${x}" cy="${y}" r="5" fill="#fbbf24"/>`;
    }
    return s+`</svg>`;
  }
  function uebersicht(){
    still();
    const liste=ORTE.map((o,k)=>{ const auf=offen(k), hier=k===stand.i, naechst=k===stand.i+1;
      return `<div class="lk${auf?"":" zu"}${hier?" hier":""}${naechst?" naechst":""}" data-k="${k}"><span class="nr">${k+1}</span>
        ${hier?`<span class="marke">🚗 hier</span>`:naechst?`<span class="marke">nächstes Ziel</span>`:""}
        <img src="${B}${o[0]}.webp" alt="" loading="lazy">${auf||naechst?esc(o[1]):"🔒 ?"}${o[6]&&auf?" ⭐":""}</div>`; }).join("");
    el.querySelector(".dkin").innerHTML=`<div class="dkkopf"><h2>🗺️ Deine Deutschlandreise</h2><button id="dkZu">✕ Schließen</button></div>
      <p class="dktipp">Tippe auf eine Stadt, in der du schon warst – dann erfährst du mehr über sie. Mit jedem neuen Auto kommst du in die nächste Stadt.
        Unterwegs besuchst du alle 16 Bundesländer. Orte mit ⭐ sind keine Landeshauptstädte, aber besonders berühmt.</p>
      <div class="dkgrid"><div class="karte">${karteSVG(true)}</div><div class="liste">${liste}</div></div>`;
    el.querySelector("#dkZu").onclick=schliessen;
    const tippe=k=>{ if(!offen(k)){ meldung(k===stand.i+1 ? "Hierhin fährst du gerade – noch ein paar Runden!" : "Da warst du noch nicht – fahr weiter!"); return; } detail(k); };
    el.querySelectorAll(".stadt,.lk").forEach(g=>g.onclick=()=>tippe(+g.dataset.k));
  }
  function detail(k){
    still(); const o=ORTE[k], info=INFO[o[0]];
    const offene=ORTE.map((_,j)=>j).filter(offen), pos=offene.indexOf(k), vor=offene[pos-1], nach=offene[pos+1];
    const text=[o[1]+".", ...info.steck.map(([a,b])=>a+": "+b+"."), ...info.s].join(" ");
    el.querySelector(".dkin").innerHTML=`<div class="dkkopf"><button id="dkKarte">◀ Zur Karte</button><button id="dkZu">✕</button></div>
      <div class="dkgrid"><div><div class="bildbox"><img src="${B}${o[0]}.webp" alt=""></div>
          <div class="mini">📍 Hier liegt ${esc(o[1])}:${karteSVG(false,k)}</div></div>
        <div><h3>${esc(o[1])}${o[6]?" ⭐":""}</h3><div class="land">Station ${k+1} von 20 · ${esc(o[2])}</div>
          <dl class="steck">${info.steck.map(([a,b])=>`<dt>${esc(a)}</dt><dd>${esc(b)}</dd>`).join("")}</dl>
          <ul class="saetze">${info.s.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
          <div class="nav"><button class="vl" id="dkVor">🔊 Vorlesen</button>
            ${vor!==undefined?`<button id="dkZurueck">◀ ${esc(ORTE[vor][1])}</button>`:""}
            ${nach!==undefined?`<button class="haupt" id="dkWeiter">${esc(ORTE[nach][1])} ▶</button>`:""}</div></div></div>`;
    el.scrollTop=0;
    el.querySelector("#dkKarte").onclick=uebersicht; el.querySelector("#dkZu").onclick=schliessen;
    el.querySelector("#dkVor").onclick=e=>sprich(text,e.currentTarget);
    const z=el.querySelector("#dkZurueck"), w=el.querySelector("#dkWeiter");
    if(z) z.onclick=()=>detail(vor); if(w) w.onclick=()=>detail(nach);
  }
  function schliessen(){ still(); if(el){ el.remove(); el=null; } document.body.style.overflow=""; }
  function oeffnen(s){
    stand={i:Math.max(0,Math.min(19,s&&s.i||0))};
    if(!document.getElementById("dkCss")){ const st=document.createElement("style"); st.id="dkCss"; st.textContent=css; document.head.appendChild(st); }
    if(el) el.remove();
    el=document.createElement("div"); el.id="dk"; el.innerHTML=`<div class="dkin"></div>`; document.body.appendChild(el);
    document.body.style.overflow="hidden"; uebersicht();
  }
  window.DReise={ oeffnen, schliessen, ORTE, INFO };
})();
