// ===== Größen: Geld und Längen =====
// Gemeinsamer Motor für geld-trainer.html und laengen-trainer.html (window.GROESSE = "geld" | "laengen").
// Jede Aufgabe ist eine von drei Arten:
//   eingabe – ein oder zwei Zahlenfelder mit Einheit (3 € 45 ct)
//   wahl    – eine von mehreren Antworten antippen
//   legen   – einen Betrag mit Münzen und Scheinen selbst legen
(function(){
  const WAS=window.GROESSE==="laengen" ? "laengen" : "geld";
  const KEY="HL-GH7G-3T7W-N5S5-BV3C";
  const CONF={ apiKey:"AIzaSyC8EzUrPYV3j6tsgFIR3LQBlF5YLLZgkQI", authDomain:"mathe-trainer-5ad4f.firebaseapp.com",
               projectId:"mathe-trainer-5ad4f", appId:"1:322708616948:web:cafd973192eb25a459d0a1" };
  const APP=WAS, PRO_RUNDE=10, BESTANDEN=90, TEST_SEK=45;
  const TITEL = WAS==="geld" ? ["💶","Geld","Münzen und Scheine zählen, umwandeln, bezahlen."] : ["📏","Längen","Messen, umwandeln und mit Längen rechnen."];
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
  :root{ --bg:#0f172a; --card:#1e293b; --card2:#334155; --text:#f1f5f9; --muted:#94a3b8; --accent:${WAS==="geld"?"#facc15":"#60a5fa"}; --good:#22c55e; --bad:#ef4444; --shadow:0 10px 30px rgba(0,0,0,.35); }
  *{box-sizing:border-box} html,body{margin:0;min-height:100%}
  body{font-family:"Segoe UI",system-ui,-apple-system,Arial,sans-serif;background:radial-gradient(1200px 600px at 50% -10%,${WAS==="geld"?"#4a3a0c":"#172554"} 0%,var(--bg) 60%);
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
  const F={ eur:{e:"€",f:100}, ct:{e:"ct",f:1}, m:{e:"m",f:100}, cmM:{e:"cm",f:1}, cm:{e:"cm",f:10}, mm:{e:"mm",f:1} };
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
  const STUFEN = WAS==="geld" ? GELD : LAENGEN;
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
                    komma, euroCent, zerlege, linealBild, geldBild };
})();
