// ===== Mein Zoo bauen (26.11.2026) =====
// Das Kind gibt seinem Zoo einen Namen, kauft mit den ⭐ aus den Zoo-Runden Gehege, stellt sie auf Lichtungen im Park
// und lässt dort seine Tiere einziehen. 7 Themen × 3 Stufen (Platz für 2 / 4 / 6 Tiere). Bilder: bilder/zoo/ (gemalt von der Lehrkraft).
// Am Anfang sind 5 Lichtungen frei, die übrigen sind zugewachsen und werden mit ⭐ freigeräumt.
// Später: weitere Gebiete (GEBIETE), „Alles zusammen ansehen", Deko, Zoo-Besuch.
// Gespeichert in „ergebnisse" als app:"zoobau" (eine Zeile je Kind und Gerät, die neueste zählt) – das ist KEIN Durchgang.
window.ZooBau=(function(){
  const B="bilder/zoo/";
  const THEMEN=[["wald","🌲","Wald"],["hof","🚜","Bauernhof"],["savanne","🌍","Savanne"],["dschungel","🌴","Dschungel"],["wasser","🐬","Wasserbecken"],["eis","🐧","Eiswelt"],["fabel","✨","Urzeit und Fabelwesen"]];
  const TH={}; THEMEN.forEach(t=>TH[t[0]]=t);
  const STUFE=[null,{n:"einfach",platz:2,preis:20},{n:"schöner",platz:4,preis:40},{n:"prächtig",platz:6,preis:90}];   // preis = Kosten dieser Stufe (Ausbau)
  const KOSTEN=s=>STUFE.slice(1,s+1).reduce((a,x)=>a+x.preis,0);                                                     // 20 / 60 / 150
  // Lichtungen im Park (Bild 1536 × 1024): Mitte x, y und Breite in Pixeln
  const GEBIETE=[{id:"park_1", bild:"park_1.webp", schild:[768,745,300],
    platz:[[322,150,250],[628,148,270],[1052,140,290],[635,300,270],[1020,318,290],[1320,282,270],[195,372,250],[1330,455,290],[650,595,270],[1000,560,300],[270,672,320],[1240,712,330]],
    start:[10,8,9,11,7]}];
  const ZU_PREIS=[30,40,50,60,70,80,90];
  // Wo die Tiere im Gehege stehen (Füße, in % des Gehege-Bildes)
  const ORTE={2:[[37,74],[63,74]],4:[[33,63],[67,63],[33,86],[67,86]],6:[[25,62],[50,62],[75,62],[25,86],[50,86],[75,86]]};
  const themaVon=t=>t[3]==="meer" ? (t[0]==="pinguin" ? "eis" : "wasser") : t[3];
  const T=id=>Zoo.NACH_ID[id];
  const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  // ⭐ aus den Zoo-Runden: je richtige Aufgabe 1, alles richtig +3
  function verdient(rows){ let s=0; (rows||[]).forEach(e=>{ if(e.app!=="zoo") return; const r=+e.richtig||0; s+=r+((+e.falsch===0 && r>=10)?3:0); }); return s; }
  let S=null, el=null;
  const stand=()=>({name:"", platz:{}, frei:[], aus:0});
  function konto(){ return S.verdient - S.z.aus; }
  function sprich(t){ try{ if(!("speechSynthesis" in window)) return; speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang="de-DE"; u.rate=0.92;
    const v=window.Komfort && Komfort.stimme && Komfort.stimme(); if(v) u.voice=v; speechSynthesis.speak(u); }catch(e){} }
  // ---------- Speichern / Laden ----------
  const ts=e=>{ const [t,m,j]=String(e.datum||"01.01.2000").split("."); return `${j}${m}${t}${String(e.zeit||"00:00").replace(":","")}${String(e.sek||"00").padStart(2,"0")}`; };
  function geraet(){ try{ let g=localStorage.getItem("zoobau_geraet"); if(!g){ g=Math.random().toString(36).slice(2,10); localStorage.setItem("zoobau_geraet",g); } return g; }catch(e){ return "x"; } }
  function laden(db,key,name){
    if(!db) return Promise.resolve(null);
    const q=window.Vorrat ? Vorrat.snap(db,key,name,"zoobau") : db.collection("ergebnisse").where("key","==",key).where("app","==","zoobau").where("name","==",name).get();
    return q.then(s=>{ let best=null; s.forEach(d=>{ const x=d.data(); if(!best || ts(x)>ts(best)) best=x; }); return best; }).catch(()=>null); }
  let speicherZeit=null;
  function speichern(){ S.offen=true; clearTimeout(speicherZeit); speicherZeit=setTimeout(()=>{ S&&(S.offen=false); schreib(); }, 900); }
  function schreib(erneut){
    if(!S || !S.db) return; const d=new Date(), p=x=>String(x).padStart(2,"0");
    const e={key:S.key, app:"zoobau", name:S.name, datum:`${p(d.getDate())}.${p(d.getMonth()+1)}.${d.getFullYear()}`, zeit:`${p(d.getHours())}:${p(d.getMinutes())}`, sek:p(d.getSeconds()),
      zooname:S.z.name, platz:JSON.parse(JSON.stringify(S.z.platz)), frei:S.z.frei.slice(), aus:S.z.aus};
    const id=("zoobau_"+S.name+"_"+geraet()).replace(/[\/\s.#\[\]]/g,"_");
    S.db.collection("ergebnisse").doc(id).set(e).catch(err=>{
      if(!erneut && err && err.code==="permission-denied"){ try{ localStorage.removeItem("zoobau_geraet"); }catch(x){} schreib(true); } }); }
  // ---------- Tiere ----------
  function imZoo(){ const z={}; Object.values(S.z.platz).forEach(p=>(p.tiere||[]).forEach(id=>z[id]=(z[id]||0)+1)); return z; }
  function frei(id){ return (S.besitz[id]||0) - (imZoo()[id]||0); }
  function bereinigen(){ // falls Tiere fehlen (z. B. anderes Gerät): überzählige aus den Gehegen nehmen
    const z={}; Object.values(S.z.platz).forEach(p=>{ p.tiere=(p.tiere||[]).filter(id=>{ if(!T(id)) return false; z[id]=(z[id]||0)+1; return z[id]<=(S.besitz[id]||0); }).slice(0,STUFE[p.s].platz); }); }
  // ---------- Darstellung ----------
  function stil(){ if(document.getElementById("zbStil")) return; const s=document.createElement("style"); s.id="zbStil"; s.textContent=`
    #zooBau{position:fixed;inset:0;z-index:2500;background:#f3ead6;overflow:auto;font-family:"Segoe UI",system-ui,-apple-system,Arial,sans-serif;color:#3b2a14;-webkit-user-select:none;user-select:none}
    #zooBau .zbKopf{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:10px 14px;position:sticky;top:0;z-index:5;background:rgba(243,234,214,.96);border-bottom:1px solid #e2d3b0}
    #zooBau .zbKopf h2{margin:0;font-size:21px;flex:1;min-width:160px}
    #zooBau .zbKonto{font-size:20px;font-weight:800;background:#fff7d6;border:2px solid #f2c94c;border-radius:999px;padding:4px 14px}
    #zooBau button{font-family:inherit;font-weight:800;border:0;border-radius:12px;cursor:pointer}
    #zooBau .zbZu{background:#fff;border:2px solid #e2d3b0!important;padding:8px 14px;font-size:16px;color:#3b2a14}
    #zooBau .zbPark{position:relative;z-index:1;isolation:isolate;margin:10px auto 18px;width:min(100% - 16px,(100vh - 90px)*1.5);aspect-ratio:3/2;border-radius:16px;overflow:hidden;box-shadow:0 6px 22px rgba(120,90,50,.25);background:#cfe3a0 center/100% 100% no-repeat}
    #zooBau .zbPlatz{position:absolute;cursor:pointer;touch-action:manipulation}
    #zooBau .zbPlatz.zbBild{pointer-events:none} #zooBau .zbHit{position:absolute;left:8%;right:8%;top:34%;bottom:4%;pointer-events:auto;border-radius:18%}
    #zooBau .zbPlatz>img.g{width:100%;display:block;filter:drop-shadow(0 4px 4px rgba(60,40,10,.25))}
    #zooBau .zbLeer{position:absolute;border:3px dashed rgba(255,255,255,.85);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:clamp(14px,2.2vw,26px);font-weight:900;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.45);background:rgba(255,255,255,.12)}
    #zooBau .zbLeer:hover,#zooBau .zbPlatz:hover>img.g{filter:brightness(1.07) drop-shadow(0 4px 6px rgba(60,40,10,.35))}
    #zooBau .zbPreis{position:absolute;left:50%;bottom:6%;transform:translateX(-50%);background:rgba(59,42,20,.82);color:#fff7d6;border-radius:999px;padding:2px 10px;font-size:clamp(11px,1.5vw,16px);font-weight:800;white-space:nowrap}
    #zooBau .zbTier{position:absolute;width:24%;transform:translate(-50%,-100%);pointer-events:none}
    #zooBau .zbTier img{width:100%;display:block;filter:drop-shadow(0 2px 2px rgba(0,0,0,.3))}
    #zooBau .zbSchild{position:absolute;transform:translate(-50%,-50%);text-align:center;font:800 clamp(12px,2.1vw,30px)/1.1 Georgia,"Times New Roman",serif;color:#4a2c0c;text-shadow:0 1px 0 rgba(255,240,200,.7);cursor:pointer;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
    #zooBau .zbBlatt{position:fixed;left:50%;bottom:0;transform:translateX(-50%);width:min(640px,100%);max-height:72vh;overflow:auto;z-index:10;background:#fffaf0;border:2px solid #e2d3b0;border-bottom:0;border-radius:20px 20px 0 0;box-shadow:0 -8px 30px rgba(80,55,20,.3);padding:16px 18px 22px}
    #zooBau .zbBlatt h3{margin:0 0 8px;font-size:20px;display:flex;align-items:center;gap:8px} #zooBau .zbBlatt h3 .x{margin-left:auto}
    #zooBau .zbBlatt p{margin:6px 0 10px;font-size:15.5px;line-height:1.45}
    #zooBau .zbGross{background:linear-gradient(180deg,#86efac,#22c55e);color:#052e16;font-size:18px;padding:12px 18px}
    #zooBau .zbGross:disabled{background:#e7dcc4;color:#8a7a5c;cursor:default}
    #zooBau .zbRot{background:#fee2e2;color:#991b1b;font-size:15px;padding:9px 14px}
    #zooBau .zbKat{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
    #zooBau .zbKat button{background:#fff;border:2px solid #e2d3b0;padding:8px;color:#3b2a14;font-size:15px;text-align:center}
    #zooBau .zbKat button img{width:100%;display:block;margin-bottom:4px}
    #zooBau .zbKat button small{display:block;font-weight:600;color:#7a6a4c;font-size:12.5px}
    #zooBau .zbKat button:disabled{opacity:.5;cursor:default}
    #zooBau .zbReihe{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0 12px}
    #zooBau .zbT{position:relative;width:74px;background:#fff;border:2px solid #e2d3b0;border-radius:12px;padding:3px;text-align:center;font-size:11.5px;font-weight:700;color:#3b2a14}
    #zooBau .zbT img{width:100%;display:block} #zooBau .zbT.drin{border-color:#22c55e;background:#f0fdf4}
    #zooBau .zbT i{position:absolute;top:-6px;right:-6px;background:#3b2a14;color:#fff;border-radius:999px;font:800 11px/1.6 "Segoe UI",sans-serif;padding:0 6px;font-style:normal}
    #zooBau .zbT.leer{display:flex;align-items:center;justify-content:center;min-height:74px;border-style:dashed;color:#a8987a;font-size:22px}
    #zooBau input.zbName{width:100%;box-sizing:border-box;font:700 20px Georgia,serif;padding:10px 12px;border-radius:12px;border:2px solid #e2d3b0;background:#fff;color:#3b2a14;margin:4px 0 12px}
    #zooBau .zbHinweis{position:fixed;left:50%;top:70px;transform:translateX(-50%);z-index:12;background:#3b2a14;color:#fff7d6;border-radius:14px;padding:10px 16px;font-size:16px;font-weight:700;box-shadow:0 6px 20px rgba(0,0,0,.3);max-width:90vw;text-align:center}
    @keyframes zbRein{0%{transform:scale(.4);opacity:0}70%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
    #zooBau .zbNeu{animation:zbRein .6s cubic-bezier(.2,1.3,.4,1) both}`; document.head.appendChild(s); }
  const G=()=>GEBIETE[0];
  const pct=(v,ges)=>(v/ges*100).toFixed(3)+"%";
  function platzHTML(i){ const [cx,cy,w]=G().platz[i], p=S.z.platz[i], offen=G().start.includes(i)||S.z.frei.includes(i), neu=S.neu===i?" zbNeu":"";
    if(!offen){ const tw=w*1.05, th=tw*0.94;
      return `<div class="zbPlatz zbBild${neu}" data-i="${i}" style="left:${pct(cx-tw/2,1536)};top:${pct(cy-th*0.6,1024)};width:${pct(tw,1536)};z-index:${Math.round(cy)}"><img class="g" src="${B}platz_zu.webp" alt="zugewachsen"><span class="zbHit"></span><span class="zbPreis">🔒 ${zuPreis()} ⭐</span></div>`; }
    if(!p){ const h=w*0.55; return `<div class="zbPlatz zbLeer${neu}" data-i="${i}" style="left:${pct(cx-w/2,1536)};top:${pct(cy-h/2,1024)};width:${pct(w,1536)};height:${pct(h,1024)};z-index:${Math.round(cy)}">＋ Gehege</div>`; }
    const tw=w*1.06, th=tw*0.95, orte=ORTE[STUFE[p.s].platz];
    return `<div class="zbPlatz zbBild${neu}" data-i="${i}" style="left:${pct(cx-tw/2,1536)};top:${pct(cy-th*0.62,1024)};width:${pct(tw,1536)};z-index:${Math.round(cy)}"><img class="g" src="${B}gehege_${p.g}_${p.s}.webp" alt="${esc(TH[p.g][2])}"><span class="zbHit"></span>`+
      (p.tiere||[]).map((id,k)=>`<span class="zbTier" style="left:${orte[k][0]}%;top:${orte[k][1]}%;width:${STUFE[p.s].platz===6?21:24}%"><img src="bilder/heft/sticker_${id}.webp" alt="${esc(T(id)[2])}"></span>`).join("")+`</div>`; }
  function zuPreis(){ const n=S.z.frei.length; return ZU_PREIS[Math.min(n,ZU_PREIS.length-1)]; }
  function zeichne(){
    const g=G(), [sx,sy,sw]=g.schild;
    el.innerHTML=`<div class="zbKopf"><h2>🏞️ ${S.z.name?esc(S.z.name):"Mein Zoo"}</h2><span class="zbKonto" title="Deine Zoo-Sterne">⭐ ${konto()}</span><button class="zbZu" data-zu>✕ Schließen</button></div>
      <div class="zbPark" style="background-image:url(${B}${g.bild})">
        <div class="zbSchild" data-name style="left:${pct(sx,1536)};top:${pct(sy,1024)};width:${pct(sw*0.86,1536)}">${esc(S.z.name||"Mein Zoo")}</div>
        ${g.platz.map((_,i)=>platzHTML(i)).join("")}
      </div>`;
    S.neu=null; }
  function hinweis(t){ el.querySelectorAll(".zbHinweis").forEach(m=>m.remove()); const m=document.createElement("div"); m.className="zbHinweis"; m.textContent=t; el.appendChild(m); setTimeout(()=>m.remove(),2600); }
  function blatt(html){ zu(); const b=document.createElement("div"); b.className="zbBlatt"; b.innerHTML=html; el.appendChild(b); return b; }
  function zu(){ el.querySelectorAll(".zbBlatt").forEach(b=>b.remove()); }
  const kopf=(t)=>`<h3>${t}<button class="zbZu x" data-x>✕</button></h3>`;
  // ---------- Aktionen ----------
  function nameFragen(erst){
    const b=blatt(kopf(erst?"🏞️ Dein eigener Zoo!":"✏️ Name des Zoos")+(erst?`<p>Hier baust du deinen eigenen Zoo. Mit den ⭐ aus deinen Zoo-Runden kaufst du Gehege und lässt deine Tiere einziehen. Du hast schon <b>${konto()} ⭐</b> gesammelt!</p>`:"")+
      `<p><b>Wie soll dein Zoo heißen?</b></p><input class="zbName" maxlength="24" value="${esc(S.z.name||("Zoo "+S.name))}"><button class="zbGross" data-ok>✓ Fertig</button>`);
    const i=b.querySelector("input"); setTimeout(()=>{ try{ i.focus(); i.select(); }catch(e){} },50);
    const ok=()=>{ const v=i.value.replace(/\s+/g," ").trim().slice(0,24); S.z.name=v||("Zoo "+S.name); speichern(); zu(); zeichne(); };
    b.querySelector("[data-ok]").onclick=ok; i.onkeydown=e=>{ if(e.key==="Enter") ok(); }; }
  function freiraeumen(i){ const preis=zuPreis(), kann=konto()>=preis;
    const b=blatt(kopf("🌿 Zugewachsener Platz")+`<p>Hier wächst noch alles wild. Für <b>${preis} ⭐</b> räumst du den Platz frei und kannst dort ein Gehege bauen.</p>
      ${kann?"":`<p>Du hast <b>${konto()} ⭐</b>. Dir fehlen noch <b>${preis-konto()} ⭐</b> – spiel ein paar Zoo-Runden!</p>`}<button class="zbGross" data-ok ${kann?"":"disabled"}>🪓 Freiräumen für ${preis} ⭐</button>`);
    b.querySelector("[data-ok]").onclick=()=>{ if(konto()<preis) return; S.z.aus+=preis; S.z.frei.push(i); S.neu=i; speichern(); zu(); zeichne(); hinweis(`Platz frei! Jetzt kannst du hier ein Gehege bauen.`); }; }
  function katalog(i){
    const b=blatt(kopf("🏗️ Welches Gehege baust du hier?")+`<p>Ein einfaches Gehege kostet <b>${KOSTEN(1)} ⭐</b> und hat Platz für 2 Tiere. Später kannst du es ausbauen. Du hast <b>${konto()} ⭐</b>.</p>
      <div class="zbKat">${THEMEN.map(t=>{ const tiere=Zoo.TIERE.filter(x=>themaVon(x)===t[0]&&S.besitz[x[0]]); return `<button data-g="${t[0]}" ${konto()<KOSTEN(1)?"disabled":""}><img src="${B}gehege_${t[0]}_1.webp" alt="">${t[1]} ${t[2]}<small>${tiere.length?"Für: "+tiere.slice(0,4).map(x=>x[2]).join(", ")+(tiere.length>4?" …":""):"Noch keine Tiere dafür"}</small></button>`; }).join("")}</div>`);
    b.querySelectorAll("[data-g]").forEach(k=>k.onclick=()=>{ if(konto()<KOSTEN(1)) return; S.z.aus+=KOSTEN(1); S.z.platz[i]={g:k.dataset.g,s:1,tiere:[]};
      // passende Tiere ziehen gleich ein (das Kind kann sie danach tauschen)
      const p=S.z.platz[i]; Zoo.TIERE.filter(x=>themaVon(x)===p.g).forEach(x=>{ while(p.tiere.length<STUFE[1].platz && frei(x[0])>0) p.tiere.push(x[0]); });
      S.neu=i; speichern(); zu(); zeichne(); gehege(i); hinweis(`${TH[p.g][1]} Dein ${TH[p.g][2]}-Gehege steht!`); }); }
  function gehege(i){ const p=S.z.platz[i], st=STUFE[p.s], th=TH[p.g], passend=Zoo.TIERE.filter(x=>themaVon(x)===p.g);
    const drin=p.tiere.map((id,k)=>`<button class="zbT drin" data-raus="${k}" title="Antippen: wieder herausnehmen"><img src="bilder/heft/sticker_${id}.webp" alt="">${esc(T(id)[2])}</button>`).join("")+
      Array.from({length:st.platz-p.tiere.length},()=>`<span class="zbT leer">＋</span>`).join("");
    const draussen=passend.filter(x=>frei(x[0])>0).map(x=>`<button class="zbT" data-rein="${x[0]}"><img src="bilder/heft/sticker_${x[0]}.webp" alt="">${esc(x[2])}${frei(x[0])>1?`<i>×${frei(x[0])}</i>`:""}</button>`).join("");
    const naechste=STUFE[p.s+1];
    const b=blatt(kopf(`${th[1]} ${esc(th[2])} · ${st.n}`)+
      `<p><b>Im Gehege</b> (${p.tiere.length} von ${st.platz}) – antippen zum Herausnehmen:</p><div class="zbReihe">${drin}</div>
       <p><b>Deine Tiere, die hier wohnen können</b> – antippen zum Einziehen:</p><div class="zbReihe">${draussen||`<span style="color:#8a7a5c">${passend.some(x=>S.besitz[x[0]])?"Alle deine passenden Tiere wohnen schon im Zoo.":"Du hast noch kein passendes Tier. Spiel Zoo-Runden!"}</span>`}</div>
       ${naechste?`<button class="zbGross" data-aus ${konto()<naechste.preis?"disabled":""}>⬆️ Ausbauen: ${naechste.n}, Platz für ${naechste.platz} Tiere · ${naechste.preis} ⭐</button>`:`<p>🌟 Prächtiger geht es nicht!</p>`}
       <div style="margin-top:12px"><button class="zbRot" data-weg>🔨 Gehege abreißen</button></div>`);
    b.querySelectorAll("[data-raus]").forEach(k=>k.onclick=()=>{ p.tiere.splice(+k.dataset.raus,1); speichern(); zeichne(); gehege(i); });
    b.querySelectorAll("[data-rein]").forEach(k=>k.onclick=()=>{ if(p.tiere.length>=st.platz){ hinweis("Das Gehege ist voll. Bau es aus oder nimm erst ein Tier heraus."); return; }
      p.tiere.push(k.dataset.rein); sprich(T(k.dataset.rein)[2]); speichern(); zeichne(); gehege(i); });
    const aus=b.querySelector("[data-aus]"); if(aus) aus.onclick=()=>{ if(konto()<naechste.preis) return; S.z.aus+=naechste.preis; p.s++; S.neu=i; speichern(); zeichne(); gehege(i); hinweis("⬆️ Ausgebaut! Jetzt ist Platz für "+STUFE[p.s].platz+" Tiere."); };
    b.querySelector("[data-weg]").onclick=()=>{ const zurueck=Math.floor(KOSTEN(p.s)/2);
      const c=blatt(kopf("🔨 Wirklich abreißen?")+`<p>Die Tiere kommen zurück in dein Sammelheft. Du bekommst <b>${zurueck} ⭐</b> zurück (die Hälfte). Danach kannst du hier ein anderes Gehege bauen.</p><button class="zbRot" data-ja>Ja, abreißen</button> <button class="zbZu" data-nein>Nein</button>`);
      c.querySelector("[data-ja]").onclick=()=>{ S.z.aus-=zurueck; delete S.z.platz[i]; speichern(); zu(); zeichne(); };
      c.querySelector("[data-nein]").onclick=()=>gehege(i); }; }
  // ---------- Öffnen ----------
  function oeffnen(o){
    stil(); S={db:o.db, key:o.key, name:o.name, besitz:o.besitz||{}, verdient:verdient(o.rows), z:stand(), zu:o.zu};
    el=document.getElementById("zooBau"); if(el) el.remove();
    el=document.createElement("div"); el.id="zooBau"; el.innerHTML=`<div style="padding:60px;text-align:center;font-size:20px">🏞️ Einen Moment …</div>`; document.body.appendChild(el);
    document.body.style.overflow="hidden";
    el.addEventListener("click", e=>{
      if(e.target.closest("[data-zu]") && !e.target.closest(".zbBlatt")){ schliessen(); return; }
      if(e.target.closest("[data-x]")){ zu(); return; }
      if(e.target.closest("[data-name]")){ nameFragen(false); return; }
      const pl=e.target.closest(".zbPlatz"); if(pl && !e.target.closest(".zbBlatt")){ const i=+pl.dataset.i, offen=G().start.includes(i)||S.z.frei.includes(i);
        if(!offen) freiraeumen(i); else if(!S.z.platz[i]) katalog(i); else gehege(i); } });
    laden(o.db,o.key,o.name).then(d=>{ if(!S) return;
      if(d){ S.z={name:d.zooname||"", platz:d.platz||{}, frei:Array.isArray(d.frei)?d.frei:[], aus:+d.aus||0}; Object.keys(S.z.platz).forEach(k=>{ const p=S.z.platz[k]; if(!p || !TH[p.g] || !(p.s>=1&&p.s<=3)) delete S.z.platz[k]; }); }
      bereinigen(); zeichne(); if(!S.z.name) nameFragen(true); }); }
  function schliessen(){ clearTimeout(speicherZeit); if(S && S.db && S.offen) schreib(); if(el) el.remove(); el=null; document.body.style.overflow=""; const f=S&&S.zu; S=null; if(f) f(); }
  return { oeffnen, schliessen, laden, verdient, THEMEN, GEBIETE, _S:()=>S };
})();
