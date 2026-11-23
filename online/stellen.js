// ===== Stellenwerte legen: Hunderterplatten, Zehnerstangen, Einerwürfel =====
// Nach Walter (2018) / Walter & Schwätzer (2023): Handlung und Vorstellung passen zusammen (Teile legen = Zahl aufbauen),
// Darstellungen sind synchron vernetzt (Material ↔ Stellentafel ↔ Zahl ↔ Zahlwort), Bündeln/Entbündeln als Strukturierungshilfe.
// Benutzt von groessen.js (window.GROESSE="stellen"): Aufgabenart {art:"stellen"} und „Entdecken".
window.Stellen=(function(){
  const FARBE={H:"#4ade80",Z:"#f87171",E:"#60a5fa"}, NAME={H:"Hunderter",Z:"Zehner",E:"Einer"}, EINZ={H:"Hunderterplatte",Z:"Zehnerstange",E:"Einerwürfel"},
        WERT={H:100,Z:10,E:1}, MAX={H:9,Z:20,E:20}, ZUR={E:"Z",Z:"H"}, VON={Z:"E",H:"Z"};
  const wert=s=>(s.H||0)*100+(s.Z||0)*10+(s.E||0);
  const WE=["","eins","zwei","drei","vier","fünf","sechs","sieben","acht","neun","zehn","elf","zwölf","dreizehn","vierzehn","fünfzehn","sechzehn","siebzehn","achtzehn","neunzehn"],
        WZ=["","","zwanzig","dreißig","vierzig","fünfzig","sechzig","siebzig","achtzig","neunzig"];
  function w99(n){ if(n<20) return n===1?"eins":WE[n]; const e=n%10; return (e?(e===1?"ein":WE[e])+"und":"")+WZ[Math.floor(n/10)]; }
  function zahlwort(n){ if(n===0) return "null"; if(n===1000) return "eintausend"; const h=Math.floor(n/100), r=n%100; return (h?(h===1?"ein":WE[h])+"hundert":"")+(r?w99(r):""); }
  // „3 H 14 Z 5 E" – leere Stellen weglassen, aber nie ganz leer
  function kurz(s, spalten){ const t=(spalten||["H","Z","E"]).filter(x=>s[x]).map(x=>`${s[x]} ${x}`); return t.length?t.join(" "):"nichts"; }
  function gebuendelt(s){ return (s.E||0)<10 && (s.Z||0)<10; }

  function stil(){
    if(document.getElementById("stStil")) return;
    const c=document.createElement("style"); c.id="stStil";
    c.textContent=`
    .stWrap{--u:9px;user-select:none;-webkit-user-select:none}
    @media (min-width:600px){ .stWrap{--u:11px} }
    @media (max-width:520px){ .stWrap.drei{--u:7px} .stWrap.drei .stVorrat .stQ{min-width:0;flex:1;padding:7px 4px;font-size:11.5px} }
    .stVorrat .stQ{--u:7px}
    .stBrett{display:flex;gap:8px;background:#0b1220;border:2px solid var(--card2,#334155);border-radius:16px;padding:8px;min-height:calc(var(--u)*10 + 64px)}
    .stBrett.ziel{border-color:#fde68a;box-shadow:0 0 0 3px rgba(253,230,138,.25)}
    .stSp{flex:1 1 0;min-width:0;display:flex;flex-direction:column;border-radius:12px;background:rgba(148,163,184,.06)}
    .stSp[data-s=H]{flex-grow:1.35}
    .stKopf{text-align:center;font-weight:800;font-size:14px;padding:4px 0 2px;border-bottom:2px solid currentColor;margin:0 6px}
    .stKopf small{display:block;font-size:10.5px;font-weight:700;opacity:.85}
    .stFeld{flex:1;display:flex;flex-wrap:wrap;align-content:flex-start;justify-content:center;gap:3px;padding:7px 4px;min-height:calc(var(--u)*10 + 10px);position:relative}
    .stSp[data-s=E] .stFeld{display:grid;grid-template-columns:repeat(5,calc(var(--u) + 1px));gap:2px;justify-content:center;align-content:start}
    .stSp[data-s=E] .stFeld .stE:nth-child(10n+6){}
    .stFeld .stLeer{color:#475569;font-size:12px;align-self:center;text-align:center;width:100%}
    .stH,.stZ,.stE{display:inline-block;flex:none;border-radius:2px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.35)}
    .stE{width:var(--u);height:var(--u);background:${FARBE.E}}
    .stZ{width:var(--u);height:calc(var(--u)*10);background:${FARBE.Z};
      background-image:repeating-linear-gradient(to bottom,transparent 0,transparent calc(var(--u) - 1px),rgba(0,0,0,.35) calc(var(--u) - 1px),rgba(0,0,0,.35) var(--u))}
    .stH{width:calc(var(--u)*10);height:calc(var(--u)*10);background-color:${FARBE.H};
      background-image:repeating-linear-gradient(to bottom,transparent 0,transparent calc(var(--u) - 1px),rgba(0,0,0,.3) calc(var(--u) - 1px),rgba(0,0,0,.3) var(--u)),
                       repeating-linear-gradient(to right,transparent 0,transparent calc(var(--u) - 1px),rgba(0,0,0,.3) calc(var(--u) - 1px),rgba(0,0,0,.3) var(--u))}
    .stSp[data-s=H] .stFeld{display:block;padding:7px 4px}
    .stSp[data-s=H] .stFeld .stH{position:absolute}
    .stFeld .stH,.stFeld .stZ,.stFeld .stE{cursor:pointer}
    .stBrett.fest .stFeld .stH,.stBrett.fest .stFeld .stZ,.stBrett.fest .stFeld .stE{cursor:default}
    .stFuss{display:flex;flex-wrap:wrap;gap:4px;justify-content:center;padding:0 3px 6px;min-height:8px}
    .stFuss button{font-size:12.5px;padding:6px 8px;border-radius:9px;background:#1e293b;color:#e2e8f0;border:1px solid #475569;font-weight:800;line-height:1.15}
    .stFuss button.bu{background:rgba(253,230,138,.16);border-color:#fde68a;color:#fde68a;animation:stPuls 1.4s infinite}
    @keyframes stPuls{50%{box-shadow:0 0 0 4px rgba(253,230,138,.18)}}
    .stVorrat{display:flex;gap:8px;justify-content:center;margin-top:10px;flex-wrap:wrap}
    .stVorrat .stQ{touch-action:none;display:flex;flex-direction:column;align-items:center;gap:5px;background:#0b1220;border:2px dashed #475569;border-radius:14px;padding:8px 10px;cursor:grab;min-width:84px;color:#cbd5e1;font-size:12.5px;font-weight:800}
    .stVorrat .stQ:active{cursor:grabbing;border-color:#fde68a}
    .stVorrat .stQ .bildQ{height:calc(var(--u)*10);display:flex;align-items:center}
    .stGeist{position:fixed;z-index:9999;pointer-events:none;transform:translate(-50%,-50%) scale(1.05);opacity:.9;filter:drop-shadow(0 6px 10px rgba(0,0,0,.5))}
    .stTipp{text-align:center;color:#94a3b8;font-size:12.5px;margin-top:6px}
    .stSync{margin-top:10px;background:#0b1220;border:1px solid var(--card2,#334155);border-radius:14px;padding:10px 12px;text-align:center}
    .stSync table{margin:0 auto 6px;border-collapse:collapse;font-weight:800}
    .stSync th{font-size:15px;padding:2px 14px;border-bottom:2px solid #475569}
    .stSync td{font-size:26px;padding:2px 14px;font-variant-numeric:tabular-nums}
    .stSync td+td,.stSync th+th{border-left:2px solid #475569}
    .stSync td.zuviel{color:#fca5a5}
    .stSync .gl{font-size:15px;color:#cbd5e1} .stSync .zl{font-size:34px;font-weight:900;color:#fde68a;line-height:1.15}
    .stSync .wo{font-size:14.5px;color:#94a3b8;overflow-wrap:anywhere}
    .stSync .warn{font-size:13px;color:#fca5a5;margin-top:3px}
    .stSync button.laut{font-size:13px;padding:5px 10px;margin-left:6px;vertical-align:middle;background:#1e293b;color:#e2e8f0;border:1px solid #475569;border-radius:9px}
    .stBlitz{animation:stBl .6s}
    @keyframes stBl{0%{background:rgba(253,230,138,.35)}100%{background:rgba(148,163,184,.06)}}
    .wahl .stBrett{min-height:0;padding:5px;gap:5px;border:none;background:transparent}
    .wahl .stWrap{--u:6px} .wahl .stKopf{font-size:12px}
    `;
    document.head.appendChild(c);
  }
  function teil(s){ return `<i class="st${s}"></i>`; }
  function feldHTML(s, n){
    if(!n) return `<span class="stLeer">–</span>`;
    if(s==="H") return Array.from({length:n},(_,i)=>`<i class="stH" data-s="H" style="left:calc(50% - var(--u)*5 + ${i*5-((n-1)*5)/2}px);top:${7+i*5}px"></i>`).join("")+`<div style="height:calc(var(--u)*10 + ${(n-1)*5}px)"></div>`;
    return Array.from({length:n},()=>`<i class="st${s}" data-s="${s}"></i>`).join("");
  }
  // Nur ein Bild (zum Ablesen oder als Antwort zum Antippen)
  function bild(s, spalten){
    stil(); spalten=spalten||["H","Z","E"];
    return `<div class="stWrap${spalten.length>2?" drei":""}"><div class="stBrett fest">${spalten.map(x=>`<div class="stSp" data-s="${x}"><div class="stKopf" style="color:${FARBE[x]}">${x}</div><div class="stFeld">${feldHTML(x,s[x]||0)}</div></div>`).join("")}</div></div>`;
  }
  function syncHTML(s, spalten, sprechen){
    const zuviel=spalten.filter(x=>(s[x]||0)>9), n=wert(s);
    const teileT=spalten.filter(x=>s[x]).map(x=>String(s[x]*WERT[x])), gl = teileT.length>1 ? `${kurz(s,spalten)} = ${teileT.join(" + ")} =` : `${kurz(s,spalten)} =`;
    return `<table><tr>${spalten.map(x=>`<th style="color:${FARBE[x]}">${x}</th>`).join("")}</tr><tr>${spalten.map(x=>`<td class="${(s[x]||0)>9?"zuviel":""}" style="${(s[x]||0)>9?"":"color:"+FARBE[x]}">${s[x]||0}</td>`).join("")}</tr></table>`+
      `<div class="gl">${gl}</div><div class="zl">${n}${sprechen?`<button type="button" class="laut" aria-label="Vorlesen">🔈</button>`:""}</div><div class="wo">${zahlwort(n)}</div>`+
      (zuviel.length?`<div class="warn">⚠️ Mehr als 9 ${NAME[zuviel[0]]} – in der Stellentafel steht an jeder Stelle nur <b>eine</b> Ziffer. Bündle sie!</div>`:"");
  }
  function sag(text){
    try{ if(!("speechSynthesis" in window)) return; speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang="de-DE"; u.rate=0.9;
      const v=(window.Komfort && Komfort.stimme) ? Komfort.stimme() : null; if(v) u.voice=v; speechSynthesis.speak(u); }catch(e){}
  }
  // Teil ziehen (oder antippen). onDrop(x,y) nach dem Ziehen, onTap() bei einfachem Antippen.
  function ziehbar(node, onDrop, onTap, darf){
    node.addEventListener("pointerdown", ev=>{
      if(darf && !darf()) return;
      if(ev.button!==undefined && ev.button>0) return;
      ev.preventDefault();
      const sx=ev.clientX, sy=ev.clientY; let geist=null;
      const mv=e=>{ if(!geist && Math.hypot(e.clientX-sx, e.clientY-sy)>7){ geist=document.createElement("div"); geist.className="stGeist stWrap"; geist.innerHTML=node.dataset.geist||node.outerHTML; document.body.appendChild(geist); }
        if(geist){ geist.style.left=e.clientX+"px"; geist.style.top=e.clientY+"px"; } };
      const ende=e=>{ removeEventListener("pointermove",mv); removeEventListener("pointerup",ende); removeEventListener("pointercancel",ende);
        if(geist){ geist.remove(); if(e.type==="pointerup") onDrop(e.clientX, e.clientY); } else if(e.type==="pointerup") onTap(); };
      addEventListener("pointermove",mv); addEventListener("pointerup",ende); addEventListener("pointercancel",ende);
    });
  }
  // Das Legebrett. opt: {spalten, start, live (Stellentafel sofort zeigen), onChange}
  function brett(el, opt){
    stil(); opt=opt||{};
    const spalten=opt.spalten||["H","Z","E"], s={H:0,Z:0,E:0}; Object.assign(s, opt.start||{});
    let gesperrt=false, live=!!opt.live;
    el.innerHTML=`<div class="stWrap${spalten.length>2?" drei":""}"><div class="stBrett"></div>
      <div class="stVorrat">${spalten.map(x=>`<div class="stQ" data-q="${x}" role="button" aria-label="${EINZ[x]} dazulegen" data-geist='${teil(x)}'><span class="bildQ">${teil(x)}</span>${EINZ[x]}</div>`).join("")}</div>
      <div class="stTipp">Ziehe die Teile nach oben – oder tippe sie an. Antippen auf dem Brett legt ein Teil zurück.</div>
      <div class="stSync"${live?"":' style="display:none"'}></div></div>`;
    const B=el.querySelector(".stBrett"), SY=el.querySelector(".stSync");
    const aendere=(x,d)=>{ if(gesperrt) return; const neu=(s[x]||0)+d; if(neu<0 || neu>MAX[x]) return; s[x]=neu; mal(); if(opt.onChange) opt.onChange(Object.assign({},s)); };
    function blitz(x){ const sp=B.querySelector(`.stSp[data-s="${x}"]`); if(sp){ sp.classList.remove("stBlitz"); void sp.offsetWidth; sp.classList.add("stBlitz"); } }
    function mal(){
      B.innerHTML=spalten.map(x=>{
        const knopf=[];
        if(ZUR[x] && spalten.includes(ZUR[x]) && s[x]>=10 && s[ZUR[x]]<MAX[ZUR[x]]) knopf.push(`<button type="button" class="bu" data-bu="${x}">🔗 10 ${NAME[x]} bündeln</button>`);
        if(VON[x] && spalten.includes(VON[x]) && s[x]>=1 && s[VON[x]]<=MAX[VON[x]]-10) knopf.push(`<button type="button" data-ent="${x}">✂️ 1 ${NAME[x]} entbündeln</button>`);
        return `<div class="stSp" data-s="${x}"><div class="stKopf" style="color:${FARBE[x]}">${x}<small>${NAME[x]}</small></div><div class="stFeld">${feldHTML(x,s[x])}</div><div class="stFuss">${knopf.join("")}</div></div>`;
      }).join("");
      B.querySelectorAll(".stFeld [data-s]").forEach(t=>{ const x=t.dataset.s;
        ziehbar(t, (cx,cy)=>{ const r=B.getBoundingClientRect(); if(cx<r.left||cx>r.right||cy<r.top||cy>r.bottom) aendere(x,-1); }, ()=>aendere(x,-1), ()=>!gesperrt); });
      B.querySelectorAll("[data-bu]").forEach(b=>b.addEventListener("click",()=>{ if(gesperrt) return; const x=b.dataset.bu; s[x]-=10; s[ZUR[x]]+=1; mal(); blitz(ZUR[x]); if(opt.onChange) opt.onChange(Object.assign({},s)); }));
      B.querySelectorAll("[data-ent]").forEach(b=>b.addEventListener("click",()=>{ if(gesperrt) return; const x=b.dataset.ent; s[x]-=1; s[VON[x]]+=10; mal(); blitz(VON[x]); if(opt.onChange) opt.onChange(Object.assign({},s)); }));
      if(live) zeigeSync();
    }
    function zeigeSync(){ SY.style.display=""; SY.innerHTML=syncHTML(s, spalten, true); const l=SY.querySelector(".laut"); if(l) l.addEventListener("click",()=>sag(zahlwort(wert(s)))); }
    el.querySelectorAll(".stQ").forEach(q=>{ const x=q.dataset.q;
      ziehbar(q, (cx,cy)=>{ const r=B.getBoundingClientRect(); if(cx>=r.left&&cx<=r.right&&cy>=r.top&&cy<=r.bottom) aendere(x,1); }, ()=>aendere(x,1), ()=>!gesperrt);
      q.addEventListener("pointerenter",()=>{}); });
    mal();
    return {
      get stand(){ return Object.assign({},s); },
      wert:()=>wert(s),
      sperren(){ gesperrt=true; el.querySelectorAll(".stVorrat,.stTipp").forEach(v=>v.style.display="none"); el.querySelectorAll(".stFuss").forEach(v=>v.style.display="none"); },
      zeigeSync,
      setze(neu){ Object.assign(s,{H:0,Z:0,E:0},neu); mal(); },
      lebendig(v){ live=v; if(v) zeigeSync(); else SY.style.display="none"; }
    };
  }
  return {bild, brett, wert, zahlwort, kurz, gebuendelt, sag, stil, NAME, FARBE};
})();
