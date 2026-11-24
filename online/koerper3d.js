// ===== Körper zum Drehen (🔎 Entdecken in „Formen und Körper", 24.11.2026) =====
// Ohne Bibliothek: eigene kleine 3D-Rechnung, gezeichnet als SVG – läuft auch auf alten iPads.
// Mit dem Finger drehen · Ecken / Kanten / Flächen zählen (mit Vorlesen) · Rollen oder Kippen · Würfel und Quader aufklappen (Netz).
window.Koerper3D=(function(){
  const rY=(p,a)=>[p[0]*Math.cos(a)+p[2]*Math.sin(a), p[1], -p[0]*Math.sin(a)+p[2]*Math.cos(a)];
  const rX=(p,a)=>[p[0], p[1]*Math.cos(a)-p[2]*Math.sin(a), p[1]*Math.sin(a)+p[2]*Math.cos(a)];
  const rZ=(p,a)=>[p[0]*Math.cos(a)-p[1]*Math.sin(a), p[0]*Math.sin(a)+p[1]*Math.cos(a), p[2]];
  const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]], add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
  const kreuz=(a,b)=>[a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]], punkt=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
  const norm=a=>{ const l=Math.hypot(a[0],a[1],a[2])||1; return [a[0]/l,a[1]/l,a[2]/l]; };
  const mitte=ps=>ps.reduce((s,p)=>add(s,p),[0,0,0]).map(v=>v/ps.length);
  const LICHT=norm([-0.45,0.75,0.6]);
  function farbe(hex,f){ const n=parseInt(hex.slice(1),16); let r=n>>16, g=n>>8&255, b=n&255;
    const m=x=>Math.round(f<1 ? x*f : x+(255-x)*(f-1)); return `rgb(${m(r)},${m(g)},${m(b)})`; }
  const BUNT=["#60a5fa","#f472b6","#34d399","#fbbf24","#a78bfa","#fb923c"];

  // ---------- Körper als Netz aus Flächen ----------
  function quader(a,b,c){ const v=[[-a,-b,-c],[a,-b,-c],[a,b,-c],[-a,b,-c],[-a,-b,c],[a,-b,c],[a,b,c],[-a,b,c]];
    const f=[[0,1,2,3],[4,5,6,7],[0,1,5,4],[3,2,6,7],[0,3,7,4],[1,2,6,5]];
    return {v, f:f.map((x,i)=>({i:x, g:i, farbe:BUNT[i]})), ecken:true, kanten:true, masse:[a,b,c]}; }
  function pyramide(){ const s=1.1, y=-0.95, v=[[-s,y,-s],[s,y,-s],[s,y,s],[-s,y,s],[0,1.35,0]];
    return {v, f:[[0,1,2,3],[0,1,4],[1,2,4],[2,3,4],[3,0,4]].map((x,i)=>({i:x, g:i, farbe:BUNT[i]})), ecken:true, kanten:true}; }
  function zylinder(){ const r=0.95, h=1.0, n=28, v=[], f=[];
    for(let i=0;i<n;i++){ const w=i/n*2*Math.PI; v.push([r*Math.cos(w),-h,r*Math.sin(w)]); }
    for(let i=0;i<n;i++){ const w=i/n*2*Math.PI; v.push([r*Math.cos(w),h,r*Math.sin(w)]); }
    f.push({i:[...Array(n).keys()], g:0, farbe:"#60a5fa", rand:true}); f.push({i:[...Array(n).keys()].map(i=>i+n), g:1, farbe:"#60a5fa", rand:true});
    for(let i=0;i<n;i++){ const j=(i+1)%n; f.push({i:[i,j,j+n,i+n], g:2, farbe:Math.floor(i/4)%2?"#38bdf8":"#0ea5e9", naht:true}); }
    return {v, f, gruppen:3}; }
  function kegel(){ const r=1.0, y=-0.9, n=28, v=[], f=[];
    for(let i=0;i<n;i++){ const w=i/n*2*Math.PI; v.push([r*Math.cos(w),y,r*Math.sin(w)]); } v.push([0,1.25,0]);
    f.push({i:[...Array(n).keys()], g:0, farbe:"#f472b6", rand:true});
    for(let i=0;i<n;i++) f.push({i:[i,(i+1)%n,n], g:1, farbe:Math.floor(i/4)%2?"#f9a8d4":"#ec4899", naht:true});
    return {v, f, gruppen:2, spitze:n}; }
  function kugel(){ const r=1.15, la=10, lo=18, v=[], f=[];
    for(let a=0;a<=la;a++){ const t=a/la*Math.PI; for(let o=0;o<lo;o++){ const p=o/lo*2*Math.PI; v.push([r*Math.sin(t)*Math.cos(p), r*Math.cos(t), r*Math.sin(t)*Math.sin(p)]); } }
    for(let a=0;a<la;a++) for(let o=0;o<lo;o++){ const o2=(o+1)%lo; f.push({i:[a*lo+o, a*lo+o2, (a+1)*lo+o2, (a+1)*lo+o], g:0, farbe:["#ef4444","#fde047","#3b82f6"][Math.floor(o/3)%3], naht:true}); }
    return {v, f, gruppen:1}; }
  const BAU={"Würfel":()=>quader(1,1,1), "Quader":()=>quader(1.45,0.72,0.95), "Pyramide":pyramide, "Zylinder":zylinder, "Kegel":kegel, "Kugel":kugel};
  function kantenVon(k){ const m=new Map(); k.f.forEach((f,fi)=>f.i.forEach((a,j)=>{ const b=f.i[(j+1)%f.i.length], key=a<b?a+"_"+b:b+"_"+a; if(!m.has(key)) m.set(key,{a:Math.min(a,b), b:Math.max(a,b), f:[]}); m.get(key).f.push(fi); }));
    return [...m.values()]; }

  // ---------- Netz (Würfel/Quader aufklappen): t=0 zu, t=1 flach ----------
  function netzFlaechen(m, t){ const [a,b,c]=m, y0=-b, ph=(1-t)*Math.PI/2, cs=Math.cos(ph), sn=Math.sin(ph), F=[];
    F.push([[-a,y0,-c],[a,y0,-c],[a,y0,c],[-a,y0,c]]);                                          // Boden
    const klapp=(kante, raus, breit, lang)=>{ const d=[raus[0]*cs, sn, raus[2]*cs]; const p2=kante.map(p=>add(p,d.map(x=>x*lang))); return [kante[0],kante[1],p2[1],p2[0]]; };
    F.push(klapp([[-a,y0,c],[a,y0,c]],[0,0,1],a,2*b));                                         // vorne
    const hinten=klapp([[-a,y0,-c],[a,y0,-c]],[0,0,-1],a,2*b); F.push(hinten);                 // hinten
    F.push(klapp([[-a,y0,-c],[-a,y0,c]],[-1,0,0],c,2*b));                                      // links
    F.push(klapp([[a,y0,-c],[a,y0,c]],[1,0,0],c,2*b));                                         // rechts
    // Deckel hängt am oberen Rand der Rückseite. Winkel von +y Richtung −z gemessen: zu = nach vorne (+z), flach = weiter nach hinten (−z)
    const ang=Math.PI*t-Math.PI/2, ty=Math.cos(ang), tz=-Math.sin(ang);
    const p0=hinten[3], p1=hinten[2];
    F.push([p0,p1,add(p1,[0,ty*2*c,tz*2*c]),add(p0,[0,ty*2*c,tz*2*c])]);
    return F; }

  // ---------- Anzeige ----------
  function baue(el, name, opt){
    opt=opt||{}; const sprich=opt.sprich||(()=>{}), zw=opt.zahlwort||(n=>String(n)), art=opt.art||"der";
    let K=BAU[name](), KANTEN=K.kanten?kantenVon(K):[], yaw=0.6, pitch=0.42, zeig=null, schritt=0, lauf=null, welt=null, netzT=null, info="";
    const S=62, D=9;
    const groß=s=>s.charAt(0).toUpperCase()+s.slice(1);
    el.innerHTML=`<div class="k3Wrap"><svg class="k3" viewBox="-170 -150 340 300" role="img" aria-label="${name} zum Drehen"></svg>
      <div class="k3Tipp">👆 Mit dem Finger drehen</div><div class="k3Info"></div><div class="reihe k3Kn"></div></div>`;
    const svg=el.querySelector("svg"), kn=el.querySelector(".k3Kn"), infoEl=el.querySelector(".k3Info");
    const proj=p=>{ let q=rX(rY(p,yaw),pitch); const f=D/(D-q[2]), m=(netzT!==null?0.62:1)*(lauf&&lauf.klein?0.8:1)*S; return [q[0]*m*f, -q[1]*m*f, q[2]]; };
    function zeichne(){
      const V=(welt||K.v).map(proj), roh=(welt||K.v).map(p=>rX(rY(p,yaw),pitch)), zm=mitte(roh);
      let s=""; const flaechen=netzT!==null ? netzFlaechen(K.masse, netzT).map((ps,i)=>({ps:ps.map(proj), roh:ps.map(p=>rX(rY(p,yaw),pitch)), farbe:BUNT[i], g:i, netz:true}))
        : K.f.map((f,fi)=>({ps:f.i.map(i=>V[i]), roh:f.i.map(i=>roh[i]), farbe:f.farbe, g:f.g, fi, naht:f.naht, rand:f.rand}));
      flaechen.forEach(f=>{ let n=norm(kreuz(sub(f.roh[1],f.roh[0]),sub(f.roh[2],f.roh[0]))); if(!f.netz && punkt(n,sub(mitte(f.roh),zm))<0) n=n.map(x=>-x);
        f.n=n; f.vorne=f.netz || n[2]>0; f.z=mitte(f.roh)[2]; });
      const sicht=flaechen.filter(f=>f.vorne).sort((a,b)=>a.z-b.z);
      // Boden-Schatten
      if(lauf && lauf.boden!==undefined){ const g=proj([0,lauf.boden,0]); s+=`<line x1="-165" y1="${g[1].toFixed(1)}" x2="165" y2="${g[1].toFixed(1)}" stroke="#475569" stroke-width="3"/>`; }
      sicht.forEach(f=>{ const hell=0.62+0.5*Math.max(0,punkt(f.n,LICHT)), gelb=zeig==="flaechen" && f.g<schritt;
        const fill=gelb?farbe("#fde047",hell):farbe(f.farbe,hell);
        s+=`<polygon points="${f.ps.map(p=>p[0].toFixed(1)+","+p[1].toFixed(1)).join(" ")}" fill="${fill}" stroke="${f.naht?fill:"#0f172a"}" stroke-width="${f.naht?0.8:2.2}" stroke-linejoin="round"/>`; });
      // Kanten: hinten gestrichelt, vorne durchgezogen (nur eckige Körper)
      if(K.kanten && netzT===null){ KANTEN.forEach((k,ki)=>{ const vorne=k.f.some(fi=>flaechen[fi].vorne), a=V[k.a], b=V[k.b], gelb=zeig==="kanten" && ki<schritt;
          if(!vorne || gelb) s+=`<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" stroke="${gelb?"#facc15":"#0f172a"}" stroke-width="${gelb?6:1.8}" ${vorne?"":'stroke-dasharray="6 5"'} stroke-linecap="round"/>`; }); }
      // Zählen: Nummern
      const nummer=(x,y,i,hinten,c)=>`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="11" fill="${hinten?"rgba(15,23,42,.75)":c}" stroke="${c}" stroke-width="2" ${hinten?'stroke-dasharray="3 2"':""}/><text x="${x.toFixed(1)}" y="${(y+4.5).toFixed(1)}" text-anchor="middle" font-size="13" font-weight="800" fill="${hinten?c:"#0f172a"}">${i}</text>`;
      if(zeig==="ecken"){ const punkte=K.spitze!==undefined?[K.spitze]:[...Array(K.v.length).keys()];
        punkte.slice(0,schritt).forEach((vi,i)=>{ const vorne=K.spitze!==undefined || K.f.some((f,fi)=>f.i.includes(vi)&&flaechen[fi].vorne); s+=nummer(V[vi][0],V[vi][1],i+1,!vorne,"#ef4444"); }); }
      if(zeig==="kanten") KANTEN.slice(0,schritt).forEach((k,i)=>{ const vorne=k.f.some(fi=>flaechen[fi].vorne), a=V[k.a], b=V[k.b]; s+=nummer((a[0]+b[0])/2,(a[1]+b[1])/2,i+1,!vorne,"#facc15"); });
      if(zeig==="flaechen"){ const gr=K.gruppen||K.f.length; for(let g=0; g<Math.min(schritt,gr); g++){ const fs=flaechen.filter(f=>f.g===g), alle=fs.flatMap(f=>f.ps), vorne=fs.some(f=>f.vorne);
          const c=[alle.reduce((x,p)=>x+p[0],0)/alle.length, alle.reduce((x,p)=>x+p[1],0)/alle.length]; s+=nummer(c[0],c[1],g+1,!vorne,"#22c55e"); } }
      svg.innerHTML=s; infoEl.innerHTML=info;
    }
    // ---- Drehen mit dem Finger ----
    let zieh=null;
    svg.addEventListener("pointerdown",ev=>{ if(lauf && lauf.sperre) return; ev.preventDefault(); try{ svg.setPointerCapture(ev.pointerId); }catch(e){} zieh=[ev.clientX,ev.clientY,yaw,pitch]; });
    svg.addEventListener("pointermove",ev=>{ if(!zieh) return; yaw=zieh[2]+(ev.clientX-zieh[0])*0.012; pitch=Math.max(-1.45,Math.min(1.45,zieh[3]+(ev.clientY-zieh[1])*0.012)); zeichne(); });
    const los=()=>{ zieh=null; }; svg.addEventListener("pointerup",los); svg.addEventListener("pointercancel",los);
    // ---- Zählen (Schritt für Schritt, der Körper dreht sich dabei langsam, damit man auch hinten sieht) ----
    function stopp(){ if(lauf){ cancelAnimationFrame(lauf.raf); clearInterval(lauf.iv); lauf=null; } }
    function zaehlen(was, n, wort){
      stopp(); welt=null; netzT=null; zeig=was; schritt=0; zeichne();
      const zahlen=Array.from({length:n},(_,i)=>zw(i+1)).join(", ");
      sprich(`${groß(zahlen)}. ${groß(art)} ${name} hat ${n===1?"eine":zw(n)} ${wort}.`);
      info=`<b>${n}</b> ${wort}`;
      lauf={iv:setInterval(()=>{ schritt++; zeichne(); if(schritt>=n){ clearInterval(lauf.iv); } }, 700), raf:0};
      const t0=performance.now(), y0=yaw, dreh=now=>{ if(!lauf) return; yaw=y0+(now-t0)/1000*0.5; zeichne(); if(now-t0<n*700+1500) lauf.raf=requestAnimationFrame(dreh); };
      lauf.raf=requestAnimationFrame(dreh);
    }
    // ---- Rollen / Kippen ----
    function rollen(){
      stopp(); zeig=null; netzT=null; yaw=0.25; pitch=0.32; info="";
      const dauer=3200, t0=performance.now(); let basis;
      if(name==="Kugel"){ const r=1.15; basis=p=>p; lauf={sperre:true, boden:-r};
        const f=now=>{ const t=Math.min(1,(now-t0)/dauer), x=-1.4+2.8*t, a=x/r*-1; welt=K.v.map(p=>add(rZ(p,a),[x,0,0])); zeichne(); if(t<1) lauf.raf=requestAnimationFrame(f); else ende("Die Kugel rollt in jede Richtung – sie ist überall rund."); };
        lauf.raf=requestAnimationFrame(f); }
      else if(name==="Zylinder"){ const r=0.95; lauf={sperre:true, boden:-r};
        const f=now=>{ const t=Math.min(1,(now-t0)/dauer), x=-1.3+2.6*t, a=-x/r; welt=K.v.map(p=>add(rZ(rX(p,Math.PI/2),a),[x,0,0])); zeichne(); if(t<1) lauf.raf=requestAnimationFrame(f); else ende("Der Zylinder rollt geradeaus – auf seiner gebogenen Fläche. Auf einem Kreis kann er stehen."); };
        lauf.raf=requestAnimationFrame(f); }
      else if(name==="Kegel"){ const H=2.15, r=1.0, g=Math.atan(r/H), apex=K.v[K.spitze]; lauf={sperre:true, boden:-0.6, klein:true}; pitch=0.7;
        const f=now=>{ const t=Math.min(1,(now-t0)/dauer), a=t*Math.PI*1.6; welt=K.v.map(p=>add(rY(rZ(sub(p,apex),Math.PI/2+g),a),[0,-0.6,0])); zeichne(); if(t<1) lauf.raf=requestAnimationFrame(f); else ende("Der Kegel rollt im Kreis – um seine Spitze herum."); };
        lauf.raf=requestAnimationFrame(f); }
      else { // eckige Körper kippen über eine Kante
        let akt=K.v.map(p=>add(p,[-1.2,0,0])); const yb=Math.min(...akt.map(p=>p[1])); lauf={sperre:true, boden:yb};
        const winkel = name==="Pyramide" ? Math.PI*(116.6/180) : Math.PI/2, schritte = name==="Pyramide" ? 1 : 2; let k=0, ts=t0;
        const f=now=>{ const t=Math.min(1,(now-ts)/1200), px=Math.max(...akt.map(p=>p[1]<yb+0.01?p[0]:-99)), piv=[px,yb,0];
          welt=akt.map(p=>add(rZ(sub(p,piv),-winkel*t*t),piv)); zeichne();
          if(t<1){ lauf.raf=requestAnimationFrame(f); return; }
          akt=welt; k++; ts=now; if(k<schritte) lauf.raf=requestAnimationFrame(f);
          else ende(name==="Pyramide" ? "Die Pyramide kippt um und bleibt liegen. Rollen kann sie nicht – sie hat nur flache Flächen." : `${groß(art)} ${name} kippt nur von einer Fläche auf die nächste. Rollen kann ${art==="die"?"sie":"er"} nicht – nur flache Flächen und Kanten.`); };
        lauf.raf=requestAnimationFrame(f); }
      function ende(satz){ info=satz; zeichne(); sprich(satz); setTimeout(()=>{ if(lauf && lauf.sperre){ lauf=null; } }, 300); }
    }
    // ---- Aufklappen ----
    function klappen(){
      stopp(); zeig=null; welt=null; const auf=netzT===null || netzT<0.5, t0=performance.now(), von=netzT===null?0:netzT;
      pitch=0.95; yaw=0.35; lauf={sperre:false};
      const f=now=>{ const t=Math.min(1,(now-t0)/1600); netzT=auf ? von+(1-von)*t : von*(1-t); zeichne();
        if(t<1){ lauf.raf=requestAnimationFrame(f); return; }
        if(!auf) netzT=null; lauf=null; info=auf?`Das ist ein <b>Netz</b> ${art==="der"?"des":"der"} ${name}s: <b>6 Flächen</b>, die man zusammenfalten kann.`:""; zeichne();
        if(auf) sprich(`So sieht das Netz aus. Sechs Flächen. Wenn man sie hochklappt, wird wieder ein ${name} daraus.`);
        knoepfe(); };
      lauf.raf=requestAnimationFrame(f);
    }
    function knoepfe(){
      const eckig=!!K.kanten, B=[];
      if(eckig){ B.push(`<button class="klein" data-a="ecken">🔴 Ecken zählen</button>`, `<button class="klein" data-a="kanten">🟡 Kanten zählen</button>`); }
      else if(K.spitze!==undefined) B.push(`<button class="klein" data-a="ecken">🔴 Spitze zeigen</button>`);
      B.push(`<button class="klein" data-a="flaechen">🟢 Flächen zählen</button>`);
      B.push(`<button class="klein" data-a="rollen">${["Kugel","Zylinder","Kegel"].includes(name)?"🛞 Rollen":"🤸 Rollen?"}</button>`);
      if(K.masse) B.push(`<button class="klein" data-a="netz">${netzT!==null && netzT>0.5?"📦 Zuklappen":"📐 Aufklappen"}</button>`);
      B.push(`<button class="ghost klein" data-a="gerade">↺ Gerade hinstellen</button>`);
      kn.innerHTML=B.join("");
      kn.querySelectorAll("[data-a]").forEach(b=>b.addEventListener("click",()=>{ const a=b.dataset.a;
        if(a==="ecken"){ if(K.spitze!==undefined){ stopp(); welt=null; netzT=null; zeig="ecken"; schritt=1; info="1 Spitze"; zeichne(); sprich("Der Kegel hat eine Spitze."); } else zaehlen("ecken", K.v.length, "Ecken"); }
        if(a==="kanten") zaehlen("kanten", KANTEN.length, "Kanten");
        if(a==="flaechen"){ const n=K.gruppen||K.f.length; zaehlen("flaechen", n, n===1?"Fläche":"Flächen"); }
        if(a==="rollen") rollen();
        if(a==="netz") klappen();
        if(a==="gerade"){ stopp(); welt=null; netzT=null; zeig=null; yaw=0.6; pitch=0.42; info=""; zeichne(); knoepfe(); } }));
    }
    knoepfe(); zeichne();
    return {stopp};
  }
  return {baue, NAMEN:Object.keys(BAU)};
})();
