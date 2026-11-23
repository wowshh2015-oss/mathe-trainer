// Sternenkarte der Weltraum-Rallye (23.11.2026, Wunsch der Lehrkraft):
// Übersichtskarte der ganzen Reise – Orte, an denen das Kind schon war, kann es antippen und mehr erfahren.
// Weiter entfernte Orte sind sichtbar, aber gesperrt. Aufruf: Reise.oeffnen({i, t}) – i = Nummer des erreichten Ziels (0–19).
(function(){
  const B="bilder/rallye/ziel_";
  // Bereiche der Karte
  const BEREICHE=[[0,5,"☀️ Sonne und innere Planeten"],[5,10,"🪐 Asteroiden und Riesenplaneten"],[10,14,"🧊 Rand des Sonnensystems"],[14,20,"✨ Sterne und Galaxien"]];
  // Die 20 Stationen der Reise (gleiche Reihenfolge wie ZIELE in rallye-trainer.html)
  // gr = Bildgröße auf der Karte, licht = Bild auf Schwarz (wird eingeblendet), teile = antippbare Bereiche [id, l, o, r, u]
  const ORTE=[
    {id:"sonne",gr:120,licht:1,objekte:["sonne"]},
    {id:"merkur",gr:40,objekte:["merkur"]},
    {id:"venus",gr:56,objekte:["venus"]},
    {id:"erde_mond",gr:66,objekte:["erde","mond"],tipp:"Tippe auf die Erde oder auf den Mond!",teile:[["mond",.80,0,1,.22],["erde",0,.05,.88,1]]},
    {id:"mars",gr:48,objekte:["mars"]},
    {id:"asteroiden",gr:64,objekte:["asteroiden"]},
    {id:"jupiter",gr:110,objekte:["jupiter"]},
    {id:"saturn",gr:130,objekte:["saturn"]},
    {id:"uranus",gr:70,objekte:["uranus"]},
    {id:"neptun",gr:72,objekte:["neptun"]},
    {id:"pluto_charon",gr:56,objekte:["pluto","charon"],tipp:"Tippe auf Pluto oder auf seinen Mond Charon!",teile:[["charon",.6,0,1,.38],["pluto",0,.3,.74,1]]},
    {id:"kuiperguertel",gr:96,licht:1,objekte:["kuiper"]},
    {id:"heliopause",gr:96,licht:1,objekte:["heliopause"]},
    {id:"oortsche_wolke",gr:96,licht:1,objekte:["oort"]},
    {id:"alpha_centauri",gr:90,licht:1,objekte:["alphacen"]},
    {id:"orionnebel",gr:96,licht:1,objekte:["orion"]},
    {id:"plejaden",gr:90,licht:1,objekte:["plejaden"]},
    {id:"schwarzes_loch",gr:100,licht:1,objekte:["sl"]},
    {id:"milchstrasse",gr:106,licht:1,objekte:["milchstrasse"]},
    {id:"andromeda",gr:110,licht:1,objekte:["andromeda"]}];
  // Wissen für Kinder (Klasse 2–4): Steckbrief + vier Sätze. lage = Platz in der Mini-Karte des Sonnensystems
  const INFO={
    sonne:{name:"Die Sonne",lage:0,steck:[["Was ist das?","ein Stern"],["Größe","1,4 Millionen km breit"],["Hitze","außen etwa 5 500 °C"],["Licht bis zur Erde","8 Minuten"]],
      s:["Die Sonne ist ein Stern – der Stern, der uns am nächsten ist.","Über eine Million Erden würden in sie hineinpassen.","Ohne ihr Licht und ihre Wärme gäbe es kein Leben auf der Erde.","Schau nie direkt in die Sonne – das schadet deinen Augen!"]},
    merkur:{name:"Merkur",lage:1,steck:[["Abstand zur Sonne","58 Millionen km"],["Größe","4 880 km breit"],["Ein Jahr","88 Tage"],["Monde","keine"]],
      s:["Merkur ist der kleinste Planet und der Sonne am nächsten.","Er hat keine Luft. Am Tag ist es über 400 °C heiß, in der Nacht minus 180 °C kalt.","Seine Oberfläche ist voller Krater – er sieht fast aus wie unser Mond.","Ein Tag von Sonnenaufgang bis Sonnenaufgang dauert dort 176 Erdtage."]},
    venus:{name:"Venus",lage:2,steck:[["Abstand zur Sonne","108 Millionen km"],["Größe","12 100 km – fast wie die Erde"],["Ein Jahr","225 Tage"],["Monde","keine"]],
      s:["Die Venus ist der heißeste Planet: über 400 °C – heißer als jeder Backofen.","Dicke gelbe Wolken halten die Wärme fest wie eine Decke.","Sie dreht sich so langsam, dass eine Drehung länger dauert als ein ganzes Venus-Jahr.","Am Himmel ist sie nach Sonne und Mond das hellste Licht – man nennt sie Morgenstern oder Abendstern."]},
    erde:{name:"Die Erde",lage:3,steck:[["Abstand zur Sonne","150 Millionen km"],["Größe","12 700 km breit"],["Ein Jahr","365 Tage"],["Monde","1"]],
      s:["Die Erde ist unser Zuhause – der einzige Planet, auf dem wir Leben kennen.","Mehr als zwei Drittel der Erde sind mit Wasser bedeckt. Darum sieht sie von oben blau aus.","Die Luft um die Erde schützt uns vor Kälte und vor gefährlichen Strahlen der Sonne.","In 24 Stunden dreht sich die Erde einmal um sich selbst – so entstehen Tag und Nacht."]},
    mond:{name:"Der Mond",lage:3,mond:1,steck:[["Abstand zur Erde","384 000 km"],["Größe","3 470 km – ein Viertel der Erde"],["Eine Runde um die Erde","etwa 27 Tage"],["Menschen dort","12"]],
      s:["Der Mond leuchtet nicht selbst – er wird von der Sonne angestrahlt.","Er zeigt uns immer dieselbe Seite. Seine Rückseite sieht man von der Erde nie.","Von 1969 bis 1972 sind 12 Astronauten auf dem Mond gelaufen.","Weil es dort keinen Wind gibt, sind ihre Fußspuren heute noch zu sehen."]},
    mars:{name:"Mars",lage:4,steck:[["Abstand zur Sonne","228 Millionen km"],["Größe","6 800 km – halb so groß wie die Erde"],["Ein Jahr","687 Tage"],["Monde","2 (Phobos und Deimos)"]],
      s:["Mars heißt der Rote Planet: Sein Staub ist rostig-rot.","Dort steht der Olympus Mons, der höchste Vulkan im Sonnensystem – mehr als doppelt so hoch wie der Mount Everest.","Ein Tag auf dem Mars ist fast so lang wie bei uns: 24 Stunden und 37 Minuten.","Ferngesteuerte Roboter-Autos fahren schon heute über den Mars und schicken uns Fotos."]},
    asteroiden:{name:"Der Asteroidengürtel",lage:4.5,steck:[["Wo?","zwischen Mars und Jupiter"],["Größter Brocken","Ceres, 940 km breit"],["Anzahl","Millionen Felsbrocken"]],
      s:["Hier kreisen Millionen Felsbrocken um die Sonne – Reste aus der Zeit, als die Planeten entstanden.","Der größte heißt Ceres. Er ist so groß, dass er ein Zwergplanet ist.","Die Brocken sind sehr weit voneinander entfernt. Raumsonden fliegen sicher hindurch.","Die Raumsonde Dawn hat Ceres und den Asteroiden Vesta besucht."]},
    jupiter:{name:"Jupiter",lage:5,steck:[["Abstand zur Sonne","778 Millionen km"],["Größe","140 000 km – 11 Erden nebeneinander"],["Ein Jahr","fast 12 Jahre"],["Monde","über 90"]],
      s:["Jupiter ist der größte Planet. Alle anderen Planeten zusammen würden in ihn hineinpassen.","Er besteht vor allem aus Gas – man könnte nirgends auf ihm stehen.","Der Große Rote Fleck ist ein Sturm, der größer ist als die ganze Erde.","Ein Tag auf Jupiter dauert nur 10 Stunden – der kürzeste Tag aller Planeten."]},
    saturn:{name:"Saturn",lage:6,steck:[["Abstand zur Sonne","1,4 Milliarden km"],["Größe","116 000 km breit"],["Ein Jahr","fast 30 Jahre"],["Monde","über 140"]],
      s:["Saturns Ringe bestehen aus Eis und Gestein – von winzigen Körnchen bis zu Brocken so groß wie ein Haus.","Saturn ist für seine Größe so leicht, dass er in einer riesigen Badewanne schwimmen würde.","Sein größter Mond Titan ist größer als der Planet Merkur.","Kein Planet hat so viele Monde wie Saturn."]},
    uranus:{name:"Uranus",lage:7,steck:[["Abstand zur Sonne","2,9 Milliarden km"],["Größe","51 000 km breit"],["Ein Jahr","84 Jahre"],["Monde","fast 30"]],
      s:["Uranus liegt auf der Seite und rollt um die Sonne wie ein Ball.","Er ist einer der kältesten Planeten: bis minus 220 °C.","Seine blaugrüne Farbe kommt von einem Gas namens Methan.","Entdeckt hat ihn 1781 Wilhelm Herschel, ein Musiker und Forscher aus Hannover."]},
    neptun:{name:"Neptun",lage:8,steck:[["Abstand zur Sonne","4,5 Milliarden km"],["Größe","49 500 km breit"],["Ein Jahr","165 Jahre"],["Monde","16"]],
      s:["Neptun ist der Planet, der am weitesten von der Sonne entfernt ist.","Dort wehen die stärksten Winde im Sonnensystem – über 2 000 km pro Stunde.","Forscher haben mit Mathematik berechnet, wo Neptun sein muss. 1846 wurde er in Berlin genau dort gefunden!","Sein Mond Triton kreist rückwärts um ihn herum."]},
    pluto:{name:"Pluto",lage:9,steck:[["Abstand zur Sonne","etwa 5,9 Milliarden km"],["Größe","2 380 km – kleiner als unser Mond"],["Ein Jahr","248 Jahre"],["Monde","5"]],
      s:["Pluto war früher der neunte Planet. Seit 2006 nennt man ihn Zwergplanet.","Die Raumsonde New Horizons hat 2015 Fotos geschickt: Auf Pluto gibt es eine helle Fläche in Herzform.","Es gibt dort Berge aus Eis und Gletscher aus gefrorenem Gas.","Für eine Runde um die Sonne braucht Pluto 248 Jahre."]},
    charon:{name:"Charon",lage:9,steck:[["Was ist das?","der größte Mond von Pluto"],["Größe","1 210 km – halb so groß wie Pluto"]],
      s:["Charon ist der größte Mond von Pluto – fast halb so groß wie Pluto selbst.","Pluto und Charon zeigen einander immer dieselbe Seite, wie zwei Tänzer, die sich anschauen.","Am Nordpol von Charon gibt es einen dunkelroten Fleck."]},
    kuiper:{name:"Der Kuipergürtel",lage:10,steck:[["Wo?","hinter Neptun"],["Was ist dort?","Tausende Eisbrocken"],["Bekanntester Bewohner","Pluto"]],
      s:["Hinter Neptun liegt ein riesiger Ring aus Eis-Brocken: der Kuipergürtel.","Auch Pluto und andere Zwergplaneten gehören dazu.","2019 flog die Raumsonde New Horizons am Eisbrocken Arrokoth vorbei. Er sieht aus wie ein roter Schneemann.","Arrokoth ist das am weitesten entfernte Ding, das eine Raumsonde je besucht hat."]},
    heliopause:{name:"Der Rand des Sonnensystems",lage:11,steck:[["Abstand zur Sonne","etwa 18 Milliarden km"],["Erstes Raumschiff hier","Voyager 1 (2012)"]],
      s:["Die Sonne bläst ständig einen unsichtbaren Wind ins All. Hier hört er auf – das ist der Rand des Sonnensystems.","Die Raumsonde Voyager 1 ist 1977 gestartet und 2012 als Erste hier hindurchgeflogen.","Voyager hat eine goldene Schallplatte dabei – mit Musik und Grüßen in 55 Sprachen, auch auf Deutsch.","Voyager 1 fliegt immer weiter. Sie ist das von Menschen gebaute Ding, das am weitesten von der Erde weg ist."]},
    oort:{name:"Die Oortsche Wolke",lage:12,steck:[["Wo?","weit hinter dem Rand des Sonnensystems"],["Was ist dort?","Milliarden Eisbrocken"]],
      s:["Eine riesige Wolke aus Eisbrocken umgibt das ganze Sonnensystem wie eine Kugel.","Von dort kommen viele Kometen mit ihren langen, leuchtenden Schweifen.","Sie ist so weit weg, dass noch keine Raumsonde dort war.","Voyager 1 braucht noch etwa 300 Jahre, bis sie den Anfang der Wolke erreicht."]},
    alphacen:{name:"Alpha Centauri",steck:[["Entfernung","4,3 Lichtjahre"],["Sterne","3 (A, B und Proxima)"]],
      s:["Alpha Centauri ist das Sternsystem, das uns am nächsten ist. Es besteht aus drei Sternen.","Ein Lichtjahr ist der Weg, den Licht in einem Jahr fliegt: fast 10 Billionen Kilometer!","Der kleine rote Stern Proxima ist der nächste Stern nach der Sonne. Um ihn kreist ein Planet.","Von Deutschland aus kann man Alpha Centauri nicht sehen – nur von der Südhalbkugel der Erde."]},
    orion:{name:"Der Orionnebel",steck:[["Entfernung","etwa 1 300 Lichtjahre"],["Was ist das?","eine Wolke aus Gas und Staub"]],
      s:["Im Orionnebel entstehen gerade neue Sterne – er ist eine Kinderstube für Sterne.","Hunderte junge Sterne leuchten in der Wolke.","Im Winter kannst du ihn sehen: als kleinen hellen Fleck unter den drei Gürtelsternen des Sternbilds Orion.","Sein Licht war 1 300 Jahre zu uns unterwegs."]},
    plejaden:{name:"Die Plejaden",steck:[["Entfernung","etwa 440 Lichtjahre"],["Anderer Name","Siebengestirn"],["Sterne","über 1 000"]],
      s:["Die Plejaden sind eine Gruppe junger, heißer, blauer Sterne.","Mit bloßem Auge sieht man sechs oder sieben – darum heißen sie Siebengestirn.","In Wirklichkeit gehören über tausend Sterne dazu.","Im Herbst und Winter kannst du sie abends am Himmel finden."]},
    sl:{name:"Ein Schwarzes Loch",steck:[["Was ist das?","eine riesige Masse auf winzigem Raum"],["Erstes Foto","2019"]],
      s:["Ein Schwarzes Loch zieht alles an – sogar Licht kann nicht entkommen. Darum ist es schwarz.","Es entsteht zum Beispiel, wenn ein riesiger Stern am Ende seines Lebens in sich zusammenfällt.","In der Mitte unserer Milchstraße sitzt ein Schwarzes Loch, das so schwer ist wie 4 Millionen Sonnen.","Keine Angst: Alle Schwarzen Löcher sind sehr, sehr weit von der Erde entfernt."]},
    milchstrasse:{name:"Die Milchstraße",steck:[["Größe","etwa 100 000 Lichtjahre breit"],["Sterne","über 100 Milliarden"]],
      s:["Die Milchstraße ist unsere Galaxie – eine riesige Spirale aus Sternen. Die Sonne ist einer davon.","In einer dunklen Nacht ohne Lampen sieht man sie als hellen Streifen am Himmel.","Die Sonne braucht etwa 230 Millionen Jahre für eine Runde um die Mitte der Milchstraße.","Von außen hat noch nie jemand die Milchstraße fotografiert – alle Bilder sind gemalt."]},
    andromeda:{name:"Die Andromeda-Galaxie",steck:[["Entfernung","2,5 Millionen Lichtjahre"],["Sterne","etwa 1 Billion"]],
      s:["Andromeda ist unsere große Nachbar-Galaxie.","Ihr Licht ist 2,5 Millionen Jahre zu uns unterwegs. Es ist losgeflogen, bevor es Menschen gab.","Sie ist das am weitesten entfernte Ding, das man ohne Fernrohr sehen kann – im Herbst als kleiner Nebelfleck.","Andromeda und die Milchstraße kommen sich langsam näher. In einigen Milliarden Jahren könnten sie sich treffen."]}
  };
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const css=`
  #sk{position:fixed;inset:0;z-index:3000;background:#060913;color:#e2e8f0;overflow-y:auto;overscroll-behavior:contain;
    font-family:"Segoe UI",system-ui,-apple-system,Arial,sans-serif;-webkit-overflow-scrolling:touch}
  #sk .skin{max-width:980px;margin:0 auto;padding:14px 14px 40px}
  #sk .skkopf{display:flex;align-items:center;gap:10px;justify-content:space-between;margin-bottom:8px}
  #sk h2{margin:0;font-size:21px}
  #sk button{font:inherit;font-size:15px;font-weight:700;border-radius:12px;border:2px solid #334155;background:#0f172a;color:#e2e8f0;padding:8px 14px;cursor:pointer}
  #sk button.haupt{background:linear-gradient(180deg,#38bdf8,#0284c7);border-color:#38bdf8;color:#042433}
  #sk .sktipp{color:#94a3b8;font-size:14px;margin:0 0 10px}
  #sk .skband{overflow-x:auto;overflow-y:hidden;border-radius:16px;border:1px solid #1e293b;touch-action:pan-x pan-y;
    background:#05070f url(bilder/rallye/bg_raum2.webp) left center/auto 100% repeat-x}
  #sk .skreihe{display:flex;align-items:stretch;min-width:max-content;padding:10px 12px 12px;position:relative}
  #sk .skbereich{display:flex;flex-direction:column}
  #sk .skbt{font-size:12px;color:#fbbf24;font-weight:700;padding:0 6px 4px;border-bottom:1px dashed #334155;margin:0 4px 8px;white-space:nowrap}
  #sk .skorte{display:flex;align-items:center}
  #sk .ort{width:112px;height:190px;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;cursor:pointer;border-radius:14px;flex:none}
  #sk .ort:hover{background:rgba(56,189,248,.08)}
  #sk .ort .bild{flex:1;display:flex;align-items:center;justify-content:center;width:100%}
  #sk .ort img{max-width:104px;object-fit:contain}
  #sk img.licht{mix-blend-mode:screen}
  #sk .ort .nm{font-size:12.5px;text-align:center;line-height:1.2;min-height:30px;padding:0 4px}
  #sk .ort.zu{cursor:default} #sk .ort.zu img{filter:grayscale(1) brightness(.45)} #sk .ort.zu .nm{color:#64748b}
  #sk .ort .schloss{position:absolute;top:44%;left:50%;transform:translate(-50%,-50%);font-size:20px;opacity:.85}
  #sk .ort.hier{background:rgba(251,191,36,.12);box-shadow:inset 0 0 0 2px #fbbf24}
  #sk .ort .marke{position:absolute;top:4px;left:50%;transform:translateX(-50%);font-size:11px;font-weight:800;white-space:nowrap;
    background:#fbbf24;color:#1f2937;border-radius:8px;padding:1px 7px}
  #sk .ort.naechst .marke{background:#38bdf8;color:#042433}
  #sk .skdetail{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:16px;margin-top:8px}
  @media (max-width:720px){ #sk .skdetail{grid-template-columns:1fr} }
  #sk .skbildbox{position:relative;background:#05070f url(bilder/rallye/bg_raum3.webp) center/cover;border-radius:16px;border:1px solid #1e293b;
    display:flex;align-items:center;justify-content:center;min-height:240px;padding:14px}
  #sk .skbildwrap{position:relative;display:inline-block;max-width:100%}
  #sk .skbildwrap img{display:block;max-width:100%;max-height:340px}
  #sk .skteil{position:absolute;border-radius:50%;cursor:pointer;border:3px solid transparent}
  #sk .skteil.an{border-color:#fbbf24;box-shadow:0 0 14px rgba(251,191,36,.7)}
  #sk .skteil:not(.an){border-color:rgba(56,189,248,.55);border-style:dashed}
  #sk .tlabel{position:absolute;bottom:-24px;left:50%;transform:translateX(-50%);font-size:12px;font-weight:800;white-space:nowrap;
    background:#0f172a;border:1px solid #334155;border-radius:8px;padding:1px 7px;color:#e2e8f0}
  #sk .tipptipp{font-size:13px;color:#94a3b8;margin-top:8px;text-align:center}
  #sk .sktext h3{margin:0 0 8px;font-size:24px}
  #sk .steck{display:grid;grid-template-columns:auto 1fr;gap:4px 12px;background:#0b1220;border:1px solid #1e293b;border-radius:12px;padding:10px 12px;font-size:14.5px;margin-bottom:10px}
  #sk .steck dt{color:#94a3b8} #sk .steck dd{margin:0;font-weight:700}
  #sk .saetze{margin:0;padding-left:20px;font-size:16px;line-height:1.5} #sk .saetze li{margin:5px 0}
  #sk .lage{margin-top:12px;background:#0b1220;border:1px solid #1e293b;border-radius:12px;padding:8px 10px}
  #sk .lage b{font-size:13px;color:#94a3b8;font-weight:700}
  #sk .lage svg{display:block;width:100%;height:auto}
  #sk .sknav{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
  #sk .vl.an{border-color:#fbbf24;color:#fbbf24}
  #sk .meldung{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#1e293b;border:1px solid #475569;border-radius:12px;padding:10px 16px;font-size:15px;z-index:3001}`;
  let stand={i:0,t:0}, aktOrt=0, aktObj="", el=null;
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
  function offen(k){ return k<=stand.i; }
  // ---------- Übersichtskarte ----------
  function karte(){
    still();
    let h=`<div class="skkopf"><h2>🗺️ Deine Sternenkarte</h2><button id="skZu">✕ Schließen</button></div>
      <p class="sktipp">Tippe auf einen Ort, an dem du schon warst – dann erfährst du mehr darüber. Orte mit 🔒 erreichst du, wenn du weiterfliegst. Du kannst die Karte zur Seite schieben.</p>
      <div class="skband" id="skBand"><div class="skreihe">`;
    BEREICHE.forEach(([a,b,titel])=>{
      h+=`<div class="skbereich"><div class="skbt">${titel}</div><div class="skorte">`;
      for(let k=a;k<b;k++){
        const o=ORTE[k], auf=offen(k), name=INFO[o.objekte[0]].name;
        const marke = k===stand.i ? `<span class="marke">🚀 Du bist hier</span>` : k===stand.i+1 ? `<span class="marke">nächstes Ziel</span>` : "";
        h+=`<div class="ort${auf?"":" zu"}${k===stand.i?" hier":""}${k===stand.i+1?" naechst":""}" data-k="${k}">${marke}
          <div class="bild"><img src="${B}${o.id}.webp" alt="" class="${o.licht?"licht":""}" style="width:${o.gr}px;max-height:${Math.round(o.gr*1.05)}px"></div>
          ${auf?"":`<span class="schloss">🔒</span>`}<div class="nm">${auf?esc(name):"?"}</div></div>`;
      }
      h+=`</div></div>`;
    });
    h+=`</div></div>`;
    el.querySelector(".skin").innerHTML=h;
    el.querySelector("#skZu").onclick=schliessen;
    el.querySelectorAll(".ort").forEach(o=>o.onclick=()=>{
      const k=+o.dataset.k;
      if(!offen(k)){ meldung(k===stand.i+1 ? "Hierhin fliegst du gerade – noch ein paar Runden!" : "Da warst du noch nicht – flieg weiter!"); return; }
      detail(k, ORTE[k].objekte[0]);
    });
    // zur aktuellen Stelle scrollen
    const band=el.querySelector("#skBand"), hier=el.querySelector(".ort.hier");
    if(band && hier) band.scrollLeft=Math.max(0, hier.offsetLeft-band.clientWidth/2+56);
  }
  // ---------- Mini-Karte „Wo liegt das?" ----------
  const PLX=[12,40,54,70,86,134,170,206,238,268,292,330,350];   // Sonne, Merkur … Neptun, Pluto, Kuiper, Rand, Oort
  function lageSVG(info){
    if(info.mond){   // Mond kreist um die Erde
      return `<b>So kreist der Mond um die Erde</b>
      <svg viewBox="0 0 360 120"><circle cx="20" cy="60" r="44" fill="#fbbf24" opacity=".9"/><text x="20" y="114" fill="#94a3b8" font-size="11" text-anchor="middle">Sonne</text>
        <circle cx="220" cy="60" r="46" fill="none" stroke="#334155" stroke-dasharray="3 4"/>
        <circle cx="220" cy="60" r="16" fill="#3b82f6"/><text x="220" y="114" fill="#94a3b8" font-size="11" text-anchor="middle">Erde</text>
        <g><animateTransform attributeName="transform" type="rotate" from="0 220 60" to="360 220 60" dur="8s" repeatCount="indefinite"/>
          <circle cx="266" cy="60" r="6" fill="#cbd5e1"/><text x="276" y="56" fill="#fbbf24" font-size="11" font-weight="700">Mond</text></g></svg>`;
    }
    if(info.lage===undefined) return `<b>Wo liegt das?</b><div style="font-size:14px;margin-top:4px">Weit außerhalb unseres Sonnensystems – so weit, dass man die Entfernung in <b>Lichtjahren</b> misst.</div>`;
    const x = info.lage===4.5 ? 108 : PLX[Math.round(info.lage)];
    let s=`<b>Wo liegt das? (Abstände nicht maßstabsgetreu)</b><svg viewBox="0 0 360 90">
      <circle cx="-8" cy="45" r="20" fill="#fbbf24"/>`;
    for(let k=1;k<=8;k++) s+=`<circle cx="${PLX[k]}" cy="45" r="${[0,3,4,4,3.5,10,9,6,6][k]}" fill="${k===3?"#3b82f6":k===4?"#c2410c":"#94a3b8"}"/>`;
    s+=`<g fill="#64748b">${[100,104,108,112,116,102,110,114].map((xx,j)=>`<circle cx="${xx}" cy="${36+(j*7)%20}" r="1.3"/>`).join("")}</g>
      <rect x="256" y="30" width="58" height="30" rx="12" fill="none" stroke="#475569" stroke-dasharray="2 3"/>
      <circle cx="${PLX[9]}" cy="45" r="2.5" fill="#94a3b8"/>
      <line x1="330" y1="10" x2="330" y2="80" stroke="#38bdf8" stroke-dasharray="3 3" opacity=".7"/>
      <g fill="#64748b">${[14,26,38,50,62,74].map(y=>`<circle cx="${348+(y%3)}" cy="${y}" r="1.2"/>`).join("")}</g>
      <circle cx="${x}" cy="45" r="13" fill="none" stroke="#fbbf24" stroke-width="2.5"/>
      <text x="${Math.min(Math.max(x,30),330)}" y="80" fill="#fbbf24" font-size="12" font-weight="700" text-anchor="middle">${esc(info.name)}</text></svg>`;
    return s;
  }
  // ---------- Detailseite ----------
  function detail(k, objId){
    still(); aktOrt=k; aktObj=objId;
    const o=ORTE[k], info=INFO[objId];
    const offeneListe=ORTE.map((_,j)=>j).filter(offen), pos=offeneListe.indexOf(k);
    const vor=offeneListe[pos-1], nach=offeneListe[pos+1];
    let teile="";
    if(o.teile) teile=o.teile.map(([id,l,ob,r,u])=>`<div class="skteil${id===objId?" an":""}" data-o="${id}" style="left:${l*100}%;top:${ob*100}%;width:${(r-l)*100}%;height:${(u-ob)*100}%">
      <span class="tlabel">${esc(INFO[id].name.replace(/^(Der|Die|Das) /,""))}</span></div>`).join("");
    const text=[info.name+".", ...info.steck.map(([a,b])=>a+": "+b+"."), ...info.s].join(" ");
    el.querySelector(".skin").innerHTML=`
      <div class="skkopf"><button id="skKarte">◀ Zur Karte</button><button id="skZu">✕</button></div>
      <div class="skdetail">
        <div><div class="skbildbox"><div class="skbildwrap"><img src="${B}${o.id}.webp" alt="" class="${o.licht?"licht":""}">${teile}</div></div>
          ${o.tipp?`<div class="tipptipp">👆 ${o.tipp}</div>`:""}</div>
        <div class="sktext"><h3>${esc(info.name)}</h3>
          <dl class="steck">${info.steck.map(([a,b])=>`<dt>${esc(a)}</dt><dd>${esc(b)}</dd>`).join("")}</dl>
          <ul class="saetze">${info.s.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
          <div class="lage">${lageSVG(info)}</div>
          <div class="sknav"><button class="vl" id="skVor">🔊 Vorlesen</button>
            ${vor!==undefined?`<button id="skZurueck">◀ ${esc(INFO[ORTE[vor].objekte[0]].name)}</button>`:""}
            ${nach!==undefined?`<button class="haupt" id="skWeiter">${esc(INFO[ORTE[nach].objekte[0]].name)} ▶</button>`:""}</div>
        </div></div>`;
    el.scrollTop=0;
    el.querySelector("#skKarte").onclick=karte;
    el.querySelector("#skZu").onclick=schliessen;
    el.querySelector("#skVor").onclick=e=>sprich(text,e.currentTarget);
    const z=el.querySelector("#skZurueck"), w=el.querySelector("#skWeiter");
    if(z) z.onclick=()=>detail(vor, ORTE[vor].objekte[0]);
    if(w) w.onclick=()=>detail(nach, ORTE[nach].objekte[0]);
    el.querySelectorAll(".skteil").forEach(t=>t.onclick=()=>detail(k, t.dataset.o));
  }
  function schliessen(){ still(); if(el){ el.remove(); el=null; } document.body.style.overflow=""; }
  function oeffnen(s){
    stand={i:Math.max(0,Math.min(19,s&&s.i||0)), t:s&&s.t||0};
    if(!document.getElementById("skCss")){ const st=document.createElement("style"); st.id="skCss"; st.textContent=css; document.head.appendChild(st); }
    if(el) el.remove();
    el=document.createElement("div"); el.id="sk"; el.innerHTML=`<div class="skin"></div>`; document.body.appendChild(el);
    document.body.style.overflow="hidden";
    karte();
  }
  window.Reise={ oeffnen, schliessen, INFO, ORTE };
})();
