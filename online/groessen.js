// ===== Größen: Geld, Längen und Gewichte =====
// Gemeinsamer Motor für geld-trainer.html, laengen-trainer.html und gewichte-trainer.html (window.GROESSE = "geld" | "laengen" | "gewichte").
// Jede Aufgabe ist eine von drei Arten:
//   eingabe – ein oder zwei Zahlenfelder mit Einheit (3 € 45 ct)
//   wahl    – eine von mehreren Antworten antippen
//   legen   – einen Betrag mit Münzen und Scheinen selbst legen
(function(){
  const WAS=["laengen","gewichte","zahlen","geo","daten","schrift","kalender","mix","sach2","strahl","zoo","blitz","stellen","paeckchen"].includes(window.GROESSE) ? window.GROESSE : "geld";
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
    zoo:["🦁","Mein Zoo","Löse Aufgaben aus allen Themen – wer gut rechnet, bekommt neue Tiere."],
    blitz:["⚡","Blitzrechnen","Kopfrechnen, bis es blitzschnell geht – jeden Tag ein, zwei Minuten."],
    stellen:["🧱","Stellenwerte","Mit Hundertern, Zehnern und Einern legen – und sehen, wie die Zahl entsteht."],
    paeckchen:["🕵️","Entdecker-Päckchen","Päckchen fortsetzen, Muster entdecken, begründen – und Zahlenmauern erforschen."] }[WAS];
  const FARBE = { geld:["#facc15","#4a3a0c"], gewichte:["#2dd4bf","#0f3d3a"], laengen:["#60a5fa","#172554"], zahlen:["#a78bfa","#2e1065"], geo:["#38bdf8","#0c4a6e"], daten:["#fb923c","#431407"], schrift:["#f472b6","#500724"], kalender:["#4ade80","#14532d"], mix:["#f87171","#450a0a"], sach2:["#34d399","#064e3b"], strahl:["#22d3ee","#083344"], zoo:["#a3e635","#1a2e05"], blitz:["#fbbf24","#422006"], stellen:["#4ade80","#14532d"], paeckchen:["#c084fc","#3b0764"] }[WAS];
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
  .blitzKl{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}
  .lvW{display:flex;flex-wrap:wrap;gap:5px;margin-top:7px}
  .stufe button.lvC{font-size:12.5px;line-height:1.2;padding:5px 9px;border-radius:999px;background:#0b1220;border:1px solid #334155;color:#cbd5e1;font-weight:800;box-shadow:none;min-height:0;width:auto}
  .stufe button.lvC.an{border-color:#fbbf24;background:rgba(251,191,36,.16);color:#fde68a}
  .stufe button.lvC i{font-style:normal;color:#fbbf24;letter-spacing:-1px}
  .luecke{display:inline-block;min-width:2.2em;padding:0 .18em;margin:0 .06em;border-bottom:5px solid #38bdf8;border-radius:6px;background:rgba(56,189,248,.12);color:#7dd3fc;text-align:center;cursor:text;line-height:1.15}
  .luecke.ok{border-color:#22c55e;background:rgba(34,197,94,.16);color:#86efac;animation:lkPop .3s}
  .luecke.nein{border-color:#ef4444;background:rgba(239,68,68,.16);color:#fca5a5}
  .luecke.nochmal{animation:lkWackel .4s}
  @keyframes lkPop{50%{transform:scale(1.15)}} @keyframes lkWackel{20%,60%{transform:translateX(-7px)}40%,80%{transform:translateX(7px)}}
  #buehne.mitLuecke .eingabe input{position:absolute;opacity:0;width:2px;height:2px;padding:0;border:0;pointer-events:none}
  #buehne.mitLuecke .eingabe > span{display:none}
  .bild{position:relative} .bild.weg svg{visibility:hidden}
  .blickDeckel{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;font-weight:800;color:#fde68a;font-size:17px;background:#0b1220;border-radius:16px}
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
  .entGal{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}
  .entGal button{background:#0b1220;border:2px solid var(--card2);border-radius:14px;padding:6px 4px;display:flex;flex-direction:column;align-items:center;gap:2px;color:var(--text);font-size:13px;font-weight:700}
  .entGal button.an{border-color:#fde68a;background:rgba(253,230,138,.1)}
  .entPanel{margin-top:10px;background:#0b1220;border:1px solid var(--card2);border-radius:16px;padding:12px;text-align:center}
  .entBild{display:flex;justify-content:center} .entName{font-size:22px;margin:4px 0} .entName b{color:#fde68a}
  .entInfo{font-size:16px;color:#e2e8f0;margin:4px 0} .entInfo2{font-size:14px;color:var(--muted);line-height:1.5;margin:4px 0}
  .entSumme{font-size:34px;font-weight:900;color:#fde68a} .entBeutel button{background:transparent;border:none;padding:0}
  .stTipp{text-align:center;color:#94a3b8;font-size:12.5px;margin-top:6px}
  .sgGitter{display:grid;justify-content:center;gap:4px 4px;margin:6px 0 4px;font-variant-numeric:tabular-nums}
  .sgGitter span{display:flex;align-items:center;justify-content:center}
  .sgK{font-size:13px;font-weight:800} .sgO{font-size:26px;font-weight:800;color:var(--muted)}
  .sgZ{height:48px;font-size:30px;font-weight:800;border-radius:10px;border:2px solid transparent;color:var(--text)}
  .sgZ.an{border-color:var(--f);background:rgba(148,163,184,.16);background:color-mix(in srgb,var(--f) 18%,transparent)}
  .sgZ.sgErg{color:#86efac} .sgZ s{color:#94a3b8;text-decoration-color:#ef4444;text-decoration-thickness:3px}
  .sgE{height:18px;font-size:15px;font-weight:800;color:#fca5a5} .sgU{height:20px;font-size:16px;font-weight:800;color:#fde047}
  .sgLinie{height:3px;background:var(--text);border-radius:2px}
  .soPool{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;min-height:60px;padding:8px;border:2px dashed var(--card2);border-radius:14px}
  .soBoxen{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}
  .soBox{background:#0b1220;border:2px solid #475569;border-radius:14px;padding:6px;min-height:120px} .soT{font-size:13.5px;font-weight:800;text-align:center;color:#fde68a;margin-bottom:6px}
  .soIn{display:flex;flex-wrap:wrap;gap:5px;justify-content:center}
  .soK{touch-action:none;background:#1e293b;border:2px solid #475569;border-radius:12px;padding:4px 6px;display:flex;flex-direction:column;align-items:center;color:var(--text);font-size:11.5px;font-weight:700;cursor:grab}
  .soK.an{border-color:#fde68a;background:rgba(253,230,138,.15)} .soK.gut{border-color:#22c55e} .soK.falsch{border-color:#ef4444;background:rgba(239,68,68,.15)}
  .soB svg{display:block} .soGeist{position:fixed;z-index:9999;pointer-events:none;transform:translate(-50%,-50%);opacity:.9}
  .entT{opacity:0;animation:entEin .35s forwards} @keyframes entEin{to{opacity:1}}
  .entSvg{display:block;width:100%;height:auto;touch-action:none;background:#0b1220;border:1px solid var(--card2);border-radius:14px;cursor:pointer}
  .entChips{display:flex;flex-direction:column;gap:6px} .entChips button{background:#1e293b;color:#e2e8f0;border:1px solid #475569;font-size:14.5px;font-weight:600;text-align:left;padding:9px 12px}
  .entChips button b{color:#fde68a;margin-right:6px}
  .entStrich{display:flex;align-items:center;gap:8px;padding:6px 0;border-top:1px solid var(--card2)} .entStrich .ek{flex:none;width:96px;font-size:14px;font-weight:700}
  .entStrich .es{flex:1;min-width:0;overflow:hidden} .entStrich .en{width:26px;text-align:right;font-size:17px} .entStrich button{padding:6px 12px;font-size:17px}
  .entKal{display:grid;grid-template-columns:repeat(7,1fr);gap:4px} .entKal .kk{text-align:center;font-size:12.5px;font-weight:800;color:var(--muted)} .entKal .kk.we{color:#fca5a5}
  .entKal button{padding:9px 0;font-size:15px;background:#0b1220;color:var(--text);border:1px solid var(--card2);border-radius:9px}
  .entKal button.we{color:#fca5a5} .entKal button.heute{border-color:#38bdf8} .entKal button.an{background:#fde68a;color:#1c1917;border-color:#fde68a}
  .pk{display:inline-grid;gap:3px;font-size:23px;font-weight:800;font-variant-numeric:tabular-nums;margin:2px auto}
  .pkZ{display:grid;grid-template-columns:2.6ch 1.3ch 2.6ch 1.3ch 3.4ch;gap:6px;text-align:right;padding:2px 10px;border-radius:9px}
  .pkZ span:nth-child(2),.pkZ span:nth-child(4){text-align:center;color:var(--muted)}
  .pkZ.mark{background:rgba(250,204,21,.16);outline:2px solid #facc15}
  .pkL{display:inline-block;min-width:2.2ch;border-bottom:4px solid #38bdf8;color:#7dd3fc;text-align:center}
  .erkl .pk{font-size:19px} .pkStep{font-size:13px;color:#fde68a;font-weight:800}
  .wahl button .pkO{font-variant-numeric:tabular-nums;font-weight:800}
  .zm{display:inline-flex;flex-direction:column;align-items:center;gap:4px;margin:4px auto}
  .zm div{display:flex;gap:4px} .zm i{font-style:normal;width:62px;height:40px;display:flex;align-items:center;justify-content:center;background:#7c2d12;border:2px solid #c2410c;border-radius:6px;font-size:20px;font-weight:800;color:#fff7ed}
  .zm i.leer{background:#0b1220;border-style:dashed;color:#7dd3fc}
  .wbPaar{display:flex;justify-content:center;margin-top:8px} .lageGitter{display:grid;grid-template-columns:repeat(3,64px);gap:6px;justify-content:center;margin:6px auto}
  .lageGitter span{font-size:40px;line-height:64px;text-align:center;background:var(--card2,#1e293b);border:2px solid #334155;border-radius:12px}
  .zKarten{display:flex;gap:10px;justify-content:center;margin:6px 0} .zKarten span{font-size:30px;font-weight:800;width:48px;height:62px;line-height:62px;text-align:center;background:#fef3c7;color:#111;border-radius:8px;box-shadow:0 2px 0 #b45309}
  .knHinw{text-align:left;display:inline-block;margin:6px 0 0;padding-left:22px;font-size:.95em} .knHinw li{margin:3px 0}
  .knTab{border-collapse:collapse;margin:6px auto} .knTab td,.knTab th{border:1px solid #475569;padding:2px 8px;text-align:center}
  .wahl button svg{display:block;margin:auto}
  .k3Wrap{text-align:center} .k3{width:100%;max-width:360px;height:auto;touch-action:none;cursor:grab;background:radial-gradient(circle at 50% 40%,#1e293b,#0b1220);border-radius:16px;display:block;margin:0 auto}
  .k3Tipp{font-size:13px;color:var(--muted);margin:4px 0} .k3Info{min-height:22px;font-size:16px;margin:4px 0 8px;color:#fde68a} .k3Kn{justify-content:center;flex-wrap:wrap;gap:6px} .wahl .emo{font-size:36px;line-height:1}
  .zmPaar{display:flex;gap:18px;justify-content:center;flex-wrap:wrap;align-items:flex-end} .zmPaar small{display:block;text-align:center;color:var(--muted);font-size:12.5px;margin-top:2px}
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
    {id:10, name:"Große Geldbeträge", kurz:"Scheine bis 200 € zählen und legen", typen:["g_gross","g_gross","g_grossLegen"]},
    {id:11, name:"Fehler-Detektiv: Geld", kurz:"Was hat Flo falsch gemacht? Komma, Cent und Rückgeld", typen:["g_detektiv"], sek:60}
  ];
  const LAENGEN=[
    {id:1, name:"Mit dem Lineal messen", kurz:"Wie viele Zentimeter?", typen:["l_messen","l_messen","l_messenVersetzt"]},
    {id:2, name:"Zentimeter und Millimeter", kurz:"genau messen · 3 cm = 30 mm", typen:["l_messenMm","l_cmInMm","l_mmAus","l_cmMmInMm"]},
    {id:3, name:"Meter und Zentimeter", kurz:"2 m = 200 cm · 1,50 m", typen:["l_mInCm","l_cmAus","l_mCmInCm","l_kommaWahl"]},
    {id:4, name:"Welche Einheit passt?", kurz:"mm, cm, m oder km – schätzen", typen:["l_einheit"]},
    {id:5, name:"Mit Längen rechnen", kurz:"1 m − 35 cm · 45 cm + 80 cm", typen:["l_rechneMinus","l_rechnePlus","l_rechneMm","l_seil"]},
    {id:6, name:"Linien zeichnen", kurz:"Zieh den Stift genau auf 6 cm – oder auf 4 cm 7 mm", typen:["l_zeichneCm","l_zeichneMm","l_zeichneCm","l_zeichneMm"], sek:60}
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
    {id:6, name:"Umfang und Fläche", kurz:"Kästchen zählen · einmal außen herum", typen:["f_flaeche","f_umfang"]},
    {id:7, name:"Sortieren", kurz:"Fläche oder Körper? Kann er rollen? Genau 4 Ecken?", typen:["f_sortFlaeche","f_sortRollen","f_sortEcken"], sek:60},
    {id:8, name:"Würfelgebäude", kurz:"Bauplan lesen · Wie viele Würfel sind es?", typen:["f_bauplan","f_gebaeude","f_bauplanWahl","f_gebaeude"], sek:70},
    {id:9, name:"Würfelnetze", kurz:"Kann man daraus einen Würfel falten?", typen:["f_netz"], sek:45},
    {id:10, name:"Wo liegt was?", kurz:"links · rechts · über · unter", typen:["f_lage","f_lageWo","f_lage"]}
  ];
  const DATEN=[
    {id:1, name:"Strichlisten", kurz:"immer fünf im Bündel", typen:["d_strich"]},
    {id:2, name:"Diagramme lesen", kurz:"Wie viele? Was ist am beliebtesten?", typen:["d_diaLesen","d_diaMax","d_diaLesen"]},
    {id:3, name:"Mit Diagrammen rechnen", kurz:"Wie viele mehr? Wie viele insgesamt?", typen:["d_diaUnterschied","d_diaSumme"]},
    {id:4, name:"Sicher, möglich, unmöglich", kurz:"Kugeln aus dem Beutel ziehen", typen:["d_sicher","d_sicher","d_wahrsch"]},
    {id:5, name:"Kombinieren", kurz:"3 T-Shirts und 2 Hosen – wie viele Outfits?", typen:["d_kombi"]},
    {id:6, name:"Säulen zeichnen", kurz:"Strichliste lesen – Säule auf die richtige Höhe ziehen", typen:["d_saeule"], sek:60},
    {id:7, name:"Glücksrad und Würfel", kurz:"Was ist wahrscheinlicher? Ist das Spiel fair?", typen:["d_rad","d_wuerfel","d_fair","d_wuerfel"], sek:60},
    {id:8, name:"Zwei Würfel", kurz:"Klasse 4 · Welche Summe kommt am häufigsten?", typen:["d_zweiWuerfel"], sek:90}
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
    {id:10, name:"Teilen mit Rest", kurz:"938 : 4 = 234 Rest 2", typen:["sd_rest"], sek:150},
    {id:11, name:"Fehler-Detektiv: schriftlich", kurz:"Was ist bei Flo schiefgelaufen? Übertrag, Entbündeln …", typen:["sp_detektiv","sm_detektiv","sx_detektiv"], sek:90}
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
    {id:7, name:"Zahlenstrahl bis 1 Million", kurz:"Klasse 4 · große Schritte", typen:["m_strahl"], sek:70},
    {id:8, name:"Zahlen einzeichnen", kurz:"Schritt finden – dann den Pfeil an die richtige Stelle ziehen", typen:["s_setze","s_setze","t_setze"], sek:70}
  ];
  // Stellenwerte (23.11.2026, nach den Kriterien von Walter & Schwätzer): Zahlen mit Material legen – Handlung, Stellentafel und Zahl hängen zusammen
  const STELLENWERTE=[
    {id:1, name:"Zahlen legen bis 100", kurz:"Lege 47 mit Zehnerstangen und Einerwürfeln", typen:["st_legen2","st_legen2","st_wortLegen2"], sek:60},
    {id:2, name:"Welche Zahl ist das?", kurz:"Zehner und Einer zählen – auch durcheinander", typen:["st_lesen2","st_lesen2","st_zerlegt2"]},
    {id:3, name:"Zahlendreher: 45 oder 54?", kurz:"Wir sprechen die Einer zuerst – wir schreiben die Zehner zuerst", typen:["st_dreherBild","st_dreherWort","st_dreherBild"]},
    {id:4, name:"Bündeln: 10 Einer sind 1 Zehner", kurz:"3 Zehner und 14 Einer = 44 · Lege 52 nur mit 4 Zehnern", typen:["st_buendelLesen2","st_buendelLegen2","st_buendelLesen2"], sek:60},
    {id:5, name:"Plus und minus 1 und 10", kurz:"Leg eine Stange dazu – oder nimm einen Würfel weg", typen:["st_plus2","st_plus2","st_plus2"], sek:60},
    {id:6, name:"Zahlen legen bis 1000", kurz:"Hunderterplatten, Zehnerstangen, Einerwürfel · auch 305", typen:["st_legen3","st_null3","st_legen3"], sek:70},
    {id:7, name:"Bis 1000: lesen und bündeln", kurz:"2 H 13 Z 5 E = 335", typen:["st_lesen3","st_buendelLesen3","st_lesen3","st_buendelLegen3"], sek:70},
    {id:8, name:"Plus und minus 1, 10 und 100", kurz:"299 + 1 · 400 − 1 – hier wird gebündelt und entbündelt", typen:["st_plus3","st_plus3","st_plus3"], sek:80}
  ];
  // Entdecker-Päckchen (24.11.2026): strukturiertes Üben nach Wittmann/Winter – Muster fortsetzen, erklären, Störungen und Fehler finden, Zahlenmauern
  const PAECKCHEN=[
    {id:1, name:"Päckchen fortsetzen bis 20", kurz:"3 + 4, 4 + 4, 5 + 4 … wie geht es weiter?", typen:["pk_weiter20","pk_naechste20","pk_weiter20"]},
    {id:2, name:"Plus-Päckchen bis 100", kurz:"13 + 5, 23 + 5, 33 + 5 … und warum?", typen:["pk_weiter100","pk_naechste100","pk_weiter100","pk_warumPlus"]},
    {id:3, name:"Was fällt dir auf?", kurz:"Muster erklären · Welche Aufgabe passt nicht?", typen:["pk_warumPlus","pk_stoerPlus","pk_warumPlus","pk_stoerPlus"], sek:70},
    {id:4, name:"Minus-Päckchen", kurz:"Wenn ich mehr wegnehme, bleibt weniger übrig", typen:["pk_weiterMinus","pk_warumMinus","pk_stoerMinus","pk_warumMinus"], sek:70},
    {id:5, name:"Fehler-Detektiv", kurz:"Das Muster hilft: Welches Ergebnis ist falsch?", typen:["pk_fehlerPlus","pk_fehlerMinus","pk_fehlerMal"], sek:70},
    {id:6, name:"Mal-Päckchen", kurz:"3 · 6, 4 · 6, 5 · 6 – immer 6 mehr", typen:["pk_weiterMal","pk_warumMal","pk_weiterMal","pk_stoerMal"], sek:70},
    {id:7, name:"Zahlenmauern", kurz:"Zwei Steine zusammen ergeben den Stein darüber", typen:["zm_deck","zm_unten","zm_deck","zm_mitte"], sek:70},
    {id:8, name:"Zahlenmauern erforschen", kurz:"Was passiert mit dem Deckstein, wenn …?", typen:["zm_warum","zm_unten","zm_warum","zm_ziel"], sek:90},
    {id:9, name:"Knobeln: Zahlenrätsel", kurz:"Hinweis für Hinweis die Zahl finden · Ziffernkarten", typen:["pk_raetsel","pk_ziffern","pk_raetsel","pk_ziffern"], sek:120},
    {id:10, name:"Knobeln: geschickt probieren", kurz:"Köpfe und Beine · Alle Möglichkeiten finden", typen:["pk_tiere","pk_moeglich","pk_tiere","pk_moeglich"], sek:150}
  ];
  // Bunte Mischung: jede Runde zieht 15 zufällige Aufgabenarten aus allen Themen der Klassenstufe (mix:true)
  const MIX=[
    // zooF: im Zoo machen schwerere Runden seltene Tiere wahrscheinlicher (zoo.js) · chance: so steht es bei der Runde
    {id:1, zooF:0.6, chance:"klein", mix:true, sek:60, name:"Klasse 1 – bunt gemischt", kurz:"Plus und Minus bis 20 · Zahlen · Formen · Münzen · Wochentage", kern:["rp_20","rm_20","rz_10","rz_20","rp_20","rm_20"],
      typen:["z_ze","z_stelle2","z_vorNach","f_form","f_form2","g_cent","g_euro","k_tag","k_monat","d_strich","w_schwerer","l_messen"]},
    // Klasse 2 und 3 in drei Stufen: Leicht = Grundwissen aus dem Vorjahr und der Anfang der Klasse · Mittel = was man im Winter können sollte · Profi = alles aus der Klasse.
    // Die neuen Stufen (id 5–8) stehen vor den alten Klassen-Runden (id 2 und 3 = Profi) – alte Ergebnisse bleiben gültig.
    // Klasse 2: ohne Gramm und ohne Kommapreise – das kommt erst in Klasse 3.
    {id:7, nr:"2", kl:"2 · Leicht", zooF:0.8, chance:"klein", mix:true, sek:75, uhr:[0,30], name:"Klasse 2 – Leicht", kurz:"Plus und Minus bis 20 · Zehner dazu und weg · Zahlen bis 100 · volle und halbe Stunden · Münzen",
      kern:["rp_20","rm_20","rz_10","rz_20","rp_zehner","rm_zehner"],
      typen:["z_ze","z_stelle2","z_vorNach","z_zehnerNachbar","z_strahl","z_vergleich","f_form","f_form2","f_ecken","g_cent","g_euro","k_tag","k_monat","d_strich","w_schwerer","l_messen","u_wortUhr"]},
    {id:5, nr:"2", kl:"2 · Mittel", zooF:1, chance:"mittel", mix:true, sek:75, uhr:[0,30], name:"Klasse 2 – Mittel", kurz:"Plus und Minus bis 100 ohne Einmaleins · Zehner und Einer · volle und halbe Stunden · Cent · Formen",
      kern:["rp_20","rm_20","rp_zehner","rm_zehner","rp_ohne","rm_ohne","rp_einer","rz_zehner","rf_plus"],
      typen:["z_ze","z_stelle2","z_vorNach","z_zehnerNachbar","z_strahl","z_vergleich","z_groesste","u_wortUhr","u_uhrPaar","f_form2","f_ecken","f_sym","g_cent","k_tag","k_monat","l_messen","l_messenVersetzt","d_strich","w_schwerer"]},
    {id:2, nr:"2", kl:"2 · Profi", zooF:1.3, chance:"groß", mix:true, sek:75, uhr:[0,15,30,45], name:"Klasse 2 – Profi", kurz:"alles aus Klasse 2: Plus und Minus bis 100 · Einmaleins · Uhr mit Viertelstunden · Euro und Cent · Körper · Diagramme", kern:["rp_100","rm_100","rx_kern","rx_alle","rd_alle","rz_100","rf_plus","rp_einer"],
      typen:["z_strahl","s_schritt","s_pfeil","z_vergleich","z_groesste","z_doppelt","z_haelfte","z_gerade","z_zehnerNachbar","k_tageMonat","k_wochen","k_hMin","k_bruch","u_wortUhr","u_uhrPaar",
             "f_ecken","f_koerper","f_alltag","f_sym","g_euro","g_inCent","g_ausCent","l_messenVersetzt","l_mInCm","l_cmAus","w_schwerer","d_diaLesen","d_diaMax"]},
    // Klasse 3 Leicht: das Wichtigste aus Klasse 2 (Plus und Minus bis 100, Einmaleins, Uhr, Geld) und der Anfang von Klasse 3 (Zahlen bis 1000)
    {id:8, nr:"3", kl:"3 · Leicht", zooF:1.2, chance:"mittel", mix:true, sek:100, uhr:[0,15,30,45], name:"Klasse 3 – Leicht", kurz:"Plus und Minus bis 100 · Einmaleins · Zahlen bis 1000 · Uhr mit Viertelstunden · Euro und Cent",
      kern:["rp_100","rm_100","rx_kern","rx_alle","rd_alle","rp_einer","rz_100","rf_plus"],
      typen:["z_strahl","z_vergleich","z_zehnerNachbar","z_doppelt","z_haelfte","z_hze","z_stelle3","z_vorNach1000","k_hMin","k_bruch","k_tageMonat","u_wortUhr","u_uhrPaar","f_ecken","f_koerper","f_sym","g_euro","g_ausCent","l_mInCm","l_cmAus","d_diaLesen","d_diaMax","q_bus"]},
    // Klasse 3 Mittel: Einmaleins, bis 1000, Rechnen mit Zehnerzahlen, Millimeter, Uhr bis zur Viertelstunde – noch ohne schriftliches Rechnen, Kommapreise, Gramm, Zeitspannen auf die Minute
    {id:6, nr:"3", kl:"3 · Mittel", zooF:1.5, chance:"groß", mix:true, sek:100, uhr:[0,15,30,45], name:"Klasse 3 – Mittel", kurz:"Einmaleins und Teilen · Zahlen bis 1000 · Plus und Minus mit Zehnerzahlen · Millimeter · Uhr mit Viertelstunden",
      kern:["rx_alle","rd_alle","rp_100","rm_100","rp_1000","rm_1000","rw_malZehner","rf_minus","rf_mal","rx_alle","rd_alle"],
      typen:["z_hze","z_stelle3","z_vorNach1000","t_schritt","t_pfeil","z_rundeZ","k_bruchH","k_hMin","u_beide","u_wortUhr","f_eck","f_rund","f_flaeche","l_cmInMm","l_mmAus","l_rechneMinus","l_einheit",
             "d_diaUnterschied","d_diaSumme","d_sicher","q_anfangPlus","q_anfangMinus","q_bus","q_malPlus"]},
    {id:3, nr:"3", kl:"3 · Profi", zooF:1.8, chance:"sehr groß", mix:true, sek:100, name:"Klasse 3 – Profi", kurz:"alles aus Klasse 3: schriftlich rechnen · Kommazahlen · Zeitspannen · Gewichte · Uhr auf 5 Minuten", kern:["rx_alle","rd_alle","rp_1000","rm_1000","rp_100","rm_100","rw_malZehner","rw_malZerlegen","rf_minus","rf_mal","rx_alle","rd_alle"],
      typen:["z_hze","z_stelle3","z_vorNach1000","t_schritt","t_pfeil","z_rundeZ","z_rundeH","z_rest","sp_mit","sp_drei","sm_mit","sm_null","k_minAus2","k_hMinIn","k_bruchH","k_sekAus","zs_in","zs_vor","zs_dauer","zs_training","zs_los",
             "u_beide","u_digitalWort","f_eck","f_rund","f_flaeche","f_umfang","g_ctKomma","g_kPlus","g_kMinus","g_reicht","g_mal","g_teil","g_rueckgeld","gs_plus","gs_minus","l_cmInMm","l_mmAus","l_rechneMinus","l_einheit",
             "w_stueckeKg","w_kgInG","w_gAus","w_bruch","w_rechneMinus","w_lInMl","w_lBruch","d_diaUnterschied","d_diaSumme","d_sicher","d_wahrsch","d_kombi","k_datum","q_anfangPlus","q_anfangMinus","q_plusMinus","q_bus","q_malPlus","q_malRueck","q_summeTeil"]},
    {id:4, zooF:2.2, chance:"riesig", mix:true, sek:120, name:"Vorschau auf Klasse 4", kurz:"Tonnen · Malnehmen schriftlich · Zeit in Stunden und Minuten · Dreisatz", kern:["rw_malZehner","rw_malZerlegen","rp_1000","rm_1000","rf_mal","rx_alle","rd_alle"],
      typen:["w_tInKg","w_kgAusT","w_lkw","sx_zwei","sx_drei","sp_gross","zs_dauerH","zs_inH","zs_woche","zs_fahrplan","g_dreisatz","g_gross","gs_plus3","f_flaeche","f_umfang","d_kombi","z_rundeH","l_seil","l_rechnePlus","w_mal","m_stelle","m_zerlegt","m_vorNach","m_runde","m_plus","m_mal","m_teil","q_teilMinus","q_malRueck","sd_ohne","sd_mit","sd_rest"]}
  ];
  // Mein Zoo: dieselben Aufgaben wie die Bunte Mischung, aber als Spiel – 10 Aufgaben, für je 5 richtige zieht ein Tier ein (zoo.js)
  const ZOO=MIX.map(s=>Object.assign({}, s, {name:"Zoo-Runde Klasse "+(s.kl||s.id), kurz:"10 Aufgaben · ab 5 richtigen ein Tier · 10 von 10 = zwei Tiere · Chance auf seltene Tiere: "+(s.chance||"mittel")}));
  // ===== Blitzrechnen: kurze Kopfrechen-Übungen, die blitzschnell sitzen sollen (wie der Blitzrechenkurs im Zahlenbuch) =====
  // Üben = 10 Aufgaben mit Erklärung. Blitz = eine Minute, so viele Aufgaben wie möglich; Ziel geschafft (ziel richtige, höchstens 2 Fehler) zählt wie ein bestandener Test.
  const BLITZ_SEK=60;
  const BLITZ=[
    {id:20, kl:1, name:"Wie viele? Das Zwanzigerfeld", kurz:"Punkte auf einen Blick – in Fünfern sehen", typen:["b_feld20"], ziel:15},
    {id:21, kl:1, name:"Immer 10", kurz:"7 + ☐ = 10", typen:["b_immer10"], ziel:15},
    {id:22, kl:1, name:"Immer 20", kurz:"14 + ☐ = 20", typen:["b_immer20"], ziel:15},
    {id:23, kl:1, name:"Nachbarzahlen bis 20", kurz:"Welche Zahl kommt vor 13? Welche danach?", typen:["b_nachbar20"], ziel:15},
    {id:24, kl:1, name:"Verdoppeln und halbieren bis 20", kurz:"das Doppelte von 6 · die Hälfte von 14", typen:["b_dh20"], ziel:15},
    {id:25, kl:1, name:"Einfache Plus- und Minusaufgaben bis 20", kurz:"3 + 4 · 13 + 4 · 17 − 5", typen:["b_pm20"], ziel:15},
    {id:26, kl:1, name:"Zählen in Schritten bis 20", kurz:"in 2er- und 5er-Schritten", typen:["b_schritt20"], ziel:15},
    {id:34, kl:1, mixKl:1, name:"Blitz-Mix Klasse 1", kurz:"alle Blitze der Klasse 1 durcheinander", typen:[], ziel:12, mischen:true},
    {id:27, kl:2, name:"Wie viele? Zehner und Einer", kurz:"Stangen und Punkte bis 100", typen:["b_bloecke100"], ziel:15},
    {id:1, kl:2, name:"Zählen in Schritten bis 100", kurz:"35, 40, 45, … · vorwärts und rückwärts", typen:["b_schritt100"], ziel:15},
    {id:2, kl:2, name:"Ergänzen zum Zehner und bis 100", kurz:"47 + ☐ = 50 · 64 + ☐ = 100", typen:["b_ergZehner", "b_erg100"], ziel:15},
    {id:3, kl:2, name:"Verdoppeln und halbieren bis 100", kurz:"das Doppelte von 35 · die Hälfte von 70", typen:["b_dh100"], ziel:15},
    {id:4, kl:2, name:"Einfache Plus- und Minusaufgaben bis 100", kurz:"40 + 30 · 54 + 20 · 68 − 5", typen:["b_pm100"], ziel:15},
    {id:5, kl:2, name:"Kernaufgaben: mal 1, 2, 5 und 10", kurz:"5 · 7 · 10 · 4 · 2 · 9", typen:["b_kern"], ziel:15},
    {id:35, kl:2, mixKl:2, name:"Blitz-Mix Klasse 2", kurz:"alle Blitze der Klasse 2 durcheinander", typen:[], ziel:12, mischen:true},
    {id:6, kl:3, name:"Blitz-Einmaleins", kurz:"alle Reihen durcheinander", typen:["b_1x1"], ziel:15},
    {id:7, kl:3, name:"Einmaleins – auch umgekehrt", kurz:"6 · 7 = 42, also 42 : 7 = ☐", typen:["b_1x1um"], ziel:15},
    {id:28, kl:3, name:"Wie viele? Hunderter, Zehner, Einer", kurz:"Platten, Stangen und Punkte bis 1000", typen:["b_bloecke1000"], ziel:12},
    {id:29, kl:3, name:"Welche Zahl? Die Stellentafel", kurz:"Plättchen in der Stellentafel bis 1000", typen:["b_tafel1000"], ziel:15},
    {id:8, kl:3, name:"Zählen in Schritten bis 1000", kurz:"in 2er-, 10er- und 100er-Schritten", typen:["b_schritt1000"], ziel:12},
    {id:9, kl:3, name:"Ergänzen bis 1000", kurz:"370 + ☐ = 1000 · 347 + ☐ = 400", typen:["b_erg1000","b_ergHunderter"], ziel:12},
    {id:30, kl:3, name:"1000 teilen", kurz:"1000 : 4 · 1000 : 25", typen:["b_1000teilen"], ziel:12},
    {id:10, kl:3, name:"Verdoppeln und halbieren bis 1000", kurz:"das Doppelte von 340 · die Hälfte von 760", typen:["b_dh1000"], ziel:12},
    {id:11, kl:3, name:"Einfache Plus- und Minusaufgaben bis 1000", kurz:"456 + 30 · 735 − 200", typen:["b_pm1000"], ziel:12},
    {id:12, kl:3, name:"Zehner-Einmaleins – auch umgekehrt", kurz:"4 · 70 · 280 : 7 · 280 : 70", typen:["b_zehner"], ziel:12},
    {id:13, kl:3, name:"Mal 10 und durch 10", kurz:"34 · 10 · 560 : 10", typen:["b_mal10"], ziel:15},
    {id:38, kl:3, name:"Nachbarzehner und Nachbarhunderter", kurz:"☐ < 347 < 350 · 300 < 347 < ☐", typen:["b_nachbarZH"], ziel:12},
    {id:39, kl:3, name:"Bündeln: H, Z und E", kurz:"3 H + 12 Z + 15 E = ☐", typen:["b_buendeln"], ziel:10},
    {id:40, kl:3, name:"Plus und Minus mit Übergang bis 1000", kurz:"458 + 7 · 632 − 50", typen:["b_pmUebergang"], ziel:10},
    {id:41, kl:3, name:"Zählen in Schritten – für Profis", kurz:"in 25er-, 75er-, 99er- und 101er-Schritten", typen:["b_schrittProfi"], ziel:10},
    {id:36, kl:3, mixKl:3, name:"Blitz-Mix Klasse 3", kurz:"alle Blitze der Klasse 3 durcheinander", typen:[], ziel:12, mischen:true},
    {id:31, kl:4, name:"Zahlen lesen und schreiben", kurz:"dreihunderttausendvierzig = ☐", typen:["b_zahlwort"], ziel:8},
    {id:32, kl:4, name:"Die Stellentafel bis 1 Million", kurz:"Plättchen von HT bis E", typen:["b_tafelMio"], ziel:10},
    {id:14, kl:4, name:"Zählen in Schritten bis 1 Million", kurz:"25 000, 50 000, 75 000, …", typen:["b_schrittMio"], ziel:10},
    {id:33, kl:4, name:"Stufenzahlen subtrahieren", kurz:"10 000 − 100 · 1 000 000 − 3 000", typen:["b_stufenMinus"], ziel:10},
    {id:15, kl:4, name:"Verdoppeln und halbieren bis 1 Million", kurz:"das Doppelte von 230 000 · die Hälfte von 640 000", typen:["b_dhMio"], ziel:10},
    {id:16, kl:4, name:"Stufenzahlen teilen", kurz:"10 000 : 4 · 1 000 000 : 5", typen:["b_stufenTeil"], ziel:10},
    {id:17, kl:4, name:"Stellen-Einmaleins – auch umgekehrt", kurz:"3 · 4000 · 12 000 : 3", typen:["b_stellen"], ziel:10},
    {id:18, kl:4, name:"Ergänzen bis 1 Million", kurz:"730 000 + ☐ = 1 000 000", typen:["b_ergMio"], ziel:10},
    {id:19, kl:4, name:"Plus und Minus mit großen Zahlen", kurz:"560 000 + 30 000 · 47 000 − 5 000", typen:["b_pmMio"], ziel:10},
    {id:37, kl:4, mixKl:4, name:"Blitz-Mix Klasse 4", kurz:"alle Blitze der Klasse 4 durcheinander", typen:[], ziel:10, mischen:true}
  ];
  // Blitz-Mix: alle Aufgabenarten der Klasse
  BLITZ.filter(s=>s.mixKl).forEach(m=>{ m.typen=[...new Set(BLITZ.filter(s=>s.kl===m.mixKl && !s.mixKl).flatMap(s=>s.typen))]; });
  // Stufen je Blitz: 1 Anfänger · 2 Fortgeschritten · 3 Profi. BL ist die gerade gewählte Stufe (die Aufgaben lesen sie).
  let BL=2; const BL_WAHL={}, LVN=["","Anfänger","Fortgeschritten","Profi"];
  function zielFuer(st, lv){ return lv===1 ? st.ziel+3 : lv===3 ? Math.max(6, st.ziel-3) : st.ziel; }
  let BLITZ_KL=0; try{ BLITZ_KL=+(localStorage.getItem("blitz_klasse") || localStorage.getItem("mathe_klasse") || 0) || 0; }catch(e){}
  const STUFEN = {geld:GELD, gewichte:GEWICHTE, laengen:LAENGEN, zahlen:ZAHLEN, geo:GEO, daten:DATEN, schrift:SCHRIFT, kalender:KALENDER, mix:MIX, sach2:SACH2, strahl:STRAHL, zoo:ZOO, blitz:BLITZ, stellen:STELLENWERTE, paeckchen:PAECKCHEN}[WAS];
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
  // UHR_MIN: welche Minuten die Stufe zeigt (z. B. Klasse 2: nur volle und halbe Stunden) – null = alle Fünf-Minuten-Schritte
  let UHR_MIN=null;
  function uhrZufall(){ return [rnd(1,11), aus(UHR_MIN||[0,5,10,15,20,25,30,35,40,45,50,55])]; }
  // typische Verwechslungen: Zeiger vertauscht, eine Stunde daneben, „vor" und „nach" gespiegelt
  function uhrFallen(h, m){
    const l=[], hh=(m/5)||12, mm=(h*5)%60; if((hh!==h || mm!==m) && hh<12) l.push([hh, mm]);      // Stunde 12 auslassen – sonst entstünde „24.55 Uhr"
    l.push([h%11+1, m]); if(m%30) l.push([h, 60-m]); l.push([(h+5)%11+1, (m+30)%60]); l.push([(h+2)%11+1, m]);
    const s=new Set([h+":"+m]); return l.filter(x=>{ const k=x[0]+":"+x[1]; if(s.has(k) || (UHR_MIN && !UHR_MIN.includes(x[1]))) return false; s.add(k); return true; });
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
      rw:["halbschriftlich","🪜 Rechenwege"],rf:["platz","🔍 Fehlende Zahl"],b:["blitz","⚡ Blitzrechnen"],m:["zahlen","🔢 Zahlen"],q:["sach2","📚 Sachaufgaben in zwei Schritten"]})[p] || ["mix","🎲 Verschiedenes"]; }
  function eingabe(frage, felder, soll, o){ return Object.assign({art:"eingabe", frage, felder, soll}, o); }
  // ---------- Blitzrechnen: Bilder ----------
  // Zwanzigerfeld: zwei Reihen à 10, nach 5 eine Lücke (Kraft der Fünf)
  function feld20(n){ let s=""; for(let i=0;i<20;i++){ const r=Math.floor(i/10), c=i%10, x=14+c*24+(c>=5?10:0), y=16+r*26, an=i<n;
      s+=`<circle class="${an?"an":"leer"}" cx="${x}" cy="${y}" r="9.5" fill="${an?"#ef4444":"#1e293b"}" stroke="${an?"#991b1b":"#475569"}" stroke-width="1.5"/>`; }
    return `<svg viewBox="0 0 262 58" width="262" height="58" role="img" aria-label="Zwanzigerfeld">${s}</svg>`; }
  // Hunderterplatten, Zehnerstangen, Einerpunkte
  function bloecke(n){ const h=Math.floor(n/100), z=Math.floor(n%100/10), e=n%10; let s="", x=4;
    for(let i=0;i<h;i++){ s+=`<g class="h"><rect x="${x}" y="4" width="30" height="30" fill="#f59e0b" stroke="#78350f" stroke-width="1.2"/>`; for(let k=1;k<10;k++) s+=`<path d="M${x+k*3} 4 V34 M${x} ${4+k*3} H${x+30}" stroke="#78350f" stroke-width=".35"/>`; s+=`</g>`; x+=34; }
    const y0 = h ? 40 : 4; x=4;
    for(let i=0;i<z;i++){ s+=`<g class="z"><rect x="${x}" y="${y0}" width="6" height="30" fill="#3b82f6" stroke="#1e3a8a" stroke-width="1"/>`; for(let k=1;k<10;k++) s+=`<path d="M${x} ${y0+k*3} H${x+6}" stroke="#1e3a8a" stroke-width=".35"/>`; s+=`</g>`; x+=9; }
    x+= z ? 8 : 0;
    for(let i=0;i<e;i++){ const c=i%5, r=Math.floor(i/5); s+=`<rect class="e" x="${x+c*9}" y="${y0+8+r*9}" width="6" height="6" fill="#22c55e" stroke="#14532d" stroke-width="1"/>`; }
    const w=Math.max(4+h*34, x+50), hh=y0+34;
    return `<svg viewBox="0 0 ${w} ${hh}" width="${Math.min(300,w)}" style="max-width:100%;height:auto" role="img" aria-label="Hunderter, Zehner und Einer">${s}</svg>`; }
  // Stellentafel mit Plättchen (höchstens 9 je Stelle, im 3×3-Muster)
  function tafel(n, stellen){ const sp=String(n).padStart(stellen.length,"0").split("").map(Number), B=44; let s="";
    stellen.forEach((k,i)=>{ const x=i*B; s+=`<rect x="${x}" y="0" width="${B}" height="22" fill="#1e293b" stroke="#64748b"/><text x="${x+B/2}" y="15.5" font-size="12" font-weight="800" text-anchor="middle" fill="#e2e8f0" font-family="Arial,sans-serif">${k}</text>`;
      s+=`<rect x="${x}" y="22" width="${B}" height="44" fill="#0b1220" stroke="#64748b"/>`;
      for(let p=0;p<sp[i];p++){ s+=`<circle class="p s${i}" cx="${x+10+(p%3)*12}" cy="${32+Math.floor(p/3)*12}" r="4.6" fill="#facc15" stroke="#a16207" stroke-width="1"/>`; } });
    return `<svg viewBox="-1 -1 ${stellen.length*B+2} 68" width="${Math.min(300,stellen.length*B+2)}" style="max-width:100%;height:auto" role="img" aria-label="Stellentafel">${s}</svg>`; }
  // Zahlwort: 345 210 → dreihundertfünfundvierzigtausendzweihundertzehn
  const WORT_E=["","eins","zwei","drei","vier","fünf","sechs","sieben","acht","neun","zehn","elf","zwölf","dreizehn","vierzehn","fünfzehn","sechzehn","siebzehn","achtzehn","neunzehn"],
        WORT_Z=["","","zwanzig","dreißig","vierzig","fünfzig","sechzig","siebzig","achtzig","neunzig"];
  function wort99(n, ende){ if(n<20) return n===1 ? (ende?"eins":"ein") : WORT_E[n]; const e=n%10; return (e?(e===1?"ein":WORT_E[e])+"und":"")+WORT_Z[Math.floor(n/10)]; }
  function wort999(n, ende){ const h=Math.floor(n/100), r=n%100; return (h?(h===1?"ein":WORT_E[h])+"hundert\u00ad":"")+(r?wort99(r,ende):""); }
  function zahlwort(n){ if(n===0) return "null"; if(n===1000000) return "eine Million"; const t=Math.floor(n/1000), r=n%1000;
    return (t?(t===1?"ein":wort999(t,false))+"tausend\u00ad":"")+(r?wort999(r,true):""); }
  // Blitzrechnen: eine große Aufgabe, ein Zahlenfeld
  function blitzA(text, soll, erkl, gross, px){ return eingabe(`<span class="ziel" style="font-size:${px||34}px">${text}</span>`, [gross?F.gross:F.zahl], soll, {tag:"kopf", sollText:gross?fmt(soll):String(soll), erkl,
    luecke: text.includes("☐") ? "" : /^(Das|Die) /.test(text) ? " ist " : " = "}); }
  // Blitzrechnen: Die Antwort erscheint direkt in der Lücke der Aufgabe (370 + [__] = 1000)
  function mitLuecke(a){
    const L='<span class="luecke" id="luecke">\u00a0</span>';
    if(a.frage.includes("☐")) return a.frage.replace("☐", L);
    if(a.luecke) return a.frage.replace(/<\/span>$/, a.luecke+L+"</span>");
    return a.frage+`<div style="margin-top:10px">${L}</div>`;
  }
  // Plus/Minus über den Zehner (u=1) oder Hunderter (u=10) bis 1000
  function uebergang(us){ for(;;){ const n=rnd(100,999), u=aus(us), plus=Math.random()<0.5, d=Math.floor(n/u)%10; let k;
      if(plus){ if(d===0) continue; k=rnd(10-d,9); } else { if(d===9) continue; k=rnd(d+1,9); }
      const v=k*u, s=plus?n+v:n-v; if(s<0 || s>1000) continue;
      return blitzA(`${n} ${plus?"+":"−"} ${v}`, s, `Über den ${u===1?"Zehner":"Hunderter"}: ${n} ${plus?"+":"−"} ${v} = <b>${s}</b>.`); } }
  // Zählen in Schritten: drei Zahlen stehen da, die vierte wird geschrieben (Startzahl nicht immer rund)
  function schrittA(w, bis){
    const gross=bis>1000, f=x=>gross?fmt(x):String(x), ab=BL!==1 && Math.random()<0.4;
    const off = gross ? 0 : w>=100 ? rnd(0,9)*10 : rnd(0,w-1), m=rnd(0, Math.floor((bis-off)/w)-3);
    const l=[0,1,2,3].map(i=>off+(m+i)*w); if(ab) l.reverse();
    return eingabe(`Zähle ${ab?"rückwärts":"weiter"} – immer ${f(w)} ${ab?"weniger":"mehr"}:<br><span class="ziel" style="font-size:${gross?26:32}px">${l.slice(0,3).map(f).join(", ")}, ☐</span>`, [gross?F.gross:F.zahl], l[3],
      {tag:"kopf", sollText:f(l[3]), erkl:`Jede Zahl ist um <b>${f(w)}</b> ${ab?"kleiner":"größer"}: ${f(l[2])} ${ab?"−":"+"} ${f(w)} = <b>${f(l[3])}</b>.`});
  }

  // reine Rechenaufgabe: große Aufgabe, ein Zahlenfeld
  function rechen(text, soll, probe, erkl){ return eingabe(`<span class="ziel" style="font-size:34px">${text}</span>`, [F.zahl], soll, {tag:"kopf", sollText:String(soll), erkl, probe}); }
  const BAU={
    // ---------- Blitzrechnen ----------
    // BL = gewählte Stufe: 1 Anfänger (kleinere Zahlen, einfacher) · 2 Fortgeschritten (wie im Buch) · 3 Profi (Übergänge, Lücke vorn, kürzer sehen …)
    // ----- Klasse 1 -----
    b_feld20(){ const n = BL===1 ? rnd(1,10) : BL===2 ? rnd(1,20) : rnd(6,20), o=Math.min(n,10), u=Math.max(0,n-10);
      return eingabe(`Wie viele Punkte? <small style="display:block;font-size:14px;color:#94a3b8;font-weight:600">Schau genau – nach ${BL===3?"einer Sekunde":"2 Sekunden"} verschwinden sie.</small>`, [F.zahl], n, {bild:feld20(n), blick:true, blickMs: BL===3 ? 1200 : 2000, tag:"kopf", sollText:String(n),
        erkl: u ? `Oben ${o===10?"eine volle Reihe: 10":o}, unten ${u}${u>5?" (5 und "+(u-5)+")":""}. Zusammen <b>${n}</b>.` : `${o>5?"5 und "+(o-5):o} – das sind <b>${n}</b>.`}); },
    b_immer10(){ const n = BL===1 ? rnd(4,10) : rnd(0,10);
      if(BL===3 && Math.random()<0.5) return blitzA(`☐ + ${n} = 10`, 10-n, `<b>${10-n}</b> und ${n} sind zusammen 10.`);
      if(BL===3) return blitzA(`10 − ${n}`, 10-n, `10 − ${n} = <b>${10-n}</b>, denn ${n} + ${10-n} = 10.`);
      return blitzA(`${n} + ☐ = 10`, 10-n, `${n} und <b>${10-n}</b> sind zusammen 10.`); },
    b_immer20(){ const n = BL===1 ? rnd(10,19) : rnd(1,19), erkl = n<10 ? `Erst bis 10: ${10-n}. Dann noch 10. Zusammen <b>${20-n}</b>.` : `Von ${n} bis 20 fehlen <b>${20-n}</b>.`;
      return blitzA(BL===3 && Math.random()<0.5 ? `☐ + ${n} = 20` : `${n} + ☐ = 20`, 20-n, erkl); },
    b_nachbar20(){ if(BL===3 && Math.random()<0.5){ const n=rnd(1,19);
        return eingabe(`Welche Zahl liegt <span class="ziel">zwischen ${n-1} und ${n+1}</span>?`, [F.zahl], n, {tag:"kopf", sollText:String(n), erkl:`${n-1}, <b>${n}</b>, ${n+1}.`}); }
      const vor = BL===1 ? false : Math.random()<0.5, n=vor?rnd(2,20):rnd(1,19);
      return eingabe(`Welche Zahl kommt <span class="ziel">${vor?"vor":"nach"} ${n}</span>?`, [F.zahl], vor?n-1:n+1, {tag:"kopf", sollText:String(vor?n-1:n+1),
        erkl: vor ? `Einen Schritt zurück: ${n} − 1 = <b>${n-1}</b>.` : `Einen Schritt weiter: ${n} + 1 = <b>${n+1}</b>.`}); },
    b_dh20(){ const [v,b] = BL===1 ? [1,5] : BL===2 ? [1,10] : [6,10];
      if(Math.random()<0.5){ const n=rnd(v,b); return blitzA(`Das Doppelte von ${n}`, 2*n, `${n} + ${n} = <b>${2*n}</b>.`, false, 28); }
      const n=rnd(v,b)*2; return blitzA(`Die Hälfte von ${n}`, n/2, `${n/2} + ${n/2} = ${n}. Die Hälfte ist <b>${n/2}</b>.`, false, 28); },
    b_pm20(){ const plus=Math.random()<0.5; let a,b, ueber=false;
      if(BL===1){ if(plus){ a=rnd(1,9); b=rnd(1,10-a); } else { a=rnd(2,10); b=rnd(1,a); } }
      else if(BL===2){ const gross=Math.random()<0.5;
        if(plus){ if(gross){ a=rnd(11,18); b=rnd(1,19-a); } else { a=rnd(1,9); b=rnd(1,10-a); } }
        else { if(gross){ a=rnd(12,19); b=rnd(1,a-10); } else { a=rnd(2,10); b=rnd(1,a); } } }
      else { ueber=true; if(plus){ a=rnd(2,9); b=rnd(11-a,9); } else { a=rnd(11,18); b=rnd(a-9,9); } }
      const s=plus?a+b:a-b;
      return blitzA(`${a} ${plus?"+":"−"} ${b}`, s, ueber ? (plus ? `Erst bis 10: ${a} + ${10-a} = 10. Dann noch ${b-(10-a)}: <b>${s}</b>.` : `Erst bis 10: ${a} − ${a-10} = 10. Dann noch ${b-(a-10)} weg: <b>${s}</b>.`) : `${a} ${plus?"+":"−"} ${b} = <b>${s}</b>.`); },
    b_schritt20(){ return schrittA(BL===1 ? 2 : BL===2 ? aus([2,5,2]) : aus([3,4]), 20); },
    // ----- Klasse 2 -----
    b_bloecke100(){ const n = BL===1 ? rnd(11,50) : rnd(11,99);
      return eingabe(`Welche Zahl ist das?${BL===3?' <small style="display:block;font-size:14px;color:#94a3b8;font-weight:600">Das Bild verschwindet nach 3 Sekunden.</small>':""}`, [F.zahl], n, {bild:bloecke(n), blick:BL===3, blickMs:3000, tag:"kopf", sollText:String(n),
        erkl:`${Math.floor(n/10)} Zehnerstangen und ${n%10} Einer: <b>${n}</b>.`}); },
    b_schritt100(){ return schrittA(BL===1 ? aus([10,5]) : BL===2 ? aus([2,5,10]) : aus([3,4,20,25]), 100); },
    b_ergZehner(){ let n; do{ n=rnd(11,98); }while(n%10===0); const z=Math.ceil(n/10)*10;
      return blitzA(BL===3 && Math.random()<0.5 ? `☐ + ${n} = ${z}` : `${n} + ☐ = ${z}`, z-n, `Von ${n} bis zum nächsten Zehner ${z} fehlen <b>${z-n}</b>.`); },
    b_erg100(){ let n = BL===1 ? rnd(1,9)*10 : rnd(3,97); if(BL===3) while(n%10===0) n=rnd(3,97); const z=Math.ceil(n/10)*10;
      return blitzA(BL===3 && Math.random()<0.4 ? `☐ + ${n} = 100` : `${n} + ☐ = 100`, 100-n, z===n ? `${n} + <b>${100-n}</b> = 100.` : `Erst bis ${z}: ${z-n}. Dann bis 100: ${100-z}. Zusammen <b>${100-n}</b>.`); },
    b_dh100(){ const d=Math.random()<0.5;
      if(BL===1){ if(d){ const n=rnd(1,5)*10; return blitzA(`Das Doppelte von ${n}`, 2*n, `${n} + ${n} = <b>${2*n}</b>.`, false, 28); } const n=rnd(1,5)*20; return blitzA(`Die Hälfte von ${n}`, n/2, `${n/2} + ${n/2} = ${n}. Die Hälfte ist <b>${n/2}</b>.`, false, 28); }
      if(BL===2){ if(d){ const n=rnd(1,10)*5; return blitzA(`Das Doppelte von ${n}`, 2*n, `${n} + ${n} = <b>${2*n}</b>.`, false, 28); } const n=rnd(1,10)*10; return blitzA(`Die Hälfte von ${n}`, n/2, `${n/2} + ${n/2} = ${n}. Die Hälfte ist <b>${n/2}</b>.`, false, 28); }
      if(d){ const n=rnd(11,49); return blitzA(`Das Doppelte von ${n}`, 2*n, `Zehner und Einer einzeln: ${Math.floor(n/10)*10} + ${Math.floor(n/10)*10} = ${Math.floor(n/10)*20}, ${n%10} + ${n%10} = ${2*(n%10)}. Zusammen <b>${2*n}</b>.`, false, 28); }
      const n=rnd(6,50)*2; return blitzA(`Die Hälfte von ${n}`, n/2, `${n/2} + ${n/2} = ${n}. Die Hälfte ist <b>${n/2}</b>.`, false, 28); },
    b_pm100(){ let a,b,plus;
      if(BL===3){ plus=Math.random()<0.5;
        if(plus){ do{ a=rnd(12,89); }while(a%10<2); b=rnd(10-a%10,9); } else { do{ a=rnd(20,98); }while(a%10>7); b=rnd(a%10+1,9); }
        const s=plus?a+b:a-b, z=plus?Math.ceil(a/10)*10:Math.floor(a/10)*10;
        return blitzA(`${a} ${plus?"+":"−"} ${b}`, s, `Über den Zehner: erst bis ${z}, dann weiter. ${a} ${plus?"+":"−"} ${b} = <b>${s}</b>.`); }
      const art = BL===1 ? aus([0,3]) : rnd(0,5); plus=art<3;
      if(art===0){ a=rnd(1,8)*10; b=rnd(1,10-a/10)*10; }
      else if(art===1){ do{ a=rnd(11,89); }while(a%10===0); b=rnd(1,Math.floor((99-a)/10))*10; }
      else if(art===2){ do{ a=rnd(11,88); }while(a%10===0 || a%10===9); b=rnd(1,9-a%10); }
      else if(art===3){ a=rnd(2,10)*10; b=rnd(1,a/10-1)*10; }
      else if(art===4){ do{ a=rnd(21,99); }while(a%10===0); b=rnd(1,Math.floor(a/10)-1)*10; }
      else { do{ a=rnd(12,99); }while(a%10<2); b=rnd(1,a%10); }
      const s=plus?a+b:a-b; return blitzA(`${a} ${plus?"+":"−"} ${b}`, s, `${a} ${plus?"+":"−"} ${b} = <b>${s}</b>.`); },
    b_kern(){ const x=rnd(1,10);
      if(BL===3 && Math.random()<0.5){ const k=aus([2,5,10]); return blitzA(`${k*x} : ${k}`, x, `${x} · ${k} = ${k*x}, also ${k*x} : ${k} = <b>${x}</b>.`); }
      const k=aus(BL===1?[1,2,10]:[1,2,5,10]), l=Math.random()<0.5; return blitzA(l?`${k} · ${x}`:`${x} · ${k}`, k*x, `${x} · ${k} = <b>${k*x}</b>.`); },
    // ----- Klasse 3 -----
    b_1x1(){ const a = BL===1 ? aus([2,3,4,5,10]) : BL===2 ? rnd(2,10) : rnd(6,9), b = BL===1 ? rnd(1,10) : BL===2 ? rnd(2,10) : rnd(6,9);
      return Math.random()<0.5 ? blitzA(`${a} · ${b}`, a*b, `${a} · ${b} = <b>${a*b}</b>.`) : blitzA(`${b} · ${a}`, a*b, `${b} · ${a} = <b>${a*b}</b>.`); },
    b_1x1um(){ const a = BL===1 ? aus([2,5,10]) : rnd(2,10), b=rnd(2,10), c=a*b, d=aus([a,b]);
      if(BL===3) return blitzA(`${c} : ${d}`, c/d, `${d} · ${c/d} = ${c}, also ${c} : ${d} = <b>${c/d}</b>.`);
      return eingabe(`<span style="font-size:22px;color:#94a3b8">${a} · ${b} = ${c}</span><br><span class="ziel" style="font-size:34px">${c} : ${d} = ☐</span>`, [F.zahl], c/d,
        {tag:"kopf", sollText:String(c/d), erkl:`Die Malaufgabe hilft: ${a} · ${b} = ${c}. Also ist ${c} : ${d} = <b>${c/d}</b>.`}); },
    b_bloecke1000(){ const n = BL===1 ? rnd(101,500) : rnd(101,999);
      return eingabe(`Welche Zahl ist das?${BL===3?' <small style="display:block;font-size:14px;color:#94a3b8;font-weight:600">Das Bild verschwindet nach 3 Sekunden.</small>':""}`, [F.zahl], n, {bild:bloecke(n), blick:BL===3, blickMs:3000, tag:"kopf", sollText:String(n),
        erkl:`${Math.floor(n/100)} Hunderter, ${Math.floor(n%100/10)} Zehner und ${n%10} Einer: <b>${n}</b>.`}); },
    b_tafel1000(){ let n; do{ n=rnd(100,999); }while(BL===1 ? /0/.test(String(n)) : BL===3 ? !/0/.test(String(n)) : (Math.random()<0.4 && !String(n).includes("0")));
      return eingabe(`Welche Zahl zeigt die Stellentafel?`, [F.zahl], n, {bild:tafel(n,["H","Z","E"]), tag:"kopf", sollText:String(n),
        erkl:`${Math.floor(n/100)} Hunderter, ${Math.floor(n%100/10)} Zehner, ${n%10} Einer: <b>${n}</b>. Eine leere Spalte schreibst du als 0.`}); },
    b_schritt1000(){ return schrittA(BL===1 ? aus([10,100]) : BL===2 ? aus([2,10,100,2,10,100,5,50]) : aus([20,25,50,200,250]), 1000); },
    b_erg1000(){ let n;
      if(BL===1) n=rnd(1,9)*100; else if(BL===2){ do{ n=rnd(1,99)*10; }while(n%100===0 && Math.random()<0.7); } else { do{ n=rnd(101,989); }while(n%10===0); }
      const z=Math.ceil(n/10)*10, h=Math.ceil(n/100)*100, teile=[]; if(z>n) teile.push(`bis ${z}: ${z-n}`); if(h>z) teile.push(`bis ${h}: ${h-z}`); if(1000>h) teile.push(`bis 1000: ${1000-h}`);
      return blitzA(`${n} + ☐ = 1000`, 1000-n, teile.length>1 ? `In Schritten – ${teile.join(", ")}. Zusammen <b>${1000-n}</b>.` : `${n} + <b>${1000-n}</b> = 1000.`); },
    b_ergHunderter(){ const H=rnd(1,10)*100, n = BL===1 ? H-rnd(1,9)*10 : H-rnd(1,99);
      return blitzA(BL===3 && Math.random()<0.5 ? `☐ + ${n} = ${H}` : `${n} + ☐ = ${H}`, H-n, `Von ${n} bis zum nächsten Hunderter ${H} fehlen <b>${H-n}</b>.`); },
    b_1000teilen(){ const d=aus(BL===1 ? [2,4,5,10] : BL===2 ? [2,4,5,10,20,25,50,100,200,250,500] : [8,20,25,40,125,200,250,500]);
      return blitzA(`1000 : ${d}`, 1000/d, `${d} · ${1000/d} = 1000, also 1000 : ${d} = <b>${1000/d}</b>.`); },
    b_dh1000(){ const d=Math.random()<0.5; let n;
      if(BL===1){ if(d){ n=rnd(11,50); return blitzA(`Das Doppelte von ${n}`, 2*n, `${n} + ${n} = <b>${2*n}</b>.`, false, 28); } n=rnd(6,50)*2; return blitzA(`Die Hälfte von ${n}`, n/2, `${n/2} + ${n/2} = ${n}. Die Hälfte ist <b>${n/2}</b>.`, false, 28); }
      if(BL===2){ if(d){ n=rnd(2,50)*10; return blitzA(`Das Doppelte von ${n}`, 2*n, `${n} + ${n} = <b>${2*n}</b>.`, false, 28); } n=rnd(2,100)*10; return blitzA(`Die Hälfte von ${n}`, n/2, `${n/2} + ${n/2} = ${n}. Die Hälfte ist <b>${n/2}</b>.`, false, 28); }
      if(d){ n=rnd(101,500); return blitzA(`Das Doppelte von ${n}`, 2*n, `Stelle für Stelle: ${n} + ${n} = <b>${2*n}</b>.`, false, 28); }
      n=rnd(51,500)*2; return blitzA(`Die Hälfte von ${n}`, n/2, `${n/2} + ${n/2} = ${n}. Die Hälfte ist <b>${n/2}</b>.`, false, 28); },
    b_pm1000(){ if(BL===3) return uebergang([1,10,10]);
      let x,u,d,k,plus,s; do{ x = BL===1 ? rnd(10,99)*10 : rnd(100,999); u=aus(BL===1?[10,100]:[1,10,100]); d=Math.floor(x/u)%10; plus=Math.random()<0.5;
        k = plus ? (d<9 ? rnd(1,9-d) : 0) : (d>(u===100?1:0) ? rnd(1,d-(u===100?1:0)) : 0); }while(!k);
      s=plus?x+k*u:x-k*u; return blitzA(`${x} ${plus?"+":"−"} ${k*u}`, s, `Nur die ${u===1?"Einer":u===10?"Zehner":"Hunderter"} ändern sich: ${x} ${plus?"+":"−"} ${k*u} = <b>${s}</b>.`); },
    b_zehner(){ const a = BL===3 ? rnd(6,9) : rnd(2,9), z = BL===3 ? rnd(5,9)*10 : rnd(1,9)*10, p=a*z, art = BL===1 ? 0 : rnd(0,2);
      if(art===0) return blitzA(`${a} · ${z}`, p, `${a} · ${z/10} = ${a*z/10}, also ${a} · ${z} = <b>${p}</b>.`);
      if(art===1) return blitzA(`${p} : ${a}`, z, `${a} · ${z} = ${p}, also ${p} : ${a} = <b>${z}</b>.`);
      return blitzA(`${p} : ${z}`, a, `${a} · ${z} = ${p}, also ${p} : ${z} = <b>${a}</b>.`); },
    b_mal10(){ if(BL===3 && Math.random()<0.5){ if(Math.random()<0.5){ const n=rnd(2,9); return blitzA(`${n} · 100`, n*100, `Mal 100: zwei Nullen dazu. <b>${n*100}</b>.`); }
        const n=rnd(2,9)*100; return blitzA(`${n} : 100`, n/100, `Durch 100: zwei Nullen weg. <b>${n/100}</b>.`); }
      if(BL===1 || Math.random()<0.5){ const n = BL===1 ? rnd(2,20) : rnd(2,99); return blitzA(`${n} · 10`, n*10, `Mal 10: Jede Ziffer rückt eine Stelle nach links, hinten kommt eine 0 dazu. <b>${n*10}</b>.`); }
      const n=rnd(2,99)*10; return blitzA(`${n} : 10`, n/10, `Durch 10: Jede Ziffer rückt eine Stelle nach rechts, die 0 am Ende fällt weg. <b>${n/10}</b>.`); },
    b_nachbarZH(){ const p = BL===1 ? 10 : BL===2 ? aus([10,100]) : 100; let n; do{ n=rnd(101,999); }while(n%p===0); const lo=Math.floor(n/p)*p, hi=lo+p, w=p===10?"Nachbarzehner":"Nachbarhunderter", links=Math.random()<0.5;
      return eingabe(`<span style="display:block;font-size:17px;color:#94a3b8;font-weight:700;margin-bottom:4px">${w}</span><span class="ziel" style="font-size:32px">${links?`☐ &lt; ${n} &lt; ${hi}`:`${lo} &lt; ${n} &lt; ☐`}</span>`, [F.zahl], links?lo:hi,
        {tag:"kopf", sollText:String(links?lo:hi), erkl:`${n} liegt zwischen <b>${lo}</b> und <b>${hi}</b> – das sind die ${w}.`}); },
    b_buendeln(){ let h,z,e;
      if(BL===1){ h=rnd(1,5); z=rnd(10,15); e=rnd(0,9); }
      else if(BL===2){ h=rnd(1,7); z=rnd(0,15); e=rnd(0,15); if(z<10 && e<10){ if(Math.random()<0.5) z+=10; else e+=10; } }
      else { do{ h=rnd(1,8); z=rnd(10,19); e=rnd(10,19); }while(h*100+z*10+e>999); }
      const n=h*100+z*10+e;
      return blitzA(`${h} H + ${z} Z + ${e} E`, n, `Bündeln: ${z>=10?`${z} Z = ${Math.floor(z/10)} H ${z%10} Z. `:""}${e>=10?`${e} E = ${Math.floor(e/10)} Z ${e%10} E. `:""}Zusammen ${h*100} + ${z*10} + ${e} = <b>${n}</b>.`, false, 30); },
    b_pmUebergang(){ return uebergang(BL===1 ? [1] : BL===2 ? [1,10,10] : [10]); },
    b_schrittProfi(){ const w=aus(BL===1 ? [25,50,150,250] : BL===2 ? [15,30,75,125] : [9,11,99,101]), ab=Math.random()<0.5; let st, l;
      do{ st=rnd(0,1000); l=[0,1,2,3].map(i=>st+(ab?-1:1)*i*w); }while(Math.min(...l)<0 || Math.max(...l)>1000);
      return eingabe(`Zähle ${ab?"rückwärts":"weiter"} – immer ${w} ${ab?"weniger":"mehr"}:<br><span class="ziel" style="font-size:32px">${l.slice(0,3).join(", ")}, ☐</span>`, [F.zahl], l[3],
        {tag:"kopf", sollText:String(l[3]), erkl:`${l[2]} ${ab?"−":"+"} ${w} = <b>${l[3]}</b>.${w===99||w===101?` Tipp: ${ab?"−":"+"} ${w} ist ${ab?"−":"+"} 100 ${w===99?(ab?"+ 1":"− 1"):(ab?"− 1":"+ 1")}.`:""}`}); },
    // ----- Klasse 4 -----
    b_zahlwort(){ let n;
      if(BL===1) n=rnd(1001,9999); else if(BL===2) n = Math.random()<0.5 ? rnd(10000,99999) : rnd(10,99)*1000+aus([0,rnd(1,999)]);
      else n = Math.random()<0.5 ? rnd(100000,999999) : rnd(1,9)*100000+aus([rnd(1,9)*1000,rnd(1,99)*10,rnd(1,999)]);
      return eingabe(`Schreibe als Zahl:<br><span class="ziel" style="font-size:22px;word-break:normal;overflow-wrap:anywhere">${zahlwort(n)}</span>`, [F.gross], n, {tag:"kopf", sollText:fmt(n),
        erkl:`Erst kommt der Teil vor „tausend“: <b>${fmt(Math.floor(n/1000))}</b> Tausender. Dann der Rest: <b>${n%1000}</b>. Zusammen <b>${fmt(n)}</b>.`}); },
    b_tafelMio(){ let n; const z=s=>(String(s).match(/0/g)||[]).length;
      do{ n = BL===1 ? rnd(1000,99999) : rnd(100000,999999); }while(BL===2 ? (Math.random()<0.6 && !z(n)) : BL===3 ? z(n)<2 : false);
      return eingabe(`Welche Zahl zeigt die Stellentafel?`, [F.gross], n, {bild:tafel(n,["HT","ZT","T","H","Z","E"]), tag:"kopf", sollText:fmt(n),
        erkl:`Lies von links nach rechts: ${String(n).padStart(6,"0").split("").join(" · ")} – das ist <b>${fmt(n)}</b>. Eine leere Spalte schreibst du als 0.`}); },
    b_schrittMio(){ return schrittA(aus(BL===1 ? [1000,10000,100000] : BL===2 ? [1000,2000,2500,5000,10000,20000,25000,50000,100000,250000] : [2500,25000,250000,20000,50000,125000]), 1000000); },
    b_stufenMinus(){ const a=rnd(3,6), S=Math.pow(10,a); let T;
      if(BL===1 || (BL===2 && Math.random()<0.5)) T=Math.pow(10,rnd(0,a-1)); else T=rnd(2,9)*Math.pow(10,rnd(Math.max(0,a-3),a-1));
      return blitzA(`${fmt(S)} − ${fmt(T)}`, S-T, `${fmt(S-T)} + ${fmt(T)} = ${fmt(S)}, also <b>${fmt(S-T)}</b>.`, true, 28); },
    b_dhMio(){ const d=Math.random()<0.5; let n;
      if(BL===1) n = d ? rnd(1,4)*100000+rnd(0,1)*50000 : rnd(1,9)*100000;
      else if(BL===2) n = d ? (Math.random()<0.6 ? (rnd(1,4)*10+rnd(1,9))*10000 : rnd(11,49)*1000) : (Math.random()<0.6 ? rnd(2,99)*10000 : rnd(2,99)*1000);
      else n = d ? rnd(101,499)*1000 : rnd(101,999)*1000;
      return d ? blitzA(`Das Doppelte von ${fmt(n)}`, 2*n, `${fmt(n)} + ${fmt(n)} = <b>${fmt(2*n)}</b>.`, true, 26)
               : blitzA(`Die Hälfte von ${fmt(n)}`, n/2, `${fmt(n/2)} + ${fmt(n/2)} = ${fmt(n)}. Die Hälfte ist <b>${fmt(n/2)}</b>.`, true, 26); },
    b_stufenTeil(){ let s,d; do{ s=aus([100,1000,10000,100000,1000000]); d=aus(BL===1 ? [2,10] : BL===2 ? [2,4,5,10,100,1000] : [4,5,8,20,25,50]); }while(d>=s || s%d || (BL===3 && s<1000));
      return blitzA(`${fmt(s)} : ${fmt(d)}`, s/d, `${fmt(d)} · ${fmt(s/d)} = ${fmt(s)}, also ${fmt(s)} : ${fmt(d)} = <b>${fmt(s/d)}</b>.`, true); },
    b_stellen(){ let a,b,k,p; do{ a=rnd(2,9); b=rnd(2,9); k=Math.pow(10, BL===1 ? rnd(1,2) : BL===2 ? rnd(2,5) : rnd(4,5)); p=a*b*k; }while(p>1000000);
      if(Math.random()<0.5) return blitzA(`${a} · ${fmt(b*k)}`, p, `${a} · ${b} = ${a*b}, dazu die Nullen: <b>${fmt(p)}</b>.`, true);
      return blitzA(`${fmt(p)} : ${a}`, b*k, `${a} · ${fmt(b*k)} = ${fmt(p)}, also ${fmt(p)} : ${a} = <b>${fmt(b*k)}</b>.`, true); },
    b_ergMio(){ let n;
      if(BL===1) n=rnd(1,9)*100000; else if(BL===2){ do{ n=(rnd(1,9)*10+rnd(0,9))*10000; }while(n%100000===0 && Math.random()<0.7); } else { do{ n=rnd(101,999)*1000; }while(n%10000===0); }
      const h=Math.ceil(n/100000)*100000;
      return blitzA(`${fmt(n)} + ☐ = 1 000 000`, 1000000-n, h===n ? `${fmt(n)} + <b>${fmt(1000000-n)}</b> = 1 000 000.` : `Erst bis ${fmt(h)}: ${fmt(h-n)}. Dann bis 1 000 000: ${fmt(1000000-h)}. Zusammen <b>${fmt(1000000-n)}</b>.`, true, 26); },
    b_pmMio(){ let a,b,plus,s,e;
      do{ if(BL===3){ e=1000; a=rnd(100,999)*1000; b=rnd(11,99)*1000; } else { e = BL===1 ? 10000 : aus([1000,10000,10000]); a=rnd(10,99)*e; b=rnd(1,9)*e; }
        plus=Math.random()<0.5; s=plus?a+b:a-b; }while(s<=0 || s>1000000);
      return blitzA(`${fmt(a)} ${plus?"+":"−"} ${fmt(b)}`, s, `Rechne mit ${e===1000?"Tausendern":"Zehntausendern"}: ${a/e} ${plus?"+":"−"} ${b/e} = ${s/e}. Also <b>${fmt(s)}</b>.`, true); },
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
    // Klasse 2, erstes Halbjahr: die Schritte vor dem großen Plus und Minus bis 100
    rp_zehner(){ const a=rnd(11,69), b=rnd(1,9-Math.floor(a/10))*10;
      return rechen(`${a} + ${b}`, a+b, [a,"+",b,a+b], `Nur die Zehner ändern sich: ${Math.floor(a/10)} Zehner + ${b/10} Zehner = ${Math.floor(a/10)+b/10} Zehner. Die Einer bleiben: <b>${a+b}</b>.`); },
    rm_zehner(){ const a=rnd(31,99), b=rnd(1,Math.floor(a/10)-1)*10;
      return rechen(`${a} − ${b}`, a-b, [a,"-",b,a-b], `Nur die Zehner ändern sich: ${Math.floor(a/10)} Zehner − ${b/10} Zehner = ${Math.floor(a/10)-b/10} Zehner. Die Einer bleiben: <b>${a-b}</b>.`); },
    rp_ohne(){ let a,b; do{ a=rnd(11,68); b=rnd(11,38); }while(a%10+b%10>9 || a+b>99 || b%10===0);
      return rechen(`${a} + ${b}`, a+b, [a,"+",b,a+b], `Erst die Zehner, dann die Einer: ${a} + ${b-b%10} = ${a+b-b%10}, dann + ${b%10} = <b>${a+b}</b>.`); },
    rm_ohne(){ let a,b; do{ a=rnd(35,99); b=rnd(11,a-11); }while(a%10<b%10 || b%10===0);
      return rechen(`${a} − ${b}`, a-b, [a,"-",b,a-b], `Erst die Zehner, dann die Einer: ${a} − ${b-b%10} = ${a-b+b%10}, dann − ${b%10} = <b>${a-b}</b>.`); },
    rp_einer(){ let a,b; do{ a=rnd(13,88); b=rnd(3,9); }while(a%10+b<10 || a%10===0);
      const bis=10-a%10; return rechen(`${a} + ${b}`, a+b, [a,"+",b,a+b], `Erst bis zum nächsten Zehner: ${a} + ${bis} = ${a+bis}, dann noch + ${b-bis} = <b>${a+b}</b>.`); },
    rz_zehner(){ let a; do{ a=rnd(12,89); }while(a%10===0); const z=Math.ceil(a/10)*10;
      return rechen(`${a} + ☐ = ${z}`, z-a, [a,"+",z-a,z], `Wie viele fehlen bis zum nächsten Zehner? ${a%10} und <b>${z-a}</b> ergeben 10 – also ${a} + <b>${z-a}</b> = ${z}.`); },
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
        erkl:`Wandle um: ${m} m = ${m*100} cm. Dann ${m*100} cm − ${ab} cm = ${rest} cm. Das sind <b>${euroLaenge(rest)}</b>.`}); },
    // ===== Stellenwerte: legen, lesen, Zahlendreher, bündeln, plus/minus mit Material =====
    st_legen2(){ const n=rnd(11,99); return stLegen(n, ST2, `Lege die Zahl <span class="ziel">${n}</span>.`); },
    st_wortLegen2(){ let n; do{ n=rnd(21,99); }while(n%10===0 || n%11===0);
      return stLegen(n, ST2, `Lege: <span class="ziel">${Stellen.zahlwort(n)}</span>`, {erkl:dreherErkl(n)+`<br>${Stellen.bild(stTeile(n),ST2)}`}); },
    st_lesen2(){ const z=rnd(1,9), e=rnd(0,9), n=z*10+e;
      return eingabe("Welche Zahl liegt hier?", [F.zahl], n, {bild:Stellen.bild({Z:z,E:e},ST2), tag:"stlesen", sollText:String(n), falle:e&&e!==z?e*10+z:null, falleArt:"dreher",
        erkl:`${z} Zehnerstangen sind ${z*10}${e?`, dazu ${e} Einerwürfel: ${z*10} + ${e} = <b>${n}</b>`:` – Einer liegen keine da: <b>${n}</b>`}.`}); },
    st_zerlegt2(){ const z=rnd(1,9), e=rnd(1,9), n=z*10+e;
      const t=aus([`${z} Zehner und ${e} Einer`, `${e} Einer und ${z} Zehner`, `${z*10} + ${e}`, `${e} + ${z*10}`, `${e} E ${z} Z`]);
      return eingabe(`Welche Zahl ist <span class="ziel">${t}</span>?`, [F.zahl], n, {tag:"stlesen", sollText:String(n), falle:e!==z?e*10+z:null, falleArt:"dreher",
        erkl:`Egal, in welcher Reihenfolge es dasteht: <b>${z} Zehner</b> und <b>${e} Einer</b>. In der Zahl steht der Zehner vorne: <b>${n}</b>.<br>${Stellen.bild({Z:z,E:e},ST2)}`}); },
    st_dreherBild(){ let z,e; do{ z=rnd(2,9); e=rnd(1,9); }while(z===e); const n=z*10+e, z3=z===9?8:z+1;
      const paare=mische([[Stellen.bild({Z:z,E:e},ST2),`${z} Z ${e} E`],[Stellen.bild({Z:e,E:z},ST2),`${e} Z ${z} E`],[Stellen.bild({Z:z3,E:e},ST2),`${z3} Z ${e} E`]]);
      return {art:"wahl", frage:`Welches Bild zeigt <span class="ziel">${n}</span>?<br><span style="font-size:15px;color:var(--muted);font-weight:600">${Stellen.zahlwort(n)}</span>`, optionen:paare.map(p=>p[0]), optText:paare.map(p=>p[1]),
        ok:Stellen.bild({Z:z,E:e},ST2), spalten:1, tag:"dreher", sollText:`${n} = ${z} Zehner ${e} Einer`, erkl:dreherErkl(n)}; },
    st_dreherWort(){ let z,e; do{ z=rnd(2,9); e=rnd(1,9); }while(z===e); const n=z*10+e;
      return {art:"wahl", frage:`Wie schreibt man <span class="ziel">${Stellen.zahlwort(n)}</span>?`, optionen:mische([String(n),String(e*10+z),`${z}0${e}`]), ok:String(n), tag:"dreher", sollText:String(n), erkl:dreherErkl(n)}; },
    st_buendelLesen2(){ const z=rnd(1,7), e=rnd(10,19), n=z*10+e;
      return eingabe("Welche Zahl liegt hier? Achtung: Es sind mehr als 9 Einer!", [F.zahl], n, {bild:Stellen.bild({Z:z,E:e},ST2), tag:"buendeln", sollText:String(n), falle:+`${z}${e}`, falleArt:"buendeln",
        erkl:`${e} Einer – davon sind <b>10 Einer ein Zehner</b>. Bündeln: ${z} + 1 = <b>${z+1} Zehner</b> und ${e-10} Einer = <b>${n}</b>.<br>Oder gerechnet: ${z*10} + ${e} = ${n}. (Nicht ${z}${e}: an jeder Stelle steht nur <b>eine</b> Ziffer.)`}); },
    st_buendelLegen2(){ let n; do{ n=rnd(31,89); }while(n%10===0); const k=Math.floor(n/10)-1;
      return stLegen(n, ST2, `Lege <span class="ziel">${n}</span> – aber nimm nur <b>${k} Zehnerstangen</b>!`, {nur:{Z:k}, tag:"buendeln",
        erkl:`Mit ${k} Zehnerstangen hast du ${k*10}. Bis ${n} fehlen noch ${n-k*10} – das sind <b>${n-k*10} Einerwürfel</b>. Denn 10 Einer sind so viel wie 1 Zehner.<br>${Stellen.bild({Z:k,E:n-k*10},ST2)}`}); },
    st_plus2(){ return stPlus(aus(["+1","+1","-1","-1","+10","-10"]), ST2); },
    st_legen3(){ const n=rnd(101,999); return stLegen(n, ST3, `Lege die Zahl <span class="ziel">${n}</span>.`); },
    st_null3(){ const h=rnd(1,9), x=rnd(1,9), n=aus([h*100+x, h*100+x*10]), ohne=+String(n).replace("0","");
      return stLegen(n, ST3, `Lege <span class="ziel">${n}</span>. Schau genau auf die Null!`, {falle:ohne, falleArt:"null"}); },
    st_lesen3(){ const h=rnd(1,9), z=rnd(0,9), e=rnd(0,9), n=h*100+z*10+e;
      return eingabe("Welche Zahl liegt hier?", [F.zahl], n, {bild:Stellen.bild({H:h,Z:z,E:e},ST3), tag:"stlesen", sollText:String(n), falle:(!z||!e)?+String(n).replace("0",""):null, falleArt:"null",
        erkl:`${h} Hunderterplatten = ${h*100}, ${z} Zehnerstangen = ${z*10}, ${e} Einerwürfel = ${e}. Zusammen: <b>${n}</b>.`+(!z||!e?` Wo nichts liegt, schreibt man eine <b>0</b>.`:"")}); },
    st_buendelLesen3(){ const h=rnd(1,7), viel=aus(["Z","E"]), z=viel==="Z"?rnd(10,14):rnd(1,8), e=viel==="E"?rnd(10,15):rnd(0,9), n=h*100+z*10+e;
      return eingabe(`Welche Zahl liegt hier? Achtung: mehr als 9 ${viel==="Z"?"Zehner":"Einer"}!`, [F.zahl], n, {bild:Stellen.bild({H:h,Z:z,E:e},ST3), tag:"buendeln", sollText:String(n),
        falle:viel==="Z"?+`${h}${z}${e}`:+`${h}${z}${e}`, falleArt:"buendeln",
        erkl:`${h*100} + ${z*10} + ${e} = <b>${n}</b>. ${viel==="Z"?`10 Zehner sind 1 Hunderter: ${z} Zehner = 1 Hunderter und ${z-10} Zehner.`:`10 Einer sind 1 Zehner: ${e} Einer = 1 Zehner und ${e-10} Einer.`}`}); },
    st_buendelLegen3(){ let n; do{ n=rnd(2,9)*100+rnd(0,9)*10+rnd(0,9); }while(n%100===0); const k=Math.floor(n/100)-1;
      return stLegen(n, ST3, `Lege <span class="ziel">${n}</span> – aber nimm nur <b>${k} Hunderterplatten</b>!`, {nur:{H:k}, tag:"buendeln",
        erkl:`Mit ${k} Hunderterplatten hast du ${k*100}. Der fehlende Hunderter wird zu <b>10 Zehnerstangen</b>: also ${k} H, ${stTeile(n).Z+10} Z, ${stTeile(n).E} E.<br>${Stellen.bild({H:k,Z:stTeile(n).Z+10,E:stTeile(n).E},ST3)}`}); },
    st_plus3(){ return stPlus(aus(["+1","-1","+10","-10","+100","-100","+1","-1"]), ST3); },
    // ===== Punkt 4 (24.11.2026): Aufgaben zum Ziehen und Fehler-Detektiv =====
    s_setze(){ return setzeStrahl(aus(STRAHL100)); }, t_setze(){ return setzeStrahl(aus(STRAHL1000)); },
    l_zeichneCm(){ const cm=rnd(3,11); return {art:"ziehen", zieh:"lineal", soll:cm*10, raster:10, frage:`Zieh den Stift: Er soll genau <span class="ziel">${cm} cm</span> lang sein.`, tag:"messen", sollText:`${cm} cm`,
      erkl:`Der Stift beginnt bei der <b>0</b>. Er muss genau bis zur <b>${cm}</b> reichen.`}; },
    l_zeichneMm(){ let mm; do{ mm=rnd(25,115); }while(mm%10===0); const c=Math.floor(mm/10), r=mm%10;
      return {art:"ziehen", zieh:"lineal", soll:mm, raster:1, frage:`Zieh den Stift: Er soll genau <span class="ziel">${c} cm ${r} mm</span> lang sein.`, tag:"messen", sollText:`${c} cm ${r} mm`,
        erkl:`Erst bis zur <b>${c}</b> (das sind ${c} cm), dann noch <b>${r}</b> kleine Striche weiter – jeder kleine Strich ist 1 mm. Zusammen ${mm} mm.`}; },
    d_saeule(){ const th=aus([[["🍎","Apfel"],["🍌","Banane"],["🍓","Erdbeere"],["🍇","Trauben"]],[["🐶","Hund"],["🐱","Katze"],["🐰","Hase"],["🐟","Fisch"]],[["⚽","Fußball"],["🏊","Schwimmen"],["🚲","Radfahren"],["🎨","Malen"]]]);
      const werte=th.map(()=>rnd(1,11)), i=rnd(0,3);
      return {art:"ziehen", zieh:"saeule", th, werte, i, soll:werte[i], raster:1, frage:`In der Strichliste stehen bei ${th[i][0]} <b>${th[i][1]}</b> diese Striche. Zieh die Säule auf die richtige Höhe!`, tag:"diagramm", sollText:String(werte[i]),
        erkl:`Zähle die Striche: Jedes Bündel mit dem Querstrich sind <b>5</b>. Bei ${th[i][1]} sind es <b>${werte[i]}</b> – die Säule muss bis zur ${werte[i]} reichen.`}; },
    f_sortFlaeche(){ const fl=mische(["Kreis","Dreieck","Quadrat","Rechteck","Fünfeck","Sechseck"]).slice(0,3), ko=mische(Object.keys(KOERPER)).slice(0,3);
      return sortierAufgabe("Sortiere: Was ist eine <b>Fläche</b>, was ist ein <b>Körper</b>?", ["Fläche (flach)","Körper (man kann ihn anfassen)"],
        mische(fl.map(n=>[n,formBild(n),0]).concat(ko.map(n=>[n,koerperBild(n),1]))), "Eine <b>Fläche</b> ist flach wie ein Blatt Papier. Ein <b>Körper</b> hat Höhe, Breite und Tiefe – wie ein Würfel oder eine Dose."); },
    f_sortRollen(){ const r=["Kugel","Zylinder","Kegel"], n=["Würfel","Quader","Pyramide"];
      return sortierAufgabe("Sortiere: Welcher Körper kann <b>rollen</b>?", ["kann rollen","kann nicht rollen"], mische(r.map(k=>[k,koerperBild(k),0]).concat(n.map(k=>[k,koerperBild(k),1]))),
        "Rollen kann ein Körper nur, wenn er eine <b>gebogene Fläche</b> hat: Kugel, Zylinder und Kegel. Würfel, Quader und Pyramide haben nur flache Flächen und Ecken."); },
    f_sortEcken(){ const vier=["Quadrat","Rechteck"], andere=mische(["Kreis","Dreieck","Fünfeck","Sechseck"]).slice(0,3), alle=vier.concat(aus([["Quadrat"],["Rechteck"]])).slice(0,3);
      return sortierAufgabe("Sortiere: Welche Form hat <b>genau 4 Ecken</b>?", ["genau 4 Ecken","nicht 4 Ecken"], mische(alle.map(k=>[k,formBild(k),0]).concat(andere.map(k=>[k,formBild(k),1]))),
        "Quadrat und Rechteck haben <b>4 Ecken</b>. Ein Dreieck hat 3, ein Fünfeck 5, ein Sechseck 6 – und ein Kreis gar keine."); },
    sp_detektiv(){ return schriftDetektiv("+"); }, sm_detektiv(){ return schriftDetektiv("-"); }, sx_detektiv(){ return schriftDetektiv("*"); },
    g_detektiv(){ const art=aus(["komma","stelle","rueck","komma"]);
      const FEHLER={komma:"Hinter dem Komma stehen immer zwei Ziffern für die Cent.", stelle:"Das Komma steht an der falschen Stelle: 100 ct sind 1 €.", rueck:"Beim Rückgeld wurde falsch gerechnet.", ok:"Es ist alles richtig."};
      let frage, erkl, ok=FEHLER[art];
      if(art==="komma"){ const e=rnd(1,9), c=rnd(1,9); frage=`Flo schreibt: <span class="ziel">${e} € ${c} ct = ${e},${c} €</span>`; erkl=`${c} ct schreibt man mit zwei Ziffern: „0${c}“. Richtig ist <b>${e},0${c} €</b>. ${e},${c} € wären ${e} € ${c}0 ct!`; }
      else if(art==="stelle"){ const c=rnd(101,899); frage=`Flo schreibt: <span class="ziel">${c} ct = ${Math.floor(c/10)},${c%10} €</span>`; erkl=`100 ct sind 1 €. In ${c} ct stecken ${Math.floor(c/100)} €. Richtig ist <b>${komma(c)}</b>.`; }
      else { const preis=rnd(11,89)*10, falsch=1000-preis+aus([100,-100]); frage=`Flo bezahlt <b>${komma(preis)}</b> mit 10 €. Sie sagt: <span class="ziel">Ich bekomme ${komma(falsch)} zurück.</span>`; erkl=`10,00 € − ${komma(preis)} = <b>${komma(1000-preis)}</b>. Tipp: Ergänze bis zum nächsten Euro und dann bis 10 €.`; }
      const opts=mische([ok].concat(mische(Object.values(FEHLER).filter(x=>x!==ok)).slice(0,2)));
      return {art:"wahl", frage:`🕵️ ${frage}<br>Was ist hier falsch?`, optionen:opts, ok, spalten:1, tag:"komma", sollText:`„${ok.replace(/\.$/,"")}“`, erkl}; },
    // ===== Entdecker-Päckchen =====
    pk_weiter20(){ return pkWeiter("+", 20); }, pk_weiter100(){ return pkWeiter("+", 100); },
    pk_weiterMinus(){ return pkWeiter("-", 100); }, pk_weiterMal(){ return pkWeiter("*", 100); },
    pk_naechste20(){ return pkNaechste("+", 20); }, pk_naechste100(){ return pkNaechste("+", 100); },
    pk_warumPlus(){ return pkWarum("+"); }, pk_warumMinus(){ return pkWarum("-"); }, pk_warumMal(){ return pkWarum("*"); },
    pk_stoerPlus(){ return pkStoer("+"); }, pk_stoerMinus(){ return pkStoer("-"); }, pk_stoerMal(){ return pkStoer("*"); },
    pk_fehlerPlus(){ return pkFehler("+"); }, pk_fehlerMinus(){ return pkFehler("-"); }, pk_fehlerMal(){ return pkFehler("*"); },
    // ===== Zahlenmauern (drei Steine unten) =====
    zm_deck(){ const u=zmUnten(100), w=zmWerte(u);
      return eingabe("Welche Zahl steht oben im Deckstein?", [F.zahl], w.o, {bild:zmBild(w,["o","m0","m1"]), tag:"zmauer", sollText:String(w.o),
        erkl:`Immer zwei Steine nebeneinander ergeben zusammen den Stein darüber.<br>${w.u[0]} + ${w.u[1]} = <b>${w.m[0]}</b> · ${w.u[1]} + ${w.u[2]} = <b>${w.m[1]}</b> · ${w.m[0]} + ${w.m[1]} = <b>${w.o}</b><br>${zmBild(w,[])}`}); },
    zm_unten(){ const u=zmUnten(100), w=zmWerte(u);
      return eingabe("Welche Zahl fehlt unten in der Mitte?", [F.zahl], u[1], {bild:zmBild(w,["u1","m1","o"]), tag:"zmauer", sollText:String(u[1]),
        erkl:`Über dem fehlenden Stein steht ${w.m[0]}. Daneben unten steht ${u[0]}. Also: ${u[0]} + ☐ = ${w.m[0]} → ${w.m[0]} − ${u[0]} = <b>${u[1]}</b>.<br>${zmBild(w,[])}`}); },
    zm_mitte(){ const u=zmUnten(100), w=zmWerte(u);
      return eingabe("Welche Zahl fehlt in der Mitte rechts?", [F.zahl], w.m[1], {bild:zmBild(w,["u1","u2","m1"]), tag:"zmauer", sollText:String(w.m[1]),
        erkl:`Der Deckstein ist ${w.o}. Links darunter steht ${w.m[0]}. ${w.m[0]} + ☐ = ${w.o} → ${w.o} − ${w.m[0]} = <b>${w.m[1]}</b>.<br>${zmBild(w,[])}`}); },
    zm_warum(){ const u=zmUnten(60), wo=aus(["mitte","mitte","rand"]), k=aus([1,1,2,5,10]), i=wo==="mitte"?1:aus([0,2]), u2=u.slice(); u2[i]+=k;
      const w=zmWerte(u), w2=zmWerte(u2), d=w2.o-w.o, stein = wo==="mitte" ? "mittlere Stein unten" : (i===0?"linke Stein unten":"rechte Stein unten");
      const ok=`Er wird um ${d} größer.`, opts=[...new Set([ok, `Er wird um ${k} größer.`, `Er wird um ${k*3} größer.`, "Er bleibt gleich."])].slice(0,3);
      return {art:"wahl", frage:`Der <span class="ziel">${stein}</span> wird um <span class="ziel">${k}</span> größer.<br>Was passiert mit dem Deckstein?`, optionen:mische(opts), ok, spalten:1, tag:"begruenden",
        bild:zmBild(w,[]), sollText:`„${ok.replace(/\.$/,"")}“`,
        erkl:(wo==="mitte" ? `Der mittlere Stein wird <b>zweimal</b> gebraucht: für den linken und für den rechten Stein in der Mitte. Darum zählt er im Deckstein <b>doppelt</b>: ${k} + ${k} = ${d}.`
                           : `Ein Stein am Rand wird nur <b>einmal</b> gebraucht. Darum wird der Deckstein auch nur um ${k} größer.`)+
          `<div class="zmPaar"><div>${zmBild(w,[])}<small>vorher</small></div><div>${zmBild(w2,[])}<small>nachher</small></div></div>`}; },
    zm_ziel(){ let u, o; do{ u=zmUnten(100); o=zmWerte(u).o; }while(o%10!==0 && rnd(0,3));
      const w=zmWerte(u), s=u[0]+u[2];
      return eingabe(`Welche Zahl muss unten in die Mitte, damit oben <span class="ziel">${o}</span> steht?`, [F.zahl], u[1], {bild:zmBild({u:[u[0],0,u[2]],m:[0,0],o},["u1","m0","m1"]), tag:"zmauer", sollText:String(u[1]),
        erkl:`Die beiden Steine am Rand zählen im Deckstein <b>einmal</b>: ${u[0]} + ${u[2]} = ${s}. Der mittlere Stein zählt <b>doppelt</b>. Bis ${o} fehlen ${o} − ${s} = ${o-s}. Die Hälfte davon ist <b>${u[1]}</b>.<br>${zmBild(w,[])}`}); }
    ,
    // ===== 24.11.: Würfelgebäude, Würfelnetze, Lage =====
    f_bauplan(){ const h=bauplanNeu(), n=wbSumme(h);
      return eingabe("Das ist ein <span class=\"ziel\">Bauplan</span>. Wie viele Würfel brauchst du für das Gebäude?", [F.zahl], n, {bild:bauplanBild(h), tag:"wuerfelbau", sollText:String(n),
        erkl:`Im Bauplan steht in jedem Feld, wie viele Würfel <b>übereinander</b> stehen. Zähle alle Zahlen zusammen: ${h.flat().filter(x=>x).join(" + ")} = <b>${n}</b>.<div class="wbPaar">${gebaeudeBild(h)}</div>`}); },
    f_gebaeude(){ const h=bauplanNeu(), n=wbSumme(h);
      return eingabe("Wie viele <span class=\"ziel\">Würfel</span> hat dieses Gebäude?", [F.zahl], n, {bild:gebaeudeBild(h), tag:"wuerfelbau", sollText:String(n),
        erkl:`Manche Würfel siehst du nicht. Aber: Unter jedem Würfel muss ein Würfel stehen – sonst würde er herunterfallen. Der Bauplan zeigt, wie hoch jeder Turm ist: ${h.flat().filter(x=>x).join(" + ")} = <b>${n}</b>.<div class="wbPaar">${bauplanBild(h)}</div>`}); },
    f_bauplanWahl(){ const h=bauplanNeu(), ok=bauplanBild(h,true), falsch=[];
      for(let v=0; v<30 && falsch.length<2; v++){ const g=bauplanVariante(h), s=bauplanBild(g,true); if(s!==ok && !falsch.includes(s)) falsch.push(s); }
      return {art:"wahl", frage:"Welcher <span class=\"ziel\">Bauplan</span> passt zu diesem Gebäude?", bild:gebaeudeBild(h), optionen:mische([ok].concat(falsch)), ok, tag:"wuerfelbau", sollText:"der Bauplan unten",
        erkl:`Schau jeden Turm einzeln an: Wie hoch ist er? Hinten stehen die Türme oben im Bauplan, vorne unten.<div class="wbPaar">${bauplanBild(h)}</div>`}; },
    f_netz(){ const n=netzNeu(), ok=n.geht?"Ja":"Nein";
      return {art:"wahl", frage:"Kann man aus diesem Netz einen <span class=\"ziel\">Würfel</span> falten?", bild:netzBild(n.z), optionen:["Ja","Nein"], ok, tag:"netz", sollText:ok, erkl:n.erkl}; },
    f_lage(){ const g=lageGitter(), R=[["rechts neben",0,1],["links neben",0,-1],["über",-1,0],["unter",1,0]];
      let r, i, j; do{ r=aus(R); i=rnd(0,2); j=rnd(0,2); }while(i+r[1]<0||i+r[1]>2||j+r[2]<0||j+r[2]>2);
      const wo=g[i][j], ok=g[i+r[1]][j+r[2]], geg=g[i-r[1]]&&g[i-r[1]][j-r[2]];
      const opts=mische([...new Set([ok].concat(geg?[geg]:[], mische(g.flat().filter(x=>x!==ok&&x!==wo))))].slice(0,4));
      const emo=x=>`<span class="emo">${x}</span>`;
      return {art:"wahl", frage:`Was liegt <span class="ziel">${r[0]}</span> ${LAGE_ART[wo]}?`, bild:lageBild(g), optionen:opts.map(emo), ok:emo(ok), tag:"lage", sollText:ok,
        erkl:`Such zuerst ${wo}. Dann schau ${r[0]==="über"?"genau darüber (nach oben)":r[0]==="unter"?"genau darunter (nach unten)":r[0]==="rechts neben"?"nach rechts":"nach links"}: Dort liegt <b>${ok}</b>.`}; },
    f_lageWo(){ const g=lageGitter(), W=[[0,0,"oben links"],[0,2,"oben rechts"],[2,0,"unten links"],[2,2,"unten rechts"],[1,1,"in der Mitte"]], w=aus(W), d=g[w[0]][w[1]];
      return {art:"wahl", frage:`Wo liegt <span class="ziel">${LAGE_NOM[d]}</span>?`, bild:lageBild(g), optionen:W.map(x=>x[2]), ok:w[2], spalten:1, tag:"lage", sollText:w[2],
        erkl:`${LAGE_NOM[d][0].toUpperCase()+LAGE_NOM[d].slice(1)} liegt <b>${w[2]}</b>. Oben ist die erste Reihe, unten die letzte. Links und rechts: ${w[1]===0?"ganz links":w[1]===2?"ganz rechts":"in der Mitte"}.`}; },
    // ===== 24.11.: Glücksrad und Würfel =====
    d_rad(){ const f=mische(Object.keys(FARBEN)).slice(0,3), n=aus([[5,2,1],[4,3,1],[4,1,3],[3,1,4],[2,5,1],[1,2,5],[5,1,2]]), gross=Math.random()<0.65;
      const felder=mische(f.flatMap((x,i)=>Array(n[i]).fill(x))), ziel=f[n.indexOf(gross?Math.max(...n):Math.min(...n))];
      return {art:"wahl", frage:`Das Glücksrad wird gedreht. Auf welcher Farbe bleibt der Zeiger am <span class="ziel">${gross?"wahrscheinlichsten":"unwahrscheinlichsten"}</span> stehen?`, bild:radBild(felder), optionen:f.slice().sort(), ok:ziel, tag:"zufall", sollText:ziel,
        erkl:`Zähle die Felder: ${f.map((x,i)=>`${n[i]} × ${x}`).join(", ")}. ${ziel[0].toUpperCase()+ziel.slice(1)} hat die ${gross?"meisten":"wenigsten"} Felder – also ist es am ${gross?"wahrscheinlichsten":"unwahrscheinlichsten"}. Sicher ist es aber nie!`}; },
    d_fair(){ const f=mische(["rot","blau","gelb","grün"]), a=f[0], b=f[1], art=aus(["fair","fair","A","B"]);
      let na=rnd(2,4), nb=na; if(art==="A") nb=na-rnd(1,na-1); if(art==="B") na=nb-rnd(1,nb-1); const rest=8-na-nb;
      const felder=mische(Array(na).fill(a).concat(Array(nb).fill(b), Array(rest).fill(f[2])));
      const opts=["Ja, das Spiel ist fair.","Nein, Mia hat bessere Chancen.","Nein, Ben hat bessere Chancen."], ok=opts[art==="fair"?0:art==="A"?1:2];
      return {art:"wahl", frage:`Mia gewinnt bei <span class="ziel">${a}</span>, Ben bei <span class="ziel">${b}</span>. Bei ${f[2]} gewinnt keiner.<br>Ist das Spiel <span class="ziel">fair</span>?`, bild:radBild(felder), optionen:opts, ok, spalten:1, tag:"zufall", sollText:`„${ok.replace(/\.$/,"")}“`,
        erkl:`${a[0].toUpperCase()+a.slice(1)}: <b>${na} ${na===1?"Feld":"Felder"}</b> · ${b}: <b>${nb} ${nb===1?"Feld":"Felder"}</b>. ${na===nb?"Beide haben gleich viele Felder – das Spiel ist <b>fair</b>.":`${na>nb?"Mia":"Ben"} hat mehr Felder und darum die besseren Chancen – das Spiel ist <b>nicht fair</b>.`}`}; },
    d_wuerfel(){ let a, b; do{ a=aus(W_EREIGNIS); b=aus(W_EREIGNIS); }while(a===b);
      const za=[1,2,3,4,5,6].filter(a[1]), zb=[1,2,3,4,5,6].filter(b[1]), gl="Beides ist gleich wahrscheinlich.";
      const ok=za.length===zb.length?gl:za.length>zb.length?`${a[0]}`:`${b[0]}`, liste=z=>z.length?`${z.join(", ")} (${z.length===1?"1 Zahl":z.length+" Zahlen"})`:"keine Zahl – unmöglich";
      return {art:"wahl", frage:`Du würfelst einmal. Was ist <span class="ziel">wahrscheinlicher</span>?`, optionen:[a[0],b[0],gl], ok, spalten:1, tag:"zufall", sollText:`„${ok.replace(/\.$/,"")}“`,
        erkl:`Ein Würfel hat die Zahlen 1 bis 6. „${a[0]}“ passt bei: <b>${liste(za)}</b>. „${b[0]}“ passt bei: <b>${liste(zb)}</b>. ${za.length===zb.length?"Gleich viele – also gleich wahrscheinlich.":"Je mehr Zahlen passen, desto wahrscheinlicher."}`}; },
    d_zweiWuerfel(){ const k=s=>6-Math.abs(7-s); let z; do{ z=mische([2,3,4,5,6,7,8,9,10,11,12]).slice(0,3); }while(z.filter(s=>k(s)===Math.max(...z.map(k))).length>1);
      const ok=z.reduce((x,y)=>k(y)>k(x)?y:x), wege=s=>{ const w=[]; for(let i=1;i<=6;i++){ const j=s-i; if(j>=1&&j<=6) w.push(`${i}+${j}`); } return w; };
      return {art:"wahl", frage:`Du würfelst mit <span class="ziel">zwei Würfeln</span> und zählst zusammen. Welche Summe kommt am <span class="ziel">häufigsten</span> vor?`, optionen:z.map(String).sort((x,y)=>x-y), ok:String(ok), tag:"zufall", sollText:String(ok),
        erkl:z.slice().sort((x,y)=>x-y).map(s=>`<b>${s}</b>: ${wege(s).join(", ")} → ${wege(s).length} ${wege(s).length===1?"Möglichkeit":"Möglichkeiten"}`).join("<br>")+`<br>Die ${ok} kann auf die meisten Arten entstehen. (Erster Würfel + zweiter Würfel – 1+6 und 6+1 sind verschiedene Würfe.)`}; },
    // ===== 24.11.: Knobeln =====
    pk_raetsel(){ return zahlRaetsel(); },
    pk_ziffern(){ const art=aus(["gross","klein","anzahl","anzahl"]);
      if(art==="anzahl"){ const k=aus([3,3,4]), z=mische([1,2,3,4,5,6,7,8,9]).slice(0,k), n=k*(k-1), zeilen=z.map(a=>`${a} vorne: ${z.filter(b=>b!==a).map(b=>""+a+b).join(", ")}`);
        return eingabe(`Du hast die Ziffernkarten <span class="ziel">${z.join("  ")}</span>.<br>Wie viele verschiedene <span class="ziel">zweistellige Zahlen</span> kannst du legen? (Jede Karte nur einmal pro Zahl)`, [F.zahl], n, {tag:"knobel", falle:k, falleArt:"knobel", sollText:String(n),
          bild:kartenBild(z), erkl:`Geh <b>geordnet</b> vor – erst alle mit der ersten Ziffer vorne, dann mit der nächsten:<br>${zeilen.join("<br>")}<br>Das sind ${k} × ${k-1} = <b>${n}</b> Zahlen.`}); }
      const mitNull=art==="klein"&&Math.random()<0.6, z=mische((mitNull?[0]:[]).concat(mische([1,2,3,4,5,6,7,8,9]).slice(0,mitNull?2:3)));
      const s=z.slice().sort((a,b)=>b-a); let wert, erkl;
      if(art==="gross"){ wert=+s.join(""); erkl=`Die größte Ziffer kommt nach vorne zu den Hundertern: ${s.join(", ")} → <b>${wert}</b>.`; }
      else { const a=s.slice().reverse(); if(a[0]===0){ const i=a.findIndex(x=>x>0); [a[0],a[i]]=[a[i],a[0]]; } wert=+a.join("");
        erkl=mitNull?`Die kleinste Ziffer ist 0 – aber vorne darf keine 0 stehen, sonst wäre die Zahl nicht dreistellig. Also kommt die kleinste andere Ziffer nach vorne, dann die 0: <b>${wert}</b>.`:`Die kleinste Ziffer kommt nach vorne: <b>${wert}</b>.`; }
      return eingabe(`Lege mit den Ziffernkarten <span class="ziel">${z.join("  ")}</span> die <span class="ziel">${art==="gross"?"größte":"kleinste"}</span> dreistellige Zahl.`, [F.zahl], wert, {tag:"knobel", sollText:String(wert), bild:kartenBild(z), erkl}); },
    pk_tiere(){ const n=rnd(3,9), k=rnd(1,n-1), L=2*n+2*k;
      const t=[]; for(let x=0;x<=Math.min(n,4);x++) t.push(`<tr><td>${x}</td><td>${n-x}</td><td>${(n-x)*2} + ${x*4} = ${(n-x)*2+x*4}${(n-x)*2+x*4===L?" ✅":""}</td></tr>`);
      if(k>4) t.push(`<tr><td>…</td><td></td><td></td></tr><tr><td>${k}</td><td>${n-k}</td><td>${(n-k)*2} + ${k*4} = ${L} ✅</td></tr>`);
      return eingabe(`Auf dem Bauernhof sind Hühner 🐔 und Kaninchen 🐰.<br>Zusammen haben sie <span class="ziel">${n} Köpfe</span> und <span class="ziel">${L} Beine</span>.<br>Wie viele <span class="ziel">Kaninchen</span> sind es?`, [F.zahl], k, {tag:"knobel", falle:n-k, falleArt:"knobel", sollText:String(k),
        erkl:`Probiere geordnet mit einer Tabelle (Huhn: 2 Beine, Kaninchen: 4 Beine):<table class="knTab"><tr><th>🐰</th><th>🐔</th><th>Beine</th></tr>${t.join("")}</table>Oder geschickt: Wären alle ${n} Tiere Hühner, hätten sie ${2*n} Beine. Es sind ${L - 2*n} Beine mehr. Jedes Kaninchen hat 2 Beine mehr: ${L-2*n} : 2 = <b>${k} Kaninchen</b>.`}); },
    pk_moeglich(){ const art=aus(["muenzen","zerlegen"]);
      if(art==="muenzen"){ const n=rnd(4,10), m=Math.floor(n/2)+1, z=[]; for(let i=0;i*2<=n;i++) z.push(`${i} × 2 € + ${n-2*i} × 1 €`);
        return eingabe(`Du sollst <span class="ziel">${n} €</span> nur mit <span class="ziel">1-€- und 2-€-Münzen</span> legen.<br>Wie viele verschiedene Möglichkeiten gibt es?`, [F.zahl], m, {tag:"knobel", sollText:String(m),
          erkl:`Geh <b>geordnet</b> vor – erst ohne 2-€-Münze, dann mit einer, mit zwei …:<br>${z.join("<br>")}<br>Das sind <b>${m} Möglichkeiten</b>. So vergisst du keine.`}); }
      const n=rnd(6,14), m=Math.floor(n/2), z=[]; for(let a=1;a<=m;a++) z.push(`${a} + ${n-a}`);
      return eingabe(`Zerlege <span class="ziel">${n}</span> in <span class="ziel">zwei Summanden</span> (keine 0, 3 + 5 und 5 + 3 zählen nur einmal).<br>Wie viele Möglichkeiten gibt es?`, [F.zahl], m, {tag:"knobel", sollText:String(m),
        erkl:`Fang beim kleinsten ersten Summanden an und zähle hoch, bis sich die Aufgaben wiederholen würden:<br>${z.join(" · ")}<br>Das sind <b>${m} Möglichkeiten</b>.`}); }
  };
  // ---------- 24.11.: Helfer für Würfelgebäude, Netze, Lage, Zufall, Knobeln ----------
  const wbSumme=h=>h.flat().reduce((a,b)=>a+b,0);
  function bauplanNeu(){ let h; do{ const C=aus([2,3,3]); h=[[],[]]; for(let c=0;c<C;c++){ h[0].push(rnd(1,3)); h[1].push(rnd(0,h[0][c])); } }while(wbSumme(h)<4||wbSumme(h)>11); return h; }
  function bauplanVariante(h){ const g=h.map(r=>r.slice()); const r=rnd(0,1), c=rnd(0,g[0].length-1);
    if(Math.random()<0.4 && g[0].length>1){ g.forEach(x=>x.reverse()); return g; }
    g[r][c]=Math.max(r===0?1:0, Math.min(3, g[r][c]+aus([1,-1]))); if(g[1][c]>g[0][c]) g[1][c]=g[0][c]; return g; }
  function bauplanBild(h, klein){ const s=klein?26:36, C=h[0].length, W=C*s+2, Hh=2*s+(klein?2:30); let t="";
    h.forEach((row,r)=>row.forEach((v,c)=>{ const x=1+c*s, y=1+r*s; t+=`<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${v?"#1e3a8a":"none"}" stroke="#93c5fd" stroke-width="2"${v?"":' stroke-dasharray="3 3"'}/>${v?`<text x="${x+s/2}" y="${y+s/2+(klein?6:8)}" text-anchor="middle" font-size="${klein?17:22}" font-weight="700" fill="#fff">${v}</text>`:""}`; }));
    if(!klein) t+=`<text x="${W/2}" y="${2*s+22}" text-anchor="middle" font-size="12" fill="#94a3b8">↑ hinten · vorne ↓</text>`;
    return `<svg width="${W*(klein?1:1.15)}" height="${Hh*(klein?1:1.15)}" viewBox="0 0 ${W} ${Hh}" role="img" aria-label="Bauplan">${t}</svg>`; }
  function gebaeudeBild(h){ const s=30, d=14, R=h.length, C=h[0].length, base=4+d+3*s+(R-1)*d, W=12+C*s+(R-1)*d+d+4; let t="";
    const st='stroke="#0f172a" stroke-width="1.6" stroke-linejoin="round"';
    for(let r=0;r<R;r++){ const di=R-1-r; for(let c=0;c<C;c++) for(let z=0;z<h[r][c];z++){ const x=6+c*s+di*d, y=base-(z+1)*s-di*d;
      t+=`<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="#60a5fa" ${st}/><polygon points="${x},${y} ${x+d},${y-d} ${x+s+d},${y-d} ${x+s},${y}" fill="#bfdbfe" ${st}/><polygon points="${x+s},${y} ${x+s+d},${y-d} ${x+s+d},${y+s-d} ${x+s},${y+s}" fill="#2563eb" ${st}/>`; } }
    return `<svg width="${W*1.25}" height="${(base+4)*1.25}" viewBox="0 0 ${W} ${base+4}" role="img" aria-label="Würfelgebäude">${t}</svg>`; }
  const NETZ_OK=[[[1,0],[0,1],[1,1],[2,1],[3,1],[1,2]],[[0,0],[0,1],[1,1],[2,1],[3,1],[0,2]],[[0,0],[0,1],[1,1],[2,1],[3,1],[1,2]],[[0,0],[0,1],[1,1],[2,1],[3,1],[2,2]],
    [[0,0],[0,1],[1,1],[2,1],[3,1],[3,2]],[[1,0],[0,1],[1,1],[2,1],[3,1],[2,2]],[[0,0],[1,0],[1,1],[2,1],[3,1],[1,2]],[[0,0],[1,0],[1,1],[2,1],[3,1],[2,2]],[[0,0],[1,0],[1,1],[2,1],[3,1],[3,2]],
    [[0,0],[1,0],[1,1],[2,1],[2,2],[3,2]],[[0,0],[1,0],[2,0],[2,1],[3,1],[4,1]]];
  const NETZ_NEIN=[[[0,0],[1,0],[0,1],[1,1],[2,1],[3,1],"zwei"],[[0,0],[2,0],[0,1],[1,1],[2,1],[3,1],"zwei"],[[1,0],[3,0],[0,1],[1,1],[2,1],[3,1],"zwei"],
    [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],"block"],[[0,0],[0,1],[1,1],[2,1],[3,1],[4,1],"fuenf"],[[2,0],[0,1],[1,1],[2,1],[3,1],[4,1],"fuenf"],[[0,0],[1,0],[2,0],[1,1],[2,1],[3,1],"block"]];
  function netzNeu(){ const geht=Math.random()<0.5, roh=geht?aus(NETZ_OK):aus(NETZ_NEIN); let z=roh.slice(0,6).map(p=>p.slice());
    const dreh=rnd(0,3), spiegel=Math.random()<0.5; for(let i=0;i<dreh;i++) z=z.map(([x,y])=>[y,-x]); if(spiegel) z=z.map(([x,y])=>[-x,y]);
    const mx=Math.min(...z.map(p=>p[0])), my=Math.min(...z.map(p=>p[1])); z=z.map(([x,y])=>[x-mx,y-my]);
    const erkl=geht?"<b>Ja!</b> Falte in Gedanken: Jede der 6 Flächen findet beim Falten einen <b>eigenen Platz</b> – vier rundherum, eine wird der Deckel, eine der Boden. Keine liegt doppelt."
      : roh[6]==="zwei"?"<b>Nein.</b> Die vier Flächen in einer Reihe werden rundherum gefaltet. Die beiden anderen hängen auf <b>derselben Seite</b> – beide wollen Deckel werden, und der Boden fehlt."
      : roh[6]==="block"?"<b>Nein.</b> Hier bilden vier Flächen ein großes Quadrat (2 × 2). Das geht nie: Beim Falten würden zwei Flächen <b>aufeinander liegen</b>."
      : "<b>Nein.</b> Hier liegen <b>fünf</b> Flächen in einer Reihe. Beim Rundherum-Falten landet die fünfte genau auf der ersten.";
    return {geht, z, erkl}; }
  function netzBild(z){ const s=30, W=Math.max(...z.map(p=>p[0]))+1, H=Math.max(...z.map(p=>p[1]))+1;
    return `<svg width="${(W*s+4)*1.2}" height="${(H*s+4)*1.2}" viewBox="0 0 ${W*s+4} ${H*s+4}" role="img" aria-label="Netz aus sechs Quadraten">${z.map(([x,y],i)=>`<rect x="${2+x*s}" y="${2+y*s}" width="${s}" height="${s}" fill="${FORMFARBE[i%6]}" stroke="#0f172a" stroke-width="2"/>`).join("")}</svg>`; }
  const LAGE_DINGE=[["🍎","dem Apfel","der Apfel"],["⚽","dem Ball","der Ball"],["🐱","der Katze","die Katze"],["🚗","dem Auto","das Auto"],["⭐","dem Stern","der Stern"],["🌸","der Blume","die Blume"],
    ["🎁","dem Geschenk","das Geschenk"],["🎈","dem Luftballon","der Luftballon"],["🐟","dem Fisch","der Fisch"],["🍌","der Banane","die Banane"],["🧸","dem Teddy","der Teddy"],["🔑","dem Schlüssel","der Schlüssel"]];
  const LAGE_ART=Object.fromEntries(LAGE_DINGE.map(x=>[x[0], `<span class="ziel">${x[1]} ${x[0]}</span>`])), LAGE_NOM=Object.fromEntries(LAGE_DINGE.map(x=>[x[0], x[2]+" "+x[0]]));
  function lageGitter(){ const d=mische(LAGE_DINGE.map(x=>x[0])).slice(0,9); return [d.slice(0,3),d.slice(3,6),d.slice(6,9)]; }
  function lageBild(g){ return `<div class="lageGitter">${g.flat().map(x=>`<span>${x}</span>`).join("")}</div>`; }
  function radBild(felder){ const n=felder.length, R=46; let t="";
    felder.forEach((f,i)=>{ const a1=(i/n)*2*Math.PI-Math.PI/2, a2=((i+1)/n)*2*Math.PI-Math.PI/2;
      t+=`<path d="M50 52 L${(50+R*Math.cos(a1)).toFixed(2)} ${(52+R*Math.sin(a1)).toFixed(2)} A${R} ${R} 0 0 1 ${(50+R*Math.cos(a2)).toFixed(2)} ${(52+R*Math.sin(a2)).toFixed(2)} Z" fill="${FARBEN[f]}" stroke="#0f172a" stroke-width="1.5"/>`; });
    return `<svg width="170" height="170" viewBox="0 0 100 104" role="img" aria-label="Glücksrad">${t}<circle cx="50" cy="52" r="5" fill="#0f172a"/><polygon points="50,0 44,12 56,12" fill="#f8fafc" stroke="#0f172a" stroke-width="1.5"/></svg>`; }
  const W_EREIGNIS=[["eine 6",z=>z===6],["eine 1",z=>z===1],["eine gerade Zahl",z=>z%2===0],["eine ungerade Zahl",z=>z%2===1],["eine Zahl größer als 4",z=>z>4],
    ["eine Zahl kleiner als 3",z=>z<3],["eine Zahl kleiner als 5",z=>z<5],["eine 7",z=>z===7],["eine Zahl größer als 1",z=>z>1]];
  function kartenBild(z){ return `<div class="zKarten">${z.map(x=>`<span>${x}</span>`).join("")}</div>`; }
  function zahlRaetsel(){
    const HINW=[ t=>{ const a=Math.max(10,Math.floor((t-rnd(1,15))/10)*10); let b=Math.min(99,a+aus([20,30,40])); if(b<=t) b=Math.min(99,Math.floor(t/10)*10+10); return [`Meine Zahl liegt zwischen ${a} und ${b}.`, x=>x>a&&x<b]; },
      t=>[t%2?"Meine Zahl ist ungerade.":"Meine Zahl ist gerade.", x=>x%2===t%2],
      t=>{ const q=Math.floor(t/10)+t%10; return [`Wenn ich die beiden Ziffern zusammenzähle, kommt ${q} heraus.`, x=>Math.floor(x/10)+x%10===q]; },
      t=>{ const z=Math.floor(t/10), e=t%10; return z===e?[`Beide Ziffern sind gleich.`, x=>Math.floor(x/10)===x%10]:[`Die Zehnerziffer ist ${z>e?"größer":"kleiner"} als die Einerziffer.`, x=>z>e?Math.floor(x/10)>x%10:Math.floor(x/10)<x%10]; },
      t=>t%5===0?[`Meine Zahl ist in der Fünferreihe.`, x=>x%5===0]:[`Meine Zahl ist nicht in der Fünferreihe.`, x=>x%5!==0] ];
    for(let v=0; v<200; v++){ const t=rnd(12,98), reihe=[HINW[0]].concat(mische(HINW.slice(1))); let kand=Array.from({length:90},(_,i)=>i+10); const h=[], schritte=[];
      for(const f of reihe){ const [txt,p]=f(t), neu=kand.filter(p); if(neu.length===kand.length) continue; kand=neu; h.push(txt); schritte.push(kand.slice()); if(kand.length===1) break; }
      if(kand.length!==1 || kand[0]!==t || h.length<3 || h.length>4) continue;
      const zeig=k=>k.length>8?k.slice(0,4).join(", ")+" … "+k.slice(-2).join(", ")+` (${k.length} Zahlen)`:k.join(", ");
      return eingabe(`🔎 Zahlenrätsel – welche Zahl ist es?<ul class="knHinw">${h.map(x=>`<li>${x}</li>`).join("")}</ul>`, [F.zahl], t, {tag:"knobel", sollText:String(t),
        erkl:`Streiche Hinweis für Hinweis die Zahlen weg, die nicht passen:<br>${h.map((x,i)=>`<b>${i+1}.</b> ${x} → ${zeig(schritte[i])}`).join("<br>")}<br>Übrig bleibt nur <b>${t}</b>.`}); }
    return eingabe("Welche Zahl ist es? Meine Zahl ist 7 + 8.", [F.zahl], 15, {tag:"knobel", sollText:"15", erkl:"7 + 8 = <b>15</b>"}); }
  // ---------- Punkt 4: Ziehen, Sortieren, Fehler-Detektiv ----------
  function setzeStrahl(z){ const [von,bis,n]=z, s=(bis-von)/n, k=rnd(1,n-1), ziel=von+k*s;
    return {art:"ziehen", zieh:"strahl", von, bis, n, soll:ziel, frage:`Zieh den Pfeil auf die <span class="ziel">${ziel}</span>.`, tag:"strahl", sollText:String(ziel),
      erkl:`<b>1.</b> Von ${von} bis ${bis} sind es ${bis-von}. <b>2.</b> Es sind ${n} Schritte. <b>3.</b> Ein Schritt ist ${bis-von} : ${n} = <b>${s}</b>.<br><b>4.</b> Bis zur ${ziel} sind es (${ziel} − ${von}) : ${s} = <b>${k} Schritte</b> vom Anfang.`}; }
  function sortierAufgabe(frage, boxen, items, erkl){ return {art:"sortieren", frage, boxen, items, tag:"form", sollText:"so wie im Bild", erkl}; }
  function schriftDetektiv(op){
    const FEHLER={ueb:"Die gemerkte Zahl (der Übertrag) wurde vergessen.", kg:"Es wurde „unten minus oben“ gerechnet, weil oben die kleinere Zahl stand.",
      ent:"Nach dem Entbündeln wurde links nicht 1 weniger gerechnet.", mal:"Beim Malnehmen wurde die gemerkte Zahl nicht dazugezählt.", ok:"Es ist alles richtig gerechnet."};
    let a,b,soll,falsch,art,info;
    for(let v=0; v<200; v++){
      if(op==="+"){ a=rnd(150,689); b=rnd(120,309); soll=a+b; const W=String(soll).length, da=ziffern(a,W), db=ziffern(b,W); falsch=+da.map((x,i)=>(x+db[i])%10).join(""); art="ueb"; info=schriftPlus([a,b]); }
      else if(op==="-"){ a=rnd(300,950); b=rnd(105,a-60); soll=a-b; const W=String(a).length, da=ziffern(a,W), db=ziffern(b,W); art=aus(["kg","ent"]);
        if(art==="kg") falsch=+da.map((x,i)=>Math.abs(x-db[i])).join("");
        else { let s=""; for(let i=W-1;i>=0;i--){ s=String(da[i]>=db[i]?da[i]-db[i]:da[i]+10-db[i])+s; } falsch=+s; }
        info=schriftMinus(a,b); }
      else { a=rnd(23,189); b=rnd(3,9); soll=a*b; const d=String(a).split("").map(Number); falsch=+d.map((x,i)=>i===0?String(x*b):String((x*b)%10)).join(""); art="mal"; info=schriftMal(a,b); }
      if(falsch!==soll) break;
    }
    const W=Math.max(String(a).length, String(soll).length, String(falsch).length);
    const bild = op==="*" ? `<div class="frage" style="margin:4px 0">${a} · ${b} = <span style="color:#fca5a5">${falsch}</span></div>`
                          : schriftGitter({breite:W, komma:false, zeilen:[a,b], zeichen:op==="+"?"+":"−", soll:falsch}, true);
    const ok=FEHLER[art], opts=mische([ok].concat(mische(Object.keys(FEHLER).filter(k=>k!==art && (op==="-"||k!=="ent") && (op==="-"||k!=="kg")).map(k=>FEHLER[k])).slice(0,2)));
    return {art:"wahl", frage:`🕵️ Flo hat so gerechnet. Das Ergebnis ist falsch. <b>Was ist schiefgelaufen?</b>`, bild, optionen:opts, ok, spalten:1, tag:op==="+"?"schriftP":op==="-"?"schriftM":"schriftMal",
      sollText:`„${ok.replace(/\.$/,"")}“`, erkl:`Richtig ist <b>${soll}</b>.<br>${(info.schritte||[]).join("<br>")}`};
  }
  function linealSvg(mm){ const X=m=>14+m*2.4; let s=`<rect x="6" y="40" width="304" height="46" rx="5" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>`;
    for(let m=0;m<=120;m++){ const l=m%10===0?16:m%5===0?11:7; s+=`<line x1="${X(m)}" y1="40" x2="${X(m)}" y2="${40+l}" stroke="#1f2937" stroke-width="${m%10===0?1.6:0.9}"/>`;
      if(m%10===0) s+=`<text x="${X(m)}" y="72" text-anchor="middle" font-size="12" font-weight="800" fill="#1f2937">${m/10}</text>`; }
    const e=X(mm); s+=`<rect x="${X(0)}" y="12" width="${Math.max(0,e-X(0)-12)}" height="16" rx="3" fill="#f59e0b"/><path d="M${e-12} 12 L${e} 20 L${e-12} 28 Z" fill="#fde68a"/><path d="M${e-4} 17.3 L${e} 20 L${e-4} 22.7 Z" fill="#1f2937"/><circle cx="${e}" cy="20" r="11" fill="rgba(239,68,68,.18)" stroke="#ef4444" stroke-width="1.5"/>`;
    return s; }
  function strahlZiehSvg(a, v){ const X0=16, X1=304, X=w=>X0+(X1-X0)*(w-a.von)/(a.bis-a.von), s=(a.bis-a.von)/a.n;
    let o=`<line x1="${X0-6}" y1="46" x2="${X1+8}" y2="46" stroke="#e2e8f0" stroke-width="2"/><path d="M${X1+8} 41 L${X1+14} 46 L${X1+8} 51 Z" fill="#e2e8f0"/>`;
    for(let k=0;k<=a.n;k++){ const x=X(a.von+k*s); o+=`<line x1="${x}" y1="38" x2="${x}" y2="54" stroke="#94a3b8" stroke-width="1.4"/>`; }
    o+=`<text x="${X0}" y="74" text-anchor="middle" font-size="13" font-weight="800" fill="#e2e8f0">${a.von}</text><text x="${X1}" y="74" text-anchor="middle" font-size="13" font-weight="800" fill="#e2e8f0">${a.bis}</text>`;
    if(v!==null){ const x=X(v); o+=`<path d="M${x} 34 L${x-7} 18 L${x+7} 18 Z" fill="#ef4444"/><rect x="${x-1.5}" y="18" width="3" height="28" fill="#ef4444"/><circle cx="${x}" cy="12" r="10" fill="rgba(239,68,68,.18)" stroke="#ef4444" stroke-width="1.5"/>`; }
    return o; }
  function saeuleSvg(a, h){ const H=150, oben=12, schritt=H/oben, FARB=["#f87171","#fbbf24","#f472b6","#a78bfa"];
    let s=Array.from({length:oben/2+1},(_,i)=>{ const y=12+H-i*2*schritt; return `<line x1="34" y1="${y}" x2="292" y2="${y}" stroke="#334155"/><text x="28" y="${y+4}" text-anchor="end" font-size="11" fill="#94a3b8">${i*2}</text>`; }).join("");
    a.werte.forEach((w,i)=>{ const wert=i===a.i?h:w, x=48+i*62, hh=wert*schritt;
      s+=`<rect x="${x}" y="${12+H-hh}" width="46" height="${Math.max(hh,0)}" rx="4" fill="${FARB[i]}" ${i===a.i?'stroke="#fde68a" stroke-width="2.5" stroke-dasharray="5 3"':""}/>`+
         `<text x="${x+23}" y="${H+34}" text-anchor="middle" font-size="20">${a.th[i][0]}</text>`+(i===a.i?`<text x="${x+23}" y="${6+H-hh}" text-anchor="middle" font-size="12" font-weight="800" fill="#fde68a">↕</text>`:""); });
    return s; }
  // ---------- Entdecker-Päckchen: Hilfen ----------
  const OPZ={"+":"+","-":"−","*":"·"};
  const pkRechne=(op,a,b)=>op==="+"?a+b:op==="-"?a-b:a*b;
  const PK_MUSTER={ p20:[[1,0],[0,1],[1,1],[1,-1],[2,0],[0,2]], "+":[[10,0],[0,10],[1,0],[0,1],[10,1],[1,-1],[10,-10],[1,1],[10,10],[5,0]],
                    "-":[[10,0],[1,0],[0,1],[0,10],[1,1],[10,10],[-1,0],[-10,0]], "*":[[1,0],[0,1]] };
  // Ein Päckchen mit n Aufgaben: erste Zahl ändert sich um da, zweite um db
  function pkReihe(op, max, n){
    for(let v=0; v<600; v++){
      const [da,db]=aus(PK_MUSTER[op==="+"&&max<=20?"p20":op]);
      const a0 = op==="*" ? rnd(1,10) : rnd(1,max), b0 = op==="*" ? rnd(2,10) : rnd(1,max), rows=[]; let ok=true;
      for(let i=0;i<n;i++){ const a=a0+i*da, b=b0+i*db, r=pkRechne(op,a,b);
        if(a<1||b<1||r<0||r>max||(op==="*"&&(a>10||b>10))||(op==="-"&&r<1)){ ok=false; break; } rows.push([a,b,r]); }
      if(ok) return {op,da,db,rows};
    }
    return {op, da:1, db:0, rows:op==="*"?[[1,3,3],[2,3,6],[3,3,9],[4,3,12],[5,3,15]].slice(0,n):[[1,2,3],[2,2,4],[3,2,5],[4,2,6],[5,2,7]].slice(0,n)};
  }
  const pkZeile=(op,x)=>`${x[0]} ${OPZ[op]} ${x[1]} = ${x[2]}`;
  function pkBild(op, rows, o){ o=o||{};
    return `<div class="pk">${rows.map((x,i)=>`<div class="pkZ${o.mark===i?" mark":""}"><span>${x[0]}</span><span>${OPZ[op]}</span><span>${x[1]}</span><span>=</span><span>${o.leer&&i===rows.length-1?'<b class="pkL">☐</b>':x[2]}</span></div>`).join("")}</div>`; }
  const pkDr=p=>p.rows[1][2]-p.rows[0][2];
  function pkVer(d, wer){ return d>0?`${wer} wird immer um ${d} größer`:d<0?`${wer} wird immer um ${-d} kleiner`:`${wer} bleibt gleich`; }
  function pkSchluss(dr){ return dr>0?`Darum wird das Ergebnis immer um ${dr} größer.`:dr<0?`Darum wird das Ergebnis immer um ${-dr} kleiner.`:`Darum bleibt das Ergebnis immer gleich.`; }
  function pkSatz(p, dr, html){ const vor=`${pkVer(p.da,"Die erste Zahl")}. ${pkVer(p.db, p.op==="-"?"Die Zahl, die man wegnimmt,":"Die zweite Zahl")}.`, schluss=pkSchluss(dr===undefined?pkDr(p):dr);
    return html ? `<span style="display:block;font-size:15.5px;line-height:1.4;font-weight:500">${vor}</span><span style="display:block;font-size:17px;margin-top:4px">${schluss}</span>` : `${vor} ${schluss}`; }
  // Warum? – für Kinder in einem Satz
  function pkWeil(p){ const dr=pkDr(p);
    if(p.op==="*") return p.da ? `Es kommt immer <b>ein ${p.rows[0][1]}er mehr</b> dazu.` : `Es kommt immer noch <b>einmal ${p.rows[0][0]}</b> dazu.`;
    if(p.op==="-" && p.db>0 && p.da===0) return `Wenn ich <b>mehr wegnehme</b>, bleibt <b>weniger übrig</b>.`;
    if(p.op==="-" && p.da===p.db) return `Beide Zahlen werden gleich viel größer – der <b>Abstand</b> zwischen ihnen bleibt gleich.`;
    if(p.op==="+" && dr===0) return `Was die eine Zahl <b>abgibt</b>, bekommt die andere <b>dazu</b> – zusammen bleibt es gleich viel.`;
    return ""; }
  function pkWeiter(op, max){ const p=pkReihe(op,max,5), z=p.rows[4];
    return eingabe("Setze das Päckchen fort. Was kommt heraus?", [F.zahl], z[2], {bild:pkBild(op,p.rows,{leer:true}), tag:"muster", sollText:pkZeile(op,z),
      erkl:`${pkSatz(p)} ${pkWeil(p)}<br>${pkBild(op,p.rows,{mark:4})}`}); }
  function pkNaechste(op, max){ const p=pkReihe(op,max,5), r=p.rows, z=r[4], l=r[3];
    const kand=[[l[0]+p.da,l[1]],[l[0],l[1]+p.db],[l[0]+2*p.da,l[1]+2*p.db],[l[0]+p.db,l[1]+p.da],[l[0]+p.da+1,l[1]+p.db],[l[0]-p.da,l[1]-p.db],[l[0]+p.da,l[1]+p.db+1]]
      .filter(x=>x[0]>=1&&x[1]>=1&&!(x[0]===z[0]&&x[1]===z[1])).map(x=>[x[0],x[1],pkRechne(op,x[0],x[1])]).filter(x=>x[2]>=0);
    const falsch=[...new Map(kand.map(x=>[pkZeile(op,x),x])).keys()].slice(0,2), ok=pkZeile(op,z);
    return {art:"wahl", frage:"Welche Aufgabe kommt als Nächstes?", bild:pkBild(op,r.slice(0,4)), optionen:mische([ok].concat(falsch)), ok, spalten:1, tag:"muster", sollText:ok,
      erkl:`${pkSatz(p)} ${pkWeil(p)}<br>${pkBild(op,r,{mark:4})}`}; }
  function pkWarum(op){ const p=pkReihe(op, 100, 4), dr=pkDr(p);
    // falsche Schlüsse zuerst nach typischen Denkfehlern: „mal: nur um 1 größer", „mehr wegnehmen = mehr Ergebnis", „gegensinnig = größer"
    const schritt=p.da||p.db, falsch=[...new Set([op==="*"?schritt:-dr, schritt, 0, dr*2, -dr, dr+1, 1, -1].map(x=>x+0))].filter(x=>x!==dr).slice(0,2);
    const ok=pkSatz(p,undefined,true), paare=mische([[ok,pkSchluss(dr)]].concat(falsch.map(x=>[pkSatz(p,x,true),pkSchluss(x)])));
    return {art:"wahl", frage:"Was fällt dir auf? Welcher Satz stimmt?", bild:pkBild(op,p.rows), optionen:paare.map(x=>x[0]), optText:paare.map(x=>x[1]), ok, spalten:1, tag:"begruenden",
      sollText:`der grün markierte Satz`, erkl:`${pkSatz(p)} ${pkWeil(p)}<br>Ergebnisse: ${p.rows.map(x=>x[2]).join(" → ")}`}; }
  function pkStoer(op){ const p=pkReihe(op, 100, 5), k=rnd(1,3), r=p.rows.map(x=>x.slice());
    let neu; for(let v=0;v<40;v++){ const wer=rnd(0,1), d=aus([1,-1,2,-2]); neu=r[k].slice(); neu[wer]+=d; neu[2]=pkRechne(op,neu[0],neu[1]);
      if(neu[0]>=1&&neu[1]>=1&&neu[2]>=0&&(op!=="*"||neu[0]<=10&&neu[1]<=10)&&!r.some(x=>x[0]===neu[0]&&x[1]===neu[1])) break; }
    const rows=r.slice(); rows[k]=neu; const ok=pkZeile(op,neu);
    return {art:"wahl", frage:"In diesem Päckchen passt <b>eine Aufgabe</b> nicht ins Muster. Welche?", optionen:rows.map(x=>pkZeile(op,x)), ok, spalten:1, tag:"muster", sollText:`„${ok}“ – sie passt nicht ins Muster`,
      erkl:`Das Muster: ${pkSatz(p).split(". Darum")[0]}.<br>An dieser Stelle würde passen: <b>${pkZeile(op,r[k])}</b>.<br>${pkBild(op,rows,{mark:k})}`}; }
  function pkFehler(op){ const p=pkReihe(op, 100, 5), k=rnd(1,4), rows=p.rows.map(x=>x.slice()), dr=pkDr(p);
    const d=aus([1,-1,10,-10,2]); rows[k][2]=Math.max(0, rows[k][2]+d); if(rows[k][2]===p.rows[k][2]) rows[k][2]+=1;
    const ok=pkZeile(op,rows[k]);
    return {art:"wahl", frage:"🕵️ Ein Kind hat dieses Päckchen gerechnet. <b>Ein Ergebnis</b> ist falsch. Welches?", optionen:rows.map(x=>pkZeile(op,x)), ok, spalten:1, tag:"muster", sollText:`„${ok}“ – hier steckt der Fehler`,
      erkl:`Das Muster hilft beim Kontrollieren: Das Ergebnis ${dr>0?`wird immer um ${dr} größer`:dr<0?`wird immer um ${-dr} kleiner`:"bleibt immer gleich"}: ${p.rows.map(x=>x[2]).join(", ")}.<br>Richtig ist: <b>${pkZeile(op,p.rows[k])}</b>.`}; }
  // Zahlenmauer: drei Steine unten, Summe oben höchstens max
  function zmUnten(max){ let u; do{ u=[rnd(2,30),rnd(2,25),rnd(2,30)]; }while(u[0]+2*u[1]+u[2]>max); return u; }
  function zmWerte(u){ const m=[u[0]+u[1],u[1]+u[2]]; return {u, m, o:m[0]+m[1]}; }
  function zmBild(w, leer){ const s=(k,v)=>leer.includes(k)?`<i class="leer">?</i>`:`<i>${v}</i>`;
    return `<div class="zm"><div>${s("o",w.o)}</div><div>${s("m0",w.m[0])}${s("m1",w.m[1])}</div><div>${s("u0",w.u[0])}${s("u1",w.u[1])}${s("u2",w.u[2])}</div></div>`; }
  // ---------- Stellenwerte: Hilfen ----------
  const ST2=["Z","E"], ST3=["H","Z","E"];
  function stTeile(n){ return {H:Math.floor(n/100), Z:Math.floor(n/10)%10, E:n%10}; }
  function stSatz(n, sp){ const t=stTeile(n), l=[]; if(sp.includes("H")&&t.H) l.push(`<b>${t.H} Hunderter</b>`); if(t.Z) l.push(`<b>${t.Z} Zehner</b>`); if(t.E) l.push(`<b>${t.E} Einer</b>`);
    return l.length>1 ? l.slice(0,-1).join(", ")+" und "+l[l.length-1] : l.join(""); }
  function stLegen(n, sp, frage, o){
    const t=stTeile(n), nullText = sp.includes("H") && (t.Z===0 || t.E===0) ? ` Die <b>0</b> zeigt: An dieser Stelle liegt nichts – aber die Null muss man schreiben.` : "";
    return Object.assign({art:"stellen", frage, soll:n, sp, tag:"stellen", sollText:String(n), erkl:`<b>${n}</b> hat ${stSatz(n,sp)}.${nullText}<br>${Stellen.bild(t,sp)}`}, o||{}); }
  function dreherErkl(n){ const z=Math.floor(n/10)%10, e=n%10;
    return `Wir <b>sprechen</b> zuerst die Einer: <b>${Stellen.zahlwort(e).replace(/^eins$/,"ein")}</b>-und-<b>${Stellen.zahlwort(z*10)}</b>.<br>Wir <b>schreiben</b> aber zuerst die Zehner: <b>${z}</b> Zehner, dann <b>${e}</b> Einer → <b>${n}</b>.`; }
  // Plus/minus am Material: Es liegt schon eine Zahl da, das Kind verändert sie (oft mit Übergang = bündeln oder entbündeln)
  function stPlus(op, sp){
    const d=+op, gross=sp.includes("H"), max=gross?999:99;
    let n, versuch=0;
    do{ versuch++;
      if(d===1)    n = gross ? aus([rnd(1,8)*100+99, rnd(10,98)*10+9, rnd(100,998)]) : aus([rnd(1,8)*10+9, rnd(1,8)*10+9, rnd(11,98)]);
      if(d===-1)   n = gross ? aus([rnd(2,9)*100, rnd(11,99)*10, rnd(101,999)]) : aus([rnd(2,9)*10, rnd(2,9)*10, rnd(12,99)]);
      if(d===10)   n = gross ? aus([rnd(1,8)*100+90+rnd(0,9), rnd(100,889)]) : rnd(10,89);
      if(d===-10)  n = gross ? aus([rnd(2,9)*100+rnd(0,9), rnd(120,999)]) : rnd(20,99);
      if(d===100)  n = rnd(100,899);
      if(d===-100) n = rnd(200,999);
    }while((n+d<1 || n+d>max) && versuch<50);
    const ziel=n+d, t=stTeile(n), w=Math.abs(d), stueck = w===1?"einen Einerwürfel":w===10?"eine Zehnerstange":"eine Hunderterplatte",
          stelle = w===1?"E":w===10?"Z":"H", ueber = d>0 ? stTeile(ziel)[stelle]<t[stelle] || (w===1 && t.E===9) : t[stelle]===0;
    let erkl;
    if(d>0) erkl = `Lege ${stueck} dazu.`+(ueber ? ` Jetzt sind es <b>10 ${w===1?"Einer":w===10?"Zehner":"Hunderter"}</b> – bündle sie: Sie werden zu einem ${w===1?"Zehner":"Hunderter"}.${w===1&&t.Z===9&&gross?" Und wenn es dann 10 Zehner sind, bündelst du noch einmal zu einem Hunderter.":""}` : ` Die anderen Stellen bleiben gleich.`)+` Aus ${n} wird <b>${ziel}</b>.`;
    else erkl = (ueber ? `Es liegt ${w===1?"kein Einerwürfel":w===10?"keine Zehnerstange":"keine Hunderterplatte"} da. <b>Entbündle</b> zuerst: ${w===1?"1 Zehner wird zu 10 Einern":"1 Hunderter wird zu 10 Zehnern"}${w===1&&t.Z===0&&gross?" (und vorher 1 Hunderter zu 10 Zehnern)":""}. Dann nimm ${stueck} weg.` : `Nimm ${stueck} weg. Die anderen Stellen bleiben gleich.`)+` Aus ${n} wird <b>${ziel}</b>.`;
    return {art:"stellen", sp, start:t, frage:`Hier liegt <b>${n}</b>. Mach daraus <span class="ziel">${n} ${d>0?"+":"−"} ${w}</span>.`, soll:ziel, tag:"plusminus", sollText:String(ziel),
      erkl:erkl+`<br>${Stellen.bild(stTeile(ziel),sp)}`}; }
  function euroLaenge(c){ const m=Math.floor(c/100), r=c%100; return m&&r ? `${m} m ${r} cm` : m ? `${m} m` : `${r} cm`; }
  function baueAufgabe(st, typ){ typ=typ||aus(st.typen); UHR_MIN=st.uhr||null; const a=BAU[typ](); a.st=st; a.typ=typ; a.key=`${st.id}|${typ}`; return a; }
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
  function zeichneFortschritt(){ if(runde.blitz){ const f=runde.i-runde.richtig; $("fortschritt").innerHTML=`<span style="font-weight:800;color:#fde68a;font-size:17px">⚡ ${runde.richtig} richtig${f?` <span style="color:#fca5a5">· ${f} falsch</span>`:""}</span>`; return; }
    $("fortschritt").innerHTML=runde.aufgaben.map((a,i)=>`<i class="${runde.verlauf[i]===true?"ok":runde.verlauf[i]===false?"nein":""}"></i>`).join(""); }
  function starte(st, modus, typen){
    lauf++;
    if(WAS==="blitz") BL = modus==="mine" ? 2 : stufeWahl(st.id);
    const blitz = WAS==="blitz" && modus==="Test";
    runde={st, modus, aufgaben:blitz ? blitzAufgaben(st) : baueRunde(st, typen), i:0, richtig:0, gestellt:[], fehler:[], antworten:[], verlauf:[], start:Date.now(), fehlerTexte:[], blitz, lv:BL, ziel:WAS==="blitz"?zielFuer(st,BL):0, sofort:0};
    $("spielTitel").textContent=(blitz?"⚡ Blitz":modus==="Test"?"Test":modus==="mine"?"Meine Aufgaben":"Üben")+" · "+st.name+(WAS==="blitz" && modus!=="mine" ? " · "+LVN[BL] : "");
    zeige("spiel"); if(blitz) starteBlitz(); naechste();
  }
  // Blitz: genug Aufgaben für eine Minute (niemand schafft 80), nie zweimal dieselbe hintereinander
  function blitzAufgaben(st){ const l=[], k=a=>a.frage+"|"+(a.bild||""); let versuche=0;      // Bilder-Aufgaben haben denselben Fragetext – deshalb mit Bild vergleichen
    while(l.length<80 && versuche++<2000){ const a=baueAufgabe(st); if(!l.length || k(l[l.length-1])!==k(a) || versuche>1500) l.push(a); } return l; }
  let blitzUhr=null;
  function starteBlitz(){
    const meiner=lauf, ende=Date.now()+BLITZ_SEK*1000;
    $("zeitbalken").classList.remove("hide"); $("zeitfuell").style.width="100%";
    clearInterval(blitzUhr);
    blitzUhr=setInterval(()=>{
      if(meiner!==lauf || !runde || !runde.blitz){ clearInterval(blitzUhr); return; }
      const rest=Math.max(0, ende-Date.now()); $("zeitfuell").style.width=(rest/(BLITZ_SEK*10))+"%";
      if(rest<=0){ clearInterval(blitzUhr); lauf++; runde.aufgaben=runde.aufgaben.slice(0, runde.i); runde.gestellt=runde.gestellt.slice(0, runde.i); fertig(); }      // die letzte, nicht mehr beantwortete Aufgabe zählt nicht
    }, 200);
  }
  function naechste(){
    if(runde.i>=runde.aufgaben.length){ fertig(); return; }
    wartet=false;
    const a=runde.aufgaben[runde.i];
    runde.gestellt.push(a.key);
    $("rueck").textContent=""; $("erkl").innerHTML="";
    const luecke = WAS==="blitz" && a.art==="eingabe" && a.felder.length===1;
    $("frage").innerHTML = luecke ? mitLuecke(a) : a.frage;
    $("buehne").classList.toggle("mitLuecke", luecke);
    zeichneFortschritt();
    const bild = a.bild ? `<div class="bild${a.lineal?" lineal":""}">${a.bild}</div>` : "";
    if(a.art==="eingabe"){
      $("buehne").innerHTML=bild+`<div class="eingabe">${a.felder.map((f,i)=>`<input type="text" id="feld${i}" inputmode="numeric" autocomplete="off" maxlength="${f.max||5}"${f.max?' style="width:190px"':""} placeholder="?"><span>${f.e}</span>`).join("")}<button id="okBtn">OK</button></div>`;
      const felder=a.felder.map((f,i)=>$("feld"+i));
      if(luecke){ const l=$("luecke"), zeig=()=>{ l.textContent = felder[0].value ? felder[0].value : "\u00a0"; l.classList.remove("ok","nein","nochmal"); };
        felder[0].addEventListener("input", zeig); l.addEventListener("click", ()=>{ try{ felder[0].focus({preventScroll:true}); }catch(e){} }); }
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
    }else if(a.art==="ziehen"){
      // Ziehen: Pfeil am Zahlenstrahl, Stift am Lineal, Säule im Diagramm
      let v = a.zieh==="lineal" ? 10 : a.zieh==="strahl" ? null : 0;
      const VB = a.zieh==="saeule" ? [300,200] : a.zieh==="lineal" ? [316,92] : [320,84];
      const zeichne=()=>{ $("ziehSvg").innerHTML = a.zieh==="lineal" ? linealSvg(v) : a.zieh==="strahl" ? strahlZiehSvg(a, v) : saeuleSvg(a, v); };
      $("buehne").innerHTML=(a.zieh==="saeule"?`<div class="bild">${a.th[a.i][0]} ${a.th[a.i][1]}: ${strichSvg(a.soll)}</div>`:"")+
        `<svg class="entSvg" id="ziehSvg" viewBox="0 0 ${VB[0]} ${VB[1]}" role="img" aria-label="zum Ziehen" style="margin-top:8px"></svg>
        <div class="stTipp">${a.zieh==="saeule"?"Zieh die gestrichelte Säule nach oben oder unten.":a.zieh==="lineal"?"Zieh die Spitze des Stifts.":"Tippe auf den Zahlenstrahl oder zieh den Pfeil."}</div>
        <div class="reihe"><button id="okBtn">Fertig ✓</button></div>`;
      const svg=$("ziehSvg"); zeichne();
      if(a.zieh==="saeule"){
        const y=ev=>{ const r=svg.getBoundingClientRect(); return (ev.clientY-r.top)/r.height*VB[1]; };
        const setz=ev=>{ const w=Math.max(0,Math.min(12,Math.round((162-y(ev))/(150/12)))); if(w!==v){ v=w; zeichne(); } };
        svg.addEventListener("pointerdown", ev=>{ if(wartet) return; ev.preventDefault(); try{ svg.setPointerCapture(ev.pointerId); }catch(e){} setz(ev);
          const mv=e2=>setz(e2), up=()=>{ svg.removeEventListener("pointermove",mv); svg.removeEventListener("pointerup",up); svg.removeEventListener("pointercancel",up); };
          svg.addEventListener("pointermove",mv); svg.addEventListener("pointerup",up); svg.addEventListener("pointercancel",up); });
      } else ziehSvg(svg, VB[0], x=>{ if(wartet) return;
        if(a.zieh==="lineal"){ let m=Math.round((x-14)/2.4); m=Math.max(1,Math.min(120,m)); if(a.raster===10) m=Math.max(10,Math.round(m/10)*10); if(m!==v){ v=m; zeichne(); } }
        else { const s=(a.bis-a.von)/a.n, k=Math.max(0,Math.min(a.n,Math.round((x-16)/(288)*a.n))), w=a.von+k*s; if(w!==v){ v=w; zeichne(); } } });
      $("okBtn").addEventListener("click",()=>{ if(wartet || v===null) return; $("okBtn").disabled=true;
        const text = a.zieh==="lineal" ? (v%10?`${Math.floor(v/10)} cm ${v%10} mm`:`${v/10} cm`) : String(v);
        if(v!==a.soll){ if(a.zieh==="lineal") a.zusatz2=` Dein Stift ist ${text} lang.`; else if(a.zieh==="strahl") a.zusatz2=` Dein Pfeil steht bei ${v}.`; else a.zusatz2=` Deine Säule geht bis ${v}.`; }
        auswerten(a, v===a.soll, text, v, false); });
    }else if(a.art==="sortieren"){
      // Sortieren: Karten in zwei Kästen ziehen (oder antippen und dann den Kasten antippen)
      const ort=a.items.map(()=>-1); let gewaehlt=null;
      const karte=(it,i,kl)=>`<button class="soK${gewaehlt===i?" an":""}${kl||""}" data-k="${i}" aria-label="${it[0]}"><span class="soB">${it[1].replace(/width="\d+" height="\d+"/,'width="56" height="56"')}</span><span>${it[0]}</span></button>`;
      const mal=(pruef)=>{
        $("buehne").innerHTML=`<div class="soPool" data-box="-1">${a.items.map((it,i)=>ort[i]===-1?karte(it,i):"").join("")||'<span class="stTipp">Alles einsortiert.</span>'}</div>
          <div class="soBoxen">${a.boxen.map((b,j)=>`<div class="soBox" data-box="${j}"><div class="soT">${b}</div><div class="soIn">${a.items.map((it,i)=>ort[i]===j?karte(it,i,pruef?(it[2]===j?" gut":" falsch"):""):"").join("")}</div></div>`).join("")}</div>
          <div class="stTipp">Zieh jede Karte in den richtigen Kasten – oder tippe erst die Karte und dann den Kasten an.</div>
          <div class="reihe"><button id="okBtn"${ort.includes(-1)||pruef?" disabled":""}>Fertig ✓</button></div>`;
        if(pruef) return;
        $("buehne").querySelectorAll("[data-k]").forEach(k=>{ const i=+k.dataset.k;
          k.addEventListener("pointerdown", ev=>{ if(wartet) return; ev.preventDefault(); const sx=ev.clientX, sy=ev.clientY; let geist=null;
            const mv=e=>{ if(!geist && Math.hypot(e.clientX-sx,e.clientY-sy)>8){ geist=k.cloneNode(true); geist.className="soK soGeist"; document.body.appendChild(geist); } if(geist){ geist.style.left=e.clientX+"px"; geist.style.top=e.clientY+"px"; } };
            const up=e=>{ document.removeEventListener("pointermove",mv); document.removeEventListener("pointerup",up);
              if(geist){ geist.remove(); const t=document.elementFromPoint(e.clientX,e.clientY), box=t&&t.closest?t.closest("[data-box]"):null; if(box){ ort[i]=+box.dataset.box; gewaehlt=null; mal(); } }
              else { gewaehlt = gewaehlt===i ? null : i; mal(); } };
            document.addEventListener("pointermove",mv); document.addEventListener("pointerup",up); }); });
        $("buehne").querySelectorAll("[data-box]").forEach(b=>b.addEventListener("click",ev=>{ if(gewaehlt===null || ev.target.closest("[data-k]")) return; ort[gewaehlt]=+b.dataset.box; gewaehlt=null; mal(); }));
        $("okBtn").addEventListener("click",()=>{ if(wartet || ort.includes(-1)) return; const falsch=a.items.filter((it,i)=>ort[i]!==it[2]).map(it=>it[0]);
          mal(true); if(falsch.length) a.zusatz2=` Nicht richtig: ${[...new Set(falsch)].join(", ")}.`; auswerten(a, !falsch.length, falsch.length?`falsch: ${falsch.join(", ")}`:"alles richtig", null, false); });
      };
      mal();
    }else if(a.art==="stellen"){
      // Zahl mit Material legen: Hunderterplatten, Zehnerstangen, Einerwürfel. Die Stellentafel erscheint erst nach „Fertig" – sonst legt man nur, bis die Zahl passt.
      $("buehne").innerHTML=`<div id="stHier"></div><div class="reihe"><button class="ghost klein" id="leerBtn">${a.start?"Von vorn":"Alles zurück"}</button><button id="okBtn">Fertig ✓</button></div>`;
      const br=Stellen.brett($("stHier"), {spalten:a.sp, start:a.start, live:false});
      $("leerBtn").addEventListener("click",()=>{ if(!wartet) br.setze(a.start||{}); });
      $("okBtn").addEventListener("click",()=>{
        if(wartet) return;
        const s=br.stand, w=br.wert(); if(!w && !a.start) return;
        const nurOk=!a.nur || Object.keys(a.nur).every(k=>s[k]===a.nur[k]), ok=w===a.soll && nurOk;
        a.zusatz=""; a.artFehler=""; a.okText="";
        if(ok && !Stellen.gebuendelt(s)) a.okText=`Richtig, das ist ${w}! In der Stellentafel steht an jeder Stelle nur eine Ziffer – so sieht es gebündelt aus: ${Stellen.kurz(stTeile(w),a.sp)}.`;
        if(!ok){
          const dreh = w>9 && w<100 ? (w%10)*10+Math.floor(w/10) : null;
          if(w===a.soll && !nurOk){ const k=Object.keys(a.nur)[0]; a.zusatz=` Die Zahl stimmt – aber du solltest genau <b>${a.nur[k]} ${k==="Z"?"Zehnerstangen":"Hunderterplatten"}</b> nehmen, nicht ${s[k]}.`; a.artFehler="buendeln"; }
          else{ a.zusatz=` Du hast ${Stellen.kurz(s,a.sp)} gelegt – das ist <b>${w}</b>.`;
            if(a.soll<100 && dreh===a.soll && dreh!==w) a.artFehler="dreher";
            else if(a.falle && w===a.falle) a.artFehler=a.falleArt; }
        }
        br.sperren(); br.zeigeSync(); $("okBtn").disabled=true; $("leerBtn").disabled=true;
        auswerten(a, ok, `${Stellen.kurz(s,a.sp)} = ${w}`, w, false);
      });
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
    if(a.blick) blickZudecken(a);
    starteZeit();
  }
  // „Auf einen Blick“: Das Bild ist 2 Sekunden zu sehen, dann wird es zugedeckt – das trainiert das schnelle Erfassen.
  // Im Üben darf man es noch einmal ansehen, im Blitz nicht. Nach der Antwort ist es wieder zu sehen.
  function blickZudecken(a){
    const meinI=runde.i, meinL=lauf;
    setTimeout(()=>{
      if(lauf!==meinL || !runde || runde.i!==meinI || wartet) return;
      const b=document.querySelector("#buehne .bild"); if(!b) return;
      b.classList.add("weg");
      b.insertAdjacentHTML("beforeend", `<div class="blickDeckel">👀 Wie viele waren es?${runde.modus==="Training"?'<button type="button" class="ghost klein" id="nochmalZeigen">Noch einmal zeigen</button>':""}</div>`);
      const n=$("nochmalZeigen"); if(n) n.addEventListener("click", ()=>{ b.classList.remove("weg"); const d=b.querySelector(".blickDeckel"); if(d) d.remove(); blickZudecken(a); });
      try{ const f=$("feld0"); if(f && !f.disabled) f.focus({preventScroll:true}); }catch(e){}
    }, a.blickMs||2000);
  }
  function auswerten(a, ok, gegebenText, summe, nichtGetauscht){
    stoppZeit(); wartet=true;
    const zu=document.querySelector("#buehne .bild.weg"); if(zu){ zu.classList.remove("weg"); const d=zu.querySelector(".blickDeckel"); if(d) d.remove(); }
    const lk=$("luecke");
    // Blitzrechnen üben: Beim ersten Fehler darf man es noch einmal probieren – erst beim zweiten kommt die Erklärung
    if(!ok && WAS==="blitz" && runde.modus==="Training" && a.art==="eingabe" && !a.zweiter){
      a.zweiter=true; wartet=false;
      if(lk){ lk.classList.remove("nochmal"); void lk.offsetWidth; lk.classList.add("nochmal"); lk.textContent="\u00a0"; }
      $("buehne").querySelectorAll("input").forEach(x=>{ x.disabled=false; x.value=""; });
      if($("okBtn")) $("okBtn").disabled=false;
      $("rueck").style.color="#fb923c"; $("rueck").textContent="Fast! Probier es noch einmal.";
      try{ $("feld0").focus({preventScroll:true}); }catch(e){}
      return;
    }
    if(lk){ lk.classList.add(ok?"ok":"nein"); if(!ok) lk.textContent=a.sollText; }
    runde.verlauf[runde.i]=ok; zeichneFortschritt(); runde.i++;
    const r=$("rueck");
    if(ok){
      runde.richtig++; r.style.color="var(--good)";
      if(a.zweiter) runde.fehler.push(a.key); else runde.sofort++;      // im zweiten Versuch richtig: zählt, kommt aber zum Wiederholen
      r.textContent = nichtGetauscht ? `Richtig! Man schreibt es so: ${a.sollText}` : a.okText || "Richtig! 👍";
      wartet=false; spaeter(runde.blitz?220:nichtGetauscht?2200:a.okText?3200:a.art==="stellen"?1600:950); return;
    }
    runde.fehler.push(a.key); runde.fehlerTexte.push(a.sollText);
    // Denkfehler erkennen: Umrechnungszahl verwechselt (10 statt 100) oder beim Lineal das Ende abgelesen
    let art="groesse_"+a.tag, zusatz="";
    if(summe!==null && a.tag==="umrechnen" && (summe===a.soll*10 || summe*10===a.soll)){ art="groesse_faktor"; }
    if(a.falle && summe===a.falle){ art="groesse_"+(a.falleArt||"ablesen"); }
    if(a.streng && summe===a.soll && !nichtGetauscht===false) zusatz="";
    if(a.art==="legen" && summe!==null) zusatz=` Du hast ${komma(summe)} gelegt – das ist ${summe>a.soll?"zu viel":"zu wenig"}.`;
    if(a.art==="stellen"){ zusatz=a.zusatz||""; if(a.artFehler) art="groesse_"+a.artFehler; }
    if(a.zusatz2) zusatz=a.zusatz2;
    if(a.zweiFalsch){ zusatz=`<br><b>Achtung:</b> Hinter dem Komma stehen immer <b>zwei</b> Ziffern – 5 ct schreibt man als „05“, 50 ct als „50“.`; art="groesse_komma"; }
    runde.antworten.push(`${a.typ.slice(2)}|${a.sollText}|${gegebenText}|${art}`);
    r.style.color="var(--bad)"; r.textContent=`Das stimmt noch nicht. Richtig ist ${a.sollText}.`;
    if(runde.modus==="Test"){ wartet=false; spaeter(runde.blitz?1300:1700); return; }
    $("erkl").innerHTML=`<div class="erkl"><div class="t">💡 So geht es</div>${a.erkl}${zusatz}<div class="reihe"><button id="weiterBtn">Weiter ▶</button></div></div>`;
    $("weiterBtn").addEventListener("click",()=>{ wartet=false; naechste(); });
    setTimeout(()=>{ try{ $("weiterBtn").focus({preventScroll:true}); $("erkl").scrollIntoView({block:"nearest",behavior:"smooth"}); }catch(e){} }, 300);
  }
  function starteZeit(){
    if(runde && runde.blitz) return;      // im Blitz läuft eine Uhr für die ganze Minute
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
    const n=runde.aufgaben.length, proz=n?Math.round(runde.richtig/n*100):0, test=runde.modus==="Test", blitz=!!runde.blitz,
          bestanden=test && (blitz ? runde.richtig>=runde.ziel && n-runde.richtig<=2 : proz>=BESTANDEN), alterRekord=blitz?rekord(runde.st.id, runde.lv):0;
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
      for(let i=0;i<nTiere;i++){ const id=Zoo.ziehe(besitz, nurHaeufig?0:bonus, i===0 && runde.richtig===n ? 2 : 0, nurHaeufig ? 1 : 0, runde.st.zooF); tiere.push(id); besitz[id]=(besitz[id]||0)+1; }
      runde.tiere=tiere;
      $("ergTitel").textContent = tiere.length ? (tiere.length===1?"🎉 Ein neues Tier zieht ein!":"🎉 Zwei neue Tiere ziehen ein!") : "💪 Diesmal noch kein Tier";
      $("ergText").innerHTML=`<b>${runde.richtig}</b> von <b>${n}</b> Aufgaben richtig.`+(tiere.length ? Zoo.neuHTML(tiere) : "<br>Ab <b>5 richtigen</b> Aufgaben zieht ein Tier in deinen Zoo ein. Gleich noch einmal?")+(tiere.length && nurHaeufig ? "<div>Mit <b>7 oder mehr</b> richtigen Aufgaben kann es beim nächsten Mal auch ein seltenes Tier sein.</div>" : "")+
        ((runde.st.zooF||1)<1.5 && runde.richtig*10>=n*9 ? `<div>🍀 <b>Tipp:</b> Das war leicht für dich! In den schwereren Runden ziehen viel öfter seltene ⭐ und legendäre 🌟 Tiere ein.</div>` : "")+
        (schwerGut ? `<div>💪 Du hast ${schwerGut===1?"eine Aufgabe":schwerGut+" Aufgaben"} gelöst, die dir früher schwerfiel${schwerGut===1?"":"en"} – das macht seltene Tiere wahrscheinlicher.</div>` : "")+
        `<div style="margin-top:8px;font-size:13px">5 oder 6 richtige: ein häufiges Tier · 7 bis 9: ein Tier, vielleicht ein seltenes ⭐ · 10 von 10: <b>zwei</b> Tiere, eines davon selten.</div>`;
    }
    if(blitz){
      const f=n-runde.richtig, neu=runde.richtig>alterRekord && alterRekord>0, fl=[...new Set(runde.aufgaben.filter((a,i)=>runde.verlauf[i]===false).map(a=>{ const s=a.frage.split("<br>").pop().replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim(); return s.includes("☐") ? s.replace("☐", a.sollText) : s+" = "+a.sollText; }))];
      $("ergProzent").textContent="⚡ "+runde.richtig;
      $("ergTitel").textContent = bestanden ? (neu?"✅ Blitz-Ziel geschafft – neuer Rekord!":"✅ Blitz-Ziel geschafft!") : neu ? "🎉 Neuer Rekord!" : "💪 Gut gekämpft!";
      $("ergText").innerHTML=`<b>${runde.richtig}</b> richtig in einer Minute${f?` · ${f} falsch`:" – ohne Fehler"}.<br>`+
        (neu ? `Dein alter Rekord war ${alterRekord}.` : alterRekord ? `Dein Rekord: <b>${Math.max(alterRekord, runde.richtig)}</b>.` : `Das ist dein erster Blitz bei dieser Übung.`)+
        `<br>Blitz-Ziel (${LVN[runde.lv]}): <b>${runde.ziel} richtig</b> und höchstens <b>2 Fehler</b>.${bestanden?"":" Morgen wieder – jeden Tag wird es schneller!"}`+
        (fl.length?`<br><br><b>Das üben wir noch:</b> ${fl.slice(0,8).map(esc).join(" · ")}`:"");
    }
    if(WAS==="blitz" && !test && runde.modus!=="mine"){
      const st=sterneVon(runde.sofort, n), vorher=sterneLv(runde.st.id, runde.lv);
      $("ergProzent").innerHTML=`<span style="color:#fbbf24;letter-spacing:4px">${"★".repeat(st)}<span style="color:#475569">${"★".repeat(3-st)}</span></span>`;
      $("ergText").innerHTML=`<b>${runde.sofort}</b> von <b>${n}</b> beim ersten Versuch richtig – ${esc(runde.st.name)}, Stufe <b>${LVN[runde.lv]}</b>.`+
        (st===3 ? (runde.lv<3 ? `<br>🎉 Drei Sterne! Probier jetzt die Stufe <b>${LVN[runde.lv+1]}</b>.` : `<br>🎉 Drei Sterne auf der Profi-Stufe – stark!`) : `<br>Für drei Sterne: alle beim ersten Versuch richtig.`)+
        (st>vorher ? `<br>⭐ Neue Bestleistung auf dieser Stufe!` : "")+
        ([...new Set(runde.fehlerTexte)].length ? `<br><br><b>Das üben wir noch:</b> ${[...new Set(runde.fehlerTexte)].slice(0,8).map(esc).join(" · ")}` : "");
      if(st===3 && runde.lv<3) BL_WAHL[runde.st.id]=runde.lv+1;
    }
    letzte=runde;
    $("nochmalBtn").onclick=()=>starte(letzte.st, letzte.modus==="mine"?"Training":letzte.modus);
    speichere(proz, bestanden);
    if(bestanden || (!test && proz>=90)) konfetti();
  }
  function speichere(proz, bestanden){
    const d=new Date(), p=x=>String(x).padStart(2,"0"), r=runde, mine=r.modus==="mine";
    const eintrag={ key:KEY, app:APP, name:playerName, datum:`${p(d.getDate())}.${p(d.getMonth()+1)}.${d.getFullYear()}`, zeit:`${p(d.getHours())}:${p(d.getMinutes())}`,
      modus:r.modus==="Test"?"Test":"Training", reihe:mine?"mine":"s"+r.st.id, zr:r.st.id, stufe:r.modus==="Test"?(WAS==="blitz"?["Leicht","Mittel","Schwer"][r.lv-1]:"Mittel"):(mine?"eigene Fehler":r.st.name), stufeName:mine?"Meine Aufgaben":r.st.name,
      richtig:r.richtig, falsch:r.aufgaben.length-r.richtig, prozent:proz, bestanden:r.modus==="Test"?(bestanden?"Ja":"Nein"):"–", dauer:Math.round((Date.now()-r.start)/1000),
      gestellt:r.gestellt.slice(), fehler:r.fehler.slice(), antworten:r.antworten.slice() };
    if(r.tiere) eintrag.tiere=r.tiere.slice();           // Mein Zoo: die in dieser Runde gewonnenen Tiere
    if(WAS==="blitz" && !mine){ eintrag.lv=r.lv; eintrag.sofort=r.sofort; eintrag.stufeName=`${r.st.name} · ${LVN[r.lv]}`; }
    if(r.blitz){ eintrag.blitz=BLITZ_SEK; eintrag.stufeName=`${r.st.name} · ${LVN[r.lv]} · ⚡ ${r.richtig} richtig in 1 Minute`; }
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
  function rekord(id, lv){ return MEINE.filter(e=>+e.zr===id && e.modus==="Test" && e.reihe!=="mine" && (!lv || (+e.lv||2)===lv)).reduce((m,e)=>Math.max(m,+e.richtig||0),0); }
  // Sterne einer Stufe: bestes Üben – 100 % beim ersten Versuch = 3, ab 80 % = 2, ab 60 % = 1
  function sterneVon(sofort, n){ const p=n?sofort/n:0; return p>=1?3:p>=0.8?2:p>=0.6?1:0; }
  function sterneLv(id, lv){ return MEINE.filter(e=>+e.zr===id && e.modus==="Training" && e.reihe!=="mine" && (+e.lv||2)===lv)
      .reduce((m,e)=>Math.max(m, sterneVon(e.sofort!=null ? +e.sofort : +e.richtig||0, (+e.richtig||0)+(+e.falsch||0))),0); }
  function stufeWahl(id){ if(BL_WAHL[id]) return BL_WAHL[id]; for(let l=1;l<=3;l++) if(sterneLv(id,l)<3) return l; return 3; }
  function lvKnoepfe(s){ const w=stufeWahl(s.id);
    return `<span class="lvW">${[1,2,3].map(l=>{ const n=sterneLv(s.id,l); return `<button type="button" class="lvC${l===w?" an":""}" data-lvst="${s.id}" data-lv="${l}" title="${LVN[l]}">${LVN[l]} <i>${"★".repeat(n)}${"☆".repeat(3-n)}</i></button>`; }).join("")}</span>`; }
  function meineTypen(){
    const facts=new Set(); MEINE.forEach(e=>(e.fehler||[]).forEach(f=>facts.add(f)));
    const offen=[], faellig=[];
    facts.forEach(k=>{ const s=Wdh.status(MEINE,k); if(s.offen) offen.push(k); else if(s.faellig) faellig.push(k); });
    return {offen, faellig};
  }
  // ---------- 🔎 Entdecken: freies Ausprobieren vor dem Üben (Aufbau von Grundvorstellungen) – ohne Bewertung, mit Vorlesen ----------
  function sprich(text){
    try{ if(!("speechSynthesis" in window)) return; speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(String(text).replace(/<[^>]+>/g,"").replace(/­/g,"")); u.lang="de-DE"; u.rate=0.9;
      const v=(window.Komfort && Komfort.stimme) ? Komfort.stimme() : null; if(v) u.voice=v; speechSynthesis.speak(u); }catch(e){}
  }
  const ohneTags=s=>String(s).replace(/<[^>]+>/g,"");
  const ENTDECKEN={
    stellen:{text:"Lege, bündle und entbündle, wie du willst – die Zahl wächst mit. Hier gibt es keine Fehler.", baue:entdeckeStellen},
    geo:{text:"Tippe eine Form oder einen Körper an: Du hörst, wie sie heißt, und kannst Ecken und Seiten zählen lassen.", baue:entdeckeFormen},
    geld:{text:"Tippe Münzen und Scheine an – sie kommen in deinen Geldbeutel. Wie viel ist es zusammen? Du kannst auch wechseln.", baue:entdeckeGeld},
    laengen:{text:"Zieh den Stift am Lineal länger oder kürzer – du siehst sofort, wie lang er ist: in Zentimetern und Millimetern.", baue:entdeckeLaengen},
    strahl:{text:"Schieb den roten Pfeil über den Zahlenstrahl – du siehst die Zahl, ihre Nachbarn und die Nachbarzehner.", baue:entdeckeStrahl},
    zahlen:{text:"Schieb den roten Pfeil über den Zahlenstrahl – du siehst die Zahl, ihre Nachbarn und die Nachbarzehner.", baue:entdeckeStrahl},
    daten:{text:"Mach eine Strichliste: Mit jedem Strich wächst die Säule im Diagramm mit.", baue:entdeckeDaten},
    gewichte:{text:"Leg einen Gegenstand auf die Waage und such passende Gewichtsstücke – bis die Waage gerade steht.", baue:entdeckeWaage},
    schrift:{text:"Schau zu, wie man untereinander rechnet – Schritt für Schritt, Stelle für Stelle. Plus, Minus und Mal.", baue:entdeckeSchrift},
    kalender:{text:"Blättere durch die Monate und tippe einen Tag an – du hörst, welcher Wochentag es ist.", baue:entdeckeKalender}
  };
  function entdeckenKarte(){
    if(!ENTDECKEN[WAS] || $("entdeckenBtn")) return;
    $("zooFeld").innerHTML=`<div class="stufe" style="border-color:#fde68a"><span class="nr">🔎</span><span class="tx"><b>Entdecken</b><span>${ENTDECKEN[WAS].text}</span></span>
      <span class="kn"><button class="klein" id="entdeckenBtn">Ausprobieren</button></span></div><div id="entdecken" class="hide" style="margin-bottom:14px"></div>`;
    $("entdeckenBtn").addEventListener("click",()=>{ const e=$("entdecken"), zu=!e.classList.contains("hide");
      e.classList.toggle("hide", zu); $("entdeckenBtn").textContent=zu?"Ausprobieren":"Schließen";
      if(zu) try{ speechSynthesis.cancel(); }catch(x){}
      if(!zu && !e.dataset.an){ e.dataset.an="1"; ENTDECKEN[WAS].baue(e); } });
  }
  function entdeckeStellen(e){
    if(!window.Stellen) return;
    let kl=0; try{ kl=+(localStorage.getItem("mathe_klasse")||0); }catch(x){}
    const baue=bis=>{
      e.innerHTML=`<div class="reihe" style="margin:4px 0 10px">${[100,1000].map(b=>`<button class="klein${b===bis?"":" ghost"}" data-bis="${b}">bis ${b}</button>`).join("")}<button class="ghost klein" id="entLeer">Alles weg</button></div><div id="entBrett"></div>`;
      const br=Stellen.brett($("entBrett"), {spalten:bis===100?ST2:ST3, live:true});
      e.querySelectorAll("[data-bis]").forEach(b=>b.addEventListener("click",()=>baue(+b.dataset.bis)));
      $("entLeer").addEventListener("click",()=>br.setze({})); };
    baue(kl && kl<=2 ? 100 : 1000);
  }
  // ----- Formen und Körper -----
  const eckP=(n,r,dreh)=>Array.from({length:n},(_,i)=>{ const w=(dreh===undefined?-90:dreh)*Math.PI/180+i*2*Math.PI/n; return [+(50+r*Math.cos(w)).toFixed(1), +(50+r*Math.sin(w)).toFixed(1)]; });
  const FORM_E={ Kreis:{art:"der", farbe:"#60a5fa"}, Dreieck:{art:"das", farbe:"#f472b6", p:[[50,10],[90,86],[10,86]]}, Quadrat:{art:"das", farbe:"#34d399", p:[[16,16],[84,16],[84,84],[16,84]]},
    Rechteck:{art:"das", farbe:"#fbbf24", p:[[6,26],[94,26],[94,74],[6,74]]}, "Fünfeck":{art:"das", farbe:"#a78bfa", p:eckP(5,42)}, Sechseck:{art:"das", farbe:"#fb923c", p:eckP(6,42,0)} };
  const KOERPER_E={ "Würfel":{art:"der", ecken:[[20,34],[68,34],[68,82],[20,82],[36,18],[84,18],[84,66]], versteckt:[36,66], alltag:"🎲 Spielwürfel · Zuckerwürfel"},
    "Quader":{art:"der", ecken:[[6,44],[76,44],[76,80],[6,80],[22,28],[92,28],[92,64]], versteckt:[22,64], alltag:"📦 Schuhkarton · 🧱 Ziegelstein"},
    "Kugel":{art:"die", alltag:"⚽ Fußball · 🍊 Orange · Murmel", rund:"1 gebogene Fläche · keine Ecken · keine Kanten"},
    "Zylinder":{art:"der", alltag:"🥫 Dose · 🕯️ Kerze", rund:"3 Flächen: 2 Kreise und 1 gebogene Fläche · keine Ecken"},
    "Kegel":{art:"der", spitze:[50,10], alltag:"🍦 Eistüte · 🥳 Partyhut", rund:"2 Flächen: 1 Kreis und 1 gebogene Fläche · 1 Spitze"},
    "Pyramide":{art:"die", ecken:[[50,10],[14,74],[62,88],[90,66]], versteckt:[42,56], alltag:"⛺ Zelt mit Spitze"} };
  const groß=s=>s.charAt(0).toUpperCase()+s.slice(1);
  function formSvg(name, o){ o=o||{}; const f=FORM_E[name], st=`fill="${f.farbe}" stroke="#0f172a" stroke-width="3" stroke-linejoin="round"`;
    let s = f.p ? `<polygon points="${f.p.map(q=>q.join(",")).join(" ")}" ${st}/>` : `<circle cx="50" cy="50" r="38" ${st}/>`;
    if(o.seiten && f.p) f.p.forEach((q,i)=>{ const r=f.p[(i+1)%f.p.length], mx=(q[0]+r[0])/2, my=(q[1]+r[1])/2, dx=mx-50, dy=my-50, l=Math.hypot(dx,dy)||1;
      s+=`<line x1="${q[0]}" y1="${q[1]}" x2="${r[0]}" y2="${r[1]}" stroke="#fde047" stroke-width="6" stroke-linecap="round" class="entT" style="animation-delay:${i*0.45}s"/>`+
         `<text x="${(mx+dx/l*9).toFixed(1)}" y="${(my+dy/l*9+3.5).toFixed(1)}" text-anchor="middle" font-size="10" font-weight="800" fill="#fde047" class="entT" style="animation-delay:${i*0.45}s">${i+1}</text>`; });
    if(o.ecken && f.p) f.p.forEach((q,i)=>{ const dx=q[0]-50, dy=q[1]-50, l=Math.hypot(dx,dy)||1;
      s+=`<circle cx="${q[0]}" cy="${q[1]}" r="5" fill="#ef4444" stroke="#fff" stroke-width="1.5" class="entT" style="animation-delay:${i*0.45}s"/>`+
         `<text x="${(q[0]+dx/l*11).toFixed(1)}" y="${(q[1]+dy/l*11+3.5).toFixed(1)}" text-anchor="middle" font-size="10" font-weight="800" fill="#fca5a5" class="entT" style="animation-delay:${i*0.45}s">${i+1}</text>`; });
    return `<svg viewBox="-12 -12 124 124" width="${o.gross?210:64}" height="${o.gross?210:64}" role="img" aria-label="${name}">${s}</svg>`; }
  function koerperSvg(name, o){ o=o||{}; let s=koerperBild(name).replace(/^<svg[^>]*>/,"").replace(/<\/svg>$/,""); const k=KOERPER_E[name];
    if(o.ecken && k.ecken){ const v=k.versteckt; if(v && name!=="Pyramide"){ const n=[[v[0]-16,v[1]+16],[v[0]+48+(name==="Quader"?22:0),v[1]],[v[0],v[1]-48+(name==="Quader"?12:0)]];
        n.forEach(q=>{ s+=`<line x1="${v[0]}" y1="${v[1]}" x2="${q[0]}" y2="${q[1]}" stroke="#0f172a" stroke-width="1.5" stroke-dasharray="4 4"/>`; }); }
      k.ecken.concat(v?[v]:[]).forEach((q,i)=>{ const hinten=v&&i===k.ecken.length;
        s+=`<circle cx="${q[0]}" cy="${q[1]}" r="4.5" fill="${hinten?"none":"#ef4444"}" stroke="${hinten?"#ef4444":"#fff"}" stroke-width="${hinten?2:1.5}" ${hinten?'stroke-dasharray="2 2"':""} class="entT" style="animation-delay:${i*0.4}s"/>`; }); }
    if(o.ecken && k.spitze) s+=`<circle cx="${k.spitze[0]}" cy="${k.spitze[1]}" r="5" fill="#ef4444" stroke="#fff" stroke-width="1.5" class="entT"/>`;
    return `<svg viewBox="-4 -4 108 108" width="${o.gross?200:64}" height="${o.gross?200:64}" role="img" aria-label="${name}">${s}</svg>`; }
  function entdeckeFormen(e){
    let teil="f", wahl="Dreieck", dreh=null;
    const mit3D=()=>teil==="k" && !!window.Koerper3D;
    const satzForm=n=>{ const f=FORM_E[n]; return f.p ? `${groß(f.art)} ${n} hat ${zahlwort(f.p.length)} Ecken und ${zahlwort(f.p.length)} Seiten.` : "Der Kreis ist ganz rund. Er hat keine Ecken und keine Seiten."; };
    const satzKoerper=n=>{ const k=KOERPER_E[n], w=KOERPER[n].ekf; return w ? `${groß(k.art)} ${n} hat ${zahlwort(w[0])} Ecken, ${zahlwort(w[1])} Kanten und ${zahlwort(w[2])} Flächen.` : ohneTags(KOERPER[n].info); };
    const mal=(zeige)=>{
      const liste = teil==="f" ? Object.keys(FORM_E) : Object.keys(KOERPER_E), istF=teil==="f";
      if(!liste.includes(wahl)) wahl=liste[0];
      const k=KOERPER_E[wahl], w=!istF && KOERPER[wahl].ekf, d3=mit3D();
      if(dreh){ try{ dreh.stopp(); }catch(x){} dreh=null; }
      e.innerHTML=`<div class="reihe" style="margin:4px 0 10px"><button class="klein${istF?"":" ghost"}" data-teil="f">Flächen</button><button class="klein${istF?" ghost":""}" data-teil="k">Körper</button></div>
        <div class="entGal">${liste.map(n=>`<button class="${n===wahl?"an":""}" data-n="${n}">${istF?formSvg(n):koerperSvg(n)}<span>${n}</span></button>`).join("")}</div>
        <div class="entPanel"><div class="entBild" id="k3Box">${d3?"":istF?formSvg(wahl,{gross:true, ecken:zeige==="ecken", seiten:zeige==="seiten"}):koerperSvg(wahl,{gross:true, ecken:zeige==="ecken"})}</div>
          <div class="entName">${istF?FORM_E[wahl].art:k.art} <b>${wahl}</b> <button class="ghost klein" id="entLaut" aria-label="Vorlesen">🔈</button></div>
          <div class="entInfo">${istF ? (FORM_E[wahl].p ? `<b>${FORM_E[wahl].p.length}</b> Ecken · <b>${FORM_E[wahl].p.length}</b> Seiten` : "keine Ecken · keine Seiten · ganz rund") : w ? `<b>${w[0]}</b> Ecken · <b>${w[1]}</b> Kanten · <b>${w[2]}</b> Flächen` : k.rund}</div>
          <div class="entInfo2">${istF ? FORMINFO[wahl] : KOERPER[wahl].info+`<br>So sieht das aus: ${k.alltag}`}</div>
          <div class="reihe">${d3 ? "" : (istF ? FORM_E[wahl].p : (k.ecken||k.spitze)) ? `<button class="klein" id="entEcken">🔴 ${istF||k.ecken?"Ecken zählen":"Spitze zeigen"}</button>`:""}${istF && FORM_E[wahl].p ? `<button class="klein" id="entSeiten">📏 Seiten zählen</button>`:""}</div>
          ${!istF && k.versteckt && zeige==="ecken" ? `<div class="entInfo2">Die gestrichelte Ecke ist <b>hinten</b> – man sieht sie nicht, aber sie ist da.</div>`:""}</div>`;
      if(d3) dreh=Koerper3D.baue($("k3Box"), wahl, {sprich, zahlwort, art:k.art});
      e.querySelectorAll("[data-teil]").forEach(b=>b.addEventListener("click",()=>{ teil=b.dataset.teil; wahl=teil==="f"?"Dreieck":"Würfel"; mal(); }));
      e.querySelectorAll("[data-n]").forEach(b=>b.addEventListener("click",()=>{ wahl=b.dataset.n; mal(); const a=istF?FORM_E[wahl].art:KOERPER_E[wahl].art; sprich(`${groß(a)} ${wahl}.`); }));
      $("entLaut").addEventListener("click",()=>sprich(`${groß(istF?FORM_E[wahl].art:k.art)} ${wahl}. `+(istF?satzForm(wahl):satzKoerper(wahl))));
      const zaehl=(was,n)=>{ const z=Array.from({length:n},(_,i)=>zahlwort(i+1)).join(", ");
        sprich(`${groß(z)}. `+(istF ? `${groß(FORM_E[wahl].art)} ${wahl} hat ${zahlwort(n)} ${was}.` : satzKoerper(wahl))); };
      if($("entEcken")) $("entEcken").addEventListener("click",()=>{ mal("ecken"); const n=istF?FORM_E[wahl].p.length:(k.ecken?k.ecken.length+(k.versteckt?1:0):1); if(!istF && !k.ecken) sprich("Der Kegel hat eine Spitze."); else zaehl("Ecken", n); });
      if($("entSeiten")) $("entSeiten").addEventListener("click",()=>{ mal("seiten"); zaehl("Seiten", FORM_E[wahl].p.length); });
    };
    mal();
  }
  // ----- Geld -----
  const WECHSEL={20000:[10000,10000],10000:[5000,5000],5000:[2000,2000,1000],2000:[1000,1000],1000:[500,500],500:[200,200,100],200:[100,100],100:[50,50],50:[20,20,10],20:[10,10],10:[5,5],5:[2,2,1],2:[1,1]};
  const geldWort=v=>v>=100 ? `${v===100?"ein":zahlwort(v/100)} Euro` : `${v===1?"ein":zahlwort(v)} Cent`;
  function betragWort(c){ const e=Math.floor(c/100), r=c%100; if(!c) return "null Euro";
    return e ? `${e===1?"ein":zahlwort(e)} Euro${r?" "+(r===1?"eins":zahlwort(r)):""}` : `${r===1?"ein":zahlwort(r)} Cent`; }
  function entdeckeGeld(e){
    let beutel=[], tauschen=false; const MAX=40;
    const mal=()=>{
      beutel.sort((a,b)=>b-a); const s=beutel.reduce((x,y)=>x+y,0);
      e.innerHTML=`<div class="kasse">${STUECKE.slice().reverse().map(v=>`<button data-v="${v}" aria-label="${geldWort(v)}">${geldBild(v,true)}</button>`).join("")}</div>
        <div class="reihe"><button class="klein${tauschen?"":" ghost"}" id="entTausch">🔄 Wechseln ${tauschen?"an":"aus"}</button><button class="ghost klein" id="entWenig">✨ Möglichst wenige Stücke</button><button class="ghost klein" id="entWeg">Alles weg</button></div>
        <div class="haufen entBeutel" id="entBeutel">${beutel.length ? beutel.map((v,i)=>`<button data-i="${i}" aria-label="${geldWort(v)}">${geldBild(v,true)}</button>`).join("") : "👛 Dein Geldbeutel ist leer. Tippe oben auf Münzen und Scheine."}</div>
        <div class="stTipp">${tauschen ? "Wechseln ist an: Tippe ein Stück im Geldbeutel an – du bekommst kleinere Stücke, die genauso viel wert sind." : "Ein Stück im Geldbeutel antippen legt es zurück."}</div>
        <div class="entPanel"><div class="entInfo">${beutel.length} ${beutel.length===1?"Stück":"Stücke"}</div>
          <div class="entSumme">${komma(s)} <button class="ghost klein" id="entLaut" aria-label="Vorlesen">🔈</button></div>
          <div class="entInfo">${s>=100 ? `= ${euroCent(s)} = ${s} ct` : `= ${s} ct`}</div><div class="entInfo2">${betragWort(s)}</div>
          ${beutel.length>1?`<div class="entInfo2">${summenKette(beutel)}</div>`:""}</div>`;
      e.querySelectorAll(".kasse [data-v]").forEach(b=>b.addEventListener("click",()=>{ if(beutel.length>=MAX) return; const v=+b.dataset.v; beutel.push(v); mal(); sprich(geldWort(v)); }));
      e.querySelectorAll("#entBeutel [data-i]").forEach(b=>b.addEventListener("click",()=>{ const i=+b.dataset.i, v=beutel[i];
        if(tauschen){ const w=WECHSEL[v]; if(!w){ sprich("Ein Cent ist das kleinste Stück. Den kann man nicht wechseln."); return; } if(beutel.length-1+w.length>MAX) return;
          beutel.splice(i,1,...w); mal(); sprich(`${geldWort(v)} sind ${w.map(geldWort).join(" und ")}.`); }
        else { beutel.splice(i,1); mal(); } }));
      $("entTausch").addEventListener("click",()=>{ tauschen=!tauschen; mal(); });
      $("entWenig").addEventListener("click",()=>{ if(!s) return; beutel=zerlege(s); mal(); sprich(`Mit möglichst wenigen Stücken: ${beutel.map(geldWort).join(", ")}.`); });
      $("entWeg").addEventListener("click",()=>{ beutel=[]; mal(); });
      $("entLaut").addEventListener("click",()=>sprich(s ? `Zusammen sind es ${betragWort(s)}.` : "Der Geldbeutel ist leer."));
    };
    mal();
  }
  // ----- Ziehen in einem SVG: liefert die x-Position im viewBox-Maß -----
  function ziehSvg(svg, breite, beiZug, beiEnde){
    const x=ev=>{ const r=svg.getBoundingClientRect(); return (ev.clientX-r.left)/r.width*breite; };
    svg.addEventListener("pointerdown", ev=>{ ev.preventDefault(); try{ svg.setPointerCapture(ev.pointerId); }catch(e){} beiZug(x(ev));
      const mv=e=>beiZug(x(e)), up=()=>{ svg.removeEventListener("pointermove",mv); svg.removeEventListener("pointerup",up); svg.removeEventListener("pointercancel",up); if(beiEnde) beiEnde(); };
      svg.addEventListener("pointermove",mv); svg.addEventListener("pointerup",up); svg.addEventListener("pointercancel",up); });
  }
  // ----- Längen: Stift am Lineal mit dem Finger verlängern -----
  function entdeckeLaengen(e){
    let mm=74, nurCm=false; const X=m=>14+m*2.4;
    const text=()=>{ const c=Math.floor(mm/10), r=mm%10; return r ? (c?`${c} cm ${r} mm = <b>${mm} mm</b>`:`<b>${mm} mm</b>`) : `<b>${c} cm</b> = ${mm} mm`; };
    const wort=()=>{ const c=Math.floor(mm/10), r=mm%10; return (c?`${c===1?"ein":zahlwort(c)} Zentimeter`:"")+(c&&r?" und ":"")+(r?`${r===1?"ein":zahlwort(r)} Millimeter`:""); };
    const svgInnen=()=>{ let s=`<rect x="6" y="40" width="304" height="46" rx="5" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>`;
      for(let m=0;m<=120;m++){ const l=m%10===0?16:m%5===0?11:7; s+=`<line x1="${X(m)}" y1="40" x2="${X(m)}" y2="${40+l}" stroke="#1f2937" stroke-width="${m%10===0?1.6:0.9}"/>`;
        if(m%10===0) s+=`<text x="${X(m)}" y="72" text-anchor="middle" font-size="12" font-weight="800" fill="#1f2937">${m/10}</text>`; }
      const ende=X(mm);
      s+=`<rect x="${X(0)}" y="12" width="${Math.max(0,ende-X(0)-12)}" height="16" rx="3" fill="#f59e0b"/><path d="M${ende-12} 12 L${ende} 20 L${ende-12} 28 Z" fill="#fde68a"/><path d="M${ende-4} 17.3 L${ende} 20 L${ende-4} 22.7 Z" fill="#1f2937"/>`;
      s+=`<line x1="${ende}" y1="28" x2="${ende}" y2="40" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="2 2"/><circle cx="${ende}" cy="20" r="11" fill="rgba(239,68,68,.18)" stroke="#ef4444" stroke-width="1.5"/>`;
      return s; };
    e.innerHTML=`<svg class="entSvg" id="entLineal" viewBox="0 0 316 92" role="img" aria-label="Lineal mit Stift"></svg>
      <div class="stTipp">Zieh die Spitze des Stifts nach rechts oder links.</div>
      <div class="reihe"><button class="ghost klein" id="entCm">nur ganze Zentimeter: aus</button></div>
      <div class="entPanel"><div class="entSumme" id="entLang"></div><div class="entInfo2" id="entLangW"></div><button class="ghost klein" id="entLaut">🔈 Vorlesen</button></div>
      <div class="entPanel"><div class="entInfo"><b>So lang ist ungefähr …</b></div><div class="entChips">${[["1 mm","so dick wie eine Bleistiftmine"],["1 cm","so breit wie ein Fingernagel"],["10 cm","so breit wie deine Hand"],["1 m","ein großer Schritt"]].map(x=>`<button data-sag="${x[0]} ist ${x[1]}."><b>${x[0]}</b> ${x[1]}</button>`).join("")}</div></div>`;
    const svg=$("entLineal"), mal=()=>{ svg.innerHTML=svgInnen(); $("entLang").innerHTML=text(); $("entLangW").textContent=wort(); };
    ziehSvg(svg, 316, x=>{ let m=Math.round((x-14)/2.4); m=Math.max(1,Math.min(120,m)); if(nurCm) m=Math.max(10,Math.round(m/10)*10); if(m!==mm){ mm=m; mal(); } }, ()=>sprich(`Der Stift ist ${wort()} lang.`));
    $("entCm").addEventListener("click",()=>{ nurCm=!nurCm; $("entCm").textContent=`nur ganze Zentimeter: ${nurCm?"an":"aus"}`; $("entCm").classList.toggle("ghost",!nurCm); if(nurCm){ mm=Math.max(10,Math.round(mm/10)*10); mal(); } });
    $("entLaut").addEventListener("click",()=>sprich(`Der Stift ist ${wort()} lang. Das sind ${zahlwort(mm)} Millimeter.`));
    e.querySelectorAll("[data-sag]").forEach(b=>b.addEventListener("click",()=>sprich(b.dataset.sag)));
    mal();
  }
  // ----- Zahlenstrahl: Pfeil mit dem Finger verschieben -----
  function entdeckeStrahl(e){
    let kl=0; try{ kl=+(localStorage.getItem("mathe_klasse")||0); }catch(x){}
    let bis = kl===1 ? 20 : kl && kl<=2 ? 100 : 1000, v = bis===20?13:bis===100?47:350;
    const W=320, X0=14, X1=306, X=n=>X0+(X1-X0)*n/bis;
    const svgInnen=()=>{ let s=`<line x1="${X0-6}" y1="44" x2="${X1+8}" y2="44" stroke="#e2e8f0" stroke-width="2"/><path d="M${X1+8} 39 L${X1+14} 44 L${X1+8} 49 Z" fill="#e2e8f0"/>`;
      const klein=bis===1000?10:1, mittel=bis===20?5:bis===100?5:50, gross=bis===20?5:bis===100?10:100;
      for(let n=0;n<=bis;n+=klein){ const l=n%gross===0?12:n%mittel===0?8:5; s+=`<line x1="${X(n).toFixed(2)}" y1="${44-l}" x2="${X(n).toFixed(2)}" y2="${44+l}" stroke="#94a3b8" stroke-width="${n%gross===0?1.6:0.8}"/>`;
        if(n%gross===0) s+=`<text x="${X(n).toFixed(2)}" y="72" text-anchor="middle" font-size="${bis===1000?9.5:11}" font-weight="700" fill="#cbd5e1">${n}</text>`; }
      const z=bis===1000?100:10, a=Math.floor(v/z)*z, b=Math.min(bis, a+z);
      s+=`<rect x="${X(a)}" y="30" width="${X(b)-X(a)}" height="28" fill="rgba(253,230,138,.12)"/>`;
      s+=`<path d="M${X(v)} 30 L${X(v)-7} 14 L${X(v)+7} 14 Z" fill="#ef4444"/><rect x="${X(v)-1.5}" y="14" width="3" height="30" fill="#ef4444"/><circle cx="${X(v)}" cy="10" r="10" fill="rgba(239,68,68,.18)" stroke="#ef4444" stroke-width="1.5"/>`;
      return s; };
    const info=()=>{ const z=bis===1000?100:10, a=Math.floor(v/z)*z, b=a+z, ne=v%10===0?null:[Math.floor(v/10)*10, Math.floor(v/10)*10+10];
      return `<div class="entSumme">${v}</div><div class="entInfo2">${zahlwort(v)}</div>
        <div class="entInfo">Vorgänger <b>${v-1>=0?v-1:"–"}</b> · Nachfolger <b>${v+1}</b></div>
        ${ne?`<div class="entInfo">Nachbarzehner <b>${ne[0]}</b> und <b>${ne[1]}</b></div>`:`<div class="entInfo">${v} ist selbst ein Zehner.</div>`}
        ${bis===1000?`<div class="entInfo">Nachbarhunderter <b>${a}</b> und <b>${b}</b></div>`:""}`; };
    const baue=()=>{
      e.innerHTML=`<div class="reihe" style="margin:4px 0 10px">${[20,100,1000].map(b=>`<button class="klein${b===bis?"":" ghost"}" data-bis="${b}">bis ${b}</button>`).join("")}</div>
        <svg class="entSvg" id="entStrahl" viewBox="0 0 ${W} 80" role="img" aria-label="Zahlenstrahl"></svg>
        <div class="stTipp">Zieh den roten Pfeil – oder tippe auf eine Stelle.</div>
        <div class="reihe">${(bis===1000?[-100,-10,-1,1,10,100]:[-10,-1,1,10]).map(d=>`<button class="ghost klein" data-d="${d}">${d>0?"+":"−"}${Math.abs(d)}</button>`).join("")}</div>
        <div class="entPanel" id="entStrahlInfo"></div><div class="reihe"><button class="ghost klein" id="entLaut">🔈 Vorlesen</button></div>`;
      const svg=$("entStrahl"), mal=()=>{ svg.innerHTML=svgInnen(); $("entStrahlInfo").innerHTML=info(); };
      ziehSvg(svg, W, x=>{ let n=Math.round((x-X0)/(X1-X0)*bis); n=Math.max(0,Math.min(bis,n)); if(n!==v){ v=n; mal(); } }, ()=>sprich(zahlwort(v)));
      e.querySelectorAll("[data-bis]").forEach(b=>b.addEventListener("click",()=>{ bis=+b.dataset.bis; v=Math.min(v,bis); baue(); }));
      e.querySelectorAll("[data-d]").forEach(b=>b.addEventListener("click",()=>{ v=Math.max(0,Math.min(bis,v+ +b.dataset.d)); mal(); sprich(zahlwort(v)); }));
      $("entLaut").addEventListener("click",()=>{ const ne=v%10?` Die Nachbarzehner sind ${zahlwort(Math.floor(v/10)*10)} und ${zahlwort(Math.floor(v/10)*10+10)}.`:""; sprich(`${zahlwort(v)}.${ne}`); });
      mal(); };
    baue();
  }
  // ----- Daten: Strichliste und Säulendiagramm wachsen gleichzeitig -----
  function strichSvg(n){ if(!n) return `<span style="color:#475569">–</span>`; let s="", x=2; const g=Math.floor(n/5), r=n%5;
    for(let i=0;i<g;i++){ for(let k=0;k<4;k++) s+=`<line x1="${x+k*5}" y1="3" x2="${x+k*5}" y2="21" stroke="#e2e8f0" stroke-width="2.2" stroke-linecap="round"/>`; s+=`<line x1="${x-3}" y1="18" x2="${x+18}" y2="6" stroke="#fde68a" stroke-width="2.2" stroke-linecap="round"/>`; x+=27; }
    for(let k=0;k<r;k++) s+=`<line x1="${x+k*5}" y1="3" x2="${x+k*5}" y2="21" stroke="#e2e8f0" stroke-width="2.2" stroke-linecap="round"/>`;
    return `<svg width="${Math.max(10,x+r*5+4)}" height="24" viewBox="0 0 ${Math.max(10,x+r*5+4)} 24">${s}</svg>`; }
  function entdeckeDaten(e){
    const THEMEN=[["Lieblingsobst",[["🍎","Apfel"],["🍌","Banane"],["🍓","Erdbeere"],["🍇","Trauben"]]],["Haustiere",[["🐶","Hund"],["🐱","Katze"],["🐰","Hase"],["🐟","Fisch"]]],["Wie kommst du zur Schule?",[["🚶","zu Fuß"],["🚲","Fahrrad"],["🚌","Bus"],["🚗","Auto"]]]];
    const FARB=["#f87171","#fbbf24","#f472b6","#a78bfa"];
    let t=0, z=[3,5,2,4];
    const mal=()=>{ const [titel,kat]=THEMEN[t], max=Math.max(5, ...z), oben=Math.ceil(max/5)*5, summe=z.reduce((a,b)=>a+b,0), best=Math.max(...z), beste=kat.filter((k,i)=>z[i]===best&&best>0).map(k=>k[1]);
      const H=120, sw=46, dia=`<svg class="entSvg" viewBox="0 0 260 ${H+40}" role="img" aria-label="Säulendiagramm">`+
        Array.from({length:oben/5+1},(_,i)=>{ const y=10+H-H*(i*5)/oben; return `<line x1="30" y1="${y}" x2="252" y2="${y}" stroke="#334155" stroke-width="1"/><text x="24" y="${y+4}" text-anchor="end" font-size="10" fill="#94a3b8">${i*5}</text>`; }).join("")+
        z.map((n,i)=>{ const h=H*n/oben, x=42+i*54; return `<rect x="${x}" y="${10+H-h}" width="${sw}" height="${h}" rx="4" fill="${FARB[i]}" style="transition:all .25s"/><text x="${x+sw/2}" y="${H+30}" text-anchor="middle" font-size="18">${kat[i][0]}</text>${n?`<text x="${x+sw/2}" y="${6+H-h}" text-anchor="middle" font-size="11" font-weight="800" fill="#e2e8f0">${n}</text>`:""}`; }).join("")+`</svg>`;
      e.innerHTML=`<div class="reihe" style="margin:4px 0 10px">${THEMEN.map((x,i)=>`<button class="klein${i===t?"":" ghost"}" data-t="${i}">${x[0]}</button>`).join("")}</div>
        <div class="entPanel" style="text-align:left"><div class="entInfo" style="text-align:center"><b>Strichliste: ${titel}</b></div>
          ${kat.map((k,i)=>`<div class="entStrich"><span class="ek">${k[0]} ${k[1]}</span><span class="es">${strichSvg(z[i])}</span><b class="en">${z[i]}</b><button class="ghost klein" data-m="${i}" aria-label="einen weniger">−</button><button class="klein" data-p="${i}" aria-label="einen mehr">+</button></div>`).join("")}</div>
        <div class="stTipp">Tippe auf +: Ein Strich kommt dazu – und die Säule wird höher. Jeder fünfte Strich geht quer: So zählt man schneller.</div>
        <div class="entPanel"><div class="entInfo"><b>Säulendiagramm</b></div>${dia}
          <div class="entInfo">Zusammen: <b>${summe}</b> · Am meisten: <b>${beste.length?beste.join(" und "):"–"}</b></div></div>`;
      e.querySelectorAll("[data-t]").forEach(b=>b.addEventListener("click",()=>{ t=+b.dataset.t; z=[0,0,0,0]; mal(); }));
      e.querySelectorAll("[data-p]").forEach(b=>b.addEventListener("click",()=>{ const i=+b.dataset.p; if(z[i]>=25) return; z[i]++; mal(); sprich(`${kat[i][1]}: ${zahlwort(z[i])}`); }));
      e.querySelectorAll("[data-m]").forEach(b=>b.addEventListener("click",()=>{ const i=+b.dataset.m; if(z[i]<=0) return; z[i]--; mal(); }));
    };
    mal();
  }
  // ----- Kalender: Monat ansehen, Tag antippen -----
  function entdeckeKalender(e){
    const TAGE=["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"], MON=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
    const heute=new Date(); let j=heute.getFullYear(), m=heute.getMonth(), wahl=heute.getDate();
    const mal=()=>{ const n=new Date(j,m+1,0).getDate(), start=(new Date(j,m,1).getDay()+6)%7, istHeute=d=>j===heute.getFullYear()&&m===heute.getMonth()&&d===heute.getDate();
      if(wahl>n) wahl=n; const wt=TAGE[new Date(j,m,wahl).getDay()];
      let zellen=Array.from({length:start},()=>`<span></span>`).join("");
      for(let d=1; d<=n; d++){ const w=(start+d-1)%7; zellen+=`<button class="${d===wahl?"an":""}${istHeute(d)?" heute":""}${w>=5?" we":""}" data-d="${d}">${d}</button>`; }
      e.innerHTML=`<div class="reihe" style="margin:4px 0 8px;align-items:center"><button class="ghost klein" id="kVor" aria-label="Monat davor">◀</button><b style="font-size:19px;min-width:150px;text-align:center">${MON[m]} ${j}</b><button class="ghost klein" id="kNach" aria-label="nächster Monat">▶</button><button class="ghost klein" id="kHeute">Heute</button></div>
        <div class="entKal">${["Mo","Di","Mi","Do","Fr","Sa","So"].map((x,i)=>`<span class="kk${i>=5?" we":""}">${x}</span>`).join("")}${zellen}</div>
        <div class="entPanel"><div class="entSumme" style="font-size:24px">${wt}, ${wahl}. ${MON[m]} ${j}</div>
          <div class="entInfo">Der ${MON[m]} hat <b>${n} Tage</b>. Er ist der <b>${m+1}.</b> Monat im Jahr.</div>
          <div class="entInfo2">${istHeute(wahl)?"Das ist <b>heute</b>.":(()=>{ const t=Math.round((new Date(j,m,wahl)-new Date(heute.getFullYear(),heute.getMonth(),heute.getDate()))/86400000); return t>0?`Das ist in <b>${t}</b> ${t===1?"Tag":"Tagen"}.`:`Das war vor <b>${-t}</b> ${t===-1?"Tag":"Tagen"}.`; })()}</div>
          <button class="ghost klein" id="entLaut">🔈 Vorlesen</button></div>`;
      e.querySelectorAll("[data-d]").forEach(b=>b.addEventListener("click",()=>{ wahl=+b.dataset.d; mal(); sprich(`${TAGE[new Date(j,m,wahl).getDay()]}, der ${wahl}. ${MON[m]}`); }));
      $("kVor").addEventListener("click",()=>{ m--; if(m<0){ m=11; j--; } mal(); sprich(`${MON[m]}. Er hat ${zahlwort(new Date(j,m+1,0).getDate())} Tage.`); });
      $("kNach").addEventListener("click",()=>{ m++; if(m>11){ m=0; j++; } mal(); sprich(`${MON[m]}. Er hat ${zahlwort(new Date(j,m+1,0).getDate())} Tage.`); });
      $("kHeute").addEventListener("click",()=>{ j=heute.getFullYear(); m=heute.getMonth(); wahl=heute.getDate(); mal(); });
      $("entLaut").addEventListener("click",()=>sprich(`${wt}, der ${wahl}. ${MON[m]} ${j}. Der ${MON[m]} hat ${zahlwort(n)} Tage.`));
    };
    mal();
  }
  // ----- Gewichte: Balkenwaage – Gegenstand links, Gewichtsstücke rechts -----
  function entdeckeWaage(e){
    const DINGE=[["🍎","Apfel","der",150],["🍌","Banane","die",120],["🥚","Ei","das",60],["🍫","Tafel Schokolade","die",100],["📕","Buch","das",600],["🥛","Liter Milch","der",1000],["🍍","Ananas","die",900],["🧈","Stück Butter","das",250]];
    const STK=[1000,500,200,100,50,20,10];
    let d=0, rechts=[];
    const gw=g=>g>=1000 ? (g%1000 ? `${Math.floor(g/1000)} kg ${g%1000} g` : `${g/1000} kg`) : `${g} g`;
    const gwWort=g=>g>=1000 ? `${Math.floor(g/1000)===1?"ein":zahlwort(Math.floor(g/1000))} Kilogramm${g%1000?" "+zahlwort(g%1000)+" Gramm":""}` : `${zahlwort(g)} Gramm`;
    const stueck=g=>{ const r=g>=500?26:g>=100?20:g>=50?17:14; return `<g><rect x="${-r/2}" y="${-r}" width="${r}" height="${r}" rx="3" fill="#94a3b8" stroke="#0f172a" stroke-width="1.5"/><text x="0" y="${-r/2+3.5}" text-anchor="middle" font-size="${r>=20?7.5:6}" font-weight="800" fill="#0f172a">${g>=1000?"1kg":g}</text></g>`; };
    const mal=()=>{
      const [ic,name,art,soll]=DINGE[d], ist=rechts.reduce((a,b)=>a+b,0), diff=ist-soll, w=Math.max(-12,Math.min(12, diff/Math.max(soll,100)*24)), gleich=diff===0;
      const rad=w*Math.PI/180, L=[150-90*Math.cos(rad), 60-90*Math.sin(rad)], R=[150+90*Math.cos(rad), 60+90*Math.sin(rad)];
      let rs=""; rechts.slice().sort((a,b)=>b-a).forEach((g,i)=>{ const x=R[0]-30+(i%5)*15, y=R[1]+46-Math.floor(i/5)*24; rs+=`<g transform="translate(${x},${y})">${stueck(g)}</g>`; });
      e.innerHTML=`<div class="entGal" style="grid-template-columns:repeat(4,1fr)">${DINGE.map((x,i)=>`<button class="${i===d?"an":""}" data-d="${i}"><span style="font-size:26px">${x[0]}</span><span>${x[1]}</span></button>`).join("")}</div>
        <svg class="entSvg" viewBox="0 0 300 170" role="img" aria-label="Waage" style="margin-top:10px;touch-action:auto;cursor:default">
          <rect x="135" y="150" width="30" height="8" rx="2" fill="#64748b"/><rect x="146" y="60" width="8" height="92" fill="#64748b"/><circle cx="150" cy="60" r="6" fill="#cbd5e1"/>
          <line x1="${L[0]}" y1="${L[1]}" x2="${R[0]}" y2="${R[1]}" stroke="#cbd5e1" stroke-width="5" stroke-linecap="round"/>
          <path d="M${L[0]-34} ${L[1]+48} L${L[0]} ${L[1]} L${L[0]+34} ${L[1]+48}" fill="none" stroke="#94a3b8" stroke-width="1.2"/><path d="M${L[0]-38} ${L[1]+48} H${L[0]+38}" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round"/>
          <path d="M${R[0]-38} ${R[1]+48} L${R[0]} ${R[1]} L${R[0]+38} ${R[1]+48}" fill="none" stroke="#94a3b8" stroke-width="1.2"/><path d="M${R[0]-42} ${R[1]+48} H${R[0]+42}" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round"/>
          <text x="${L[0]}" y="${L[1]+44}" text-anchor="middle" font-size="30">${ic}</text>${rs}
          <path d="M150 52 L146 40 L154 40 Z" fill="${gleich?"#22c55e":"#f59e0b"}"/></svg>
        <div class="stTipp">Tippe unten auf ein Gewichtsstück – es kommt rechts auf die Waage. Antippen in der Liste nimmt es wieder herunter.</div>
        <div class="kasse">${STK.map(g=>`<button data-g="${g}" style="min-width:62px;font-weight:800;color:#e2e8f0">${gw(g)}</button>`).join("")}</div>
        <div class="haufen" id="entRechts">${rechts.length ? rechts.slice().sort((a,b)=>b-a).map((g,i)=>`<button data-r="${g}" style="background:#334155;color:#e2e8f0;border-radius:9px;padding:6px 9px;font-weight:800">${gw(g)}</button>`).join("") : "Rechts liegt noch nichts."}</div>
        <div class="entPanel"><div class="entInfo">Rechts: <b>${gw(ist)}</b>${ist>=1000&&ist%1000?` = ${ist} g`:""}</div>
          <div class="entSumme" style="font-size:22px;color:${gleich?"#86efac":"#fde68a"}">${gleich ? `⚖️ Gleichgewicht! ${art==="der"?"Der":art==="die"?"Die":"Das"} ${name} wiegt ${gw(soll)}.` : ist===0 ? `${ic} Wie schwer ist ${art} ${name}?` : diff<0 ? "Rechts ist es noch zu leicht." : "Rechts ist es zu schwer."}</div>
          ${gleich && soll>=1000 ? `<div class="entInfo2">1 kg = 1000 g</div>`:""}</div>`;
      e.querySelectorAll("[data-d]").forEach(b=>b.addEventListener("click",()=>{ d=+b.dataset.d; rechts=[]; mal(); }));
      e.querySelectorAll("[data-g]").forEach(b=>b.addEventListener("click",()=>{ if(rechts.length>=15) return; rechts.push(+b.dataset.g); const vor=gleich; mal();
        const s=rechts.reduce((a,c)=>a+c,0); if(s===DINGE[d][3]) sprich(`Gleichgewicht! ${DINGE[d][2]==="der"?"Der":DINGE[d][2]==="die"?"Die":"Das"} ${DINGE[d][1]} wiegt ${gwWort(s)}.`); }));
      e.querySelectorAll("[data-r]").forEach(b=>b.addEventListener("click",()=>{ const i=rechts.indexOf(+b.dataset.r); if(i>=0) rechts.splice(i,1); mal(); }));
    };
    mal();
  }
  // ----- Schriftlich rechnen: Schritt für Schritt, Stelle für Stelle (Einer zu Einern, Zehner zu Zehnern …) -----
  function entdeckeSchrift(e){
    const KURZ=["E","Z","H","T"], LANG=["Einer","Zehner","Hunderter","Tausender"], FARB=["#4ade80","#60a5fa","#f87171","#fbbf24"];
    let op="+", a=347, b=285, schritt=0;
    const neu=()=>{ if(op==="+"){ a=rnd(120,689); b=rnd(110,309); } else if(op==="-"){ a=rnd(300,950); b=rnd(105,a-60); if(aus([0,1])){ a=rnd(3,9)*100+rnd(0,1)*10+rnd(0,9); b=rnd(110,a-50); } } else { a=rnd(23,389); b=rnd(3,9); } schritt=0; };
    // alle Schritte vorausberechnen: je Stelle {stelle, schreibe, merke, text, sag, oben(Änderungen beim Entbündeln)}
    function plane(){
      const erg = op==="+"?a+b:op==="-"?a-b:a*b, W=Math.max(String(a).length, op==="*"?String(erg).length:String(Math.max(a,b,erg)).length);
      const da=String(a).padStart(W,"0").split("").map(Number), db=op==="*"?[]:String(b).padStart(W,"0").split("").map(Number), S=[], oben=da.slice(), neuOben={};
      let c=0;
      for(let k=0;k<W;k++){ const i=W-1-k, st=LANG[k];
        if(op==="+"){ const s=da[i]+db[i]+c; if(i<W-String(erg).length && !s) continue;
          S.push({k, schreibe:s%10, merke:Math.floor(s/10), text:`<b>${st}:</b> ${da[i]} + ${db[i]}${c?` + ${c} (gemerkt)`:""} = ${s}${s>9?` → schreibe <b>${s%10}</b>, merke <b>${Math.floor(s/10)}</b>`:` → schreibe <b>${s}</b>`}`,
            sag:`${st}: ${zahlwort(da[i])} plus ${zahlwort(db[i])}${c?` plus ${zahlwort(c)}`:""} ist ${zahlwort(s)}. ${s>9?`Schreibe ${zahlwort(s%10)}, merke ${zahlwort(Math.floor(s/10))}.`:`Schreibe ${zahlwort(s)}.`}`}); c=Math.floor(s/10); }
        else if(op==="-"){ let t=oben[i], text, sag, kette=[];
          if(t<db[i]){ let j=i-1; while(j>=0 && oben[j]===0) j--;                // links den nächsten Stellenwert suchen, der nicht 0 ist
            for(let x=j;x<i;x++){ oben[x]=oben[x]-1+(x>j?10:0); kette.push(x); neuOben[x]=oben[x]; }
            t+=10; oben[i]=t; neuOben[i]=t;
            const von=LANG[W-1-j];
            const ueber = i-j>1 ? ` Bei den ${LANG[W-1-(j+1)]}n steht 0 – darum: 1 ${von} wird zu 10 ${LANG[W-1-(j+1)]}n, davon wird 1 zu 10 ${st}n. Bei den ${LANG[W-1-(j+1)]}n bleiben 9.` : "";
            text=`<b>${st}:</b> ${t-10} − ${db[i]} geht nicht. <b>Entbündle</b> 1 ${von}${i-j>1?` (über die 0)`:""}.${ueber} Jetzt sind es ${t} ${st}. ${t} − ${db[i]} = <b>${t-db[i]}</b>`;
            sag=`${st}: ${zahlwort(t-10)} minus ${zahlwort(db[i])} geht nicht. Entbündle einen ${von}. ${zahlwort(t)} minus ${zahlwort(db[i])} ist ${zahlwort(t-db[i])}.`; }
          else { text=`<b>${st}:</b> ${t} − ${db[i]} = <b>${t-db[i]}</b>`; sag=`${st}: ${zahlwort(t)} minus ${zahlwort(db[i])} ist ${zahlwort(t-db[i])}.`; }
          if(i<W-String(erg).length && t-db[i]===0 && !kette.length){ oben[i]=t; continue; }
          S.push({k, schreibe:t-db[i], merke:0, text, sag, oben:Object.assign({},neuOben)}); oben[i]=t-db[i]+db[i]; }
        else { const n=String(a).length; if(k>=n){ if(c){ S.push({k, schreibe:c, merke:0, text:`Die gemerkte <b>${c}</b> kommt ganz nach vorn.`, sag:`Die gemerkte ${zahlwort(c)} kommt ganz nach vorn.`}); c=0; } continue; }
          const p=da[i]*b+c;
          S.push({k, schreibe:p%10, merke:Math.floor(p/10), text:`<b>${st}:</b> ${b} · ${da[i]} = ${da[i]*b}${c?` + ${c} (gemerkt) = ${p}`:""}${p>9?` → schreibe <b>${p%10}</b>, merke <b>${Math.floor(p/10)}</b>`:` → schreibe <b>${p}</b>`}`,
            sag:`${st}: ${zahlwort(b)} mal ${zahlwort(da[i])} ist ${zahlwort(da[i]*b)}${c?`, plus ${zahlwort(c)} ist ${zahlwort(p)}`:""}. ${p>9?`Schreibe ${zahlwort(p%10)}, merke ${zahlwort(Math.floor(p/10))}.`:`Schreibe ${zahlwort(p)}.`}`}); c=Math.floor(p/10); }
      }
      return {W, da, db, erg, S};
    }
    const mal=()=>{
      const P=plane(), W=P.W, fertig=schritt>=P.S.length, aktiv=!fertig&&schritt>0 ? P.S[schritt-1].k : (schritt>0?P.S[schritt-1].k:-1);
      const getan=P.S.slice(0,schritt), erg={}, merk={}; let oben={};
      getan.forEach(s=>{ erg[s.k]=s.schreibe; if(s.merke) merk[s.k+1]=s.merke; if(s.oben) oben=Object.assign(oben, s.oben); });
      const zelle=(k, inhalt, kl)=>`<span class="sgZ${k===aktiv?" an":""}${kl?" "+kl:""}" style="--f:${FARB[k]||"#e2e8f0"}">${inhalt}</span>`;
      const reihe=(zeichen, ziffern, kl)=>`<span class="sgO">${zeichen}</span>`+Array.from({length:W},(_,i)=>{ const k=W-1-i; return zelle(k, ziffern[i]===undefined||ziffern[i]===null?"":ziffern[i], kl); }).join("");
      const fuehr=(arr, n)=>arr.map((z,i)=> i<W-n ? null : z);
      let html=`<span class="sgO"></span>`+Array.from({length:W},(_,i)=>`<span class="sgK" style="color:${FARB[W-1-i]||"#e2e8f0"}">${KURZ[W-1-i]||""}</span>`).join("");
      if(op==="-") html+=`<span class="sgO"></span>`+Array.from({length:W},(_,i)=>{ const k=W-1-i, i2=i; return `<span class="sgE">${oben[i2]!==undefined?oben[i2]:""}</span>`; }).join("");
      if(op==="*"){ html+=reihe("", fuehr(P.da, String(a).length).map(z=>z===null?"":z)); html+=reihe("·", Array.from({length:W},(_,i)=>i===W-1?b:"")); }
      else { html+=reihe("", fuehr(P.da, String(a).length).map((z,i)=>z===null?"":(oben[i]!==undefined?`<s>${z}</s>`:z))); html+=reihe(op==="+"?"+":"−", fuehr(P.db, String(b).length).map(z=>z===null?"":z)); }
      html+=`<span class="sgO"></span>`+Array.from({length:W},(_,i)=>`<span class="sgU">${merk[W-1-i]||""}</span>`).join("");
      html+=`<span class="sgLinie" style="grid-column:1/-1"></span>`+reihe("=", Array.from({length:W},(_,i)=>erg[W-1-i]!==undefined?erg[W-1-i]:""), "sgErg");
      e.innerHTML=`<div class="reihe" style="margin:4px 0 10px">${[["+","Plus"],["-","Minus"],["*","Mal"]].map(x=>`<button class="klein${x[0]===op?"":" ghost"}" data-op="${x[0]}">${x[1]}</button>`).join("")}<button class="ghost klein" id="sgNeu">🎲 Neue Aufgabe</button></div>
        <div class="sgGitter" style="grid-template-columns:26px repeat(${W},44px)">${html}</div>
        <div class="entPanel"><div class="entInfo" id="sgText">${schritt===0 ? (op==="*"?"Beim Malnehmen fängst du auch bei den <b>Einern</b> an – jede Ziffer wird mit der Zahl malgenommen.":"Wir rechnen <b>Stelle für Stelle</b>, von rechts nach links: zuerst die <b>Einer</b>, dann die <b>Zehner</b>, dann die <b>Hunderter</b>.") : P.S[schritt-1].text}</div>
          ${fertig?`<div class="entSumme" style="font-size:24px">✅ ${a} ${op==="+"?"+":op==="-"?"−":"·"} ${b} = ${P.erg}</div>`:""}
          <div class="reihe"><button class="ghost klein" id="sgZur"${schritt?"":" disabled"}>◀ Zurück</button><button class="klein" id="sgWeiter"${fertig?" disabled":""}>${schritt?"Nächster Schritt ▶":"Los geht's ▶"}</button><button class="ghost klein" id="sgLaut">🔈</button></div></div>
        <div class="stTipp">${op==="+"?"Die kleine gelbe Zahl ist die <b>gemerkte</b> Zahl (der Übertrag). Sie kommt zur nächsten Stelle dazu.":op==="-"?"Reicht es oben nicht, wird links <b>entbündelt</b>: 1 Zehner = 10 Einer. Die neue Zahl steht klein darüber.":"Die kleine gelbe Zahl ist die <b>gemerkte</b> Zahl – sie kommt nach dem Malnehmen dazu."}</div>`;
      e.querySelectorAll("[data-op]").forEach(x=>x.addEventListener("click",()=>{ op=x.dataset.op; neu(); mal(); }));
      $("sgNeu").addEventListener("click",()=>{ neu(); mal(); });
      $("sgWeiter").addEventListener("click",()=>{ if(schritt<P.S.length){ schritt++; mal(); sprich(P.S[schritt-1].sag+(schritt===P.S.length?` Fertig: ${zahlwort(P.erg)}.`:"")); } });
      $("sgZur").addEventListener("click",()=>{ if(schritt>0){ schritt--; mal(); } });
      $("sgLaut").addEventListener("click",()=>sprich(schritt?P.S[schritt-1].sag:"Wir rechnen Stelle für Stelle, von rechts nach links: zuerst die Einer, dann die Zehner, dann die Hunderter."));
    };
    mal();
  }
  function zeigeMenue(){
    const dran=STUFEN.find(s=>!stufenStand(s.id).bestanden);
    $("stufen").innerHTML=STUFEN.map(s=>{ const z=stufenStand(s.id);
      const lv = WAS==="blitz" ? stufeWahl(s.id) : 0, rk = WAS==="blitz" ? rekord(s.id, lv) : 0;
      const info = WAS==="blitz" ? `${s.kurz} · ${rk ? `Rekord ⚡ ${rk} · ` : ""}Ziel ${zielFuer(s,lv)}` : z.bestanden ? `✓ Test bestanden · ${z.geuebt}× geübt` : z.tests ? `${z.geuebt}× geübt · bester Test ${z.besterTest} %` : z.geuebt ? `${z.geuebt}× geübt · noch kein Test` : s.kurz;
      if(WAS==="blitz" && BLITZ_KL && s.kl!==BLITZ_KL) return "";
      return `<div class="stufe${z.bestanden?" fertig":""}${dran&&dran.id===s.id?" dran":""}"><span class="nr">${z.bestanden?"✓":(s.nr||s.id)}</span><span class="tx"><b>${s.name}</b><span>${info}</span>${WAS==="blitz"?lvKnoepfe(s):""}</span>
        <span class="kn"><button class="klein" data-ueben="${s.id}">Üben</button><button class="ghost klein" data-test="${s.id}"${WAS==="mix"?' style="border-color:#f59e0b;color:#fde68a"':""}>${WAS==="mix"?"Check ⭐×2":WAS==="blitz"?"⚡ Blitz":"Test"}</button></span></div>`; }).join("")+

      (WAS==="mix" ? `<div class="info" style="margin-bottom:8px;border:1px solid rgba(245,158,11,.5)">📝 <b>Der Check</b> zeigt dir, was du schon sicher kannst und was du vergessen hast. Der <b>erste Check am Tag</b> bringt <b>doppelte Sterne und doppelt Sprit</b> – auch wenn nicht alles richtig ist (ab der Hälfte richtiger Aufgaben).</div>` : "");
    if(WAS==="blitz") $("stufen").insertAdjacentHTML("afterbegin", `<div class="blitzKl">${[0,1,2,3,4].map(k=>`<button class="klein${k===BLITZ_KL?"":" ghost"}" data-bkl="${k}">${k?"Klasse "+k:"Alle"}</button>`).join("")}</div>`);
    if(WAS==="blitz") $("stufen").querySelectorAll("[data-bkl]").forEach(b=>b.addEventListener("click",()=>{ BLITZ_KL=+b.dataset.bkl; try{ localStorage.setItem("blitz_klasse",String(BLITZ_KL)); }catch(e){} zeigeMenue(); }));
    if(WAS==="blitz") $("stufen").insertAdjacentHTML("afterbegin", `<div class="info" style="margin-bottom:10px;border:1px solid rgba(251,191,36,.5)">⚡ <b>So geht der Blitz:</b> Du hast <b>eine Minute</b>. Rechne so viele Aufgaben, wie du schaffst – Antwort tippen, Enter drücken, schon kommt die nächste. Schaffst du das <b>Ziel</b> mit höchstens 2 Fehlern, gibt es Gold. Am besten jeden Tag ein, zwei Blitze!</div>`);
    $("stufen").querySelectorAll("[data-lvst]").forEach(b=>b.addEventListener("click",()=>{ BL_WAHL[+b.dataset.lvst]=+b.dataset.lv; zeigeMenue(); }));
    $("stufen").querySelectorAll("[data-ueben]").forEach(b=>b.addEventListener("click",()=>starte(stufe(+b.dataset.ueben),"Training")));
    $("stufen").querySelectorAll("[data-test]").forEach(b=>b.addEventListener("click",()=>starte(stufe(+b.dataset.test),"Test")));
    if(WAS==="zoo" && window.Zoo){
      $("stufen").querySelectorAll("[data-test]").forEach(b=>b.remove());
      $("stufen").querySelectorAll("[data-ueben]").forEach(b=>{ b.textContent="Runde spielen ▶"; });
      // der Zoo steht oben; ein Knopf springt gleich zu den Runden, damit niemand lange blättern muss
      $("zooFeld").innerHTML=`<button id="zooLos" style="width:100%;font-size:19px;padding:15px;margin-bottom:14px">▶ Neue Tiere holen</button>`+Zoo.feldHTML(Zoo.zaehle(MEINE), "🦁 Mein Zoo");
      $("zooLos").addEventListener("click", ()=>{ try{ $("stufen").scrollIntoView({behavior:"smooth", block:"center"}); }catch(e){ $("stufen").scrollIntoView(); } });
    }
    entdeckenKarte();
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
  window.Groessen={ fertig, blitzStufe(v){ BL=v; }, get BL(){ return BL; }, sterneLv, stufeWahl, STUFEN, BAU, baueAufgabe, starte, stufe, zeigeMenue, get runde(){ return runde; }, get MEINE(){ return MEINE; }, set MEINE(v){ MEINE=v; }, ohneDb(){ db=null; },
                    komma, euroCent, zerlege, linealBild, geldBild, gewText, tText, ziffern, THEMA };
})();
