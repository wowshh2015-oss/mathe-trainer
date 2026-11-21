// ===== Mein Zoo / Klassen-Zoo =====
// Die Tiere des Spiels „Mein Zoo" (zoo-trainer.html, Motor: groessen.js) und die Darstellung der Gehege.
// Auch die Klassenübersicht (lehrer.html) benutzt diese Datei für den gemeinsamen Klassen-Zoo.
// Gespeichert wird nichts Eigenes: Jede Zoo-Runde trägt im Feld „tiere" die gewonnenen Tiere – der Zoo ist die Summe aller Runden.
window.Zoo=(function(){
  // Seltenheit: 1 = häufig, 2 = selten ⭐, 3 = legendär 🌟.  Nur Bilder, die auch ältere iPads kennen.
  const GEHEGE=[["hof","🚜","Bauernhof"],["wald","🌲","Wald und Wiese"],["savanne","🌍","Savanne"],["dschungel","🌴","Dschungel"],["meer","🌊","Meer und Eis"],["fabel","✨","Urzeit und Fabelwesen"]];
  const TIERE=[
    ["huhn","🐔","Huhn","hof",1],["kueken","🐤","Küken","hof",1],["schwein","🐷","Schwein","hof",1],["kuh","🐮","Kuh","hof",1],["schaf","🐑","Schaf","hof",1],["ziege","🐐","Ziege","hof",1],
    ["pferd","🐴","Pferd","hof",1],["hase","🐰","Hase","hof",1],["katze","🐱","Katze","hof",1],["hund","🐶","Hund","hof",1],["ente","🦆","Ente","hof",1],["maus","🐭","Maus","hof",1],
    ["fuchs","🦊","Fuchs","wald",1],["igel","🦔","Igel","wald",1],["frosch","🐸","Frosch","wald",1],["schnecke","🐌","Schnecke","wald",1],["marienkaefer","🐞","Marienkäfer","wald",1],["schmetterling","🦋","Schmetterling","wald",1],
    ["eichhoernchen","🐿️","Eichhörnchen","wald",1],["wildschwein","🐗","Wildschwein","wald",1],["hirsch","🦌","Hirsch","wald",2],["eule","🦉","Eule","wald",2],["wolf","🐺","Wolf","wald",2],["baer","🐻","Bär","wald",2],["adler","🦅","Adler","wald",2],
    ["zebra","🦓","Zebra","savanne",1],["kamel","🐪","Kamel","savanne",1],["nashorn","🦏","Nashorn","savanne",2],["giraffe","🦒","Giraffe","savanne",2],["elefant","🐘","Elefant","savanne",2],
    ["krokodil","🐊","Krokodil","savanne",2],["leopard","🐆","Leopard","savanne",2],["loewe","🦁","Löwe","savanne",2],
    ["affe","🐵","Affe","dschungel",1],["schlange","🐍","Schlange","dschungel",1],["eidechse","🦎","Eidechse","dschungel",1],["fledermaus","🦇","Fledermaus","dschungel",1],
    ["koala","🐨","Koala","dschungel",2],["panda","🐼","Panda","dschungel",2],["gorilla","🦍","Gorilla","dschungel",2],["tiger","🐯","Tiger","dschungel",2],
    ["fisch","🐠","Clownfisch","meer",1],["blaufisch","🐟","Fisch","meer",1],["kugelfisch","🐡","Kugelfisch","meer",1],["krabbe","🦀","Krabbe","meer",1],["schildkroete","🐢","Schildkröte","meer",1],["pinguin","🐧","Pinguin","meer",1],
    ["tintenfisch","🐙","Tintenfisch","meer",2],["delfin","🐬","Delfin","meer",2],["hai","🦈","Hai","meer",2],["wal","🐳","Wal","meer",2],
    ["langhals","🦕","Langhals-Dino","fabel",3],["trex","🦖","T-Rex","fabel",3],["drache","🐉","Drache","fabel",3],["einhorn","🦄","Einhorn","fabel",3]
  ];
  const NACH_ID={}; TIERE.forEach(t=>NACH_ID[t[0]]=t);
  const STERN=["","","⭐","🌟"], WORT=["","","selten","legendär"];
  // alle Tiere aus den Zoo-Runden: {id: Anzahl}
  function zaehle(rows){ const z={}; (rows||[]).forEach(e=>{ if(e.app==="zoo") (e.tiere||[]).forEach(id=>{ if(NACH_ID[id]) z[id]=(z[id]||0)+1; }); }); return z; }
  function summe(z){ return Object.values(z).reduce((a,b)=>a+b,0); }
  // Ein neues Tier ziehen. besitz: was das Kind schon hat. bonus (0…1): gute Runde und gelöste schwere Aufgaben machen seltene Tiere wahrscheinlicher.
  // faktor: schwerere Runden (Klasse 3 statt Klasse 1) machen seltene und legendäre Tiere wahrscheinlicher – 1 = wie bisher
  function ziehe(besitz, bonus, mindestens, hoechstens, faktor){
    const f=faktor||1, p3=Math.min(0.35,(0.04+bonus*0.10)*f), p2=Math.min(0.85,(0.26+bonus*0.30)*Math.min(f,1.8));
    const w=Math.random(); let s = w < p3 ? 3 : w < p2 ? 2 : 1; if(mindestens && s<mindestens) s=mindestens; if(hoechstens && s>hoechstens) s=hoechstens;
    const pool=TIERE.filter(t=>t[4]===s), neu=pool.filter(t=>!besitz[t[0]]);
    const wahl = neu.length && Math.random()<0.7 ? neu : pool;
    return wahl[Math.floor(Math.random()*wahl.length)][0];
  }
  function stil(){
    if(document.getElementById("zooStil")) return;
    const s=document.createElement("style"); s.id="zooStil";
    s.textContent=`
    .zooKopf{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:8px} .zooKopf b{font-size:1.25em} .zooKopf span{color:#94a3b8;font-size:.85em}
    .zooGehege{background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.35);border-radius:14px;padding:8px 10px;margin-bottom:8px}
    .zooGehege.fabel{background:rgba(250,204,21,.08);border-color:rgba(250,204,21,.45)} .zooGehege.meer{background:rgba(56,189,248,.08);border-color:rgba(56,189,248,.4)}
    .zooGehege h5{margin:0 0 4px;font-size:.8em;color:#cbd5e1;font-weight:700} .zooGehege h5 small{color:#94a3b8;font-weight:600}
    .zooTiere{display:flex;flex-wrap:wrap;gap:4px}
    .zooTier{position:relative;width:2.2em;height:2.2em;display:flex;align-items:center;justify-content:center;font-size:1.45em;border-radius:.5em;background:rgba(15,23,42,.55)}
    .zooTier.fehlt{font-size:1em;width:3.19em;height:3.19em;color:#475569;font-weight:800} .zooTier.s2{box-shadow:inset 0 0 0 2px #38bdf8} .zooTier.s3{box-shadow:inset 0 0 0 2px #fde047,0 0 10px rgba(253,224,71,.5)}
    .zooTier i{position:absolute;right:-3px;bottom:-4px;font:800 .42em/1.5 "Segoe UI",system-ui,sans-serif;font-style:normal;background:#0f172a;color:#e2e8f0;border-radius:999px;padding:0 5px}
    .zooNeu{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin:10px 0}
    .zooNeu > div{background:#0b1220;border:2px solid #334155;border-radius:16px;padding:10px 14px;text-align:center;min-width:104px} .zooNeu > div.s2{border-color:#38bdf8} .zooNeu > div.s3{border-color:#fde047;box-shadow:0 0 14px rgba(253,224,71,.45)}
    .zooNeu .b{font-size:46px;line-height:1.1} .zooNeu .n{font-weight:800;color:#f1f5f9} .zooNeu .w{font-size:12.5px;color:#94a3b8;font-weight:700}`;
    document.head.appendChild(s);
  }
  // Die Gehege: vorhandene Tiere als Bild (mit Anzahl), fehlende als Fragezeichen
  function feldHTML(z, titel){
    stil();
    const arten=Object.keys(z).length, alle=summe(z);
    return `<div class="zooKopf"><b>${titel}: ${alle} ${alle===1?"Tier":"Tiere"}</b><span>${arten} von ${TIERE.length} Arten entdeckt</span></div>`+
      GEHEGE.map(g=>{ const l=TIERE.filter(t=>t[3]===g[0]), da=l.filter(t=>z[t[0]]).length;
        return `<div class="zooGehege ${g[0]}"><h5>${g[1]} ${g[2]} <small>${da} von ${l.length}</small></h5><div class="zooTiere">${l.map(t=> z[t[0]]
          ? `<span class="zooTier s${t[4]}" title="${t[2]}${t[4]>1?" – "+WORT[t[4]]:""}">${t[1]}${z[t[0]]>1?`<i>×${z[t[0]]}</i>`:""}</span>` : `<span class="zooTier fehlt" title="noch nicht entdeckt">?</span>`).join("")}</div></div>`; }).join("");
  }
  // „Neu in deinem Zoo" nach einer Runde
  function neuHTML(ids){
    stil();
    return `<div class="zooNeu">${ids.map(id=>{ const t=NACH_ID[id]; return `<div class="s${t[4]}"><div class="b">${t[1]}</div><div class="n">${t[2]}</div><div class="w">${t[4]>1?STERN[t[4]]+" "+WORT[t[4]]:"zieht ein"}</div></div>`; }).join("")}</div>`;
  }
  // Ausbaustufen des Klassen-Zoos
  const STUFEN=[[0,"Kleines Gehege"],[25,"Streichelzoo"],[75,"Tierpark"],[150,"Zoo"],[300,"Großer Zoo"],[500,"Safari-Park"],[800,"Welt-Zoo"]];
  function ausbau(n){ const jetzt=STUFEN.filter(s=>n>=s[0]).pop(), ziel=STUFEN.find(s=>s[0]>n)||null; return {jetzt:jetzt[1], ziel:ziel?ziel[1]:"", fehlt:ziel?ziel[0]-n:0}; }
  return { TIERE, GEHEGE, NACH_ID, zaehle, summe, ziehe, feldHTML, neuHTML, ausbau, STERN, WORT };
})();
