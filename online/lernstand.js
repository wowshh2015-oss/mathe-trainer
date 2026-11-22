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

  // ===== Aufgabenarten („Fertigkeiten") – fester Schlüssel je Art und Schwierigkeit =====
  // Der Lernverlauf vergleicht NUR gleiche Arten: neue, schwerere Arten (z. B. bis 1000 statt bis 100) zählen als „neu", nicht als Rückschritt.
  const FERTIGKEITEN={
    nachbar20:["zahlraum","Nachbarzahlen bis 20"], nachbar100:["zahlraum","Nachbarzahlen bis 100 (über den Zehner)"],
    vergleich20:["zahlraum","Zahlen vergleichen bis 20"], vergleich100:["zahlraum","Zahlen vergleichen bis 100 (47 / 74)"], vergleich1000:["zahlraum","Zahlen vergleichen bis 1000"],
    strahl20:["zahlraum","Zahlenstrahl bis 20"], strahl100:["zahlraum","Zahlenstrahl bis 100"], strahl1000:["zahlraum","Zahlenstrahl bis 1000"],
    stellen100_zahl:["zahlraum","Zehner und Einer → Zahl"], stellen100_zehner:["zahlraum","Zehner einer Zahl erkennen"],
    stellen1000_null:["zahlraum","Stellenwerte bis 1000 (mit 0 Zehnern)"], stellen1000_h:["zahlraum","Hunderter einer Zahl erkennen"],
    plus20_ohne:["plusminus","Plus bis 20 ohne Übergang"], plus20:["plusminus","Plus bis 20 mit Übergang"],
    minus20_ohne:["plusminus","Minus bis 20 ohne Übergang"], minus20:["plusminus","Minus bis 20 mit Übergang"],
    plus100_ohne:["plusminus","Plus bis 100 ohne Übergang"], plus100_ze_e:["plusminus","Plus bis 100: ZE + E mit Übergang"], plus100_mit:["plusminus","Plus bis 100: ZE + ZE mit Übergang"],
    minus100_ohne:["plusminus","Minus bis 100 ohne Übergang"], minus100_ze_e:["plusminus","Minus bis 100: ZE − E mit Übergang"], minus100_mit:["plusminus","Minus bis 100: ZE − ZE mit Übergang"],
    erg10:["zerlegen","Ergänzen bis 10"], erg20:["zerlegen","Ergänzen bis 20"], ergplatz20:["zerlegen","Platzhalter bis 20 (? + 5 = 13)"], erg100:["zerlegen","Ergänzen bis 100"], erg1000:["zerlegen","Ergänzen bis 1000"],
    doppelt:["verdoppeln","Verdoppeln"], halb:["verdoppeln","Halbieren"],
    mal_kern:["malgeteilt","Kernaufgaben · 2 und · 5"], mal_alle:["malgeteilt","Einmaleins (alle Reihen)"], geteilt:["malgeteilt","Geteilt (Einsdurcheins)"],
    platz_mal:["malgeteilt","Platzhalter (? · 6 = 42)"], rest:["malgeteilt","Teilen mit Rest"], mal_zehner:["malgeteilt","Mal mit Zehnerzahlen (3 · 40)"], mal_mehr:["malgeteilt","Mal mit zweistelligen Zahlen (4 · 23)"],
    t_hunderter:["rechenwege","Mit Hundertern rechnen (300 + 250)"], t_zehner:["rechenwege","Zehnerzahlen mit Übergang (430 + 190)"], t_plus:["rechenwege","Plus bis 1000 mit Übergang"], t_minus:["rechenwege","Minus bis 1000 mit Übergang"],
    schr_plus:["schriftlich","Schriftlich plus"], schr_minus:["schriftlich","Schriftlich minus"],
    geld1:["geld","Geld zählen (Euro)"], geld2:["geld","Münzen zählen (Cent)"], geld2ct:["geld","Euro und Cent umwandeln"], geld3:["geld","Rückgeld berechnen"],
    m_cm:["laengen","m in cm"], mcm_cm:["laengen","m und cm in cm (2 m 47 cm)"], einheit2:["laengen","Passende Einheit (cm / m)"], km_m:["laengen","km in m"],
    cmmm_mm:["laengen","cm und mm in mm"], m0cm:["laengen","m und cm mit Null (2 m 5 cm)"], einheit3:["laengen","Passende Einheit (mm / cm / m / km)"],
    kg_g:["gewichte","kg in g"], kgg_g:["gewichte","kg und g in g"], g_kg:["gewichte","g in kg"], einheit_g:["gewichte","Passende Einheit (g / kg)"],
    uhr_stunde:["uhr","Uhr ablesen: halbe Stunden"], uhr_viertel:["uhr","Uhr ablesen: Viertel nach / vor"], uhr_fuenf:["uhr","Uhr ablesen: 5-Minuten-Schritte"], uhr_minute:["uhr","Uhr ablesen: minutengenau"],
    spanne_ende:["uhr","Uhrzeit nach einer Zeitspanne"], spanne_dauer:["uhr","Zeitdauer berechnen"],
    f_name:["formen","Formen erkennen"], f_ecken:["formen","Ecken zählen"], f_sym:["formen","Symmetrie erkennen"], f_wuerfel:["formen","Würfel: Ecken und Flächen"], f_quader:["formen","Quader: Ecken und Flächen"], f_koerper:["formen","Körper erkennen"],
    m_leicht:["muster","Zahlenfolgen mit kleinen Schritten"], m_plus:["muster","Zahlenfolgen vorwärts"], m_minus:["muster","Zahlenfolgen rückwärts"], m_schwer:["muster","Zahlenfolgen mit großen Schritten"],
    d_ablesen:["daten","Diagramm ablesen"], d_unterschied:["daten","Diagramm: Unterschied"], d_kombi:["daten","Kombinieren"], d_zufall:["daten","sicher / möglich / unmöglich"],
    s_1plus:["sach","Sachaufgabe plus bis 20"], s_1minus:["sach","Sachaufgabe minus bis 20"], s_2plus:["sach","Sachaufgabe plus bis 100"], s_2minus:["sach","Sachaufgabe minus bis 100"],
    s_3mal:["sach","Sachaufgabe mal"], s_3geteilt:["sach","Sachaufgabe geteilt"], s_4zwei:["sach","Sachaufgabe in zwei Schritten"], s_4minus:["sach","Sachaufgabe minus bis 1000"], s_4mal:["sach","Sachaufgabe mal (zweistellig)"]
  };
  function fertigStand(liste){ const st={}; (liste||[]).forEach(x=>{ if(!x.k) return; (st[x.k]=st[x.k]||[0,0]); st[x.k][1]++; if(x.ok) st[x.k][0]++; }); return st; }

  // Das Druckblatt – wie ein Rückmeldebogen zur Klassenarbeit. Note nur, wenn opt.note gesetzt ist (Exemplar der Lehrkraft).
  function blattHTML(e, opt){
    opt=opt||{};
    const st=e.themen||themenStand(e.aufgaben), fs=fertigStand(e.aufgaben); let zeilen="";
    const AMP={g:"● sitzt sicher",m:"◐ noch üben",r:"○ wiederholen"};
    Object.keys(LEITIDEEN).forEach(li=>{ const ts=Object.keys(st).filter(t=>THEMEN[t] && THEMEN[t].li===li); if(!ts.length) return;
      const s=ts.reduce((a,t)=>[a[0]+st[t][0],a[1]+st[t][1]],[0,0]);
      zeilen+=`<tr class="liz"><td>${LEITIDEEN[li]}</td><td>${s[0]} / ${s[1]}</td><td></td></tr>`+
        ts.map(t=>{ const a=ampel(st[t]), arten=Object.keys(fs).filter(k=>FERTIGKEITEN[k] && FERTIGKEITEN[k][0]===t);
          return `<tr class="thz"><td>&nbsp;&nbsp;${THEMEN[t].n}</td><td>${st[t][0]} / ${st[t][1]}</td><td>${AMP[a]}</td></tr>`+
            (arten.length>1 ? arten.map(k=>`<tr class="faz"><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;– ${FERTIGKEITEN[k][1]}</td><td>${fs[k][0]} / ${fs[k][1]}</td><td>${fs[k][0]/fs[k][1]<0.5?"○ wiederholen":fs[k][0]===fs[k][1]?"●":""}</td></tr>`).join("") : ""); }).join(""); });
    const [k,z]=String(e.test||"").split("-");
    const note = opt.note && e.note ? `<div class="note">Note: <b>${esc(e.note)}</b> (${NOTEN_WORT[e.note]||""})</div>` : "";
    const lang=(e.aufgaben||[]).length>25;
    return `<div class="lsBlatt${lang?" lang":""}"><h1>Lernstand Mathematik</h1>
      <div class="kz"><span><b>Name:</b> ${esc(e.name)}</span><span><b>Test:</b> Klasse ${esc(k)} · ${ZEIT_LANG[z]||esc(z)}</span><span><b>Datum:</b> ${esc(e.datum)}</span></div>
      <div class="sumz"><span class="sum">Erreicht: ${e.richtig} von ${e.max} Punkten (${e.prozent} %)</span>${note}</div>
      <table><tr><th>Leitidee / Thema / Aufgabenart</th><th style="width:22mm">Punkte</th><th style="width:38mm">Einschätzung</th></tr>${zeilen}</table>
      ${lang?`<div class="unterschrift"><div>Unterschrift Erziehungsberechtigte</div><div>Bemerkung der Lehrkraft</div></div><div class="seite2"></div><h2>Alle Aufgaben · ${esc(e.name)} · ${esc(e.datum)}</h2>`:""}
      <table class="aufg"><tr><th style="width:8mm">Nr.</th><th>Aufgabe</th><th style="width:22mm">Antwort</th><th style="width:22mm">Richtig</th><th style="width:7mm"></th></tr>
        ${(e.aufgaben||[]).map((x,i)=>`<tr><td>${i+1}</td><td>${esc(x.f)}</td><td>${esc(x.a)}</td><td>${esc(x.s)}</td><td>${x.ok?"✓":"✗"}</td></tr>`).join("")}</table>
      ${lang?"":`<div class="unterschrift"><div>Unterschrift Erziehungsberechtigte</div><div>Bemerkung der Lehrkraft</div></div>`}
      <div class="fuss">Mathe-Trainer · Schule Hohe Landwehr · Aufgaben orientiert an „Flex und Flo" und an den Leitideen des Hamburger Bildungsplans Mathematik (Grundschule).</div></div>`;
  }

  // ===== Lernverlauf: gleiche Aufgabenarten über die Monate =====
  const MONATE=["Jan","Feb","März","Apr","Mai","Juni","Juli","Aug","Sep","Okt","Nov","Dez"];
  const monatVon=e=>e.monat || (()=>{ const p=String(e.datum||"").split("."); return p.length===3 ? `${p[2]}-${p[1]}` : ""; })();
  const monatKurz=m=>{ const [j,mm]=m.split("-"); return `${MONATE[(+mm)-1]||mm} ${String(j).slice(2)}`; };
  // eintraege: Tests eines Kindes (oder der ganzen Klasse). Ergebnis: Monate, Arten je Monat [richtig, gestellt]
  function verlaufDaten(eintraege){
    const mitArt=(eintraege||[]).filter(e=>e.aufgaben && e.aufgaben.some(x=>x.k));
    const monate=[...new Set(mitArt.map(monatVon))].filter(Boolean).sort();
    const d={}; mitArt.forEach(e=>{ const m=monatVon(e); e.aufgaben.forEach(x=>{ if(!x.k) return; d[x.k]=d[x.k]||{}; const z=(d[x.k][m]=d[x.k][m]||[0,0]); z[1]++; if(x.ok) z[0]++; }); });
    const trend={}; Object.keys(d).forEach(k=>{ const ms=monate.filter(m=>d[k][m]); if(ms.length<2){ trend[k]="neu"; return; }
      // ↑/↓ nur bei genug Aufgaben (zusammen mindestens 5) und deutlicher Änderung (mindestens ein Drittel) – eine einzelne Ausrutscher-Aufgabe zählt nicht
      const A=d[k][ms[ms.length-2]], Bm=d[k][ms[ms.length-1]], a=A[0]/A[1], b=Bm[0]/Bm[1], genug=A[1]+Bm[1]>=5;
      trend[k]= genug && b>=a+0.33 ? "besser" : genug && b<=a-0.33 ? "schlechter" : "gleich"; });
    return {monate, d, trend, ohneArt:(eintraege||[]).length-mitArt.length};
  }
  function verlaufHTML(eintraege, opt){
    opt=opt||{}; const v=verlaufDaten(eintraege);
    if(!v.monate.length) return `<div class="lsBlatt"><h1>${esc(opt.titel||"Lernverlauf")}</h1><p>Noch keine Tests mit Einzelauswertung. Der Verlauf erscheint nach dem ersten langen Test.</p></div>`;
    const farbe=([r,n])=>{ const p=r/n; return p>=0.75?"vg":p>=0.5?"vm":"vr"; };
    const zaehl={besser:0,gleich:0,schlechter:0,neu:0}; Object.values(v.trend).forEach(t=>zaehl[t]++);
    const PF={besser:"↑ besser",schlechter:"↓ schlechter",gleich:"→ etwa gleich",neu:"neu"};
    let zeilen="";
    Object.keys(THEMEN).forEach(t=>{ const arten=Object.keys(FERTIGKEITEN).filter(k=>FERTIGKEITEN[k][0]===t && v.d[k]); if(!arten.length) return;
      zeilen+=`<tr class="thz"><td colspan="${v.monate.length+2}">${THEMEN[t].n}</td></tr>`+arten.map(k=>`<tr><td>&nbsp;&nbsp;${FERTIGKEITEN[k][1]}</td>${v.monate.map(m=>{ const z=v.d[k][m];
        return z ? `<td class="${farbe(z)}">${opt.klasse?Math.round(z[0]/z[1]*100)+" %":`${z[0]} / ${z[1]}`}</td>` : `<td class="vl"></td>`; }).join("")}<td class="tr ${v.trend[k]}">${PF[v.trend[k]]}</td></tr>`).join(""); });
    return `<div class="lsBlatt verlauf"><h1>${esc(opt.titel||"Lernverlauf Mathematik")}</h1>
      <div class="kz"><span>${esc(opt.unter||"")}</span><span>${v.monate.map(monatKurz).join(" · ")}</span></div>
      <p class="erkl">Verglichen werden nur <b>gleiche Aufgabenarten</b> (z. B. „Plus bis 100 mit Übergang" im November und im Dezember). Neue, schwierigere Aufgabenarten stehen als <b>„neu"</b> da – sie zählen nicht als Rückschritt.
      <b>↑ / ↓</b> erscheint nur, wenn mindestens 5 Aufgaben dieser Art verglichen werden und sich das Ergebnis um mindestens ein Drittel verändert hat – ein einzelner Flüchtigkeitsfehler zählt nicht.
      ${opt.klasse?"Zahlen = Anteil richtiger Aufgaben der ganzen Klasse.":"Zahlen = richtig gelöst / gestellt."}</p>
      <div class="sumz"><span>↑ besser geworden: <b>${zaehl.besser}</b> · → etwa gleich: <b>${zaehl.gleich}</b> · ↓ schlechter: <b>${zaehl.schlechter}</b> · neu: <b>${zaehl.neu}</b></span></div>
      <table><tr><th>Aufgabenart</th>${v.monate.map(m=>`<th style="width:17mm">${monatKurz(m)}</th>`).join("")}<th style="width:28mm">Entwicklung</th></tr>${zeilen}</table>
      ${v.ohneArt?`<p class="erkl">${v.ohneArt} kurze${v.ohneArt===1?"r":""} Test${v.ohneArt===1?"":"s"} vom Anfang ohne Einzelauswertung ${v.ohneArt===1?"ist":"sind"} hier nicht enthalten.</p>`:""}
      <div class="fuss">Mathe-Trainer · Schule Hohe Landwehr · Lernverlauf aus den Tests „Wo stehe ich?"</div></div>`;
  }

  // Aussehen der Blätter (am Bildschirm als weiße Seite, beim Drucken A4)
  const css=document.createElement("style");
  css.textContent=`
    .lsBlatt{background:#fff;color:#000;font-family:"Segoe UI",system-ui,-apple-system,Arial,sans-serif;font-size:14px;line-height:1.4;padding:28px 32px;border-radius:8px;max-width:800px;margin:0 auto 16px;text-align:left}
    .lsBlatt h1{font-size:24px;margin:0 0 6px;color:#000} .lsBlatt h2{font-size:16px;margin:4px 0 6px;color:#000}
    .lsBlatt .kz{display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px 20px;border-bottom:2px solid #000;padding-bottom:6px;margin-bottom:10px}
    .lsBlatt .sumz{display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:6px;margin:4px 0 10px} .lsBlatt .sum{font-size:18px;font-weight:bold}
    .lsBlatt .note{font-size:18px;border:2px solid #000;border-radius:6px;padding:2px 12px}
    .lsBlatt .erkl{font-size:12.5px;color:#333;margin:4px 0 8px}
    .lsBlatt table{width:100%;border-collapse:collapse;margin:6px 0 14px} .lsBlatt th,.lsBlatt td{border:1px solid #777;padding:5px 7px;text-align:left;font-size:13px;vertical-align:top;color:#000;white-space:normal}
    .lsBlatt th{background:#eee;color:#000} .lsBlatt .liz td{background:#e9e9e9;font-weight:bold} .lsBlatt .thz td{font-weight:bold;background:#f7f7f7} .lsBlatt .faz td{color:#333;font-size:12px}
    .lsBlatt.verlauf td{text-align:center} .lsBlatt.verlauf td:first-child{text-align:left} .lsBlatt.verlauf .thz td{text-align:left}
    .lsBlatt .vg{background:#dcfce7} .lsBlatt .vm{background:#fef9c3} .lsBlatt .vr{background:#fee2e2} .lsBlatt .vl{background:#fafafa}
    .lsBlatt .tr{white-space:nowrap} .lsBlatt .tr.besser{color:#15803d;font-weight:bold} .lsBlatt .tr.schlechter{color:#b91c1c;font-weight:bold} .lsBlatt .tr.neu{color:#555;font-style:italic}
    .lsBlatt .unterschrift{margin-top:34px;display:flex;gap:40px} .lsBlatt .unterschrift div{flex:1;border-top:1px solid #000;padding-top:3px;font-size:12px}
    .lsBlatt .fuss{margin-top:20px;font-size:11px;color:#444} .lsBlatt .seite2{height:18px}
    @media print{ html,body{min-height:0!important;height:auto!important} .lsBlatt{padding:0;border-radius:0;max-width:none;margin:0;font-size:11pt;page-break-after:always} .lsBlatt:last-child{page-break-after:auto}
      .lsBlatt h1{font-size:15pt;margin:0 0 1mm} .lsBlatt h2{font-size:11pt;margin:0 0 1.5mm} .lsBlatt .kz{padding-bottom:1.5mm;margin-bottom:2.5mm;font-size:10pt} .lsBlatt .sumz{margin:1mm 0 2.5mm}
      .lsBlatt table{margin:1mm 0 3.5mm} .lsBlatt th,.lsBlatt td{font-size:8.6pt;padding:0.35mm 1.5mm;border:0.6pt solid #666;line-height:1.18} .lsBlatt tr{page-break-inside:avoid}
      .lsBlatt .faz td{font-size:8pt} .lsBlatt .erkl{font-size:8.5pt;margin:1mm 0 2mm}
      .lsBlatt .seite2{page-break-before:always;height:0}
      .lsBlatt .sum{font-size:13pt} .lsBlatt .note{font-size:13pt} .lsBlatt .unterschrift{margin-top:8mm} .lsBlatt .fuss{margin-top:2.5mm;font-size:7.5pt}
      .lsBlatt th,.lsBlatt .liz td,.lsBlatt .thz td,.lsBlatt .vg,.lsBlatt .vm,.lsBlatt .vr{-webkit-print-color-adjust:exact;print-color-adjust:exact} }
    @page{size:A4;margin:10mm 13mm 10mm}`;
  document.head.appendChild(css);

  return {LEITIDEEN, THEMEN, ZEIT, ZEIT_LANG, testName, themenStand, ampel, AMPEL, SCHLUESSEL_STD, NOTEN_WORT, noteAus, blattHTML, esc,
          FERTIGKEITEN, fertigStand, verlaufDaten, verlaufHTML, monatVon};
})();
