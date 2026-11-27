// ===== Helles Design „Papier" (26.11.2026) =====
// Eine Kollegin fand den Mathe-Trainer zu dunkel für Kinder. Statt ~2400 Farben in ~50 Dateien einzeln umzuschreiben,
// färbt dieses Skript beim Öffnen alle Stylesheets und style-Attribute um:
//   dunkle Hintergründe/Ränder  -> warmes Papier (Creme/Beige, Farbton der gemalten Bilder)
//   helle Schrift               -> dunkle Schrift im selben Farbton (Gelb -> Braun, Hellblau -> Dunkelblau …)
//   kräftige Farben (Knöpfe, Abzeichen) bleiben, Spielszenen (SVG, Canvas, Bilder) werden nicht angefasst.
// Ausschalten: 🌙 in der Leiste oben rechts (merkt sich das Gerät: localStorage mathe_thema = "dunkel").
// Ein Element samt Inhalt bleibt dunkel mit class="bleibDunkel" (z. B. Nachthimmel in einem Spiel).
(function(){
  const W=window, D=document;
  let thema="hell"; try{ thema=localStorage.getItem("mathe_thema")||"hell"; }catch(e){}
  if(/[?&]thema=dunkel/.test(location.search)) thema="dunkel";
  if(/[?&]thema=hell/.test(location.search)) thema="hell";
  W.Thema={ hell: thema==="hell",
    setze(t){ try{ localStorage.setItem("mathe_thema", t); }catch(e){} location.reload(); } };
  if(thema!=="hell") return;
  const html=D.documentElement; html.classList.add("hell");
  // Bis alles umgefärbt ist: Papier-Hintergrund, Inhalt kurz unsichtbar (höchstens 1,5 s – nie hängen bleiben)
  const vor=D.createElement("style"); vor.id="hellVor";
  vor.textContent="html.hell{background:#f6efe2} html.hell body{visibility:hidden}";
  (D.head||html).appendChild(vor);
  const zeigen=()=>{ const v=D.getElementById("hellVor"); if(v) v.remove(); };
  setTimeout(zeigen, 1500);

  // ---------- Farben ----------
  const NAMEN={white:[255,255,255],black:[0,0,0]};
  function rgbVon(s){ s=s.trim().toLowerCase();
    let m=s.match(/^#([0-9a-f]{3,8})$/);
    if(m){ let h=m[1]; if(h.length===3||h.length===4) h=h.split("").map(c=>c+c).join("");
      return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16), h.length===8?parseInt(h.slice(6,8),16)/255:1]; }
    m=s.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)$/);
    if(m){ let a=m[4]===undefined?1:(m[4].endsWith("%")?parseFloat(m[4])/100:+m[4]); return [+m[1],+m[2],+m[3],a]; }
    if(NAMEN[s]) return NAMEN[s].concat(1);
    return null; }
  function hsl(r,g,b){ r/=255; g/=255; b/=255; const mx=Math.max(r,g,b), mn=Math.min(r,g,b), l=(mx+mn)/2; let h=0, s=0;
    if(mx!==mn){ const d=mx-mn; s=l>.5?d/(2-mx-mn):d/(mx+mn);
      h= mx===r ? (g-b)/d+(g<b?6:0) : mx===g ? (b-r)/d+2 : (r-g)/d+4; h*=60; }
    return [h,s,l]; }
  function rgb(h,s,l){ const k=n=>(n+h/30)%12, a=s*Math.min(l,1-l), f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));
    return [Math.round(f(0)*255),Math.round(f(8)*255),Math.round(f(4)*255)]; }
  const aus=(c,a)=> a>=1 ? `rgb(${c[0]}, ${c[1]}, ${c[2]})` : `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${+a.toFixed(3)})`;
  // Rolle "grund": Hintergrund, Rand, Schatten-Fläche
  function grund(c){ const [r,g,b,a]=c, [h,s,l]=hsl(r,g,b);
    if(a===0) return null;
    // sehr helle, halb durchsichtige Ränder/Flächen (rgba(255,255,255,.08)) -> dunkel durchsichtig
    if(l>.85 && a<.5) return aus([120,90,50], Math.min(.25,a*2.2));
    if(l>=.38 && !(l<.46 && s<.35)) return null;          // kräftige/helle Farben bleiben
    if(s<.45 || (h>=190 && h<=250 && l<.3)){               // Schiefer/Nachtblau -> Papier (warm)
      const L=Math.min(.985, .975 - l*.45);
      return aus(rgb(38, .45, L), a); }
    return aus(rgb(h, Math.min(.75,s*.8), Math.min(.95,.93 - l*.25)), a); }   // dunkles Grün/Rot … -> zarte Tönung
  // Rolle "schrift"
  function schrift(c){ const [r,g,b,a]=c, [h,s,l]=hsl(r,g,b);
    if(l<=.45) return null;
    if(s<.2) return aus(rgb(30, .12, Math.max(.13, Math.min(.42, 1.06-l))), a);   // Weiß/Grau -> Tinte
    return aus(rgb(h, Math.min(.85,s), h>40&&h<70 ? .30 : .33), a); }              // Gelb -> Braun, Hellblau -> Blau
  const FARBE=/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|\b(?:white|black)\b/g;
  function wandle(wert, rolle){ if(!wert || /url\(/.test(wert) && !/gradient/.test(wert)) return wert;
    return wert.replace(FARBE, m=>{ const c=rgbVon(m); if(!c) return m; const n=(rolle==="schrift"?schrift:grund)(c); return n||m; }); }
  function schatten(wert){ return wert.replace(/rgba?\([^)]*\)/g, m=>{ const c=rgbVon(m); if(!c) return m; const [,,l]=hsl(c[0],c[1],c[2]);
    return l<.3 ? aus([120,90,50], Math.min(.18, c[3]*.45)) : m; }); }
  const GRUND=["background","background-color","background-image","border","border-color","border-top","border-right","border-bottom","border-left",
    "border-top-color","border-right-color","border-bottom-color","border-left-color","outline","outline-color","column-rule-color"];
  const SCHRIFT=["color","caret-color","-webkit-text-fill-color","text-decoration-color"];
  const V_SCHRIFT=/^--(text|muted|ink|fg|schrift|tx)/i, V_GRUND=/^--(bg|card|card2|panel|grund|flaeche|glow)/i;
  function stilUm(st){ if(!st) return;
    for(let i=0;i<st.length;i++){ const p=st[i]; const alt=st.getPropertyValue(p); if(!alt) continue; let neu=alt;
      if(p.startsWith("--")){ if(V_SCHRIFT.test(p)) neu=wandle(alt,"schrift"); else if(V_GRUND.test(p)) neu=wandle(alt,"grund"); else continue; }
      else if(SCHRIFT.includes(p)) neu=wandle(alt,"schrift");
      else if(GRUND.includes(p) || p.startsWith("border-") && p.endsWith("-color")) neu=wandle(alt,"grund");
      else if(p==="box-shadow"||p==="text-shadow") neu=schatten(alt);
      else continue;
      if(neu!==alt) st.setProperty(p, neu, st.getPropertyPriority(p)); } }
  // Kurzschreibweisen (background, border) werden in einzelne Eigenschaften zerlegt – die decken die Schleife oben ab.
  const fertigeRegeln=new WeakSet();
  function regelnUm(rules){ if(!rules) return; for(const r of rules){
      if(r.style && !fertigeRegeln.has(r)){ fertigeRegeln.add(r); if(!/(^|[\s,>])(svg|canvas)\b|\.bleibDunkel|\.kopfband|\.klM/.test(r.selectorText||"")) stilUm(r.style); }
      if(r.cssRules) regelnUm(r.cssRules); } }
  const fertigeBlaetter=new WeakSet();
  function blaetterUm(){ for(const sh of D.styleSheets){ if(fertigeBlaetter.has(sh)) { try{ regelnUm(sh.cssRules); }catch(e){} continue; }
      if(sh.ownerNode && sh.ownerNode.id==="hellVor") continue;
      try{ regelnUm(sh.cssRules); fertigeBlaetter.add(sh); }catch(e){} } }
  const verboten=el=>!!(el.closest && el.closest("svg,canvas,.bleibDunkel,.kopfband,.klM"));
  function elementUm(el){ if(el.nodeType!==1 || !el.getAttribute || !el.getAttribute("style") || verboten(el)) return; stilUm(el.style); }
  function baumUm(wurzel){ if(wurzel.nodeType!==1) return; elementUm(wurzel); wurzel.querySelectorAll && wurzel.querySelectorAll("[style]").forEach(elementUm); }
  // Kräftig-helle Schrift, deren Farbe über Variablen kommt (z. B. var(--accent) = Hellgrün): nach dem Zeichnen nachdunkeln
  function kontrast(wurzel){ if(!wurzel || wurzel.nodeType!==1) return;
    const liste=[wurzel, ...wurzel.querySelectorAll("*")];
    for(const el of liste){ if(verboten(el) || el.id==="feedback" || el.id==="rueck" || /^(IMG|SVG|CANVAS|VIDEO|SCRIPT|STYLE|BR)$/i.test(el.nodeName)) continue;
      if(!el.firstChild || ![...el.childNodes].some(n=>n.nodeType===3 && n.textContent.trim())) continue;
      const cs=getComputedStyle(el), c=rgbVon(cs.color); if(!c) continue; const [h,s,l]=hsl(c[0],c[1],c[2]);
      const bg=rgbVon(cs.backgroundColor); if(bg && bg[3]>.6 && hsl(bg[0],bg[1],bg[2])[2]<.5) continue;   // helle Schrift auf eigener dunkler Fläche bleibt
      if(l>.45 && s>.3){ el.style.setProperty("color", aus(rgb(h, Math.min(.85,s), h>40&&h<70 ? .30 : .33), c[3])); } } }
  // (27.11.2026) Zeichnungen (SVG) auf Papier: Zahlenstrahl, Uhr, Diagramme waren für dunklen Grund mit blassen Linien gemalt.
  // Liegt eine Zeichnung auf hellem Grund und hat keine eigene große dunkle Fläche (Spielszene), werden blasse Linien und Beschriftungen dunkel.
  // Kräftige Farben (roter Pfeil, grüne Bögen) und Flächen (Ziffernblatt, Lineal) bleiben.
  const blass=c=>{ const [h,s,l]=hsl(c[0],c[1],c[2]); return c[3]>0 && (l>.74 || (l>.58 && s<.3)); };
  function tinte(c){ const [h,s,l]=hsl(c[0],c[1],c[2]); return s<.2 ? aus(rgb(215,.2,.27),c[3]) : aus(rgb(h, Math.min(.8,s), h>40&&h<70 ? .32 : .36), c[3]); }
  function grundDunkel(el){ for(let e=el.parentElement; e && e!==D.documentElement; e=e.parentElement){
      const b=rgbVon(getComputedStyle(e).backgroundColor); if(b && b[3]>.5) return hsl(b[0],b[1],b[2])[2]<.45; } return false; }
  function svgUm(svg){ try{
    if(!svg.isConnected || (svg.parentElement && svg.parentElement.closest("svg,.bleibDunkel,.kopfband,.klM")) || grundDunkel(svg)) return;
    const box=svg.getBBox(); const flaeche=Math.max(1, box.width*box.height);
    for(const f of svg.querySelectorAll("rect,circle,ellipse,polygon,path")){ const c=rgbVon(f.getAttribute("fill")||"");
      if(c && c[3]>.5 && hsl(c[0],c[1],c[2])[2]<.4){ const b=f.getBBox(); if(b.width*b.height>flaeche*.12) return; } }   // Spielszene mit dunklem Grund
    for(const e of svg.querySelectorAll("*")){
      const st=rgbVon(e.getAttribute("stroke")||""); if(st && blass(st)) e.setAttribute("stroke", tinte(st));
      if(/^(text|tspan)$/i.test(e.nodeName)){ const fi=rgbVon(e.getAttribute("fill")||""); if(fi && blass(fi)) e.setAttribute("fill", tinte(fi)); } }
  }catch(e){} }
  function svgsIn(n){ const s=n.closest ? n.closest("svg") : null; if(s){ let o=s; while(o.parentElement && o.parentElement.closest("svg")) o=o.parentElement.closest("svg"); svgUm(o); return; }
    if(n.querySelectorAll) n.querySelectorAll("svg").forEach(x=>{ if(!x.parentElement.closest("svg")) svgUm(x); }); }
  let kWarte=[], kZeit=null;
  const spaeterKontrast=n=>{ kWarte.push(n); clearTimeout(kZeit); kZeit=setTimeout(()=>{ const l=kWarte; kWarte=[]; l.forEach(x=>{ try{ if(D.contains(x)){ kontrast(x); svgsIn(x); } }catch(e){} }); }, 60); };
  // Feste Ergänzungen, die keine Farbregel erraten kann
  function extra(){ const s=D.createElement("style"); s.id="hellExtra"; s.textContent=`
    html.hell{color-scheme:light}
    html.hell body{background:radial-gradient(1200px 600px at 50% -10%,#fffaf0 0%,#f6efe2 60%) fixed!important;background-color:#f6efe2!important}
    html.hell input,html.hell textarea,html.hell select{color:#1f2937}
    html.hell ::placeholder{color:#a39a8a}
    html.hell #feedback,html.hell #rueck{filter:brightness(.62) saturate(1.3)}   /* richtig/falsch-Farben kommen als var(--good) – die Leiste erkennt daran den Ton */
    html.hell .kfLeiste{background:rgba(255,250,240,.92)!important;border-color:#e6d9bf!important;box-shadow:0 3px 10px rgba(120,90,50,.18)!important}
    html.hell .kfLeiste button{background:#fff!important;color:#1f2937!important}
    html.hell .kfLeiste button.an{background:#fef3c7!important}`;
    D.head.appendChild(s); }
  function los(){ try{ extra(); blaetterUm(); baumUm(D.body); kontrast(D.body); svgsIn(D.body); }catch(e){} zeigen();
    // Später hinzugefügte Stile und Elemente (die Seiten bauen vieles mit JavaScript)
    new MutationObserver(ms=>{ let neueBlaetter=false;
      for(const m of ms){
        if(m.type==="attributes"){ elementUm(m.target); continue; }
        m.addedNodes.forEach(n=>{ if(n.nodeName==="STYLE"||n.nodeName==="LINK") neueBlaetter=true; else if(n.nodeType===1){ baumUm(n); spaeterKontrast(n); } else if(n.nodeType===3 && n.parentNode) spaeterKontrast(n.parentNode); }); }
      if(neueBlaetter) setTimeout(blaetterUm, 0); }).observe(html, {subtree:true, childList:true, attributes:true, attributeFilter:["style"]});
    // <link>-Stylesheets laden asynchron
    addEventListener("load", blaetterUm); }
  if(D.readyState==="loading") D.addEventListener("DOMContentLoaded", los); else los();
})();
