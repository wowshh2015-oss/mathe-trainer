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
  let fest=false, mein=+lies(MK,0)||0, gemeldet=-1, db=null, uid="", nachspielAb=0, gesperrt=false, gerade=false, bekannt=false, hatteZeit=false;
  setTimeout(()=>{ bekannt=true; }, 15000);   // ohne Antwort vom Server nach 15 s mit dem rechnen, was das Gerät weiß

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
    const r=rest(), pause=zaehlt && amStart(); pi.textContent=(pause&&r>0?"⏸ ":"⏱ ")+(r>0?fmt(r):"0:00"); pi.className=r<=0?"um":r<=60?"knapp":"";
    if(!zaehlt) return;
    if(r>0){ if(bekannt) hatteZeit=true; nachspielAb=0; entsperre(); band(r<=60?"⏳ Noch 1 Minute!":""); return; }
    if(gesperrt) return;
    // Nachspiel nur für eine Runde, die mit Zeit angefangen hat – wer ohne Minuten einen Trainer öffnet, sieht sofort „Zeit ist um"
    if(!hatteZeit){ if(bekannt) sperre(); return; }
    if(nachspielAb && amStart()){ sperre(); return; }   // zurück im Menü = Runde fertig
    if(!nachspielAb) nachspielAb=Date.now();
    if(Date.now()-nachspielAb > NACHSPIEL*1000) sperre(); else band("⏰ Deine Zeit ist um – mach die Runde noch fertig!");
  }
  function band(t){ let b=D.getElementById("zeitBand"); if(!t){ if(b) b.remove(); return; }
    if(!b){ b=D.createElement("div"); b.id="zeitBand"; D.body.appendChild(b); } if(b.textContent!==t) b.textContent=t; }
  function sperre(){ if(gesperrt || !D.body) return; gesperrt=true; band(""); melde(true); stil();
    const o=D.createElement("div"); o.id="zeitSperre";
    o.innerHTML=`<div class="zb"><div class="zi">⏰</div><h3>Deine Zeit ist um!</h3>
      <p>Toll gerechnet, ${N.replace(/[&<>"]/g,"")}! 🎉<br>Für mehr Zeit brauchst du einen neuen <b>Daumen-Gutschein</b>:<br><span style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:50%;background:#fde047;border:2px solid #a16207;font-size:36px;margin:4px 0 10px">👍</span><br><br>Sobald du ihn bekommst, geht es hier sofort weiter.</p>
      <a href="index.html">← Zur Startseite</a></div>`;
    D.body.appendChild(o); try{ D.activeElement && D.activeElement.blur(); }catch(e){} }
  function entsperre(){ if(!gesperrt) return; gesperrt=false; const o=D.getElementById("zeitSperre"); if(o) o.remove(); }

  // (27.11.2026) Die Uhr läuft nur bei der Arbeit, nicht auf dem Startbildschirm des Trainers (#start bzw. #home):
  // Die Lehrkraft holt die iPads ein und lässt die Seite offen – vorher fraß die Uhr dabei die restlichen Minuten.
  // Sammelheft und Zoo-Baustelle liegen über dem Startbildschirm: dort wird nicht gerechnet, nur eingeklebt und gebaut –
  // die Uhr steht (Wunsch der Lehrkraft 27.11.2026). Ohne Minuten kommt man ohnehin nicht hinein: der Trainer ist dann gesperrt.
  const sichtbar=el=>!!(el && el.getClientRects().length && getComputedStyle(el).visibility!=="hidden");
  function amStart(){ return sichtbar(D.getElementById("start")) || sichtbar(D.getElementById("home")); }
  // Gutschein = der runde gelbe Daumen-Sticker aus der Klasse (1 Sticker = 5 Minuten)
  // ---------- Zählen ----------
  setInterval(()=>{
    if(zaehlt && an() && !gesperrt && D.visibilityState==="visible" && !lehrerGeraet() && !amStart()){
      mein++; if(mein%5===0) merk(MK, mein); if(mein%SCHREIB===0) melde(); }
    zeige();
  }, 1000);
  // (27.11.2026, nach dem ersten Einsatz) Bei Clara kam nie etwas an: ihr iPad hatte beim Öffnen noch keine Geräte-Anmeldung,
  // und ohne die wurde nie geschrieben. Bei zwei anderen fehlte im ersten Eintrag die Geräte-Nummer – danach lehnte die Datenbank jedes Update ab.
  // Jetzt: Geräte-Nummer bei jedem Versuch neu holen und ausdrücklich mitschreiben. Geht das Update nicht, neues Dokument.
  // Ganz ohne Anmeldung: die Minuten als einzelne „Nachträge" (je ein neues Dokument, das darf jedes Gerät anlegen).
  const GK="zeit_geraet", OK_="zeit_ohne_"+WO+"_"+N, IK="zeit_id_"+WO+"_"+N;
  let geraet=lies(GK,""); if(!geraet){ geraet=Math.random().toString(36).slice(2,9); merk(GK, geraet); }
  let ohne=+lies(OK_,0)||0, okSek=0, schreibt=false;
  const sauber=s=>s.replace(/[\/\s.#\[\]]/g,"_");
  function stempel(){ const d=new Date(); return {datum:`${p2(d.getDate())}.${p2(d.getMonth()+1)}.${d.getFullYear()}`, zeit:`${p2(d.getHours())}:${p2(d.getMinutes())}`}; }
  function melde(){
    if(!db || !N || !zaehlt || schreibt) return; merk(MK, mein);
    if(!uid && W.Sicher) uid=Sicher.uid()||"";
    const basis=Object.assign({key:KEY, app:"zeit", name:N, woche:WO}, stempel());
    if(!uid){   // keine Geräte-Anmeldung: Nachtrag als neues Dokument, höchstens einmal pro Minute
      const delta=mein-ohne-okSek; if(delta<60 && !(delta>0 && gesperrt)) return;
      schreibt=true; const id=sauber("zeit_"+WO+"_"+N+"_o_"+geraet+"_"+Date.now().toString(36));
      db.collection("ergebnisse").doc(id).set(Object.assign(basis,{sek:delta})).then(()=>{ ohne+=delta; merk(OK_, ohne); }).catch(()=>{}).then(()=>{ schreibt=false; });
      return; }
    const sek=mein-ohne; if(sek===gemeldet) return;
    let id=lies(IK,""); if(!id || id.indexOf(uid)<0){ id=sauber("zeit_"+WO+"_"+N+"_"+uid); okSek=0; }
    schreibt=true;
    db.collection("ergebnisse").doc(id).set(Object.assign(basis,{sek, uid})).then(()=>{ gemeldet=sek; okSek=sek; merk(IK, id); })
      .catch(err=>{ gemeldet=-1;
        if(err && err.code==="permission-denied"){   // altes Dokument ohne Geräte-Nummer: was dort steht, bleibt gezählt – neu anfangen
          ohne+=okSek; merk(OK_, ohne); okSek=0; merk(IK, sauber("zeit_"+WO+"_"+N+"_"+uid+"_"+Date.now().toString(36))); } })
      .then(()=>{ schreibt=false; });
  }
  addEventListener("pagehide", ()=>melde(true));
  D.addEventListener("visibilitychange", ()=>{ if(D.visibilityState!=="visible") melde(true); });

  // Runde fertig = ein Ergebnis wird gespeichert. Im Nachspiel danach kurz das Ergebnis zeigen, dann Schluss.
  function horcheErgebnis(){ try{
    const DR=firebase.firestore.DocumentReference, CR=firebase.firestore.CollectionReference;
    const fertig=(ref,d)=>{ try{ if(!nachspielAb || !d || ["zeit","zoobau","heft","drache"].includes(d.app)) return;
        if(String((ref&&ref.path)||"").split("/")[0]!=="ergebnisse" && String((ref&&ref.parent&&ref.parent.path)||"")!=="ergebnisse") return;
        setTimeout(sperre, 4000); }catch(e){} };
    const set=DR.prototype.set; DR.prototype.set=function(d,o){ fertig(this,d); return set.apply(this, arguments); };
    const add=CR.prototype.add; CR.prototype.add=function(d){ fertig(this,d); return add.apply(this, arguments); };
  }catch(e){} }

  // ---------- Verbindung ----------
  function andereHolen(){
    if(!db || !N) return;
    db.collection("ergebnisse").where("key","==",KEY).where("app","==","zeit").where("name","==",N).where("woche","==",WO).get().then(s=>{
      let a=0, server=0; s.forEach(d=>{ const x=d.data();
        if(d.id.indexOf("_o_"+geraet+"_")>0) return;                       // eigene Nachträge stecken schon in „mein"
        if(uid && x.uid===uid) server=Math.max(server, +x.sek||0); else a+=(+x.sek||0); });
      andere=a; bekannt=true; if(server+ohne>mein){ mein=server+ohne; merk(MK, mein); } zeige(); }).catch(()=>{});
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

  W.Zeit={ schulmodus:()=>!!(ST && ST.an && ST.tag===heute()), woche, heute, _test(st){ fest=true; ST=st; bekannt=true; zeige(); }, _S:()=>({amStart:amStart(), ST, andere, mein, rest:rest(), gesperrt, nachspielAb}) };
})();
