// ===== Sterne und Sticker-Album =====
// Silberne Sterne ⭐ gibt es für Fleiß, goldene 🌟 für Können. Sterne werden nie ausgegeben – sie wachsen nur.
// Alle 10 silbernen Sterne öffnet sich ein Sticker, jeder goldene Stern öffnet einen Glitzer-Sticker.
// Der Stand wird aus den gespeicherten Durchgängen berechnet (wie der Tank) – nichts, was man verstellen könnte.
// Eine Rangliste gibt es für Kinder bewusst nicht; die Übersicht steht nur in der Klassenübersicht der Lehrkraft.
window.Sterne=(function(){
  const STICHTAG_SPIEL="20261112";     // Spiele zählen ab hier; die Lernarbeit davor zählt komplett mit
  const LERN=["zerlegen","halbschriftlich","plus","minus","einmaleins","einsdurcheins"];
  const W={runde:3, mine:5, neu:5, tag:2, proRunden:10, etage:1, pruefung:3, fest:2, proSicher:5}, PRO_TAG=3;
  const GOLD_STUFE={Leicht:1, Mittel:2, Schwer:3};
  const PRO_STICKER=10;
  const ALBEN=[
    {id:"tiere",   ic:"🐾", name:"Tiere",
     s:["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐔","🐧","🐦","🦆","🦉","🐴","🦓","🦒","🐘","🦛","🐊","🐢","🐍","🦜","🦩"]},
    {id:"dinos",   ic:"🦖", name:"Dinos & Meer",
     s:["🦕","🦖","🐟","🐠","🐡","🦈","🐬","🐳","🐋","🐙","🦑","🦀","🦞","🦐","🐚","🦎","🦂","🕷️","🦋","🐝","🐞","🐌","🦗","🐛","🐜","🦇","🐿️","🦔","🦢","🦚"]},
    {id:"weltraum",ic:"🚀", name:"Weltraum",
     s:["🚀","🛸","🛰️","🌍","🌕","🌗","🌑","🌙","⭐","✨","☄️","🪐","☀️","🌞","👨‍🚀","👩‍🚀","👽","🤖","🔭","🌌","🌠","⚡","🌈","🔥","❄️","🌪️","🌋","🧲","🔬","💫"]},
    {id:"fahrzeuge",ic:"🚗", name:"Fahrzeuge",
     s:["🚗","🚕","🚙","🚌","🚎","🏎️","🚓","🚑","🚒","🚐","🚍","🚚","🚛","🚜","🏍️","🛵","🚲","🛴","🚂","🚆","🚇","🚊","✈️","🛩️","🚁","⛵","🚤","🛳️","🚢","🛶"]},
    {id:"lecker",  ic:"🍓", name:"Leckeres",
     s:["🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🍒","🍑","🥭","🍍","🥝","🍅","🥕","🌽","🥨","🧀","🥞","🧇","🍕","🍔","🍟","🌭","🍿","🍩","🍪","🎂","🍦","🍫"]}
  ];
  const GLITZER={id:"glitzer", ic:"💎", name:"Glitzer",
     s:["🦄","🐲","👑","💎","🏆","🥇","🎖️","🔮","🎩","🧙","🧚","🧜‍♀️","🦸","🦹","🧝","🏰","🎠","🎡","🎢","🎆","🎇","🎊","🎁","🎈","🎉","🏅","🗝️","💰","💍","🌟"]};

  function tag(e){ const p=String(e.datum||"").split("."); return (p[2]||"")+(p[1]||"")+(p[0]||""); }
  function ts(e){ return tag(e)+String(e.zeit||"").replace(":",""); }
  function heuteTag(){ const d=new Date(), p=x=>String(x).padStart(2,"0"); return d.getFullYear()+p(d.getMonth()+1)+p(d.getDate()); }
  function tageHer(e){ const p=String(e.datum||"").split("."), d=new Date(+p[2],(+p[1])-1,+p[0]), h=new Date(); h.setHours(0,0,0,0); return Math.round((h-d)/86400000); }
  function esc(s){ return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
  function zaehlt(e){
    if(e.modus==="Test" && e.bestanden==="Ja") return true;
    return (+e.richtig||0) >= (e.app==="halbschriftlich" ? 5 : 8);
  }
  // rows: alle Durchgänge des Kindes (alle Programme, mit Geschenken)
  function stand(rows){
    const H=heuteTag();
    let silber=0, gold=0, heute=0, goldHeute=0;
    const S=(n,d)=>{ silber+=n; if(d===H) heute+=n; }, G=(n,d)=>{ gold+=n; if(d===H) goldHeute+=n; };
    const warDa={}, testDa={}, fest={}, proTag={}, tagDa={};
    rows.filter(e=>LERN.includes(e.app)).sort((a,b)=>ts(a).localeCompare(ts(b))).forEach(e=>{
      if(!zaehlt(e)) return;
      const d=tag(e), neu=!warDa[e.app]; warDa[e.app]=true;
      const bestanden = e.modus==="Test" && e.bestanden==="Ja";
      if(bestanden){
        const tk=e.app+"|"+(e.zr||"")+"|"+(e.stufe||"");
        if(!testDa[tk]){ testDa[tk]=true; G(GOLD_STUFE[e.stufe]||2, d); }      // jeder Test bringt Gold beim ersten Bestehen
        if(!fest[e.app]){ fest[e.app]=true; G(W.fest, d); }                    // Stufe des Lernwegs gefestigt
      }
      const k=d+e.app; proTag[k]=(proTag[k]||0)+1;
      if(bestanden || proTag[k]<=PRO_TAG) S(neu ? W.neu : String(e.reihe)==="mine" ? W.mine : W.runde, d);
      if(!tagDa[d]){ tagDa[d]=true; S(W.tag, d); }                             // Tagesstern: lieber jeden Tag ein bisschen
    });
    // Spiele (ab dem Stichtag)
    const runden=rows.filter(e=>e.app==="rallye" && tag(e)>=STICHTAG_SPIEL).reduce((s,e)=>s+(+e.runden||0),0);
    silber+=Math.floor(runden/W.proRunden);
    rows.filter(e=>e.app==="marathon" && e.bestanden==="Ja" && tag(e)>=STICHTAG_SPIEL)
        .forEach(e=>S((+e.etage||0)%5===0 ? W.pruefung : W.etage, tag(e)));
    // Aufgaben, die alle Wiederholungen (2, 7, 21 Tage) geschafft haben
    let sicher=0;
    if(window.Wdh) LERN.forEach(a=>{ const r=rows.filter(e=>e.app===a); if(r.length) sicher+=Wdh.zaehle(r).sicher; });
    gold+=Math.floor(sicher/W.proSicher);
    // Geschenke der Lehrkraft
    const gaben=rows.filter(e=>e.app==="sterngeschenk").sort((a,b)=>ts(b).localeCompare(ts(a)));
    gaben.forEach(e=>{ S(+e.silber||0, tag(e)); G(+e.gold||0, tag(e)); });
    const neuestes=gaben.find(e=>((+e.silber||0)>0 || (+e.gold||0)>0) && tageHer(e)<=3) || null;
    silber=Math.max(0,silber); gold=Math.max(0,gold);
    return { silber, gold, heute:Math.max(0,heute), goldHeute:Math.max(0,goldHeute), tage:Object.keys(tagDa).length, sicher, neuestes,
             sticker:Math.floor(silber/PRO_STICKER), bisNaechster:PRO_STICKER-(silber%PRO_STICKER) };
  }
  // Die Sticker verteilen sich reihum auf die fünf Alben: Nr. 1 Tiere, Nr. 2 Dinos, Nr. 3 Weltraum …
  function offenIm(albumIdx, sticker){ return Math.max(0, Math.min(ALBEN[albumIdx].s.length, Math.ceil((sticker-albumIdx)/ALBEN.length))); }
  function albumVoll(){ return ALBEN.reduce((s,a)=>s+a.s.length,0); }

  function stil(){
    if(document.getElementById("stStil")) return;
    const s=document.createElement("style"); s.id="stStil";
    s.textContent=`
    .stBand{display:flex;align-items:center;gap:12px;flex-wrap:wrap;background:linear-gradient(135deg,rgba(148,163,184,.16),rgba(251,191,36,.10));
      border:1px solid rgba(203,213,225,.35);border-radius:16px;padding:12px 16px;margin:0 0 14px;text-align:left}
    .stZahl{display:flex;align-items:baseline;gap:6px;font-size:26px;font-weight:800;color:#fff;line-height:1}
    .stZahl small{font-size:12px;font-weight:700;color:#94a3b8}
    .stZahl .ic{font-size:26px}
    .stText{flex:1;min-width:150px;font-size:13.5px;color:#cbd5e1;line-height:1.45}
    .stText b{color:#fde68a}
    .stKnopf{font-family:inherit;font-size:15px;font-weight:700;border:none;border-radius:12px;padding:10px 14px;cursor:pointer;
      background:linear-gradient(180deg,#fbbf24,#d97706);color:#3b2300;white-space:nowrap}
    .stNeu{background:#ef4444;color:#fff;font-size:11px;font-weight:800;border-radius:999px;padding:2px 8px;margin-left:6px;vertical-align:2px}
    .stGabe{width:100%;background:rgba(251,191,36,.14);border:1px solid rgba(251,191,36,.4);color:#fde68a;border-radius:10px;padding:7px 11px;font-size:13.5px}
    .stOv{position:fixed;inset:0;z-index:1500;background:rgba(5,10,22,.93);display:flex;align-items:flex-start;justify-content:center;padding:16px;overflow-y:auto}
    .stBox{background:#1e293b;color:#f1f5f9;border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:20px 18px;max-width:560px;width:100%;margin:auto;
      font-family:"Segoe UI",system-ui,-apple-system,Arial,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.4)}
    .stBox h3{margin:0 0 4px;font-size:22px}
    .stBox .unter{color:#94a3b8;font-size:13.5px;margin:0 0 12px;line-height:1.45}
    .stTabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}
    .stTab{font-family:inherit;cursor:pointer;background:#0b1220;border:2px solid #334155;color:#f1f5f9;border-radius:999px;padding:7px 12px;font-size:13.5px;font-weight:700}
    .stTab.an{border-color:#fbbf24;background:rgba(251,191,36,.14);color:#fde68a}
    .stGitter{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}
    .stSt{aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:34px;line-height:1;border-radius:14px;background:#0b1220;
      border:2px solid #334155;position:relative}
    .stSt.da{border-color:rgba(251,191,36,.55);background:rgba(251,191,36,.07)}
    .stSt.zu span{filter:brightness(0) invert(.22)}
    .stSt.neu{animation:stPop .7s cubic-bezier(.2,1.5,.4,1) both;box-shadow:0 0 0 2px #ef4444}
    .stSt.neu::after{content:"NEU";position:absolute;top:-7px;right:-6px;background:#ef4444;color:#fff;font-size:9.5px;font-weight:800;border-radius:999px;padding:1px 6px}
    .stGlitzer .stSt.da{border-color:#f0abfc;background:linear-gradient(135deg,rgba(240,171,252,.18),rgba(103,232,249,.14))}
    @keyframes stPop{ 0%{transform:scale(.2) rotate(-25deg);opacity:0} 100%{transform:scale(1) rotate(0);opacity:1} }
    .stZu{font-family:inherit;width:100%;margin-top:14px;font-size:16px;font-weight:700;border:2px solid #334155;border-radius:12px;padding:12px;cursor:pointer;background:transparent;color:#f1f5f9}
    @media (max-width:430px){ .stGitter{grid-template-columns:repeat(5,1fr)} .stSt{font-size:28px} }`;
    document.head.appendChild(s);
  }
  let letzter=null, letzterName="", gesehenVor=null;
  function gesehenKey(name){ return "sterne_gesehen_"+String(name).toLowerCase(); }
  // Band für die Startseite
  function bandHTML(rows, name){
    stil();
    const s=stand(rows); letzter=s; letzterName=name;
    let alt=null; try{ const v=localStorage.getItem(gesehenKey(name)); if(v) alt=JSON.parse(v); }catch(e){}
    gesehenVor=alt;
    const plus = alt ? s.silber-(+alt.silber||0) : 0;
    const neuSt = alt ? (s.sticker-(+alt.sticker||0)) + (s.gold-(+alt.gold||0)) : 0;
    try{ localStorage.setItem(gesehenKey(name), JSON.stringify({silber:s.silber, gold:s.gold, sticker:s.sticker})); }catch(e){}
    const voll = s.sticker>=albumVoll();
    const text = (plus>0 ? `<b>+${plus} ⭐ seit deinem letzten Besuch!</b> ` : s.heute>0 ? `Heute schon <b>+${s.heute} ⭐</b>. ` : "")+
      (voll ? "Dein Album ist voll – stark!" : `Noch <b>${s.bisNaechster} ⭐</b> bis zum nächsten Sticker.`);
    const gabe = s.neuestes ? `<div class="stGabe">🎁 <b>${(+s.neuestes.silber||0)>0?"+"+s.neuestes.silber+" ⭐ ":""}${(+s.neuestes.gold||0)>0?"+"+s.neuestes.gold+" 🌟 ":""}</b>von deiner Lehrkraft${s.neuestes.grund?` – ${esc(s.neuestes.grund)}`:""}</div>` : "";
    return `<div class="stBand">
      <span class="stZahl"><span class="ic">⭐</span>${s.silber}<small>Sterne</small></span>
      <span class="stZahl"><span class="ic">🌟</span>${s.gold}<small>Gold</small></span>
      <span class="stText">${text}</span>
      <button class="stKnopf" data-album="1">📒 Mein Album${neuSt>0?`<span class="stNeu">${neuSt} NEU</span>`:""}</button>
      ${gabe}</div>`;
  }
  // Nach dem Einsetzen des Bandes aufrufen
  function verbinde(wurzel){
    (wurzel||document).querySelectorAll("[data-album]").forEach(b=>{ if(b._st) return; b._st=true; b.addEventListener("click", oeffneAlbum); });
  }
  function oeffneAlbum(){
    if(!letzter) return;
    stil();
    const s=letzter, alt=gesehenVor;
    let aktiv=0; try{ aktiv=Math.min(ALBEN.length, +localStorage.getItem("sterne_album")||0); }catch(e){}
    const ov=document.createElement("div"); ov.className="stOv"; document.body.appendChild(ov);
    function zeichne(){
      const glitzer = aktiv===ALBEN.length, al = glitzer ? GLITZER : ALBEN[aktiv];
      const offen = glitzer ? Math.min(al.s.length, s.gold) : offenIm(aktiv, s.sticker);
      const altOffen = !alt ? offen : glitzer ? Math.min(al.s.length, +alt.gold||0) : offenIm(aktiv, +alt.sticker||0);
      ov.innerHTML=`<div class="stBox">
        <h3>📒 Mein Sticker-Album</h3>
        <p class="unter">⭐ <b style="color:#fff">${s.silber}</b> Sterne · 🌟 <b style="color:#fff">${s.gold}</b> Gold ·
          Alle ${PRO_STICKER} ⭐ gibt es einen neuen Sticker, für jeden goldenen Stern 🌟 einen Glitzer-Sticker.</p>
        <div class="stTabs">${ALBEN.concat([GLITZER]).map((a,i)=>{
            const n = i===ALBEN.length ? Math.min(a.s.length,s.gold) : offenIm(i,s.sticker);
            return `<button class="stTab${i===aktiv?" an":""}" data-tab="${i}">${a.ic} ${a.name} ${n}/${a.s.length}</button>`; }).join("")}</div>
        <div class="stGitter${glitzer?" stGlitzer":""}">${al.s.map((x,i)=>
            `<div class="stSt ${i<offen?"da":"zu"}${i<offen && i>=altOffen?" neu":""}"><span>${x}</span></div>`).join("")}</div>
        <p class="unter" style="margin:12px 0 0">${glitzer
            ? "Goldene Sterne bekommst du für bestandene Tests und für Aufgaben, die nach allen Wiederholungen sicher sitzen."
            : "Silberne Sterne bekommst du für jede Übungsrunde – und zwei extra für die erste Runde am Tag."}</p>
        <button class="stZu">Schließen</button></div>`;
      ov.querySelectorAll(".stTab").forEach(b=>b.addEventListener("click",()=>{ aktiv=+b.dataset.tab; try{ localStorage.setItem("sterne_album",String(aktiv)); }catch(e){} zeichne(); }));
      ov.querySelector(".stZu").addEventListener("click",()=>ov.remove());
    }
    zeichne();
  }
  return {stand, bandHTML, verbinde, oeffneAlbum, offenIm, ALBEN, GLITZER, PRO_STICKER};
})();
