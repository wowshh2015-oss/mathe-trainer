// ===== Bedienhilfen: Ton, Schriftgröße, eigene Zahlentasten, Vorlesen =====
// Eine kleine Leiste oben rechts auf jeder Kinderseite. Alle Einstellungen gelten für dieses Gerät.
//   🔈 Vorlesen      – liest den Text vor, der gerade wichtig ist (Hilfe, Begrüßung, Tank …)
//   🔇/🔊 Ton        – kurze Töne für richtig/falsch. Startet AUS, damit es im Klassenraum leise bleibt.
//   A  Schriftgröße – drei Stufen
//   🔢 Zahlentasten – auf Tablets und Handys eigene große Tasten statt der Bildschirmtastatur
(function(){
  const lies=(k,d)=>{ try{ const v=localStorage.getItem(k); return v===null?d:v; }catch(e){ return d; } };
  const merke=(k,v)=>{ try{ localStorage.setItem(k,v); }catch(e){} };
  const TOUCH = !!(window.matchMedia && matchMedia("(pointer:coarse)").matches);

  // ---------- Schriftgröße ----------
  const STUFEN=[1,1.15,1.3], NAMEN=["normal","groß","sehr groß"];
  let stufe=+lies("mathe_schrift", (window.innerWidth>=700 ? 1 : 0));
  if(!(stufe>=0 && stufe<STUFEN.length)) stufe=0;
  function setzeSchrift(){ document.documentElement.style.zoom = STUFEN[stufe]===1 ? "" : STUFEN[stufe]; }
  setzeSchrift();

  // ---------- Ton ----------
  let ton = lies("mathe_ton","aus")==="an", ac=null;
  function klang(art){
    if(!ton) return;
    try{
      ac = ac || new (window.AudioContext||window.webkitAudioContext)();
      if(ac.state==="suspended") ac.resume();
      const noten = art==="gut" ? [[660,0,.11],[880,.11,.16]] : art==="ziel" ? [[523,0,.1],[659,.1,.1],[784,.2,.1],[1047,.3,.22]] : [[220,0,.22]];
      noten.forEach(([f,start,dauer])=>{
        const o=ac.createOscillator(), g=ac.createGain(), t=ac.currentTime+start;
        o.type = art==="schlecht" ? "triangle" : "sine"; o.frequency.value=f;
        g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.16,t+0.015); g.gain.exponentialRampToValueAtTime(0.0001,t+dauer);
        o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t+dauer+0.03);
      });
    }catch(e){}
  }
  // Die Trainer färben ihre Rückmeldung grün oder rot – daran erkennt die Leiste richtig und falsch
  function horche(){
    ["feedback","rueck"].forEach(id=>{
      const el=document.getElementById(id); if(!el) return;
      let alt="";
      new MutationObserver(()=>{
        const t=el.textContent.trim(); if(!t || t===alt){ alt=t; return; } alt=t;
        const f=String(el.style.color||"");
        if(/good/.test(f)) klang("gut"); else if(/bad/.test(f)) klang("schlecht"); else if(/gold/.test(f)) klang("ziel");
      }).observe(el,{childList:true,characterData:true,subtree:true});
    });
  }

  // ---------- Vorlesen ----------
  const kannReden = "speechSynthesis" in window;
  function sichtbar(el){ return !!el && el.getClientRects().length>0 && getComputedStyle(el).visibility!=="hidden"; }
  function vorleseText(){
    const kandidaten=[".anmBox",".stBox",".lwBox",".hfBox","#angebot","#tkBox","#hallo","#ergebnis","#result"];
    let el=null;
    for(const s of kandidaten){ const e=document.querySelector(s); if(sichtbar(e)){ el=e; break; } }
    if(!el) el=[...document.querySelectorAll(".card")].find(sichtbar);
    if(!el) return "";
    const kopie=el.cloneNode(true);
    kopie.querySelectorAll("button,svg,input,select,.stTabs,.stGitter,.anmTiere,.chips,.backbtn").forEach(x=>x.remove());
    return String(kopie.innerText||kopie.textContent||"")
      .replace(/[\u{1F000}-\u{1FAFF}\u{2190}-\u{21FF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu," ")
      .replace(/×/g," mal ").replace(/÷/g," geteilt durch ").replace(/−/g," minus ").replace(/\+/g," plus ").replace(/=/g," gleich ")
      .replace(/%/g," Prozent").replace(/·/g,". ").replace(/›/g," ").replace(/\s+/g," ").trim().slice(0,700);
  }
  // Die beste deutsche Stimme, die das Gerät hat. Neuere („natürliche", „erweiterte") Stimmen klingen deutlich weniger nach Roboter.
  let stimmen=[];
  function ladeStimmen(){ try{ stimmen=speechSynthesis.getVoices().filter(v=>/^de/i.test(v.lang)); }catch(e){} }
  if(kannReden){ ladeStimmen(); try{ speechSynthesis.addEventListener("voiceschanged", ladeStimmen); }catch(e){} }
  function stimme(){
    if(!stimmen.length) ladeStimmen();
    const punkte=v=>{ const n=(v.name||"")+" "+(v.voiceURI||""); let p=0;
      if(/natural|neural|premium|enhanced|erweitert|siri/i.test(n)) p+=50;
      if(/online/i.test(n)) p+=20;
      if(/google/i.test(n)) p+=30;
      if(/anna|petra|katja|helena|vicki|marlene|seraphina|amala/i.test(n)) p+=10;
      if(/compact|eloquence|espeak/i.test(n)) p-=40;
      if(/de[-_]DE/i.test(v.lang)) p+=5;
      return p; };
    return stimmen.slice().sort((a,b)=>punkte(b)-punkte(a))[0] || null;
  }
  function vorlesen(knopf){
    if(!kannReden) return;
    if(speechSynthesis.speaking){ speechSynthesis.cancel(); knopf.classList.remove("an"); return; }
    const t=vorleseText(); if(!t) return;
    const u=new SpeechSynthesisUtterance(t); u.lang="de-DE"; u.rate=0.92;
    const st=stimme(); if(st) u.voice=st;
    u.onend=u.onerror=()=>knopf.classList.remove("an");
    knopf.classList.add("an"); speechSynthesis.speak(u);
  }
  addEventListener("pagehide", ()=>{ try{ if(kannReden) speechSynthesis.cancel(); }catch(e){} });

  // ---------- Eigene Zahlentasten ----------
  let padAn = TOUCH && lies("mathe_tasten","an")!=="aus", pad=null, aktiv=null;
  const zahlenfelder=()=>[...document.querySelectorAll('input[inputmode="numeric"],input[data-zahl]')].filter(i=>i.type!=="password");
  function ziel(){
    const a=document.activeElement;
    if(a && a.matches && a.matches('input[data-zahl]') && !a.disabled) return a;
    if(aktiv && document.contains(aktiv) && !aktiv.disabled && sichtbar(aktiv)) return aktiv;
    return zahlenfelder().find(i=>!i.disabled && sichtbar(i)) || null;
  }
  function tippe(t){
    if(t==="ok"){ const w=document.querySelector(".hfBox button, #hilfeWeiter"); if(w){ w.click(); return; } }   // Hilfe offen: OK = Weiter
    const i=ziel(); if(!i) return;
    aktiv=i;
    if(t==="ok"){ i.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",code:"Enter",keyCode:13,which:13,bubbles:true})); return; }
    if(t==="weg") i.value=i.value.slice(0,-1);
    else { const max=+i.getAttribute("maxlength")||6; if(i.value.length<max) i.value+=t; }
    i.dispatchEvent(new Event("input",{bubbles:true}));
  }
  function bauePad(){
    pad=document.createElement("div"); pad.className="kfPad"; pad.setAttribute("aria-label","Zahlentasten");
    pad.innerHTML=["1","2","3","4","5","6","7","8","9","weg","0","ok"].map(t=>
      `<button type="button" data-t="${t}" class="${t==="ok"?"ok":t==="weg"?"weg":""}">${t==="ok"?"OK":t==="weg"?"⌫":t}</button>`).join("");
    pad.addEventListener("pointerdown", e=>{ const b=e.target.closest("button"); if(!b) return; e.preventDefault(); tippe(b.dataset.t); });
  }
  // Die Tasten stehen direkt unter der Zeile mit dem Eingabefeld – nicht am Bildschirmrand kleben.
  // (Am unteren Rand verschwanden sie auf Handys hinter der Leiste des Browsers.)
  function setzePad(feld){
    let el=feld;
    while(el.parentElement && el.parentElement!==document.body && !el.parentElement.classList.contains("card")) el=el.parentElement;
    if(pad.previousElementSibling!==el) el.insertAdjacentElement("afterend", pad);
  }
  function pflegePad(){
    const felder=zahlenfelder();
    if(padAn){
      felder.forEach(i=>{ if(i.getAttribute("inputmode")!=="none"){ i.setAttribute("data-zahl","1"); i.setAttribute("inputmode","none"); } });   // keine Bildschirmtastatur
    }else{
      document.querySelectorAll("input[data-zahl]").forEach(i=>{ i.setAttribute("inputmode","numeric"); i.removeAttribute("data-zahl"); });
    }
    const feld = padAn ? (ziel() || felder.find(i=>sichtbar(i))) : null;
    const zeigen = !!feld && sichtbar(feld);
    if(zeigen && !pad) bauePad();
    if(zeigen) setzePad(feld);
    const warAn = pad && pad.classList.contains("an");
    if(pad) pad.classList.toggle("an", zeigen);
    // Beim Erscheinen so weit blättern, dass auch die unterste Reihe (0 und OK) zu sehen ist
    if(zeigen && !warAn) setTimeout(()=>{ try{ pad.scrollIntoView({block:"nearest", behavior:"smooth"}); }catch(e){} }, 120);
  }
  document.addEventListener("focusin", e=>{ if(e.target && e.target.matches && e.target.matches("input[data-zahl]")) aktiv=e.target; });

  // ---------- Leiste ----------
  function stil(){
    const s=document.createElement("style");
    s.textContent=`
    .kfLeiste{position:fixed;top:8px;right:8px;z-index:2400;display:flex;gap:6px;background:rgba(15,23,42,.88);border:1px solid #334155;border-radius:999px;padding:5px 7px;
      box-shadow:0 4px 14px rgba(0,0,0,.35);font-family:"Segoe UI",system-ui,-apple-system,Arial,sans-serif}
    .kfLeiste button{font-family:inherit;width:40px;height:40px;border-radius:50%;border:2px solid transparent;background:#1e293b;color:#f1f5f9;font-size:19px;font-weight:800;
      cursor:pointer;padding:0;line-height:1;display:flex;align-items:center;justify-content:center}
    .kfLeiste button:hover{border-color:#38bdf8}
    .kfLeiste button.an{border-color:#fbbf24;background:rgba(251,191,36,.18)}
    .kfLeiste button small{font-size:11px;font-weight:800}
    .kfTipp{position:fixed;top:60px;right:8px;z-index:2400;background:#0b1220;border:1px solid #334155;color:#f1f5f9;border-radius:12px;padding:8px 13px;font-size:14px;font-weight:700;
      font-family:"Segoe UI",system-ui,-apple-system,Arial,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.4);pointer-events:none}
    .kfPad{display:none;grid-template-columns:repeat(3,1fr);gap:7px;max-width:400px;margin:14px auto 6px;padding:0}
    .kfPad.an{display:grid}
    .kfPad button{font-family:inherit;font-size:26px;font-weight:800;height:52px;padding:0;border-radius:13px;border:1px solid #475569;background:#1e293b;color:#f1f5f9;cursor:pointer;
      touch-action:manipulation;-webkit-user-select:none;user-select:none}
    .kfPad button:active{background:#38bdf8;color:#042433}
    .kfPad button.ok{background:linear-gradient(180deg,#38bdf8,#0284c7);color:#042433;border:none}
    .kfPad button.weg{background:#0b1220;color:#fca5a5}
    .card{max-width:100%;overflow-x:auto}                 /* breite Tabellen blättern in ihrer Karte, statt die ganze Seite breiter als den Bildschirm zu machen */
    @media print{ .kfLeiste,.kfPad,.kfTipp{display:none!important} }`;
    document.head.appendChild(s);
  }
  let tippZeit=null;
  function sage(t){
    document.querySelectorAll(".kfTipp").forEach(x=>x.remove());
    const d=document.createElement("div"); d.className="kfTipp"; d.textContent=t; document.body.appendChild(d);
    clearTimeout(tippZeit); tippZeit=setTimeout(()=>d.remove(), 1800);
  }
  function baueLeiste(){
    stil();
    const l=document.createElement("div"); l.className="kfLeiste";
    l.innerHTML=(kannReden?`<button type="button" data-k="lesen" title="Vorlesen" aria-label="Vorlesen">🔈</button>`:"")+
      `<button type="button" data-k="ton" title="Ton an oder aus" aria-label="Ton an oder aus"></button>
       <button type="button" data-k="schrift" title="Schriftgröße" aria-label="Schriftgröße">A<small>A</small></button>`+
      (TOUCH?`<button type="button" data-k="tasten" title="Zahlentasten an oder aus" aria-label="Zahlentasten an oder aus">🔢</button>`:"");
    document.body.appendChild(l);
    const zeige=()=>{
      const t=l.querySelector('[data-k="ton"]'); t.textContent=ton?"🔊":"🔇"; t.classList.toggle("an",ton);
      const z=l.querySelector('[data-k="tasten"]'); if(z) z.classList.toggle("an",padAn);
      l.querySelector('[data-k="schrift"]').classList.toggle("an",stufe>0);
    };
    l.addEventListener("click", e=>{
      const b=e.target.closest("button"); if(!b) return;
      const k=b.dataset.k;
      if(k==="lesen") vorlesen(b);
      if(k==="ton"){ ton=!ton; merke("mathe_ton",ton?"an":"aus"); if(ton) klang("gut"); sage(ton?"Ton ist an":"Ton ist aus"); }
      if(k==="schrift"){ stufe=(stufe+1)%STUFEN.length; merke("mathe_schrift",String(stufe)); setzeSchrift(); sage("Schrift: "+NAMEN[stufe]); }
      if(k==="tasten"){ padAn=!padAn; merke("mathe_tasten",padAn?"an":"aus"); pflegePad(); sage(padAn?"Eigene Zahlentasten":"Tastatur des Geräts"); }
      zeige();
    });
    zeige();
  }
  document.addEventListener("DOMContentLoaded", ()=>{
    baueLeiste(); horche();
    if(TOUCH){ pflegePad(); setInterval(pflegePad, 350); }
  });
  window.Komfort={ klang, stimme };
})();
