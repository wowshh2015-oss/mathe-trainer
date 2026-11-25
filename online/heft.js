// ===== Mein Tier-Sammelheft (26.11.2026, Idee und Bilder der Lehrkraft) =====
// Die Tiere aus den Zoo-Runden werden zu Stickern. Das Kind öffnet die Sticker-Tüte, blättert zur richtigen Seite
// (Bauernhof, Wald und Wiese, Savanne, Dschungel, Meer und Eis, Urzeit und Fabelwesen) und klebt sie mit dem Finger ein.
// Falsche Seite → der Sticker springt zurück und das richtige Lesezeichen wackelt (Wer wohnt wo?).
// Gespeichert wird in „ergebnisse" als app:"heft" (eine Zeile je Kind und Gerät, die neueste zählt) – das ist KEIN Durchgang
// und wird überall herausgefiltert (Start, Eltern, Lehrkraft, Lernflammen).
// Aufruf: Heft.oeffnen({db, key, name, besitz:{tierId:Anzahl}})
window.Heft=(function(){
  const B="bilder/heft/";
  const SEITEN={hof:"#b45309", wald:"#15803d", savanne:"#ca8a04", dschungel:"#065f46", meer:"#0369a1", fabel:"#7e22ce"};
  const ART={huhn:"das",kueken:"das",schwein:"das",kuh:"die",schaf:"das",ziege:"die",pferd:"das",hase:"der",katze:"die",hund:"der",ente:"die",maus:"die",
    fuchs:"der",igel:"der",frosch:"der",schnecke:"die",marienkaefer:"der",schmetterling:"der",eichhoernchen:"das",wildschwein:"das",hirsch:"der",eule:"die",wolf:"der",baer:"der",adler:"der",
    zebra:"das",kamel:"das",nashorn:"das",giraffe:"die",elefant:"der",krokodil:"das",leopard:"der",loewe:"der",
    affe:"der",schlange:"die",eidechse:"die",fledermaus:"die",koala:"der",panda:"der",gorilla:"der",tiger:"der",
    fisch:"der",blaufisch:"der",kugelfisch:"der",krabbe:"die",schildkroete:"die",pinguin:"der",tintenfisch:"der",delfin:"der",hai:"der",wal:"der",
    langhals:"der",trex:"der",drache:"der",einhorn:"das"};
  const WO={hof:"auf dem Bauernhof", wald:"im Wald und auf der Wiese", savanne:"in der Savanne", dschungel:"im Dschungel", meer:"im Meer und im Eis", fabel:"bei der Urzeit und den Fabelwesen"};
  // Plätze je Seite: Reihen von links nach rechts, Mitte in % der Seite (ruhige Wiese/Wasser in den gemalten Seiten)
  function plaetze(n){
    const reihen = n<=4 ? [n] : n<=8 ? [Math.ceil(n/2), Math.floor(n/2)] : n<=10 ? [5,5] : n<=12 ? [4,4,4] : [4,5,4];
    const ys = reihen.length===1 ? [55] : reihen.length===2 ? [40,70] : [28,53,78], l=[];
    reihen.forEach((k,r)=>{ const rand = k>=5 ? 13 : 20; for(let i=0;i<k;i++) l.push([k===1?50:rand+i*(100-2*rand)/(k-1), ys[r]]); });
    return l;
  }
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const css=`
  #heft{position:fixed;inset:0;z-index:3000;background:radial-gradient(ellipse at top,#3b2f5c,#1e1b2e 70%);color:#f8fafc;overflow-y:auto;overscroll-behavior:contain;
    font-family:"Segoe UI",system-ui,-apple-system,Arial,sans-serif;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-overflow-scrolling:touch}
  #heft .hin{max-width:1000px;margin:0 auto;padding:12px 12px 40px}
  #heft button{font:inherit;font-weight:800;border-radius:14px;border:0;padding:11px 18px;cursor:pointer;color:#f8fafc;background:#334155}
  #heft .gold{background:linear-gradient(180deg,#fde047,#f59e0b);color:#3b2a05;box-shadow:0 4px 0 #b45309}
  #heft .kopf{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;flex-wrap:wrap}
  #heft h2{margin:0;font:900 22px Georgia,serif} #heft .zahl{color:#cbd5e1;font-weight:700;font-size:15px}
  #heft .cover{position:relative;width:min(88vw,460px);aspect-ratio:3/4;margin:8px auto 14px;border-radius:10px 18px 18px 10px;overflow:hidden;cursor:pointer;box-shadow:-8px 0 0 #1e3a8a,0 18px 40px rgba(0,0,0,.55)}
  #heft .cover img{width:100%;height:100%;object-fit:cover;display:block}
  #heft .cover .titel{position:absolute;left:14%;right:14%;top:9%;height:11.5%;display:flex;align-items:center;justify-content:center;text-align:center;
    font:900 clamp(18px,5.4vw,30px)/1.05 Georgia,"Times New Roman",serif;color:#5b2c06;text-shadow:0 1px 0 #fff6}
  #heft .mitte{text-align:center}
  #heft .tuete{position:relative;width:min(60vw,260px);margin:10px auto;cursor:pointer;animation:wackel 1.6s ease-in-out infinite}
  #heft .tuete img{width:100%;display:block;filter:drop-shadow(0 10px 18px rgba(0,0,0,.5))}
  #heft .tuete span{position:absolute;left:18%;right:18%;top:36%;text-align:center;font:900 clamp(18px,5vw,26px)/1.15 Georgia,serif;color:#5b2c06}
  #heft .tuete.auf{animation:platz .5s ease-in forwards}
  @keyframes wackel{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg) scale(1.03)}}
  @keyframes platz{to{transform:scale(1.35);opacity:0}}
  #heft .buch{display:flex;align-items:stretch}
  #heft .seiteBox{flex:1;min-width:0;perspective:1600px}
  /* Seite und Sticker-Reihe müssen zusammen auf den Bildschirm passen (iPad quer): Seite höchstens so hoch wie der Platz */
  #heft .buch{max-width:calc((100vh - 250px) * 1.5 + 130px);margin:0 auto}
  #heft .ablage{max-width:calc((100vh - 250px) * 1.5 + 130px);margin-left:auto;margin-right:auto}
  @media (max-width:700px){ #heft .buch,#heft .ablage{max-width:none} }
  #heft .seite{position:relative;width:100%;aspect-ratio:3/2;border-radius:6px 14px 14px 6px;overflow:hidden;background:#fefce8 center/cover no-repeat;
    box-shadow:inset 10px 0 18px -8px rgba(0,0,0,.35),0 14px 30px rgba(0,0,0,.5);transform-origin:left center}
  #heft .seite.blatt{animation:blatt .55s ease-out} @keyframes blatt{0%{transform:rotateY(-80deg);opacity:.3}100%{transform:none;opacity:1}}
  #heft .stitel{position:absolute;left:2.5%;top:3%;background:rgba(255,255,255,.85);color:#14532d;border-radius:12px;padding:3px 12px;font:900 clamp(12px,2.3vw,19px) Georgia,serif;box-shadow:0 2px 6px rgba(0,0,0,.15)}
  #heft .reiter{display:flex;flex-direction:column;gap:5px;padding-top:12px}
  #heft .reiter button{display:flex;align-items:center;gap:6px;border-radius:0 12px 12px 0;padding:8px 11px 8px 8px;font-size:13px;box-shadow:2px 3px 0 rgba(0,0,0,.25);transform:translateX(-6px);transition:transform .2s;white-space:nowrap}
  #heft .reiter button.an{transform:none;outline:3px solid #fff8;outline-offset:-3px}
  #heft .reiter button.zeig{animation:zeig 1s 2} @keyframes zeig{50%{transform:translateX(8px) scale(1.08)}}
  #heft .reiter .ic{font-size:18px} #heft .reiter small{opacity:.85;font-weight:700}
  @media (max-width:700px){ #heft .buch{flex-direction:column-reverse} #heft .reiter{flex-direction:row;overflow-x:auto;padding:0 0 0 6px}
    #heft .reiter button{border-radius:12px 12px 0 0;transform:translateY(6px);padding:7px 9px} #heft .reiter button.an{transform:none} #heft .reiter .nm{display:none} }
  #heft .platz{position:absolute;width:13.5%;aspect-ratio:1;border-radius:18%;border:2.5px dashed rgba(87,83,78,.55);background:rgba(255,255,255,.3);
    display:flex;align-items:flex-end;justify-content:center;transform:translate(-50%,-50%)}
  #heft .platz .pn{font-size:clamp(8px,1.3vw,11px);font-weight:800;color:#44403c;background:rgba(255,255,255,.75);border-radius:6px;padding:0 5px;margin-bottom:5%}
  #heft .platz.ziel{border-color:#16a34a;background:rgba(134,239,172,.45);border-style:solid}
  #heft .platz .st{position:absolute;inset:-7%}
  #heft .st{touch-action:none;cursor:grab}
  #heft .st img{width:100%;height:100%;object-fit:contain;display:block;filter:drop-shadow(0 3px 4px rgba(0,0,0,.35));pointer-events:none}
  #heft .st.s2 img{filter:drop-shadow(0 0 3px #facc15) drop-shadow(0 0 7px #f59e0b)}
  #heft .st.s3 img{filter:drop-shadow(0 0 4px #f0abfc) drop-shadow(0 0 9px #67e8f9)}
  #heft .st .anz{position:absolute;right:-2px;top:-2px;background:#0f766e;color:#fff;border-radius:999px;font-size:11px;font-weight:900;padding:0 6px}
  #heft .st.klebt{animation:kleb .45s cubic-bezier(.2,1.6,.4,1)} @keyframes kleb{0%{transform:scale(1.35) rotate(-8deg)}100%{transform:none}}
  #heft .ablage{margin-top:14px;background:rgba(15,23,42,.55);border:2px dashed #64748b;border-radius:18px;padding:10px 12px}
  #heft .ablage h3{margin:0 0 8px;font-size:16px} #heft .ablage h3 small{color:#cbd5e1;font-weight:600}
  #heft .reihe{display:flex;gap:10px;flex-wrap:nowrap;overflow-x:auto;overflow-y:hidden;min-height:96px;align-items:center;padding:4px 2px 10px;-webkit-overflow-scrolling:touch}
  #heft .reihe .st{flex:none;touch-action:pan-x}   /* waagrecht wischen = Reihe schieben, nach oben ziehen = einkleben */
  #heft .reihe .st{position:relative;width:84px;height:84px}
  #heft .reihe .st .wo{position:absolute;left:50%;bottom:-6px;transform:translateX(-50%);font-size:10.5px;font-weight:800;background:#0f172a;border-radius:8px;padding:0 6px;white-space:nowrap}
  #heft .reihe .st.neu{animation:rein .6s cubic-bezier(.2,1.5,.4,1) both} @keyframes rein{0%{transform:translateY(-60px) scale(.2) rotate(30deg);opacity:0}100%{transform:none;opacity:1}}
  #heft .geist{position:fixed;z-index:3050;width:96px;height:96px;pointer-events:none;transform:translate(-50%,-50%) scale(1.12) rotate(-4deg)}
  #heft .meldung{position:fixed;left:50%;top:14px;transform:translateX(-50%);background:#0f172a;border:2px solid #fde047;color:#fef9c3;border-radius:14px;padding:10px 16px;font-weight:700;font-size:15px;z-index:3060;max-width:92vw;text-align:center}
  #heft .leise{color:#94a3b8;font-size:13px;text-align:center;margin-top:8px}`;
  let el=null, S=null;   // S: {db,key,name,besitz,platz,gesehen,seite}
  const T=id=>Zoo.NACH_ID[id];                         // [id, emoji, Name, gehege, seltenheit]
  const mitArt=id=>{ const a=ART[id]||"der"; return a.charAt(0).toUpperCase()+a.slice(1)+" "+T(id)[2]; };
  function sprich(t){ try{ if(!("speechSynthesis" in window)) return; speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang="de-DE"; u.rate=0.9;
    const v=window.Komfort && Komfort.stimme && Komfort.stimme(); if(v) u.voice=v; speechSynthesis.speak(u); }catch(e){} }
  function meldung(t){ el.querySelectorAll(".meldung").forEach(m=>m.remove()); const m=document.createElement("div"); m.className="meldung"; m.textContent=t; el.appendChild(m); setTimeout(()=>m.remove(),2800); }
  // ---------- Speichern / Laden ----------
  const ts=e=>{ const [t,m,j]=String(e.datum||"01.01.2000").split("."); return `${j}${m}${t}${String(e.zeit||"00:00").replace(":","")}${String(e.sek||"00").padStart(2,"0")}`; };
  function geraet(){ try{ let g=localStorage.getItem("heft_geraet"); if(!g){ g=Math.random().toString(36).slice(2,10); localStorage.setItem("heft_geraet",g); } return g; }catch(e){ return "x"; } }
  function laden(db,key,name){
    if(!db) return Promise.resolve(null);
    const q=window.Vorrat ? Vorrat.snap(db,key,name,"heft") : db.collection("ergebnisse").where("key","==",key).where("app","==","heft").where("name","==",name).get();
    return q.then(s=>{ let best=null; s.forEach(d=>{ const x=d.data(); if(!best || ts(x)>ts(best)) best=x; }); return best; }).catch(()=>null);
  }
  let speicherZeit=null;
  function speichern(){ clearTimeout(speicherZeit); speicherZeit=setTimeout(schreib, 1200); }
  function schreib(erneut){
    if(!S || !S.db) return; const d=new Date(), p=x=>String(x).padStart(2,"0");
    const e={key:S.key, app:"heft", name:S.name, datum:`${p(d.getDate())}.${p(d.getMonth()+1)}.${d.getFullYear()}`, zeit:`${p(d.getHours())}:${p(d.getMinutes())}`, sek:p(d.getSeconds()),
      platz:Object.assign({},S.platz), gesehen:Object.assign({},S.gesehen)};
    const id=("heft_"+S.name+"_"+geraet()).replace(/[\/\s.#\[\]]/g,"_");
    S.db.collection("ergebnisse").doc(id).set(e).catch(err=>{
      if(!erneut && err && err.code==="permission-denied"){ try{ localStorage.removeItem("heft_geraet"); }catch(x){} schreib(true); } });
  }
  // ---------- Ansichten ----------
  function eingeklebt(){ return Object.keys(S.platz).filter(id=>S.besitz[id]).length; }
  function umschlag(){
    const neu=neueSticker();
    el.querySelector(".hin").innerHTML=`<div class="kopf"><h2>📖 Mein Tier-Sammelheft</h2><button data-zu>✕ Schließen</button></div>
      <div class="cover" data-auf><img src="${B}umschlag.webp" alt=""><div class="titel">Mein Tier-Sammelheft</div></div>
      <div class="mitte"><button class="gold" data-auf>${neu.length?`🎁 ${neu.length} ${neu.length===1?"neuer Sticker":"neue Sticker"} – Heft aufschlagen`:"📖 Heft aufschlagen"}</button>
      <div class="leise">${eingeklebt()} von ${Zoo.TIERE.length} Stickern eingeklebt</div></div>`;
    el.querySelectorAll("[data-auf]").forEach(b=>b.onclick=()=>neu.length ? tuete(neu) : buch());
    el.querySelector("[data-zu]").onclick=schliessen;
  }
  // Neue Sticker = Tiere, die seit dem letzten Öffnen dazugekommen sind
  function neueSticker(){ const l=[]; Object.keys(S.besitz).forEach(id=>{ for(let k=(S.gesehen[id]||0); k<S.besitz[id]; k++) l.push(id); }); return l; }
  function tuete(neu){
    el.querySelector(".hin").innerHTML=`<div class="kopf"><h2>🎁 Deine Sticker-Tüte</h2><button data-zu>✕ Schließen</button></div>
      <div class="tuete" data-reiss><img src="${B}tuete.webp" alt=""><span>${neu.length} ${neu.length===1?"neuer Sticker":"neue Sticker"}</span></div>
      <div class="mitte"><button class="gold" data-reiss>✂️ Tüte aufreißen</button><div class="leise">Tippe auf die Tüte!</div></div>`;
    el.querySelector("[data-zu]").onclick=schliessen;
    el.querySelectorAll("[data-reiss]").forEach(b=>b.onclick=()=>{ const t=el.querySelector(".tuete"); t.classList.add("auf");
      setTimeout(()=>{ S.gesehen=Object.assign({},S.besitz); speichern(); S.frisch=new Set(neu); buch(neu.length?T(neu[0])[3]:null); }, 480); });
  }
  function buch(seite){
    if(seite) S.seite=seite;
    el.querySelector(".hin").innerHTML=`<div class="kopf"><h2>📖 Mein Tier-Sammelheft</h2><span class="zahl" data-zahl></span><button data-zu>✕ Heft zuklappen</button></div>
      <div class="buch"><div class="seiteBox"><div class="seite" data-seite></div></div><div class="reiter" data-reiter></div></div>
      <div class="ablage"><h3>✨ Deine Sticker <small>– zieh sie mit dem Finger auf die richtige Seite. Antippen: Name hören. Die Reihe kannst du zur Seite schieben.</small></h3><div class="reihe" data-reihe></div></div>`;
    el.querySelector("[data-zu]").onclick=()=>umschlag();
    zeigeReiter(); zeigeSeite(true); zeigeAblage();
  }
  function zeigeReiter(){
    el.querySelector("[data-reiter]").innerHTML=Zoo.GEHEGE.map(g=>{ const l=Zoo.TIERE.filter(t=>t[3]===g[0]), da=l.filter(t=>S.platz[t[0]] && S.besitz[t[0]]).length;
      return `<button data-g="${g[0]}" class="${g[0]===S.seite?"an":""}" style="background:${SEITEN[g[0]]}"><span class="ic">${g[1]}</span><span class="nm">${esc(g[2])}</span><small>${da}/${l.length}</small></button>`; }).join("");
    el.querySelectorAll("[data-g]").forEach(b=>b.onclick=()=>{ if(b.dataset.g!==S.seite){ S.seite=b.dataset.g; zeigeSeite(true); zeigeReiter(); } });
  }
  function belegung(){ const b={}; Object.keys(S.platz).forEach(id=>{ if(!S.besitz[id]) return; const [g,n]=String(S.platz[id]).split("|"); if(g===S.seite) b[+n]=id; }); return b; }
  function zeigeSeite(blaettern){
    const g=Zoo.GEHEGE.find(x=>x[0]===S.seite), n=Zoo.TIERE.filter(t=>t[3]===S.seite).length, P=plaetze(n), bel=belegung(), sEl=el.querySelector("[data-seite]");
    sEl.style.backgroundImage=`url(${B}seite_${S.seite}.webp)`;
    sEl.innerHTML=`<div class="stitel">${g[1]} ${esc(g[2])}</div>`+P.map(([x,y],i)=>{ const id=bel[i];
      return `<div class="platz" data-p="${i}" style="left:${x}%;top:${y}%"><span class="pn">${i+1}</span>${id?stickerHTML(id,true):""}</div>`; }).join("");
    sEl.querySelectorAll(".platz .st").forEach(ziehbar);
    if(blaettern){ sEl.classList.remove("blatt"); void sEl.offsetWidth; sEl.classList.add("blatt"); }
    const alle=Zoo.TIERE.filter(t=>t[3]===S.seite), da=alle.filter(t=>S.platz[t[0]] && S.besitz[t[0]]).length;
    el.querySelector("[data-zahl]").textContent=`${g[1]} ${da} von ${alle.length} eingeklebt · insgesamt ${eingeklebt()} von ${Zoo.TIERE.length}`;
  }
  function stickerHTML(id, aufSeite){ const t=T(id), n=S.besitz[id]||0;
    return `<div class="st s${t[4]}" data-id="${id}"><img src="${B}sticker_${id}.webp" alt="${esc(t[2])}">${aufSeite&&n>1?`<span class="anz">×${n}</span>`:""}${aufSeite?"":`<span class="wo">${esc(t[2])}</span>`}</div>`; }
  function zeigeAblage(){
    const offen=Object.keys(S.besitz).filter(id=>S.besitz[id]>0 && !S.platz[id]);
    const r=el.querySelector("[data-reihe]");
    r.innerHTML = offen.length ? offen.map((id,k)=>stickerHTML(id,false).replace('class="st ', `class="st${S.frisch&&S.frisch.has(id)?" neu":""} `).replace("<div ",`<div style="animation-delay:${k*0.1}s" `)).join("")
      : `<span style="color:#94a3b8">Alle deine Sticker sind eingeklebt. Spiel eine Zoo-Runde – dann gibt es neue!</span>`;
    r.querySelectorAll(".st").forEach(ziehbar);
  }
  function ziehbar(node){
    node.addEventListener("pointerdown", ev=>{
      if(ev.button>0) return; ev.preventDefault();
      const id=node.dataset.id, vonPlatz=node.closest(".platz"), von=vonPlatz?+vonPlatz.dataset.p:null, sx=ev.clientX, sy=ev.clientY; let g=null, ziel=null;
      const mv=e=>{ if(!g && Math.hypot(e.clientX-sx,e.clientY-sy)>7){ g=document.createElement("div"); g.className="geist st s"+T(id)[4]; g.innerHTML=`<img src="${B}sticker_${id}.webp" alt="">`; el.appendChild(g); node.style.opacity=".3"; }
        if(!g) return; g.style.left=e.clientX+"px"; g.style.top=e.clientY+"px";
        const u=document.elementFromPoint(e.clientX,e.clientY), p=u&&u.closest("#heft .platz"); if(ziel&&ziel!==p) ziel.classList.remove("ziel"); ziel=p; if(p) p.classList.add("ziel"); };
      const ende=e=>{ removeEventListener("pointermove",mv); removeEventListener("pointerup",ende); removeEventListener("pointercancel",ende);
        node.style.opacity=""; if(ziel) ziel.classList.remove("ziel");
        if(!g){ if(e.type==="pointerup") sprich(mitArt(id)); return; }
        g.remove(); if(e.type!=="pointerup") return;
        const u=document.elementFromPoint(e.clientX,e.clientY), p=u&&u.closest("#heft .platz");
        if(p) klebe(id, +p.dataset.p, von);
        else if(von!==null && !(u&&u.closest("#heft .seite"))){ delete S.platz[id]; speichern(); zeigeSeite(); zeigeAblage(); zeigeReiter(); } };
      addEventListener("pointermove",mv); addEventListener("pointerup",ende); addEventListener("pointercancel",ende);
    });
  }
  function klebe(id, nr, von){
    const t=T(id);
    if(t[3]!==S.seite){
      meldung(`${t[1]} ${mitArt(id)} wohnt ${WO[t[3]]} – blättere zur richtigen Seite!`); sprich(`${mitArt(id)} wohnt ${WO[t[3]]}.`);
      const r=el.querySelector(`[data-g="${t[3]}"]`); if(r){ r.classList.remove("zeig"); void r.offsetWidth; r.classList.add("zeig"); } return; }
    const bel=belegung(), alt=bel[nr];
    if(von!==null){ if(alt) S.platz[alt]=S.seite+"|"+von; }     // auf der Seite umsetzen = tauschen
    else if(alt) delete S.platz[alt];                            // Platz besetzt → der alte Sticker geht zurück in die Ablage
    S.platz[id]=S.seite+"|"+nr; speichern();
    zeigeSeite(); zeigeAblage(); zeigeReiter();
    const neu=el.querySelector(`.platz[data-p="${nr}"] .st`); if(neu) neu.classList.add("klebt");
    const alle=Zoo.TIERE.filter(x=>x[3]===S.seite);
    if(alle.every(x=>S.platz[x[0]] && S.besitz[x[0]])) meldung("🎉 Diese Seite ist voll – super gesammelt!");
  }
  function schliessen(){ if(speicherZeit){ clearTimeout(speicherZeit); schreib(); } try{ speechSynthesis.cancel(); }catch(e){} if(el){ el.remove(); el=null; } document.body.style.overflow=""; if(S&&S.zu) S.zu(); }
  async function oeffnen(o){
    if(!document.getElementById("heftCss")){ const st=document.createElement("style"); st.id="heftCss"; st.textContent=css; document.head.appendChild(st); }
    if(el) el.remove();
    el=document.createElement("div"); el.id="heft"; el.innerHTML=`<div class="hin"><div class="leise" style="margin-top:40px">📖 Einen Moment …</div></div>`; document.body.appendChild(el);
    document.body.style.overflow="hidden";
    const gespeichert=await laden(o.db,o.key,o.name);
    S={db:o.db, key:o.key, name:o.name, besitz:Object.assign({},o.besitz||{}), platz:Object.assign({},(gespeichert&&gespeichert.platz)||{}), zu:o.zu,
       gesehen:Object.assign({},(gespeichert&&gespeichert.gesehen)||{}), seite:"hof", frisch:null};
    if(!gespeichert){ /* erstes Öffnen: alle bisherigen Tiere kommen als eine große Tüte */ }
    umschlag();
  }
  // Wie viele Sticker warten noch? (für den Knopf im Zoo)
  function wartend(gespeichert, besitz){ const g=(gespeichert&&gespeichert.gesehen)||{}; let n=0; Object.keys(besitz||{}).forEach(id=>{ n+=Math.max(0,(besitz[id]||0)-(g[id]||0)); }); return n; }
  return { oeffnen, schliessen, laden, wartend, plaetze, _S:()=>S };
})();
