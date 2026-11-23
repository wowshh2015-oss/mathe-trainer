// ===== 🔎 Entdecken für die älteren Trainer (Einmaleins, Einsdurcheins, Plus, Minus, Zerlegen) =====
// Freies Ausprobieren ohne Bewertung (Walter & Schwätzer: Handlung ↔ Vorstellung, vernetzte Darstellungen, Strukturierungshilfen).
// Hängt eine Karte „Entdecken" unten in die Startkarte #home. Malfeld (·, :) oder Zwanzigerfeld/Hunderterfeld mit Wendeplättchen (+, −, Zerlegen).
(function(){
  const seite=(location.pathname.split("/").pop()||"").replace("-trainer.html","");
  const ART={einmaleins:"mal", einsdurcheins:"teil", plus:"plus", minus:"minus", zerlegen:"zerlegen", platz:"platz"}[seite];
  if(!ART) return;
  const $=id=>document.getElementById(id);
  const WE=["null","eins","zwei","drei","vier","fünf","sechs","sieben","acht","neun","zehn","elf","zwölf","dreizehn","vierzehn","fünfzehn","sechzehn","siebzehn","achtzehn","neunzehn"],
        WZ=["","","zwanzig","dreißig","vierzig","fünfzig","sechzig","siebzig","achtzig","neunzig"];
  const wort=n=>n<20?WE[n]:n===100?"hundert":((n%10?(n%10===1?"ein":WE[n%10])+"und":"")+WZ[Math.floor(n/10)]);
  function sprich(t){ try{ if(!("speechSynthesis" in window)) return; speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(String(t).replace(/­/g,"")); u.lang="de-DE"; u.rate=0.9;
    const v=(window.Komfort && Komfort.stimme)?Komfort.stimme():null; if(v) u.voice=v; speechSynthesis.speak(u); }catch(e){} }
  const css=document.createElement("style");
  css.textContent=`
  .edKarte{display:flex;align-items:center;gap:12px;background:#0b1220;border:2px solid #fde68a;border-radius:14px;padding:12px 14px;margin-top:16px;text-align:left}
  .edKarte .nr{flex:none;width:34px;height:34px;border-radius:50%;background:#334155;display:flex;align-items:center;justify-content:center}
  .edKarte .tx{flex:1;min-width:0} .edKarte .tx b{display:block;font-size:15.5px} .edKarte .tx span{display:block;font-size:12.5px;color:#94a3b8;line-height:1.4}
  .edKarte button,.edFeld button.edK{font-family:inherit;cursor:pointer;border:none;border-radius:12px;font-size:14.5px;font-weight:700;padding:9px 13px;background:#fde68a;color:#1c1917}
  .edFeld{margin-top:10px;text-align:center;user-select:none;-webkit-user-select:none}
  .edFeld .edReihe{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin:8px 0}
  .edFeld button.edK.ghost{background:transparent;color:#e2e8f0;border:2px solid #334155}
  .edFeld svg{display:block;width:100%;max-width:440px;margin:0 auto;height:auto;touch-action:none;background:#0b1220;border:1px solid #334155;border-radius:14px}
  .edPanel{margin-top:10px;background:#0b1220;border:1px solid #334155;border-radius:14px;padding:12px}
  .edGross{font-size:30px;font-weight:900;color:#fde68a;font-variant-numeric:tabular-nums} .edZeile{font-size:16px;color:#e2e8f0;margin:4px 0} .edKlein{font-size:13.5px;color:#94a3b8;line-height:1.45}
  .edTipp{font-size:12.5px;color:#94a3b8;margin-top:6px}
  .edGl{display:flex;align-items:flex-start;justify-content:center;gap:6px;margin:10px 0 4px;flex-wrap:nowrap}
  .edZahl{font-family:inherit;cursor:pointer;background:#0b1220;border:2px solid #334155;border-radius:12px;padding:6px 6px 5px;min-width:78px;display:flex;flex-direction:column;align-items:center;gap:2px;color:#f1f5f9}
  .edZahl .z{font-size:28px;font-weight:900;line-height:1.1} .edZahl .w{font-size:11.5px;font-weight:800;color:#fde68a;white-space:nowrap}
  .edZahl.fehlt{border-color:#fbbf24} .edZahl.gut{border-color:#22c55e;background:rgba(34,197,94,.15)} .edZahl.falsch{border-color:#ef4444;background:rgba(239,68,68,.15)}
  .edOp{font-size:26px;font-weight:900;color:#94a3b8;align-self:center;margin-top:-14px}
  .edFrag{color:#fbbf24} .edBar{display:block;width:100%;max-width:440px;margin:8px auto 2px;height:auto}
  .edMerk{background:#0b1220;border:1px solid #334155;border-radius:12px;padding:8px;margin-top:8px;text-align:left} .edMerkKopf{font-size:14px;color:#cbd5e1;margin-bottom:6px}
  .edKarte2{font-family:inherit;cursor:pointer;display:block;width:100%;text-align:left;background:#1e293b;border:1px solid #475569;border-radius:10px;padding:8px 10px;margin-top:5px;color:#e2e8f0}
  .edKarte2 b{display:block;font-size:16px;color:#fde68a} .edKarte2 span{font-size:13.5px;color:#cbd5e1}
  @media (max-width:430px){ .edZahl{min-width:66px} .edZahl .z{font-size:24px} .edZahl .w{font-size:10.5px} }
  @media (max-width:520px){ .edKarte{flex-wrap:wrap} .edKarte .tx{flex-basis:calc(100% - 50px)} .edKarte button{margin-left:46px} }`;
  document.head.appendChild(css);
  const TEXT={mal:"Tippe im Punktefeld auf einen Punkt – so groß wird deine Malaufgabe. Dann kannst du sie zerlegen wie 7 · 6 = 5 · 6 + 2 · 6.",
              teil:"Wie oft passt die 6 in 42? Tippe auf einen Punkt – das Punktefeld zeigt Reihen. So siehst du Mal- und Geteiltaufgabe zusammen.",
              plus:"Leg Wendeplättchen ins Zwanzigerfeld: rot und blau. Mit „Ordnen“ siehst du, wie du über die 10 rechnest.",
              minus:"Leg Plättchen ins Feld und streiche welche weg. Mit „Ordnen“ siehst du, wie viele übrig bleiben.",
              zerlegen:"Leg Plättchen ins Feld – rot und blau. So siehst du, wie man eine Zahl in zwei Teile zerlegt.",
              platz:"Wie findest du die fehlende Zahl? Und wie heißen die Zahlen? Mit Merkkarten und einem Fachwörter-Spiel."}[ART];
  function einbauen(){
    const home=$("home")||$("menue"); if(!home || $("edBtn")) return;
    const merk = ART==="platz" ? home.querySelector("details.merk") : null;
    (merk ? (h=>merk.insertAdjacentHTML("afterend",h)) : (h=>home.insertAdjacentHTML("beforeend",h)))(`<div class="edKarte"><span class="nr">🔎</span><span class="tx"><b>Entdecken</b><span>${TEXT} Hier gibt es keine Fehler.</span></span><button id="edBtn">Ausprobieren</button></div><div id="edFeld" class="edFeld" style="display:none"></div>`);
    $("edBtn").addEventListener("click",()=>{ const f=$("edFeld"), zu=f.style.display!=="none"; f.style.display=zu?"none":""; $("edBtn").textContent=zu?"Ausprobieren":"Schließen";
      if(zu) try{ speechSynthesis.cancel(); }catch(e){}
      if(!zu && !f.dataset.an){ f.dataset.an="1"; (ART==="mal"||ART==="teil" ? malfeld : ART==="platz" ? platz : plaettchen)(f); } });
  }
  // ---------- Malfeld: 10 × 10 Punkte, ein Rechteck auswählen, zerlegen, tauschen ----------
  function malfeld(f){
    let a=7, b=6, teil=5, zerlegt=false;            // a Reihen, b Punkte pro Reihe
    const P=30, R0=22;                                // Abstand der Punkte, Rand
    const mal=()=>{
      if(teil>=a) teil=Math.max(1,a-1); if(a<2) zerlegt=false;
      let s=""; for(let r=0;r<10;r++) for(let c=0;c<10;c++){ const drin=r<a&&c<b, oben=r<teil;
        const farbe=!drin?"#334155":zerlegt?(oben?"#60a5fa":"#f472b6"):"#fbbf24";
        s+=`<circle cx="${R0+c*P}" cy="${R0+r*P}" r="${drin?10:6}" fill="${farbe}" data-r="${r}" data-c="${c}"/>`; }
      s+=`<line x1="${R0+4.5*P}" y1="6" x2="${R0+4.5*P}" y2="${R0+9.5*P}" stroke="#475569" stroke-width="1" stroke-dasharray="3 4"/><line x1="6" y1="${R0+4.5*P}" x2="${R0+9.5*P}" y2="${R0+4.5*P}" stroke="#475569" stroke-width="1" stroke-dasharray="3 4"/>`;
      s+=`<path d="M${R0-15} ${R0+a*P-15} H${R0+b*P-15} V${R0-15}" fill="none" stroke="#e2e8f0" stroke-width="3" stroke-linejoin="round"/>`;
      if(zerlegt) s+=`<line x1="${R0-15}" y1="${R0+teil*P-15}" x2="${R0+b*P-15}" y2="${R0+teil*P-15}" stroke="#fde68a" stroke-width="3" stroke-dasharray="6 4"/>`;
      const n=a*b, z = zerlegt ? `${a} · ${b} = ${teil} · ${b} + ${a-teil} · ${b} = ${teil*b} + ${(a-teil)*b} = <b>${n}</b>` : "";
      f.innerHTML=`<svg id="edSvg" viewBox="0 0 ${R0*2+9*P} ${R0*2+9*P}" role="img" aria-label="Punktefeld">${s}</svg>
        <div class="edTipp">Tippe auf einen Punkt (oder zieh mit dem Finger) – der weiße Winkel zeigt deine Aufgabe.</div>
        <div class="edReihe"><button class="edK${zerlegt?"":" ghost"}" id="edZer">✂️ Zerlegen ${zerlegt?"an":"aus"}</button>${zerlegt?`<button class="edK ghost" id="edT1">Linie ↑</button><button class="edK ghost" id="edT2">Linie ↓</button>`:""}<button class="edK ghost" id="edTausch">🔄 Tauschaufgabe</button></div>
        <div class="edPanel">${ART==="mal"
          ? `<div class="edGross">${a} · ${b} = ${n}</div><div class="edZeile">${a} Reihen mit je ${b} Punkten</div>${z?`<div class="edZeile">${z}</div>`:""}<div class="edKlein">Tauschaufgabe: ${b} · ${a} = ${n} – gleich viele Punkte, nur gedreht.</div>`
          : `<div class="edGross">${n} : ${b} = ${a}</div><div class="edZeile">${n} Punkte, immer ${b} in einer Reihe → <b>${a} Reihen</b></div><div class="edKlein">Die Malaufgabe dazu: ${a} · ${b} = ${n}. Und auch: ${n} : ${a} = ${b}.</div>${z?`<div class="edZeile">${z}</div>`:""}`}
          <div class="edReihe"><button class="edK ghost" id="edLaut">🔈 Vorlesen</button></div></div>`;
      const svg=$("edSvg"), wahl=ev=>{ const r=$("edSvg").getBoundingClientRect(), k=(R0*2+9*P)/r.width, x=(ev.clientX-r.left)*k, y=(ev.clientY-r.top)*k;
        const c=Math.max(0,Math.min(9,Math.round((x-R0)/P))), rr=Math.max(0,Math.min(9,Math.round((y-R0)/P))); if(rr+1!==a || c+1!==b){ a=rr+1; b=c+1; if(teil>=a) teil=a>5?5:Math.max(1,Math.floor(a/2)); mal(); return true; } return false; };
      svg.addEventListener("pointerdown", ev=>{ ev.preventDefault(); try{ svg.setPointerCapture(ev.pointerId); }catch(x){} wahl(ev);
        const mv=e2=>{ wahl(e2); }, up=()=>{ document.removeEventListener("pointermove",mv); document.removeEventListener("pointerup",up); laut(); };
        document.addEventListener("pointermove",mv); document.addEventListener("pointerup",up); });
      $("edZer").addEventListener("click",()=>{ zerlegt=!zerlegt; if(zerlegt) teil=a>5?5:Math.max(1,Math.floor(a/2)); mal(); });
      if($("edT1")) $("edT1").addEventListener("click",()=>{ if(teil>1){ teil--; mal(); } });
      if($("edT2")) $("edT2").addEventListener("click",()=>{ if(teil<a-1){ teil++; mal(); } });
      $("edTausch").addEventListener("click",()=>{ [a,b]=[b,a]; mal(); laut(); });
      $("edLaut").addEventListener("click",laut);
    };
    const laut=()=>sprich(ART==="mal" ? `${wort(a)} mal ${wort(b)} ist ${wort(a*b)}.` : `${wort(a*b)} geteilt durch ${wort(b)} ist ${wort(a)}.`);
    mal();
  }
  // ---------- Zwanzigerfeld / Hunderterfeld mit Wendeplättchen ----------
  function plaettchen(f){
    let gross=false, feld=Array(20).fill(0), farbe=1;     // 0 leer, 1 rot, 2 blau
    const mal=()=>{
      const n=gross?100:20, sp=10, P=gross?27:32, R=gross?11:13, W=sp*P+20+(gross?0:8), H=(n/sp)*P+20+(gross?8:0);
      let s="";
      for(let i=0;i<n;i++){ const r=Math.floor(i/sp), c=i%sp, x=14+c*P+(c>=5?8:0)+P/2-2, y=12+r*P+(gross&&r>=5?8:0)+P/2-2, v=feld[i];
        s+=`<rect x="${x-P/2+2}" y="${y-P/2+2}" width="${P-4}" height="${P-4}" rx="5" fill="rgba(0,0,0,0)" pointer-events="all" stroke="#334155" stroke-width="1.2" data-i="${i}"/>`;
        if(v) s+=`<circle cx="${x}" cy="${y}" r="${R}" fill="${v===1?"#ef4444":"#3b82f6"}" stroke="#0f172a" stroke-width="1.5" data-i="${i}"/>`+(ART==="minus"&&v===2?`<path d="M${x-R+3} ${y-R+3} L${x+R-3} ${y+R-3} M${x+R-3} ${y-R+3} L${x-R+3} ${y+R-3}" stroke="#fde68a" stroke-width="2.5" data-i="${i}"/>`:""); }
      const rot=feld.filter(v=>v===1).length, blau=feld.filter(v=>v===2).length, alle=rot+blau;
      let gross1, zeile, klein;
      if(ART==="plus"){ gross1=`${rot} + ${blau} = ${alle}`; zeile=`${rot} rote und ${blau} blaue Plättchen sind zusammen <b>${alle}</b>.`;
        klein = rot<10 && alle>10 ? `Über die 10: ${rot} + <b>${10-rot}</b> = 10, dann noch ${blau-(10-rot)} dazu = ${alle}.` : alle===10 ? "Genau 10 – ein voller Zehner!" : ""; }
      else if(ART==="minus"){ gross1=`${alle} − ${blau} = ${rot}`; zeile=`Von <b>${alle}</b> Plättchen sind ${blau} weggestrichen. Übrig bleiben <b>${rot}</b>.`;
        klein = alle>10 && rot<10 && blau>0 ? `Über die 10: ${alle} − <b>${alle-10}</b> = 10, dann noch ${blau-(alle-10)} weg = ${rot}.` : ""; }
      else { gross1=`${alle} = ${rot} + ${blau}`; zeile=`<b>${alle}</b> zerlegt in ${rot} rote und ${blau} blaue Plättchen.`; klein = alle===10 ? `Immer 10: ${rot} und ${blau} sind <b>verliebte Zahlen</b>.` : ""; }
      f.innerHTML=`<div class="edReihe"><button class="edK${gross?" ghost":""}" data-g="0">Zwanzigerfeld</button><button class="edK${gross?"":" ghost"}" data-g="1">Hunderterfeld</button></div>
        <svg id="edSvg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Plättchenfeld">${s}</svg>
        <div class="edTipp">Tippe auf ein Feld: leer → rot → ${ART==="minus"?"weggestrichen":"blau"} → leer. Du kannst auch mit dem Finger über die Felder wischen – oder mit mehreren Fingern gleichzeitig tippen.</div>
        <div class="edReihe"><button class="edK ghost" id="edOrd">✨ Ordnen</button><button class="edK ghost" id="edWende">🔄 Alle wenden</button><button class="edK ghost" id="edLeer">Alles weg</button></div>
        <div class="edPanel"><div class="edGross">${gross1}</div><div class="edZeile">${zeile}</div>${klein?`<div class="edKlein">${klein}</div>`:""}
          <div class="edReihe"><button class="edK ghost" id="edLaut">🔈 Vorlesen</button></div></div>`;
      const svg=$("edSvg");
      const zelle=ev=>{ const t=document.elementFromPoint(ev.clientX, ev.clientY); const sv=$("edSvg"); return t && t.dataset && t.dataset.i!==undefined && sv && sv.contains(t) ? +t.dataset.i : null; };
      svg.addEventListener("pointerdown", ev=>{ ev.preventDefault(); const i=zelle(ev); if(i===null) return; const neu=(feld[i]+1)%3; farbe=neu; feld[i]=neu; mal();
        const besucht=new Set([i]); const mv=e2=>{ if(e2.pointerId!==ev.pointerId) return; const j=zelle(e2); if(j!==null && !besucht.has(j)){ besucht.add(j); feld[j]=farbe; mal(); } };
        const up=e2=>{ if(e2.pointerId!==ev.pointerId) return; document.removeEventListener("pointermove",mv); document.removeEventListener("pointerup",up); };
        document.addEventListener("pointermove",mv); document.addEventListener("pointerup",up); });
      f.querySelectorAll("[data-g]").forEach(b=>b.addEventListener("click",()=>{ const g=b.dataset.g==="1"; if(g===gross) return; gross=g; const alt=feld; feld=Array(g?100:20).fill(0); alt.slice(0,feld.length).forEach((v,i)=>feld[i]=v); mal(); }));
      $("edOrd").addEventListener("click",()=>{ const r=feld.filter(v=>v===1).length, bl=feld.filter(v=>v===2).length; feld=feld.map((v,i)=>i<r?1:i<r+bl?2:0); mal(); });
      $("edWende").addEventListener("click",()=>{ feld=feld.map(v=>v===1?2:v===2?1:0); mal(); });
      $("edLeer").addEventListener("click",()=>{ feld=feld.map(()=>0); mal(); });
      $("edLaut").addEventListener("click",()=>{ const r=feld.filter(v=>v===1).length, bl=feld.filter(v=>v===2).length, al=r+bl;
        sprich(ART==="plus" ? `${wort(r)} plus ${wort(bl)} ist ${wort(al)}.` : ART==="minus" ? `${wort(al)} minus ${wort(bl)} ist ${wort(r)}.` : `${wort(al)} ist ${wort(r)} und ${wort(bl)}.`); });
    };
    mal();
  }
  // ---------- Fehlende Zahl: Teil-Teil-Ganzes, die Regeln aus dem Unterricht, Fachwörter (Merkkarten + Spiel) ----------
  const ZCH={"+":"+","-":"−","*":"×","/":"÷"};
  const FW={"+":["Summand","Summand","Summe"],"-":["Minuend","Subtrahend","Differenz"],"*":["Faktor","Faktor","Produkt"],"/":["Dividend","Divisor","Quotient"]};
  const FWART={Summand:"der",Summe:"die",Minuend:"der",Subtrahend:"der",Differenz:"die",Faktor:"der",Produkt:"das",Dividend:"der",Divisor:"der",Quotient:"der"};
  const AKK={Summand:"einen Summanden",Summe:"die Summe",Minuend:"den Minuenden",Subtrahend:"den Subtrahenden",Differenz:"die Differenz",Faktor:"einen Faktor",Produkt:"das Produkt",Dividend:"den Dividenden",Divisor:"den Divisor",Quotient:"den Quotienten"};
  const MERK={Summand:"Die Summanden werden <b>zusammengezählt</b>. Sie sind die Teile.", Summe:"Die Summe ist das <b>Ergebnis bei Plus</b> – das Ganze.",
    Minuend:"Der Minuend steht <b>vorn</b>. Von ihm wird etwas weggenommen.", Subtrahend:"Der Subtrahend wird <b>abgezogen</b> – er steht hinter dem Minus.", Differenz:"Die Differenz ist das <b>Ergebnis bei Minus</b> – der Unterschied.",
    Faktor:"Die Faktoren werden <b>malgenommen</b>.", Produkt:"Das Produkt ist das <b>Ergebnis bei Mal</b>.",
    Dividend:"Der Dividend steht <b>vorn</b>. Er wird geteilt.", Divisor:"Der Divisor <b>teilt</b> – er steht hinter dem Geteiltzeichen.", Quotient:"Der Quotient ist das <b>Ergebnis beim Teilen</b>."};
  const REGEL={"+0":"Bei <b>Plus</b> fehlt ein Summand. Rechne: <b>Summe minus die Zahl, die du kennst</b>.","+1":"Bei <b>Plus</b> fehlt ein Summand. Rechne: <b>Summe minus die Zahl, die du kennst</b>.",
    "-0":"Bei <b>Minus</b> fehlt die <b>erste, große Zahl</b> (der Minuend). Rechne: <b>Ergebnis plus die zweite Zahl</b>.","-1":"Bei <b>Minus</b> fehlt die <b>zweite Zahl</b> (der Subtrahend). Rechne: <b>erste Zahl minus Ergebnis</b>.",
    "*0":"Bei <b>Mal</b> fehlt ein Faktor. Rechne: <b>Produkt geteilt durch die Zahl, die du kennst</b>.","*1":"Bei <b>Mal</b> fehlt ein Faktor. Rechne: <b>Produkt geteilt durch die Zahl, die du kennst</b>.",
    "/0":"Bei <b>Geteilt</b> fehlt die <b>erste, große Zahl</b> (der Dividend). Rechne: <b>Ergebnis mal die zweite Zahl</b>.","/1":"Bei <b>Geteilt</b> fehlt die <b>zweite Zahl</b> (der Divisor). Rechne: <b>erste Zahl geteilt durch das Ergebnis</b>."};
  const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), aus=l=>l[rnd(0,l.length-1)];
  const groß=s=>s.charAt(0).toUpperCase()+s.slice(1);
  function zahlen(op){ let a,b; for(let i=0;i<200;i++){
      if(op==="+"){ a=rnd(5,60); b=rnd(3,Math.min(39,99-a)); } else if(op==="-"){ a=rnd(20,99); b=rnd(3,a-4); } else if(op==="*"){ a=rnd(2,9); b=rnd(2,9); } else { b=rnd(2,9); a=b*rnd(2,9); }
      const c=op==="+"?a+b:op==="-"?a-b:op==="*"?a*b:a/b; if(a!==b&&a!==c&&b!==c) return [a,b,c]; } return op==="+"?[8,5,13]:op==="-"?[13,5,8]:op==="*"?[7,4,28]:[28,4,7]; }
  function platz(f){
    let op="+", p=1, z=[8,5,13], gezeigt=false, ansicht="feld", spiel=null, serie=0;
    const loesung=()=>{ const [a,b,c]=z; if(p===2) return [`${a} ${ZCH[op]} ${b}`, c];
      if(op==="+") return [`${c} − ${z[1-p]}`, z[p]]; if(op==="*") return [`${c} ÷ ${z[1-p]}`, z[p]];
      if(op==="-") return p===0 ? [`${c} + ${b}`, a] : [`${a} − ${c}`, b];
      return p===0 ? [`${c} × ${b}`, a] : [`${a} ÷ ${c}`, b]; };
    const zeigZ=i=> i===p && !gezeigt ? `<b class="edFrag">☐</b>` : z[i];
    function bild(){
      const W=300, w=FW[op];
      if(op==="+"||op==="-"){ const ganz = op==="+"?2:0, t=op==="+"?[0,1]:[1,2], G=z[ganz], x1=Math.max(78,Math.min(W-78,W*z[t[0]]/G));      // beide Teile breit genug für ihr Fachwort
        const box=(x,y,bw,i,farbe)=>{ const fehlt=i===p&&!gezeigt; return `<rect x="${x+1}" y="${y}" width="${Math.max(bw-2,24)}" height="40" rx="6" fill="${fehlt?"url(#edStreif)":farbe}" stroke="#0f172a" stroke-width="1.5"/>
          <text x="${x+Math.max(bw,26)/2}" y="${y+18}" text-anchor="middle" font-size="16" font-weight="900" fill="#0f172a">${fehlt?"?":z[i]}</text><text x="${x+Math.max(bw,26)/2}" y="${y+33}" text-anchor="middle" font-size="9.5" font-weight="700" fill="#0f172a">${w[i]}</text>`; };
        return `<svg viewBox="-4 -4 ${W+8} 112" class="edBar"><defs><pattern id="edStreif" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#fde68a"/><rect width="4" height="8" fill="#fbbf24"/></pattern></defs>
          ${box(0,0,W,ganz,"#a78bfa")}${box(0,58,x1,t[0],"#60a5fa")}${box(x1,58,W-x1,t[1],"#4ade80")}
          <text x="${W}" y="54" text-anchor="end" font-size="9" fill="#94a3b8">das Ganze ↑ · die Teile ↓</text></svg>
          <div class="edKlein">${p===ganz ? "Das <b>Ganze</b> fehlt → beide Teile <b>zusammenzählen</b>." : "Ein <b>Teil</b> fehlt → vom Ganzen den anderen Teil <b>abziehen</b>."}</div>`; }
      // Mal und Geteilt: f0 gleich große Teile zu je f1 ergeben f2
      const f = op==="*" ? [z[0],z[1],z[2]] : [z[2],z[1],z[0]], fehlt = op==="*" ? (p===0?"anzahl":p===1?"groesse":"ganz") : (p===0?"ganz":p===1?"groesse":"anzahl");
      const n=f[0], bw=W/n; let s="";
      for(let i=0;i<n;i++) s+=`<rect x="${i*bw+1}" y="58" width="${bw-2}" height="40" rx="5" fill="${fehlt==="anzahl"&&!gezeigt?"url(#edStreif)":"#60a5fa"}" stroke="#0f172a" stroke-width="1.2" ${fehlt==="anzahl"&&!gezeigt?'stroke-dasharray="4 3"':""}/>
        <text x="${i*bw+bw/2}" y="83" text-anchor="middle" font-size="${n>7?12:15}" font-weight="900" fill="#0f172a">${fehlt==="groesse"&&!gezeigt?"?":f[1]}</text>`;
      return `<svg viewBox="-4 -4 ${W+8} 112" class="edBar"><defs><pattern id="edStreif" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#fde68a"/><rect width="4" height="8" fill="#fbbf24"/></pattern></defs>
        <rect x="1" y="0" width="${W-2}" height="40" rx="6" fill="${fehlt==="ganz"&&!gezeigt?"url(#edStreif)":"#a78bfa"}" stroke="#0f172a" stroke-width="1.5"/><text x="${W/2}" y="26" text-anchor="middle" font-size="17" font-weight="900" fill="#0f172a">${fehlt==="ganz"&&!gezeigt?"?":f[2]}</text>${s}</svg>
        <div class="edKlein">${fehlt==="anzahl" ? `Wie oft passt die <b>${f[1]}</b> in die <b>${f[2]}</b>? Zähle in ${f[1]}er-Schritten: ${Array.from({length:Math.min(n,10)},(_,i)=>(i+1)*f[1]).join(", ")} → ${gezeigt?`<b>${n}</b>-mal`:"…"}`
          : fehlt==="groesse" ? `<b>${f[2]}</b> in <b>${n}</b> gleich große Teile – wie groß ist ein Teil?` : `<b>${n}</b> Teile zu je <b>${f[1]}</b> – wie viel ist das zusammen?`}<br>Mal und Geteilt gehören zusammen: ${f[0]} × ${f[1]} = ${f[2]} ↔ ${f[2]} ÷ ${f[1]} = ${f[0]}</div>`;
    }
    function feldHTML(){ const w=FW[op], [rech, erg]=loesung();
      return `<div class="edReihe">${["+","-","*","/"].map(o=>`<button class="edK${o===op?"":" ghost"}" data-op="${o}">${ZCH[o]}</button>`).join("")}<button class="edK ghost" id="edNeu">🎲</button></div>
        <div class="edReihe"><span class="edKlein" style="align-self:center">Was fehlt?</span>${["1. Zahl","2. Zahl","Ergebnis"].map((t,i)=>`<button class="edK${i===p?"":" ghost"}" data-p="${i}">${t}</button>`).join("")}</div>
        <div class="edGl">${[0,1,2].map(i=>`<button class="edZahl${i===p?" fehlt":""}" data-w="${i}"><span class="z">${zeigZ(i)}</span><span class="w">${FWART[w[i]]} ${w[i]}</span></button>`+(i===0?`<span class="edOp">${ZCH[op]}</span>`:i===1?`<span class="edOp">=</span>`:"")).join("")}</div>
        <div class="edTipp">Tippe auf eine Zahl – du hörst ihr Fachwort.</div>
        ${bild()}
        <div class="edPanel">${p<2?`<div class="edZeile">${REGEL[op+p]}</div>`:`<div class="edZeile">Das Ergebnis (${FWART[w[2]]} ${w[2]}) fehlt – einfach ausrechnen.</div>`}
          <div class="edGross" style="font-size:24px">☐ = ${rech}${gezeigt?` = ${erg}`:""}</div>
          ${gezeigt?`<div class="edZeile">✅ Probe: ${z[0]} ${ZCH[op]} ${z[1]} = ${z[2]}</div>`:""}
          <div class="edReihe"><button class="edK" id="edLos"${gezeigt?" disabled":""}>Lösung zeigen</button><button class="edK ghost" id="edLaut">🔈 Vorlesen</button></div></div>`; }
    function karteHTML(){ return `<div class="edKlein" style="margin-bottom:6px">Tippe auf eine Karte – du hörst das Wort und den Merksatz.</div>`+
      ["+","-","*","/"].map(o=>`<div class="edMerk"><div class="edMerkKopf">${{"+":"➕ Plus","-":"➖ Minus","*":"✖️ Mal","/":"➗ Geteilt"}[o]}: <b>${{"+":"8 + 5 = 13","-":"13 − 5 = 8","*":"7 × 4 = 28","/":"28 ÷ 4 = 7"}[o]}</b></div>`+
        [...new Set(FW[o])].map(w=>`<button class="edKarte2" data-k="${w}"><b>${FWART[w]} ${w}</b><span>${MERK[w]}</span></button>`).join("")+`</div>`).join(""); }
    function neueSpielFrage(){ const o=aus(["+","-","*","/"]), zz=zahlen(o), w=FW[o], i=rnd(0,2); spiel={o, zz, ziel:w[i], i, antwort:null}; }
    function spielHTML(){ if(!spiel) neueSpielFrage(); const s=spiel, w=FW[s.o];
      return `<div class="edGross" style="font-size:20px">🎯 Tippe auf ${AKK[s.ziel]}!</div>
        <div class="edGl">${[0,1,2].map(i=>`<button class="edZahl${s.antwort!==null&&(w[i]===s.ziel?" gut":i===s.antwort?" falsch":"")||""}" data-sp="${i}"><span class="z">${s.zz[i]}</span><span class="w">${s.antwort!==null?`${FWART[w[i]]} ${w[i]}`:"&nbsp;"}</span></button>`+(i===0?`<span class="edOp">${ZCH[s.o]}</span>`:i===1?`<span class="edOp">=</span>`:"")).join("")}</div>
        <div class="edZeile">${s.antwort===null?"":w[s.antwort]===s.ziel?`✅ Richtig! ${groß(FWART[s.ziel])} ${s.ziel}: ${MERK[s.ziel]}`:`❌ Das war ${FWART[w[s.antwort]]} ${w[s.antwort]}. ${groß(FWART[s.ziel])} ${s.ziel} ist die <b>${s.zz[s.i]}</b>.`}</div>
        <div class="edZeile">🔥 ${serie} richtig hintereinander</div>${s.antwort!==null?`<div class="edReihe"><button class="edK" id="edNaechste">Nächste ▶</button></div>`:""}`; }
    const mal=()=>{
      f.innerHTML=`<div class="edReihe">${[["feld","🔍 Fehlende Zahl"],["karten","📘 Merkkarten"],["spiel","🎯 Fachwörter-Spiel"]].map(x=>`<button class="edK${x[0]===ansicht?"":" ghost"}" data-a="${x[0]}">${x[1]}</button>`).join("")}</div>`+
        (ansicht==="feld"?feldHTML():ansicht==="karten"?karteHTML():spielHTML());
      f.querySelectorAll("[data-a]").forEach(b=>b.addEventListener("click",()=>{ ansicht=b.dataset.a; mal(); }));
      if(ansicht==="feld"){
        f.querySelectorAll("[data-op]").forEach(b=>b.addEventListener("click",()=>{ op=b.dataset.op; z=zahlen(op); gezeigt=false; mal(); }));
        f.querySelectorAll("[data-p]").forEach(b=>b.addEventListener("click",()=>{ p=+b.dataset.p; gezeigt=false; mal(); }));
        $("edNeu").addEventListener("click",()=>{ z=zahlen(op); gezeigt=false; mal(); });
        f.querySelectorAll("[data-w]").forEach(b=>b.addEventListener("click",()=>{ const w=FW[op][+b.dataset.w]; sprich(`${groß(FWART[w])} ${w}. ${MERK[w].replace(/<[^>]+>/g,"")}`); }));
        $("edLos").addEventListener("click",()=>{ gezeigt=true; mal(); const [rech,erg]=loesung(), w=FW[op];
          sprich(`${p<2?REGEL[op+p].replace(/<[^>]+>/g,""):"Einfach ausrechnen."} ${rech.replace("−"," minus ").replace("+"," plus ").replace("×"," mal ").replace("÷"," geteilt durch ")} ist ${erg}. ${groß(FWART[w[p]])} ${w[p]} ist ${erg}.`); });
        $("edLaut").addEventListener("click",()=>{ const w=FW[op]; sprich(p<2 ? `${groß(FWART[w[p]])} ${w[p]} fehlt. ${REGEL[op+p].replace(/<[^>]+>/g,"")}` : "Das Ergebnis fehlt."); });
      } else if(ansicht==="karten"){
        f.querySelectorAll("[data-k]").forEach(b=>b.addEventListener("click",()=>{ const w=b.dataset.k; sprich(`${groß(FWART[w])} ${w}. ${MERK[w].replace(/<[^>]+>/g,"")}`); }));
      } else {
        f.querySelectorAll("[data-sp]").forEach(b=>b.addEventListener("click",()=>{ if(spiel.antwort!==null) return; spiel.antwort=+b.dataset.sp; const ok=FW[spiel.o][spiel.antwort]===spiel.ziel; serie=ok?serie+1:0; mal();
          sprich(ok ? `Richtig! ${groß(FWART[spiel.ziel])} ${spiel.ziel}.` : `Nein. ${groß(FWART[spiel.ziel])} ${spiel.ziel} ist die ${spiel.zz[spiel.i]}.`); }));
        const n=$("edNaechste"); if(n) n.addEventListener("click",()=>{ neueSpielFrage(); mal(); });
      }
    };
    mal();
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", einbauen); else einbauen();
})();
