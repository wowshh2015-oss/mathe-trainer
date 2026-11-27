// ===== Schulmodus mit Zeit-Gutscheinen (27.11.2026) =====
// Im Unterricht bekommen die Kinder für gute Arbeit Sticker: 1 Sticker = 5 Minuten Mathe-Trainer.
// Die Lehrkraft schaltet in lehrer.html den Schulmodus ein (gilt nur für heute) und schreibt jedem Kind Minuten gut.
//   einstellungen/schulzeit = {key, typ:"schulzeit", an, tag:"2026-11-27", woche:"2026-W48", minuten:{Name: 15, …}}  (schreibt nur die Lehrkraft)
// Jedes Gerät zählt, wie lange ein Trainer offen und sichtbar ist, und schreibt es nach „ergebnisse":
//   ergebnisse/zeit_<woche>_<name>_<uid> = {app:"zeit", name, woche, sek}   (kein Durchgang – wird überall herausgefiltert)
// Übrig = gutgeschriebene Minuten der Woche − alles Verbrauchte der Woche (alle Geräte zusammen). Am Montag beginnt alles neu.
// Ist die Zeit um: die laufende Runde darf fertig gespielt werden (bis das Ergebnis gespeichert ist, höchstens 4 Minuten),
// dann „Deine Zeit ist um". Was darüber hinaus gespielt wurde, wird vom nächsten Gutschein abgezogen.
// Ohne Schulmodus (zu Hause, am Nachmittag) ändert sich nichts. Startseite: zeigt nur die Restzeit, zählt nicht.
(function(){
  const W=window, D=document; if(W.Zeit) return;
  const KEY="HL-GH7G-3T7W-N5S5-BV3C", NACHSPIEL=4*60, SCHREIB=30;
  const seite=(location.pathname.split("/").pop()||"index.html").toLowerCase();
  const istStart=seite==="index.html"||seite==="";
  const zaehlt=!istStart && /-trainer\.html$/.test(seite);
  const p2=x=>String(x).padStart(2,"0");
  function heute(){ const d=new Date(); return `${d.getFullYear()}-${p2(d.getMonth()+1)}-${p2(d.getDate())}`; }
  function woche(){ const d=new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()+3-(d.getDay()+6)%7);
    const w1=new Date(d.getFullYear(),0,4); const n=1+Math.round(((d-w1)/864e5-3+(w1.getDay()+6)%7)/7); return `${d.getFullYear()}-W${p2(n)}`; }
  const cap=s=>String(s||"").trim().replace(/\s+/g," ").toLowerCase().replace(/(^|[\s\-])(\S)/g,(m,p,c)=>p+c.toUpperCase());
  function name(){ let n=""; try{ n=sessionStorage.getItem("mathe_ok")||""; }catch(e){}
    if(!n){ const m=String(W.name||"").match(/^mathe_okg?:(.*)$/); if(m) n=m[1]; }
    if(!n){ try{ n=localStorage.getItem("mathe_name")||""; }catch(e){} } return cap(n); }
  const lehrerGeraet=()=>{ try{ return localStorage.getItem("uhr_test_frei")==="1"; }catch(e){ return false; } };
  const lies=(k,d)=>{ try{ const v=localStorage.getItem(k); return v==null?d:JSON.parse(v); }catch(e){ return d; } };
  const merk=(k,v)=>{ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} };

  let ST=lies("zeit_st", null);          // letzte bekannte Einstellung (damit es auch ohne Verbindung gilt)
  let andere=0;                          // Sekunden dieser Woche von anderen Geräten/Einträgen
  const N=name(), WO=woche();
  const MK="zeit_mein_"+WO+"_"+N;         // Sekunden dieses Geräts in dieser Woche
  let fest=false, mein=+lies(MK,0)||0, gemeldet=-1, db=null, uid="", nachspielAb=0, gesperrt=false, gerade=false;

  // Hat die Lehrkraft ihre Klasse festgelegt, gilt der Schulmodus nur für diese Kinder
  const inKlasse=()=>!(ST && Array.isArray(ST.klasse) && ST.klasse.length) || ST.klasse.includes(N);
  const an=()=>!!(ST && ST.an && ST.tag===heute() && N && inKlasse());
  const gut=()=>(ST && ST.woche===WO && ST.minuten && +ST.minuten[N]>0) ? Math.round(+ST.minuten[N]*60) : 0;
  const rest=()=>gut()-andere-mein;
  const fmt=s=>{ const neg=s<0; s=Math.abs(Math.round(s)); return (neg?"−":"")+Math.floor(s/60)+":"+p2(s%60); };

  // ---------- Anzeige ----------
  function stil(){ if(D.getElementById("zeitStil")) return; const s=D.createElement("style"); s.id="zeitStil"; s.textContent=`
    #zeitPille{position:fixed;left:10px;bottom:10px;z-index:1950;background:#1f2937;color:#fff;font:700 16px/1 "Segoe UI",system-ui,-apple-system,Arial,sans-serif;
      padding:9px 13px;border-radius:999px;box-shadow:0 4px 14px rgba(0,0,0,.3);pointer-events:none;font-variant-numeric:tabular-nums}
    #zeitPille.knapp{background:#b45309} #zeitPille.um{background:#b91c1c}
    #zeitBand{position:fixed;left:50%;transform:translateX(-50%);bottom:58px;z-index:1950;background:#b45309;color:#fff;font:700 17px/1.35 "Segoe UI",system-ui,-apple-system,Arial,sans-serif;
      padding:11px 18px;border-radius:14px;box-shadow:0 6px 18px rgba(0,0,0,.3);max-width:92vw;text-align:center}
    #zeitSperre{position:fixed;inset:0;z-index:2400;background:rgba(15,23,42,.94);display:flex;align-items:center;justify-content:center;padding:18px;
      font-family:"Segoe UI",system-ui,-apple-system,Arial,sans-serif}
    #zeitSperre .zb{background:#fffaf0;color:#1f2937;border-radius:22px;padding:28px 24px;max-width:440px;width:100%;text-align:center;box-shadow:0 12px 34px rgba(0,0,0,.45)}
    #zeitSperre .zi{font-size:76px;line-height:1.1} #zeitSperre h3{font-size:26px;margin:8px 0} #zeitSperre p{font-size:17px;line-height:1.5;color:#44403c;margin:0 0 16px}
    #zeitSperre a{display:block;background:linear-gradient(180deg,#38bdf8,#0284c7);color:#042433;font-weight:700;font-size:17px;border-radius:12px;padding:14px;text-decoration:none}`;
    D.head.appendChild(s); }
  function zeige(){
    if(!D.body) return; stil();
    let pi=D.getElementById("zeitPille");
    if(!an()){ if(pi) pi.remove(); band(""); entsperre(); return; }
    if(!pi){ pi=D.createElement("div"); pi.id="zeitPille"; D.body.appendChild(pi); }
    const r=rest(); pi.textContent="⏱ "+(r>0?fmt(r):"0:00"); pi.className=r<=0?"um":r<=60?"knapp":"";
    if(!zaehlt) return;
    if(r>0){ nachspielAb=0; entsperre(); band(r<=60?"⏳ Noch 1 Minute!":""); return; }
    if(gesperrt) return;
    if(!nachspielAb) nachspielAb=Date.now();
    if(Date.now()-nachspielAb > NACHSPIEL*1000) sperre(); else band("⏰ Deine Zeit ist um – mach die Runde noch fertig!");
  }
  function band(t){ let b=D.getElementById("zeitBand"); if(!t){ if(b) b.remove(); return; }
    if(!b){ b=D.createElement("div"); b.id="zeitBand"; D.body.appendChild(b); } if(b.textContent!==t) b.textContent=t; }
  function sperre(){ if(gesperrt || !D.body) return; gesperrt=true; band(""); melde(true); stil();
    const o=D.createElement("div"); o.id="zeitSperre";
    o.innerHTML=`<div class="zb"><div class="zi">⏰</div><h3>Deine Zeit ist um!</h3>
      <p>Toll gerechnet, ${N.replace(/[&<>"]/g,"")}! 🎉<br>Für mehr Zeit brauchst du einen neuen <b>Gutschein 🎟️</b>.<br>Sobald du ihn bekommst, geht es hier sofort weiter.</p>
      <a href="index.html">← Zur Startseite</a></div>`;
    D.body.appendChild(o); try{ D.activeElement && D.activeElement.blur(); }catch(e){} }
  function entsperre(){ if(!gesperrt) return; gesperrt=false; const o=D.getElementById("zeitSperre"); if(o) o.remove(); }

  // ---------- Zählen ----------
  setInterval(()=>{
    if(zaehlt && an() && !gesperrt && D.visibilityState==="visible" && !lehrerGeraet()){
      mein++; if(mein%5===0) merk(MK, mein); if(mein%SCHREIB===0) melde(); }
    zeige();
  }, 1000);
  function melde(sofort){
    if(!db || !uid || !N || mein===gemeldet || !zaehlt) return; merk(MK, mein); gemeldet=mein;
    const d=new Date(), id=("zeit_"+WO+"_"+N+"_"+uid).replace(/[\/\s.#\[\]]/g,"_");
    try{ db.collection("ergebnisse").doc(id).set({key:KEY, app:"zeit", name:N, woche:WO, sek:mein,
      datum:`${p2(d.getDate())}.${p2(d.getMonth()+1)}.${d.getFullYear()}`, zeit:`${p2(d.getHours())}:${p2(d.getMinutes())}`}).catch(()=>{ gemeldet=-1; }); }catch(e){ gemeldet=-1; }
  }
  addEventListener("pagehide", ()=>melde(true));
  D.addEventListener("visibilitychange", ()=>{ if(D.visibilityState!=="visible") melde(true); });

  // Runde fertig = ein Ergebnis wird gespeichert. Im Nachspiel danach kurz das Ergebnis zeigen, dann Schluss.
  function horcheErgebnis(){ try{
    const DR=firebase.firestore.DocumentReference, CR=firebase.firestore.CollectionReference;
    const fertig=(ref,d)=>{ try{ if(!nachspielAb || !d || ["zeit","zoobau","heft"].includes(d.app)) return;
        if(String((ref&&ref.path)||"").split("/")[0]!=="ergebnisse" && String((ref&&ref.parent&&ref.parent.path)||"")!=="ergebnisse") return;
        setTimeout(sperre, 4000); }catch(e){} };
    const set=DR.prototype.set; DR.prototype.set=function(d,o){ fertig(this,d); return set.apply(this, arguments); };
    const add=CR.prototype.add; CR.prototype.add=function(d){ fertig(this,d); return add.apply(this, arguments); };
  }catch(e){} }

  // ---------- Verbindung ----------
  function andereHolen(){
    if(!db || !N) return;
    db.collection("ergebnisse").where("key","==",KEY).where("app","==","zeit").where("name","==",N).where("woche","==",WO).get().then(s=>{
      let a=0, server=0; s.forEach(d=>{ const x=d.data(); if(uid && x.uid===uid) server=Math.max(server, +x.sek||0); else a+=(+x.sek||0); });
      andere=a; if(server>mein){ mein=server; merk(MK, mein); } zeige(); }).catch(()=>{});
  }
  function start(){
    try{ if(!W.firebase || !firebase.apps || !firebase.apps.length) return false; db=firebase.firestore(); }catch(e){ return false; }
    if(zaehlt) horcheErgebnis();
    db.collection("einstellungen").where("key","==",KEY).where("typ","==","schulzeit").onSnapshot(s=>{
      if(fest) return; let n=null; s.forEach(d=>{ if(d.id==="schulzeit") n=d.data(); });
      const vorher=gut(); ST=n; merk("zeit_st", n);
      if(gerade && gut()>vorher && an()) band("🎉 Neue Zeit: +"+Math.round((gut()-vorher)/60)+" Minuten!"), setTimeout(()=>band(""), 3500);
      gerade=true; zeige(); }, ()=>{});
    const weiter=()=>{ uid=(W.Sicher && Sicher.uid()) || ""; andereHolen(); };
    if(W.Sicher && Sicher.bereit) Promise.race([Sicher.bereit, new Promise(r=>setTimeout(r,9000))]).then(weiter); else weiter();
    setInterval(()=>{ if(an()) andereHolen(); }, 60000);
    return true;
  }
  let versuche=0; (function warte(){ if(start()) return; if(versuche++<80) setTimeout(warte, 300); })();
  if(D.readyState==="loading") D.addEventListener("DOMContentLoaded", zeige); else zeige();

  W.Zeit={ schulmodus:()=>!!(ST && ST.an && ST.tag===heute()), woche, heute, _test(st){ fest=true; ST=st; zeige(); }, _S:()=>({ST, andere, mein, rest:rest(), gesperrt, nachspielAb}) };
})();
