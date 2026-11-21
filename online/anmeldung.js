// ===== Anmeldung mit Geheimtier =====
// Jedes Kind hat zu seinem Namen ein Geheimtier (eines von 24 Bildern). Kein PIN, nichts zu tippen.
// Angemeldet wird nur auf der Startseite; die Trainer übernehmen den Namen und lassen ihn nicht mehr ändern.
// Gespeichert wird das Tier in einstellungen/tier_<name>. Die Lehrkraft sieht es in der Klassenübersicht
// und kann es dort zurücksetzen.
(function(){
  const KEY="HL-GH7G-3T7W-N5S5-BV3C";
  const TIERE=[["hund","🐶","Hund"],["katze","🐱","Katze"],["hase","🐰","Hase"],["fuchs","🦊","Fuchs"],
               ["baer","🐻","Bär"],["panda","🐼","Panda"],["loewe","🦁","Löwe"],["frosch","🐸","Frosch"],
               ["affe","🐵","Affe"],["pinguin","🐧","Pinguin"],["einhorn","🦄","Einhorn"],["schildkroete","🐢","Schildkröte"],
               // seit 17.11.2026 sind es 24 – bei 12 war das Tier zu leicht zu erraten. Die ersten zwölf bleiben an ihrem Platz.
               ["tiger","🐯","Tiger"],["koala","🐨","Koala"],["elefant","🐘","Elefant"],["eule","🦉","Eule"],
               ["delfin","🐬","Delfin"],["pferd","🐴","Pferd"],["maus","🐭","Maus"],["schwein","🐷","Schwein"],
               ["schlange","🐍","Schlange"],["fisch","🐠","Fisch"],["tintenfisch","🐙","Tintenfisch"],["marienkaefer","🐞","Marienkäfer"]];
  const VERSUCHE=3, SPERRE_MIN=5;
  function cap(s){ return String(s||"").trim().replace(/\s+/g," ").toLowerCase().replace(/(^|[\s\-])(\S)/g,(m,p,c)=>p+c.toUpperCase()); }
  function esc(s){ return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
  function docId(n){ return "tier_"+encodeURIComponent(cap(n).toLowerCase()).replace(/[%.]/g,"_"); }

  // „Angemeldet" gilt für diesen Tab. Wo sessionStorage gesperrt ist (privater Modus), hilft window.name.
  // „geprüft" = das Geheimtier wurde wirklich abgefragt oder ausgesucht. Wer nur wegen einer langsamen Verbindung
  // hereingelassen wurde, ist angemeldet, aber nicht geprüft – die Startseite fragt dann beim nächsten Mal nach.
  function okName(){
    try{ const v=sessionStorage.getItem("mathe_ok"); if(v) return v; }catch(e){}
    const m=String(window.name||"").match(/^mathe_okg?:(.*)$/); return m?m[1]:"";
  }
  function setOk(n, geprueft){ n=cap(n);
    try{ sessionStorage.setItem("mathe_ok",n); if(geprueft) sessionStorage.setItem("mathe_geprueft",n); else sessionStorage.removeItem("mathe_geprueft"); }catch(e){}
    window.name=(geprueft?"mathe_okg:":"mathe_ok:")+n; }
  function abmelden(){ try{ sessionStorage.removeItem("mathe_ok"); sessionStorage.removeItem("mathe_geprueft"); }catch(e){} window.name=""; }
  function ok(n){ n=cap(n); return !!n && okName()===n; }
  function geprueft(n){ n=cap(n); if(!ok(n)) return false;
    try{ if(sessionStorage.getItem("mathe_geprueft")===n) return true; }catch(e){}
    return String(window.name||"")==="mathe_okg:"+n; }
  // Wegen fehlender Verbindung ohne Tier hereingelassen? Das gilt 30 Minuten – danach wird wieder gefragt.
  function ohneNetz(n){ n=cap(n); try{ const v=JSON.parse(sessionStorage.getItem("mathe_ohneNetz")||"null");
    return !!v && v.n===n && Date.now()-v.t < 30*60000; }catch(e){ return false; } }
  function setOhneNetz(n){ try{ sessionStorage.setItem("mathe_ohneNetz", JSON.stringify({n:cap(n), t:Date.now()})); }catch(e){} }
  // Darf dieses Kind ohne neue Abfrage weiter? (Tier geprüft, oder gerade eben ohne Verbindung hereingelassen)
  function darf(n){ return geprueft(n) || (ok(n) && ohneNetz(n)); }

  const seite=(location.pathname.split("/").pop()||"index.html").toLowerCase();
  const istStart=seite==="index.html"||seite==="", istLehrer=seite==="lehrer.html";

  // ===== In den Trainern: ohne Anmeldung zurück zur Startseite, Name fest =====
  if(!istStart && !istLehrer){
    let n=""; const m=location.hash.match(/name=([^&]+)/);
    if(m){ try{ n=decodeURIComponent(m[1]); }catch(e){} }
    if(!n){ try{ n=localStorage.getItem("mathe_name")||""; }catch(e){} }
    // Nicht nur „angemeldet", sondern Tier wirklich geprüft – sonst zurück zur Startseite, die nach dem Tier fragt
    // (so kam ein Kind auf dem iPhone ohne Geheimtier in die Spiele, 21.11.2026)
    if(!darf(n)){ location.replace("index.html"+(n?"#name="+encodeURIComponent(cap(n)):"")); return; }
    const css=document.createElement("style");
    css.textContent="#nameChips{display:none!important} #name[readonly]{opacity:.85;cursor:default}"+
      ".anmWechsel{display:inline-block;margin-top:8px;font-size:13.5px;color:#94a3b8;text-decoration:underline;cursor:pointer}";
    document.head.appendChild(css);
    // ----- Baustelle: Programme, die die Lehrkraft in der Klassenübersicht gesperrt hat -----
    // (Der Uhr-Trainer bringt seine eigene Baustelle mit.) Auf einem Gerät, auf dem die Lehrkraft einmal ihre PIN
    // eingegeben hat, bleibt alles offen – so kann sie die Programme am Beamer zeigen.
    const APP = seite.replace("-trainer.html","").replace(".html","");
    const NAMEN={plus:"Plus-Trainer",minus:"Minus-Trainer",einmaleins:"Einmaleins-Trainer",einsdurcheins:"Einsdurcheins-Trainer",zerlegen:"Zerlegen-Trainer",
                 halbschriftlich:"Rechenwege",marathon:"Rechen-Marathon",turm:"Mein Wolkenkratzer",rallye:"Rechen-Rallye",sach:"Sachaufgaben",geld:"Geld",laengen:"Längen",einstufung:"Einstufung",eltern:"Elternseite",platz:"Fehlende Zahl",gewichte:"Gewichte",zahlen:"Zahlen bis 1000",geo:"Formen und Körper",daten:"Daten und Zufall",schrift:"Schriftlich rechnen",kalender:"Kalender und Zeit",mix:"Bunte Mischung",sach2:"Sachaufgaben in zwei Schritten",strahl:"Zahlenstrahl",zoo:"Mein Zoo",blitz:"Blitzrechnen"};
    if(NAMEN[APP]){
      const lehrerGeraet=()=>{ try{ return localStorage.getItem("uhr_test_frei")==="1"; }catch(e){ return false; } };
      const zuListe=()=>{ try{ return JSON.parse(localStorage.getItem("mathe_zu")||"[]"); }catch(e){ return []; } };
      let lehrerPin="";
      const weg=()=>{ const o=document.getElementById("anmSperre"); if(o) o.remove(); };
      const sperre=()=>{
        if(document.getElementById("anmSperre") || lehrerGeraet()) return;
        const o=document.createElement("div"); o.id="anmSperre";
        o.style.cssText="position:fixed;inset:0;z-index:1900;background:#0f172a;display:flex;align-items:flex-start;justify-content:center;padding:70px 18px 18px;overflow-y:auto;font-family:'Segoe UI',system-ui,-apple-system,Arial,sans-serif;color:#f1f5f9";
        o.innerHTML=`<div style="background:#1e293b;border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:26px 22px;max-width:460px;width:100%;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.4)">
          <div style="font-size:60px;line-height:1">🚧</div>
          <div style="font-size:24px;font-weight:800;margin:10px 0 8px">${NAMEN[APP]}: öffnet bald!</div>
          <div style="color:#cbd5e1;font-size:16px;line-height:1.5">Hier wird gerade etwas für dich vorbereitet. Deine Lehrerin oder dein Lehrer sagt dir, wann es losgeht. <b style="color:#fde68a">Sei gespannt!</b></div>
          <a href="index.html#name=${encodeURIComponent(cap(n))}" style="display:block;margin-top:18px;background:linear-gradient(180deg,#38bdf8,#0284c7);color:#042433;font-weight:700;font-size:17px;border-radius:12px;padding:14px;text-decoration:none">← Zurück zu den Trainern</a>
          <div style="margin-top:22px;font-size:13px;color:#94a3b8">Für die Lehrkraft:
            <input type="password" id="anmSperrPin" inputmode="numeric" maxlength="4" placeholder="PIN" autocomplete="off" style="width:90px;font-size:16px;padding:7px 10px;border-radius:10px;border:2px solid #334155;background:#0b1220;color:#f1f5f9;text-align:center">
            <button id="anmSperrOk" style="font-family:inherit;font-size:14px;font-weight:600;padding:8px 12px;border-radius:10px;border:2px solid #334155;background:transparent;color:#f1f5f9;cursor:pointer">ansehen</button>
            <div id="anmSperrMeld" style="color:#fca5a5;min-height:18px;margin-top:6px"></div></div></div>`;
        document.body.appendChild(o);
        const pruef=()=>{ const v=document.getElementById("anmSperrPin").value.trim();
          if(v && (v===lehrerPin || v==="4785")){ try{ localStorage.setItem("uhr_test_frei","1"); }catch(e){} weg(); }
          else{ document.getElementById("anmSperrMeld").textContent="Falsche PIN."; document.getElementById("anmSperrPin").value=""; } };
        document.getElementById("anmSperrOk").addEventListener("click", pruef);
        document.getElementById("anmSperrPin").addEventListener("keydown", e=>{ if(e.key==="Enter") pruef(); });
      };
      document.addEventListener("DOMContentLoaded", ()=>{
        if(lehrerGeraet()) return;
        if(zuListe().includes(APP)) sperre();              // sofort nach dem letzten bekannten Stand
        let versuche=0;
        const frage=()=>{
          let db=null; try{ db=firebase.firestore(); }catch(e){}
          if(!db){ if(versuche++<24) setTimeout(frage, 250); return; }
          db.collection("einstellungen").doc("pin").get().then(d=>{ const p=d.exists?String((d.data()||{}).pin||""):""; lehrerPin=/^\d{4}$/.test(p)?p:""; }).catch(()=>{});
          db.collection("einstellungen").doc("freigabe").get().then(d=>{
            const zu=(d.exists && (d.data()||{}).zu) || {}, liste=Object.keys(zu).filter(k=>zu[k]===true);
            try{ localStorage.setItem("mathe_zu", JSON.stringify(liste)); }catch(e){}
            if(liste.includes(APP)) sperre(); else weg();
          }).catch(()=>{});
        };
        frage();
      });
    }
    document.addEventListener("DOMContentLoaded", ()=>{
      const inp=document.getElementById("name"); if(!inp) return;
      inp.readOnly=true;
      const a=document.createElement("a");
      a.className="anmWechsel"; a.href="index.html#wechsel"; a.textContent="🔄 Nicht "+cap(n)+"? Namen wechseln";
      inp.insertAdjacentElement("afterend", a);
    });
  }

  // ===== Dialog =====
  function stil(){
    if(document.getElementById("anmStil")) return;
    const s=document.createElement("style"); s.id="anmStil";
    s.textContent=`
    .anmOv{position:fixed;inset:0;z-index:2000;background:rgba(5,10,22,.92);display:flex;align-items:flex-start;justify-content:center;padding:18px;overflow-y:auto}
    .anmBox{background:#1e293b;color:#f1f5f9;border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:24px 22px;max-width:460px;width:100%;margin:auto;text-align:center;
      box-shadow:0 10px 30px rgba(0,0,0,.4);font-family:"Segoe UI",system-ui,-apple-system,Arial,sans-serif}
    .anmBox h3{margin:0 0 8px;font-size:23px}
    .anmBox p{margin:0 0 16px;color:#cbd5e1;font-size:16px;line-height:1.5}
    .anmBox p b{color:#fbbf24}
    .anmTiere{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
    .anmTier{font-size:40px;line-height:1;padding:9px 0;border-radius:16px;background:#0b1220;border:2px solid #334155;cursor:pointer;transition:.12s;
      font-family:inherit;color:inherit}
    .anmTier:hover,.anmTier:focus{border-color:#38bdf8;transform:scale(1.06);outline:none}
    .anmGross{font-size:96px;line-height:1.1;margin:4px 0 6px}
    .anmMeld{min-height:24px;font-size:16px;font-weight:700;color:#fca5a5;margin-top:14px}
    .anmKn{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}
    .anmKn button{flex:1;font-family:inherit;font-size:17px;font-weight:700;border:none;border-radius:12px;padding:14px 16px;cursor:pointer;
      background:linear-gradient(180deg,#38bdf8,#0284c7);color:#042433}
    .anmKn button.zweit{background:transparent;color:#f1f5f9;border:2px solid #334155}
    .anmLink{display:inline-block;margin-top:16px;color:#94a3b8;font-size:14px;text-decoration:underline;cursor:pointer}
    @media (max-width:400px){ .anmTier{font-size:34px;padding:8px 0} .anmTiere{gap:8px} }`;
    document.head.appendChild(s);
  }
  function mitZeit(p,ms){ return Promise.race([p, new Promise((_,r)=>setTimeout(()=>r(new Error("zeit")),ms))]); }
  function gesperrtBis(id){ try{ return +localStorage.getItem("sperre_"+id)||0; }catch(e){ return 0; } }

  let laeuft=null;
  function pruefe(name){
    name=cap(name);
    if(!name) return Promise.resolve(false);
    if(geprueft(name)) return Promise.resolve(true);
    if(laeuft) return laeuft;
    laeuft=pruefeIntern(name).then(r=>{ laeuft=null; return r; }, e=>{ laeuft=null; throw e; });
    return laeuft;
  }
  async function pruefeIntern(name){
    let db=null; try{ db=firebase.firestore(); }catch(e){}
    if(!db){ setOk(name); setOhneNetz(name); return true; }   // ohne Datenbank niemanden aussperren (nicht „geprüft")
    const ref=db.collection("einstellungen").doc(docId(name));
    let konto=null, bekannt=false;
    stil();
    // Während gefragt wird, ein Hinweis – auf dem Handy dauert die erste Verbindung manchmal ein paar Sekunden
    const warteOv=document.createElement("div"); warteOv.className="anmOv";
    warteOv.innerHTML=`<div class="anmBox"><div class="anmGross">🐾</div><p>Einen Moment, ich schaue nach deinem Geheimtier …</p></div>`;
    document.body.appendChild(warteOv);
    const lesen=async ms=>{
      konto=null; bekannt=false;
      // Als Abfrage lesen, nicht als einzelnes Dokument: Die Datenbank verweigert das Lesen eines Dokuments,
      // das es noch nicht gibt (Kind ohne Geheimtier) – das darf nicht wie „keine Verbindung" behandelt werden.
      try{
        const q=await mitZeit(db.collection("einstellungen").where("key","==",KEY).where("name","==",name).get(), ms);
        q.forEach(d=>{ if(d.id===docId(name)) konto=d.data(); });
      }catch(e){
        if(!(e && e.code==="permission-denied")) throw e;   // verweigert = es gibt noch kein Konto
      }
      if(!(konto && konto.tier)){
        const s=await mitZeit(db.collection("ergebnisse").where("key","==",KEY).where("name","==",name).limit(1).get(), ms);
        bekannt=!s.empty;
      }
    };
    try{
      // Früher: nach 7 Sekunden ohne Antwort einfach hereinlassen – auf einem iPhone mit langsamer Verbindung
      // kam so ein Kind ganz ohne Geheimtier hinein. Jetzt: länger warten und einmal neu versuchen.
      try{ await lesen(10000); }catch(e){ await lesen(15000); }
    }catch(e){ warteOv.remove(); setOk(name); setOhneNetz(name); return true; }   // wirklich keine Verbindung: hereinlassen, aber NICHT „geprüft"
    warteOv.remove();
    return new Promise(resolve=>{
      const ov=document.createElement("div"); ov.className="anmOv";
      document.body.appendChild(ov);
      const fertig=r=>{ ov.remove(); resolve(r); };
      const gitter=()=>`<div class="anmTiere">${TIERE.map(t=>`<button class="anmTier" data-t="${t[0]}" aria-label="${t[2]}" title="${t[2]}">${t[1]}</button>`).join("")}</div>`;
      const andere=`<a class="anmLink" data-ab="1">Ich bin nicht ${esc(name)}</a>`;
      const setze=html=>{ ov.innerHTML=`<div class="anmBox">${html}</div>`;
        const ab=ov.querySelector("[data-ab]"); if(ab) ab.addEventListener("click",()=>fertig(false)); ov.scrollTop=0; };

      function neuFrage(){
        setze(`<h3>👋 Hallo ${esc(name)}!</h3>
          <p>Den Namen <b>${esc(name)}</b> gibt es hier noch nicht.<br>Bist du neu – oder hast du dich vertippt?</p>
          <div class="anmKn"><button id="anmNeu">✨ Ich bin neu</button><button class="zweit" data-ab="1">✏️ Vertippt</button></div>`);
        ov.querySelector("#anmNeu").addEventListener("click", waehlen);
      }
      function waehlen(){
        setze(`<h3>🐾 Such dir dein Geheimtier aus</h3>
          <p>${bekannt?`Neu, ${esc(name)}: `:""}Dein Geheimtier ist dein Schlüssel. <b>Nur du</b> kennst es –
             beim nächsten Mal tippst du es einfach an.</p>${gitter()}${andere}`);
        ov.querySelectorAll(".anmTier").forEach(b=>b.addEventListener("click",()=>bestaetigen(b.dataset.t)));
      }
      function bestaetigen(id){
        const t=TIERE.find(x=>x[0]===id);
        setze(`<h3>Dein Geheimtier</h3><div class="anmGross">${t[1]}</div>
          <p>Dein Geheimtier ist: <b>${t[2]}</b>.<br>Merk es dir gut und verrate es niemandem!</p>
          <div class="anmMeld" id="anmMeld"></div>
          <div class="anmKn"><button id="anmJa">👍 Ja, das ist mein Tier</button><button class="zweit" id="anmNein">Anderes Tier</button></div>`);
        ov.querySelector("#anmNein").addEventListener("click", waehlen);
        ov.querySelector("#anmJa").addEventListener("click", async ()=>{
          ov.querySelector("#anmJa").disabled=true;
          try{
            await mitZeit(ref.set({key:KEY, name:name, tier:id, fehl:0, seit:new Date().toISOString().slice(0,10)}), 10000);
            setOk(name, true); fertig(true);
          }catch(e){
            // nicht „geprüft": beim nächsten Besuch der Startseite wird das Tier noch einmal ausgesucht
            ov.querySelector("#anmMeld").textContent="Das Speichern hat nicht geklappt. Du kannst trotzdem üben.";
            setTimeout(()=>{ setOk(name); setOhneNetz(name); fertig(true); }, 1800);
          }
        });
      }
      let fehl=0;
      function pruefen(meldung){
        const bis=gesperrtBis(docId(name));
        if(bis>Date.now()){
          const min=Math.ceil((bis-Date.now())/60000);
          setze(`<h3>🔒 Kurze Pause</h3><p>Das Geheimtier von <b>${esc(name)}</b> wurde zu oft falsch getippt.<br>
            In ${min} ${min===1?"Minute":"Minuten"} geht es wieder.</p>
            <div class="anmKn"><button id="anmVerg">🙋 Ich habe mein Tier vergessen</button></div>
            <div class="anmKn"><button class="zweit" data-ab="1">Zurück</button></div>`);
          ov.querySelector("#anmVerg").addEventListener("click", vergessen);
          return;
        }
        setze(`<h3>👋 Hallo ${esc(name)}!</h3><p>Tippe auf <b>dein Geheimtier</b>.</p>${gitter()}
          <div class="anmMeld">${meldung||""}</div>
          <a class="anmLink" id="anmVerg" style="display:block;color:#fde68a;font-weight:700">🙋 Ich habe mein Tier vergessen</a>${andere}`);
        ov.querySelector("#anmVerg").addEventListener("click", vergessen);
        ov.querySelectorAll(".anmTier").forEach(b=>b.addEventListener("click",()=>{
          if(b.dataset.t===konto.tier){ setOk(name, true); fertig(true); return; }
          fehl++;
          // Fehlversuche merken – die Lehrkraft sieht sie in der Klassenübersicht
          try{ ref.update({fehl:firebase.firestore.FieldValue.increment(1), fehlAm:new Date().toLocaleString("de-DE",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}).catch(()=>{}); }catch(e){}
          if(fehl>=VERSUCHE){ try{ localStorage.setItem("sperre_"+docId(name), String(Date.now()+SPERRE_MIN*60000)); }catch(e){} pruefen(); }
          else pruefen(`Das war nicht das richtige Tier. Noch ${VERSUCHE-fehl} ${VERSUCHE-fehl===1?"Versuch":"Versuche"}.`);
        }));
      }
      // ----- Tier vergessen: der Lehrkraft Bescheid sagen (Klassenübersicht + auf Wunsch Nachricht aufs Handy) -----
      // Ist das Tier zurückgesetzt, merkt das diese Seite von selbst und das Kind sucht sich gleich ein neues aus.
      let horcht=null;
      function vergessen(){
        const schon = konto && konto.hilfe && Date.now()-konto.hilfe < 12*3600000;
        if(schon){ warten(); return; }
        setze(`<h3>🙋 Tier vergessen?</h3>
          <p>Kein Problem! Deine Lehrerin oder dein Lehrer bekommt Bescheid und setzt dein Tier zurück.
             Danach suchst du dir einfach ein neues aus.</p>
          <div class="anmMeld" id="anmMeld"></div>
          <div class="anmKn"><button id="anmRuf">📨 Bescheid sagen</button><button class="zweit" id="anmNochmal">Doch noch probieren</button></div>`);
        ov.querySelector("#anmNochmal").addEventListener("click", ()=>pruefen());
        ov.querySelector("#anmRuf").addEventListener("click", async ()=>{
          ov.querySelector("#anmRuf").disabled=true;
          const am=new Date().toLocaleString("de-DE",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"});
          try{ await mitZeit(ref.update({hilfe:Date.now(), hilfeAm:am}), 7000); konto.hilfe=Date.now(); }
          catch(e){ ov.querySelector("#anmMeld").textContent="Das hat nicht geklappt. Sag es bitte morgen in der Schule."; ov.querySelector("#anmRuf").disabled=false; return; }
          try{ handy(); }catch(e){}
          warten();
        });
      }
      async function handy(){
        // Nachricht über ntfy – ohne Namen des Kindes, nur der Hinweis, dass jemand wartet
        const db=firebase.firestore(); const f=await mitZeit(db.collection("einstellungen").doc("freigabe").get(), 7000);
        const ruf=f.exists && (f.data()||{}).ruf; if(!ruf || !/^[A-Za-z0-9_-]{8,64}$/.test(ruf)) return;
        const ziel=location.href.replace(/[#?].*$/,"").replace(/[^\/]*$/,"")+"lehrer.html#tiere";
        fetch("https://ntfy.sh/", {method:"POST", body:JSON.stringify({topic:ruf, title:"🐾 Geheimtier vergessen",
          message:"Ein Kind wartet darauf, dass Sie sein Geheimtier zurücksetzen. Tippen öffnet die Klassenübersicht.", click:ziel, tags:["raising_hand"], priority:4})}).catch(()=>{});
      }
      function warten(){
        setze(`<h3>✅ Bescheid gesagt!</h3><div class="anmGross">📨</div>
          <p>Deine Lehrerin oder dein Lehrer weiß jetzt, dass du dein Tier vergessen hast.<br>
             Sobald es zurückgesetzt ist, geht es <b>hier von selbst</b> weiter – du kannst das Fenster offen lassen.</p>
          <div class="anmMeld" id="anmMeld" style="color:#94a3b8;font-weight:600">⏳ Ich schaue alle paar Sekunden nach …</div>
          <div class="anmKn"><button class="zweit" id="anmNochmal">Doch noch probieren</button><button class="zweit" data-ab="1">Zurück</button></div>`);
        ov.querySelector("#anmNochmal").addEventListener("click", ()=>{ stopp(); pruefen(); });
        stopp();
        horcht=setInterval(async ()=>{
          if(!ov.isConnected){ stopp(); return; }
          try{
            const db=firebase.firestore(); let neu=null;
            const q=await mitZeit(db.collection("einstellungen").where("key","==",KEY).where("name","==",name).get(), 7000);
            q.forEach(d=>{ if(d.id===docId(name)) neu=d.data(); });
            if(neu && !neu.tier){ stopp(); try{ localStorage.removeItem("sperre_"+docId(name)); }catch(e){} konto=neu; fehl=0; waehlen(); }
          }catch(e){}
        }, 8000);
      }
      function stopp(){ if(horcht){ clearInterval(horcht); horcht=null; } }

      if(konto && konto.tier) pruefen();
      else if(bekannt) waehlen();
      else neuFrage();
    });
  }

  window.Anmeldung={ ok, geprueft, darf, pruefe, abmelden, cap, TIERE, docId };
})();
