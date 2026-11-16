// ===== Größen: Geld, Längen und Gewichte =====
// Gemeinsamer Motor für geld-trainer.html, laengen-trainer.html und gewichte-trainer.html (window.GROESSE = "geld" | "laengen" | "gewichte").
// Jede Aufgabe ist eine von drei Arten:
//   eingabe – ein oder zwei Zahlenfelder mit Einheit (3 € 45 ct)
//   wahl    – eine von mehreren Antworten antippen
//   legen   – einen Betrag mit Münzen und Scheinen selbst legen
(function(){
  const WAS=["laengen","gewichte","zahlen","geo","daten"].includes(window.GROESSE) ? window.GROESSE : "geld";
  const KEY="HL-GH7G-3T7W-N5S5-BV3C";
  const CONF={ apiKey:"AIzaSyC8EzUrPYV3j6tsgFIR3LQBlF5YLLZgkQI", authDomain:"mathe-trainer-5ad4f.firebaseapp.com",
               projectId:"mathe-trainer-5ad4f", appId:"1:322708616948:web:cafd973192eb25a459d0a1" };
  const APP=WAS, PRO_RUNDE=10, BESTANDEN=90, TEST_SEK=45;
  const TITEL = { geld:["💶","Geld","Münzen und Scheine zählen, umwandeln, bezahlen."], gewichte:["⚖️","Gewichte","Wiegen, schätzen, umwandeln und mit Gewichten rechnen."],
    laengen:["📏","Längen","Messen, umwandeln und mit Längen rechnen."], zahlen:["🔢","Zahlen bis 1000","Stellenwerte, Zahlenstrahl, vergleichen und runden."],
    geo:["📐","Formen und Körper","Flächen und Körper erkennen, Symmetrie, Umfang und Fläche."], daten:["📊","Daten und Zufall","Strichlisten und Diagramme lesen – und was ist wahrscheinlich?"] }[WAS];
  const FARBE = { geld:["#facc15","#4a3a0c"], gewichte:["#2dd4bf","#0f3d3a"], laengen:["#60a5fa","#172554"], zahlen:["#a78bfa","#2e1065"], geo:["#38bdf8","#0c4a6e"], daten:["#fb923c","#431407"] }[WAS];
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
  @media (max-width:430px){ body{padding:60px 14px 14px} .stufe{flex-wrap:wrap} .stufe .kn{width:100%;justify-content:flex-start} .eingabe input{width:86px} }`;
  document.head.appendChild(css);
  document.body.insertAdjacentHTML("afterbegin", `<div class="app">
    <h1>${TITEL[0]} ${TITEL[1]}</h1><p class="sub">${TITEL[2]}</p>
    <div id="start" class="card">
      <a class="backbtn" id="menuLink" href="index.html">← Alle Trainer</a>
      <label for="name">Name des Kindes</label><input type="text" id="name" placeholder="z. B. Anna" autocomplete="off">
      <div id="menue" class="hide" style="margin-top:18px">
        <h3>Lernen und üben</h3><div id="stufen"></div>
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
  const STUECKE=[1000,500,200,100,50,20,10,5,2,1];
  function geldBild(v, klein){
    const k=klein?0.82:1;
    if(v>=500){ const f=v===500?["#94a3b8","#475569"]:v===1000?["#f87171","#991b1b"]:["#60a5fa","#1e3a8a"], w=92*k, h=50*k;
      return `<svg width="${w}" height="${h}" viewBox="0 0 92 50"><rect x="1.5" y="1.5" width="89" height="47" rx="6" fill="${f[0]}" stroke="${f[1]}" stroke-width="3"/><rect x="8" y="8" width="20" height="34" rx="3" fill="${f[1]}" opacity=".35"/><text x="58" y="33" text-anchor="middle" font-size="24" font-weight="800" fill="#0f172a">${v/100} €</text></svg>`; }
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
            kg:{e:"kg",f:1000}, g:{e:"g",f:1}, t:{e:"t",f:1000}, kgT:{e:"kg",f:1}, zahl:{e:"",f:1}, quot:{e:"Rest",f:100} };
  const GELD=[
    {id:1, name:"Münzen zählen", kurz:"Wie viele Cent sind das?", typen:["g_cent"]},
    {id:2, name:"Euro und Cent zählen", kurz:"Münzen und Scheine zusammen", typen:["g_euro"]},
    {id:3, name:"Umwandeln und Komma", kurz:"3 € 45 ct = 345 ct = 3,45 €", typen:["g_inCent","g_ausCent","g_kommaLesen","g_kommaWahl"]},
    {id:4, name:"Passend bezahlen", kurz:"Lege den Betrag mit Münzen", typen:["g_legen"]},
    {id:5, name:"Einkaufen und Rückgeld", kurz:"zusammenrechnen · wie viel bekommst du zurück?", typen:["g_einkauf","g_rueckgeld","g_einkauf","g_rueckgeld","g_legen"]}
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
    {id:5, name:"Tonnen", kurz:"1 t = 1000 kg · für Klasse 4", typen:["w_tInKg","w_kgAusT","w_schaetzenT","w_lkw"]}
  ];
  const ZAHLEN=[
    {id:1, name:"Zehner und Einer", kurz:"3 Zehner und 7 Einer = 37", typen:["z_ze","z_stelle2","z_ze"]},
    {id:2, name:"Nachbarzahlen und Zahlenstrahl", kurz:"Vorgänger · Nachfolger · Nachbarzehner", typen:["z_vorNach","z_zehnerNachbar","z_strahl","z_vorNach","z_strahl"]},
    {id:3, name:"Vergleichen", kurz:"größer, kleiner oder gleich: 47 ☐ 74", typen:["z_vergleich","z_groesste","z_vergleich"]},
    {id:4, name:"Verdoppeln, halbieren, gerade und ungerade", kurz:"das Doppelte von 35 · die Hälfte von 70", typen:["z_doppelt","z_haelfte","z_gerade"]},
    {id:5, name:"Hunderter, Zehner, Einer", kurz:"Zahlen bis 1000 · 3 H 5 E = 305", typen:["z_hze","z_stelle3","z_vorNach1000","z_strahl1000"]},
    {id:6, name:"Runden", kurz:"auf Zehner und auf Hunderter", typen:["z_rundeZ","z_rundeH","z_rundeZ"]},
    {id:7, name:"Teilen mit Rest", kurz:"17 ÷ 5 = 3 Rest 2", typen:["z_rest"]}
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
  const STUFEN = {geld:GELD, gewichte:GEWICHTE, laengen:LAENGEN, zahlen:ZAHLEN, geo:GEO, daten:DATEN}[WAS];
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
  function eingabe(frage, felder, soll, o){ return Object.assign({art:"eingabe", frage, felder, soll}, o); }
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
    const liste=[], quelle = typen && typen.length ? typen : st.typen;
    for(let i=0;i<PRO_RUNDE;i++) liste.push(baueAufgabe(st, quelle[i%quelle.length]));
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
      $("buehne").innerHTML=bild+`<div class="eingabe">${a.felder.map((f,i)=>`<input type="text" id="feld${i}" inputmode="numeric" autocomplete="off" maxlength="5" placeholder="?"><span>${f.e}</span>`).join("")}<button id="okBtn">OK</button></div>`;
      const felder=a.felder.map((f,i)=>$("feld"+i));
      const pruef=()=>{
        if(wartet) return;
        if(felder.every(x=>x.value.trim()==="")) return;
        const werte=felder.map(x=>x.value.trim()===""?0:parseInt(x.value,10)||0), summe=werte.reduce((s,w,i)=>s+w*a.felder[i].f,0);
        felder.forEach(x=>x.disabled=true); $("okBtn").disabled=true;
        const text=werte.map((w,i)=>`${w} ${a.felder[i].e}`).join(" ");
        // „streng": bei zwei Feldern muss richtig getauscht sein (nicht 0 € 345 ct)
        const getauscht = a.felder.length<2 || werte[1] < a.felder[0].f/a.felder[1].f;
        auswerten(a, summe===a.soll && (getauscht || !a.streng), text, summe, summe===a.soll && !getauscht);
      };
      $("okBtn").addEventListener("click", pruef);
      felder.forEach((x,i)=>x.addEventListener("keydown", e=>{ if(e.key!=="Enter") return; if(i<felder.length-1 && x.value.trim()!=="" && felder[i+1].value.trim()==="") felder[i+1].focus(); else pruef(); }));
      try{ felder[0].focus({preventScroll:true}); }catch(e){}
    }else if(a.art==="wahl"){
      $("buehne").innerHTML=bild+`<div class="wahl"${a.optionen.length===3?' style="grid-template-columns:1fr 1fr 1fr"':""}>${a.optionen.map((o,i)=>`<button data-i="${i}">${o}</button>`).join("")}</div>`;
      $("buehne").querySelectorAll(".wahl button").forEach(b=>b.addEventListener("click",()=>{
        if(wartet) return;
        const o=a.optionen[+b.dataset.i];
        $("buehne").querySelectorAll(".wahl button").forEach((x,i)=>{ x.disabled=true; if(a.optionen[i]===a.ok) x.classList.add("richtig"); });
        if(o!==a.ok) b.classList.add("falsch");
        auswerten(a, o===a.ok, o, null, false);
      }));
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
    if(a.falle && summe===a.falle){ art="groesse_ablesen"; }
    if(a.streng && summe===a.soll && !nichtGetauscht===false) zusatz="";
    if(a.art==="legen" && summe!==null) zusatz=` Du hast ${komma(summe)} gelegt – das ist ${summe>a.soll?"zu viel":"zu wenig"}.`;
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
    zeitRest=TEST_SEK; $("zeitfuell").style.width="100%";
    timer=setInterval(()=>{ zeitRest-=0.25; $("zeitfuell").style.width=Math.max(0,zeitRest/TEST_SEK*100)+"%";
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
        <span class="kn"><button class="klein" data-ueben="${s.id}">Üben</button><button class="ghost klein" data-test="${s.id}">Test</button></span></div>`; }).join("");
    $("stufen").querySelectorAll("[data-ueben]").forEach(b=>b.addEventListener("click",()=>starte(stufe(+b.dataset.ueben),"Training")));
    $("stufen").querySelectorAll("[data-test]").forEach(b=>b.addEventListener("click",()=>starte(stufe(+b.dataset.test),"Test")));
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
                    komma, euroCent, zerlege, linealBild, geldBild, gewText, tText };
})();
