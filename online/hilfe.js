// ===== Anschauliche Hilfe nach einem Fehler =====
// Im Trainingsraum (nie im Test) zeigt das Programm nach einer falschen Antwort, WIE man die Aufgabe sehen kann:
//   bis 20      → Zwanzigerfeld (mit Fünfer- und Zehnerstruktur)
//   bis 100/1000 → Rechenstrich mit Sprüngen (erst die Zehner, dann über den Zehner)
//   Malnehmen   → Punktefeld, bei großen Aufgaben an der 5 zerlegt
//   Teilen      → Punktefeld in Reihen + Umkehraufgabe
//   Zerlegen    → Zwanzigerfeld bzw. Rechenstrich „bis zum Ziel"
// Das Kind tippt danach selbst auf „Weiter" – es hat also Zeit zum Anschauen.
window.Hilfe=(function(){
  const A="#38bdf8", B="#fbbf24", LEER="#475569", GRUEN="#4ade80", TEXT="#f1f5f9", GRAU="#94a3b8";

  // ---------- Zwanzigerfeld ----------
  // zustand(i) → "a" | "b" | "weg" | "ziel" | "leer"
  function feld(zustand){
    const r=10, d=26, x0=18, ys=[16,46];
    let s="";
    for(let i=0;i<20;i++){
      const reihe=Math.floor(i/10), sp=i%10, cx=x0+sp*d+(sp>=5?10:0)+r, cy=ys[reihe], z=zustand(i);
      if(z==="a")       s+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${A}"/>`;
      else if(z==="b")  s+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${B}"/>`;
      else if(z==="weg")s+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${B}" stroke-width="2"/><path d="M${cx-6} ${cy-6} L${cx+6} ${cy+6} M${cx+6} ${cy-6} L${cx-6} ${cy+6}" stroke="${B}" stroke-width="2.4" stroke-linecap="round"/>`;
      else if(z==="ziel")s+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${B}" stroke-width="2.4" stroke-dasharray="4 3"/>`;
      else              s+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${LEER}" stroke-width="1.6"/>`;
    }
    return `<svg viewBox="0 0 306 62" role="img">${s}</svg>`;
  }
  // ---------- Rechenstrich ----------
  // start: Zahl, spruenge: [+20, +3, +2] oder [-20, -3, -2]
  function strich(start, spruenge){
    const n=spruenge.length+1, zurueck=spruenge[0]<0, W=320, l=26, r=W-26, y=58;
    const xs=[]; for(let i=0;i<n;i++){ const t = n===1 ? 0 : i/(n-1); xs.push(zurueck ? r-(r-l)*t : l+(r-l)*t); }
    let wert=start, s=`<line x1="10" y1="${y}" x2="${W-10}" y2="${y}" stroke="${GRAU}" stroke-width="2.4" stroke-linecap="round"/>`;
    const zahl=(x,v,farbe,fett)=>`<line x1="${x}" y1="${y-6}" x2="${x}" y2="${y+6}" stroke="${farbe}" stroke-width="2.4"/><text x="${x}" y="${y+25}" text-anchor="middle" font-size="${fett?17:15}" font-weight="${fett?800:700}" fill="${farbe}">${v}</text>`;
    s+=zahl(xs[0], wert, TEXT, true);
    spruenge.forEach((sp,i)=>{
      const x1=xs[i], x2=xs[i+1], mx=(x1+x2)/2;
      s+=`<path d="M${x1} ${y-8} Q${mx} ${y-52} ${x2} ${y-8}" fill="none" stroke="${B}" stroke-width="2.6" stroke-linecap="round"/>`;
      s+=`<text x="${mx}" y="${y-36}" text-anchor="middle" font-size="15" font-weight="800" fill="${B}">${sp>0?"+":"−"}${Math.abs(sp)}</text>`;
      wert+=sp;
      s+=zahl(x2, wert, i===spruenge.length-1?GRUEN:TEXT, i===spruenge.length-1);
    });
    return `<svg viewBox="0 0 ${W} 90" role="img">${s}</svg>`;
  }
  // Schrittweise rechnen: erst Hunderter, dann Zehner, dann die Einer – über den Zehner in zwei Schritten
  function plusSpruenge(a,b){
    const sp=[], h=Math.floor(b/100)*100, z=Math.floor(b%100/10)*10, e=b%10;
    if(h) sp.push(h); if(z) sp.push(z);
    const stand=a+h+z, bisZehn=(10-stand%10)%10;
    if(e){ if(bisZehn && e>bisZehn){ sp.push(bisZehn, e-bisZehn); } else sp.push(e); }
    return sp;
  }
  function minusSpruenge(a,b){
    const sp=[], h=Math.floor(b/100)*100, z=Math.floor(b%100/10)*10, e=b%10;
    if(h) sp.push(-h); if(z) sp.push(-z);
    const stand=a-h-z, einer=stand%10;
    if(e){ if(einer && e>einer){ sp.push(-einer, -(e-einer)); } else sp.push(-e); }
    return sp;
  }
  function kette(start, spruenge){
    let w=start; const teile=[String(start)];
    spruenge.forEach(s=>{ w+=s; teile.push(`${s>0?"+":"−"} ${Math.abs(s)} → <b>${w}</b>`); });
    return teile.join(" ");
  }
  // ---------- Punktefeld für Mal und Geteilt ----------
  function punkte(reihen, spalten, teileBei){
    const d = Math.min(24, Math.floor(280/Math.max(spalten,5))), r=d*0.38, x0=(320-spalten*d)/2+d/2, hoehe=reihen*d+10;
    let s="";
    for(let i=0;i<reihen;i++) for(let j=0;j<spalten;j++)
      s+=`<circle cx="${(x0+j*d).toFixed(1)}" cy="${(5+d/2+i*d).toFixed(1)}" r="${r.toFixed(1)}" fill="${teileBei && i>=teileBei ? B : A}"/>`;
    return `<svg viewBox="0 0 320 ${hoehe}" role="img">${s}</svg>`;
  }

  // Liefert {bild, text} oder null, wenn es für die Aufgabe kein passendes Bild gibt
  function baue(art, a, b){
    if(art==="plus"){
      const r=a+b;
      if(r<=20){
        const ueber = a<10 && r>10 || a>10 && false;
        const bis10=10-a;
        return { bild:feld(i=>i<a?"a":i<r?"b":"leer"),
          text: (a<10 && r>10) ? `${a} + ${b}: erst <b>${bis10}</b> bis zur 10, dann noch <b>${b-bis10}</b> → <b>${r}</b>`
                               : `<b style="color:${A}">${a}</b> und <b style="color:${B}">${b}</b> dazu sind zusammen <b>${r}</b>` };
      }
      const sp=plusSpruenge(a,b);
      return { bild:strich(a,sp), text:kette(a,sp) };
    }
    if(art==="minus"){
      const r=a-b;
      if(a<=20){
        const bis10=a-10;
        return { bild:feld(i=>i<r?"a":i<a?"weg":"leer"),
          text: (a>10 && r<10) ? `${a} − ${b}: erst <b>${bis10}</b> weg bis zur 10, dann noch <b>${b-bis10}</b> → <b>${r}</b>`
                               : `Von ${a} nimmst du <b style="color:${B}">${b}</b> weg – es bleiben <b>${r}</b>` };
      }
      const sp=minusSpruenge(a,b);
      return { bild:strich(a,sp), text:kette(a,sp) };
    }
    if(art==="mal"){
      if(a>10 || b>10 || a<1 || b<1) return null;
      // die größere Zahl nach oben–unten, damit das Feld nicht zu breit wird; ab 6 Reihen an der 5 teilen
      const reihen=a, spalten=b, teile = reihen>5 ? 5 : 0;
      const text = teile ? `${a} × ${b} = <b style="color:${A}">5 × ${b}</b> + <b style="color:${B}">${a-5} × ${b}</b> = ${5*b} + ${(a-5)*b} = <b>${a*b}</b>`
                 : a===1 ? `1 Reihe mit ${b} Punkten: <b>${b}</b>`
                 : `${a} Reihen mit je ${b} Punkten: ${Array(a).fill(b).join(" + ")} = <b>${a*b}</b>`;
      return { bild:punkte(reihen, spalten, teile), text };
    }
    if(art==="geteilt"){
      if(!b || a%b || a/b>10 || b>10) return null;
      const q=a/b;
      return { bild:punkte(q, b, 0), text:`${a} Punkte in Reihen zu je ${b}: das sind <b>${q}</b> Reihen.<br>Umkehraufgabe: <b>${q} × ${b} = ${a}</b>` };
    }
    if(art==="zerlegen"){            // a = Ganzes, b = bekannter Teil, gesucht a − b
      const r=a-b;
      if(a<=20) return { bild:feld(i=>i<b?"a":i<a?"ziel":"leer"), text:`<b style="color:${A}">${b}</b> sind schon da. Bis <b>${a}</b> fehlen noch <b style="color:${B}">${r}</b>.` };
      const sp=[], bisZehn=(10-b%10)%10;
      if(bisZehn && r>bisZehn){ sp.push(bisZehn, r-bisZehn); } else sp.push(r);
      return { bild:strich(b,sp), text:`Von ${b} bis ${a}: ${sp.map(s=>"+ "+s).join(", dann ")} – zusammen <b>${r}</b>` };
    }
    return null;
  }
  function stil(){
    if(document.getElementById("hfStil")) return;
    const s=document.createElement("style"); s.id="hfStil";
    s.textContent=`
    .hfBox{margin:14px auto 0;max-width:460px;background:#0b1220;border:1px solid #334155;border-radius:16px;padding:14px 14px 12px;text-align:center;
      animation:hfRein .35s ease-out both}
    .hfBox .hfT{font-size:13px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.4px;margin-bottom:8px}
    .hfBox svg{width:100%;max-width:400px;height:auto;display:block;margin:0 auto}
    .hfBox .hfTx{font-size:16.5px;line-height:1.5;color:#e2e8f0;margin-top:8px}
    .hfBox .hfTx b{color:#fff}
    .hfBox button{margin-top:12px;font-family:inherit;font-size:17px;font-weight:700;border:none;border-radius:12px;padding:12px 26px;cursor:pointer;
      background:linear-gradient(180deg,#38bdf8,#0284c7);color:#042433}
    @keyframes hfRein{ from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }`;
    document.head.appendChild(s);
  }
  // Zeigt die Hilfe unter der Rückmeldung. weiter() wird beim Tippen auf „Weiter" aufgerufen.
  // Rückgabe true = Hilfe wird gezeigt (der Trainer wartet), false = keine Hilfe für diese Aufgabe.
  function zeige(art, a, b, weiter){
    let h=null; try{ h=baue(art, +a, +b); }catch(e){}
    const anker=document.getElementById("feedback");
    if(!h || !anker) return false;
    stil();
    document.querySelectorAll(".hfBox").forEach(x=>x.remove());
    const box=document.createElement("div"); box.className="hfBox";
    box.innerHTML=`<div class="hfT">💡 So kannst du es sehen</div>${h.bild}<div class="hfTx">${h.text}</div><button type="button">Weiter ▶</button>`;
    anker.insertAdjacentElement("afterend", box);
    const knopf=box.querySelector("button");
    let fertig=false;
    const los=()=>{ if(fertig) return; fertig=true; box.remove(); weiter(); };
    knopf.addEventListener("click", los);
    setTimeout(()=>{ try{ knopf.focus({preventScroll:true}); }catch(e){} box.scrollIntoView({block:"nearest", behavior:"smooth"}); }, 350);   // Enter = Weiter
    return true;
  }
  // Für die Spiele: Hilfe direkt aus dem Aufgaben-Schlüssel ("8+5", "13−5", "7×8", "56÷7", "17=9") als fertiger Kasten
  function kasten(schluessel){
    const m=String(schluessel).match(/^(\d+)\s*([+\-−×x÷:=])\s*(\d+)$/); if(!m) return "";
    const art = m[2]==="+"?"plus": /[\-−]/.test(m[2])?"minus": /[×x]/.test(m[2])?"mal": /[÷:]/.test(m[2])?"geteilt":"zerlegen";
    let h=null; try{ h=baue(art, +m[1], +m[3]); }catch(e){}
    if(!h) return "";
    stil();
    return `<div class="hfBox"><div class="hfT">💡 So kannst du es sehen</div>${h.bild}<div class="hfTx">${h.text}</div></div>`;
  }
  return {zeige, baue, kasten};
})();
