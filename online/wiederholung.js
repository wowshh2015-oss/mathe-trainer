// ===== Wiederholen mit Abstand + Fehlerarten =====
// 1) Eine Aufgabe, die einmal falsch war, gilt nach 3 richtigen Antworten in Folge als „gelernt".
//    Danach kommt sie nach 2, 7 und 21 Tagen noch je einmal wieder – erst dann sitzt sie dauerhaft.
//    Ein neuer Fehler setzt alles zurück. Berechnet wird das jedes Mal aus den gespeicherten Durchgängen.
// 2) Aus der falschen Antwort lässt sich oft ablesen, WAS schiefging (Zählfehler, Übertrag vergessen …).
window.Wdh=(function(){
  const ABSTAND=[2,7,21];
  function tagZahl(e){ const p=String(e.datum||"").split("."); return Math.round(new Date(+p[2],(+p[1])-1,+p[0]).getTime()/86400000); }
  function ts(e){ const p=String(e.datum||"").split("."); return (p[2]||"")+(p[1]||"")+(p[0]||"")+String(e.zeit||"").replace(":",""); }
  function heute(){ const d=new Date(); d.setHours(0,0,0,0); return Math.round(d.getTime()/86400000); }

  // rows: Durchgänge EINES Kindes in EINEM Programm (Reihenfolge egal)
  function status(rows, k, sortiert){
    const r = sortiert ? rows : rows.filter(e=>Array.isArray(e.gestellt)).slice().sort((a,b)=>ts(a).localeCompare(ts(b)));
    let stufe=0, folge=0, zuletzt=0, warFalsch=false;
    for(const e of r){
      const n=e.gestellt.filter(x=>x===k).length; if(!n) continue;
      if((e.fehler||[]).includes(k)){ stufe=0; folge=0; warFalsch=true; continue; }
      if(!warFalsch) continue;
      if(stufe===0){ folge+=n; if(folge>=3){ stufe=1; zuletzt=tagZahl(e); } }
      else if(stufe<=3 && tagZahl(e)-zuletzt>=ABSTAND[stufe-1]){ stufe++; zuletzt=tagZahl(e); }
    }
    const wartet = stufe>=1 && stufe<=3;
    const inTagen = wartet ? (zuletzt+ABSTAND[stufe-1])-heute() : null;
    return { warFalsch, stufe, offen: warFalsch && stufe===0, faellig: wartet && inTagen<=0, inTagen, sicher: stufe>=4 };
  }
  function zaehle(rows){
    const r=rows.filter(e=>Array.isArray(e.gestellt)).slice().sort((a,b)=>ts(a).localeCompare(ts(b)));
    const facts=new Set(); r.forEach(e=>(e.fehler||[]).forEach(f=>facts.add(f)));
    const z={offen:0, faellig:0, wartet:0, sicher:0, fakten:facts.size};
    facts.forEach(k=>{ const s=status(r,k,true); if(s.offen) z.offen++; else if(s.faellig) z.faellig++; else if(s.sicher) z.sicher++; else z.wartet++; });
    return z;
  }
  function faelligeListe(rows){
    const r=rows.filter(e=>Array.isArray(e.gestellt)).slice().sort((a,b)=>ts(a).localeCompare(ts(b)));
    const facts=new Set(); r.forEach(e=>(e.fehler||[]).forEach(f=>facts.add(f)));
    return [...facts].filter(k=>status(r,k,true).faellig);
  }

  // ===== Fehlerarten =====
  const ART={
    zeit:    "⏱ zu langsam",
    leer:    "∅ nichts eingegeben",
    eins:    "±1 – verzählt",
    zehner:  "±10 – Zehner verrutscht",
    uebertrag:"Übertrag vergessen",
    entbuendeln:"Zehner nicht entbündelt",
    ziffern: "stellenweise „kleinere von größerer“",
    zeichen: "Rechenzeichen verwechselt",
    nachbar: "Nachbaraufgabe (eine Reihe verrutscht)",
    dreher:  "Zahlendreher",
    sonst:   "anderer Fehler",
    // Uhr-Trainer: die Fehlerart steht dort schon im Eintrag
    uhr_vertauscht:"🕒 Zeiger vertauscht",
    uhr_halb:      "🕒 „halb“ falsch verstanden (halb 4 = 3:30)",
    uhr_stunde:    "🕒 Stunde um eins daneben",
    uhr_ziffer:    "🕒 Zahl am großen Zeiger als Minuten gelesen",
    uhr_minute:    "🕒 Minuten falsch abgelesen",
    uhr_tageszeit: "🕒 Vormittag und Nachmittag verwechselt",
    uhr_plus12:    "🕒 Nachmittag: nicht 12 dazugezählt",
    uhr_vornach:   "🕒 „vor“ und „nach“ verwechselt",
    uhr_uebergang: "🕒 Zeitspanne: volle Stunde übersehen",
    uhr_richtung:  "🕒 Zeitspanne: vor und zurück verwechselt",
    // Sachaufgaben
    sach_rechenart:"📖 Sachaufgabe: falsche Rechenart gewählt",
    platz_umkehr:  "🔍 Fehlende Zahl: falsche Umkehrrechnung (plus statt minus oder umgekehrt)",
    platz_rechnen: "🔍 Fehlende Zahl: Rechnung richtig gewählt, aber verrechnet",
    begriff:       "🔍 Fachwort verwechselt (Summand, Minuend, Faktor …)",
    sach_angabe:   "📖 Sachaufgabe: unnötige Zahl verwendet",
    sach_rechnen:  "📖 Sachaufgabe: richtig gewählt, falsch gerechnet",
    // Geld und Längen
    groesse_faktor:   "📏 Umrechnungszahl verwechselt (10 statt 100 oder umgekehrt)",
    groesse_umrechnen:"📏 Einheiten falsch umgewandelt",
    groesse_komma:    "📏 Kommaschreibweise (3 € 5 ct = 3,05 €)",
    groesse_ablesen:  "📏 Lineal: am Ende abgelesen, nicht bei 0 begonnen",
    groesse_messen:   "📏 Lineal falsch abgelesen",
    groesse_einheit:  "📏 Einheit falsch eingeschätzt",
    groesse_zaehlen:  "💶 Geld falsch gezählt",
    groesse_legen:    "💶 Betrag falsch gelegt",
    groesse_rechnen:  "📏 Mit Größen falsch gerechnet"
  };
  function carries(a,b){ return a%10+b%10>=10; }
  // eintrag: "Schlüssel|richtig|gegeben"  z. B. "8+47|55|45"
  function fehlerart(eintrag){
    const t=String(eintrag).split("|"), k=t[0], r=+t[1], g=t[2];
    if(g==="zeit") return "zeit";
    if(t[3]) return ART[t[3]] ? t[3] : ART["uhr_"+t[3]] ? "uhr_"+t[3] : "sonst";
    if(g==="leer" || g==="" || g===undefined) return "leer";
    const v=+g, m=k.match(/^(\d+)\s*([+\-−x×:÷])\s*(\d+)$/);
    let a=0,b=0,op="";
    if(m){ a=+m[1]; b=+m[3]; op = m[2]==="+"?"+": /[\-−]/.test(m[2])?"-": /[x×]/.test(m[2])?"*":"/"; }
    if(op==="+" && v===Math.abs(a-b) || op==="-" && v===a+b || op==="*" && (v===a+b) || op==="/" && (v===a*b || v===a-b)) return "zeichen";
    if(op==="+" && carries(a,b) && v===r-10) return "uebertrag";
    if(op==="-" && (a%10<b%10) && v===r+10) return "entbuendeln";
    if(op==="-" && a>=10 && (a%10<b%10)){
      const z=Math.floor(a/10)-Math.floor(b/10), e=Math.abs(a%10-b%10);
      if(v===z*10+e) return "ziffern";
    }
    if(op==="*" && (v===a*(b+1) || v===a*(b-1) || v===(a+1)*b || v===(a-1)*b)) return "nachbar";
    if(op==="/" && b && (v===r+1 || v===r-1)) return "nachbar";
    if(Math.abs(v-r)===1) return "eins";
    if(Math.abs(v-r)===10) return "zehner";
    if(r>=10 && String(v)===String(r).split("").reverse().join("") && v!==r) return "dreher";
    return "sonst";
  }
  // rows: Durchgänge eines Kindes -> [{art, text, n, beispiele}]
  function fehlerarten(rows){
    const m={};
    rows.forEach(e=>(e.antworten||[]).forEach(x=>{
      const a=fehlerart(x), t=String(x).split("|");
      if(!m[a]) m[a]={art:a, text:ART[a], n:0, beispiele:[]};
      m[a].n++;
      if(m[a].beispiele.length<3 && a!=="zeit" && a!=="leer") m[a].beispiele.push(`${t[0]} = ${t[2]} (richtig: ${t[1]})`);
    }));
    return Object.values(m).sort((x,y)=>y.n-x.n);
  }

  // ===== In den Trainern: Knopf „Meine Aufgaben" zeigt, was wartet =====
  function beschrifte(){
    let rows, name;
    try{ rows=LOG; name=playerName; }catch(e){ return; }          // nur in den Trainern mit LOG
    const el=document.querySelector('[data-reihe="mine"] small'); if(!el || !name) return;
    const key=String(name).trim().toLowerCase();
    const z=zaehle(rows.filter(e=>String(e.name||"").trim().toLowerCase()===key));
    const teile=[];
    if(z.offen)   teile.push(z.offen===1 ? "1 Aufgabe sitzt noch nicht" : `${z.offen} Aufgaben sitzen noch nicht`);
    if(z.faellig) teile.push(z.faellig===1 ? "🔁 1 Wiederholung ist heute dran" : `🔁 ${z.faellig} Wiederholungen sind heute dran`);
    const t = teile.length ? teile.join(" · ") : (z.fakten ? "✨ gerade nichts offen – die nächste Wiederholung kommt von selbst" : "deine eigenen Fehleraufgaben – automatisch für dich zusammengestellt");
    if(el.textContent!==t) el.textContent=t;
  }
  if(typeof document!=="undefined") document.addEventListener("DOMContentLoaded", ()=>{ setTimeout(beschrifte,1500); setInterval(beschrifte,4000); });

  return {status, zaehle, faelligeListe, fehlerart, fehlerarten, ART, ABSTAND};
})();
