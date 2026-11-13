// ===== Hausaufgaben =====
// Die Lehrkraft gibt in der Klassenübersicht eine Aufgabe auf („bis Freitag 2 Runden Minus").
// Gespeichert wird die Liste in einstellungen/freigabe (Feld „aufgaben"). Ob ein Kind fertig ist, wird nicht gespeichert,
// sondern jedes Mal aus seinen Durchgängen berechnet – es gibt also nichts abzuhaken und nichts zu schummeln.
window.HA=(function(){
  const BEREICHE=[
    {app:"zerlegen",        ic:"🧩", name:"Zerlegen",      datei:"zerlegen-trainer.html"},
    {app:"halbschriftlich", ic:"🪜", name:"Rechenwege",    datei:"halbschriftlich-trainer.html"},
    {app:"plus",            ic:"➕", name:"Plus",          datei:"plus-trainer.html"},
    {app:"minus",           ic:"➖", name:"Minus",         datei:"minus-trainer.html"},
    {app:"einmaleins",      ic:"✖️", name:"Einmaleins",    datei:"einmaleins-trainer.html"},
    {app:"einsdurcheins",   ic:"➗", name:"Einsdurcheins", datei:"einsdurcheins-trainer.html"},
    {app:"uhr",             ic:"🕒", name:"Uhr",           datei:"uhr-trainer.html"}
  ];
  // Genauer: eine bestimmte Übung innerhalb eines Bereichs. feld = Feld im gespeicherten Durchgang, an dem man sie erkennt.
  const TEILE={
    halbschriftlich:{feld:"verfahren", liste:[["schrittAdd20","Plus über den Zehner bis 20"],["schrittSub20","Minus über den Zehner bis 20"],["schrittAdd","Schrittweise plus"],
                     ["stellenAdd","Stellenweise plus"],["schrittSub","Schrittweise minus"],["malZehner","Mal mit Zehnerzahlen (6 × 20)"],["malZerlegen","Mal mit Zerlegen (6 × 15)"]]},
    plus:    {feld:"zr", liste:[["20","bis 20"],["100","bis 100"],["1000","bis 1000"]]},
    minus:   {feld:"zr", liste:[["20","bis 20"],["100","bis 100"],["1000","bis 1000"]]},
    zerlegen:{feld:"zr", liste:[["10","bis 10"],["20","bis 20"],["100","bis 100"]]},
    uhr:     {feld:"zr", liste:[["1","Nur der kleine Zeiger"],["2","Volle und halbe Stunden"],["3","Viertel nach und Viertel vor"],["4","Fünf-Minuten-Schritte"],["5","Auf die Minute genau"],
                     ["6","Vormittag und Nachmittag"],["8","Die Zeit vergeht"],["7","Fünf vor halb, zehn nach …"]]}
  };
  function teilName(a){ const t=TEILE[a.app]; if(!t || !a.teil) return ""; const x=t.liste.find(y=>y[0]===String(a.teil)); return x ? x[1] : ""; }
  const bereich=app=>BEREICHE.find(b=>b.app===app) || {app, ic:"📌", name:app, datei:"index.html"};
  const iso=datum=>{ const [t,m,j]=String(datum||"").split("."); return j&&m&&t ? `${j}-${m}-${t}` : ""; };
  function heute(){ const d=new Date(), p=x=>String(x).padStart(2,"0"); return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`; }
  function plusTage(isoTag, n){ const d=new Date(isoTag+"T12:00:00"); d.setDate(d.getDate()+n); const p=x=>String(x).padStart(2,"0"); return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`; }
  function schoen(isoTag){ const d=new Date(isoTag+"T12:00:00"); return ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"][d.getDay()]+", "+d.getDate()+"."+(d.getMonth()+1)+"."; }
  function zaehlt(e){
    if(e.modus==="Test" && e.bestanden==="Ja") return true;
    return (+e.richtig||0) >= (e.app==="halbschriftlich" ? 5 : 8);
  }
  // Was genau zu tun ist, als kurzer Satz
  function titel(a){
    const b=bereich(a.app), n=a.art==="test" ? 1 : Math.max(1,+a.anzahl||1);
    const tn=teilName(a), wo = tn ? `${b.name}: ${tn}` : b.name;
    if(a.art==="test") return `Einen Test bestehen – ${wo}`;
    if(a.art==="mine") return `${n} ${n===1?"Runde":"Runden"} „Meine Aufgaben“ bei ${b.name}`;
    return `${n} ${n===1?"Runde":"Runden"} üben – ${wo}`;
  }
  // rows: alle Durchgänge des Kindes
  function stand(a, rows){
    const noetig = a.art==="test" ? 1 : Math.max(1,+a.anzahl||1);
    const t=TEILE[a.app], genau = t && a.teil && a.art!=="mine";           // „Meine Aufgaben" mischen die Übungen
    const pass=(rows||[]).filter(e=>e.app===a.app && iso(e.datum)>=a.von && zaehlt(e) && (!genau || String(e[t.feld])===String(a.teil)));
    const gemacht = a.art==="test" ? pass.filter(e=>e.modus==="Test" && e.bestanden==="Ja").length
                  : a.art==="mine" ? pass.filter(e=>String(e.reihe)==="mine").length : pass.length;
    return {gemacht:Math.min(gemacht,noetig), noetig, fertig:gemacht>=noetig, ueberfaellig: heute()>a.bis};
  }
  function gilt(a, name){ return !a.fuer || !a.fuer.length || a.fuer.map(x=>String(x).toLowerCase()).includes(String(name).toLowerCase()); }
  // Sichtbar bleibt eine Aufgabe bis drei Tage nach dem Abgabetag
  function aktuell(a){ return !!a && !!a.bis && heute()<=plusTage(a.bis,3); }
  function fuerKind(liste, name){ return (liste||[]).filter(a=>aktuell(a) && gilt(a,name)).sort((x,y)=>x.bis.localeCompare(y.bis)); }
  function esc(s){ return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
  // Kasten für die Startseite des Kindes
  function kastenHTML(liste, name, rows){
    const l=fuerKind(liste, name); if(!l.length) return "";
    if(!document.getElementById("haStil")){
      const s=document.createElement("style"); s.id="haStil";
      s.textContent=`
      .haBox{background:rgba(56,189,248,.10);border:2px solid rgba(56,189,248,.5);border-radius:16px;padding:12px 14px;margin:0 0 14px;text-align:left}
      .haT{font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#7dd3fc;margin-bottom:8px}
      a.haP{display:flex;align-items:center;gap:11px;background:#0b1220;border:1px solid #334155;border-radius:13px;padding:11px 13px;margin-top:7px;text-decoration:none;color:#f1f5f9}
      a.haP:hover{border-color:#38bdf8}
      .haP .h1{font-size:26px;flex:none;line-height:1}
      .haP .h2{flex:1;min-width:0;font-size:13.5px;line-height:1.45;color:#cbd5e1}
      .haP .h2 b{display:block;font-size:15.5px;color:#fff}
      .haP .h3{flex:none;font-weight:800;font-size:13.5px;border-radius:999px;padding:5px 11px;white-space:nowrap;background:#38bdf8;color:#042433}
      .haP.fertig{opacity:.75} .haP.fertig .h3{background:#22c55e;color:#04220f}
      .haP.spaet .h3{background:#f59e0b;color:#3b2300}`;
      document.head.appendChild(s);
    }
    const offen=l.filter(a=>!stand(a,rows).fertig).length;
    return `<div class="haBox"><div class="haT">📌 ${l.length===1?"Hausaufgabe":"Hausaufgaben"} von deiner Lehrkraft${offen?"":" – alles erledigt 🎉"}</div>`+
      l.map(a=>{ const b=bereich(a.app), s=stand(a,rows);
        const pille = s.fertig ? "✅ erledigt" : s.ueberfaellig ? `⏰ ${s.gemacht} von ${s.noetig}` : `${s.gemacht} von ${s.noetig}`;
        return `<a class="haP${s.fertig?" fertig":s.ueberfaellig?" spaet":""}" data-emp="${b.app}" href="${b.datei}#name=${encodeURIComponent(name)}">
          <span class="h1">${b.ic}</span>
          <span class="h2"><b>${esc(titel(a))}</b>${s.fertig?"Geschafft – super!":s.ueberfaellig?`war bis ${schoen(a.bis)} auf – hol es noch nach!`:`bis ${schoen(a.bis)}`}${a.text?` · ${esc(a.text)}`:""}</span>
          <span class="h3">${pille}</span></a>`; }).join("")+`</div>`;
  }
  return {BEREICHE, TEILE, teilName, bereich, titel, stand, gilt, aktuell, fuerKind, kastenHTML, heute, plusTage, schoen};
})();
