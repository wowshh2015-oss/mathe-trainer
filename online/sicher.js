// ===== Sicherheit (24.11.2026) =====
// Jedes Gerät meldet sich still und ohne Eingabe anonym bei Firebase an (eine zufällige Geräte-Nummer, keine Daten über das Kind).
// Die Lehrkraft meldet sich in lehrer.html mit E-Mail und Passwort an – nur sie darf löschen, ändern, freischalten, zurücksetzen.
// Jeder neue Eintrag in „ergebnisse" bekommt die Geräte-Nummer (uid). So darf ein Kind später nur SEINE Einträge ergänzen.
// Muss NACH firebase-app-compat, firebase-auth-compat und firebase-firestore-compat geladen werden, VOR firebase.initializeApp.
(function(){
  const W=window; if(!W.firebase || W.Sicher) return;
  let fertig, auth=null; const bereit=new Promise(r=>fertig=r);
  const S=W.Sicher={ bereit, uid:()=>auth&&auth.currentUser?auth.currentUser.uid:"", lehrer:()=>!!(auth&&auth.currentUser&&!auth.currentUser.isAnonymous),
    email:()=>auth&&auth.currentUser&&auth.currentUser.email||"", auth:()=>auth };
  function start(){
    try{ if(typeof firebase.auth!=="function"){ fertig(null); return; } auth=firebase.auth(); }catch(e){ fertig(null); return; }
    let erst=true;
    auth.onAuthStateChanged(u=>{
      if(u){ fertig(u); erst=false; return; }
      if(!erst) return; erst=false;
      auth.signInAnonymously().then(c=>fertig(c.user)).catch(()=>fertig(null));   // ohne Anmeldung läuft alles wie bisher weiter
    });
    setTimeout(()=>fertig(auth.currentUser||null), 8000);   // nie ewig warten
  }
  // initializeApp abfangen: danach sofort die Geräte-Anmeldung starten (die Seiten rufen initializeApp selbst auf)
  const orig=firebase.initializeApp;
  firebase.initializeApp=function(){ const app=orig.apply(this, arguments); try{ start(); }catch(e){} return app; };
  // Neue Einträge in „ergebnisse" mit der Geräte-Nummer versehen (nur bei vollständigem set/add, nicht bei Änderungen der Lehrkraft)
  function mitUid(ref, d){ try{
      if(!d || typeof d!=="object" || Array.isArray(d)) return d;
      const pfad=ref && (ref.path || (ref.parent && ref.parent.path) || ""); if(String(pfad).split("/")[0]!=="ergebnisse") return d;
      const u=S.uid(); if(!u || S.lehrer() || d.uid) return d;
      return Object.assign({}, d, {uid:u}); }catch(e){ return d; } }
  // (25.11.2026) Jeder Eintrag in „ergebnisse" bekommt bei jedem Schreiben einen Zeitstempel des Servers („geaendert").
  // Damit müssen die Seiten nicht mehr jedes Mal ALLE Einträge lesen, sondern nur die neuen (siehe Vorrat unten).
  const istErg=ref=>{ try{ return String(ref && (ref.path || (ref.parent && ref.parent.path) || "")).split("/")[0]==="ergebnisse"; }catch(e){ return false; } };
  function stempel(ref, d){ try{
      if(!istErg(ref) || !d || typeof d!=="object" || Array.isArray(d)) return d;
      return Object.assign({}, d, {geaendert:firebase.firestore.FieldValue.serverTimestamp()}); }catch(e){ return d; } }
  // Löscht oder benennt die Lehrkraft Einträge um, merken sich alle Geräte das über „datenStand" und laden einmal neu.
  let standZeit=null;
  function standHoch(){ if(standZeit) return; standZeit=setTimeout(()=>{ standZeit=null; try{
      firebase.firestore().collection("einstellungen").doc("freigabe").set({datenStand:Date.now()}, {merge:true}).catch(()=>{}); }catch(e){} }, 1500); }
  try{
    const DR=firebase.firestore && firebase.firestore.DocumentReference;
    if(DR && DR.prototype && DR.prototype.set){ const set=DR.prototype.set;
      DR.prototype.set=function(d,o){ return (o && (o.merge||o.mergeFields)) ? set.call(this,stempel(this,d),o) : set.call(this, stempel(this,mitUid(this,d)), o); }; }
    if(DR && DR.prototype && DR.prototype.update){ const upd=DR.prototype.update;
      DR.prototype.update=function(d){ if(arguments.length!==1 || !istErg(this)) return upd.apply(this, arguments);
        const p=upd.call(this, stempel(this,d)); if(d && "name" in d) p.then(standHoch, ()=>{}); return p; }; }
    if(DR && DR.prototype && DR.prototype.delete){ const del=DR.prototype.delete;
      DR.prototype.delete=function(){ const p=del.apply(this, arguments); if(istErg(this)) p.then(standHoch, ()=>{}); return p; }; }
    const CR=firebase.firestore && firebase.firestore.CollectionReference;
    if(CR && CR.prototype && CR.prototype.add){ const add=CR.prototype.add; CR.prototype.add=function(d){ return add.call(this, stempel(this,mitUid(this,d))); }; }
    const WB=firebase.firestore && firebase.firestore.WriteBatch;
    if(WB && WB.prototype && WB.prototype.set){ const bset=WB.prototype.set;
      WB.prototype.set=function(ref,d,o){ return (o && (o.merge||o.mergeFields)) ? bset.call(this,ref,stempel(ref,d),o) : bset.call(this, ref, stempel(ref,mitUid(ref,d)), o); }; }
    if(WB && WB.prototype && WB.prototype.update){ const bupd=WB.prototype.update;
      WB.prototype.update=function(ref,d){ if(arguments.length!==2 || !istErg(ref)) return bupd.apply(this, arguments);
        if(d && "name" in d) this.__stand=true; return bupd.call(this, ref, stempel(ref,d)); }; }
    if(WB && WB.prototype && WB.prototype.delete){ const bdel=WB.prototype.delete;
      WB.prototype.delete=function(ref){ if(istErg(ref)) this.__stand=true; return bdel.apply(this, arguments); }; }
    if(WB && WB.prototype && WB.prototype.commit){ const com=WB.prototype.commit;
      WB.prototype.commit=function(){ const p=com.apply(this, arguments); if(this.__stand) p.then(standHoch, ()=>{}); return p; }; }
  }catch(e){}

  // ===== Vorrat (25.11.2026): Ergebnisse auf dem Gerät merken, danach nur Neues vom Server holen =====
  // Vorher las jede Seite bei jedem Öffnen alle Einträge (Lehrerseite ~1600, Kind bis ~250) – das sprengte das Tageslimit.
  // Jetzt: einmal alles laden und im Gerät (IndexedDB) ablegen, danach nur Einträge mit neuerem „geaendert".
  // Komplett neu geladen wird, wenn die Lehrkraft etwas gelöscht/umbenannt hat (datenStand), nach 7 Tagen, oder wenn etwas schiefgeht.
  const IDB_NAME="mathe-vorrat", IDB_STORE="v", WOCHE=7*864e5, UEBERLAPP=5*60e3;
  let idbP=null;
  function idb(){ if(idbP) return idbP;
    idbP=new Promise(res=>{ try{ const r=indexedDB.open(IDB_NAME,1);
        r.onupgradeneeded=()=>{ try{ r.result.createObjectStore(IDB_STORE); }catch(e){} };
        r.onsuccess=()=>res(r.result); r.onerror=()=>res(null); r.onblocked=()=>res(null); setTimeout(()=>res(null), 3000); }catch(e){ res(null); } });
    return idbP; }
  // Hängt der Gerätespeicher (iPad/Safari), nach kurzer Zeit ohne ihn weiter (25.11.2026)
  const mitFrist=(p,ms,ersatz)=>Promise.race([p, new Promise(r=>setTimeout(()=>r(ersatz),ms))]);
  async function vLies(k){ const d=await idb(); if(!d) return null;
    return mitFrist(new Promise(res=>{ try{ const q=d.transaction(IDB_STORE,"readonly").objectStore(IDB_STORE).get(k); q.onsuccess=()=>res(q.result||null); q.onerror=()=>res(null); }catch(e){ res(null); } }), 1500, null); }
  async function vSchreib(k,v){ const d=await idb(); if(!d) return;
    return new Promise(res=>{ try{ const t=d.transaction(IDB_STORE,"readwrite"); t.objectStore(IDB_STORE).put(v,k); t.oncomplete=()=>res(); t.onerror=()=>res(); t.onabort=()=>res(); }catch(e){ res(); } }); }
  // Zeitstempel (Firestore-Timestamp) in Millisekunden umwandeln, damit alles speicherbar ist
  function flach(x){ const o={}; for(const k in x){ const v=x[k]; o[k]=(v && typeof v.toMillis==="function") ? v.toMillis() : v; } return o; }
  const zeitVon=d=>typeof d.geaendert==="number" ? d.geaendert : 0;
  function datenAus(doc){ try{ return flach(doc.data({serverTimestamps:"estimate"})); }catch(e){ return flach(doc.data()); } }
  async function stand(db){ try{ const s=await db.collection("einstellungen").doc("freigabe").get(); return (s.exists && (s.data()||{}).datenStand) || 0; }catch(e){ return 0; } }
  function basis(db, key, name){ let q=db.collection("ergebnisse").where("key","==",key); if(name!=null) q=q.where("name","==",name); return q; }
  function ab(q, max){ return q.where("geaendert",">",firebase.firestore.Timestamp.fromMillis(Math.max(0,max-UEBERLAPP))).orderBy("geaendert"); }
  function liste(docs){ return Object.keys(docs).map(id=>Object.assign({_id:id}, docs[id])); }
  const V=W.Vorrat={ zaehler:{voll:0,neu:0},
    // Einmal laden (Kinder-Seiten). name = Vorname oder null für die ganze Klasse. Liefert [{_id, ...daten}].
    lade(db, key, name){
      // Sicherheitsnetz: dauert der Weg über den Vorrat zu lange oder geht schief, wie früher direkt alles holen
      const direkt=()=>basis(db,key,name).get().then(s=>{ V.zaehler.voll+=s.size; return s.docs.map(d=>Object.assign({_id:d.id}, datenAus(d))); });
      let fertig=false;
      const weg=V._lade(db,key,name).then(l=>{ fertig=true; return l; });
      return Promise.race([weg, new Promise(r=>setTimeout(r,5000))]).then(l=>fertig ? l : direkt()).catch(()=>direkt()); },
    async _lade(db, key, name){
      const k="erg|"+key+"|"+(name==null?"*":name), jetzt=Date.now(), st=await mitFrist(stand(db), 3000, -1);
      let c=await vLies(k);
      if(c && (c.stand!==st || jetzt-c.voll>WOCHE)) c=null;
      if(c){ try{ const s=await ab(basis(db,key,name), c.max).get(); V.zaehler.neu+=s.size;
          s.forEach(d=>{ const x=datenAus(d); c.docs[d.id]=x; c.max=Math.max(c.max, zeitVon(x)); });
          vSchreib(k,c); return liste(c.docs); }catch(e){ /* z. B. Index fehlt -> unten alles laden */ } }
      const s=await basis(db,key,name).get(); V.zaehler.voll+=s.size;
      const docs={}; let max=0; s.forEach(d=>{ const x=datenAus(d); docs[d.id]=x; max=Math.max(max, zeitVon(x)); });
      vSchreib(k,{docs, max, voll:jetzt, stand:st}); return liste(docs); },
    // Laufend beobachten (Lehrerseite). cb(liste) bei jeder Änderung, fehler(err) wie bei onSnapshot. Liefert eine Stopp-Funktion.
    beobachte(db, key, cb, fehler){
      const k="erg|"+key+"|*"; let aus=false, stopp=()=>{}, stopStand=()=>{}, c=null, letzterStand=null, speicherZeit=null;
      const speichern=()=>{ clearTimeout(speicherZeit); speicherZeit=setTimeout(()=>vSchreib(k,c), 800); };
      async function voll(st){ const s=await basis(db,key,null).get(); V.zaehler.voll+=s.size;
        const docs={}; let max=0; s.forEach(d=>{ const x=datenAus(d); docs[d.id]=x; max=Math.max(max, zeitVon(x)); });
        c={docs, max, voll:Date.now(), stand:st}; vSchreib(k,c); }
      function hoere(){ stopp(); let erst=true;
        const fallback=()=>{ stopp(); stopp=basis(db,key,null).onSnapshot(s=>{ if(aus) return; const docs={}; s.forEach(d=>docs[d.id]=datenAus(d)); c.docs=docs; cb(liste(docs)); }, fehler); };
        try{ stopp=ab(basis(db,key,null), c.max).onSnapshot(s=>{ if(aus) return;
            s.docChanges().forEach(ch=>{ if(ch.type==="removed") delete c.docs[ch.doc.id]; else { const x=datenAus(ch.doc); c.docs[ch.doc.id]=x; c.max=Math.max(c.max, zeitVon(x)); } });
            if(erst){ V.zaehler.neu+=s.size; erst=false; } speichern(); cb(liste(c.docs)); },
          e=>{ if(aus) return; if(e && e.code==="failed-precondition") fallback(); else if(fehler) fehler(e); }); }catch(e){ fallback(); } }
      (async()=>{ try{
          const st=await stand(db); c=await vLies(k);
          if(!c || c.stand!==st || Date.now()-c.voll>WOCHE) await voll(st); else cb(liste(c.docs));
          if(aus) return; letzterStand=st; hoere();
          // Hat die Lehrkraft (auch auf einem anderen Gerät) gelöscht oder umbenannt? Dann einmal alles neu.
          stopStand=db.collection("einstellungen").doc("freigabe").onSnapshot(d=>{ const n=(d.exists && (d.data()||{}).datenStand)||0;
            if(aus || n===letzterStand) return; letzterStand=n; voll(n).then(()=>{ if(!aus){ cb(liste(c.docs)); hoere(); } }, fehler); }, ()=>{});
        }catch(e){ if(fehler) fehler(e); } })();
      return ()=>{ aus=true; stopp(); stopStand(); }; },
    // Wie früher query.get() – liefert ein Objekt mit forEach/docs/size, damit die Seiten kaum geändert werden müssen.
    // app = nur Einträge dieses Programms (gefiltert im Gerät; der Vorrat des Kindes wird von allen Programmen geteilt).
    snap(db, key, name, app){
      return V.lade(db, key, name).then(l=>{
        const docs=l.filter(x=>app==null || x.app===app).map(x=>{ const d=Object.assign({}, x); delete d._id; delete d.geaendert;
          return {id:x._id, exists:true, data:()=>Object.assign({}, d)}; });
        return {docs, size:docs.length, empty:!docs.length, forEach:f=>docs.forEach(f)}; }); },
    leeren(){ return idb().then(d=>{ if(d) try{ d.transaction(IDB_STORE,"readwrite").objectStore(IDB_STORE).clear(); }catch(e){} }); }
  };
  // 25.11.2026: Auf den Schul-iPads gab es nach Einführung des Vorrats keine Verbindung zum Archiv.
  // Darum auf iPad/iPhone vorerst ohne Vorrat – die Seiten laden dann wieder genau wie vorher.
  // (iPads mit iPadOS melden sich als „Macintosh" mit Touch.) Zum Testen: ?vorrat=1 erzwingt ihn.
  try{ const ua=navigator.userAgent||"", ios=/iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints>1);
    if(ios && !/[?&]vorrat=1/.test(location.search)){ W._Vorrat=V; delete W.Vorrat; } }catch(e){}
})();
