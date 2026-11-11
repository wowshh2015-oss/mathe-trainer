// ===== Anmeldung mit Geheimtier =====
// Jedes Kind hat zu seinem Namen ein Geheimtier (eines von 12 Bildern). Kein PIN, nichts zu tippen.
// Angemeldet wird nur auf der Startseite; die Trainer übernehmen den Namen und lassen ihn nicht mehr ändern.
// Gespeichert wird das Tier in einstellungen/tier_<name>. Die Lehrkraft sieht es in der Klassenübersicht
// und kann es dort zurücksetzen.
(function(){
  const KEY="HL-GH7G-3T7W-N5S5-BV3C";
  const TIERE=[["hund","🐶","Hund"],["katze","🐱","Katze"],["hase","🐰","Hase"],["fuchs","🦊","Fuchs"],
               ["baer","🐻","Bär"],["panda","🐼","Panda"],["loewe","🦁","Löwe"],["frosch","🐸","Frosch"],
               ["affe","🐵","Affe"],["pinguin","🐧","Pinguin"],["einhorn","🦄","Einhorn"],["schildkroete","🐢","Schildkröte"]];
  const VERSUCHE=3, SPERRE_MIN=5;
  function cap(s){ return String(s||"").trim().replace(/\s+/g," ").toLowerCase().replace(/(^|[\s\-])(\S)/g,(m,p,c)=>p+c.toUpperCase()); }
  function esc(s){ return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
  function docId(n){ return "tier_"+encodeURIComponent(cap(n).toLowerCase()).replace(/[%.]/g,"_"); }

  // „Angemeldet" gilt für diesen Tab. Wo sessionStorage gesperrt ist (privater Modus), hilft window.name.
  function okName(){
    try{ const v=sessionStorage.getItem("mathe_ok"); if(v) return v; }catch(e){}
    const m=String(window.name||"").match(/^mathe_ok:(.*)$/); return m?m[1]:"";
  }
  function setOk(n){ n=cap(n); try{ sessionStorage.setItem("mathe_ok",n); }catch(e){} window.name="mathe_ok:"+n; }
  function abmelden(){ try{ sessionStorage.removeItem("mathe_ok"); }catch(e){} window.name=""; }
  function ok(n){ n=cap(n); return !!n && okName()===n; }

  const seite=(location.pathname.split("/").pop()||"index.html").toLowerCase();
  const istStart=seite==="index.html"||seite==="", istLehrer=seite==="lehrer.html";

  // ===== In den Trainern: ohne Anmeldung zurück zur Startseite, Name fest =====
  if(!istStart && !istLehrer){
    let n=""; const m=location.hash.match(/name=([^&]+)/);
    if(m){ try{ n=decodeURIComponent(m[1]); }catch(e){} }
    if(!n){ try{ n=localStorage.getItem("mathe_name")||""; }catch(e){} }
    if(!ok(n)){ location.replace("index.html"+(n?"#name="+encodeURIComponent(cap(n)):"")); return; }
    const css=document.createElement("style");
    css.textContent="#nameChips{display:none!important} #name[readonly]{opacity:.85;cursor:default}"+
      ".anmWechsel{display:inline-block;margin-top:8px;font-size:13.5px;color:#94a3b8;text-decoration:underline;cursor:pointer}";
    document.head.appendChild(css);
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
    .anmTier{font-size:44px;line-height:1;padding:12px 0;border-radius:16px;background:#0b1220;border:2px solid #334155;cursor:pointer;transition:.12s;
      font-family:inherit;color:inherit}
    .anmTier:hover,.anmTier:focus{border-color:#38bdf8;transform:scale(1.06);outline:none}
    .anmGross{font-size:96px;line-height:1.1;margin:4px 0 6px}
    .anmMeld{min-height:24px;font-size:16px;font-weight:700;color:#fca5a5;margin-top:14px}
    .anmKn{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}
    .anmKn button{flex:1;font-family:inherit;font-size:17px;font-weight:700;border:none;border-radius:12px;padding:14px 16px;cursor:pointer;
      background:linear-gradient(180deg,#38bdf8,#0284c7);color:#042433}
    .anmKn button.zweit{background:transparent;color:#f1f5f9;border:2px solid #334155}
    .anmLink{display:inline-block;margin-top:16px;color:#94a3b8;font-size:14px;text-decoration:underline;cursor:pointer}
    @media (max-width:400px){ .anmTier{font-size:36px;padding:10px 0} }`;
    document.head.appendChild(s);
  }
  function mitZeit(p,ms){ return Promise.race([p, new Promise((_,r)=>setTimeout(()=>r(new Error("zeit")),ms))]); }
  function gesperrtBis(id){ try{ return +localStorage.getItem("sperre_"+id)||0; }catch(e){ return 0; } }

  let laeuft=null;
  function pruefe(name){
    name=cap(name);
    if(!name) return Promise.resolve(false);
    if(ok(name)) return Promise.resolve(true);
    if(laeuft) return laeuft;
    laeuft=pruefeIntern(name).then(r=>{ laeuft=null; return r; }, e=>{ laeuft=null; throw e; });
    return laeuft;
  }
  async function pruefeIntern(name){
    let db=null; try{ db=firebase.firestore(); }catch(e){}
    if(!db){ setOk(name); return true; }                 // ohne Datenbank niemanden aussperren
    const ref=db.collection("einstellungen").doc(docId(name));
    let konto=null, bekannt=false;
    try{
      const d=await mitZeit(ref.get(), 7000);
      konto=d.exists?d.data():null;
      if(!(konto && konto.tier)){
        const s=await mitZeit(db.collection("ergebnisse").where("key","==",KEY).where("name","==",name).limit(1).get(), 7000);
        bekannt=!s.empty;
      }
    }catch(e){ setOk(name); return true; }               // keine Verbindung: lieber hereinlassen
    stil();
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
            await mitZeit(ref.set({key:KEY, name:name, tier:id, fehl:0, seit:new Date().toISOString().slice(0,10)}), 7000);
            setOk(name); fertig(true);
          }catch(e){
            ov.querySelector("#anmMeld").textContent="Das Speichern hat nicht geklappt. Du kannst trotzdem üben.";
            setTimeout(()=>{ setOk(name); fertig(true); }, 1800);
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
            <p>Tier vergessen? Dann frag deine Lehrerin oder deinen Lehrer – sie können es zurücksetzen.</p>
            <div class="anmKn"><button class="zweit" data-ab="1">Zurück</button></div>`);
          return;
        }
        setze(`<h3>👋 Hallo ${esc(name)}!</h3><p>Tippe auf <b>dein Geheimtier</b>.</p>${gitter()}
          <div class="anmMeld">${meldung||""}</div>${andere}`);
        ov.querySelectorAll(".anmTier").forEach(b=>b.addEventListener("click",()=>{
          if(b.dataset.t===konto.tier){ setOk(name); fertig(true); return; }
          fehl++;
          // Fehlversuche merken – die Lehrkraft sieht sie in der Klassenübersicht
          try{ ref.update({fehl:firebase.firestore.FieldValue.increment(1), fehlAm:new Date().toLocaleString("de-DE",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}).catch(()=>{}); }catch(e){}
          if(fehl>=VERSUCHE){ try{ localStorage.setItem("sperre_"+docId(name), String(Date.now()+SPERRE_MIN*60000)); }catch(e){} pruefen(); }
          else pruefen(`Das war nicht das richtige Tier. Noch ${VERSUCHE-fehl} ${VERSUCHE-fehl===1?"Versuch":"Versuche"}.`);
        }));
      }
      if(konto && konto.tier) pruefen();
      else if(bekannt) waehlen();
      else neuFrage();
    });
  }

  window.Anmeldung={ ok, pruefe, abmelden, cap, TIERE, docId };
})();
