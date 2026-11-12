// ===== Sterne und Sticker-Album =====
// Silberne Sterne ⭐ gibt es für Fleiß, goldene 🌟 für Können. Sterne werden nie ausgegeben – sie wachsen nur.
// Alle 10 silbernen Sterne öffnet sich ein Sticker, jeder goldene Stern öffnet einen Glitzer-Sticker.
// Der Stand wird aus den gespeicherten Durchgängen berechnet (wie der Tank) – nichts, was man verstellen könnte.
// Eine Rangliste gibt es für Kinder bewusst nicht; die Übersicht steht nur in der Klassenübersicht der Lehrkraft.
window.Sterne=(function(){
  const STICHTAG_SPIEL="20261112";     // Spiele zählen ab hier; die Lernarbeit davor zählt komplett mit
  const LERN=["zerlegen","halbschriftlich","plus","minus","einmaleins","einsdurcheins"];
  const W={runde:3, mine:5, neu:5, tag:2, proRunden:10, fest:2, proSicher:5}, PRO_TAG=3;
  // Spiele: je schwerer, desto mehr. Rallye je 10 Runden: Stadt/Landstraße 1, Bergpass/Rennstrecke 2, Formel 1 3 Sterne.
  const RALLYE_GEWICHT=[1,1,1,2,2,3];
  // Marathon je geschaffter Etage: bis 50 → 1, bis 150 → 2, darüber 3; Prüfungsetagen (jede 5.) +2
  function etagenSterne(et){ return (et<=50?1:et<=150?2:3) + (et%5===0?2:0); }
  const GOLD_STUFE={Leicht:1, Mittel:2, Schwer:3};
  const BONUS_EMPFOHLEN=1.5, GOLD_RUNDEN=50, GOLD_ETAGE=25;
  // Empfehlung merken: Wer auf der Startseite (oder an der Tankstelle) auf einen Vorschlag des Programms tippt,
  // bekommt für die nächste gültige Runde in diesem Bereich 50 % mehr Sterne. Der Durchgang trägt dann „empfohlen".
  function empfohlen(app){ try{ return sessionStorage.getItem("mathe_emp")===app; }catch(e){ return false; } }
  function empfehlungErledigt(){ try{ sessionStorage.removeItem("mathe_emp"); }catch(e){} }
  if(typeof document!=="undefined") document.addEventListener("click", ev=>{
    const a=ev.target && ev.target.closest ? ev.target.closest("a[data-emp]") : null;
    if(a){ try{ sessionStorage.setItem("mathe_emp", a.dataset.emp); }catch(e){} }
  }, true);
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
      if(bestanden || proTag[k]<=PRO_TAG){
        const basis = neu ? W.neu : String(e.reihe)==="mine" ? W.mine : W.runde;
        S(e.empfohlen ? Math.ceil(basis*BONUS_EMPFOHLEN) : basis, d);      // der Empfehlung gefolgt: die Hälfte mehr
      }
      if(!tagDa[d]){ tagDa[d]=true; S(W.tag, d); }                             // Tagesstern: lieber jeden Tag ein bisschen
    });
    // Spiele (ab dem Stichtag)
    const runden=rows.filter(e=>e.app==="rallye" && tag(e)>=STICHTAG_SPIEL)
        .reduce((s,e)=>s+(+e.runden||0)*(RALLYE_GEWICHT[+e.strecke]||1),0);
    silber+=Math.floor(runden/W.proRunden);
    rows.filter(e=>e.app==="marathon" && e.bestanden==="Ja" && tag(e)>=STICHTAG_SPIEL)
        .forEach(e=>S(etagenSterne(+e.etage||1), tag(e)));
    // Gold in den Spielen – auch dort wird viel gerechnet:
    //   Rallye: je 50 Runden auf Bergpass, Rennstrecke oder Formel 1 ein goldener Stern
    //   Marathon: jede 25. Etage (25, 50, 75 …) ein goldener Stern, je Etage nur einmal
    const profi=rows.filter(e=>e.app==="rallye" && tag(e)>=STICHTAG_SPIEL && (+e.strecke||0)>=3).reduce((s,e)=>s+(+e.runden||0),0);
    gold+=Math.floor(profi/GOLD_RUNDEN);
    const goldEtagen=new Set();
    rows.filter(e=>e.app==="marathon" && e.bestanden==="Ja" && tag(e)>=STICHTAG_SPIEL && (+e.etage||0)%GOLD_ETAGE===0)
        .forEach(e=>{ if(!goldEtagen.has(+e.etage)){ goldEtagen.add(+e.etage); G(1, tag(e)); } });
    // Aufgaben, die alle Wiederholungen (2, 7, 21 Tage) geschafft haben
    let sicher=0;
    if(window.Wdh) LERN.forEach(a=>{ const r=rows.filter(e=>e.app===a); if(r.length) sicher+=Wdh.zaehle(r).sicher; });
    gold+=Math.floor(sicher/W.proSicher);
    // Geschenke der Lehrkraft
    const gaben=rows.filter(e=>e.app==="sterngeschenk").sort((a,b)=>ts(b).localeCompare(ts(a)));
    gaben.forEach(e=>{ S(+e.silber||0, tag(e)); G(+e.gold||0, tag(e)); });
    const neuestes=gaben.find(e=>((+e.silber||0)>0 || (+e.gold||0)>0) && tageHer(e)<=3) || null;
    silber=Math.max(0,silber); gold=Math.max(0,gold);
    return { silber, gold, heute:Math.max(0,heute), goldHeute:Math.max(0,goldHeute), tage:Object.keys(tagDa).length, lernHeute:!!tagDa[H], sicher, neuestes,
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
    .stToast{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:3000;background:linear-gradient(135deg,#1e293b,#0b1220);
      border:2px solid #fbbf24;color:#f1f5f9;border-radius:18px;padding:13px 22px;text-align:center;font-family:"Segoe UI",system-ui,-apple-system,Arial,sans-serif;
      box-shadow:0 10px 30px rgba(0,0,0,.5);animation:stHoch .5s cubic-bezier(.2,1.4,.4,1) both;max-width:92vw;transition:opacity .5s,transform .5s;pointer-events:none}
    .stToast b{font-size:28px;color:#fff} .stToast b.g{color:#fde047}
    .stToast small{display:block;font-size:13.5px;color:#cbd5e1;margin-top:3px;font-weight:600}
    .stToast.grau{border-color:#475569;font-size:15px;font-weight:700}
    .stToast.weg{opacity:0;transform:translateX(-50%) translateY(20px)}
    @keyframes stHoch{ 0%{opacity:0;transform:translateX(-50%) translateY(40px) scale(.7)} 100%{opacity:1;transform:translateX(-50%) translateY(0) scale(1)} }
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
    merkeStand(name, s.silber, s.gold); if(s.lernHeute) merkeTag(name);
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
            ? "Goldene Sterne bekommst du für bestandene Tests, für Aufgaben, die nach allen Wiederholungen sicher sitzen, für je 50 Runden auf den schweren Rallye-Strecken und für jede 25. Etage im Marathon."
            : "Silberne Sterne bekommst du für jede Übungsrunde – und zwei extra für die erste Runde am Tag."}</p>
        <button class="stZu">Schließen</button></div>`;
      ov.querySelectorAll(".stTab").forEach(b=>b.addEventListener("click",()=>{ aktiv=+b.dataset.tab; try{ localStorage.setItem("sterne_album",String(aktiv)); }catch(e){} zeichne(); }));
      ov.querySelector(".stZu").addEventListener("click",()=>ov.remove());
    }
    zeichne();
  }
  // ===== Sofort nach jeder Runde: „+3 ⭐" =====
  function standKey(name){ return "sterne_stand_"+String(name).toLowerCase(); }
  function tagKey(name){ return "sterne_tag_"+String(name).toLowerCase(); }
  function merkeStand(name, silber, gold){ try{ localStorage.setItem(standKey(name), JSON.stringify({silber, gold})); }catch(e){} }
  function merkeTag(name){ try{ localStorage.setItem(tagKey(name), heuteTag()); }catch(e){} }
  function meldung(html, farbe){
    stil();
    document.querySelectorAll(".stToast").forEach(t=>t.remove());
    const t=document.createElement("div"); t.className="stToast"+(farbe?" "+farbe:""); t.innerHTML=html;
    document.body.appendChild(t);
    setTimeout(()=>{ t.classList.add("weg"); setTimeout(()=>t.remove(), 600); }, 5200);
  }
  // a, b: Stand vorher und nachher (aus stand()). genau=false: die Zeilen stammen nur aus EINEM Programm.
  function zeigeUnterschied(a, b, name, genau, hinweis, bonus){
    let dS=b.silber-a.silber, dG=b.gold-a.gold;
    if(!genau && !a.lernHeute && b.lernHeute){        // Tagesstern nur einmal am Tag, auch wenn vorher woanders geübt wurde
      let schon=""; try{ schon=localStorage.getItem(tagKey(name))||""; }catch(e){}
      if(schon===heuteTag()) dS-=W.tag;
    }
    if(b.lernHeute) merkeTag(name);
    if(dS<=0 && dG<=0){
      if(hinweis) meldung(`Diesmal noch keine Sterne.<small>Sterne gibt es ab 8 richtigen Aufgaben – und für höchstens 3 Runden je Bereich am Tag.</small>`, "grau");
      return;
    }
    let alt=null; try{ alt=JSON.parse(localStorage.getItem(standKey(name))||"null"); }catch(e){}
    let zusatz="";
    if(alt){
      const neuS=(+alt.silber||0)+Math.max(0,dS), neuG=(+alt.gold||0)+Math.max(0,dG);
      merkeStand(name, neuS, neuG);
      const sticker=Math.floor(neuS/PRO_STICKER)-Math.floor((+alt.silber||0)/PRO_STICKER) + Math.max(0,dG);
      zusatz = sticker>0 ? `<small>🎉 ${sticker===1?"Ein neuer Sticker wartet":sticker+" neue Sticker warten"} in deinem Album!</small>`
                         : `<small>Du hast jetzt ${neuS} ⭐ – noch ${PRO_STICKER-(neuS%PRO_STICKER)} bis zum nächsten Sticker.</small>`;
    }
    if(bonus) zusatz=`<small style="color:#fde68a">✨ Mit Bonus – du hast gemacht, was dir empfohlen wurde!</small>`+zusatz;
    meldung(`${dS>0?`<b>+${dS} ⭐</b>`:""}${dS>0&&dG>0?" &nbsp; ":""}${dG>0?`<b class="g">+${dG} 🌟</b>`:""}${zusatz}`);
  }
  // Die fünf Trainer mit LOG (Plus, Minus, Einmaleins, Einsdurcheins, Zerlegen): beim Speichern mitzählen
  if(typeof document!=="undefined") document.addEventListener("DOMContentLoaded", ()=>{
    let da=false; try{ da = typeof saveEntry==="function" && Array.isArray(LOG) && !!CLOUD.app; }catch(e){}
    if(!da) return;
    const orig=saveEntry;
    window.saveEntry=function(){
      const app=CLOUD.app, key=String(playerName||"").trim().toLowerCase();
      const meine=()=>LOG.filter(e=>String(e.name||"").trim().toLowerCase()===key).map(e=>Object.assign({},e,{app}));
      let vor=null; try{ vor=stand(meine()); }catch(e){}
      const emp=empfohlen(app);
      if(emp && arguments[0] && typeof arguments[0]==="object") arguments[0].empfohlen=true;
      const r=orig.apply(this, arguments);
      try{
        if(vor){ const nach=stand(meine()); if(emp && nach.silber>vor.silber) empfehlungErledigt();
          zeigeUnterschied(vor, nach, playerName, false, true, emp && nach.silber>vor.silber); }
      }catch(e){}
      return r;
    };
  });
  return {stand, bandHTML, verbinde, oeffneAlbum, offenIm, zeigeUnterschied, empfohlen, empfehlungErledigt, ALBEN, GLITZER, PRO_STICKER};
})();
