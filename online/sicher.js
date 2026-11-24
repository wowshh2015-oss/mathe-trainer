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
  try{
    const DR=firebase.firestore && firebase.firestore.DocumentReference;
    if(DR && DR.prototype && DR.prototype.set){ const set=DR.prototype.set;
      DR.prototype.set=function(d,o){ return (o && (o.merge||o.mergeFields)) ? set.call(this,d,o) : set.call(this, mitUid(this,d), o); }; }
    const CR=firebase.firestore && firebase.firestore.CollectionReference;
    if(CR && CR.prototype && CR.prototype.add){ const add=CR.prototype.add; CR.prototype.add=function(d){ return add.call(this, mitUid(this,d)); }; }
    const WB=firebase.firestore && firebase.firestore.WriteBatch;
    if(WB && WB.prototype && WB.prototype.set){ const bset=WB.prototype.set;
      WB.prototype.set=function(ref,d,o){ return (o && (o.merge||o.mergeFields)) ? bset.call(this,ref,d,o) : bset.call(this, ref, mitUid(ref,d), o); }; }
  }catch(e){}
})();
