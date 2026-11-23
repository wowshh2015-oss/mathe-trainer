// ===== 🔎 Entdecken für die älteren Trainer (Einmaleins, Einsdurcheins, Plus, Minus, Zerlegen) =====
// Freies Ausprobieren ohne Bewertung (Walter & Schwätzer: Handlung ↔ Vorstellung, vernetzte Darstellungen, Strukturierungshilfen).
// Hängt eine Karte „Entdecken" unten in die Startkarte #home. Malfeld (·, :) oder Zwanzigerfeld/Hunderterfeld mit Wendeplättchen (+, −, Zerlegen).
(function(){
  const seite=(location.pathname.split("/").pop()||"").replace("-trainer.html","");
  const ART={einmaleins:"mal", einsdurcheins:"teil", plus:"plus", minus:"minus", zerlegen:"zerlegen"}[seite];
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
  @media (max-width:520px){ .edKarte{flex-wrap:wrap} .edKarte .tx{flex-basis:calc(100% - 50px)} .edKarte button{margin-left:46px} }`;
  document.head.appendChild(css);
  const TEXT={mal:"Tippe im Punktefeld auf einen Punkt – so groß wird deine Malaufgabe. Dann kannst du sie zerlegen wie 7 · 6 = 5 · 6 + 2 · 6.",
              teil:"Wie oft passt die 6 in 42? Tippe auf einen Punkt – das Punktefeld zeigt Reihen. So siehst du Mal- und Geteiltaufgabe zusammen.",
              plus:"Leg Wendeplättchen ins Zwanzigerfeld: rot und blau. Mit „Ordnen“ siehst du, wie du über die 10 rechnest.",
              minus:"Leg Plättchen ins Feld und streiche welche weg. Mit „Ordnen“ siehst du, wie viele übrig bleiben.",
              zerlegen:"Leg Plättchen ins Feld – rot und blau. So siehst du, wie man eine Zahl in zwei Teile zerlegt."}[ART];
  function einbauen(){
    const home=$("home"); if(!home || $("edBtn")) return;
    home.insertAdjacentHTML("beforeend", `<div class="edKarte"><span class="nr">🔎</span><span class="tx"><b>Entdecken</b><span>${TEXT} Hier gibt es keine Fehler.</span></span><button id="edBtn">Ausprobieren</button></div><div id="edFeld" class="edFeld" style="display:none"></div>`);
    $("edBtn").addEventListener("click",()=>{ const f=$("edFeld"), zu=f.style.display!=="none"; f.style.display=zu?"none":""; $("edBtn").textContent=zu?"Ausprobieren":"Schließen";
      if(zu) try{ speechSynthesis.cancel(); }catch(e){}
      if(!zu && !f.dataset.an){ f.dataset.an="1"; (ART==="mal"||ART==="teil" ? malfeld : plaettchen)(f); } });
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
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", einbauen); else einbauen();
})();
