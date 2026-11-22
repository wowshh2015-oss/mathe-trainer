// Lernstandstest „Wo stehe ich?" – gemeinsame Teile für die Kinderseite (standort-trainer.html) und die Lehrerseite (lehrer.html):
// Themen und Leitideen, Auswertung, das Druckblatt und der Notenschlüssel.
window.Lernstand=(function(){
  // Leitideen des Hamburger Bildungsplans Mathematik (Grundschule)
  const LEITIDEEN={ Z:"Zahlen und Operationen", G:"Größen und Messen", R:"Raum und Form", M:"Muster und Strukturen", D:"Daten und Zufall" };
  const THEMEN={
    zahlraum:   {n:"Zahlen und Stellenwerte",   ic:"🔢", li:"Z", link:"zahlen-trainer.html"},
    plusminus:  {n:"Plus und Minus",            ic:"➕", li:"Z", link:"plus-trainer.html"},
    zerlegen:   {n:"Zerlegen und Ergänzen",     ic:"🧩", li:"Z", link:"zerlegen-trainer.html"},
    verdoppeln: {n:"Verdoppeln und Halbieren",  ic:"✌️", li:"Z", link:"blitz-trainer.html"},
    malgeteilt: {n:"Mal und Geteilt",           ic:"✖️", li:"Z", link:"einmaleins-trainer.html"},
    rechenwege: {n:"Rechnen bis 1000",          ic:"🪜", li:"Z", link:"halbschriftlich-trainer.html"},
    schriftlich:{n:"Schriftlich rechnen",       ic:"✍️", li:"Z", link:"schrift-trainer.html"},
    sach:       {n:"Sachaufgaben",              ic:"📖", li:"Z", link:"sach-trainer.html"},
    geld:       {n:"Geld",                      ic:"💶", li:"G", link:"geld-trainer.html"},
    laengen:    {n:"Längen",                    ic:"📏", li:"G", link:"laengen-trainer.html"},
    gewichte:   {n:"Gewichte",                  ic:"⚖️", li:"G", link:"gewichte-trainer.html"},
    uhr:        {n:"Uhr und Zeit",              ic:"🕒", li:"G", link:"uhr-trainer.html"},
    formen:     {n:"Formen, Körper, Symmetrie", ic:"📐", li:"R", link:"geo-trainer.html"},
    muster:     {n:"Zahlenfolgen und Muster",   ic:"🔁", li:"M", link:"platz-trainer.html"},
    daten:      {n:"Diagramme und Kombinieren", ic:"📊", li:"D", link:"daten-trainer.html"}
  };
  const ZEIT={anfang:"Anfang", halbjahr:"Halbjahr", ende:"Ende"};
  const ZEIT_LANG={anfang:"Anfang des Schuljahres", halbjahr:"Halbjahr (bis Ende Januar)", ende:"Ende des Schuljahres"};
  const testName=id=>{ const [k,z]=String(id||"").split("-"); return `Klasse ${k} · ${ZEIT[z]||z||""}`; };
  const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  function themenStand(liste){ const st={}; (liste||[]).forEach(x=>{ (st[x.t]=st[x.t]||[0,0]); st[x.t][1]++; if(x.ok) st[x.t][0]++; }); return st; }
  const ampel=([r,n])=>{ const p=r/n; return p>=0.75?"g":p>=0.5?"m":"r"; };
  const AMPEL={g:["🟢","sitzt sicher"], m:["🟡","noch üben"], r:["🔴","wiederholen"]};

  // Notenschlüssel: Mindest-Prozent für die Noten 1 bis 5 (darunter 6).
  // Standard = Schlüssel aus der Klassenarbeit Kl. 2 der Lehrkraft; wird durch den Beschluss der Fachkonferenz ersetzt.
  const SCHLUESSEL_STD=[92,77,60,45,25];
  const NOTEN_WORT={1:"sehr gut",2:"gut",3:"befriedigend",4:"ausreichend",5:"mangelhaft",6:"ungenügend"};
  function noteAus(prozent, schluessel){ const s=(schluessel&&schluessel.length===5)?schluessel:SCHLUESSEL_STD; for(let i=0;i<5;i++) if(prozent>=s[i]) return i+1; return 6; }

  // Das Druckblatt – wie ein Rückmeldebogen zur Klassenarbeit. Note nur, wenn opt.note gesetzt ist (Exemplar der Lehrkraft).
  function blattHTML(e, opt){
    opt=opt||{};
    const st=e.themen||themenStand(e.aufgaben); let zeilen="";
    Object.keys(LEITIDEEN).forEach(li=>{ const ts=Object.keys(st).filter(t=>THEMEN[t] && THEMEN[t].li===li); if(!ts.length) return;
      const s=ts.reduce((a,t)=>[a[0]+st[t][0],a[1]+st[t][1]],[0,0]);
      zeilen+=`<tr class="liz"><td>${LEITIDEEN[li]}</td><td>${s[0]} / ${s[1]}</td><td></td></tr>`+
        ts.map(t=>{ const a=ampel(st[t]); return `<tr><td>&nbsp;&nbsp;${THEMEN[t].n}</td><td>${st[t][0]} / ${st[t][1]}</td><td>${{g:"● sitzt sicher",m:"◐ noch üben",r:"○ wiederholen"}[a]}</td></tr>`; }).join(""); });
    const [k,z]=String(e.test||"").split("-");
    const note = opt.note && e.note ? `<div class="note">Note: <b>${esc(e.note)}</b> (${NOTEN_WORT[e.note]||""})</div>` : "";
    return `<div class="lsBlatt"><h1>Lernstand Mathematik</h1>
      <div class="kz"><span><b>Name:</b> ${esc(e.name)}</span><span><b>Test:</b> Klasse ${esc(k)} · ${ZEIT_LANG[z]||esc(z)}</span><span><b>Datum:</b> ${esc(e.datum)}</span></div>
      <div class="sumz"><span class="sum">Erreicht: ${e.richtig} von ${e.max} Punkten (${e.prozent} %)</span>${note}</div>
      <table><tr><th>Leitidee / Thema</th><th style="width:22mm">Punkte</th><th style="width:38mm">Einschätzung</th></tr>${zeilen}</table>
      <table><tr><th style="width:8mm">Nr.</th><th>Aufgabe</th><th style="width:22mm">Antwort</th><th style="width:22mm">Richtig</th><th style="width:7mm"></th></tr>
        ${(e.aufgaben||[]).map((x,i)=>`<tr><td>${i+1}</td><td>${esc(x.f)}</td><td>${esc(x.a)}</td><td>${esc(x.s)}</td><td>${x.ok?"✓":"✗"}</td></tr>`).join("")}</table>
      <div class="unterschrift"><div>Unterschrift Erziehungsberechtigte</div><div>Bemerkung der Lehrkraft</div></div>
      <div class="fuss">Mathe-Trainer · Schule Hohe Landwehr · Aufgaben orientiert an „Flex und Flo" und an den Leitideen des Hamburger Bildungsplans Mathematik (Grundschule).</div></div>`;
  }
  // Aussehen des Blatts (am Bildschirm als weiße Seite, beim Drucken A4)
  const css=document.createElement("style");
  css.textContent=`
    .lsBlatt{background:#fff;color:#000;font-family:"Segoe UI",system-ui,-apple-system,Arial,sans-serif;font-size:14px;line-height:1.4;padding:28px 32px;border-radius:8px;max-width:800px;margin:0 auto 16px}
    .lsBlatt h1{font-size:24px;margin:0 0 6px;color:#000} .lsBlatt .kz{display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px 20px;border-bottom:2px solid #000;padding-bottom:6px;margin-bottom:10px}
    .lsBlatt .sumz{display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:6px;margin:4px 0 10px} .lsBlatt .sum{font-size:18px;font-weight:bold}
    .lsBlatt .note{font-size:18px;border:2px solid #000;border-radius:6px;padding:2px 12px}
    .lsBlatt table{width:100%;border-collapse:collapse;margin:6px 0 14px} .lsBlatt th,.lsBlatt td{border:1px solid #777;padding:5px 7px;text-align:left;font-size:13px;vertical-align:top;color:#000;white-space:normal}
    .lsBlatt th{background:#eee;color:#000} .lsBlatt .liz td{background:#f4f4f4;font-weight:bold}
    .lsBlatt .unterschrift{margin-top:34px;display:flex;gap:40px} .lsBlatt .unterschrift div{flex:1;border-top:1px solid #000;padding-top:3px;font-size:12px}
    .lsBlatt .fuss{margin-top:20px;font-size:11px;color:#444}
    @media print{ html,body{min-height:0!important;height:auto!important} .lsBlatt{padding:0;border-radius:0;max-width:none;margin:0;font-size:11pt;page-break-after:always} .lsBlatt:last-child{page-break-after:auto}
      .lsBlatt h1{font-size:15pt;margin:0 0 1mm} .lsBlatt .kz{padding-bottom:1.5mm;margin-bottom:2.5mm;font-size:10pt} .lsBlatt .sumz{margin:1mm 0 2.5mm}
      .lsBlatt table{margin:1mm 0 3.5mm} .lsBlatt th,.lsBlatt td{font-size:8.6pt;padding:0.35mm 1.5mm;border:0.6pt solid #666;line-height:1.18} .lsBlatt tr{page-break-inside:avoid}
      .lsBlatt .sum{font-size:13pt} .lsBlatt .note{font-size:13pt} .lsBlatt .unterschrift{margin-top:6mm} .lsBlatt .fuss{margin-top:2.5mm;font-size:7.5pt} .lsBlatt th,.lsBlatt .liz td{-webkit-print-color-adjust:exact;print-color-adjust:exact} }
    @page{size:A4;margin:10mm 13mm 10mm}`;
  document.head.appendChild(css);

  return {LEITIDEEN, THEMEN, ZEIT, ZEIT_LANG, testName, themenStand, ampel, AMPEL, SCHLUESSEL_STD, NOTEN_WORT, noteAus, blattHTML, esc};
})();
