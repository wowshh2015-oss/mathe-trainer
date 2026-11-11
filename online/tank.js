// ===== Der Tank: Spiele kosten Sprit, Lernen füllt ihn auf =====
// Rallye-Runde = 1, Marathon-Etage = 2. Aufgefüllt wird nur auf dem Lernweg.
// Der Stand wird jedes Mal aus den gespeicherten Durchgängen berechnet – es gibt nichts, was man
// verstellen könnte, und er stimmt auf jedem Gerät.
window.Tank=(function(){
  const STICHTAG="20261112";        // ab diesem Tag wird gerechnet (JJJJMMTT)
  const START=20;                   // Startguthaben für alle
  const KOSTEN_ETAGE=2;
  const STATIONEN=[
    {app:"zerlegen",        ic:"🧩", name:"Zerlegen",      datei:"zerlegen-trainer.html"},
    {app:"halbschriftlich", ic:"🪜", name:"Rechenwege",    datei:"halbschriftlich-trainer.html"},
    {app:"plus",            ic:"➕", name:"Plus",          datei:"plus-trainer.html"},
    {app:"minus",           ic:"➖", name:"Minus",         datei:"minus-trainer.html"},
    {app:"einmaleins",      ic:"✖️", name:"Einmaleins",    datei:"einmaleins-trainer.html"},
    {app:"einsdurcheins",   ic:"➗", name:"Einsdurcheins", datei:"einsdurcheins-trainer.html"}
  ];
  const LERN=STATIONEN.map(s=>s.app);
  // Was eine Lernrunde bringt
  const W={neu:20, test:30, fehler:15, training:10}, PRO_TAG=3;

  function tag(e){ const p=String(e.datum||"").split("."); return (p[2]||"")+(p[1]||"")+(p[0]||""); }
  function ts(e){ return tag(e)+String(e.zeit||"").replace(":",""); }
  function tageHer(e){ const p=String(e.datum||"").split("."), d=new Date(+p[2],(+p[1])-1,+p[0]), h=new Date(); h.setHours(0,0,0,0); return Math.round((h-d)/86400000); }
  function esc(s){ return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
  // Eine Runde zählt nur, wenn wirklich gerechnet wurde
  function zaehlt(e){
    if(e.modus==="Test" && e.bestanden==="Ja") return true;
    return (+e.richtig||0) >= (e.app==="halbschriftlich" ? 5 : 8);
  }
  // rows: alle Durchgänge des Kindes (alle Programme)
  function stand(rows){
    const lern=rows.filter(e=>LERN.includes(e.app)).sort((a,b)=>ts(a).localeCompare(ts(b)));
    const warDa={}, testDa={}, proTag={};
    let verdient=0;
    lern.forEach(e=>{
      if(!zaehlt(e)) return;
      const neu=!warDa[e.app]; warDa[e.app]=true;
      const tk=e.app+"|"+(e.zr||"")+"|"+(e.stufe||"");
      const ersterTest = e.modus==="Test" && e.bestanden==="Ja" && !testDa[tk];
      if(e.modus==="Test" && e.bestanden==="Ja") testDa[tk]=true;
      if(tag(e)<STICHTAG) return;
      if(ersterTest){ verdient+=W.test; return; }               // jeder Test bringt die 30 nur beim ersten Bestehen
      const k=tag(e)+e.app; proTag[k]=(proTag[k]||0)+1;
      if(proTag[k]>PRO_TAG) return;                             // höchstens 3 Runden je Bereich und Tag
      verdient += neu ? W.neu : String(e.reihe)==="mine" ? W.fehler : W.training;
    });
    const runden=rows.filter(e=>e.app==="rallye" && tag(e)>=STICHTAG).reduce((s,e)=>s+(+e.runden||0),0);
    const etagen=rows.filter(e=>e.app==="marathon" && tag(e)>=STICHTAG).length;
    const verbraucht=runden+etagen*KOSTEN_ETAGE;
    // Geschenke der Lehrkraft (Klassenübersicht → „Tank auffüllen"), z. B. für gute Arbeit im Heft
    const gaben=rows.filter(e=>e.app==="tankgeschenk").sort((a,b)=>ts(b).localeCompare(ts(a)));
    const geschenkt=gaben.reduce((s,e)=>s+(+e.menge||0),0);
    const neuestes=gaben.find(e=>(+e.menge||0)>0 && tageHer(e)<=3) || null;
    return {verdient, verbraucht, geschenkt, neuestes, rest:Math.max(0, START+verdient+geschenkt-verbraucht)};
  }
  // Aufgaben, die noch nicht dreimal hintereinander richtig waren (rows: neueste zuerst)
  function offeneFehler(rows){
    const facts=new Set(); rows.forEach(e=>(e.fehler||[]).forEach(f=>facts.add(f)));
    let offen=0;
    facts.forEach(f=>{
      let s=0;
      for(const e of rows){
        if(!(e.gestellt||[]).includes(f)) continue;
        if((e.fehler||[]).includes(f)) break;
        s++; if(s>=3) break;
      }
      if(s<3) offen++;
    });
    return offen;
  }
  // Wo lohnt sich das Tanken für dieses Kind am meisten?
  function angebote(rows){
    const z=STATIONEN.map(s=>{
      const r=rows.filter(e=>e.app===s.app).sort((a,b)=>ts(b).localeCompare(ts(a)));
      return Object.assign({}, s, {n:r.length, offen:offeneFehler(r)+(window.Wdh?Wdh.zaehle(r).faellig:0),
        bestanden:r.some(e=>e.modus==="Test" && e.bestanden==="Ja")});
    });
    const out=[], drin=new Set();
    const nimm=(s,plus,titel,text)=>{ if(!s || drin.has(s.app) || out.length>=3) return; drin.add(s.app); out.push({app:s.app, ic:s.ic, datei:s.datei, plus, titel, text}); };
    const fehler=z.filter(s=>s.offen>0).sort((a,b)=>b.offen-a.offen)[0];
    if(fehler) nimm(fehler, W.fehler, `Meine Aufgaben bei ${fehler.name}`,
      fehler.offen===1 ? "Dort wartet 1 Aufgabe zum Üben oder Wiederholen." : `Dort warten ${fehler.offen} Aufgaben zum Üben oder Wiederholen.`);
    const neu=z.find(s=>!s.n);
    if(neu) nimm(neu, W.neu, `Neu für dich: ${neu.name}`, "Dort warst du noch nie. Mach eine Runde im Trainingsraum!");
    const dran=z.find(s=>!s.bestanden && s.n);
    if(dran) nimm(dran, W.test, `Test bei ${dran.name} bestehen`, "Du hast dort schon geübt – ab 90 % ist der Test geschafft.");
    const irgend=z.find(s=>!drin.has(s.app) && !s.bestanden) || z.find(s=>!drin.has(s.app));
    if(out.length<2) nimm(irgend, W.training, `Eine Runde ${irgend?irgend.name:""}`, "Jede Runde im Trainingsraum füllt den Tank.");
    return out;
  }
  function stil(){
    if(document.getElementById("tkStil")) return;
    const s=document.createElement("style"); s.id="tkStil";
    s.textContent=`
    .tkBox{background:rgba(34,197,94,.10);border:1px solid rgba(34,197,94,.38);border-radius:14px;padding:12px 14px;margin:0 0 12px;text-align:left}
    .tkBox.leer{background:rgba(239,68,68,.10);border-color:rgba(239,68,68,.45)}
    .tkKopf{display:flex;align-items:center;gap:10px;font-size:14px;line-height:1.4;color:#d1fae5}
    .tkBox.leer .tkKopf{color:#fecaca}
    .tkKopf .tkIc{font-size:30px;line-height:1;flex:none}
    .tkKopf b{display:block;font-size:17px;color:#fff}
    .tkBalken{height:9px;border-radius:999px;background:#0b1220;border:1px solid #334155;margin-top:9px;overflow:hidden}
    .tkBalken i{display:block;height:100%;background:linear-gradient(90deg,#f59e0b,#22c55e)}
    .tkTitel{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#94a3b8;margin:12px 0 7px}
    a.tkAng{display:flex;align-items:center;gap:11px;background:#0b1220;border:1px solid #334155;border-radius:13px;padding:11px 13px;
      margin-bottom:7px;text-decoration:none;color:#f1f5f9;transition:.15s}
    a.tkAng:hover{border-color:#22c55e;background:rgba(34,197,94,.08)}
    .tkAng .a1{font-size:25px;flex:none;line-height:1}
    .tkAng .a2{flex:1;min-width:0;font-size:13.5px;line-height:1.4;color:#cbd5e1}
    .tkAng .a2 b{display:block;font-size:15px;color:#fff}
    .tkAng .a3{flex:none;background:#22c55e;color:#04220f;font-weight:800;font-size:15px;border-radius:999px;padding:5px 11px;white-space:nowrap}
    .tkGabe{margin-top:9px;background:rgba(251,191,36,.14);border:1px solid rgba(251,191,36,.4);color:#fde68a;border-radius:10px;padding:7px 11px;font-size:13.5px}
    .tkGabe b{color:#fbbf24}
    .tkKlein{font-size:12.5px;color:#94a3b8;margin-top:4px;line-height:1.45}`;
    document.head.appendChild(s);
  }
  // o: {ic, wort, einheit, kosten, immerAngebote}
  function boxHTML(rows, name, o){
    stil();
    const s=stand(rows), kosten=o.kosten||1, mal=Math.floor(s.rest/kosten), leer=mal<1;
    const ang = (leer || mal<=5 || o.immerAngebote) ? angebote(rows) : [];
    const kopf = leer
      ? `<b>${o.wort} ist leer!</b>Hol dir neuen Sprit auf dem Lernweg – dann geht es sofort weiter.`
      : `<b>${o.wort}: noch ${mal} ${mal===1?o.einheit[0]:o.einheit[1]}</b>${mal<=5?"Gleich leer – tank am besten jetzt schon nach.":"Nachfüllen kannst du jederzeit auf dem Lernweg."}`;
    return `<div class="tkBox${leer?" leer":""}" id="tkBox">
      <div class="tkKopf"><span class="tkIc">${o.ic}</span><span>${kopf}</span></div>
      <div class="tkBalken"><i style="width:${Math.min(100, mal/(40/kosten)*100)}%"></i></div>
      ${s.neuestes?`<div class="tkGabe">🎁 <b>+${Math.floor(s.neuestes.menge/kosten)} ${o.ic}</b> von deiner Lehrkraft${s.neuestes.grund?` – ${esc(s.neuestes.grund)}`:""}</div>`:""}
      ${ang.length?`<div class="tkTitel">Hier kannst du tanken</div>`+ang.map(a=>
        `<a class="tkAng" href="${a.datei}#name=${encodeURIComponent(name)}"><span class="a1">${a.ic}</span>
          <span class="a2"><b>${esc(a.titel)}</b>${esc(a.text)}</span><span class="a3">+${Math.floor(a.plus/kosten)} ${o.ic}</span></a>`).join("")
        +`<div class="tkKlein">Eine Runde zählt, wenn du mindestens 8 Aufgaben richtig hast. Der Tank gilt für Rallye und Marathon zusammen.</div>`:""}
    </div>`;
  }
  return {stand, angebote, boxHTML, STICHTAG, START, KOSTEN_ETAGE};
})();
