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
    {app:"uhr",             ic:"🕒", name:"Uhr",           datei:"uhr-trainer.html"},
    {app:"sach",            ic:"📖", name:"Sachaufgaben",  datei:"sach-trainer.html"},
    {app:"platz",           ic:"🔍", name:"Fehlende Zahl", datei:"platz-trainer.html"},
    {app:"geld",            ic:"💶", name:"Geld",          datei:"geld-trainer.html"},
    {app:"laengen",         ic:"📏", name:"Längen",        datei:"laengen-trainer.html"},
    {app:"gewichte",        ic:"⚖️", name:"Gewichte",      datei:"gewichte-trainer.html"},
    {app:"schrift",         ic:"✍️", name:"Schriftlich rechnen", datei:"schrift-trainer.html"},
    {app:"kalender",        ic:"📅", name:"Kalender und Zeit", datei:"kalender-trainer.html"},
    {app:"mix",             ic:"🎲", name:"Bunte Mischung", datei:"mix-trainer.html"},
    {app:"zoo",             ic:"🦁", name:"Mein Zoo", datei:"zoo-trainer.html"},
    {app:"blitz",           ic:"⚡", name:"Blitzrechnen", datei:"blitz-trainer.html"},
    {app:"sach2",           ic:"📚", name:"Sachaufgaben in zwei Schritten", datei:"sach2-trainer.html"},
    {app:"zahlen",          ic:"🔢", name:"Zahlen bis 1000", datei:"zahlen-trainer.html"},
    {app:"strahl",          ic:"📍", name:"Zahlenstrahl", datei:"strahl-trainer.html"},
    {app:"geo",             ic:"📐", name:"Formen und Körper", datei:"geo-trainer.html"},
    {app:"daten",           ic:"📊", name:"Daten und Zufall", datei:"daten-trainer.html"}
  ];
  // Genauer: eine bestimmte Übung innerhalb eines Bereichs. feld = Feld im gespeicherten Durchgang, an dem man sie erkennt.
  const TEILE={
    halbschriftlich:{feld:"verfahren", liste:[["schrittAdd20","Plus über den Zehner bis 20"],["schrittSub20","Minus über den Zehner bis 20"],["schrittAdd","Schrittweise plus"],
                     ["stellenAdd","Stellenweise plus"],["schrittSub","Schrittweise minus"],["malZehner","Mal mit Zehnerzahlen (6 × 20)"],["malZerlegen","Mal mit Zerlegen (6 × 15)"]]},
    plus:    {feld:"zr", liste:[["20","bis 20"],["100","bis 100"],["1000","bis 1000"]]},
    minus:   {feld:"zr", liste:[["20","bis 20"],["100","bis 100"],["1000","bis 1000"]]},
    zerlegen:{feld:"zr", liste:[["10","bis 10"],["20","bis 20"],["100","bis 100"]]},
    geld:    {feld:"zr", liste:[["1","Münzen zählen"],["2","Euro und Cent zählen"],["3","Umwandeln und Komma"],["4","Passend bezahlen"],["5","Einkaufen und Rückgeld"],["6","Kommazahlen sicher schreiben"],["7","Mit Kommazahlen rechnen"],["8","Malnehmen und Teilen mit Geld"],["9","Schriftlich rechnen mit Komma"],["10","Große Geldbeträge"]]},
    schrift: {feld:"zr", liste:[["1","Plus ohne Übertrag"],["2","Plus mit Übertrag"],["3","Plus mit drei Zahlen"],["4","Minus ohne Entbündeln"],["5","Minus mit Entbündeln"],["6","Minus über die Null"],["7","Malnehmen"],["8","Teilen: jede Stelle geht auf"],["9","Teilen mit Herunterholen"],["10","Teilen mit Rest"]]},
    sach2:   {feld:"zr", liste:[["1","Was war am Anfang?"],["2","Zwei Schritte: Plus und Minus"],["3","Zwei Schritte: erst Mal, dann Plus oder Minus"],["4","Zwei Schritte: zusammenzählen und teilen"],["5","Alles gemischt"]]},
    blitz:   {feld:"zr", liste:[["20","Wie viele? Das Zwanzigerfeld"],["21","Immer 10"],["22","Immer 20"],["23","Nachbarzahlen bis 20"],["24","Verdoppeln und halbieren bis 20"],["25","Einfache Plus- und Minusaufgaben bis 20"],["26","Zählen in Schritten bis 20"],["34","Blitz-Mix Klasse 1"],["27","Wie viele? Zehner und Einer"],["1","Zählen in Schritten bis 100"],["2","Ergänzen zum Zehner und bis 100"],["3","Verdoppeln und halbieren bis 100"],["4","Einfache Plus- und Minusaufgaben bis 100"],["5","Kernaufgaben: mal 1, 2, 5 und 10"],["35","Blitz-Mix Klasse 2"],["6","Blitz-Einmaleins"],["7","Einmaleins – auch umgekehrt"],["28","Wie viele? Hunderter, Zehner, Einer"],["29","Welche Zahl? Die Stellentafel"],["8","Zählen in Schritten bis 1000"],["9","Ergänzen bis 1000"],["30","1000 teilen"],["10","Verdoppeln und halbieren bis 1000"],["11","Einfache Plus- und Minusaufgaben bis 1000"],["12","Zehner-Einmaleins – auch umgekehrt"],["13","Mal 10 und durch 10"],["38","Nachbarzehner und Nachbarhunderter"],["39","Bündeln: H, Z und E"],["40","Plus und Minus mit Übergang bis 1000"],["41","Zählen in Schritten – für Profis"],["36","Blitz-Mix Klasse 3"],["31","Zahlen lesen und schreiben"],["32","Die Stellentafel bis 1 Million"],["14","Zählen in Schritten bis 1 Million"],["33","Stufenzahlen subtrahieren"],["15","Verdoppeln und halbieren bis 1 Million"],["16","Stufenzahlen teilen"],["17","Stellen-Einmaleins – auch umgekehrt"],["18","Ergänzen bis 1 Million"],["19","Plus und Minus mit großen Zahlen"],["37","Blitz-Mix Klasse 4"]]},
    mix:     {feld:"zr", liste:[["1","Klasse 1 – bunt gemischt"],["7","Klasse 2 – Leicht"],["5","Klasse 2 – Mittel"],["2","Klasse 2 – Profi"],["8","Klasse 3 – Leicht"],["6","Klasse 3 – Mittel"],["3","Klasse 3 – Profi"],["4","Vorschau auf Klasse 4"]]},
    kalender:{feld:"zr", liste:[["1","Wochentage und Monate"],["2","Wie lang ist ein Monat?"],["3","Stunden und Minuten"],["4","Sekunden, Stunden, Tage"],["5","Mit dem Datum rechnen"],["6","Umwandeln mit allen Zahlen"],["7","Wie spät ist es in …? Wie spät war es vor …?"],["8","Wie viel Zeit ist vergangen?"],["9","Zeit in Sachaufgaben"],["10","Uhr: zwei Uhrzeiten, drei Schreibweisen"]]},
    strahl:  {feld:"zr", liste:[["1","Zahlenstrahl bis 100 ablesen"],["2","Wie viele Schritte sind es?"],["3","Wie groß ist ein Schritt?"],["4","Die Zahl am Pfeil finden"],["5","Zahlenstrahl bis 1000 ablesen"],["6","Schritt finden bis 1000"],["7","Zahlenstrahl bis 1 Million"]]},
    zahlen:  {feld:"zr", liste:[["1","Zehner und Einer"],["2","Nachbarzahlen und Zahlenstrahl"],["3","Zahlenstrahl: Wie groß ist ein Schritt?"],["4","Vergleichen"],["5","Verdoppeln, halbieren, gerade und ungerade"],["6","Hunderter, Zehner, Einer"],["7","Zahlenstrahl bis 1000"],["8","Runden"],["9","Teilen mit Rest"],["10","Bis 1 Million: Stellenwerte"],["11","Bis 1 Million: Nachbarn und Zahlenstrahl"],["12","Bis 1 Million: vergleichen und runden"],["13","Bis 1 Million: rechnen mit großen Zahlen"]]},
    geo:     {feld:"zr", liste:[["1","Flächen erkennen"],["2","Ecken und Seiten"],["3","Körper erkennen"],["4","Ecken, Kanten, Flächen"],["5","Symmetrie"],["6","Umfang und Fläche"]]},
    daten:   {feld:"zr", liste:[["1","Strichlisten"],["2","Diagramme lesen"],["3","Mit Diagrammen rechnen"],["4","Sicher, möglich, unmöglich"],["5","Kombinieren"]]},
    gewichte:{feld:"zr", liste:[["1","Leicht oder schwer?"],["2","Mit Gewichtsstücken wiegen"],["3","Gramm und Kilogramm"],["4","Mit Gewichten rechnen"],["5","Tonnen"],["6","Liter und Milliliter"]]},
    laengen: {feld:"zr", liste:[["1","Mit dem Lineal messen"],["2","Zentimeter und Millimeter"],["3","Meter und Zentimeter"],["4","Welche Einheit passt?"],["5","Mit Längen rechnen"]]},
    platz:   {feld:"zr", liste:[["1","Fachwörter: Plus und Minus"],["2","Fachwörter: Mal und Geteilt"],["3","Fehlende Zahl bei Plus"],["4","Fehlende Zahl bei Minus"],["5","Fehlende Zahl bei Mal und Geteilt"],["6","Alles gemischt – mit Fachwörtern"]]},
    sach:    {feld:"zr", liste:[["1","Plus und Minus bis 20"],["2","Plus und Minus bis 100"],["3","Mal und Geteilt"],["4","Alle vier Rechenarten"],["5","Mit unnötigen Angaben"]]},
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
  // Startseite des Kindes (24.11.2026): nur noch eine schmale Zeile – die Liste öffnet sich als Fenster
  let LETZT=null;
  function stil(){
    if(!document.getElementById("haStil")){
      const s=document.createElement("style"); s.id="haStil";
      s.textContent=`
      .haBox{display:flex;align-items:center;gap:10px;background:rgba(56,189,248,.10);border:2px solid rgba(56,189,248,.5);border-radius:14px;padding:9px 13px;margin:0 0 14px;text-align:left;cursor:pointer;-webkit-tap-highlight-color:transparent}
      .haBox:hover{border-color:#38bdf8}
      .haBox .haT{flex:1;margin:0}
      .haBox .haZ{flex:none;font-weight:800;font-size:13.5px;border-radius:999px;padding:4px 11px;white-space:nowrap;background:#38bdf8;color:#042433}
      .haBox.spaet .haZ{background:#f59e0b;color:#3b2300}
      .haBox.fertig .haZ{background:#22c55e;color:#04220f}
      .haBox .haPf{flex:none;color:#7dd3fc;font-size:20px;line-height:1}
      .haT{font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#7dd3fc;margin-bottom:8px}
      .haHg{position:fixed;inset:0;z-index:9000;background:rgba(2,6,23,.72);display:flex;align-items:center;justify-content:center;padding:16px}
      .haFe{background:#111a2e;border:2px solid rgba(56,189,248,.55);border-radius:18px;padding:16px;width:100%;max-width:520px;max-height:86vh;overflow:auto;box-shadow:0 20px 60px rgba(0,0,0,.5);text-align:left}
      .haKopf{display:flex;align-items:center;gap:10px;margin-bottom:4px}
      .haKopf .haT{flex:1;margin:0;font-size:14px}
      .haZu{flex:none;background:#1e293b;border:1px solid #334155;color:#e2e8f0;border-radius:999px;width:36px;height:36px;font-size:18px;cursor:pointer}
      .haZu:hover{border-color:#38bdf8}
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
  }
  function kastenHTML(liste, name, rows){
    const l=fuerKind(liste, name); if(!l.length){ LETZT=null; return ""; }
    stil(); LETZT={liste, name, rows};
    const st=l.map(a=>stand(a,rows)), offen=st.filter(s=>!s.fertig).length, spaet=st.some(s=>!s.fertig && s.ueberfaellig);
    const zahl = !offen ? "✅ alles erledigt" : (spaet?"⏰ ":"")+(offen===1?"1 offen":`${offen} offen`);
    return `<div class="haBox${!offen?" fertig":spaet?" spaet":""}" role="button" tabindex="0" onclick="HA.oeffnen()" onkeydown="if(event.key==='Enter')HA.oeffnen()">`+
      `<span class="haT">📌 ${l.length===1?"Hausaufgabe":"Hausaufgaben"}</span><span class="haZ">${zahl}</span><span class="haPf">›</span></div>`;
  }
  function schliessen(){ const h=document.getElementById("haHg"); if(h) h.remove(); document.removeEventListener("keydown", esc_); }
  function esc_(e){ if(e.key==="Escape") schliessen(); }
  addEventListener("pagehide", ()=>schliessen());    // sonst kommt das Fenster mit „Zurück" offen aus dem Cache
  function oeffnen(){
    if(!LETZT) return; schliessen(); stil();
    const {liste, name, rows}=LETZT, l=fuerKind(liste, name);
    const offen=l.filter(a=>!stand(a,rows).fertig).length;
    const h=document.createElement("div"); h.className="haHg"; h.id="haHg";
    h.innerHTML=`<div class="haFe" role="dialog" aria-modal="true"><div class="haKopf"><span class="haT">📌 ${l.length===1?"Hausaufgabe":"Hausaufgaben"} von deiner Lehrkraft${offen?"":" – alles erledigt 🎉"}</span>`+
      `<button class="haZu" aria-label="Schließen">✕</button></div>`+listeHTML(l, name, rows)+`</div>`;
    h.addEventListener("click", e=>{ if(e.target===h || e.target.closest(".haZu")) schliessen(); });
    document.body.appendChild(h); document.addEventListener("keydown", esc_);
  }
  function listeHTML(l, name, rows){
    return l.map(a=>{ const b=bereich(a.app), s=stand(a,rows);
        const pille = s.fertig ? "✅ erledigt" : s.ueberfaellig ? `⏰ ${s.gemacht} von ${s.noetig}` : `${s.gemacht} von ${s.noetig}`;
        return `<a class="haP${s.fertig?" fertig":s.ueberfaellig?" spaet":""}" data-emp="${b.app}" href="${b.datei}#name=${encodeURIComponent(name)}">
          <span class="h1">${b.ic}</span>
          <span class="h2"><b>${esc(titel(a))}</b>${s.fertig?"Geschafft – super!":s.ueberfaellig?`war bis ${schoen(a.bis)} auf – hol es noch nach!`:`bis ${schoen(a.bis)}`}${a.text?` · ${esc(a.text)}`:""}</span>
          <span class="h3">${pille}</span></a>`; }).join("");
  }
  return {BEREICHE, TEILE, teilName, bereich, titel, stand, gilt, aktuell, fuerKind, kastenHTML, oeffnen, schliessen, heute, plusTage, schoen};
})();
