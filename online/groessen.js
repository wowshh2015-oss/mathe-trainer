// ===== Größen: Geld, Längen und Gewichte =====
// Gemeinsamer Motor für geld-trainer.html, laengen-trainer.html und gewichte-trainer.html (window.GROESSE = "geld" | "laengen" | "gewichte").
// Jede Aufgabe ist eine von drei Arten:
//   eingabe – ein oder zwei Zahlenfelder mit Einheit (3 € 45 ct)
//   wahl    – eine von mehreren Antworten antippen
//   legen   – einen Betrag mit Münzen und Scheinen selbst legen
(function(){
  const WAS=["laengen","gewichte","zahlen","geo","daten","schrift","kalender","mix","sach2","strahl","zoo"].includes(window.GROESSE) ? window.GROESSE : "geld";
  const KEY="HL-GH7G-3T7W-N5S5-BV3C";
  const CONF={ apiKey:"AIzaSyC8EzUrPYV3j6tsgFIR3LQBlF5YLLZgkQI", authDomain:"mathe-trainer-5ad4f.firebaseapp.com",
               projectId:"mathe-trainer-5ad4f", appId:"1:322708616948:web:cafd973192eb25a459d0a1" };
  const APP=WAS, PRO_RUNDE=10, BESTANDEN=90, TEST_SEK=45;
  const TITEL = { geld:["💶","Geld","Münzen und Scheine zählen, umwandeln, bezahlen."], gewichte:["⚖️","Gewichte","Wiegen, schätzen, umwandeln und mit Gewichten rechnen."],
    laengen:["📏","Längen","Messen, umwandeln und mit Längen rechnen."], zahlen:["🔢","Zahlen bis 1000","Stellenwerte, Zahlenstrahl, vergleichen und runden."],
    geo:["📐","Formen und Körper","Flächen und Körper erkennen, Symmetrie, Umfang und Fläche."], daten:["📊","Daten und Zufall","Strichlisten und Diagramme lesen – und was ist wahrscheinlich?"],
    schrift:["✍️","Schriftlich rechnen","Untereinander rechnen – Stelle für Stelle, von rechts nach links."],
    kalender:["📅","Kalender und Zeit","Wochentage, Monate, Stunden, Minuten und Sekunden."],
    mix:["🎲","Bunte Mischung","Aufgaben aus allen Themen – passend zu deiner Klasse."],
    sach2:["📚","Sachaufgaben in zwei Schritten","Erst überlegen, was zuerst gerechnet wird – dann der zweite Schritt."],
    strahl:["📍","Zahlenstrahl","Erst den Schritt finden – dann die Zahl."],
    zoo:["🦁","Mein Zoo","Löse Aufgaben aus allen Themen – wer gut rechnet, bekommt neue Tiere."] }[WAS];
  const FARBE = { geld:["#facc15","#4a3a0c"], gewichte:["#2dd4bf","#0f3d3a"], laengen:["#60a5fa","#172554"], zahlen:["#a78bfa","#2e1065"], geo:["#38bdf8","#0c4a6e"], daten:["#fb923c","#431407"], schrift:["#f472b6","#500724"], kalender:["#4ade80","#14532d"], mix:["#f87171","#450a0a"], sach2:["#34d399","#064e3b"], strahl:["#22d3ee","#083344"], zoo:["#a3e635","#1a2e05"] }[WAS];
  const $=id=>document.getElementById(id);
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const capName=s=>String(s||"").trim().replace(/\s+/g," ").toLowerCase().replace(/(^|[\s\-])(\S)/g,(m,p,c)=>p+c.toUpperCase());
  const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
  const aus=l=>l[rnd(0,l.length-1)];
  const mische=a=>{ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=rnd(0,i); [a[i],a[j]]=[a[j],a[i]]; } return a; };
  const zz=n=>String(n).padStart(2,"0");

  // ---------- Seite aufbauen ----------
  const css=document.createElement("style");
  css.textContent=`
  :root{ --bg:#0f172a; --card:#1e293b; --card2:#334155; --text:#f1f5f9; --muted:#94a3b8; --accent:${FARBE[0]}; --good:#22c55e; --bad:#ef4444; --shadow:0 10px 30px rgba(0,0,0,.35); }
  *{box-sizing:border-box} html,body{margin:0;min-height:100%}
  body{font-family:"Segoe UI",system-ui,-apple-system,Arial,sans-serif;background:radial-gradient(1200px 600px at 50% -10%,${FARBE[1]} 0%,var(--bg) 60%);
    color:var(--text);min-height:100vh;display:flex;justify-content:center;padding:62px 24px 24px}
  .app{width:100%;max-width:680px} h1{font-size:28px;margin:0 0 4px} .sub{color:var(--muted);margin:0 0 18px;font-size:15px}
  .card{background:var(--card);border-radius:18px;padding:22px;box-shadow:var(--shadow);border:1px solid rgba(255,255,255,.05);margin-bottom:16px}
  label{display:block;font-size:14px;color:var(--muted);margin:0 0 6px}
  input[type=text]{font-family:inherit;font-size:20px;padding:13px 16px;border-radius:12px;border:2px solid var(--card2);background:#0b1220;color:var(--text);outline:none}
  #name{width:100%}
  button{font-family:inherit;cursor:pointer;border:none;border-radius:12px;font-size:17px;font-weight:700;padding:13px 18px;color:#1c1917;background:var(--accent);transition:.15s}
  button:hover{filter:brightness(1.08)} button:disabled{opacity:.5;cursor:not-allowed}
  button.ghost{background:transparent;color:var(--text);border:2px solid var(--card2);font-weight:600} button.klein{font-size:14.5px;padding:9px 13px}
  .hide{display:none!important}
  .backbtn{background:transparent;border:none;color:var(--muted);font-size:14px;font-weight:600;padding:0;margin-bottom:12px;cursor:pointer;text-decoration:none;display:inline-block}
  .info{background:#0b1220;border-radius:12px;padding:12px 14px;font-size:14.5px;color:var(--muted);line-height:1.5} .info b{color:var(--text)}
  .status{font-size:13px;color:var(--muted);margin-top:10px;text-align:center}
  .credit{text-align:center;color:var(--muted);font-size:13px;margin:22px 0 6px} .credit a{color:var(--muted)}
  h3{font-size:16px;margin:18px 0 8px}
  .stufe{display:flex;align-items:center;gap:12px;background:#0b1220;border:2px solid var(--card2);border-radius:14px;padding:12px 14px;margin-bottom:8px}
  .stufe.fertig{border-color:rgba(34,197,94,.55)} .stufe.dran{border-color:var(--accent)}
  .stufe .nr{flex:none;width:34px;height:34px;border-radius:50%;background:var(--card2);display:flex;align-items:center;justify-content:center;font-weight:800}
  .stufe.fertig .nr{background:var(--good);color:#04220f}
  .stufe .tx{flex:1;min-width:0} .stufe .tx b{display:block;font-size:15.5px} .stufe .tx span{display:block;font-size:12.5px;color:var(--muted);line-height:1.4}
  .stufe .kn{flex:none;display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}
  .kopf{display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap;padding-right:120px}
  .pille{display:inline-block;background:rgba(148,163,184,.16);color:#e2e8f0;border-radius:999px;padding:5px 12px;font-size:13px;font-weight:700}
  .fortschritt{display:flex;gap:4px;margin-bottom:12px} .fortschritt i{flex:1;height:7px;border-radius:999px;background:#0b1220;border:1px solid var(--card2)}
  .fortschritt i.ok{background:var(--good);border-color:var(--good)} .fortschritt i.nein{background:var(--bad);border-color:var(--bad)}
  .zeitbalken{height:7px;border-radius:999px;background:#0b1220;border:1px solid var(--card2);overflow:hidden;margin-bottom:10px} .zeitbalken i{display:block;height:100%;background:var(--accent);transition:width .25s linear}
  .frage{text-align:center;font-size:21px;font-weight:800;margin:6px 0 12px;line-height:1.4} .frage .ziel{color:#fde68a}
  .bild{background:#0b1220;border:1px solid var(--card2);border-radius:16px;padding:14px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:center;min-height:70px}
  .bild svg{display:block}
  .lineal{padding:10px 6px} .lineal svg{width:100%;height:auto}
  .eingabe{display:flex;align-items:center;justify-content:center;gap:8px;font-size:26px;font-weight:800;flex-wrap:wrap;margin-top:14px}
  .eingabe input{width:104px;font-size:28px;text-align:center;padding:10px 6px;border:2px solid var(--accent);font-weight:800}
  .eingabe .gl{color:var(--muted)}
  .wahl{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}
  .wahl button{background:#0b1220;color:var(--text);border:2px solid var(--card2);font-size:20px;padding:15px 8px}
  .wahl button:hover{border-color:var(--accent)} .wahl button.richtig{border-color:var(--good);background:rgba(34,197,94,.16)} .wahl button.falsch{border-color:var(--bad);background:rgba(239,68,68,.14)}
  .kasse{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-top:12px}
  .kasse button{background:#0b1220;border:2px solid var(--card2);padding:5px 7px;border-radius:14px}
  .kasse button:active{border-color:var(--accent)}
  .haufen{min-height:74px;border:2px dashed var(--card2);border-radius:16px;padding:10px;display:flex;flex-wrap:wrap;gap:6px;align-items:center;justify-content:center;margin-top:12px;color:var(--muted);font-size:14px}
  .haufen button{background:transparent;border:none;padding:0}
  .rueck{min-height:26px;text-align:center;font-size:17px;font-weight:700;margin-top:12px;line-height:1.4}
  .erkl{background:#0b1220;border:1px solid var(--card2);border-radius:16px;padding:14px;margin-top:12px;text-align:center;font-size:16px;line-height:1.55;color:#e2e8f0}
  .erkl .t{font-size:13px;font-weight:800;color:var(--muted);text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px} .erkl b{color:#fff}
  .reihe{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:12px}
  .gross{font-size:26px;font-weight:800;text-align:center;margin:4px 0 10px} .prozent{font-size:54px;font-weight:800;text-align:center;line-height:1}
  .btnrow{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px} .btnrow button{flex:1}
  .schrift{display:grid;justify-content:center;gap:5px 4px;font-size:30px;font-weight:800;margin:8px 0 4px;align-items:center}
  .schrift span{text-align:center;min-height:10px} .schrift .sk{font-size:12px;color:var(--muted);font-weight:700} .schrift .so{color:var(--muted)}
  .schrift input.sz{width:46px;height:52px;font-size:30px;text-align:center;padding:0;border:2px solid var(--accent);font-weight:800;border-radius:10px}
  .schrift input.su{width:30px;height:28px;font-size:16px;padding:0;text-align:center;border:1.5px dashed var(--card2);justify-self:center;border-radius:8px;color:#fde68a;font-weight:800}
  .schrift span.su{font-size:16px;color:#fde68a;min-height:20px} .schrift .slinie{height:3px;background:var(--text);border-radius:2px;min-height:3px} .schrift .sl{color:#86efac}
  .schrift .skomma{font-size:26px;align-self:end;line-height:1.5;min-width:0} .schrift input.sz{max-width:100%}
  .schriftTipp{text-align:center;font-size:13px;color:var(--muted);margin-top:4px}
  @media (max-width:430px){ body{padding:60px 14px 14px} .stufe{flex-wrap:wrap} .stufe .kn{width:100%;justify-content:flex-start} .eingabe input{width:86px} }`;
  document.head.appendChild(css);
  document.body.insertAdjacentHTML("afterbegin", `<div class="app">
    <h1>${TITEL[0]} ${TITEL[1]}</h1><p class="sub">${TITEL[2]}</p>
    <div id="start" class="card">
      <a class="backbtn" id="menuLink" href="index.html">← Alle Trainer</a>
      <label for="name">Name des Kindes</label><input type="text" id="name" placeholder="z. B. Anna" autocomplete="off">
      <div id="menue" class="hide" style="margin-top:18px">
        <div id="zooFeld"></div>
        <h3>${WAS==="zoo"?"Neue Tiere holen":"Lernen und üben"}</h3><div id="stufen"></div>
        <div class="stufe"><span class="nr">🧠</span><span class="tx"><b>Meine Aufgaben</b><span id="meineText">Aufgaben, die noch nicht sicher sitzen</span></span>
          <span class="kn"><button class="klein" id="meineBtn">Üben</button></span></div>
        <div class="status" id="status">Verbinde …</div>
      </div>
    </div>
    <div id="spiel" class="card hide">
      <div class="kopf"><span class="pille" id="spielTitel"></span><button class="ghost klein" id="abbruchBtn">✕ Aufhören</button></div>
      <div class="fortschritt" id="fortschritt"></div>
      <div class="zeitbalken hide" id="zeitbalken"><i id="zeitfuell"></i></div>
      <div class="frage" id="frage"></div><div id="buehne"></div>
      <div class="rueck" id="rueck"></div><div id="erkl"></div>
    </div>
    <div id="ergebnis" class="card hide">
      <div class="gross" id="ergTitel"></div><div class="prozent" id="ergProzent"></div>
      <div class="info" id="ergText" style="margin-top:14px"></div>
      <div class="btnrow"><button id="nochmalBtn">Noch einmal ▶</button><button class="ghost" id="zumMenue">Zur Übersicht</button></div>
    </div>
    <footer class="credit">Entwickelt von <strong style="color:var(--accent)">@P.Svyetnyenko</strong> · <a href="index.html">Mathe-Trainer</a></footer></div>`);

  // ---------- Geld: Bilder und Schreibweisen ----------
  const STUECKE=[20000,10000,5000,2000,1000,500,200,100,50,20,10,5,2,1];
  function geldBild(v, klein){
    const k=klein?0.82:1;
    if(v>=500){ const f=({500:["#94a3b8","#475569"],1000:["#f87171","#991b1b"],2000:["#60a5fa","#1e3a8a"],5000:["#fb923c","#9a3412"],10000:["#4ade80","#166534"],20000:["#fde047","#a16207"]})[v]||["#60a5fa","#1e3a8a"], w=92*k, h=50*k;
      return `<svg width="${w}" height="${h}" viewBox="0 0 92 50"><rect x="1.5" y="1.5" width="89" height="47" rx="6" fill="${f[0]}" stroke="${f[1]}" stroke-width="3"/><rect x="8" y="8" width="20" height="34" rx="3" fill="${f[1]}" opacity=".35"/><text x="59" y="${v>=10000?32:33}" text-anchor="middle" font-size="${v>=10000?19:24}" font-weight="800" fill="#0f172a">${v/100} €</text></svg>`; }
    const euro=v>=100, d=({1:34,2:38,5:42,10:40,20:44,50:48,100:46,200:50}[v])*k;
    const farbe = v<=5 ? ["#d97706","#92400e"] : v<=50 ? ["#facc15","#a16207"] : v===100 ? ["#e2e8f0","#facc15"] : ["#facc15","#e2e8f0"];
    return `<svg width="${d}" height="${d}" viewBox="0 0 50 50"><circle cx="25" cy="25" r="23" fill="${euro?farbe[1]:farbe[0]}" stroke="#78350f" stroke-width="2"/>${euro?`<circle cx="25" cy="25" r="15.5" fill="${farbe[0]}"/>`:""}
      <text x="25" y="${euro?28:29}" text-anchor="middle" font-size="16" font-weight="800" fill="#0f172a">${euro?v/100:v}</text><text x="25" y="${euro?38:40}" text-anchor="middle" font-size="${euro?10:9}" font-weight="800" fill="#0f172a">${euro?"€":"ct"}</text></svg>`;
  }
  function zerlege(c){ const l=[]; STUECKE.forEach(s=>{ while(c>=s){ l.push(s); c-=s; } }); return l; }
  const komma=c=>`${Math.floor(c/100)},${zz(c%100)} €`;
  const euroCent=c=>{ const e=Math.floor(c/100), r=c%100; return e&&r ? `${e} € ${r} ct` : e ? `${e} €` : `${r} ct`; };
  const stueckName=v=>v>=100 ? `${v/100} €` : `${v} ct`;
  const summenKette=l=>l.slice().sort((a,b)=>b-a).map(stueckName).join(" + ");

  // ---------- Längen: Lineal ----------
  // von/bis in Millimetern; das Lineal zeigt 0 bis 12 cm
  function linealBild(vonMm, bisMm){
    const X=mm=>14+mm*2.4; let s="";
    s+=`<rect x="${X(vonMm)}" y="8" width="${(bisMm-vonMm)*2.4-12}" height="16" rx="3" fill="#f59e0b"/><path d="M${X(bisMm)-12} 8 L${X(bisMm)} 16 L${X(bisMm)-12} 24 Z" fill="#fde68a"/><path d="M${X(bisMm)-4} 13.3 L${X(bisMm)} 16 L${X(bisMm)-4} 18.7 Z" fill="#1f2937"/>`;
    s+=`<rect x="6" y="34" width="304" height="46" rx="5" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>`;
    for(let mm=0;mm<=120;mm++){ const lang=mm%10===0?16:mm%5===0?11:7;
      s+=`<line x1="${X(mm)}" y1="34" x2="${X(mm)}" y2="${34+lang}" stroke="#1f2937" stroke-width="${mm%10===0?1.6:0.9}"/>`;
      if(mm%10===0) s+=`<text x="${X(mm)}" y="66" text-anchor="middle" font-size="12" font-weight="800" fill="#1f2937">${mm/10}</text>`; }
    s+=`<text x="300" y="76" text-anchor="end" font-size="8" fill="#92400e">cm</text>`;
    return `<svg viewBox="0 0 316 86" role="img" aria-label="Lineal">${s}</svg>`;
  }

  // ---------- Aufgaben ----------
  // feld: {e:Einheit, f:Faktor zur kleinsten Einheit}. soll: Gesamtwert in der kleinsten Einheit.
  const F={ eur:{e:"€",f:100}, ct:{e:"ct",f:1}, m:{e:"m",f:100}, cmM:{e:"cm",f:1}, cm:{e:"cm",f:10}, mm:{e:"mm",f:1},
            kg:{e:"kg",f:1000}, g:{e:"g",f:1}, t:{e:"t",f:1000}, kgT:{e:"kg",f:1}, zahl:{e:"",f:1}, gross:{e:"",f:1,max:9}, quot:{e:"Rest",f:100}, quotG:{e:"Rest",f:100,max:5}, l:{e:"l",f:1000}, ml:{e:"ml",f:1}, std:{e:"h",f:60}, min:{e:"min",f:1},
            sek:{e:"s",f:1}, minS:{e:"min",f:60}, euK:{e:",",f:100}, ctK:{e:"€",f:1,zwei:true}, uhrH:{e:".",f:60}, uhrM:{e:"Uhr",f:1} };
  // Uhrzeit wie im Schulbuch: 13.50 Uhr (t = Minuten seit Mitternacht)
  const uhr=t=>`${Math.floor(t/60)}.${zz(t%60)} Uhr`;
  // Pfeilbild wie im Heft: 17.44 Uhr —16 min→ 18.00 Uhr —12 min→ 18.12 Uhr
  function pfeil(t, schritte){ let s=`<b>${uhr(t)}</b>`; schritte.forEach(d=>{ t+=d; s+=` <span style="color:#fde68a;white-space:nowrap">—${d>=60 && d%60===0 ? d/60+" h" : d+" min"}→</span> <b>${uhr(t)}</b>`; }); return `<span style="display:inline-block;margin-top:6px;line-height:1.9">${s}</span>`; }
  const WTAGE=["Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag"];
  const MONATE=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"], MTAGE=[31,28,31,30,31,30,31,31,30,31,30,31];
  const GELD=[
    {id:1, name:"Münzen zählen", kurz:"Wie viele Cent sind das?", typen:["g_cent"]},
    {id:2, name:"Euro und Cent zählen", kurz:"Münzen und Scheine zusammen", typen:["g_euro"]},
    {id:3, name:"Umwandeln und Komma", kurz:"3 € 45 ct = 345 ct = 3,45 €", typen:["g_inCent","g_ausCent","g_kommaLesen","g_kommaWahl"]},
    {id:4, name:"Passend bezahlen", kurz:"Lege den Betrag mit Münzen", typen:["g_legen"]},
    {id:5, name:"Einkaufen und Rückgeld", kurz:"zusammenrechnen · wie viel bekommst du zurück?", typen:["g_einkauf","g_rueckgeld","g_einkauf","g_rueckgeld","g_legen"]},
    {id:6, name:"Kommazahlen sicher schreiben", kurz:"205 ct = 2,05 € · 0,07 € = 7 ct · bis zum vollen Euro", typen:["g_ctKomma","g_kommaCt","g_ecKomma","g_vergleich","g_vollEuro"]},
    {id:7, name:"Mit Kommazahlen rechnen", kurz:"2,80 € + 3,70 € · 10,00 € − 3,60 € · Reicht das Geld?", typen:["g_kPlus","g_kMinus","g_reicht","g_kPlus","g_kMinus"], sek:70},
    {id:8, name:"Malnehmen und Teilen mit Geld", kurz:"3 · 1,40 € · vier kosten 8,24 € – was kostet eines?", typen:["g_mal","g_teil","g_wieviele","g_dreisatz","g_mal","g_teil"], sek:90},
    {id:9, name:"Schriftlich rechnen mit Komma", kurz:"Komma steht immer unter Komma", typen:["gs_plus","gs_minus","gs_plus3","gs_minus"], sek:120},
    {id:10, name:"Große Geldbeträge", kurz:"Scheine bis 200 € zählen und legen", typen:["g_gross","g_gross","g_grossLegen"]}
  ];
  const LAENGEN=[
    {id:1, name:"Mit dem Lineal messen", kurz:"Wie viele Zentimeter?", typen:["l_messen","l_messen","l_messenVersetzt"]},
    {id:2, name:"Zentimeter und Millimeter", kurz:"genau messen · 3 cm = 30 mm", typen:["l_messenMm","l_cmInMm","l_mmAus","l_cmMmInMm"]},
    {id:3, name:"Meter und Zentimeter", kurz:"2 m = 200 cm · 1,50 m", typen:["l_mInCm","l_cmAus","l_mCmInCm","l_kommaWahl"]},
    {id:4, name:"Welche Einheit passt?", kurz:"mm, cm, m oder km – schätzen", typen:["l_einheit"]},
    {id:5, name:"Mit Längen rechnen", kurz:"1 m − 35 cm · 45 cm + 80 cm", typen:["l_rechneMinus","l_rechnePlus","l_rechneMm","l_seil"]}
  ];
  const GEWICHTE=[
    {id:1, name:"Leicht oder schwer?", kurz:"Was ist schwerer? · Gramm oder Kilogramm?", typen:["w_schwerer","w_schaetzen","w_schwerer","w_schaetzen"]},
    {id:2, name:"Mit Gewichtsstücken wiegen", kurz:"Wie schwer ist das zusammen?", typen:["w_stuecke","w_stuecke","w_stueckeKg"]},
    {id:3, name:"Gramm und Kilogramm", kurz:"1 kg = 1000 g · ein halbes Kilo", typen:["w_kgInG","w_kgGInG","w_gAus","w_bruch"]},
    {id:4, name:"Mit Gewichten rechnen", kurz:"1 kg − 350 g · 600 g + 700 g", typen:["w_rechneMinus","w_rechnePlus","w_mal","w_rechneMinus","w_rechnePlus"]},
    {id:5, name:"Tonnen", kurz:"1 t = 1000 kg · für Klasse 4", typen:["w_tInKg","w_kgAusT","w_schaetzenT","w_lkw"]},
    {id:6, name:"Liter und Milliliter", kurz:"1 l = 1000 ml · ein halber Liter", typen:["w_lSchaetzen","w_lInMl","w_mlAus","w_lBruch","w_lGlaeser"]}
  ];
  const ZAHLEN=[
    {id:1, name:"Zehner und Einer", kurz:"3 Zehner und 7 Einer = 37", typen:["z_ze","z_stelle2","z_ze"]},
    {id:2, name:"Nachbarzahlen und Zahlenstrahl", kurz:"Vorgänger · Nachfolger · Nachbarzehner", typen:["z_vorNach","z_zehnerNachbar","z_strahl","z_vorNach","z_strahl"]},
    {id:3, name:"Zahlenstrahl: Wie groß ist ein Schritt?", kurz:"nur Anfang und Ende stehen da – finde den Schritt", typen:["s_schritte","s_schritt","s_pfeil","s_schritt","s_pfeil","s_wo"]},
    {id:4, name:"Vergleichen", kurz:"größer, kleiner oder gleich: 47 ☐ 74", typen:["z_vergleich","z_groesste","z_vergleich"]},
    {id:5, name:"Verdoppeln, halbieren, gerade und ungerade", kurz:"das Doppelte von 35 · die Hälfte von 70", typen:["z_doppelt","z_haelfte","z_gerade"]},
    {id:6, name:"Hunderter, Zehner, Einer", kurz:"Zahlen bis 1000 · 3 H 5 E = 305", typen:["z_hze","z_stelle3","z_vorNach1000","z_strahl1000"]},
    {id:7, name:"Zahlenstrahl bis 1000", kurz:"Schritt finden: 10er, 20er, 25er, 50er, 100er", typen:["t_schritt","t_pfeil","t_pfeil","t_wo","t_schritt","t_pfeil"]},
    {id:8, name:"Runden", kurz:"auf Zehner und auf Hunderter", typen:["z_rundeZ","z_rundeH","z_rundeZ"]},
    {id:9, name:"Teilen mit Rest", kurz:"17 ÷ 5 = 3 Rest 2", typen:["z_rest"]},
    {id:10, name:"Bis 1 Million: Stellenwerte", kurz:"Klasse 4 · 347 582 · HT, ZT, T, H, Z, E", typen:["m_stelle","m_zerlegt","m_stellenwert","m_stelle","m_zerlegt"]},
    {id:11, name:"Bis 1 Million: Nachbarn und Zahlenstrahl", kurz:"Klasse 4 · Vorgänger · Nachbartausender · Schritt finden", typen:["m_vorNach","m_nachbarT","m_strahl","m_vorNach","m_strahl"], sek:70},
    {id:12, name:"Bis 1 Million: vergleichen und runden", kurz:"Klasse 4 · auf Tausender, Zehntausender, Hunderttausender", typen:["m_vergleich","m_runde","m_runde"]},
    {id:13, name:"Bis 1 Million: rechnen mit großen Zahlen", kurz:"Klasse 4 · 300 000 + 450 000 · 6 × 4 000", typen:["m_plus","m_minus","m_mal","m_teil"]}
  ];
  const GEO=[
    {id:1, name:"Flächen erkennen", kurz:"Kreis · Dreieck · Quadrat · Rechteck", typen:["f_form","f_form","f_form2"]},
    {id:2, name:"Ecken und Seiten", kurz:"Wie viele Ecken hat ein Sechseck?", typen:["f_ecken","f_form2","f_ecken"]},
    {id:3, name:"Körper erkennen", kurz:"Würfel · Quader · Kugel · Zylinder · Kegel · Pyramide", typen:["f_koerper","f_alltag","f_koerper"]},
    {id:4, name:"Ecken, Kanten, Flächen", kurz:"Ein Würfel hat 8 Ecken", typen:["f_eck","f_eck","f_rund"]},
    {id:5, name:"Symmetrie", kurz:"Ist das eine Spiegelachse?", typen:["f_sym"]},
    {id:6, name:"Umfang und Fläche", kurz:"Kästchen zählen · einmal außen herum", typen:["f_flaeche","f_umfang"]}
  ];
  const DATEN=[
    {id:1, name:"Strichlisten", kurz:"immer fünf im Bündel", typen:["d_strich"]},
    {id:2, name:"Diagramme lesen", kurz:"Wie viele? Was ist am beliebtesten?", typen:["d_diaLesen","d_diaMax","d_diaLesen"]},
    {id:3, name:"Mit Diagrammen rechnen", kurz:"Wie viele mehr? Wie viele insgesamt?", typen:["d_diaUnterschied","d_diaSumme"]},
    {id:4, name:"Sicher, möglich, unmöglich", kurz:"Kugeln aus dem Beutel ziehen", typen:["d_sicher","d_sicher","d_wahrsch"]},
    {id:5, name:"Kombinieren", kurz:"3 T-Shirts und 2 Hosen – wie viele Outfits?", typen:["d_kombi"]}
  ];
  const SCHRIFT=[
    {id:1, name:"Plus ohne Übertrag", kurz:"342 + 215 – Stelle für Stelle", typen:["sp_ohne"], sek:90},
    {id:2, name:"Plus mit Übertrag", kurz:"347 + 285 – die gemerkte Zahl nicht vergessen", typen:["sp_mit","sp_mit","sp_gross"], sek:100},
    {id:3, name:"Plus mit drei Zahlen", kurz:"245 + 138 + 76", typen:["sp_drei"], sek:120},
    {id:4, name:"Minus ohne Entbündeln", kurz:"586 − 243", typen:["sm_ohne"], sek:90},
    {id:5, name:"Minus mit Entbündeln", kurz:"532 − 248 – wenn es oben nicht reicht", typen:["sm_mit"], sek:120},
    {id:6, name:"Minus über die Null", kurz:"503 − 247 · 700 − 386", typen:["sm_null","sm_null","sm_mit"], sek:130},
    {id:7, name:"Malnehmen", kurz:"47 · 6 · 238 · 4 – für Klasse 4", typen:["sx_zwei","sx_drei","sx_zwei","sx_drei"], sek:120},
    {id:8, name:"Teilen: jede Stelle geht auf", kurz:"848 : 4 – Stelle für Stelle von links", typen:["sd_ohne"], sek:100},
    {id:9, name:"Teilen mit Herunterholen", kurz:"936 : 4 – der Rest wandert zur nächsten Ziffer", typen:["sd_mit","sd_mit","sd_gross"], sek:150},
    {id:10, name:"Teilen mit Rest", kurz:"938 : 4 = 234 Rest 2", typen:["sd_rest"], sek:150}
  ];
  const KALENDER=[
    {id:1, name:"Wochentage und Monate", kurz:"Was kommt nach Mittwoch? Was kommt vor März?", typen:["k_tag","k_monat","k_tag","k_monatNr"]},
    {id:2, name:"Wie lang ist ein Monat?", kurz:"30 oder 31 Tage · Wochen in Tage umrechnen", typen:["k_tageMonat","k_wochen","k_wissen","k_tageMonat"]},
    {id:3, name:"Stunden und Minuten", kurz:"1 Stunde = 60 Minuten · eine Viertelstunde", typen:["k_hMin","k_minAus","k_bruch","k_minAus"]},
    {id:4, name:"Sekunden, Stunden, Tage", kurz:"1 Minute = 60 Sekunden · 1 Tag = 24 Stunden", typen:["k_sek","k_tageStd","k_wissen"]},
    {id:5, name:"Mit dem Datum rechnen", kurz:"Welches Datum ist in 5 Tagen?", typen:["k_datum"]},
    {id:6, name:"Umwandeln mit allen Zahlen", kurz:"1 h 27 min = 87 min · 1 ¾ h · 85 s = 1 min 25 s", typen:["k_hMinIn","k_minAus2","k_bruchH","k_minSekIn","k_sekAus","k_vollMin"]},
    {id:7, name:"Wie spät ist es in …? Wie spät war es vor …?", kurz:"13.34 Uhr + 16 min · auch über die volle Stunde", typen:["zs_voll","zs_in","zs_in","zs_inH","zs_vor"]},
    {id:8, name:"Wie viel Zeit ist vergangen?", kurz:"17.44 Uhr bis 18.12 Uhr · 8.10 Uhr bis 11.05 Uhr", typen:["zs_dauer","zs_dauerH","zs_dauer","zs_dauerH","zs_voll"], sek:90},
    {id:9, name:"Zeit in Sachaufgaben", kurz:"Training · Fahrplan · Wann muss er losgehen?", typen:["zs_training","zs_fahrplan","zs_los","zs_woche","zs_takt","zs_beginn"], sek:100},
    {id:10, name:"Uhr: zwei Uhrzeiten, drei Schreibweisen", kurz:"3.10 Uhr und 15.10 Uhr · Viertel vor 8 = 7.45 Uhr = 19:45", typen:["u_beide","u_wortUhr","u_digitalWort","u_uhrPaar","u_nachm"], sek:60}
  ];
  const SACH2=[
    {id:1, name:"Was war am Anfang?", kurz:"rückwärts rechnen: Jetzt sind es 30 – wie viele waren es vorher?", typen:["q_anfangPlus","q_anfangMinus","q_anfangMal","q_anfangPlus","q_anfangMinus"], sek:90},
    {id:2, name:"Zwei Schritte: Plus und Minus", kurz:"erst weg, dann dazu – oder umgekehrt", typen:["q_plusMinus","q_bus"], sek:100},
    {id:3, name:"Zwei Schritte: erst Mal, dann Plus oder Minus", kurz:"4 Hefte zu je 3 € und ein Stift · Rückgeld", typen:["q_malPlus","q_malRueck"], sek:110},
    {id:4, name:"Zwei Schritte: zusammenzählen und teilen", kurz:"erst alles zusammen, dann gerecht verteilen", typen:["q_summeTeil","q_teilMinus"], sek:110},
    {id:5, name:"Alles gemischt", kurz:"genau lesen: Was rechne ich zuerst?", typen:["q_anfangPlus","q_anfangMinus","q_anfangMal","q_plusMinus","q_bus","q_malPlus","q_malRueck","q_summeTeil","q_teilMinus"], sek:110, mischen:true}
  ];
  // Zahlenstrahl als eigene Kachel (dieselben Aufgaben stecken auch in „Zahlen") – so lässt er sich einzeln als Hausaufgabe aufgeben
  const STRAHL=[
    {id:1, name:"Zahlenstrahl bis 100 ablesen", kurz:"jeder Zehner ist beschriftet", typen:["z_strahl"]},
    {id:2, name:"Wie viele Schritte sind es?", kurz:"die Sprünge zählen – nicht die Striche", typen:["s_schritte"]},
    {id:3, name:"Wie groß ist ein Schritt?", kurz:"nur Anfang und Ende stehen da", typen:["s_schritt","s_schritt","s_schritte"]},
    {id:4, name:"Die Zahl am Pfeil finden", kurz:"erst den Schritt, dann die Zahl", typen:["s_pfeil","s_pfeil","s_wo"]},
    {id:5, name:"Zahlenstrahl bis 1000 ablesen", kurz:"jeder Hunderter ist beschriftet", typen:["z_strahl1000"]},
    {id:6, name:"Schritt finden bis 1000", kurz:"10er, 20er, 25er, 50er, 100er", typen:["t_schritt","t_pfeil","t_pfeil","t_wo"]},
    {id:7, name:"Zahlenstrahl bis 1 Million", kurz:"Klasse 4 · große Schritte", typen:["m_strahl"], sek:70}
  ];
  // Bunte Mischung: jede Runde zieht 15 zufällige Aufgabenarten aus allen Themen der Klassenstufe (mix:true)
  const MIX=[
    {id:1, mix:true, sek:60, name:"Klasse 1 – bunt gemischt", kurz:"Plus und Minus bis 20 · Zahlen · Formen · Münzen · Wochentage", kern:["rp_20","rm_20","rz_10","rz_20","rp_20","rm_20"],
      typen:["z_ze","z_stelle2","z_vorNach","f_form","f_form2","g_cent","g_euro","k_tag","k_monat","d_strich","w_schwerer","l_messen"]},
    {id:2, mix:true, sek:75, name:"Klasse 2 – bunt gemischt", kurz:"Plus und Minus bis 100 · Einmaleins · Uhr · Geld · Körper · Diagramme", kern:["rp_100","rm_100","rx_kern","rx_alle","rd_alle","rz_100","rf_plus","rp_20","rm_20"],
      typen:["z_strahl","s_schritt","s_pfeil","z_vergleich","z_groesste","z_doppelt","z_haelfte","z_gerade","z_zehnerNachbar","k_tageMonat","k_wochen","k_hMin","k_bruch","u_wortUhr","u_uhrPaar",
             "f_ecken","f_koerper","f_alltag","f_sym","g_inCent","g_ausCent","g_legen","g_einkauf","l_messenVersetzt","l_mInCm","l_cmAus","w_schaetzen","d_diaLesen","d_diaMax"]},
    {id:3, mix:true, sek:100, name:"Klasse 3 – bunt gemischt", kurz:"Einmaleins und Teilen · bis 1000 · schriftlich · Kommazahlen · Zeit · Gewichte", kern:["rx_alle","rd_alle","rp_1000","rm_1000","rp_100","rm_100","rw_malZehner","rw_malZerlegen","rf_minus","rf_mal","rx_alle","rd_alle"],
      typen:["z_hze","z_stelle3","z_vorNach1000","t_schritt","t_pfeil","z_rundeZ","z_rundeH","z_rest","sp_mit","sp_drei","sm_mit","sm_null","k_minAus2","k_hMinIn","k_bruchH","k_sekAus","zs_in","zs_vor","zs_dauer","zs_training","zs_los",
             "u_beide","u_digitalWort","f_eck","f_rund","f_flaeche","f_umfang","g_ctKomma","g_kPlus","g_kMinus","g_reicht","g_mal","g_teil","g_rueckgeld","gs_plus","gs_minus","l_cmInMm","l_mmAus","l_rechneMinus","l_einheit",
             "w_stueckeKg","w_kgInG","w_gAus","w_bruch","w_rechneMinus","w_lInMl","w_lBruch","d_diaUnterschied","d_diaSumme","d_sicher","d_wahrsch","d_kombi","k_datum","q_anfangPlus","q_anfangMinus","q_plusMinus","q_bus","q_malPlus","q_malRueck","q_summeTeil"]},
    {id:4, mix:true, sek:120, name:"Vorschau auf Klasse 4", kurz:"Tonnen · Malnehmen schriftlich · Zeit in Stunden und Minuten · Dreisatz", kern:["rw_malZehner","rw_malZerlegen","rp_1000","rm_1000","rf_mal","rx_alle","rd_alle"],
      typen:["w_tInKg","w_kgAusT","w_lkw","sx_zwei","sx_drei","sp_gross","zs_dauerH","zs_inH","zs_woche","zs_fahrplan","g_dreisatz","g_gross","gs_plus3","f_flaeche","f_umfang","d_kombi","z_rundeH","l_seil","l_rechnePlus","w_mal","m_stelle","m_zerlegt","m_vorNach","m_runde","m_plus","m_mal","m_teil","q_teilMinus","q_malRueck","sd_ohne","sd_mit","sd_rest"]}
  ];
  // Mein Zoo: dieselben Aufgaben wie die Bunte Mischung, aber als Spiel – 10 Aufgaben, für je 5 richtige zieht ein Tier ein (zoo.js)
  const ZOO=MIX.map((s,i)=>Object.assign({}, s, {name:"Zoo-Runde Klasse "+(i+1), kurz:"10 Aufgaben aus allen Themen · ab 5 richtigen ein Tier · 10 von 10 = zwei Tiere"}));
  const STUFEN = {geld:GELD, gewichte:GEWICHTE, laengen:LAENGEN, zahlen:ZAHLEN, geo:GEO, daten:DATEN, schrift:SCHRIFT, kalender:KALENDER, mix:MIX, sach2:SACH2, strahl:STRAHL, zoo:ZOO}[WAS];
  const stufe=id=>STUFEN.find(s=>s.id===id);
  // [wen/was kaufst du, Preis in Cent, wer/was kostet]
  const WAREN=[["ein Heft",120,"Ein Heft"],["einen Stift",80,"Ein Stift"],["einen Radiergummi",50,"Ein Radiergummi"],["ein Lineal",150,"Ein Lineal"],["einen Kleber",195,"Ein Kleber"],["eine Schere",260,"Eine Schere"],
    ["einen Block",230,"Ein Block"],["einen Apfel",60,"Ein Apfel"],["ein Brötchen",45,"Ein Brötchen"],["einen Saft",140,"Ein Saft"],["einen Spitzer",75,"Ein Spitzer"],["eine Mappe",310,"Eine Mappe"]];
  const SCHAETZEN=[["Ein Bleistift ist ungefähr … lang.","15 cm",["15 mm","15 m"]],["Eine Tür ist ungefähr … hoch.","2 m",["2 cm","20 m"]],["Ein Fingernagel ist ungefähr … breit.","1 cm",["1 mm","1 m"]],
    ["Eine Ameise ist ungefähr … lang.","5 mm",["5 cm","5 m"]],["Ein Fußballfeld ist ungefähr … lang.","100 m",["100 cm","100 km"]],["Der Weg von Hamburg nach Berlin ist ungefähr … lang.","300 km",["300 m","300 cm"]],
    ["Ein Auto ist ungefähr … lang.","4 m",["4 cm","40 m"]],["Ein Heft ist ungefähr … hoch.","30 cm",["30 mm","3 m"]],["Ein Kind in der 3. Klasse ist ungefähr … groß.","1 m 35 cm",["13 cm","13 m"]],
    ["Ein Streichholz ist ungefähr … lang.","4 cm",["4 mm","40 cm"]],["Eine Bleistiftmine ist ungefähr … dick.","2 mm",["2 cm","20 cm"]],["Ein Klassenraum ist ungefähr … lang.","9 m",["9 cm","90 m"]],
    ["Ein Schulweg zu Fuß ist ungefähr … lang.","1 km",["1 cm","100 km"]],["Ein Tisch ist ungefähr … hoch.","75 cm",["75 mm","75 m"]],["Ein Blatt Papier ist ungefähr … dick.","weniger als 1 mm",["1 cm","1 m"]],
    ["Ein Bett ist ungefähr … lang.","2 m",["20 cm","20 m"]]];
  // ---------- Gewichte: Gewichtsstücke, Dinge zum Vergleichen und Schätzen ----------
  const GSTUECKE=[5000,2000,1000,500,200,100,50,20,10];
  const gName=v=>v>=1000 ? `${v/1000} kg` : `${v} g`;
  const gewText=c=>{ const k=Math.floor(c/1000), r=c%1000; return k&&r ? `${k} kg ${r} g` : k ? `${k} kg` : `${r} g`; };
  const tText=c=>{ const t=Math.floor(c/1000), r=c%1000; return t&&r ? `${t} t ${r} kg` : t ? `${t} t` : `${r} kg`; };
  function gewichtBild(v){
    const h=({10:34,20:38,50:42,100:48,200:54,500:60,1000:68,2000:76,5000:84})[v], w=h*0.92, farbe=v>=1000?["#94a3b8","#475569"]:["#fbbf24","#92400e"];
    return `<svg width="${w}" height="${h}" viewBox="0 0 46 50"><rect x="19" y="1" width="8" height="8" rx="3" fill="${farbe[1]}"/><path d="M11 9 H35 L43 47 Q43 49 41 49 H5 Q3 49 3 47 Z" fill="${farbe[0]}" stroke="${farbe[1]}" stroke-width="2"/>
      <text x="23" y="${v>=1000?31:30}" text-anchor="middle" font-size="${v>=1000?15:13}" font-weight="800" fill="#0f172a">${v>=1000?v/1000:v}</text><text x="23" y="43" text-anchor="middle" font-size="10" font-weight="800" fill="#0f172a">${v>=1000?"kg":"g"}</text></svg>`;
  }
  function zerlegeG(c){ const l=[]; GSTUECKE.forEach(s=>{ while(c>=s){ l.push(s); c-=s; } }); return l; }
  const gKette=l=>l.slice().sort((a,b)=>b-a).map(gName).join(" + ");
  // [Ding, ungefähres Gewicht in Gramm, Text]
  const WIEGT=[["eine Feder",1,"1 g"],["eine Büroklammer",1,"1 g"],["ein Brief",20,"20 g"],["ein Bleistift",5,"5 g"],["eine Tafel Schokolade",100,"100 g"],["ein Apfel",150,"150 g"],
    ["ein Päckchen Butter",250,"250 g"],["ein dickes Buch",500,"500 g"],["eine Packung Mehl",1000,"1 kg"],["eine Flasche Wasser",1000,"1 kg"],["ein voller Schulranzen",4000,"4 kg"],
    ["eine Katze",4000,"4 kg"],["ein Fahrrad",12000,"12 kg"],["ein Kind in der 3. Klasse",30000,"30 kg"],["ein Erwachsener",75000,"75 kg"]];
  const GSCHAETZEN=[["Ein Apfel wiegt ungefähr …","150 g",["15 g","15 kg"]],["Eine Tafel Schokolade wiegt …","100 g",["10 g","1 kg"]],["Ein Kind in der 3. Klasse wiegt ungefähr …","30 kg",["30 g","300 kg"]],
    ["Eine Packung Mehl wiegt …","1 kg",["1 g","100 kg"]],["Ein Brief wiegt ungefähr …","20 g",["2 kg","200 g"]],["Ein voller Schulranzen wiegt ungefähr …","4 kg",["40 g","40 kg"]],
    ["Eine Büroklammer wiegt ungefähr …","1 g",["100 g","1 kg"]],["Ein Päckchen Butter wiegt …","250 g",["25 g","25 kg"]],["Ein Fahrrad wiegt ungefähr …","12 kg",["120 g","120 kg"]],
    ["Ein Ei wiegt ungefähr …","60 g",["6 g","6 kg"]],["Eine Wassermelone wiegt ungefähr …","5 kg",["50 g","500 g"]],["Ein Hund (Schäferhund) wiegt ungefähr …","35 kg",["350 g","3 kg"]]];
  const TSCHAETZEN=[["Ein Auto wiegt ungefähr …","1 t",["10 kg","100 t"]],["Ein Elefant wiegt ungefähr …","5 t",["50 kg","500 kg"]],["Ein Pferd wiegt ungefähr …","500 kg",["5 kg","50 t"]],
    ["Ein voller Lastwagen wiegt ungefähr …","40 t",["40 kg","400 kg"]],["Ein Blauwal wiegt ungefähr …","150 t",["150 kg","15 kg"]],["Eine Kuh wiegt ungefähr …","600 kg",["6 kg","60 t"]],
    ["Ein Stadtbus wiegt ungefähr …","12 t",["12 kg","120 kg"]],["Ein Motorrad wiegt ungefähr …","200 kg",["2 kg","20 t"]]];
  const PACKUNG=[["Eine Tafel Schokolade","Tafeln",100],["Ein Päckchen Butter","Päckchen",250],["Eine Packung Nudeln","Packungen",500],["Ein Becher Joghurt","Becher",150],["Eine Dose Mais","Dosen",300]];
  // ---------- Schriftlich rechnen: untereinander, Stelle für Stelle ----------
  const STELLEN_Z=["Einer","Zehner","Hunderter","Tausender","Zehntausender"], STELLEN=STELLEN_Z;
  const ziffern=(n,W)=>String(n).padStart(W,"0").split("").map(Number);      // links = höchste Stelle
  function schriftGitter(a, fertig){
    const W=a.breite, G=a.komma, kurz=G?["1 ct","10 ct","1 €","10 €","100 €"]:["E","Z","H","T","ZT"], z=n=>String(n).padStart(G?3:1,"0").padStart(W," ").split("");
    // bei Geld steht zwischen Euro und Cent in jeder Zeile ein Komma: „Komma steht immer unter Komma"
    const mk=(zellen,zeichen)=> G ? zellen.slice(0,W-2).concat([`<span class="skomma">${zeichen}</span>`], zellen.slice(W-2)) : zellen;
    const kopf=`<span></span>`+mk(Array.from({length:W},(_,i)=>`<span class="sk">${kurz[W-1-i]}</span>`),"").join("");
    const reihen=a.zeilen.map((n,k)=>`<span class="so">${k?a.zeichen:""}</span>`+mk(z(n).map(c=>`<span class="sz">${c.trim()}</span>`),",").join("")+(G?`<span class="so">€</span>`:"")).join("");
    const ueb = a.uebertrag ? `<span class="so"></span>`+mk(Array.from({length:W},(_,i)=> i<W-1 ? (fertig?`<span class="su">${a.uebertrag[i]||""}</span>`:`<input class="su" data-u="${i}" type="text" inputmode="numeric" maxlength="1" autocomplete="off" aria-label="Übertrag">`) : `<span></span>`),"").join("")+(G?`<span></span>`:"") : "";
    const erg=`<span class="so">=</span>`+mk(z(a.soll).map((c,i)=> fertig?`<span class="sz sl">${c.trim()}</span>`:`<input class="sz" data-e="${i}" type="text" inputmode="numeric" maxlength="1" autocomplete="off" aria-label="${kurz[W-1-i]}">`),",").join("")+(G?`<span class="so">€</span>`:"");
    return `<div class="schrift" style="grid-template-columns:${G?`26px repeat(${W-2},42px) 10px repeat(2,42px) 22px`:`30px repeat(${W},46px)`}">${kopf}${G?"<span></span>":""}${reihen}${ueb}<span class="slinie" style="grid-column:1/-1"></span>${erg}</div>`;
  }
  const GELDSTELLEN=["Cent (1 ct)","Zehn-Cent (10 ct)","Euro (1 €)","Zehn-Euro (10 €)","Hundert-Euro"];
  function schriftPlus(zahlen, geld){
    const soll=zahlen.reduce((x,y)=>x+y,0), W=Math.max(String(soll).length, geld?3:1), d=zahlen.map(n=>ziffern(n,W)), ueb=[], schritte=[], STELLEN=geld?GELDSTELLEN:STELLEN_Z; let c=0, ohne="";
    for(let i=W-1;i>=0;i--){ const teil=d.map(x=>x[i]), s=teil.reduce((x,y)=>x+y,0)+c, st=STELLEN[W-1-i];
      if(teil.some(x=>x) || c) schritte.push(`<b>${st}:</b> ${teil.filter((x,k)=>x||k<2).join(" + ")}${c?` + ${c} (gemerkt)`:""} = ${s}${s>9?` → schreibe <b>${s%10}</b>, merke <b>${Math.floor(s/10)}</b>`:` → schreibe <b>${s}</b>`}`);
      ohne=String(teil.reduce((x,y)=>x+y,0)%10)+ohne; c=Math.floor(s/10); if(c && i>0) ueb[i-1]=c; }
    return {art:"schrift", zeichen:"+", zeilen:zahlen, soll, breite:W, uebertrag:ueb, tag:"schriftP", sollText:geld?komma(soll):String(soll), falle:+ohne!==soll?+ohne:0, falleArt:"uebertrag", komma:!!geld,
      frage:`Rechne schriftlich${geld?" – Komma unter Komma":""}: <span class="ziel">${zahlen.map(n=>geld?komma(n):n).join(" + ")}</span>`, schritte};
  }
  function schriftMinus(a,b,geld){
    const soll=a-b, W=String(a).length, da=ziffern(a,W), db=ziffern(b,W), schritte=[], STELLEN=geld?GELDSTELLEN:STELLEN_Z; let leih=0, falsch="";
    for(let i=W-1;i>=0;i--){ const oben=da[i]-leih, st=STELLEN[W-1-i]; let r, text;
      if(oben>=db[i]){ r=oben-db[i]; text=`${oben}${leih?" (einer ist schon entbündelt)":""} − ${db[i]} = <b>${r}</b>`; leih=0; }
      else if(oben<0){ r=9-db[i]; text=`Hier steht 0 und einer ist schon entbündelt. Hol dir zuerst einen ${STELLEN[W-i]||"Stellenwert"} von links: 9 − ${db[i]} = <b>${r}</b>`; leih=1; }
      else { r=oben+10-db[i]; text=`${oben}${leih?" (einer ist schon entbündelt)":""} − ${db[i]} geht nicht. Entbündle einen ${STELLEN[W-i]||"Stellenwert"} von links: ${oben+10} − ${db[i]} = <b>${r}</b>`; leih=1; }
      if(da[i]||db[i]||leih||i===W-1) schritte.push(`<b>${st}:</b> ${text}`); falsch=String(Math.abs(da[i]-db[i]))+falsch; }
    return {art:"schrift", zeichen:"−", zeilen:[a,b], soll, breite:W, tag:"schriftM", sollText:geld?komma(soll):String(soll), falle:+falsch!==soll?+falsch:0, falleArt:"kleinerGroesser", komma:!!geld,
      frage:`Rechne schriftlich${geld?" – Komma unter Komma":""}: <span class="ziel">${geld?komma(a):a} − ${geld?komma(b):b}</span>`, schritte};
  }
  function schriftMal(a,m){
    const soll=a*m, W=String(soll).length, da=ziffern(a,W), n=String(a).length, ueb=[], schritte=[]; let c=0;
    for(let i=W-1;i>=W-n;i--){ const p=da[i]*m+c; schritte.push(`<b>${STELLEN[W-1-i]}:</b> ${m} × ${da[i]} = ${da[i]*m}${c?` + ${c} (gemerkt) = ${p}`:""}${p>9?` → schreibe <b>${p%10}</b>, merke <b>${Math.floor(p/10)}</b>`:` → schreibe <b>${p}</b>`}`);
      c=Math.floor(p/10); if(c && i>0) ueb[i-1]=c; }
    if(c) schritte.push(`Die gemerkte <b>${c}</b> kommt ganz nach vorn.`);
    return {art:"schrift", zeichen:"·", zeilen:[], soll, breite:W, uebertrag:ueb, tag:"schriftMal", sollText:String(soll),
      frage:`Rechne schriftlich – fang bei den Einern an:<br><span class="ziel" style="font-size:30px">${a} · ${m}</span>`, schritte};
  }
  // ---------- Schriftlich teilen: Stelle für Stelle von links, mit dem Rechenweg wie im Heft ----------
  function schriftGeteilt(a, b){
    const q=Math.floor(a/b), r=a%b, d=String(a).split("").map(Number), zeilen=[], worte=[]; let cur=0, begonnen=false;
    const rechts=(s,i)=>" ".repeat(Math.max(0,i+2-String(s).length))+s;      // rechtsbündig unter die Stelle i (eine Spalte Platz für das Minus)
    d.forEach((z,i)=>{ cur=cur*10+z;
      if(!begonnen && cur<b && i<d.length-1){ worte.push(`${cur} ist kleiner als ${b} – nimm die nächste Ziffer dazu.`); return; }
      const qd=Math.floor(cur/b), ab=qd*b;
      if(begonnen) zeilen.push(rechts(String(cur).padStart(2," "),i));
      zeilen.push(rechts("−"+ab,i)); zeilen.push(rechts("─".repeat(Math.max(2,String(cur).length)),i));
      worte.push(`<b>${cur} : ${b} = ${qd}</b>${cur-ab?`, Rest ${cur-ab}`:""}${i<d.length-1?` → die ${d[i+1]} herunterholen`:""}`);
      cur-=ab; begonnen=true; });
    zeilen.push(rechts(String(cur),d.length-1));
    const kopf=` ${a} : ${b} = ${q}${r?" Rest "+r:""}`;
    return {art:"eingabe", felder:r?[F.quotG,F.zahl]:[F.gross], soll:r?q*100+r:q, tag:"schriftD", sollText:r?`${q} Rest ${r}`:String(q), probeD:[a,b,q,r],
      frage:`Rechne schriftlich – fang <b>links</b> an:<br><span class="ziel" style="font-size:32px">${a} : ${b}</span>`,
      erkl:`<div style="text-align:left;font-size:15px;line-height:1.6">${worte.join("<br>")}</div><pre style="display:inline-block;text-align:left;font:800 19px/1.25 Consolas,Menlo,monospace;color:#fff;margin:10px 0 2px">${kopf}\n${zeilen.join("\n")}</pre><div style="color:#94a3b8;font-size:14px">Probe: ${q} · ${b}${r?` + ${r}`:""} = ${a}</div>`};
  }
  const mitErkl=a=>{ a.erkl=`<div style="text-align:left;font-size:15px;line-height:1.6">${a.schritte.join("<br>")}</div>${schriftGitter(a,true)}`; return a; };
  const ohneUebertrag=(x,y)=>{ const W=Math.max(String(x).length,String(y).length), a=ziffern(x,W), b=ziffern(y,W); return a.every((v,i)=>v+b[i]<=9); };
  const ohneEntbuendeln=(x,y)=>{ const W=String(x).length, a=ziffern(x,W), b=ziffern(y,W); return a.every((v,i)=>v>=b[i]); };
  // ---------- Uhr mit Zeigern (kurzer blauer Stundenzeiger, langer roter Minutenzeiger – wie im Uhr-Trainer) ----------
  function uhrBild(h, m, px){
    const P=(w,r)=>[(50+r*Math.sin(w*Math.PI/180)).toFixed(1),(50-r*Math.cos(w*Math.PI/180)).toFixed(1)], wm=m*6, wh=(h%12)*30+m*0.5; let s=`<circle cx="50" cy="50" r="47" fill="#f8fafc" stroke="#7c3aed" stroke-width="3"/>`;
    for(let i=0;i<60;i++){ const a=P(i*6,i%5===0?40:43), b=P(i*6,45); s+=`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#0f172a" stroke-width="${i%5===0?1.6:0.6}"/>`; }
    for(let i=1;i<=12;i++){ const p=P(i*30,33); s+=`<text x="${p[0]}" y="${(+p[1]+3.6).toFixed(1)}" text-anchor="middle" font-size="10" font-weight="800" fill="#0f172a" font-family="Arial,sans-serif">${i}</text>`; }
    const ph=P(wh,22), pm=P(wm,37);
    s+=`<line x1="50" y1="50" x2="${ph[0]}" y2="${ph[1]}" stroke="#2563eb" stroke-width="4.5" stroke-linecap="round"/><line x1="50" y1="50" x2="${pm[0]}" y2="${pm[1]}" stroke="#dc2626" stroke-width="2.8" stroke-linecap="round"/><circle cx="50" cy="50" r="3" fill="#0f172a"/>`;
    return `<svg width="${px||150}" height="${px||150}" viewBox="0 0 100 100" role="img" aria-label="Uhr">${s}</svg>`;
  }
  // Uhrzeit in Worten – nur Ausdrücke, die überall in Deutschland gelten (h: 1 bis 12, m: Vielfaches von 5)
  function uhrWort(h, m){
    const n=x=>((x-1)%12+12)%12+1, nach=n(h), vor=n(h+1);
    return m===0 ? `${nach} Uhr` : m===15 ? `Viertel nach ${nach}` : m===30 ? `halb ${vor}` : m===45 ? `Viertel vor ${vor}` : m===25 ? `5 Minuten vor halb ${vor}` : m===35 ? `5 Minuten nach halb ${vor}`
         : m<25 ? `${m} Minuten nach ${nach}` : `${60-m} Minuten vor ${vor}`;
  }
  const uhrZeit=(h,m)=>`${h}.${zz(m)} Uhr`;
  function uhrZufall(){ return [rnd(1,11), aus([0,5,10,15,20,25,30,35,40,45,50,55])]; }
  // typische Verwechslungen: Zeiger vertauscht, eine Stunde daneben, „vor" und „nach" gespiegelt
  function uhrFallen(h, m){
    const l=[], hh=(m/5)||12, mm=(h*5)%60; if((hh!==h || mm!==m) && hh<12) l.push([hh, mm]);      // Stunde 12 auslassen – sonst entstünde „24.55 Uhr"
    l.push([h%11+1, m]); if(m%30) l.push([h, 60-m]); l.push([(h+5)%11+1, (m+30)%60]); l.push([(h+2)%11+1, m]);
    const s=new Set([h+":"+m]); return l.filter(x=>{ const k=x[0]+":"+x[1]; if(s.has(k)) return false; s.add(k); return true; });
  }
  // ---------- Zahlen, Formen, Daten: Bilder ----------
  function zeBild(z,e){
    const stange=`<svg width="14" height="74" viewBox="0 0 14 74"><rect x="1" y="1" width="12" height="72" rx="2" fill="#60a5fa" stroke="#1e3a8a" stroke-width="1.5"/>${[1,2,3,4,5,6,7,8,9].map(i=>`<line x1="1" y1="${1+i*7.2}" x2="13" y2="${1+i*7.2}" stroke="#1e3a8a" stroke-width="1"/>`).join("")}</svg>`;
    const wuerfel=`<svg width="14" height="14" viewBox="0 0 14 14"><rect x="1" y="1" width="12" height="12" rx="2" fill="#facc15" stroke="#a16207" stroke-width="1.5"/></svg>`;
    return stange.repeat(z)+(e?`<span style="display:inline-grid;grid-template-columns:repeat(${Math.min(e,5)},14px);gap:3px;margin-left:8px">${wuerfel.repeat(e)}</span>`:"");
  }
  function strahlBild(max, wert){
    const X=v=>12+v*(296/max), schritt=max/100; let s=`<line x1="6" y1="40" x2="314" y2="40" stroke="#e2e8f0" stroke-width="2"/>`;
    for(let i=0;i<=100;i++){ const v=i*schritt, lang=i%10===0?13:i%5===0?9:5;
      s+=`<line x1="${X(v)}" y1="${40-lang}" x2="${X(v)}" y2="${40+lang}" stroke="#e2e8f0" stroke-width="${i%10===0?1.8:0.8}"/>`;
      if(i%10===0) s+=`<text x="${X(v)}" y="68" text-anchor="middle" font-size="${max>100?9:11}" font-weight="700" fill="#e2e8f0">${v}</text>`; }
    s+=`<path d="M${X(wert)} 26 l-6 -14 h12 z" fill="#f87171"/><line x1="${X(wert)}" y1="4" x2="${X(wert)}" y2="14" stroke="#f87171" stroke-width="3"/>`;
    return `<svg viewBox="0 0 320 74" role="img" aria-label="Zahlenstrahl">${s}</svg>`;
  }
  // Zahlenstrahl, bei dem nur Anfang und Ende beschriftet sind. o: {pfeil:Strich-Nr., buchstaben:{Strich-Nr.:"A"}, alle:true (jeden Strich beschriften)}
  function leerStrahl(von, bis, n, o){
    o=o||{}; const X=i=>16+i*(288/n), schritt=(bis-von)/n; let s=`<line x1="8" y1="46" x2="312" y2="46" stroke="#e2e8f0" stroke-width="2"/>`;
    for(let i=0;i<=n;i++){ const rand=i===0||i===n;
      s+=`<line x1="${X(i)}" y1="${rand?32:36}" x2="${X(i)}" y2="${rand?60:56}" stroke="#e2e8f0" stroke-width="${rand?2.4:1.4}"/>`;
      const lang=bis>=10000;
      if(rand || (o.alle && ((n<=10 && !lang) || i%2===0))) s+=`<text x="${rand&&lang?(i===0?X(i)-8:X(i)+8):X(i)}" y="${!rand&&lang&&i%4===2?70:76}" text-anchor="${rand&&lang?(i===0?"start":"end"):"middle"}" font-size="${rand?(lang?10:12):(lang?6.5:n>10||bis>=1000?8.5:10)}" font-weight="${rand?800:600}" fill="${rand?"#fde68a":"#93c5fd"}">${lang?fmt(von+i*schritt):von+i*schritt}</text>`;
      if(o.buchstaben && o.buchstaben[i]) s+=`<text x="${X(i)}" y="24" text-anchor="middle" font-size="15" font-weight="800" fill="#f87171">${o.buchstaben[i]}</text><line x1="${X(i)}" y1="27" x2="${X(i)}" y2="34" stroke="#f87171" stroke-width="2"/>`; }
    if(o.pfeil!==undefined) s+=`<path d="M${X(o.pfeil)} 33 l-6 -13 h12 z" fill="#f87171"/><line x1="${X(o.pfeil)}" y1="6" x2="${X(o.pfeil)}" y2="22" stroke="#f87171" stroke-width="3"/>`;
    if(o.bogen) for(let i=0;i<n;i++) s+=`<path d="M${X(i)} 30 Q${(X(i)+X(i+1))/2} ${14} ${X(i+1)} 30" fill="none" stroke="#34d399" stroke-width="1.6"/>`;
    return `<svg viewBox="0 0 320 82" role="img" aria-label="Zahlenstrahl von ${von} bis ${bis}" style="width:100%;height:auto;display:block">${s}</svg>`;
  }
  // [von, bis, Anzahl der Schritte]
  const STRAHLMIO=[[0,1000000,10],[0,100000,10],[200000,300000,10],[0,500000,5],[400000,500000,4],[0,10000,10],[50000,60000,10],[0,1000000,20],[0,200000,8],[0,1000000,5],[700000,800000,5]];
  // große Zahlen in Dreiergruppen: 347 582 (schmale Lücke, kein Punkt – so steht es im Schulbuch)
  const fmt=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,"\u202f");
  const MSTELLE=["Hunderttausender","Zehntausender","Tausender","Hunderter","Zehner","Einer"], MKURZ=["HT","ZT","T","H","Z","E"];
  const QKIND=[["Mia","Sie","sie"],["Ben","Er","er"],["Lena","Sie","sie"],["Tom","Er","er"],["Emma","Sie","sie"],["Paul","Er","er"],["Sara","Sie","sie"],["Nico","Er","er"]];
  const QDING=["Murmeln","Sticker","Karten","Bonbons","Kekse","Perlen","Stifte"];
  // Sachaufgabe mit einer Zahl als Antwort. falle = Ergebnis, wenn nur der erste Schritt gerechnet wurde.
  function sach(text, frage, soll, falle, schritte, antwort, probe){
    return eingabe(`<span style="display:block;font-weight:500;font-size:19px;line-height:1.5;text-align:left">${text}</span><span class="ziel" style="display:block;margin-top:8px">${frage}</span>`, [F.zahl], soll,
      {tag:"zweischritt", sollText:String(soll), falle:falle!==soll?falle:0, falleArt:"einSchritt", erkl:`<div style="text-align:left">${schritte.join("<br>")}</div><div style="margin-top:8px"><b>Antwort:</b> ${antwort}</div>${probe?`<div style="color:#94a3b8;font-size:14px">${probe}</div>`:""}`});
  }
  const STRAHL100=[[0,100,10],[0,50,5],[0,20,10],[0,100,20],[0,50,10],[0,40,8],[0,30,6],[20,70,5],[0,10,5],[0,60,6],[50,100,10],[0,80,8],[0,100,5],[40,60,10],[0,20,4]];
  const STRAHL1000=[[0,1000,10],[0,500,5],[0,1000,20],[0,200,10],[200,300,10],[0,400,8],[500,1000,5],[0,100,4],[300,400,4],[100,200,5],[0,600,6],[400,500,5],[0,1000,5],[600,700,10],[0,300,6]];
  function strahlAufgabe(liste, art){
    const [von,bis,n]=aus(liste), d=bis-von, schritt=d/n, i=rnd(1,n-1), wert=von+i*schritt;
    const weg=`<b>1.</b> Von ${von} bis ${bis} sind es <b>${d}</b>.<br><b>2.</b> Zähle die <b>Schritte</b> (die Sprünge – den ersten Strich zählst du nicht mit): <b>${n}</b>.<br><b>3.</b> ${d} ÷ ${n} = <b>${schritt}</b>. Jeder Schritt ist <b>${schritt}</b> groß.`;
    const beschriftet=`<div style="margin-top:8px">Schreib jetzt an jeden Strich seine Zahl:</div>${leerStrahl(von,bis,n,{alle:true})}`;
    if(art==="schritte") return eingabe(`Wie viele <span class="ziel">Schritte</span> sind es von ${von} bis ${bis}?`, [F.gross], n, {bild:leerStrahl(von,bis,n), lineal:true, tag:"strahl", sollText:String(n),
      erkl:`Zähle die <b>Sprünge</b> zwischen den Strichen, nicht die Striche selbst. Es sind ${n+1} Striche, aber nur <b>${n} Schritte</b>.${leerStrahl(von,bis,n,{bogen:true})}`});
    if(art==="schritt") return eingabe(`Wie <span class="ziel">groß ist ein Schritt</span> auf diesem Zahlenstrahl?`, [F.gross], schritt, {bild:leerStrahl(von,bis,n), lineal:true, tag:"strahl", sollText:String(schritt), erkl:weg+beschriftet});
    if(art==="wo"){ const stellen=mische(Array.from({length:n-1},(_,k)=>k+1)).slice(0,3).sort((a,b)=>a-b), b={}; stellen.forEach((k,j)=>b[k]="ABC"[j]); const ziel=aus(stellen);
      return {art:"wahl", frage:`Bei welchem Buchstaben steht die <span class="ziel">${von+ziel*schritt}</span>?`, bild:leerStrahl(von,bis,n,{buchstaben:b}), lineal:true, optionen:stellen.map(k=>b[k]), ok:b[ziel], tag:"strahl", sollText:b[ziel],
        erkl:weg+`<br><b>4.</b> Zähle in ${schritt}er-Schritten, bis du bei ${von+ziel*schritt} bist: Dort steht <b>${b[ziel]}</b>.`+beschriftet}; }
    const kette=Array.from({length:i+1},(_,k)=>von+k*schritt);
    return eingabe("Welche Zahl gehört zum Pfeil?", [F.gross], wert, {bild:leerStrahl(von,bis,n,{pfeil:i}), lineal:true, tag:"strahl", sollText:String(wert),
      erkl:weg+`<br><b>4.</b> Zähle in ${schritt}er-Schritten bis zum Pfeil: ${kette.length>7?kette.slice(0,3).join(", ")+" … "+kette.slice(-2).join(", "):kette.join(", ")} → <b>${wert}</b>.`+beschriftet});
  }
  const FORMFARBE=["#60a5fa","#f472b6","#34d399","#fbbf24","#a78bfa","#fb923c"];
  const eck=(n,r,dreh)=>Array.from({length:n},(_,i)=>{ const w=(dreh||-90)*Math.PI/180+i*2*Math.PI/n; return `${(50+r*Math.cos(w)).toFixed(1)},${(50+r*Math.sin(w)).toFixed(1)}`; }).join(" ");
  function formBild(name){
    const f=aus(FORMFARBE), st=`fill="${f}" stroke="#0f172a" stroke-width="3"`;
    const innen = name==="Kreis" ? `<circle cx="50" cy="50" r="38" ${st}/>` : name==="Dreieck" ? `<polygon points="${aus(["50,10 90,86 10,86","14,84 86,84 30,18","12,20 88,34 40,88"])}" ${st}/>`
      : name==="Quadrat" ? `<rect x="16" y="16" width="68" height="68" ${st}/>` : name==="Rechteck" ? (Math.random()<0.6?`<rect x="6" y="26" width="88" height="48" ${st}/>`:`<rect x="28" y="6" width="44" height="88" ${st}/>`)
      : name==="Fünfeck" ? `<polygon points="${eck(5,42)}" ${st}/>` : `<polygon points="${eck(6,42,0)}" ${st}/>`;
    return `<svg width="130" height="130" viewBox="0 0 100 100" role="img">${innen}</svg>`;
  }
  const FORMINFO={ Kreis:"Ein <b>Kreis</b> ist ganz rund – er hat keine Ecken.", Dreieck:"Ein <b>Dreieck</b> hat 3 Ecken und 3 Seiten.", Quadrat:"Ein <b>Quadrat</b> hat 4 Ecken und 4 <b>gleich lange</b> Seiten.",
    Rechteck:"Ein <b>Rechteck</b> hat 4 Ecken. Gegenüberliegende Seiten sind gleich lang – zwei lange und zwei kurze.", "Fünfeck":"Ein <b>Fünfeck</b> hat 5 Ecken und 5 Seiten.", Sechseck:"Ein <b>Sechseck</b> hat 6 Ecken und 6 Seiten – wie eine Bienenwabe." };
  const KOERPER={
    "Würfel":  {ekf:[8,12,6], info:"Ein <b>Würfel</b> hat 6 gleich große quadratische Flächen."},
    "Quader":  {ekf:[8,12,6], info:"Ein <b>Quader</b> hat 6 rechteckige Flächen – wie ein Schuhkarton."},
    "Kugel":   {info:"Eine <b>Kugel</b> ist überall rund – sie hat keine Ecken und keine Kanten und kann in jede Richtung rollen."},
    "Zylinder":{info:"Ein <b>Zylinder</b> hat oben und unten einen Kreis – wie eine Dose."},
    "Kegel":   {info:"Ein <b>Kegel</b> hat unten einen Kreis und oben eine Spitze – wie eine Eistüte."},
    "Pyramide":{ekf:[5,8,5], info:"Eine <b>Pyramide</b> hat unten ein Viereck und vier Dreiecke, die sich in einer Spitze treffen."} };
  function koerperBild(name){
    const a='fill="#7dd3fc" stroke="#0f172a" stroke-width="2.5" stroke-linejoin="round"', b='fill="#38bdf8" stroke="#0f172a" stroke-width="2.5" stroke-linejoin="round"', c='fill="#0ea5e9" stroke="#0f172a" stroke-width="2.5" stroke-linejoin="round"';
    const innen = name==="Würfel" ? `<polygon points="20,34 68,34 68,82 20,82" ${b}/><polygon points="20,34 36,18 84,18 68,34" ${a}/><polygon points="68,34 84,18 84,66 68,82" ${c}/>`
      : name==="Quader" ? `<polygon points="6,44 76,44 76,80 6,80" ${b}/><polygon points="6,44 22,28 92,28 76,44" ${a}/><polygon points="76,44 92,28 92,64 76,80" ${c}/>`
      : name==="Kugel" ? `<circle cx="50" cy="50" r="38" ${b}/><ellipse cx="50" cy="50" rx="38" ry="12" fill="none" stroke="#0f172a" stroke-width="1.5" stroke-dasharray="4 4"/><ellipse cx="36" cy="34" rx="9" ry="6" fill="#e0f2fe" opacity=".8"/>`
      : name==="Zylinder" ? `<path d="M22 24 V76 A28 10 0 0 0 78 76 V24" ${b}/><ellipse cx="50" cy="24" rx="28" ry="10" ${a}/>`
      : name==="Kegel" ? `<path d="M50 10 L22 78 A28 10 0 0 0 78 78 Z" ${b}/><path d="M22 78 A28 10 0 0 1 78 78" fill="none" stroke="#0f172a" stroke-width="1.5" stroke-dasharray="4 4"/>`
      : `<polygon points="50,10 14,74 62,88" ${b}/><polygon points="50,10 62,88 90,66" ${c}/><path d="M14 74 L42 56 L90 66" fill="none" stroke="#0f172a" stroke-width="1.5" stroke-dasharray="4 4"/>`;
    return `<svg width="140" height="140" viewBox="0 0 100 100" role="img">${innen}</svg>`;
  }
  function symBild(l, achse){
    return `<svg width="150" height="150" viewBox="0 0 100 100" role="img"><text x="50" y="80" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="84" font-weight="700" fill="#fde68a">${l}</text>
      ${achse==="senkrecht"?`<line x1="50" y1="2" x2="50" y2="98"`:`<line x1="2" y1="50" x2="98" y2="50"`} stroke="#f87171" stroke-width="2.5" stroke-dasharray="6 5"/></svg>`;
  }
  function gitterBild(a,b){
    const k=24, W=10*k+2, Hh=7*k+2; let s="";
    for(let x=0;x<=10;x++) s+=`<line x1="${1+x*k}" y1="1" x2="${1+x*k}" y2="${1+7*k}" stroke="#475569" stroke-width="1"/>`;
    for(let y=0;y<=7;y++) s+=`<line x1="1" y1="${1+y*k}" x2="${1+10*k}" y2="${1+y*k}" stroke="#475569" stroke-width="1"/>`;
    s+=`<rect x="${1+k}" y="${1+k}" width="${a*k}" height="${b*k}" fill="rgba(250,204,21,.35)" stroke="#facc15" stroke-width="3"/>`;
    return `<svg viewBox="0 0 ${W} ${Hh}" role="img" aria-label="Kästchenpapier">${s}</svg>`;
  }
  function strichBild(n){
    const buendel=k=>`<svg width="52" height="54" viewBox="0 0 52 54">${Array.from({length:Math.min(k,4)},(_,i)=>`<line x1="${8+i*10}" y1="6" x2="${8+i*10}" y2="48" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round"/>`).join("")}${k===5?`<line x1="2" y1="44" x2="46" y2="10" stroke="#fbbf24" stroke-width="4" stroke-linecap="round"/>`:""}</svg>`;
    let s=""; for(let r=n;r>0;r-=5) s+=buendel(Math.min(r,5)); return s;
  }
  const TIERE=[["Hunde","#60a5fa"],["Katzen","#f472b6"],["Pferde","#fbbf24"],["Hasen","#34d399"],["Vögel","#a78bfa"],["Fische","#fb923c"]];
  function diaDaten(){ const t=mische(TIERE).slice(0,4), w=mische([1,2,3,4,5,6,7,8,9,10]).slice(0,4); return t.map((x,i)=>[x[0],w[i],x[1]]); }
  function balkenBild(d){
    const Y=v=>150-v*13; let s="";
    for(let v=0;v<=10;v++){ s+=`<line x1="30" y1="${Y(v)}" x2="312" y2="${Y(v)}" stroke="${v===0?"#e2e8f0":"#475569"}" stroke-width="${v===0?2:1}"/><text x="24" y="${Y(v)+4}" text-anchor="end" font-size="10" font-weight="700" fill="#e2e8f0">${v}</text>`; }
    d.forEach((x,i)=>{ const x0=46+i*68; s+=`<rect x="${x0}" y="${Y(x[1])}" width="44" height="${x[1]*13}" fill="${x[2]}" stroke="#0f172a" stroke-width="1.5"/><text x="${x0+22}" y="166" text-anchor="middle" font-size="12" font-weight="700" fill="#e2e8f0">${x[0]}</text>`; });
    return `<svg viewBox="0 0 320 172" role="img" aria-label="Säulendiagramm: Lieblingstiere">${s}</svg>`;
  }
  const FARBEN={rot:"#ef4444", blau:"#3b82f6", gelb:"#facc15", grün:"#22c55e"};
  function beutelBild(kugeln){
    const n=kugeln.length, pro=Math.min(5,n);
    const k=kugeln.map((f,i)=>`<circle cx="${50-(pro-1)*8+(i%pro)*16}" cy="${99-Math.floor(i/pro)*16}" r="7" fill="${FARBEN[f]}" stroke="#0f172a" stroke-width="1.5"/>`).join("");
    return `<svg width="170" height="170" viewBox="0 0 100 116" role="img" aria-label="Beutel mit Kugeln"><path d="M34 14 Q50 22 66 14 L62 28 Q96 52 90 96 Q88 112 50 112 Q12 112 10 96 Q4 52 38 28 Z" fill="#334155" stroke="#94a3b8" stroke-width="2.5"/><path d="M36 28 H64" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>${k}</svg>`;
  }
  // Zu welchem Thema (Trainer) gehört eine Aufgabenart? Gebraucht für die Auswertung der Bunten Mischung.
  function THEMA(typ){ const p=String(typ).split("_")[0];
    return ({z:["zahlen","🔢 Zahlen"],s:["zahlen","🔢 Zahlen"],t:["zahlen","🔢 Zahlen"],k:["kalender","📅 Kalender und Zeit"],zs:["kalender","📅 Kalender und Zeit"],u:["kalender","📅 Kalender und Zeit"],
      g:["geld","💶 Geld"],gs:["geld","💶 Geld"],f:["geo","📐 Formen und Körper"],w:["gewichte","⚖️ Gewichte und Liter"],l:["laengen","📏 Längen"],d:["daten","📊 Daten und Zufall"],
      sp:["schrift","✍️ Schriftlich rechnen"],sm:["schrift","✍️ Schriftlich rechnen"],sx:["schrift","✍️ Schriftlich rechnen"],sd:["schrift","✍️ Schriftlich rechnen"],
      rp:["plus","➕ Plus"],rm:["minus","➖ Minus"],rx:["einmaleins","✖️ Einmaleins"],rd:["einsdurcheins","➗ Einsdurcheins"],rz:["zerlegen","🧩 Zerlegen"],
      rw:["halbschriftlich","🪜 Rechenwege"],rf:["platz","🔍 Fehlende Zahl"],m:["zahlen","🔢 Zahlen"],q:["sach2","📚 Sachaufgaben in zwei Schritten"]})[p] || ["mix","🎲 Verschiedenes"]; }
  function eingabe(frage, felder, soll, o){ return Object.assign({art:"eingabe", frage, felder, soll}, o); }
  // reine Rechenaufgabe: große Aufgabe, ein Zahlenfeld
  function rechen(text, soll, probe, erkl){ return eingabe(`<span class="ziel" style="font-size:34px">${text}</span>`, [F.zahl], soll, {tag:"kopf", sollText:String(soll), erkl, probe}); }
  const BAU={
    g_cent(){ let l,sum; do{ l=[]; const n=rnd(2,5); for(let i=0;i<n;i++) l.push(aus([1,2,5,10,10,20,20,50])); sum=l.reduce((a,b)=>a+b,0); }while(sum>=100 || l.filter(x=>x===50).length>1);
      l.sort((a,b)=>b-a);
      return eingabe("Wie viel Geld ist das?", [F.ct], sum, {bild:l.map(v=>geldBild(v)).join(""), tag:"zaehlen", sollText:`${sum} ct`,
        erkl:`Fang mit der größten Münze an und zähle weiter: ${summenKette(l)} = <b>${sum} ct</b>.`}); },
    g_euro(){ const c=rnd(1,19)*100+aus([0,5,10,20,25,50,55,70,75,90,12,37]); const l=zerlege(c);
      return eingabe("Wie viel Geld ist das?", [F.eur,F.ct], c, {bild:mische(l).map(v=>geldBild(v)).join(""), tag:"zaehlen", sollText:euroCent(c),
        erkl:`Zähle zuerst die <b>Euro</b>, dann die <b>Cent</b>: ${summenKette(l)} = <b>${euroCent(c)}</b>.`}); },
    g_inCent(){ const e=rnd(1,9), r=aus([rnd(1,9),rnd(10,99),rnd(10,99)]), c=e*100+r;
      return eingabe(`<span class="ziel">${e} € ${r} ct</span> = wie viele Cent?`, [F.ct], c, {tag:"umrechnen", sollText:`${c} ct`,
        erkl:`<b>1 € sind 100 ct.</b> ${e===1?"Dazu":`${e} € sind ${e*100} ct, dazu`} noch ${r} ct: ${e*100} + ${r} = <b>${c} ct</b>.`}); },
    g_ausCent(){ const c=rnd(1,9)*100+aus([rnd(1,9),rnd(10,99),rnd(10,99)]);
      return eingabe(`<span class="ziel">${c} ct</span> = wie viele Euro und Cent?`, [F.eur,F.ct], c, {tag:"umrechnen", sollText:euroCent(c), streng:true,
        erkl:`<b>100 ct sind 1 €.</b> In ${c} ct stecken ${Math.floor(c/100)} volle Hunderter – das sind ${Math.floor(c/100)} €. Übrig bleiben ${c%100} ct: <b>${euroCent(c)}</b>.`}); },
    g_kommaLesen(){ const c=rnd(1,19)*100+aus([5,8,50,rnd(10,99),rnd(1,9)]);
      return eingabe(`<span class="ziel">${komma(c)}</span> = wie viele Euro und Cent?`, [F.eur,F.ct], c, {tag:"komma", sollText:euroCent(c), streng:true,
        erkl:`Vor dem Komma stehen die <b>Euro</b>, dahinter immer <b>zwei Stellen</b> für die Cent: ${komma(c)} = <b>${euroCent(c)}</b>.`}); },
    g_kommaWahl(){ const e=rnd(1,19), r=aus([rnd(1,9),rnd(1,9),rnd(10,99)]), c=e*100+r, ok=komma(c);
      const falsch=[...new Set([`${e},${r} €`, `${e},${r}0 €`, `${e}${zz(r)} €`, `0,${e}${r} €`])].filter(x=>x!==ok).slice(0,3);
      return {art:"wahl", frage:`Wie schreibt man <span class="ziel">${e} € ${r} ct</span> mit Komma?`, optionen:mische([ok].concat(falsch)), ok, tag:"komma", sollText:ok,
        erkl:`Hinter dem Komma stehen immer <b>zwei Stellen</b> für die Cent. ${r} ct schreibt man als „${zz(r)}“: <b>${ok}</b>.`}; },
    g_legen(){ const c=rnd(2,38)*25 + aus([0,0,5,10,20]);
      return {art:"legen", frage:`Lege genau <span class="ziel">${komma(c)}</span>.`, soll:c, kasse:[500,200,100,50,20,10,5], tag:"legen", sollText:komma(c),
        erkl:`Eine Möglichkeit: ${summenKette(zerlege(c))} = <b>${komma(c)}</b>.`}; },
    g_einkauf(){ let a,b; do{ a=aus(WAREN); b=aus(WAREN); }while(a===b); const c=a[1]+b[1];
      return eingabe(`Du kaufst ${a[0]} für <span class="ziel">${komma(a[1])}</span> und ${b[0]} für <span class="ziel">${komma(b[1])}</span>.<br>Wie viel kostet das zusammen?`, [F.eur,F.ct], c, {tag:"rechnen", sollText:euroCent(c), streng:true,
        erkl:`Rechne in Cent: ${a[1]} ct + ${b[1]} ct = ${c} ct. Das sind <b>${euroCent(c)}</b>.`}); },
    g_rueckgeld(){ const w=aus(WAREN), gibt=w[1]<400 && Math.random()<0.6 ? 500 : 1000, c=gibt-w[1], bisVoll=(100-w[1]%100)%100, voll=w[1]+bisVoll;
      return eingabe(`${w[2]} kostet <span class="ziel">${komma(w[1])}</span>. Du bezahlst mit einem <span class="ziel">${gibt/100}-€-Schein</span>.<br>Wie viel bekommst du zurück?`, [F.eur,F.ct], c, {tag:"rechnen", sollText:euroCent(c), streng:true,
        erkl: bisVoll ? `Zähle weiter bis zum Schein: von ${komma(w[1])} bis ${voll/100} € sind es ${bisVoll} ct, von ${voll/100} € bis ${gibt/100} € noch ${(gibt-voll)/100} €. Zusammen <b>${euroCent(c)}</b>.`
                      : `${gibt/100} € − ${w[1]/100} € = <b>${euroCent(c)}</b>.`}); },
    // ===== Zahlen bis 1000 =====
    z_ze(){ const z=rnd(1,9), e=rnd(0,9);
      return eingabe(`<span class="ziel">${z} Zehner und ${e} Einer</span> – welche Zahl ist das?`, [F.zahl], z*10+e, {bild:zeBild(z,e), tag:"stelle", sollText:String(z*10+e),
        erkl:`Die Zehner stehen vorn, die Einer hinten: ${z} Zehner sind ${z*10}, dazu ${e} Einer: <b>${z*10+e}</b>.`}); },
    z_stelle2(){ const n=rnd(11,99), was=aus(["Zehner","Einer"]), r=was==="Zehner"?Math.floor(n/10):n%10; if(!r) return BAU.z_stelle2();
      return eingabe(`Wie viele <span class="ziel">${was}</span> hat die Zahl <span class="ziel">${n}</span>?`, [F.zahl], r, {tag:"stelle", sollText:String(r),
        erkl:`${n} = ${Math.floor(n/10)} Zehner und ${n%10} Einer. Die Zehner stehen <b>vorn</b>, die Einer <b>hinten</b>.`}); },
    z_vorNach(){ const n=aus([rnd(2,98),rnd(1,9)*10,rnd(1,9)*10+9]), vor=Math.random()<0.5, r=vor?n-1:n+1;
      return eingabe(`Welche Zahl kommt direkt <span class="ziel">${vor?"vor":"nach"} ${n}</span>?`, [F.zahl], r, {tag:"nachbar", sollText:String(r),
        erkl:`${vor?"Der Vorgänger ist immer 1 kleiner":"Der Nachfolger ist immer 1 größer"}: ${n} ${vor?"−":"+"} 1 = <b>${r}</b>.`}); },
    z_zehnerNachbar(){ let n; do{ n=rnd(11,98); }while(n%10===0); const a=Math.floor(n/10)*10, ok=`${a} und ${a+10}`;
      const falsch=[`${a-10} und ${a}`,`${a+10} und ${a+20}`,`${n-1} und ${n+1}`];
      return {art:"wahl", frage:`Zwischen welchen <span class="ziel">Zehnerzahlen</span> liegt <span class="ziel">${n}</span>?`, optionen:mische([ok].concat(falsch)), ok, tag:"nachbar", sollText:ok,
        erkl:`Die Nachbarzehner sind der Zehner davor und der Zehner danach: <b>${a}</b> &lt; ${n} &lt; <b>${a+10}</b>.`}; },
    z_strahl(){ const n=rnd(3,97);
      return eingabe("Auf welche Zahl zeigt der Pfeil?", [F.zahl], n, {bild:strahlBild(100,n), lineal:true, tag:"strahl", sollText:String(n),
        erkl:`Such den beschrifteten Zehner davor: <b>${Math.floor(n/10)*10}</b>. Von dort sind es noch ${n%10} kleine Striche: <b>${n}</b>.`}); },
    z_vergleich(){ let a,b; const fall=rnd(0,3); if(fall===0){ a=rnd(12,98); b=+String(a).split("").reverse().join(""); } else if(fall===1){ a=rnd(11,99); b=a; } else { a=rnd(10,99); b=rnd(10,99); }
      const ok=a<b?"<":a>b?">":"=";
      return {art:"wahl", frage:`Welches Zeichen passt?<br><span class="ziel">${a} ☐ ${b}</span>`, optionen:["<","=",">"], ok, tag:"zvergleich", sollText:`${a} ${ok} ${b}`,
        erkl:`Vergleiche zuerst die <b>Zehner</b>, dann die Einer. Das Zeichen ist wie ein Krokodilmaul: Es schnappt immer nach der größeren Zahl. <b>${a} ${ok} ${b}</b>`}; },
    z_groesste(){ const s=new Set(); const basis=rnd(2,8); while(s.size<4) s.add(aus([basis*10+rnd(0,9),rnd(1,9)*10+basis,rnd(10,99)])); const l=[...s], gross=Math.random()<0.5, r=gross?Math.max(...l):Math.min(...l);
      return {art:"wahl", frage:`Welche Zahl ist am <span class="ziel">${gross?"größten":"kleinsten"}</span>?`, optionen:mische(l.map(String)), ok:String(r), tag:"zvergleich", sollText:String(r),
        erkl:`Schau zuerst auf die Zehner. Der Größe nach geordnet: ${l.slice().sort((a,b)=>a-b).join(" &lt; ")}. Am ${gross?"größten":"kleinsten"} ist <b>${r}</b>.`}; },
    z_hze(){ const h=rnd(1,9), z=aus([0,rnd(1,9),rnd(1,9)]), e=aus([0,rnd(1,9),rnd(1,9)]), n=h*100+z*10+e; if(!z&&!e) return BAU.z_hze();
      const teile=[`${h} Hunderter`].concat(z?[`${z} Zehner`]:[]).concat(e?[`${e} Einer`]:[]);
      return eingabe(`<span class="ziel">${teile.join(", ")}</span> – welche Zahl ist das?`, [F.zahl], n, {tag:"stelle", sollText:String(n),
        erkl:`Hunderter, Zehner, Einer – jede Stelle bekommt eine Ziffer. ${!z?"Es gibt <b>keine Zehner</b>, also steht dort eine 0. ":!e?"Es gibt <b>keine Einer</b>, also steht dort eine 0. ":""}H ${h} · Z ${z} · E ${e}: <b>${n}</b>.`}); },
    z_stelle3(){ let n; do{ n=rnd(102,987); }while(new Set(String(n)).size<3 || String(n).includes("0")); const i=rnd(0,2), namen=["Hunderterstelle","Zehnerstelle","Einerstelle"], r=+String(n)[i];
      return eingabe(`Welche Ziffer steht an der <span class="ziel">${namen[i]}</span> von <span class="ziel">${n}</span>?`, [F.zahl], r, {tag:"stelle", sollText:String(r),
        erkl:`${n}: Hunderter <b>${String(n)[0]}</b> · Zehner <b>${String(n)[1]}</b> · Einer <b>${String(n)[2]}</b>. An der ${namen[i]} steht die <b>${r}</b>.`}); },
    z_vorNach1000(){ const n=aus([rnd(1,9)*100,rnd(1,9)*100+99,rnd(10,98)*10,rnd(10,98)*10+9,rnd(101,998)]), vor=Math.random()<0.5, r=vor?n-1:n+1;
      return eingabe(`Welche Zahl kommt direkt <span class="ziel">${vor?"vor":"nach"} ${n}</span>?`, [F.zahl], r, {tag:"nachbar", sollText:String(r),
        erkl:`${vor?"Der Vorgänger ist 1 kleiner":"Der Nachfolger ist 1 größer"}: ${n} ${vor?"−":"+"} 1 = <b>${r}</b>. Achte auf den Übergang zum nächsten Zehner oder Hunderter.`}); },
    z_strahl1000(){ const n=rnd(3,97)*10;
      return eingabe("Auf welche Zahl zeigt der Pfeil?", [F.zahl], n, {bild:strahlBild(1000,n), lineal:true, tag:"strahl", sollText:String(n),
        erkl:`Hier ist jeder kleine Strich <b>10</b>. Such den Hunderter davor: <b>${Math.floor(n/100)*100}</b>. Von dort sind es noch ${(n%100)/10} Striche: <b>${n}</b>.`}); },
    z_rundeZ(){ let n; do{ n=rnd(11,989); }while(n%10===0); const r=Math.round(n/10)*10, e=n%10;
      return eingabe(`Runde <span class="ziel">${n}</span> auf <span class="ziel">Zehner</span>.`, [F.zahl], r, {tag:"runden", sollText:String(r),
        erkl:`Schau auf die <b>Einer</b>: ${e}. Bei 0, 1, 2, 3, 4 wird <b>ab</b>gerundet, bei 5, 6, 7, 8, 9 <b>auf</b>gerundet. ${n} ≈ <b>${r}</b>.`}); },
    z_rundeH(){ let n; do{ n=rnd(101,949); }while(n%100===0); const r=Math.round(n/100)*100, z=Math.floor(n/10)%10;
      return eingabe(`Runde <span class="ziel">${n}</span> auf <span class="ziel">Hunderter</span>.`, [F.zahl], r, {tag:"runden", sollText:String(r),
        erkl:`Schau auf die <b>Zehner</b>: ${z}. Bei 0 bis 4 wird <b>ab</b>gerundet, bei 5 bis 9 <b>auf</b>gerundet. ${n} ≈ <b>${r}</b>.`}); },
    z_doppelt(){ const n=aus([rnd(6,25),rnd(11,49),rnd(3,24)*5]);
      return eingabe(`Das <span class="ziel">Doppelte von ${n}</span> ist …`, [F.zahl], n*2, {tag:"doppelt", sollText:String(n*2), erkl:`Verdoppeln heißt: die Zahl zweimal nehmen. ${n} + ${n} = <b>${n*2}</b>.`}); },
    z_haelfte(){ const n=aus([rnd(6,25),rnd(11,49),rnd(3,24)*5])*2;
      return eingabe(`Die <span class="ziel">Hälfte von ${n}</span> ist …`, [F.zahl], n/2, {tag:"doppelt", sollText:String(n/2), erkl:`Halbieren heißt: in zwei gleiche Teile teilen. ${n/2} + ${n/2} = ${n}, also ist die Hälfte <b>${n/2}</b>.`}); },
    z_gerade(){ const n=rnd(11,998), ok=n%2===0?"gerade":"ungerade";
      return {art:"wahl", frage:`Ist <span class="ziel">${n}</span> gerade oder ungerade?`, optionen:["gerade","ungerade"], ok, tag:"doppelt", sollText:ok,
        erkl:`Schau nur auf die <b>letzte Ziffer</b>: ${n%10}. Endet eine Zahl auf 0, 2, 4, 6 oder 8, ist sie gerade – sie lässt sich ohne Rest halbieren. ${n} ist <b>${ok}</b>.`}; },
    z_rest(){ const b=rnd(2,9), q=rnd(2,9), r=rnd(1,b-1), a=b*q+r;
      return eingabe(`<span class="ziel">${a} ÷ ${b}</span> = ?`, [F.quot,F.zahl], q*100+r, {tag:"rest", sollText:`${q} Rest ${r}`,
        erkl:`Such die größte Malaufgabe mit ${b}, die in ${a} passt: ${q} × ${b} = ${q*b}. Bis ${a} bleiben ${a} − ${q*b} = ${r} übrig: <b>${q} Rest ${r}</b>.`}); },
    s_schritte(){ return strahlAufgabe(STRAHL100,"schritte"); }, s_schritt(){ return strahlAufgabe(STRAHL100,"schritt"); }, s_pfeil(){ return strahlAufgabe(STRAHL100,"pfeil"); }, s_wo(){ return strahlAufgabe(STRAHL100,"wo"); },
    t_schritt(){ return strahlAufgabe(STRAHL1000,"schritt"); }, t_pfeil(){ return strahlAufgabe(STRAHL1000,"pfeil"); }, t_wo(){ return strahlAufgabe(STRAHL1000,"wo"); },
    // ===== Schriftlich rechnen =====
    sp_ohne(){ let a,b; do{ a=rnd(112,786); b=rnd(101,812); }while(a+b>999 || !ohneUebertrag(a,b)); return mitErkl(schriftPlus([a,b])); },
    sp_mit(){ let a,b; do{ a=rnd(125,789); b=rnd(116,768); }while(a+b>999 || ohneUebertrag(a,b)); return mitErkl(schriftPlus([a,b])); },
    sp_gross(){ let a,b; do{ a=rnd(356,989); b=rnd(245,978); }while(a+b<1000); return mitErkl(schriftPlus([a,b])); },
    sp_drei(){ let a,b,c; do{ a=rnd(105,589); b=rnd(34,389); c=rnd(17,289); }while(a+b+c>999); return mitErkl(schriftPlus([a,b,c])); },
    sm_ohne(){ let a,b; do{ a=rnd(345,999); b=rnd(112,876); }while(a-b<11 || !ohneEntbuendeln(a,b)); return mitErkl(schriftMinus(a,b)); },
    sm_mit(){ let a,b; do{ a=rnd(321,998); b=rnd(114,889); }while(a-b<11 || ohneEntbuendeln(a,b) || String(a).slice(1).includes("0")); return mitErkl(schriftMinus(a,b)); },
    sm_null(){ let a,b; do{ a=aus([rnd(2,9)*100, rnd(2,9)*100+rnd(1,9), rnd(2,9)*100+rnd(1,9)]); b=rnd(114,a-13); }while(ohneEntbuendeln(a,b) || b%10===0); return mitErkl(schriftMinus(a,b)); },
    sx_zwei(){ const a=rnd(12,98), m=rnd(2,9); return mitErkl(schriftMal(a,m)); },
    sx_drei(){ const a=rnd(112,489), m=rnd(2,9); return mitErkl(schriftMal(a,m)); },
    // ===== Liter und Milliliter (Stufe 6 bei den Gewichten) =====
    w_lInMl(){ const l=rnd(2,9), r=aus([0,0,rnd(1,19)*50]);
      return eingabe(`<span class="ziel">${l} l${r?` ${r} ml`:""}</span> = wie viele Milliliter?`, [F.ml], l*1000+r, {tag:"umrechnen", sollText:`${l*1000+r} ml`, erkl:`<b>1 l (Liter) sind 1000 ml.</b> ${l} l sind ${l*1000} ml${r?`, dazu ${r} ml: <b>${l*1000+r} ml</b>`:""}.`}); },
    w_mlAus(){ let c; do{ c=rnd(21,179)*50; }while(c%1000===0);
      return eingabe(`<span class="ziel">${c} ml</span> = wie viele Liter und Milliliter?`, [F.l,F.ml], c, {tag:"umrechnen", sollText:`${Math.floor(c/1000)} l ${c%1000} ml`, streng:true,
        erkl:`<b>1000 ml sind 1 l.</b> In ${c} ml stecken ${Math.floor(c/1000)} volle Tausender – das sind ${Math.floor(c/1000)} l. Übrig bleiben ${c%1000} ml.`}); },
    w_lSchaetzen(){ const s=aus([["In ein Trinkglas passen ungefähr …","200 ml",["2 ml","20 l"]],["In eine Badewanne passen ungefähr …","150 l",["150 ml","15 l"]],["In einen Eimer passen ungefähr …","10 l",["10 ml","1000 l"]],
        ["Auf einen Teelöffel passen ungefähr …","5 ml",["500 ml","5 l"]],["In eine große Wasserflasche passt …","1 l",["10 ml","100 l"]],["In eine Tasse passen ungefähr …","250 ml",["25 l","2 ml"]],
        ["In eine Gießkanne passen ungefähr …","5 l",["5 ml","500 l"]],["In ein Schwimmbecken passen …","viele tausend Liter",["100 ml","10 l"]]]);
      return {art:"wahl", frage:s[0].replace("…",'<span class="ziel">…</span>'), optionen:mische([s[1]].concat(s[2])), ok:s[1], tag:"einheit", sollText:s[1],
        erkl:`${s[0].replace("…",`<b>${s[1]}</b>`)}<br>Zum Merken: <b>1 l</b> ist eine große Flasche Wasser oder eine Packung Milch. <b>1 ml</b> sind nur ein paar Tropfen.`}; },
    w_lBruch(){ const b=aus([["Ein halber Liter","500 ml",["50 ml","250 ml","5000 ml"],"Die Hälfte von 1000 ml ist 500 ml."],["Ein Viertelliter","250 ml",["25 ml","400 ml","500 ml"],"1000 ml geteilt durch 4 sind 250 ml."],
        ["Ein Dreiviertelliter","750 ml",["75 ml","300 ml","340 ml"],"Ein Viertel sind 250 ml – drei Viertel sind 750 ml."],["Eineinhalb Liter","1500 ml",["150 ml","1050 ml","1005 ml"],"1 l sind 1000 ml, ein halber dazu sind 500 ml."]]);
      return {art:"wahl", frage:`<span class="ziel">${b[0]}</span> – wie viele Milliliter sind das?`, optionen:mische([b[1]].concat(b[2])), ok:b[1], tag:"umrechnen", sollText:b[1], erkl:`<b>1 l = 1000 ml.</b> ${b[3]}`}; },
    w_lGlaeser(){ const g=aus([[250,"Gläser"],[200,"Gläser"],[500,"Flaschen"],[100,"Becher"]]), l=rnd(1,3), n=l*1000/g[0];
      return eingabe(`In ${g[1]==="Flaschen"?"eine Flasche":g[1]==="Becher"?"einen Becher":"ein Glas"} passen <span class="ziel">${g[0]} ml</span>.<br>Wie viele ${g[1]} kannst du mit <span class="ziel">${l} l</span> Saft füllen?`, [F.zahl], n, {tag:"rechnen", sollText:String(n),
        erkl:`Wandle um: ${l} l = ${l*1000} ml. Wie oft passen ${g[0]} ml hinein? ${l*1000} ÷ ${g[0]} = <b>${n}</b>.`}); },
    // ===== Kalender und Zeit =====
    k_tag(){ const i=rnd(0,6), d=aus([[1,"nach"],[1,"nach"],[-1,"vor"],[2,"übermorgen"],[-2,"vorgestern"]]), ok=WTAGE[(i+d[0]+7)%7];
      const frage = d[1]==="nach" ? `Welcher Tag kommt <span class="ziel">nach ${WTAGE[i]}</span>?` : d[1]==="vor" ? `Welcher Tag kommt <span class="ziel">vor ${WTAGE[i]}</span>?` : d[1]==="übermorgen" ? `Heute ist <span class="ziel">${WTAGE[i]}</span>. Welcher Tag ist <span class="ziel">übermorgen</span>?` : `Heute ist <span class="ziel">${WTAGE[i]}</span>. Welcher Tag war <span class="ziel">vorgestern</span>?`;
      return {art:"wahl", frage, optionen:mische([ok].concat(mische(WTAGE.filter(x=>x!==ok && x!==WTAGE[i])).slice(0,3))), ok, tag:"kalender", sollText:ok, erkl:`Die Woche: ${WTAGE.join(" – ")}. Nach Sonntag geht es wieder mit Montag los. Die Antwort ist <b>${ok}</b>.`}; },
    k_monat(){ const i=rnd(0,11), nach=Math.random()<0.6, ok=MONATE[(i+(nach?1:11))%12];
      return {art:"wahl", frage:`Welcher Monat kommt <span class="ziel">${nach?"nach":"vor"} ${MONATE[i]}</span>?`, optionen:mische([ok].concat(mische(MONATE.filter(x=>x!==ok && x!==MONATE[i])).slice(0,3))), ok, tag:"kalender", sollText:ok,
        erkl:`Die Monate: ${MONATE.join(", ")}. Nach Dezember beginnt ein neues Jahr mit Januar. Die Antwort ist <b>${ok}</b>.`}; },
    k_monatNr(){ const i=rnd(0,11);
      return eingabe(`Der wievielte Monat im Jahr ist der <span class="ziel">${MONATE[i]}</span>?`, [F.zahl], i+1, {tag:"kalender", sollText:String(i+1), erkl:`Zähle von vorn: ${MONATE.slice(0,i+1).map((m,k)=>`${k+1} ${m}`).join(", ")}. Der ${MONATE[i]} ist der <b>${i+1}.</b> Monat – so schreibt man auch das Datum.`}); },
    k_tageMonat(){ const i=rnd(0,11), n=MTAGE[i], ok=i===1?"28 oder 29":String(n);
      return {art:"wahl", frage:`Wie viele Tage hat der <span class="ziel">${MONATE[i]}</span>?`, optionen:["28 oder 29","30","31"], ok, tag:"kalender", sollText:ok,
        erkl:`<b>31 Tage:</b> Januar, März, Mai, Juli, August, Oktober, Dezember. <b>30 Tage:</b> April, Juni, September, November. Nur der <b>Februar</b> hat 28 Tage (im Schaltjahr 29).<br>Trick: Zähle an den Fingerknöcheln – Knöchel 31, Tal 30.`}; },
    k_wochen(){ const w=rnd(2,9);
      return eingabe(`Wie viele Tage sind <span class="ziel">${w} Wochen</span>?`, [F.zahl], w*7, {tag:"zeiteinheit", sollText:String(w*7), erkl:`<b>Eine Woche hat 7 Tage.</b> ${w} Wochen sind ${w} × 7 = <b>${w*7} Tage</b>.`}); },
    k_wissen(){ const d=aus([["Wie viele Monate hat ein Jahr?",12,"Ein Jahr hat <b>12 Monate</b>."],["Wie viele Tage hat eine Woche?",7,"Eine Woche hat <b>7 Tage</b>."],["Wie viele Stunden hat ein Tag?",24,"Ein Tag hat <b>24 Stunden</b> – der kleine Zeiger dreht zwei Runden."],
        ["Wie viele Minuten hat eine Stunde?",60,"Eine Stunde hat <b>60 Minuten</b>."],["Wie viele Sekunden hat eine Minute?",60,"Eine Minute hat <b>60 Sekunden</b>."],["Wie viele Tage hat ein Jahr (kein Schaltjahr)?",365,"Ein Jahr hat <b>365 Tage</b>, ein Schaltjahr 366."],
        ["Wie viele Jahreszeiten gibt es?",4,"Es gibt <b>4 Jahreszeiten</b>: Frühling, Sommer, Herbst, Winter."]]);
      return eingabe(d[0], [F.zahl], d[1], {tag:"zeiteinheit", sollText:String(d[1]), erkl:d[2]}); },
    k_hMin(){ const h=rnd(2,6);
      return eingabe(`<span class="ziel">${h} Stunden</span> = wie viele Minuten?`, [F.zahl], h*60, {tag:"zeiteinheit", sollText:String(h*60), erkl:`<b>1 Stunde sind 60 Minuten.</b> ${h} Stunden sind ${h} × 60 = <b>${h*60} Minuten</b>.`}); },
    k_minAus(){ let m; do{ m=rnd(13,47)*5; }while(m%60===0);
      return eingabe(`<span class="ziel">${m} Minuten</span> = wie viele Stunden und Minuten?`, [F.std,F.min], m, {tag:"zeiteinheit", sollText:`${Math.floor(m/60)} h ${m%60} min`, streng:true,
        erkl:`<b>60 Minuten sind 1 Stunde.</b> In ${m} Minuten stecken ${Math.floor(m/60)} volle Stunden (${Math.floor(m/60)*60} Minuten). Übrig bleiben ${m%60} Minuten.`}); },
    k_bruch(){ const b=aus([["Eine halbe Stunde","30",["15","50","45"]],["Eine Viertelstunde","15",["25","4","30"]],["Eine Dreiviertelstunde","45",["75","34","30"]],["Eineinhalb Stunden","90",["150","130","65"]]]);
      return {art:"wahl", frage:`<span class="ziel">${b[0]}</span> – wie viele Minuten sind das?`, optionen:mische([b[1]].concat(b[2])).map(x=>x+" Minuten"), ok:b[1]+" Minuten", tag:"zeiteinheit", sollText:b[1]+" Minuten",
        erkl:`Eine Stunde hat 60 Minuten. Die Hälfte sind 30, ein Viertel sind 15, drei Viertel sind 45 Minuten.`}; },
    k_sek(){ const m=rnd(2,9);
      return eingabe(`<span class="ziel">${m} Minuten</span> = wie viele Sekunden?`, [F.zahl], m*60, {tag:"zeiteinheit", sollText:String(m*60), erkl:`<b>1 Minute sind 60 Sekunden.</b> ${m} × 60 = <b>${m*60} Sekunden</b>.`}); },
    k_tageStd(){ const d=rnd(2,5);
      return eingabe(`<span class="ziel">${d} Tage</span> = wie viele Stunden?`, [F.zahl], d*24, {tag:"zeiteinheit", sollText:String(d*24), erkl:`<b>1 Tag hat 24 Stunden.</b> ${d} × 24 = <b>${d*24} Stunden</b>.`}); },
    k_datum(){ const i=rnd(0,11), tag=rnd(MTAGE[i]-6,MTAGE[i]-1), plus=rnd(MTAGE[i]-tag+1,9), neu=tag+plus-MTAGE[i], ok=`${neu}. ${MONATE[(i+1)%12]}`;
      const falsch=[`${tag+plus}. ${MONATE[i]}`, `${neu}. ${MONATE[i]}`, `${neu+1}. ${MONATE[(i+1)%12]}`];
      return {art:"wahl", frage:`Heute ist der <span class="ziel">${tag}. ${MONATE[i]}</span>.<br>Welches Datum ist <span class="ziel">in ${plus} Tagen</span>?`, optionen:mische([ok].concat(falsch)), ok, tag:"kalender", sollText:ok,
        erkl:`Der ${MONATE[i]} hat ${i===1?"28":MTAGE[i]} Tage. Bis zum Monatsende sind es noch ${MTAGE[i]-tag} Tage, dann bleiben ${neu} Tage für den nächsten Monat: <b>${ok}</b>.`}; },
    // ===== Zeit, Klasse 3: umwandeln mit beliebigen Zahlen, Zeitspannen auf die Minute, Sachsituationen =====
    k_hMinIn(){ const h=rnd(1,5), m=aus([rnd(1,9),rnd(10,59),rnd(10,59)]);
      return eingabe(`<span class="ziel">${h} h ${m} min</span> = wie viele Minuten?`, [F.min], h*60+m, {tag:"zeiteinheit", sollText:`${h*60+m} min`, erkl:`<b>1 h = 60 min.</b> ${h} h sind ${h*60} min, dazu ${m} min: ${h*60} + ${m} = <b>${h*60+m} min</b>.`}); },
    k_minAus2(){ let m; do{ m=rnd(61,370); }while(m%60===0);
      return eingabe(`<span class="ziel">${m} min</span> = wie viele Stunden und Minuten?`, [F.std,F.min], m, {tag:"zeiteinheit", sollText:`${Math.floor(m/60)} h ${m%60} min`, streng:true,
        erkl:`<b>60 min = 1 h.</b> Wie oft passt 60 in ${m}? ${Math.floor(m/60)}-mal (${Math.floor(m/60)*60} min). Übrig bleiben ${m} − ${Math.floor(m/60)*60} = ${m%60} min: <b>${Math.floor(m/60)} h ${m%60} min</b>.`}); },
    k_bruchH(){ const g=rnd(0,4), b=aus([["¼",15],["½",30],["¾",45]]), ok=g*60+b[1];
      return eingabe(`<span class="ziel">${g?g+" ":""}${b[0]} h</span> = wie viele Minuten?`, [F.min], ok, {tag:"zeiteinheit", sollText:`${ok} min`,
        erkl:`¼ h = 15 min · ½ h = 30 min · ¾ h = 45 min · 1 h = 60 min.${g?` ${g} h sind ${g*60} min, dazu ${b[1]} min: <b>${ok} min</b>.`:` Also sind ${b[0]} h = <b>${ok} min</b>.`}`}); },
    k_minSekIn(){ const m=rnd(1,6), s=rnd(5,58);
      return eingabe(`<span class="ziel">${m} min ${s} s</span> = wie viele Sekunden?`, [F.sek], m*60+s, {tag:"zeiteinheit", sollText:`${m*60+s} s`, erkl:`<b>1 min = 60 s.</b> ${m} min sind ${m*60} s, dazu ${s} s: <b>${m*60+s} s</b>.`}); },
    k_sekAus(){ let s; do{ s=rnd(65,370); }while(s%60===0);
      return eingabe(`<span class="ziel">${s} s</span> = wie viele Minuten und Sekunden?`, [F.minS,F.sek], s, {tag:"zeiteinheit", sollText:`${Math.floor(s/60)} min ${s%60} s`, streng:true,
        erkl:`<b>60 s = 1 min.</b> In ${s} s passt 60 genau ${Math.floor(s/60)}-mal (${Math.floor(s/60)*60} s). Übrig bleiben ${s%60} s: <b>${Math.floor(s/60)} min ${s%60} s</b>.`}); },
    k_vollMin(){ const s=rnd(3,57);
      return eingabe(`Ergänze zur vollen Minute:<br><span class="ziel">${s} s + ☐ s = 1 min</span>`, [F.sek], 60-s, {tag:"zeiteinheit", sollText:`${60-s} s`, erkl:`Eine Minute hat <b>60 Sekunden</b>. Von ${s} bis 60 fehlen 60 − ${s} = <b>${60-s} s</b>.`}); },
    zs_voll(){ const h=rnd(6,21), m=aus([rnd(1,11)*5,rnd(1,11)*5,rnd(2,58)]), t=h*60+m;
      return eingabe(`Es ist <span class="ziel">${uhr(t)}</span>.<br>Wie viele Minuten sind es bis zur <span class="ziel">vollen Stunde</span>?`, [F.min], 60-m, {tag:"zeitspanne", sollText:`${60-m} min`,
        erkl:`Die nächste volle Stunde ist ${uhr((h+1)*60)}. Eine Stunde hat 60 Minuten: 60 − ${m} = <b>${60-m} min</b>.<br>${pfeil(t,[60-m])}`}); },
    zs_in(){ const t=rnd(7,19)*60+rnd(3,57), d=aus([rnd(5,25),rnd(26,58),rnd(26,58)]), z=t+d, bis=60-t%60;
      return eingabe(`Es ist <span class="ziel">${uhr(t)}</span>.<br>Wie spät ist es <span class="ziel">in ${d} Minuten</span>?`, [F.uhrH,F.uhrM], z, {tag:"zeitspanne", sollText:uhr(z), streng:true,
        erkl: d<bis ? `Du bleibst in derselben Stunde: ${t%60} + ${d} = ${z%60}.<br>${pfeil(t,[d])}` : `Geh zuerst bis zur vollen Stunde (${bis} min), dann den Rest (${d-bis} min).<br>${pfeil(t,d-bis?[bis,d-bis]:[bis])}`}); },
    zs_inH(){ const t=rnd(7,15)*60+rnd(1,11)*5, h=rnd(1,3), m=aus([0,rnd(1,11)*5,rnd(1,11)*5]), z=t+h*60+m;
      return eingabe(`Es ist <span class="ziel">${uhr(t)}</span>.<br>Wie spät ist es <span class="ziel">in ${h} h${m?` ${m} min`:""}</span>?`, [F.uhrH,F.uhrM], z, {tag:"zeitspanne", sollText:uhr(z), streng:true,
        erkl:`Erst die Stunden, dann die Minuten.<br>${pfeil(t,[h*60].concat(m?[m]:[]))}`}); },
    zs_vor(){ const t=rnd(8,19)*60+rnd(3,57), d=aus([rnd(4,20),rnd(21,59),rnd(21,59)]), z=t-d, ab=t%60;
      return eingabe(`Es ist <span class="ziel">${uhr(t)}</span>.<br>Wie spät war es <span class="ziel">vor ${d} Minuten</span>?`, [F.uhrH,F.uhrM], z, {tag:"zeitspanne", sollText:uhr(z), streng:true,
        erkl: d<=ab ? `Du bleibst in derselben Stunde: ${ab} − ${d} = ${z%60}. Es war <b>${uhr(z)}</b>.` : `Geh zuerst zurück bis zur vollen Stunde (${ab} min), dann noch ${d-ab} min weiter zurück: ${uhr(t-ab)} → <b>${uhr(z)}</b>.<br>Probe: ${pfeil(z,[60-z%60].concat(ab?[ab]:[]))}`}); },
    zs_dauer(){ const t=rnd(7,19)*60+rnd(31,58), d=rnd(15,58), bis=60-t%60; if(d<=bis) return BAU.zs_dauer();
      return eingabe(`Von <span class="ziel">${uhr(t)}</span> bis <span class="ziel">${uhr(t+d)}</span> – wie viele Minuten sind vergangen?`, [F.min], d, {tag:"zeitspanne", sollText:`${d} min`,
        erkl:`Rechne in zwei Schritten über die volle Stunde: ${bis} min + ${d-bis} min = <b>${d} min</b>.<br>${pfeil(t,[bis,d-bis])}`}); },
    zs_dauerH(){ const t=rnd(7,13)*60+rnd(2,11)*5, h=rnd(1,3), bis=60-t%60, rest=rnd(1,11)*5, d=bis+h*60+rest;
      return eingabe(`Von <span class="ziel">${uhr(t)}</span> bis <span class="ziel">${uhr(t+d)}</span> – wie viel Zeit ist vergangen?`, [F.std,F.min], d, {tag:"zeitspanne", sollText:`${Math.floor(d/60)} h ${d%60} min`, streng:true,
        erkl:`Drei Schritte: bis zur vollen Stunde, dann die ganzen Stunden, dann der Rest.<br>${pfeil(t,[bis,h*60,rest])}<br>${bis} min + ${h} h + ${rest} min = ${h} h ${bis+rest} min${bis+rest>=60?` = <b>${Math.floor(d/60)} h ${d%60} min</b>`:""}.`}); },
    zs_training(){ const a=aus([["Das Fußballtraining","Julius"],["Der Schlagzeugunterricht","Mia"],["Die Bandprobe","Erik"],["Das Angebot „Zirkus“","Finja"],["Der Schwimmkurs","Tom"]]), t=rnd(9,16)*60+rnd(2,11)*5, d=rnd(6,18)*5;
      return eingabe(`${a[0]} beginnt um <span class="ziel">${uhr(t)}</span> und endet um <span class="ziel">${uhr(t+d)}</span>.<br>Wie lange dauert es?`, [F.min], d, {tag:"zeitspanne", sollText:`${d} min`,
        erkl:`Geh von Anfang bis Ende – wenn nötig über die volle Stunde.<br>${pfeil(t,(60-t%60)<d?[60-t%60,d-(60-t%60)]:[d])}`}); },
    zs_woche(){ const d=aus([35,40,45,50,75,80]), n=aus([2,3,5,5]), s=d*n, wer=aus(["Arda","Lina","Finja","Erik"]);
      return eingabe(`${wer} hat ${n===5?"von Montag bis Freitag jeden Tag":n+"-mal in der Woche"} <span class="ziel">${d} Minuten</span> Training.<br>Wie lange trainiert ${wer} in der Woche?`, [F.std,F.min], s, {tag:"zeitspanne", sollText:`${Math.floor(s/60)} h ${s%60} min`, streng:true,
        erkl:`${n} × ${d} min = ${s} min. 60 min sind 1 h: ${s} min = <b>${Math.floor(s/60)} h ${s%60} min</b>.`}); },
    zs_los(){ const t=rnd(8,16)*60+rnd(0,11)*5, w=aus([10,15,20,25,35,40]), z=t-w;
      return eingabe(`Die Probe beginnt um <span class="ziel">${uhr(t)}</span>. Für den Weg braucht Erik <span class="ziel">${w} Minuten</span>.<br>Wann muss er spätestens losgehen?`, [F.uhrH,F.uhrM], z, {tag:"zeitspanne", sollText:uhr(z), streng:true,
        erkl:`Du musst <b>zurück</b>rechnen: ${uhr(t)} − ${w} min = <b>${uhr(z)}</b>.<br>Probe: ${pfeil(z,(60-z%60)<w?[60-z%60,w-(60-z%60)]:[w])}`}); },
    zs_beginn(){ const t=rnd(8,16)*60+rnd(1,11)*5, d=rnd(2,9)*5;
      return eingabe(`Es ist <span class="ziel">${uhr(t)}</span>. Der Unterricht beginnt um <span class="ziel">${uhr(t+d)}</span>.<br>In wie vielen Minuten beginnt er?`, [F.min], d, {tag:"zeitspanne", sollText:`${d} min`,
        erkl:`${pfeil(t,(60-t%60)<d?[60-t%60,d-(60-t%60)]:[d])}`}); },
    zs_takt(){ const t=rnd(6,20)*60+rnd(2,57), takt=aus([10,10,15,20,30]), n=rnd(1,3), z=t+takt*n;
      return eingabe(`Der Bus fährt <span class="ziel">alle ${takt} Minuten</span>. Ein Bus ist um <span class="ziel">${uhr(t)}</span> abgefahren.<br>Wann fährt der ${["nächste","übernächste","dritte"][n-1]} Bus${n===3?" danach":""}?`, [F.uhrH,F.uhrM], z, {tag:"zeitspanne", sollText:uhr(z), streng:true,
        erkl:`Zähle in ${takt}er-Schritten weiter: ${Array.from({length:n+1},(_,k)=>uhr(t+k*takt)).join(" → ")}. Antwort: <b>${uhr(z)}</b>.`}); },
    zs_fahrplan(){ const halt=mische(["Busbahnhof","Lange Straße","Schubertplatz","Wilhelmstraße","Erichweg","Kreuzstraße","Bachstraße","Marktplatz"]).slice(0,5); let t=rnd(7,15)*60+rnd(2,20); const zeiten=halt.map((h,i)=>{ if(i) t+=rnd(3,12); return t; });
      const i=rnd(0,3), j=rnd(i+1,4), d=zeiten[j]-zeiten[i];
      const tab=`<table style="border-collapse:collapse;font-size:15px;margin:0 auto"><tr><th colspan="2" style="text-align:left;padding:2px 8px;color:#fde68a">🚌 Linie 14</th></tr>${halt.map((h,k)=>`<tr><td style="border:1px solid #475569;padding:3px 10px;text-align:left;${k===i||k===j?"font-weight:800;color:#fff":""}">${h}</td><td style="border:1px solid #475569;padding:3px 10px">${uhr(zeiten[k]).replace(" Uhr","")}</td></tr>`).join("")}</table>`;
      return eingabe(`Wie viele Minuten fährt der Bus von <span class="ziel">${halt[i]}</span> bis <span class="ziel">${halt[j]}</span>?`, [F.min], d, {bild:tab, tag:"zeitspanne", sollText:`${d} min`,
        erkl:`Lies beide Zeiten im Fahrplan ab: ${halt[i]} ${uhr(zeiten[i])}, ${halt[j]} ${uhr(zeiten[j])}.<br>${pfeil(zeiten[i],(60-zeiten[i]%60)<d?[60-zeiten[i]%60,d-(60-zeiten[i]%60)]:[d])}`}); },
    // ===== Uhr: zwei Uhrzeiten zu einem Zifferblatt, drei Schreibweisen =====
    u_beide(){ const [h,m]=uhrZufall(), ok=`${uhrZeit(h,m)} und ${uhrZeit(h+12,m)}`, f=uhrFallen(h,m);
      const falsch=[`${uhrZeit(h,m)} und ${uhrZeit(h+10,m)}`, `${uhrZeit(f[0][0],f[0][1])} und ${uhrZeit(f[0][0]+12,f[0][1])}`, `${uhrZeit(f[1][0],f[1][1])} und ${uhrZeit(f[1][0]+12,f[1][1])}`];
      return {art:"wahl", frage:"Diese Uhr zeigt zwei Uhrzeiten am Tag – einmal am Morgen, einmal am Nachmittag oder Abend.<br><span class=\"ziel\">Welche beiden sind es?</span>", bild:uhrBild(h,m), optionen:mische([ok].concat(falsch)), ok, tag:"uhrform", sollText:ok, spalten:1,
        erkl:`Der kurze blaue Zeiger zeigt die Stunde (${h}), der lange rote die Minuten (${m}). Am Vormittag ist es <b>${uhrZeit(h,m)}</b>. Am Nachmittag zählt man weiter: ${h} + 12 = ${h+12}, also <b>${uhrZeit(h+12,m)}</b>.`}; },
    u_nachm(){ const [h,m]=uhrZufall(), wann=h<6?"Nachmittag":h<10?"Abend":"spät am Abend";
      return eingabe(`Es ist <span class="ziel">${wann}</span>. Wie spät ist es?<br>Schreibe die Uhrzeit mit einer Zahl von 13 bis 24.`, [F.uhrH,F.uhrM], (h+12)*60+m, {bild:uhrBild(h,m), tag:"uhrform", sollText:uhrZeit(h+12,m), streng:true,
        erkl:`Die Uhr zeigt ${uhrZeit(h,m)}. Nach 12 Uhr mittags zählt man weiter: ${h} + 12 = <b>${h+12}</b>. Es ist <b>${uhrZeit(h+12,m)}</b>.`}); },
    u_wortUhr(){ const [h,m]=uhrZufall(), f=uhrFallen(h,m).slice(0,3), ok=uhrBild(h,m,112), opt=[[h,m]].concat(f), o=mische(opt);
      return {art:"wahl", frage:`<span class="ziel">${uhrWort(h,m)}</span> – welche Uhr passt?`, optionen:o.map(x=>uhrBild(x[0],x[1],112)), optText:o.map(x=>uhrZeit(x[0],x[1])), ok, tag:"uhrform", sollText:uhrZeit(h,m),
        erkl:`„${uhrWort(h,m)}“ heißt ${uhrZeit(h,m)}: Der lange rote Zeiger steht auf der ${m/5||12}, der kurze blaue ${m===0?"genau auf der "+h:m<30?"kurz hinter der "+h:"schon nah an der "+(h%12+1)}.<br>${uhrBild(h,m,120)}`}; },
    u_digitalWort(){ const [h,m]=uhrZufall(), H=Math.random()<0.5?h:h+12, ok=uhrWort(h,m), f=uhrFallen(h,m).map(x=>uhrWort(x[0],x[1])).filter(x=>x!==ok);
      return {art:"wahl", frage:`Auf der Digitaluhr steht <span class="ziel" style="font-family:monospace;font-size:30px">${zz(H)}:${zz(m)}</span><br>Wie sagt man das?`, optionen:mische([ok].concat([...new Set(f)].slice(0,3))), ok, tag:"uhrform", sollText:ok, spalten:1,
        erkl:`${zz(H)}:${zz(m)}${H>12?` – das ist am Nachmittag oder Abend. ${H} − 12 = ${h}, also ${uhrZeit(h,m)} auf der Uhr mit Zeigern`:""}. In Worten: <b>${ok}</b>.<br>${uhrBild(h,m,120)}`}; },
    u_uhrPaar(){ const [h,m]=uhrZufall(), ok=`${uhrZeit(h,m)} · ${uhrWort(h,m)}`, f=uhrFallen(h,m);
      const falsch=[`${uhrZeit(h,m)} · ${uhrWort(f[0][0],f[0][1])}`, `${uhrZeit(f[0][0],f[0][1])} · ${uhrWort(f[0][0],f[0][1])}`, `${uhrZeit(f[1][0],f[1][1])} · ${uhrWort(h,m)}`].filter(x=>x!==ok);
      return {art:"wahl", frage:"Was gehört zu dieser Uhr? <span class=\"ziel\">Beides muss stimmen.</span>", bild:uhrBild(h,m), optionen:mische([ok].concat([...new Set(falsch)])), ok, tag:"uhrform", sollText:ok, spalten:1,
        erkl:`Der kurze blaue Zeiger: Stunde ${h}. Der lange rote Zeiger: ${m} Minuten. Das ist <b>${uhrZeit(h,m)}</b> – in Worten <b>${uhrWort(h,m)}</b>.`}; },
    // ===== Geld, Klasse 3: Kommazahlen, rechnen, malnehmen und teilen, schriftlich, große Beträge =====
    g_ctKomma(){ const c=aus([rnd(1,9),rnd(10,99),rnd(101,999),rnd(1,9)*100+rnd(1,9)]);
      return eingabe(`Schreibe <span class="ziel">${c} ct</span> als Kommazahl.`, [F.euK,F.ctK], c, {tag:"komma", sollText:komma(c), streng:true,
        erkl:`<b>Das Komma trennt Euro und Cent.</b> ${c<100?`${c} ct sind weniger als 1 €, also steht vorn eine 0. `:`100 ct sind 1 €: ${Math.floor(c/100)} € und ${c%100} ct. `}Hinter dem Komma stehen <b>immer zwei Stellen</b>: <b>${komma(c)}</b>.`}); },
    g_kommaCt(){ const c=aus([rnd(1,9),rnd(10,99),rnd(101,999),rnd(1,9)*100+rnd(1,9),1000]);
      return eingabe(`<span class="ziel">${komma(c)}</span> = wie viele Cent?`, [F.ct], c, {tag:"komma", sollText:`${c} ct`,
        erkl:`Vor dem Komma stehen die Euro: ${Math.floor(c/100)} € = ${Math.floor(c/100)*100} ct. Dahinter stehen ${c%100} ct. Zusammen <b>${c} ct</b>.`}); },
    g_ecKomma(){ const e=rnd(1,12), r=aus([rnd(1,9),rnd(1,9),rnd(10,99)]), c=e*100+r;
      return eingabe(`Schreibe <span class="ziel">${e} € ${r} ct</span> als Kommazahl.`, [F.euK,F.ctK], c, {tag:"komma", sollText:komma(c), streng:true,
        erkl:`Hinter dem Komma stehen immer <b>zwei Stellen</b>. ${r} ct schreibt man als „${zz(r)}“: <b>${komma(c)}</b>.`}); },
    g_vergleich(){ const a=rnd(1,9), b=rnd(1,9), werte=[...new Set([a*100+b, a*10+b, a*100+b*10, b*100+a, a*110, a])].slice(0,3), gross=Math.random()<0.5;
      if(werte.length<3) return BAU.g_vergleich();
      const form=[c=>komma(c), c=>`${c} ct`, c=>euroCent(c)], opt=mische(werte).map((c,i)=>[c, form[i](c)]), ziel=gross?Math.max(...werte):Math.min(...werte), ok=opt.find(x=>x[0]===ziel)[1];
      return {art:"wahl", frage:`Welcher Betrag ist am <span class="ziel">${gross?"größten":"kleinsten"}</span>?`, optionen:opt.map(x=>x[1]), ok, tag:"komma", sollText:ok, spalten:1,
        erkl:`Schreibe alle Beträge gleich – zum Beispiel als Kommazahl: ${opt.map(x=>`${x[1]} = <b>${komma(x[0])}</b>`).join(" · ")}. Am ${gross?"größten":"kleinsten"} ist <b>${ok}</b>.`}; },
    g_vollEuro(){ let c; do{ c=rnd(1,9)*100+rnd(3,97); }while(c%100===0); const plus=Math.random()<0.6, r=plus?100-c%100:c%100, voll=plus?Math.ceil(c/100)*100:Math.floor(c/100)*100;
      return eingabe(`<span class="ziel">${komma(c)} ${plus?"+":"−"} ☐ ct = ${komma(voll)}</span>`, [F.ct], r, {tag:"komma", sollText:`${r} ct`,
        erkl: plus ? `Bis zum nächsten vollen Euro: erst bis zum nächsten Zehner, dann weiter. Von ${c%100} ct bis 100 ct fehlen <b>${r} ct</b>.` : `Du musst genau die Cent wegnehmen: ${komma(c)} hat <b>${r} ct</b> hinter dem Komma.`}); },
    g_kPlus(){ const a=rnd(3,58)*10+aus([0,0,5]), b=rnd(2,48)*10+aus([0,0,5]), s=a+b, be=Math.floor(b/100)*100;
      return eingabe(`<span class="ziel">${komma(a)} + ${komma(b)}</span> = ?`, [F.euK,F.ctK], s, {tag:"rechnen", sollText:komma(s), streng:true,
        erkl:`In zwei Schritten: erst die Euro, dann die Cent.<br>${komma(a)}${be?` <span style="color:#fde68a">—+${komma(be)}→</span> ${komma(a+be)}`:""}${b-be?` <span style="color:#fde68a">—+${komma(b-be)}→</span> <b>${komma(s)}</b>`:""}<br>Oder in Cent: ${a} ct + ${b} ct = ${s} ct = <b>${komma(s)}</b>.`}); },
    g_kMinus(){ const a=aus([500,1000,1000,1500,2000,rnd(31,99)*10,rnd(31,99)*10+5]); let b; do{ b=rnd(4,Math.min(98,a/10-3))*10+aus([0,0,5]); }while(b>=a); const s=a-b, be=Math.floor(b/100)*100;
      return eingabe(`<span class="ziel">${komma(a)} − ${komma(b)}</span> = ?`, [F.euK,F.ctK], s, {tag:"rechnen", sollText:komma(s), streng:true,
        erkl:`In zwei Schritten: erst die Euro wegnehmen, dann die Cent.<br>${komma(a)}${be?` <span style="color:#fde68a">—−${komma(be)}→</span> ${komma(a-be)}`:""}${b-be?` <span style="color:#fde68a">—−${komma(b-be)}→</span> <b>${komma(s)}</b>`:""}`}); },
    g_reicht(){ const karte=[["eine Pizza Margherita",620],["eine Pizza Salami",690],["eine Pizza Tonno",730],["eine Pizza Hawaii",740],["eine Pizza Funghi",780],["eine Lasagne",790],["einen gemischten Salat",410],["einen Bauernsalat",490],["eine Pizza Speciale",850]];
      const w=mische(karte).slice(0,rnd(2,3)), s=w.reduce((x,y)=>x+y[1],0), diff=aus([-150,-90,-60,40,80,130,210]), geld=Math.round((s+diff)/100)*100; if(Math.abs(geld-s)<30 || geld<=0) return BAU.g_reicht();
      const ok=geld>=s?"Ja":"Nein", rund=w.map(x=>Math.round(x[1]/100));
      return {art:"wahl", frage:`Die Kinder haben <span class="ziel">${geld/100} €</span>. Sie möchten ${w.map(x=>`${x[0]} (${komma(x[1])})`).join(w.length===2?" und ":", ").replace(/, ([^,]*)$/," und $1")} bestellen.<br><span class="ziel">Reicht das Geld?</span>`, optionen:["Ja","Nein"], ok, tag:"ueberschlag", sollText:ok,
        erkl:`<b>Überschlage:</b> Runde jeden Preis auf volle Euro: ${rund.map(x=>x+" €").join(" + ")} = ungefähr ${rund.reduce((x,y)=>x+y,0)} €. Genau sind es ${komma(s)}. ${geld>=s?`Das ist weniger als ${geld/100} € – <b>es reicht</b>, es bleiben ${komma(geld-s)} übrig.`:`Das ist mehr als ${geld/100} € – <b>es reicht nicht</b>, es fehlen ${komma(s-geld)}.`}`}; },
    g_mal(){ const klein=Math.random()<0.45, n=rnd(2,klein?9:5), p=klein?aus([40,50,60,70,90]):aus([110,120,140,150,170,180,225,103,315,255]), s=n*p, was=aus(["Brötchen","Äpfel","Hefte","Stifte","Becher"]);
      return eingabe(`Ein Stück kostet <span class="ziel">${klein?p+" ct":komma(p)}</span>.<br>Wie viel kosten <span class="ziel">${n} ${was}</span>?`, [F.euK,F.ctK], s, {tag:"geldmal", sollText:komma(s), streng:true,
        erkl: klein ? `${n} · ${p} ct = ${s} ct. Je 100 ct sind 1 €: ${s} ct = <b>${komma(s)}</b>.` : `Rechne Euro und Cent getrennt: ${n} · ${komma(Math.floor(p/100)*100)} = ${komma(n*Math.floor(p/100)*100)} und ${n} · ${komma(p%100)} = ${komma(n*(p%100))}. Zusammen <b>${komma(s)}</b>.`}); },
    g_teil(){ const n=rnd(2,8), p=aus([rnd(12,95),rnd(12,95),rnd(101,260)]), s=n*p, d=aus([["Anspitzer","Ein Anspitzer"],["Filzstifte","Ein Filzstift"],["Pinsel","Ein Pinsel"],["Kreisel","Ein Kreisel"],["Kerzen","Eine Kerze"],["Becher","Ein Becher"]]);
      const eu=Math.floor(s/100/n)*n*100, rest=s-eu;
      return eingabe(`<span class="ziel">${n} ${d[0]}</span> kosten zusammen <span class="ziel">${komma(s)}</span>.<br>Wie viel kostet ${d[1].replace(/^E/,"e")}?`, [F.euK,F.ctK], p, {tag:"geldmal", sollText:komma(p), streng:true,
        erkl:`Teile durch ${n}. Am leichtesten in Cent: ${s} ct ÷ ${n} = ${p} ct = <b>${komma(p)}</b>.${eu&&rest?`<br>Oder zerlegt: ${komma(eu)} ÷ ${n} = ${komma(eu/n)} und ${komma(rest)} ÷ ${n} = ${komma(rest/n)}.`:""}<br>Probe: ${n} · ${komma(p)} = ${komma(s)}.`}); },
    g_wieviele(){ const p=aus([40,50,60,70,90]), n=rnd(3,9), s=n*p, d=aus(["Mohnbrötchen","Roggenbrötchen","Brezeln","Äpfel","Zitronen"]);
      return eingabe(`Ein Stück kostet <span class="ziel">${p} ct</span>. Frau Arslan bezahlt <span class="ziel">${komma(s)}</span> für ${d}.<br>Wie viele hat sie gekauft?`, [F.zahl], n, {tag:"geldmal", sollText:String(n),
        erkl:`Rechne in Cent: ${komma(s)} = ${s} ct. Wie oft passen ${p} ct hinein? ${s} ÷ ${p} = <b>${n}</b>.`}); },
    g_dreisatz(){ const n1=rnd(3,7), p=aus([rnd(21,98),rnd(21,98),rnd(102,160)]), n2=rnd(2,n1-1), d=aus(["Einladungskarten","Girlanden","Lampions","Kerzen","Luftballons"]);
      return eingabe(`<span class="ziel">${n1} ${d}</span> kosten <span class="ziel">${komma(n1*p)}</span>.<br>Wie teuer sind <span class="ziel">${n2} ${d}</span>?`, [F.euK,F.ctK], n2*p, {tag:"geldmal", sollText:komma(n2*p), streng:true,
        erkl:`Zwei Schritte: <b>erst eine</b>, dann ${n2}.<br>1. ${komma(n1*p)} ÷ ${n1} = <b>${komma(p)}</b> – so viel kostet ein Stück.<br>2. ${n2} · ${komma(p)} = <b>${komma(n2*p)}</b>.`}); },
    gs_plus(){ let a,b; do{ a=rnd(105,6999); b=rnd(95,5999); }while(a+b>9999 || ohneUebertrag(a,b)); return mitErkl(schriftPlus([a,b],true)); },
    gs_plus3(){ let a,b,c; do{ a=rnd(115,995); b=rnd(95,899); c=rnd(15,599); }while(a+b+c>2999); return mitErkl(schriftPlus([a,b,c],true)); },
    gs_minus(){ let a,b; do{ a=aus([1000,1000,2000,1500,3000,rnd(301,999),rnd(301,999)]); b=rnd(105,a-15); }while(ohneEntbuendeln(a,b)); return mitErkl(schriftMinus(a,b,true)); },
    g_gross(){ const e=rnd(11,98)*10+aus([0,0,5,1,2,3,7]), l=zerlege(e*100);
      return eingabe("Wie viel Geld ist das?", [F.eur], e*100, {bild:mische(l).map(v=>geldBild(v,true)).join(""), tag:"zaehlen", sollText:`${e} €`,
        erkl:`Fang mit den größten Scheinen an und zähle weiter: ${summenKette(l)} = <b>${e} €</b>.`}); },
    g_grossLegen(){ const e=rnd(12,98)*10+aus([0,5,5,2,3,7]);
      return {art:"legen", frage:`Lege genau <span class="ziel">${e} €</span> – mit möglichst wenigen Scheinen und Münzen.`, soll:e*100, kasse:[20000,10000,5000,2000,1000,500,200,100], tag:"legen", sollText:`${e} €`,
        erkl:`Eine Möglichkeit mit wenigen Stücken: ${summenKette(zerlege(e*100))} = <b>${e} €</b>.`}; },
    // ===== Rechnen für die Bunte Mischung: Plus, Minus, Mal, Geteilt, Zerlegen, Rechenwege, fehlende Zahl =====
    // (probe = [linke Zahl, Rechenzeichen, rechte Zahl, Ergebnis] – damit prüfen die Tests jede Aufgabe nach)
    rp_20(){ const a=rnd(4,9), b=rnd(11-a,9), bis=10-a;
      return rechen(`${a} + ${b}`, a+b, [a,"+",b,a+b], `Erst bis zur 10, dann der Rest: ${a} + ${bis} = 10, dann noch + ${b-bis} = <b>${a+b}</b>.`); },
    rm_20(){ const a=rnd(11,18), b=rnd(a-9,9), bis=a-10;
      return rechen(`${a} − ${b}`, a-b, [a,"-",b,a-b], `Erst zurück bis zur 10, dann der Rest: ${a} − ${bis} = 10, dann noch − ${b-bis} = <b>${a-b}</b>.`); },
    rp_100(){ let a,b; do{ a=rnd(16,68); b=rnd(13,29); }while(a%10+b%10<10 || a+b>99);
      return rechen(`${a} + ${b}`, a+b, [a,"+",b,a+b], `Schrittweise: ${a} + ${Math.floor(b/10)*10} = ${a+Math.floor(b/10)*10}, dann + ${b%10} = <b>${a+b}</b>.`); },
    rm_100(){ let a,b; do{ a=rnd(41,95); b=rnd(13,38); }while(a%10>=b%10);
      return rechen(`${a} − ${b}`, a-b, [a,"-",b,a-b], `Schrittweise: ${a} − ${Math.floor(b/10)*10} = ${a-Math.floor(b/10)*10}, dann − ${b%10} = <b>${a-b}</b>.`); },
    rp_1000(){ const a=rnd(12,58)*10, b=rnd(12,38)*10;
      return rechen(`${a} + ${b}`, a+b, [a,"+",b,a+b], `Rechne mit den Zehnern wie mit kleinen Zahlen: ${a/10} + ${b/10} = ${(a+b)/10} – also <b>${a+b}</b>.`); },
    rm_1000(){ const a=rnd(42,95)*10, b=rnd(12,38)*10;
      return rechen(`${a} − ${b}`, a-b, [a,"-",b,a-b], `Rechne mit den Zehnern wie mit kleinen Zahlen: ${a/10} − ${b/10} = ${(a-b)/10} – also <b>${a-b}</b>.`); },
    rx_kern(){ const a=aus([2,5,10,rnd(2,9)]), b=aus([2,5,10]), q=Math.random()<0.3, x=q?rnd(3,9):a, y=q?x:b;
      return rechen(`${x} × ${y}`, x*y, [x,"*",y,x*y], `Das ist eine <b>Kernaufgabe</b> – die sollte man auswendig wissen: ${x} × ${y} = <b>${x*y}</b>.`); },
    rx_alle(){ const a=rnd(3,9), b=rnd(3,9), n=b===5||b===10?null:b>5?[10,`${a} × 10 = ${a*10}, dann ${10-b}-mal ${a} zurück`]:[5,`${a} × 5 = ${a*5}, dann ${b-5>0?b-5:5-b}-mal ${a} ${b>5?"dazu":"zurück"}`];
      return rechen(`${a} × ${b}`, a*b, [a,"*",b,a*b], `${a} × ${b} = <b>${a*b}</b>. Hilfe über eine Kernaufgabe: ${a} × ${b>=5?5:2} = ${a*(b>=5?5:2)}, dann ${Math.abs(b-(b>=5?5:2))}-mal ${a} dazu.`); },
    rd_alle(){ const b=rnd(2,9), q=rnd(2,9);
      return rechen(`${b*q} ÷ ${b}`, q, [b*q,"/",b,q], `Denk an die Malaufgabe: Welche Zahl mal ${b} ergibt ${b*q}? <b>${q}</b> × ${b} = ${b*q}.`); },
    rz_10(){ const a=rnd(1,9);
      return rechen(`${a} + ☐ = 10`, 10-a, [a,"+",10-a,10], `Die Partnerzahlen zur 10: ${a} und <b>${10-a}</b> gehören zusammen.`); },
    rz_20(){ const a=rnd(11,19);
      return rechen(`${a} + ☐ = 20`, 20-a, [a,"+",20-a,20], `Wie bei der 10: ${a-10} + ${20-a} = 10, also ${a} + <b>${20-a}</b> = 20.`); },
    rz_100(){ let a; do{ a=rnd(12,89); }while(a%10===0); const z=10-a%10;
      return rechen(`${a} + ☐ = 100`, 100-a, [a,"+",100-a,100], `Erst bis zum nächsten Zehner (${z}), dann bis 100 (${100-a-z}): zusammen <b>${100-a}</b>.`); },
    rw_malZehner(){ const a=rnd(3,9), b=rnd(2,9)*10;
      return rechen(`${a} × ${b}`, a*b, [a,"*",b,a*b], `Erst die kleine Aufgabe: ${a} × ${b/10} = ${a*b/10}. Dann die Null wieder dazu: <b>${a*b}</b>.`); },
    rw_malZerlegen(){ const a=rnd(3,8), b=rnd(11,19);
      return rechen(`${a} × ${b}`, a*b, [a,"*",b,a*b], `Zerlege die ${b} in 10 und ${b-10}: ${a} × 10 = ${a*10} und ${a} × ${b-10} = ${a*(b-10)}. Zusammen <b>${a*b}</b>.`); },
    rf_plus(){ const b=rnd(3,9), c=rnd(b+3,20), vorn=Math.random()<0.5;
      return rechen(vorn?`☐ + ${b} = ${c}`:`${b} + ☐ = ${c}`, c-b, [c-b,"+",b,c], `Bei Plus fehlt ein Teil: <b>Summe minus die Zahl, die du kennst</b>. ${c} − ${b} = <b>${c-b}</b>.`); },
    rf_minus(){ const b=rnd(3,9), c=rnd(4,12), vorn=Math.random()<0.5, a=b+c;
      return vorn ? rechen(`☐ − ${b} = ${c}`, a, [a,"-",b,c], `Die erste, große Zahl fehlt: <b>Ergebnis plus die zweite Zahl</b>. ${c} + ${b} = <b>${a}</b>.`)
                  : rechen(`${a} − ☐ = ${c}`, b, [a,"-",b,c], `Die zweite Zahl fehlt: <b>erste Zahl minus Ergebnis</b>. ${a} − ${c} = <b>${b}</b>.`); },
    rf_mal(){ const a=rnd(3,9), b=rnd(3,9), vorn=Math.random()<0.5;
      return rechen(vorn?`☐ × ${b} = ${a*b}`:`${a*b} ÷ ☐ = ${b}`, a, vorn?[a,"*",b,a*b]:[a*b,"/",a,b], `Mal und Geteilt helfen sich gegenseitig: ${a*b} ÷ ${b} = <b>${a}</b>, denn ${a} × ${b} = ${a*b}.`); },
    // ===== Zahlen bis 1 Million (Klasse 4) =====
    m_stelle(){ let n; do{ n=rnd(123456,987654); }while(new Set(String(n)).size<6 || String(n).includes("0")); const i=rnd(0,5), r=+String(n)[i];
      return eingabe(`Welche Ziffer steht an der <span class="ziel">${MSTELLE[i]}stelle</span> von <span class="ziel">${fmt(n)}</span>?`, [F.zahl], r, {tag:"stelle", sollText:String(r),
        erkl:`Von rechts nach links: Einer, Zehner, Hunderter, Tausender, Zehntausender, Hunderttausender.<br>${String(n).split("").map((z,k)=>`${MKURZ[k]} <b>${z}</b>`).join(" · ")}`}); },
    m_zerlegt(){ const d=[rnd(1,9)].concat(Array.from({length:5},()=>aus([0,0,rnd(1,9),rnd(1,9)]))), n=+d.join(""); if(d.filter(x=>x).length<3) return BAU.m_zerlegt();
      return eingabe(`<span class="ziel">${d.map((z,k)=>z?fmt(z*Math.pow(10,5-k)):"").filter(x=>x).join(" + ")}</span> = ?`, [F.gross], n, {tag:"stelle", sollText:fmt(n),
        erkl:`Jede Stelle bekommt ihre Ziffer – wo nichts steht, kommt eine <b>0</b> hin.<br>${d.map((z,k)=>`${MKURZ[k]} <b>${z}</b>`).join(" · ")} → <b>${fmt(n)}</b>`}); },
    m_stellenwert(){ const d=[rnd(1,9)].concat(Array.from({length:5},()=>aus([0,rnd(1,9),rnd(1,9)]))), n=+d.join(""); if(d.filter(x=>x).length<3 || !d.includes(0)) return BAU.m_stellenwert();
      return eingabe(`<span class="ziel">${d.map((z,k)=>z?`${z} ${MKURZ[k]}`:"").filter(x=>x).join(", ")}</span> – welche Zahl ist das?`, [F.gross], n, {tag:"stelle", sollText:fmt(n),
        erkl:`HT = Hunderttausender, ZT = Zehntausender, T = Tausender, H, Z, E. Fehlt eine Stelle, steht dort eine <b>0</b>: <b>${fmt(n)}</b>.`}); },
    m_vorNach(){ const n=aus([rnd(11,99)*1000,rnd(11,99)*1000+999,rnd(2,9)*100000,99999,rnd(2,9)*100000-1,rnd(100001,999998),rnd(11,99)*10000]), vor=Math.random()<0.5, r=vor?n-1:n+1;
      return eingabe(`Welche Zahl kommt direkt <span class="ziel">${vor?"vor":"nach"} ${fmt(n)}</span>?`, [F.gross], r, {tag:"nachbar", sollText:fmt(r),
        erkl:`${vor?"Der Vorgänger ist 1 kleiner":"Der Nachfolger ist 1 größer"}: ${fmt(n)} ${vor?"−":"+"} 1 = <b>${fmt(r)}</b>. Achte auf den Übergang: Aus lauter Neunen werden Nullen.`}); },
    m_nachbarT(){ let n; do{ n=rnd(10100,989900); }while(n%1000===0); const a=Math.floor(n/1000)*1000, ok=`${fmt(a)} und ${fmt(a+1000)}`;
      return {art:"wahl", frage:`Zwischen welchen <span class="ziel">Tausenderzahlen</span> liegt <span class="ziel">${fmt(n)}</span>?`, optionen:mische([ok,`${fmt(a-1000)} und ${fmt(a)}`,`${fmt(Math.floor(n/10000)*10000)} und ${fmt(Math.floor(n/10000)*10000+10000)}`,`${fmt(Math.floor(n/100)*100)} und ${fmt(Math.floor(n/100)*100+100)}`]), ok, tag:"nachbar", sollText:ok, spalten:1,
        erkl:`Die Nachbartausender: Schau auf die letzten drei Ziffern und mach daraus 000 – das ist der Tausender davor. Der nächste ist 1000 größer: <b>${ok}</b>.`}; },
    m_strahl(){ const a=strahlAufgabe(STRAHLMIO, aus(["pfeil","pfeil","schritt","wo"])), gross=s=>String(s).replace(/\d{5,}/g, m=>fmt(m));      // große Zahlen auch im Text in Dreiergruppen
      a.frage=gross(a.frage); a.erkl=gross(a.erkl); a.sollText=gross(a.sollText); return a; },
    m_vergleich(){ let a=rnd(102345,987654), b; const z=String(a).split(""), i=rnd(0,4), fall=rnd(0,3); if(fall===0){ b=a; } else if(fall===1){ [z[i],z[i+1]]=[z[i+1],z[i]]; b=+z.join(""); } else if(fall===2){ b=Math.floor(a/10); } else { b=a+aus([1000,-1000,10,-100]); }
      const ok=a<b?"<":a>b?">":"=";
      return {art:"wahl", frage:`Welches Zeichen passt?<br><span class="ziel">${fmt(a)} ☐ ${fmt(b)}</span>`, optionen:["<","=",">"], ok, tag:"zvergleich", sollText:`${fmt(a)} ${ok} ${fmt(b)}`,
        erkl:`Erst zählen: Welche Zahl hat <b>mehr Stellen</b>? Die ist größer. Bei gleich vielen Stellen vergleichst du von links, Ziffer für Ziffer. <b>${fmt(a)} ${ok} ${fmt(b)}</b>`}; },
    m_runde(){ const k=aus([[1000,"Tausender","Hunderter"],[10000,"Zehntausender","Tausender"],[100000,"Hunderttausender","Zehntausender"]]); let n; do{ n=rnd(k[0]+1,989999); }while(n%k[0]===0 || n<k[0]); const r=Math.round(n/k[0])*k[0], z=Math.floor(n/(k[0]/10))%10;
      return eingabe(`Runde <span class="ziel">${fmt(n)}</span> auf <span class="ziel">${k[1]}</span>.`, [F.gross], r, {tag:"runden", sollText:fmt(r),
        erkl:`Schau auf die Stelle rechts daneben, die <b>${k[2]}</b>: dort steht ${z}. Bei 0 bis 4 wird <b>ab</b>gerundet, bei 5 bis 9 <b>auf</b>gerundet. ${fmt(n)} ≈ <b>${fmt(r)}</b>.`}); },
    m_plus(){ const f=aus([1000,10000]), a=rnd(12,58)*f, b=rnd(11,39)*f;
      return eingabe(`<span class="ziel" style="font-size:28px">${fmt(a)} + ${fmt(b)}</span>`, [F.gross], a+b, {tag:"kopf", sollText:fmt(a+b), probe:[a,"+",b,a+b], erkl:`Rechne mit den ${f===1000?"Tausendern":"Zehntausendern"} wie mit kleinen Zahlen: ${a/f} + ${b/f} = ${(a+b)/f}. Dann die Nullen wieder dazu: <b>${fmt(a+b)}</b>.`}); },
    m_minus(){ const f=aus([1000,10000]), a=rnd(52,95)*f, b=rnd(12,48)*f;
      return eingabe(`<span class="ziel" style="font-size:28px">${fmt(a)} − ${fmt(b)}</span>`, [F.gross], a-b, {tag:"kopf", sollText:fmt(a-b), probe:[a,"-",b,a-b], erkl:`Rechne mit den ${f===1000?"Tausendern":"Zehntausendern"} wie mit kleinen Zahlen: ${a/f} − ${b/f} = ${(a-b)/f}. Dann die Nullen wieder dazu: <b>${fmt(a-b)}</b>.`}); },
    m_mal(){ const a=rnd(2,9), f=aus([100,1000,10000]), b=rnd(2,9)*f;
      return eingabe(`<span class="ziel" style="font-size:28px">${a} × ${fmt(b)}</span>`, [F.gross], a*b, {tag:"kopf", sollText:fmt(a*b), probe:[a,"*",b,a*b], erkl:`Erst die kleine Aufgabe: ${a} × ${b/f} = ${a*b/f}. Dann die ${String(f).length-1} Nullen wieder dazu: <b>${fmt(a*b)}</b>.`}); },
    m_teil(){ const b=rnd(2,9), q=rnd(2,9), f=aus([100,1000,10000]);
      return eingabe(`<span class="ziel" style="font-size:28px">${fmt(b*q*f)} ÷ ${b}</span>`, [F.gross], q*f, {tag:"kopf", sollText:fmt(q*f), probe:[b*q*f,"/",b,q*f], erkl:`Erst die kleine Aufgabe: ${b*q} ÷ ${b} = ${q}. Dann die ${String(f).length-1} Nullen wieder dazu: <b>${fmt(q*f)}</b>.`}); },
    // ===== Sachaufgaben in zwei Schritten (und: Was war am Anfang?) =====
    q_anfangPlus(){ const k=aus(QKIND), d=aus(QDING), b=rnd(4,25), a=rnd(6,40);
      return sach(`${k[0]} hat einige ${d}. ${k[1]} bekommt noch <b>${b}</b> dazu. Jetzt hat ${k[2]} <b>${a+b}</b> ${d}.`, `Wie viele ${d} hatte ${k[0]} am Anfang?`, a, a+b+b,
        [`Am Anfang waren es weniger – du musst <b>rückwärts</b> rechnen.`, `${a+b} − ${b} = <b>${a}</b>`], `${k[0]} hatte am Anfang ${a} ${d}.`, `Probe: ${a} + ${b} = ${a+b}.`); },
    q_anfangMinus(){ const k=aus(QKIND), d=aus(QDING), b=rnd(4,20), c=rnd(6,35);
      return sach(`${k[0]} hat einige ${d}. ${k[1]} verschenkt <b>${b}</b> davon. Jetzt hat ${k[2]} noch <b>${c}</b> ${d}.`, `Wie viele ${d} hatte ${k[0]} am Anfang?`, b+c, Math.abs(c-b),
        [`Am Anfang waren es <b>mehr</b> – die verschenkten kommen wieder dazu.`, `${c} + ${b} = <b>${b+c}</b>`], `${k[0]} hatte am Anfang ${b+c} ${d}.`, `Probe: ${b+c} − ${b} = ${c}.`); },
    q_anfangMal(){ const k=aus(QKIND), d=aus(QDING), b=rnd(3,9), n=rnd(3,9);
      return sach(`${k[0]} packt ${d} in Tüten. In jede Tüte kommen <b>${b}</b>. Zusammen sind es <b>${b*n}</b> ${d}.`, `Wie viele Tüten hat ${k[0]} gepackt?`, n, b*n-b,
        [`Wie oft passt ${b} in ${b*n}? Das ist eine <b>Geteilt</b>-Aufgabe.`, `${b*n} ÷ ${b} = <b>${n}</b>`], `${k[0]} hat ${n} Tüten gepackt.`, `Probe: ${n} × ${b} = ${b*n}.`); },
    q_plusMinus(){ const k=aus(QKIND), a=rnd(25,60), b=rnd(6,19), c=rnd(5,25), zuerstWeg=Math.random()<0.5, r=a-b+c;
      return sach(zuerstWeg ? `${k[0]} hat <b>${a} €</b> gespart. ${k[1]} kauft ein Buch für <b>${b} €</b>. Dann bekommt ${k[2]} von Oma <b>${c} €</b>.` : `${k[0]} hat <b>${a} €</b> gespart. Von Oma bekommt ${k[2]} <b>${c} €</b>. Dann kauft ${k[2]} ein Buch für <b>${b} €</b>.`,
        `Wie viel Geld hat ${k[0]} jetzt?`, r, zuerstWeg?a-b:a+c,
        zuerstWeg ? [`1. Schritt: ${a} € − ${b} € = ${a-b} €`, `2. Schritt: ${a-b} € + ${c} € = <b>${r} €</b>`] : [`1. Schritt: ${a} € + ${c} € = ${a+c} €`, `2. Schritt: ${a+c} € − ${b} € = <b>${r} €</b>`], `${k[0]} hat jetzt ${r} €.`); },
    q_bus(){ const a=rnd(24,58), b=rnd(6,18), c=rnd(4,16), r=a-b+c;
      return sach(`Im Bus sitzen <b>${a}</b> Fahrgäste. An der Haltestelle steigen <b>${b}</b> aus und <b>${c}</b> ein.`, `Wie viele Fahrgäste sind jetzt im Bus?`, r, a-b,
        [`1. Schritt (aussteigen): ${a} − ${b} = ${a-b}`, `2. Schritt (einsteigen): ${a-b} + ${c} = <b>${r}</b>`], `Jetzt sind ${r} Fahrgäste im Bus.`); },
    q_malPlus(){ const k=aus(QKIND), n=rnd(3,8), p=rnd(2,6), e=rnd(3,12), w=aus([["Hefte","einen Füller"],["Pinsel","einen Farbkasten"],["Brötchen","einen Kuchen"],["Kinokarten","eine Tüte Popcorn"]]);
      return sach(`${k[0]} kauft <b>${n}</b> ${w[0]} für je <b>${p} €</b> und ${w[1]} für <b>${e} €</b>.`, `Wie viel muss ${k[0]} bezahlen?`, n*p+e, n*p,
        [`1. Schritt (${w[0]}): ${n} × ${p} € = ${n*p} €`, `2. Schritt (alles zusammen): ${n*p} € + ${e} € = <b>${n*p+e} €</b>`], `${k[0]} muss ${n*p+e} € bezahlen.`); },
    q_malRueck(){ const k=aus(QKIND), n=rnd(3,8), p=rnd(2,6), g=n*p<20?aus([20,50]):50, w=aus(["Hefte","Eintrittskarten","Eisbecher","Blumen"]);
      return sach(`${k[0]} kauft <b>${n}</b> ${w} für je <b>${p} €</b>. ${k[1]} bezahlt mit einem <b>${g}-€-Schein</b>.`, `Wie viel Geld bekommt ${k[0]} zurück?`, g-n*p, n*p,
        [`1. Schritt (Preis): ${n} × ${p} € = ${n*p} €`, `2. Schritt (Rückgeld): ${g} € − ${n*p} € = <b>${g-n*p} €</b>`], `${k[0]} bekommt ${g-n*p} € zurück.`); },
    q_summeTeil(){ const t=rnd(2,6), ges=t*rnd(4,9), a=rnd(3,ges-3), w=aus([["rote","blaue","Perlen","Ketten","jede Kette"],["große","kleine","Kekse","Teller","jeden Teller"],["gelbe","grüne","Luftballons","Kinder","jedes Kind"]]);
      return sach(`Es gibt <b>${a}</b> ${w[0]} und <b>${ges-a}</b> ${w[1]} ${w[2]}. Sie werden gerecht auf <b>${t}</b> ${w[3]} verteilt.`, `Wie viele ${w[2]} bekommt ${w[4]}?`, ges/t, ges,
        [`1. Schritt (alle zusammen): ${a} + ${ges-a} = ${ges}`, `2. Schritt (verteilen): ${ges} ÷ ${t} = <b>${ges/t}</b>`], `${w[4][0].toUpperCase()+w[4].slice(1)} bekommt ${ges/t} ${w[2]}.`); },
    q_teilMinus(){ const t=rnd(2,6), q=rnd(5,9), ab=rnd(1,q-2), d=aus(["Karten","Sticker","Murmeln"]);
      return sach(`<b>${t}</b> Kinder teilen <b>${t*q}</b> ${d} gerecht. Danach verschenkt jedes Kind <b>${ab}</b> davon.`, `Wie viele ${d} hat jedes Kind noch?`, q-ab, q,
        [`1. Schritt (teilen): ${t*q} ÷ ${t} = ${q}`, `2. Schritt (verschenken): ${q} − ${ab} = <b>${q-ab}</b>`], `Jedes Kind hat noch ${q-ab} ${d}.`); },
    // ===== Schriftlich teilen (Klasse 4) =====
    sd_ohne(){ const b=rnd(2,4), q=[rnd(1,Math.floor(9/b)),rnd(0,Math.floor(9/b)),rnd(1,Math.floor(9/b))]; return schriftGeteilt(+q.join("")*b, b); },      // jede Stelle geht einzeln auf: 848 : 4
    sd_mit(){ let a,b; do{ b=rnd(2,9); a=b*rnd(Math.ceil(100/b),Math.floor(999/b)); }while(String(a).split("").every(z=>z%b===0)); return schriftGeteilt(a, b); },
    sd_rest(){ let a,b; do{ b=rnd(2,9); a=rnd(113,989); }while(a%b===0); return schriftGeteilt(a, b); },
    sd_gross(){ let a,b; do{ b=rnd(2,9); a=b*rnd(Math.ceil(1000/b),Math.floor(9999/b)); }while(a<1000); return schriftGeteilt(a, b); },
    // ===== Formen und Körper =====
    f_form(){ const p=["Kreis","Dreieck","Quadrat","Rechteck"], ok=aus(p);
      return {art:"wahl", frage:"Wie heißt diese Form?", bild:formBild(ok), optionen:mische(p), ok, tag:"form", sollText:ok, erkl:FORMINFO[ok]}; },
    f_form2(){ const p=["Dreieck","Quadrat","Rechteck","Fünfeck","Sechseck","Kreis"], ok=aus(p);
      return {art:"wahl", frage:"Wie heißt diese Form?", bild:formBild(ok), optionen:mische([ok].concat(mische(p.filter(x=>x!==ok)).slice(0,3))), ok, tag:"form", sollText:ok, erkl:FORMINFO[ok]}; },
    f_ecken(){ const f=aus([["Dreieck",3],["Quadrat",4],["Rechteck",4],["Fünfeck",5],["Sechseck",6]]), was=aus(["Ecken","Seiten"]);
      return eingabe(`Wie viele <span class="ziel">${was}</span> hat ein <span class="ziel">${f[0]}</span>?`, [F.zahl], f[1], {bild:formBild(f[0]), tag:"ecken", sollText:String(f[1]),
        erkl:`Zähle reihum: Ein ${f[0]} hat <b>${f[1]} Ecken</b> und <b>${f[1]} Seiten</b>. Es sind immer gleich viele.`}); },
    f_koerper(){ const p=Object.keys(KOERPER), ok=aus(p);
      return {art:"wahl", frage:"Wie heißt dieser Körper?", bild:koerperBild(ok), optionen:mische([ok].concat(mische(p.filter(x=>x!==ok)).slice(0,3))), ok, tag:"koerper", sollText:ok, erkl:KOERPER[ok].info}; },
    f_alltag(){ const d=aus([["Ein Fußball","Kugel"],["Ein Spielwürfel","Würfel"],["Ein Schuhkarton","Quader"],["Eine Konservendose","Zylinder"],["Eine Eistüte","Kegel"],["Ein Partyhut","Kegel"],
        ["Ein Zelt mit Spitze","Pyramide"],["Eine Orange","Kugel"],["Ein Ziegelstein","Quader"],["Eine Kerze","Zylinder"],["Ein Zuckerwürfel","Würfel"],["Eine Murmel","Kugel"]]), p=Object.keys(KOERPER);
      return {art:"wahl", frage:`<span class="ziel">${d[0]}</span> hat die Form von …`, optionen:mische([d[1]].concat(mische(p.filter(x=>x!==d[1])).slice(0,3))), ok:d[1], tag:"koerper", sollText:d[1],
        bildDanach:koerperBild(d[1]), erkl:`${d[0]} sieht aus wie ein Körper mit dem Namen <b>${d[1]}</b>. ${KOERPER[d[1]].info}`}; },
    f_eck(){ const k=aus(["Würfel","Quader","Pyramide"]), i=rnd(0,2), was=["Ecken","Kanten","Flächen"][i], w=KOERPER[k].ekf;
      return eingabe(`Wie viele <span class="ziel">${was}</span> hat ${k==="Pyramide"?"eine":"ein"} <span class="ziel">${k}</span>?`, [F.zahl], w[i], {bild:koerperBild(k), tag:"ecken", sollText:String(w[i]),
        erkl:`${k}: <b>${w[0]} Ecken</b>, <b>${w[1]} Kanten</b>, <b>${w[2]} Flächen</b>. Eine Kante ist dort, wo zwei Flächen zusammenstoßen.`}); },
    f_rund(){ const d=aus([["Zylinder","Flächen",3,"zwei Kreise (oben und unten) und eine gebogene Fläche rundherum"],["Kegel","Flächen",2,"einen Kreis unten und eine gebogene Fläche"],["Kugel","Flächen",1,"nur eine einzige gebogene Fläche – und keine Ecken und Kanten"],["Kegel","Spitzen",1,"genau eine Spitze oben"]]);
      return eingabe(`Wie viele <span class="ziel">${d[1]}</span> hat ${d[0]==="Kugel"?"eine":"ein"} <span class="ziel">${d[0]}</span>?`, [F.zahl], d[2], {bild:koerperBild(d[0]), tag:"ecken", sollText:String(d[2]), erkl:`${d[0]==="Kugel"?"Eine":"Ein"} ${d[0]} hat ${d[3]}: <b>${d[2]}</b>.`}); },
    f_sym(){ const senk="AHMOTUVWXY", waag="BCDEHKOX", keine="FGJLNPRSZ", l=aus((senk+waag+keine+keine).split("")), achse=aus(["senkrecht","waagerecht"]);
      const ja=(achse==="senkrecht"?senk:waag).includes(l), ok=ja?"Ja":"Nein";
      return {art:"wahl", frage:"Ist die gestrichelte Linie eine <span class=\"ziel\">Spiegelachse</span>?", bild:symBild(l,achse), optionen:["Ja","Nein"], ok, tag:"symmetrie", sollText:ok,
        erkl:`Stell dir vor, du faltest das Bild an der Linie. ${ja?"Beide Hälften liegen <b>genau aufeinander</b> – es ist eine Spiegelachse.":"Die beiden Hälften passen <b>nicht</b> aufeinander – es ist keine Spiegelachse."}`}; },
    f_flaeche(){ const a=rnd(2,8), b=rnd(2,5);
      return eingabe("Wie viele <span class=\"ziel\">Kästchen</span> groß ist das Rechteck?", [F.zahl], a*b, {bild:gitterBild(a,b), lineal:true, tag:"flaeche", sollText:String(a*b),
        erkl:`Du musst nicht jedes Kästchen zählen: In einer Reihe sind ${a}, es gibt ${b} Reihen. ${b} × ${a} = <b>${a*b} Kästchen</b>. Das ist der <b>Flächeninhalt</b>.`}); },
    f_umfang(){ let a,b; do{ a=rnd(2,8); b=rnd(2,5); }while(2*(a+b)===a*b);
      return eingabe("Wie lang ist der <span class=\"ziel\">Rand</span> des Rechtecks (in Kästchenlängen)?", [F.zahl], 2*(a+b), {bild:gitterBild(a,b), lineal:true, tag:"flaeche", falle:a*b, sollText:String(2*(a+b)),
        erkl:`Geh einmal außen herum: ${a} + ${b} + ${a} + ${b} = <b>${2*(a+b)}</b>. Das ist der <b>Umfang</b>. (Der Flächeninhalt wären ${a*b} Kästchen – das ist etwas anderes.)`}); },
    // ===== Daten und Zufall =====
    d_strich(){ const n=rnd(3,24);
      return eingabe("Wie viele Striche sind das?", [F.zahl], n, {bild:strichBild(n), tag:"liste", sollText:String(n),
        erkl:`Ein Bündel mit Querstrich sind immer <b>5</b>. ${Math.floor(n/5)} Bündel sind ${Math.floor(n/5)*5}${n%5?`, dazu ${n%5} einzelne`:""}: <b>${n}</b>.`}); },
    d_diaLesen(){ const d=diaDaten(), x=aus(d);
      return eingabe(`Wie viele Kinder mögen am liebsten <span class="ziel">${x[0]}</span>?`, [F.zahl], x[1], {bild:balkenBild(d), lineal:true, tag:"diagramm", sollText:String(x[1]),
        erkl:`Such die Säule „${x[0]}“ und schau, bis zu welcher Linie sie reicht. Links liest du die Zahl ab: <b>${x[1]}</b>.`}); },
    d_diaMax(){ const d=diaDaten(), gross=Math.random()<0.6, w=d.map(x=>x[1]), r=d.find(x=>x[1]===(gross?Math.max(...w):Math.min(...w)));
      return {art:"wahl", frage:`Welches Tier ist am <span class="ziel">${gross?"beliebtesten":"wenigsten beliebt"}</span>?`, bild:balkenBild(d), lineal:true, optionen:d.map(x=>x[0]), ok:r[0], tag:"diagramm", sollText:r[0],
        erkl:`Die ${gross?"höchste":"niedrigste"} Säule gehört zu „${r[0]}“: ${r[1]} Kinder.`}; },
    d_diaUnterschied(){ const d=diaDaten(), s=mische(d), a=s[0][1]>s[1][1]?s[0]:s[1], b=a===s[0]?s[1]:s[0];
      return eingabe(`Wie viele Kinder mögen <span class="ziel">${a[0]}</span> <span class="ziel">mehr</span> als ${b[0]}?`, [F.zahl], a[1]-b[1], {bild:balkenBild(d), lineal:true, tag:"diagramm", sollText:String(a[1]-b[1]),
        erkl:`${a[0]}: ${a[1]} · ${b[0]}: ${b[1]}. Der Unterschied ist ${a[1]} − ${b[1]} = <b>${a[1]-b[1]}</b>.`}); },
    d_diaSumme(){ const d=diaDaten(), s=d.reduce((x,y)=>x+y[1],0);
      return eingabe("Wie viele Kinder wurden <span class=\"ziel\">insgesamt</span> gefragt?", [F.zahl], s, {bild:balkenBild(d), lineal:true, tag:"diagramm", sollText:String(s),
        erkl:`Zähle alle Säulen zusammen: ${d.map(x=>x[1]).join(" + ")} = <b>${s}</b>.`}); },
    d_sicher(){ const fall=aus(["sicher","möglich","möglich","unmöglich"]), f=mische(Object.keys(FARBEN)); let kugeln, frag;
      if(fall==="sicher"){ kugeln=Array(rnd(4,7)).fill(f[0]); frag=f[0]; }
      else if(fall==="unmöglich"){ kugeln=Array(rnd(2,4)).fill(f[0]).concat(Array(rnd(2,4)).fill(f[1])); frag=f[2]; }
      else { kugeln=Array(rnd(1,4)).fill(f[0]).concat(Array(rnd(1,4)).fill(f[1])); frag=f[0]; }
      return {art:"wahl", frage:`Du ziehst mit geschlossenen Augen eine Kugel.<br>„Die Kugel ist <span class="ziel">${frag}</span>.“ – Das ist …`, bild:beutelBild(mische(kugeln)), optionen:["sicher","möglich","unmöglich"], ok:fall, tag:"zufall", sollText:fall,
        erkl: fall==="sicher" ? `Im Beutel sind <b>nur</b> ${frag}e Kugeln. Es <b>muss</b> eine ${frag}e sein: <b>sicher</b>.` : fall==="unmöglich" ? `Im Beutel ist <b>keine</b> ${frag}e Kugel. Das kann nie passieren: <b>unmöglich</b>.`
              : `Im Beutel sind ${frag}e Kugeln, aber auch andere. Es <b>kann</b> passieren, muss aber nicht: <b>möglich</b>.`}; },
    d_wahrsch(){ const f=mische(Object.keys(FARBEN)).slice(0,3), n=mische([rnd(1,2),rnd(3,4),rnd(5,7)]), gross=Math.random()<0.6;
      const kugeln=f.flatMap((x,i)=>Array(n[i]).fill(x)), ziel=f[n.indexOf(gross?Math.max(...n):Math.min(...n))];
      return {art:"wahl", frage:`Welche Farbe ziehst du am <span class="ziel">${gross?"wahrscheinlichsten":"unwahrscheinlichsten"}</span>?`, bild:beutelBild(mische(kugeln)), optionen:f.slice().sort(), ok:ziel, tag:"zufall", sollText:ziel,
        erkl:`Zähle die Kugeln: ${f.map((x,i)=>`${n[i]} ${x}`).join(", ")}. Von ${ziel} gibt es am ${gross?"meisten":"wenigsten"} – diese Farbe ziehst du am ${gross?"wahrscheinlichsten":"unwahrscheinlichsten"}.`}; },
    d_kombi(){ const a=rnd(2,4), b=rnd(2,4), s=aus([[`Lena hat <span class="ziel">${a} T-Shirts</span> und <span class="ziel">${b} Hosen</span>.<br>Wie viele verschiedene Outfits kann sie anziehen?`,"Jedes T-Shirt passt zu jeder Hose"],
        [`Es gibt <span class="ziel">${a} Eissorten</span> und <span class="ziel">${b} Sorten Streusel</span>.<br>Wie viele verschiedene Eisbecher (eine Sorte Eis, eine Sorte Streusel) gibt es?`,"Jede Eissorte passt zu jeder Sorte Streusel"],
        [`Tom hat <span class="ziel">${a} Mützen</span> und <span class="ziel">${b} Schals</span>.<br>Wie viele verschiedene Paare aus Mütze und Schal kann er tragen?`,"Jede Mütze passt zu jedem Schal"]]);
      return eingabe(s[0], [F.zahl], a*b, {tag:"kombi", falle:a+b, sollText:String(a*b), erkl:`${s[1]}. Das sind ${a} × ${b} = <b>${a*b} Möglichkeiten</b> (nicht ${a} + ${b}).`}); },
    // ----- Gewichte -----
    w_schwerer(){ let a,b; do{ a=aus(WIEGT); b=aus(WIEGT); }while(a===b || Math.max(a[1],b[1])<Math.min(a[1],b[1])*3); const ok=a[1]>b[1]?a:b, gross=s=>s[0].toUpperCase()+s.slice(1);
      return {art:"wahl", frage:"Was ist <span class=\"ziel\">schwerer</span>?", optionen:mische([gross(a[0]),gross(b[0])]), ok:gross(ok[0]), tag:"vergleich", sollText:gross(ok[0]),
        erkl:`${gross(a[0])} wiegt ungefähr <b>${a[2]}</b>, ${b[0]} ungefähr <b>${b[2]}</b>. Schwerer ist: <b>${ok[0]}</b>.`}; },
    w_schaetzen(){ const s=aus(GSCHAETZEN);
      return {art:"wahl", frage:s[0].replace("…",'<span class="ziel">…</span>'), optionen:mische([s[1]].concat(s[2])), ok:s[1], tag:"einheit", sollText:s[1],
        erkl:`${s[0].replace("…",`<b>${s[1]}</b>`)}<br>Zum Merken: <b>1 g</b> wiegt eine Büroklammer, <b>100 g</b> eine Tafel Schokolade, <b>1 kg</b> eine Packung Mehl.`}; },
    w_stuecke(){ let l,sum; do{ l=[]; const n=rnd(2,4); for(let i=0;i<n;i++) l.push(aus([500,200,200,100,100,50,50,20,10])); sum=l.reduce((a,b)=>a+b,0); }while(sum>=1000 || l.filter(x=>x===500).length>1);
      l.sort((a,b)=>b-a);
      return eingabe("Wie schwer sind die Gewichtsstücke zusammen?", [F.g], sum, {bild:l.map(gewichtBild).join(""), tag:"wiegen", sollText:`${sum} g`,
        erkl:`Fang mit dem größten Stück an und zähle weiter: ${gKette(l)} = <b>${sum} g</b>.`}); },
    w_stueckeKg(){ const c=rnd(1,6)*1000+aus([100,200,250,300,500,550,700,750,120,60]), l=zerlegeG(c);
      return eingabe("Wie schwer sind die Gewichtsstücke zusammen?", [F.kg,F.g], c, {bild:mische(l).map(gewichtBild).join(""), tag:"wiegen", sollText:gewText(c), streng:true,
        erkl:`Zähle zuerst die <b>Kilogramm</b>, dann die <b>Gramm</b>: ${gKette(l)} = <b>${gewText(c)}</b>.`}); },
    w_kgInG(){ const k=rnd(2,9);
      return eingabe(`<span class="ziel">${k} kg</span> = wie viele Gramm?`, [F.g], k*1000, {tag:"umrechnen", sollText:`${k*1000} g`, erkl:`<b>1 kg sind 1000 g.</b> ${k} kg sind ${k} × 1000 = <b>${k*1000} g</b>.`}); },
    w_kgGInG(){ const k=rnd(1,8), r=aus([rnd(1,19)*50, rnd(1,19)*50, rnd(1,9)*10, rnd(1,9)]);
      return eingabe(`<span class="ziel">${k} kg ${r} g</span> = wie viele Gramm?`, [F.g], k*1000+r, {tag:"umrechnen", sollText:`${k*1000+r} g`, erkl:`${k} kg sind ${k*1000} g, dazu ${r} g: <b>${k*1000+r} g</b>.`}); },
    w_gAus(){ let c; do{ c=rnd(21,179)*50; }while(c%1000===0);
      return eingabe(`<span class="ziel">${c} g</span> = wie viele Kilogramm und Gramm?`, [F.kg,F.g], c, {tag:"umrechnen", sollText:gewText(c), streng:true,
        erkl:`<b>1000 g sind 1 kg.</b> In ${c} g stecken ${Math.floor(c/1000)} volle Tausender – das sind ${Math.floor(c/1000)} kg. Übrig bleiben ${c%1000} g.`}); },
    w_bruch(){ const b=aus([["Ein halbes Kilogramm","500 g",["50 g","250 g","5000 g"],"Die Hälfte von 1000 g ist 500 g."],["Ein Viertel Kilogramm","250 g",["25 g","400 g","500 g"],"1000 g geteilt durch 4 sind 250 g."],
        ["Drei Viertel Kilogramm","750 g",["75 g","300 g","340 g"],"Ein Viertel sind 250 g – drei Viertel sind 3 × 250 g = 750 g."],["Ein ganzes Kilogramm","1000 g",["100 g","10 g","10 000 g"],"Kilo heißt tausend: 1 kg = 1000 g."],
        ["Eineinhalb Kilogramm","1500 g",["150 g","1050 g","1005 g"],"1 kg sind 1000 g, ein halbes dazu sind 500 g: zusammen 1500 g."]]);
      return {art:"wahl", frage:`<span class="ziel">${b[0]}</span> – wie viele Gramm sind das?`, optionen:mische([b[1]].concat(b[2])), ok:b[1], tag:"umrechnen", sollText:b[1], erkl:`<b>1 kg = 1000 g.</b> ${b[3]}`}; },
    w_rechneMinus(){ const c=aus([rnd(1,19)*50, rnd(1,19)*50, rnd(1,39)*25]);
      return eingabe(`<span class="ziel">1 kg − ${c} g</span> = wie viele Gramm?`, [F.g], 1000-c, {tag:"rechnen", sollText:`${1000-c} g`, erkl:`Wandle zuerst um: <b>1 kg = 1000 g</b>. Dann 1000 g − ${c} g = <b>${1000-c} g</b>.`}); },
    w_rechnePlus(){ let a,b; do{ a=rnd(7,19)*50; b=rnd(5,19)*50; }while(a+b<=1000 || (a+b)%1000===0); const s=a+b;
      return eingabe(`<span class="ziel">${a} g + ${b} g</span> = wie viele Kilogramm und Gramm?`, [F.kg,F.g], s, {tag:"rechnen", sollText:gewText(s), streng:true,
        erkl:`${a} g + ${b} g = ${s} g. 1000 g davon sind 1 kg: <b>${gewText(s)}</b>.`}); },
    w_mal(){ let p,n; do{ p=aus(PACKUNG); n=rnd(3,8); }while(p[2]*n<=1000 || (p[2]*n)%1000===0); const s=p[2]*n;
      return eingabe(`${p[0]} wiegt <span class="ziel">${p[2]} g</span>.<br>Wie viel wiegen <span class="ziel">${n} ${p[1]}</span>?`, [F.kg,F.g], s, {tag:"rechnen", sollText:gewText(s), streng:true,
        erkl:`${n} × ${p[2]} g = ${s} g. 1000 g davon sind 1 kg: <b>${gewText(s)}</b>.`}); },
    w_tInKg(){ const t=rnd(2,9);
      return eingabe(`<span class="ziel">${t} t</span> = wie viele Kilogramm?`, [F.kgT], t*1000, {tag:"umrechnen", sollText:`${t*1000} kg`, erkl:`<b>1 t (Tonne) sind 1000 kg.</b> ${t} t sind ${t} × 1000 = <b>${t*1000} kg</b>.`}); },
    w_kgAusT(){ let c; do{ c=rnd(21,179)*50; }while(c%1000===0);
      return eingabe(`<span class="ziel">${c} kg</span> = wie viele Tonnen und Kilogramm?`, [F.t,F.kgT], c, {tag:"umrechnen", sollText:tText(c), streng:true,
        erkl:`<b>1000 kg sind 1 t.</b> In ${c} kg stecken ${Math.floor(c/1000)} volle Tausender – das sind ${Math.floor(c/1000)} t. Übrig bleiben ${c%1000} kg.`}); },
    w_schaetzenT(){ const s=aus(TSCHAETZEN);
      return {art:"wahl", frage:s[0].replace("…",'<span class="ziel">…</span>'), optionen:mische([s[1]].concat(s[2])), ok:s[1], tag:"einheit", sollText:s[1],
        erkl:`${s[0].replace("…",`<b>${s[1]}</b>`)}<br>Zum Merken: <b>1 t</b> wiegt ein kleines Auto. 1 t = 1000 kg.`}; },
    w_lkw(){ const t=rnd(2,6), drauf=rnd(3,t*20-3)*50, rest=t*1000-drauf;
      return eingabe(`Ein Lastwagen darf <span class="ziel">${t} t</span> laden. <span class="ziel">${drauf} kg</span> sind schon aufgeladen.<br>Wie viele Kilogramm passen noch darauf?`, [F.kgT], rest, {tag:"rechnen", sollText:`${rest} kg`,
        erkl:`Wandle um: ${t} t = ${t*1000} kg. Dann ${t*1000} kg − ${drauf} kg = <b>${rest} kg</b>.`}); },
    // ----- Längen -----
    l_messen(){ const cm=rnd(2,11);
      return eingabe("Wie lang ist der Stift?", [F.cmM], cm, {bild:linealBild(0,cm*10), lineal:true, tag:"messen", sollText:`${cm} cm`,
        erkl:`Der Stift beginnt bei der <b>0</b> und endet bei der <b>${cm}</b>. Er ist <b>${cm} cm</b> lang.`}); },
    l_messenVersetzt(){ const von=rnd(1,3), cm=rnd(3,8);
      return eingabe("Wie lang ist der Stift? Schau genau, wo er anfängt!", [F.cmM], cm, {bild:linealBild(von*10,(von+cm)*10), lineal:true, tag:"messen", falle:von+cm, sollText:`${cm} cm`,
        erkl:`Achtung: Der Stift beginnt nicht bei 0, sondern bei der <b>${von}</b>. Von ${von} bis ${von+cm} sind es ${von+cm} − ${von} = <b>${cm} cm</b>.`}); },
    l_messenMm(){ let mm; do{ mm=rnd(23,115); }while(mm%10===0);
      return eingabe("Wie lang ist der Stift genau?", [F.cm,F.mm], mm, {bild:linealBild(0,mm), lineal:true, tag:"messen", sollText:`${Math.floor(mm/10)} cm ${mm%10} mm`, streng:true,
        erkl:`Der Stift reicht bis zur ${Math.floor(mm/10)} und noch ${mm%10} kleine Striche weiter. Jeder kleine Strich ist 1 mm: <b>${Math.floor(mm/10)} cm ${mm%10} mm</b>.`}); },
    l_cmInMm(){ const cm=rnd(2,25);
      return eingabe(`<span class="ziel">${cm} cm</span> = wie viele Millimeter?`, [F.mm], cm*10, {tag:"umrechnen", sollText:`${cm*10} mm`, erkl:`<b>1 cm sind 10 mm.</b> ${cm} cm sind ${cm} × 10 = <b>${cm*10} mm</b>.`}); },
    l_mmAus(){ let mm; do{ mm=rnd(12,150); }while(mm%10===0);
      return eingabe(`<span class="ziel">${mm} mm</span> = wie viele Zentimeter und Millimeter?`, [F.cm,F.mm], mm, {tag:"umrechnen", sollText:`${Math.floor(mm/10)} cm ${mm%10} mm`, streng:true,
        erkl:`<b>10 mm sind 1 cm.</b> In ${mm} mm stecken ${Math.floor(mm/10)} volle Zehner – das sind ${Math.floor(mm/10)} cm. Übrig bleiben ${mm%10} mm.`}); },
    l_cmMmInMm(){ const cm=rnd(1,15), r=rnd(1,9);
      return eingabe(`<span class="ziel">${cm} cm ${r} mm</span> = wie viele Millimeter?`, [F.mm], cm*10+r, {tag:"umrechnen", sollText:`${cm*10+r} mm`, erkl:`${cm} cm sind ${cm*10} mm, dazu ${r} mm: <b>${cm*10+r} mm</b>.`}); },
    l_mInCm(){ const m=rnd(2,9);
      return eingabe(`<span class="ziel">${m} m</span> = wie viele Zentimeter?`, [F.cmM], m*100, {tag:"umrechnen", sollText:`${m*100} cm`, erkl:`<b>1 m sind 100 cm.</b> ${m} m sind ${m} × 100 = <b>${m*100} cm</b>.`}); },
    l_cmAus(){ let c; do{ c=rnd(101,899); }while(c%100===0);
      return eingabe(`<span class="ziel">${c} cm</span> = wie viele Meter und Zentimeter?`, [F.m,F.cmM], c, {tag:"umrechnen", sollText:`${Math.floor(c/100)} m ${c%100} cm`, streng:true,
        erkl:`<b>100 cm sind 1 m.</b> In ${c} cm stecken ${Math.floor(c/100)} volle Hunderter – das sind ${Math.floor(c/100)} m. Übrig bleiben ${c%100} cm.`}); },
    l_mCmInCm(){ const m=rnd(1,8), r=aus([rnd(1,9),rnd(10,99),rnd(10,99)]);
      return eingabe(`<span class="ziel">${m} m ${r} cm</span> = wie viele Zentimeter?`, [F.cmM], m*100+r, {tag:"umrechnen", sollText:`${m*100+r} cm`, erkl:`${m} m sind ${m*100} cm, dazu ${r} cm: <b>${m*100+r} cm</b>.`}); },
    l_kommaWahl(){ const m=rnd(1,9), r=aus([rnd(1,9),rnd(1,9),rnd(10,99)]), ok=`${m},${zz(r)} m`;
      const falsch=[...new Set([`${m},${r} m`, `${m},${r}0 m`, `${m}${zz(r)} m`, `0,${m}${r} m`])].filter(x=>x!==ok).slice(0,3);
      return {art:"wahl", frage:`Wie schreibt man <span class="ziel">${m} m ${r} cm</span> mit Komma?`, optionen:mische([ok].concat(falsch)), ok, tag:"komma", sollText:ok,
        erkl:`Hinter dem Komma stehen <b>zwei Stellen</b> für die Zentimeter. ${r} cm schreibt man als „${zz(r)}“: <b>${ok}</b>.`}; },
    l_einheit(){ const s=aus(SCHAETZEN);
      return {art:"wahl", frage:s[0].replace("…",'<span class="ziel">…</span>'), optionen:mische([s[1]].concat(s[2])), ok:s[1], tag:"einheit", sollText:s[1], merk:s[0],
        erkl:`Stell es dir vor: ${s[0].replace("…",`<b>${s[1]}</b>`)} <br>Zum Merken: 1 mm ist so dick wie eine Bleistiftmine, 1 cm so breit wie ein Fingernagel, 1 m ein großer Schritt.`}; },
    l_rechneMinus(){ const c=rnd(11,89);
      return eingabe(`<span class="ziel">1 m − ${c} cm</span> = wie viele Zentimeter?`, [F.cmM], 100-c, {tag:"rechnen", sollText:`${100-c} cm`, erkl:`Wandle zuerst um: <b>1 m = 100 cm</b>. Dann 100 cm − ${c} cm = <b>${100-c} cm</b>.`}); },
    l_rechnePlus(){ let a,b; do{ a=rnd(35,95); b=rnd(25,95); }while(a+b<=100 || (a+b)%100===0); const s=a+b;
      return eingabe(`<span class="ziel">${a} cm + ${b} cm</span> = wie viele Meter und Zentimeter?`, [F.m,F.cmM], s, {tag:"rechnen", sollText:`${Math.floor(s/100)} m ${s%100} cm`, streng:true,
        erkl:`${a} cm + ${b} cm = ${s} cm. 100 cm davon sind 1 m: <b>${Math.floor(s/100)} m ${s%100} cm</b>.`}); },
    l_rechneMm(){ let a,b; do{ a=rnd(12,58); b=rnd(12,58); }while((a+b)%10===0); const s=a+b;
      return eingabe(`<span class="ziel">${a} mm + ${b} mm</span> = wie viele Zentimeter und Millimeter?`, [F.cm,F.mm], s, {tag:"rechnen", sollText:`${Math.floor(s/10)} cm ${s%10} mm`, streng:true,
        erkl:`${a} mm + ${b} mm = ${s} mm. Je 10 mm sind 1 cm: <b>${Math.floor(s/10)} cm ${s%10} mm</b>.`}); },
    l_seil(){ const m=rnd(2,6), ab=rnd(2,m*10-3)*10-aus([0,0,5]), rest=m*100-ab;
      return eingabe(`Ein Seil ist <span class="ziel">${m} m</span> lang. Es werden <span class="ziel">${ab} cm</span> abgeschnitten.<br>Wie lang ist das Seil jetzt?`, [F.m,F.cmM], rest, {tag:"rechnen", sollText:euroLaenge(rest), streng:true,
        erkl:`Wandle um: ${m} m = ${m*100} cm. Dann ${m*100} cm − ${ab} cm = ${rest} cm. Das sind <b>${euroLaenge(rest)}</b>.`}); }
  };
  function euroLaenge(c){ const m=Math.floor(c/100), r=c%100; return m&&r ? `${m} m ${r} cm` : m ? `${m} m` : `${r} cm`; }
  function baueAufgabe(st, typ){ typ=typ||aus(st.typen); const a=BAU[typ](); a.st=st; a.typ=typ; a.key=`${st.id}|${typ}`; return a; }
  function baueRunde(st, typen){
    const frei = !(typen && typen.length), imZoo = WAS==="zoo" && st.mix && frei, anzahl = st.mix && frei && !imZoo ? 15 : PRO_RUNDE;
    // Zoo: bis zu zwei Aufgabenarten, die dem Kind in früheren Zoo-Runden schwerfielen, kommen wieder – wer sie jetzt löst, hat bessere Chancen auf ein seltenes Tier
    let schwer=[]; if(imZoo){ try{ schwer=mische(meineTypen().offen.map(k=>String(k).split("|")).filter(x=>+x[0]===st.id && BAU[x[1]]).map(x=>x[1])).slice(0,2); }catch(e){} }
    const quelle = !frei ? typen : imZoo ? mische(schwer.concat(mische((st.kern||[]).filter(t=>!schwer.includes(t))).slice(0,4), mische(st.typen.filter(t=>!schwer.includes(t))).slice(0,6)).slice(0,10))
                 : st.mix ? mische(mische(st.kern||[]).slice(0,6).concat(mische(st.typen).slice(0,9))) : st.mischen ? mische(st.typen) : st.typen;
    const liste=[];
    for(let i=0;i<anzahl;i++){ const a=baueAufgabe(st, quelle[i%quelle.length]); if(schwer.includes(a.typ)) a.schwer=true; liste.push(a); }
    return mische(liste);
  }

  // ---------- Ablauf ----------
  let db=null, playerName="", MEINE=[], runde=null, wartet=false, timer=null, zeitRest=0, lauf=0, letzte=null, haufen=[];
  function zeige(id){ ["start","spiel","ergebnis"].forEach(s=>$(s).classList.toggle("hide", s!==id)); stoppZeit(); scrollTo(0,0); }
  function spaeter(ms){ const meiner=lauf; setTimeout(()=>{ if(meiner===lauf && runde) naechste(); }, ms); }
  function zeichneFortschritt(){ $("fortschritt").innerHTML=runde.aufgaben.map((a,i)=>`<i class="${runde.verlauf[i]===true?"ok":runde.verlauf[i]===false?"nein":""}"></i>`).join(""); }
  function starte(st, modus, typen){
    lauf++;
    runde={st, modus, aufgaben:baueRunde(st, typen), i:0, richtig:0, gestellt:[], fehler:[], antworten:[], verlauf:[], start:Date.now(), fehlerTexte:[]};
    $("spielTitel").textContent=(modus==="Test"?"Test":modus==="mine"?"Meine Aufgaben":"Üben")+" · "+st.name;
    zeige("spiel"); naechste();
  }
  function naechste(){
    if(runde.i>=runde.aufgaben.length){ fertig(); return; }
    wartet=false;
    const a=runde.aufgaben[runde.i];
    runde.gestellt.push(a.key);
    $("rueck").textContent=""; $("erkl").innerHTML="";
    $("frage").innerHTML=a.frage;
    zeichneFortschritt();
    const bild = a.bild ? `<div class="bild${a.lineal?" lineal":""}">${a.bild}</div>` : "";
    if(a.art==="eingabe"){
      $("buehne").innerHTML=bild+`<div class="eingabe">${a.felder.map((f,i)=>`<input type="text" id="feld${i}" inputmode="numeric" autocomplete="off" maxlength="${f.max||5}"${f.max?' style="width:190px"':""} placeholder="?"><span>${f.e}</span>`).join("")}<button id="okBtn">OK</button></div>`;
      const felder=a.felder.map((f,i)=>$("feld"+i));
      const pruef=()=>{
        if(wartet) return;
        if(felder.every(x=>x.value.trim()==="")) return;
        const werte=felder.map(x=>x.value.trim()===""?0:parseInt(x.value.replace(/[\s.\u202f]/g,""),10)||0), summe=werte.reduce((s,w,i)=>s+w*a.felder[i].f,0);
        felder.forEach(x=>x.disabled=true); $("okBtn").disabled=true;
        const text=werte.map((w,i)=>`${w} ${a.felder[i].e}`).join(" ");
        // „streng": bei zwei Feldern muss richtig getauscht sein (nicht 0 € 345 ct)
        const getauscht = a.felder.length<2 || werte[1] < a.felder[0].f/a.felder[1].f;
        const zweiOk=a.felder.every((f,i)=>!f.zwei || felder[i].value.trim().length===2);      // 2,5 € ist nicht 2,05 € – hinter dem Komma stehen zwei Stellen
        if(!zweiOk){ a.zweiFalsch=true; auswerten(a, false, text+" (Cent nicht zweistellig)", null, false); return; }
        auswerten(a, summe===a.soll && (getauscht || !a.streng), text, summe, summe===a.soll && !getauscht);
      };
      $("okBtn").addEventListener("click", pruef);
      felder.forEach((x,i)=>x.addEventListener("keydown", e=>{ if(e.key!=="Enter") return; if(i<felder.length-1 && x.value.trim()!=="" && felder[i+1].value.trim()==="") felder[i+1].focus(); else pruef(); }));
      try{ felder[0].focus({preventScroll:true}); }catch(e){}
    }else if(a.art==="wahl"){
      $("buehne").innerHTML=bild+`<div class="wahl"${a.spalten===1?' style="grid-template-columns:1fr"':a.optionen.length===3?' style="grid-template-columns:1fr 1fr 1fr"':""}>${a.optionen.map((o,i)=>`<button data-i="${i}">${o}</button>`).join("")}</div>`;
      $("buehne").querySelectorAll(".wahl button").forEach(b=>b.addEventListener("click",()=>{
        if(wartet) return;
        const o=a.optionen[+b.dataset.i];
        $("buehne").querySelectorAll(".wahl button").forEach((x,i)=>{ x.disabled=true; if(a.optionen[i]===a.ok) x.classList.add("richtig"); });
        if(o!==a.ok) b.classList.add("falsch");
        auswerten(a, o===a.ok, a.optText ? a.optText[+b.dataset.i] : o, null, false);      // bei Bildern als Antwort nur den Text speichern
      }));
    }else if(a.art==="schrift"){
      $("buehne").innerHTML=schriftGitter(a,false)+`<div class="schriftTipp">${a.uebertrag?"Die kleinen Kästchen sind für die gemerkten Zahlen – du darfst sie benutzen.":"Fang rechts bei den Einern an."}</div><div class="reihe"><button id="okBtn">OK</button></div>`;
      const erg=[...$("buehne").querySelectorAll("input[data-e]")], alle=[...$("buehne").querySelectorAll("input")];
      const pruef=()=>{
        if(wartet) return;
        const s=erg.map(x=>x.value.trim()).join(""); if(s==="") return;
        const luecke=/\S\s+\S/.test(erg.map(x=>x.value.trim()||" ").join("")), wert=/^\d+$/.test(s)&&!luecke ? parseInt(s,10) : NaN;
        alle.forEach(x=>x.disabled=true); $("okBtn").disabled=true;
        auswerten(a, wert===a.soll, s, isNaN(wert)?null:wert, false);
      };
      erg.forEach((x,i)=>x.addEventListener("input", ()=>{ x.value=x.value.replace(/\D/g,"").slice(-1); if(x.value && i>0) erg[i-1].focus(); }));
      alle.forEach(x=>{ x.addEventListener("keydown", e=>{ if(e.key==="Enter") pruef(); }); if(x.dataset.u!==undefined) x.addEventListener("input", ()=>{ x.value=x.value.replace(/\D/g,"").slice(-1); }); });
      $("okBtn").addEventListener("click", pruef);
      try{ erg[erg.length-1].focus({preventScroll:true}); }catch(e){}
    }else{   // legen
      haufen=[];
      $("buehne").innerHTML=`<div class="haufen" id="haufen">Tippe unten auf Münzen und Scheine.</div>
        <div class="kasse">${a.kasse.map(v=>`<button data-v="${v}" aria-label="${stueckName(v)}">${geldBild(v,true)}</button>`).join("")}</div>
        <div class="reihe"><button class="ghost klein" id="leerBtn">Alles zurück</button><button id="okBtn">Fertig ✓</button></div>`;
      const mal=()=>{ $("haufen").innerHTML = haufen.length ? haufen.map((v,i)=>`<button data-i="${i}" title="zurücklegen">${geldBild(v,true)}</button>`).join("") : "Tippe unten auf Münzen und Scheine.";
        $("haufen").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{ if(wartet) return; haufen.splice(+b.dataset.i,1); mal(); })); };
      $("buehne").querySelectorAll(".kasse button").forEach(b=>b.addEventListener("click",()=>{ if(wartet || haufen.length>=14) return; haufen.push(+b.dataset.v); mal(); }));
      $("leerBtn").addEventListener("click",()=>{ if(!wartet){ haufen=[]; mal(); } });
      $("okBtn").addEventListener("click",()=>{ if(wartet || !haufen.length) return; const s=haufen.reduce((x,y)=>x+y,0); $("okBtn").disabled=true; auswerten(a, s===a.soll, komma(s), s, false); });
    }
    starteZeit();
  }
  function auswerten(a, ok, gegebenText, summe, nichtGetauscht){
    stoppZeit(); wartet=true;
    runde.verlauf[runde.i]=ok; zeichneFortschritt(); runde.i++;
    const r=$("rueck");
    if(ok){
      runde.richtig++; r.style.color="var(--good)";
      r.textContent = nichtGetauscht ? `Richtig! Man schreibt es so: ${a.sollText}` : "Richtig! 👍";
      wartet=false; spaeter(nichtGetauscht?2200:950); return;
    }
    runde.fehler.push(a.key); runde.fehlerTexte.push(a.sollText);
    // Denkfehler erkennen: Umrechnungszahl verwechselt (10 statt 100) oder beim Lineal das Ende abgelesen
    let art="groesse_"+a.tag, zusatz="";
    if(summe!==null && a.tag==="umrechnen" && (summe===a.soll*10 || summe*10===a.soll)){ art="groesse_faktor"; }
    if(a.falle && summe===a.falle){ art="groesse_"+(a.falleArt||"ablesen"); }
    if(a.streng && summe===a.soll && !nichtGetauscht===false) zusatz="";
    if(a.art==="legen" && summe!==null) zusatz=` Du hast ${komma(summe)} gelegt – das ist ${summe>a.soll?"zu viel":"zu wenig"}.`;
    if(a.zweiFalsch){ zusatz=`<br><b>Achtung:</b> Hinter dem Komma stehen immer <b>zwei</b> Ziffern – 5 ct schreibt man als „05“, 50 ct als „50“.`; art="groesse_komma"; }
    runde.antworten.push(`${a.typ.slice(2)}|${a.sollText}|${gegebenText}|${art}`);
    r.style.color="var(--bad)"; r.textContent=`Das stimmt noch nicht. Richtig ist ${a.sollText}.`;
    if(runde.modus==="Test"){ wartet=false; spaeter(1700); return; }
    $("erkl").innerHTML=`<div class="erkl"><div class="t">💡 So geht es</div>${a.erkl}${zusatz}<div class="reihe"><button id="weiterBtn">Weiter ▶</button></div></div>`;
    $("weiterBtn").addEventListener("click",()=>{ wartet=false; naechste(); });
    setTimeout(()=>{ try{ $("weiterBtn").focus({preventScroll:true}); $("erkl").scrollIntoView({block:"nearest",behavior:"smooth"}); }catch(e){} }, 300);
  }
  function starteZeit(){
    stoppZeit();
    const test=runde && runde.modus==="Test";
    $("zeitbalken").classList.toggle("hide", !test);
    if(!test) return;
    const sek=runde.st.sek||TEST_SEK; zeitRest=sek; $("zeitfuell").style.width="100%";
    timer=setInterval(()=>{ zeitRest-=0.25; $("zeitfuell").style.width=Math.max(0,zeitRest/sek*100)+"%";
      if(zeitRest<=0){ stoppZeit(); const a=runde.aufgaben[runde.i]; runde.verlauf[runde.i]=false; runde.fehler.push(a.key); runde.fehlerTexte.push(a.sollText); runde.antworten.push(`${a.typ.slice(2)}|${a.sollText}|zeit|zeit`);
        zeichneFortschritt(); runde.i++; $("rueck").style.color="var(--bad)"; $("rueck").textContent=`Die Zeit ist um. Richtig ist ${a.sollText}.`; wartet=false; spaeter(1700); } },250);
  }
  function stoppZeit(){ if(timer){ clearInterval(timer); timer=null; } }

  function fertig(){
    stoppZeit();
    const n=runde.aufgaben.length, proz=Math.round(runde.richtig/n*100), test=runde.modus==="Test", bestanden=test && proz>=BESTANDEN;
    zeige("ergebnis");
    $("ergProzent").textContent=proz+" %";
    $("ergTitel").textContent = test ? (bestanden?"✅ Test bestanden!":"💪 Noch nicht ganz") : proz===100?"🌟 Perfekt!":proz>=90?"🎉 Super!":proz>=70?"👍 Gut gemacht!":"💪 Weiter üben";
    const f=[...new Set(runde.fehlerTexte)];
    $("ergText").innerHTML=`<b>${runde.richtig}</b> von <b>${n}</b> richtig – ${esc(runde.st.name)}.`+(test?`<br>${bestanden?"Diese Stufe sitzt. Probier die nächste!":`Bestanden ist der Test ab ${BESTANDEN} %.`}`:"")+
      (f.length?`<br><br><b>Das üben wir noch:</b> ${f.slice(0,8).map(esc).join(" · ")}`:"");
    // Bunte Mischung = Check über alle Themen: nach der Runde zeigen, welches Thema sitzt und welches noch nicht
    if(WAS==="mix"){
      const th={}; runde.aufgaben.forEach((a,i)=>{ const t=THEMA(a.typ); (th[t[0]]=th[t[0]]||{name:t[1],r:0,n:0}); th[t[0]].n++; if(runde.verlauf[i]) th[t[0]].r++; });
      let zu=[]; try{ if(localStorage.getItem("uhr_test_frei")!=="1") zu=JSON.parse(localStorage.getItem("mathe_zu")||"[]"); }catch(e){}
      const zeilen=Object.keys(th).sort((x,y)=>th[x].r/th[x].n-th[y].r/th[y].n).map(app=>{ const x=th[app], gut=x.r===x.n;
        return `<div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-top:1px solid var(--card2)"><span style="flex:1"><b>${x.name}</b></span><span style="font-weight:800;color:${gut?"#86efac":x.r?"#fde047":"#fca5a5"}">${gut?"✅":"⚠️"} ${x.r} von ${x.n}</span>`+
          (!gut && !zu.includes(app) ? `<a href="${app}-trainer.html#name=${encodeURIComponent(playerName)}" style="color:#7dd3fc;font-weight:700;font-size:13.5px;white-space:nowrap">üben ›</a>` : `<span style="width:52px"></span>`)+`</div>`; }).join("");
      $("ergText").innerHTML=`<b>${runde.richtig}</b> von <b>${n}</b> richtig – ${esc(runde.st.name)}.`+(test?`<br>${bestanden?"Stark – das meiste sitzt!":`Bestanden ist der Check ab ${BESTANDEN} %.`}`:"")+
        `<div style="margin-top:12px;font-weight:800;color:var(--text)">So sieht es bei den Themen aus:</div>${zeilen}<div style="margin-top:8px;font-size:13px">Was noch nicht sitzt, schlägt dir der Mathe-Trainer auf der Startseite zum Üben vor.</div>`;
    }
    if(WAS==="zoo" && window.Zoo){
      // Wie viele Tiere? 10 von 10 = zwei (das erste mindestens selten) · 7 bis 9 = eines · 5 oder 6 = ein häufiges · darunter keines
      const besitz=Zoo.zaehle(MEINE), nTiere = runde.richtig===n ? 2 : runde.richtig*2>=n ? 1 : 0, nurHaeufig = runde.richtig*10 < n*7, schwerGut=runde.aufgaben.filter((a,i)=>a.schwer && runde.verlauf[i]).length;
      const bonus=Math.min(1, (runde.richtig===n?0.5:runde.richtig>=n-1?0.25:0)+schwerGut*0.25), tiere=[];
      for(let i=0;i<nTiere;i++){ const id=Zoo.ziehe(besitz, nurHaeufig?0:bonus, i===0 && runde.richtig===n ? 2 : 0, nurHaeufig ? 1 : 0); tiere.push(id); besitz[id]=(besitz[id]||0)+1; }
      runde.tiere=tiere;
      $("ergTitel").textContent = tiere.length ? (tiere.length===1?"🎉 Ein neues Tier zieht ein!":"🎉 Zwei neue Tiere ziehen ein!") : "💪 Diesmal noch kein Tier";
      $("ergText").innerHTML=`<b>${runde.richtig}</b> von <b>${n}</b> Aufgaben richtig.`+(tiere.length ? Zoo.neuHTML(tiere) : "<br>Ab <b>5 richtigen</b> Aufgaben zieht ein Tier in deinen Zoo ein. Gleich noch einmal?")+(tiere.length && nurHaeufig ? "<div>Mit <b>7 oder mehr</b> richtigen Aufgaben kann es beim nächsten Mal auch ein seltenes Tier sein.</div>" : "")+
        (schwerGut ? `<div>💪 Du hast ${schwerGut===1?"eine Aufgabe":schwerGut+" Aufgaben"} gelöst, die dir früher schwerfiel${schwerGut===1?"":"en"} – das macht seltene Tiere wahrscheinlicher.</div>` : "")+
        `<div style="margin-top:8px;font-size:13px">5 oder 6 richtige: ein häufiges Tier · 7 bis 9: ein Tier, vielleicht ein seltenes ⭐ · 10 von 10: <b>zwei</b> Tiere, eines davon selten.</div>`;
    }
    letzte=runde;
    $("nochmalBtn").onclick=()=>starte(letzte.st, letzte.modus==="mine"?"Training":letzte.modus);
    speichere(proz, bestanden);
    if(bestanden || (!test && proz>=90)) konfetti();
  }
  function speichere(proz, bestanden){
    const d=new Date(), p=x=>String(x).padStart(2,"0"), r=runde, mine=r.modus==="mine";
    const eintrag={ key:KEY, app:APP, name:playerName, datum:`${p(d.getDate())}.${p(d.getMonth()+1)}.${d.getFullYear()}`, zeit:`${p(d.getHours())}:${p(d.getMinutes())}`,
      modus:r.modus==="Test"?"Test":"Training", reihe:mine?"mine":"s"+r.st.id, zr:r.st.id, stufe:r.modus==="Test"?"Mittel":(mine?"eigene Fehler":r.st.name), stufeName:mine?"Meine Aufgaben":r.st.name,
      richtig:r.richtig, falsch:r.aufgaben.length-r.richtig, prozent:proz, bestanden:r.modus==="Test"?(bestanden?"Ja":"Nein"):"–", dauer:Math.round((Date.now()-r.start)/1000),
      gestellt:r.gestellt.slice(), fehler:r.fehler.slice(), antworten:r.antworten.slice() };
    if(r.tiere) eintrag.tiere=r.tiere.slice();           // Mein Zoo: die in dieser Runde gewonnenen Tiere
    try{
      const emp=Sterne.empfohlen(APP); if(emp) eintrag.empfohlen=true;
      const vor=Sterne.stand(MEINE); MEINE.unshift(eintrag); const nachher=Sterne.stand(MEINE);
      if(emp && nachher.silber>vor.silber) Sterne.empfehlungErledigt();
      Sterne.zeigeUnterschied(vor, nachher, playerName, false, true, emp && nachher.silber>vor.silber);
    }catch(e){ if(MEINE[0]!==eintrag) MEINE.unshift(eintrag); }
    if(!db){ $("status").textContent="⚠️ Ohne Verbindung – nicht gespeichert."; return; }
    const id=`${APP}_${eintrag.datum}_${eintrag.zeit}_${playerName}_${Date.now()%100000}`.replace(/[\/\s.]/g,"_");
    db.collection("ergebnisse").doc(id).set(eintrag).catch(err=>{ $("status").textContent="⚠️ Nicht gespeichert: "+(err.code||err); });
  }
  // ---------- Menü ----------
  function stufenStand(id){
    const r=MEINE.filter(e=>+e.zr===id && e.reihe!=="mine");
    return { geuebt:r.filter(e=>e.modus==="Training").length, tests:r.filter(e=>e.modus==="Test").length, bestanden:r.some(e=>e.modus==="Test" && e.bestanden==="Ja"),
             besterTest:r.filter(e=>e.modus==="Test").reduce((m,e)=>Math.max(m,+e.prozent||0),0) };
  }
  function meineTypen(){
    const facts=new Set(); MEINE.forEach(e=>(e.fehler||[]).forEach(f=>facts.add(f)));
    const offen=[], faellig=[];
    facts.forEach(k=>{ const s=Wdh.status(MEINE,k); if(s.offen) offen.push(k); else if(s.faellig) faellig.push(k); });
    return {offen, faellig};
  }
  function zeigeMenue(){
    const dran=STUFEN.find(s=>!stufenStand(s.id).bestanden);
    $("stufen").innerHTML=STUFEN.map(s=>{ const z=stufenStand(s.id);
      const info = z.bestanden ? `✓ Test bestanden · ${z.geuebt}× geübt` : z.tests ? `${z.geuebt}× geübt · bester Test ${z.besterTest} %` : z.geuebt ? `${z.geuebt}× geübt · noch kein Test` : s.kurz;
      return `<div class="stufe${z.bestanden?" fertig":""}${dran&&dran.id===s.id?" dran":""}"><span class="nr">${z.bestanden?"✓":s.id}</span><span class="tx"><b>${s.name}</b><span>${info}</span></span>
        <span class="kn"><button class="klein" data-ueben="${s.id}">Üben</button><button class="ghost klein" data-test="${s.id}"${WAS==="mix"?' style="border-color:#f59e0b;color:#fde68a"':""}>${WAS==="mix"?"Check ⭐×2":"Test"}</button></span></div>`; }).join("")+
      (WAS==="mix" ? `<div class="info" style="margin-bottom:8px;border:1px solid rgba(245,158,11,.5)">📝 <b>Der Check</b> zeigt dir, was du schon sicher kannst und was du vergessen hast. Der <b>erste Check am Tag</b> bringt <b>doppelte Sterne und doppelt Sprit</b> – auch wenn nicht alles richtig ist (ab der Hälfte richtiger Aufgaben).</div>` : "");
    $("stufen").querySelectorAll("[data-ueben]").forEach(b=>b.addEventListener("click",()=>starte(stufe(+b.dataset.ueben),"Training")));
    $("stufen").querySelectorAll("[data-test]").forEach(b=>b.addEventListener("click",()=>starte(stufe(+b.dataset.test),"Test")));
    if(WAS==="zoo" && window.Zoo){
      $("stufen").querySelectorAll("[data-test]").forEach(b=>b.remove());
      $("stufen").querySelectorAll("[data-ueben]").forEach(b=>{ b.textContent="Runde spielen ▶"; });
      // der Zoo steht oben; ein Knopf springt gleich zu den Runden, damit niemand lange blättern muss
      $("zooFeld").innerHTML=`<button id="zooLos" style="width:100%;font-size:19px;padding:15px;margin-bottom:14px">▶ Neue Tiere holen</button>`+Zoo.feldHTML(Zoo.zaehle(MEINE), "🦁 Mein Zoo");
      $("zooLos").addEventListener("click", ()=>{ try{ $("stufen").scrollIntoView({behavior:"smooth", block:"center"}); }catch(e){ $("stufen").scrollIntoView(); } });
    }
    const z=meineTypen(), n=z.offen.length+z.faellig.length;
    $("meineText").textContent = n ? `${z.offen.length?z.offen.length+(z.offen.length===1?" Aufgabenart sitzt":" Aufgabenarten sitzen")+" noch nicht":""}${z.offen.length&&z.faellig.length?" · ":""}${z.faellig.length?"🔁 "+z.faellig.length+(z.faellig.length===1?" Wiederholung ist":" Wiederholungen sind")+" heute dran":""}`
                                   : "Gerade nichts offen – Fehler aus dem Üben landen automatisch hier.";
    $("meineBtn").disabled=!n;
    $("menue").classList.remove("hide");
  }
  $("meineBtn").addEventListener("click", ()=>{
    const z=meineTypen(), keys=z.offen.concat(z.faellig); if(!keys.length) return;
    const pro={}; keys.forEach(k=>{ const [id,typ]=k.split("|"); if(BAU[typ]) (pro[id]=pro[id]||[]).push(typ); });
    const id=Object.keys(pro).sort((a,b)=>pro[b].length-pro[a].length)[0]; if(!id) return;
    starte(stufe(+id)||STUFEN[0], "mine", pro[id]);
  });
  $("abbruchBtn").addEventListener("click", ()=>{ lauf++; runde=null; zeige("start"); zeigeMenue(); });
  $("zumMenue").addEventListener("click", ()=>{ zeige("start"); zeigeMenue(); });

  function tsKey(e){ const [t,m,j]=String(e.datum||"01.01.2000").split("."); return `${j}${m}${t}${String(e.zeit||"00:00").replace(":","")}`; }
  function ladeMeine(){
    if(!db || !playerName){ zeigeMenue(); return; }
    db.collection("ergebnisse").where("key","==",KEY).where("app","==",APP).where("name","==",playerName).get()
      .then(s=>{ MEINE=[]; s.forEach(d=>MEINE.push(d.data())); MEINE.sort((a,b)=>tsKey(b).localeCompare(tsKey(a)));
        $("status").textContent=`☁️ Verbunden · ${MEINE.length} ${MEINE.length===1?"Durchgang":"Durchgänge"} gespeichert`;
        if(!$("start").classList.contains("hide")) zeigeMenue(); })
      .catch(err=>{ $("status").textContent="⚠️ Keine Verbindung: "+(err.code||err); zeigeMenue(); });
  }
  function konfetti(){
    const c=document.createElement("canvas"); c.style.cssText="position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999"; document.body.appendChild(c);
    const x=c.getContext("2d"); c.width=innerWidth; c.height=innerHeight;
    const col=["#facc15","#22c55e","#60a5fa","#ef4444","#a78bfa","#ec4899"], ps=[];
    for(let i=0;i<130;i++) ps.push({x:Math.random()*c.width,y:-20-Math.random()*c.height,r:6+Math.random()*8,c:col[(Math.random()*col.length)|0],vy:2+Math.random()*4,vx:-2+Math.random()*4,rot:Math.random()*Math.PI,vr:-.2+Math.random()*.4});
    const ende=Date.now()+2800;
    (function f(){ x.clearRect(0,0,c.width,c.height); ps.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; p.rot+=p.vr; x.save(); x.translate(p.x,p.y); x.rotate(p.rot); x.fillStyle=p.c; x.fillRect(-p.r/2,-p.r/2,p.r,p.r*.6); x.restore(); });
      if(Date.now()<ende) requestAnimationFrame(f); else c.remove(); })();
  }
  // Kein Offline-Cache: auf iPad/iPhone (Safari) blockiert enablePersistence jede Verbindung zur Datenbank
  try{ firebase.initializeApp(CONF); db=firebase.firestore(); }catch(e){ $("status").textContent="⚠️ Fehler: "+e; }
  const m=location.hash.match(/name=([^&]+)/);
  let n = m ? decodeURIComponent(m[1]) : "";
  if(!n){ try{ n=localStorage.getItem("mathe_name")||""; }catch(e){} }
  if(n){ playerName=capName(n); $("name").value=playerName; $("menuLink").href="index.html#name="+encodeURIComponent(playerName); zeigeMenue(); setTimeout(ladeMeine, 300); }
  addEventListener("pagehide", stoppZeit);
  // für die automatischen Tests
  window.Groessen={ STUFEN, BAU, baueAufgabe, starte, stufe, zeigeMenue, get runde(){ return runde; }, get MEINE(){ return MEINE; }, set MEINE(v){ MEINE=v; }, ohneDb(){ db=null; },
                    komma, euroCent, zerlege, linealBild, geldBild, gewText, tText, ziffern, THEMA };
})();
