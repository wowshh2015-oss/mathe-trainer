// ===== Anleitung für Eltern =====
// Ein Fenster, das jede Funktion des Mathe-Trainers kurz erklärt. Geöffnet wird es über „❓" in der Leiste oben rechts
// (komfort.js lädt diese Datei bei Bedarf nach) und über den Knopf auf der Startseite.
// Hier steht auch, welche Inhalte zu welcher Klassenstufe gehören – die Startseite benutzt dieselbe Liste.
window.Anleitung=(function(){
  // Was gehört in welche Klasse? (Zuordnung nach dem üblichen Stoffplan der Grundschule)
  const KLASSEN={
    zerlegen:        {ic:"🧩", name:"Zerlegen",       1:"bis 10 und bis 20", 2:"bis 100"},
    halbschriftlich: {ic:"🪜", name:"Rechenwege",     2:"Plus und Minus Schritt für Schritt", 3:"Mal mit Zehnerzahlen · Mal mit Zerlegen"},
    plus:            {ic:"➕", name:"Plus",           1:"bis 20", 2:"bis 100", 3:"bis 1000"},
    minus:           {ic:"➖", name:"Minus",          1:"bis 20", 2:"bis 100", 3:"bis 1000"},
    einmaleins:      {ic:"✖️", name:"Einmaleins",     2:"die Reihen kennenlernen und üben", 3:"alle Reihen sicher und schnell"},
    einsdurcheins:   {ic:"➗", name:"Einsdurcheins",  2:"Teilen kennenlernen und üben", 3:"alle Aufgaben sicher und schnell"},
    uhr:             {ic:"🕒", name:"Uhr-Trainer",    1:"volle und halbe Stunden", 2:"Viertel · 5 Minuten · Minuten · 13 bis 24 Uhr", 3:"Zeitspannen · „fünf vor halb“"},
    sach:            {ic:"📖", name:"Sachaufgaben",   1:"Plus und Minus bis 20", 2:"bis 100 · Mal und Geteilt", 3:"alle Rechenarten · unnötige Angaben"},
    geld:            {ic:"💶", name:"Geld",           1:"Münzen und Scheine zählen", 2:"passend bezahlen · einkaufen", 3:"Euro und Cent mit Komma · Rückgeld"},
    laengen:         {ic:"📏", name:"Längen",         2:"mit dem Lineal messen · Meter und Zentimeter", 3:"Millimeter · umwandeln · mit Längen rechnen"}
  };
  function klassenVon(app){ const k=KLASSEN[app]; return k ? [1,2,3].filter(n=>k[n]) : []; }
  function klassenText(app){ const l=klassenVon(app); return !l.length ? "" : l.length===1 ? "Kl. "+l[0] : "Kl. "+l[0]+"–"+l[l.length-1]; }

  const TEILE=[
   ["start","🚀","In einer Minute erklärt",`
     <p>Der Mathe-Trainer ist ein Übungsprogramm für das Kopfrechnen und die Grundlagen der Grundschul-Mathematik. Ihr Kind meldet sich mit Vornamen und Geheimtier an und sieht dann drei Dinge:</p>
     <ul><li><b>🧭 Mein Lernweg</b> – sechs Stufen vom Leichten zum Schweren. Die Stufe mit <b>„👉 jetzt dran“</b> ist die Empfehlung des Programms.</li>
     <li><b>Die Kacheln</b> – jedes Thema hat einen eigenen Trainer mit Übungsraum und Test.</li>
     <li><b>⭐ Sterne, 🔥 Lernflammen und ⛽ Tank</b> – Belohnungen für regelmäßiges Üben.</li></ul>
     <p class="anlTipp"><b>Wenn Sie nur eines tun:</b> Lassen Sie Ihr Kind an vier Tagen pro Woche etwa 10 Minuten das üben, was bei „jetzt dran“ steht.</p>`],
   ["anmelden","🐾","Anmelden: Name und Geheimtier",`
     <p>Ihr Kind tippt seinen <b>Vornamen</b> ein und danach auf sein <b>Geheimtier</b> (eines von 12 Bildern). Das Geheimtier schützt den Namen – ein Passwort gibt es nicht.</p>
     <ul><li>Dreimal falsch getippt: 5 Minuten Pause.</li><li><b>Tier vergessen?</b> Die Lehrkraft kann es zurücksetzen, danach sucht sich Ihr Kind ein neues aus.</li>
     <li>Der Name muss immer <b>gleich geschrieben</b> werden, sonst beginnt ein neuer, leerer Lernstand.</li></ul>`],
   ["lernweg","🧭","Der Lernweg und die Empfehlungen",`
     <p>Die sechs Stufen bauen aufeinander auf: <b>Zerlegen → Rechenwege → Plus → Minus → Einmaleins → Einsdurcheins</b>.</p>
     <ul><li>😊 <b>gefestigt</b>: Test auf Zeit mit mindestens 90 % bestanden.</li><li>😐 <b>angefangen</b>: geübt, aber der Test fehlt noch.</li><li>⚪ <b>noch nicht begonnen</b>.</li></ul>
     <p>Unter <b>„Das lohnt sich heute“</b> schlägt das Programm bis zu drei Dinge vor. Wer einer Empfehlung folgt, bekommt <b>50 % mehr Sterne</b> (Zeichen: ⭐ +50 %). Niemand ist gezwungen – alle offenen Kacheln dürfen jederzeit benutzt werden.</p>`],
   ["raeume","🏋️","In einem Trainer: Training, Test, Meine Aufgaben",`
     <ul><li><b>Training</b> – ohne Zeitdruck. Nach einem Fehler zeigt das Programm ein <b>Hilfe-Bild</b> (Zwanzigerfeld, Rechenstrich, Punktefeld), damit Ihr Kind die Aufgabe „sehen“ kann.</li>
     <li><b>Test</b> – auf Zeit, in den Stufen Leicht, Mittel und Schwer. Ab <b>90 %</b> ist er bestanden, dann gibt es eine Urkunde und Gold.</li>
     <li><b>🧠 Meine Aufgaben</b> – genau die Aufgaben, die noch unsicher sind. Eine Aufgabe verschwindet erst, wenn sie <b>dreimal hintereinander</b> richtig war.</li>
     <li><b>🔁 Wiederholen</b> – was gelernt ist, kommt nach 2, 7 und 21 Tagen noch einmal. So bleibt es dauerhaft im Kopf.</li></ul>
     <p class="anlTipp">Bitte nicht vorsagen: Das Programm merkt sich Fehler und bringt die Aufgabe wieder. Hilfreicher ist die Frage „Wie hast du das gerechnet?“</p>`],
   ["klassen","🎒","Was passt zu welcher Klasse?",`
     <p>Auf der Startseite gibt es über den Kacheln die Knöpfe <b>Klasse 1 · Klasse 2 · Klasse 3</b>. Sie zeigen auf jeder Kachel, was dort für diese Klasse geübt wird; Kacheln ohne passenden Inhalt werden blass. Gesperrt wird dadurch nichts.</p>
     <div class="anlTab"><table><thead><tr><th>Thema</th><th>Klasse 1</th><th>Klasse 2</th><th>Klasse 3</th></tr></thead><tbody>`+
     Object.keys(KLASSEN).map(a=>{ const k=KLASSEN[a]; return `<tr><td><b>${k.ic} ${k.name}</b></td><td>${k[1]||"–"}</td><td>${k[2]||"–"}</td><td>${k[3]||"–"}</td></tr>`; }).join("")+
     `</tbody></table></div>
     <p>Die beiden Spiele (Rallye, Marathon) mischen den Stoff und werden von Stufe zu Stufe schwerer. Die Zuordnung ist eine Orientierung – Kinder dürfen voraus- und zurückgehen.</p>`],
   ["programme","🧩","Die Kacheln im Überblick",`
     <ul><li><b>🧩 Zerlegen</b> – Zahlen zerlegen und ergänzen (8 + ? = 10). Die Grundlage für alles Weitere.</li>
     <li><b>🪜 Rechenwege</b> – Aufgaben Schritt für Schritt lösen, so wie im Unterricht (z. B. 47 + 25 oder 6 × 15).</li>
     <li><b>➕ Plus / ➖ Minus</b> – bis 20, bis 100 und bis 1000.</li>
     <li><b>✖️ Einmaleins / ➗ Einsdurcheins</b> – einzelne Reihen, Kernaufgaben oder gemischt.</li>
     <li><b>🕒 Uhr-Trainer</b> – die Uhr mit Zeigern lesen und stellen, später Zeitspannen.</li>
     <li><b>📖 Sachaufgaben</b> – Geschichte lesen, Rechenart finden, rechnen, Antwortsatz.</li>
     <li><b>💶 Geld / 📏 Längen</b> – Münzen, bezahlen, Rückgeld; messen und umwandeln.</li>
     <li><b>🏎️ Rechen-Rallye / 🏢 Rechen-Marathon</b> – Spiele zum Wiederholen. Sie verbrauchen „Sprit“ (siehe Tank).</li></ul>
     <p>Eine Kachel mit <b>🚧 „öffnet bald“</b> ist noch gesperrt: Die Lehrkraft öffnet sie, sobald das Thema im Unterricht erklärt wurde.</p>`],
   ["sterne","⭐","Sterne, Gold und das Sticker-Album",`
     <ul><li><b>⭐ Sterne gibt es für Fleiß:</b> 3 für eine Übungsrunde (ab 8 richtigen Aufgaben), 5 für „Meine Aufgaben“ oder ein neues Thema, 2 extra für die erste Runde des Tages.</li>
     <li><b>🌟 Gold gibt es für sicheres Können:</b> für jeden zum ersten Mal bestandenen Test und für jede gefestigte Stufe des Lernwegs.</li>
     <li><b>📒 Sticker-Album:</b> Alle 10 Sterne öffnet sich ein neuer Sticker, für Gold gibt es Glitzer-Sticker.</li></ul>
     <p>Es gibt <b>keine Rangliste</b>: Jedes Kind sieht nur seine eigenen Sterne. Die Lehrkraft kann Sterne verschenken, etwa für gute Arbeit im Heft.</p>`],
   ["flammen","🔥","Lernflammen und die Farbe des Namens",`
     <p>Jeder Tag, an dem geübt wird, bringt <b>eine Flamme</b>. Ein verpasster Schultag nimmt <b>eine</b> Flamme weg – mehr nicht. Samstag und Sonntag kosten nichts.</p>
     <p>10 Flammen = 🥉 Bronze · 20 = 🥈 Silber · 30 = 🥇 Gold · 40 = 💎 Diamant · 50 = 👑 Krone. Mit jeder Stufe leuchtet der Name auf der Startseite in einer neuen Farbe.</p>
     <p class="anlTipp">Die Flammen belohnen Regelmäßigkeit, nicht die Dauer: Eine kurze Runde am Tag genügt.</p>`],
   ["tank","⛽","Der Tank: Sprit für die Spiele",`
     <p>Rallye und Marathon kosten Sprit: <b>eine Rallye-Runde = 1</b>, <b>eine Marathon-Etage = 2</b>. Ist der Tank leer, zeigt das Programm, wo es neuen Sprit gibt.</p>
     <ul><li>Übungsrunde (ab 8 richtigen Aufgaben): <b>+10</b></li><li>„Meine Aufgaben“: <b>+15</b></li><li>ein neues Thema ausprobieren: <b>+20</b></li><li>ein zum ersten Mal bestandener Test: <b>+30</b></li></ul>
     <p>So wird erst gelernt und dann gespielt. Pro Thema zählen höchstens drei Runden am Tag.</p>`],
   ["hausaufgabe","📌","Hausaufgaben und Nachrichten der Lehrkraft",`
     <p>Hat die Lehrkraft eine <b>Hausaufgabe</b> gestellt, steht sie nach dem Anmelden ganz oben – mit dem Thema, der Anzahl der Runden und dem Abgabetag. Sie gilt als erledigt, sobald die Runden gemacht sind; abhaken muss niemand.</p>
     <p>Eine <b>📣 Nachricht an die Klasse</b> erscheint an derselben Stelle. Im Fenster <b>„Das ist neu“</b> sieht Ihr Kind, was seit seinem letzten Besuch dazugekommen ist.</p>`],
   ["leiste","🔊","Die Leiste oben rechts",`
     <ul><li><b>🔈 Vorlesen</b> – liest die Aufgabe vor.</li><li><b>🔇 / 🔊 Ton</b> – ist zu Beginn aus.</li><li><b>A<small>A</small> Schriftgröße</b> – drei Stufen.</li>
     <li><b>🔢 Zahlentasten</b> (Tablet und Handy) – eigene große Tasten statt der Bildschirmtastatur.</li><li><b>❓</b> – diese Anleitung.</li></ul>`],
   ["eltern","👨‍👩‍👧","Für Eltern: Lernstand und Datenschutz",`
     <p>Sobald die Lehrkraft sie geöffnet hat, finden Sie ganz unten auf der Startseite <b>„Für Eltern“</b>: eine druckbare Seite mit dem Lernstand Ihres Kindes, den noch unsicheren Aufgaben und einem Tipp, was jetzt am meisten hilft.</p>
     <p>Ebenfalls erst nach Freigabe: die <b>🧪 Einstufung</b> im Lernweg. Dort zeigt Ihr Kind in kurzen Teilen, was es schon sicher kann – diese Stufen muss es dann nicht von vorn üben.</p>
     <p><b>Datenschutz:</b> Gespeichert werden nur der Vorname und die Übungsergebnisse. Die Lehrkraft sieht den Lernstand der Klasse; andere Kinder und Eltern sehen ihn nicht.</p>`]
  ];
  const ZU_SEITE={ "rallye":"tank", "marathon":"tank", "eltern":"eltern", "einstufung":"eltern" };

  function stil(){
    if(document.getElementById("anlStil")) return;
    const s=document.createElement("style"); s.id="anlStil";
    s.textContent=`
    .anlOv{position:fixed;inset:0;z-index:2100;background:rgba(5,10,22,.93);display:flex;align-items:flex-start;justify-content:center;padding:14px;overflow-y:auto;
      font-family:"Segoe UI",system-ui,-apple-system,Arial,sans-serif}
    body.anlOffen .kfLeiste{display:none!important}
    .anlBox{background:#1e293b;color:#f1f5f9;border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:20px 18px;max-width:640px;width:100%;margin:auto;box-shadow:0 10px 30px rgba(0,0,0,.4);text-align:left}
    .anlKopf{display:flex;align-items:flex-start;gap:10px;margin-bottom:6px} .anlKopf h3{flex:1;margin:0;font-size:22px;line-height:1.25}
    .anlKopf button,.anlFuss button{font-family:inherit;cursor:pointer;border:none;border-radius:12px;font-weight:700;background:linear-gradient(180deg,#38bdf8,#0284c7);color:#042433}
    .anlKopf button{font-size:15px;padding:8px 13px;flex:none} .anlFuss button{width:100%;font-size:17px;padding:13px;margin-top:14px}
    .anlUnter{color:#94a3b8;font-size:14px;margin:0 0 12px;line-height:1.45}
    .anlBox details{background:#0b1220;border:1px solid #334155;border-radius:14px;margin-bottom:8px;overflow:hidden}
    .anlBox details[open]{border-color:#38bdf8}
    .anlBox summary{cursor:pointer;list-style:none;padding:13px 14px;font-size:16.5px;font-weight:700;display:flex;align-items:center;gap:10px}
    .anlBox summary::-webkit-details-marker{display:none}
    .anlBox summary .i{font-size:22px;flex:none;width:28px;text-align:center} .anlBox summary .p{margin-left:auto;color:#94a3b8;font-size:18px;transition:.15s}
    .anlBox details[open] summary .p{transform:rotate(90deg)}
    .anlIn{padding:0 14px 12px;font-size:15px;line-height:1.55;color:#cbd5e1} .anlIn b{color:#fff} .anlIn p{margin:0 0 9px} .anlIn ul{margin:0 0 9px;padding-left:20px} .anlIn li{margin-bottom:5px}
    .anlTipp{background:rgba(56,189,248,.12);border:1px solid rgba(56,189,248,.45);border-radius:10px;padding:9px 12px}
    .anlTab{overflow-x:auto;margin-bottom:9px} .anlTab table{border-collapse:collapse;width:100%;font-size:13.5px;min-width:440px}
    .anlTab th{text-align:left;color:#94a3b8;font-weight:600;padding:5px 7px;border-bottom:1px solid #475569} .anlTab td{padding:6px 7px;border-bottom:1px solid #334155;vertical-align:top}
    @media print{ .anlOv{position:static;background:#fff;padding:0} .anlBox{background:#fff;color:#000;box-shadow:none;border:none;max-width:none} .anlIn,.anlIn b,.anlUnter{color:#000} .anlBox details{background:#fff;border-color:#999} .anlKopf button,.anlFuss{display:none} }`;
    document.head.appendChild(s);
  }
  function zeige(thema){
    stil();
    document.querySelectorAll(".anlOv").forEach(o=>o.remove());
    if(!thema){
      const seite=(location.pathname.split("/").pop()||"index.html").toLowerCase().replace("-trainer.html","").replace(".html","");
      thema = ZU_SEITE[seite] || (KLASSEN[seite] ? "raeume" : "start");
    }
    const ov=document.createElement("div"); ov.className="anlOv";
    ov.innerHTML=`<div class="anlBox" role="dialog" aria-label="Anleitung für Eltern">
      <div class="anlKopf"><h3>❓ So funktioniert der Mathe-Trainer</h3><button type="button" data-zu="1">Schließen ✕</button></div>
      <p class="anlUnter">Kurzanleitung für Eltern. Tippen Sie auf eine Überschrift, um sie aufzuklappen.</p>`+
      TEILE.map(t=>`<details data-t="${t[0]}"${t[0]===thema?" open":""}><summary><span class="i">${t[1]}</span><span>${t[2]}</span><span class="p">›</span></summary><div class="anlIn">${t[3]}</div></details>`).join("")+
      `<div class="anlFuss"><button type="button" data-zu="1">Alles klar</button></div></div>`;
    document.body.appendChild(ov); document.body.classList.add("anlOffen");
    ov.addEventListener("click", e=>{ if(e.target===ov || e.target.closest("[data-zu]")){ ov.remove(); document.body.classList.remove("anlOffen"); } });
    const offen=ov.querySelector("details[open]"); ov.scrollTop=0;
    if(offen && thema!=="start") setTimeout(()=>{ try{ offen.scrollIntoView({block:"start"}); }catch(e){} }, 30);
  }
  addEventListener("pagehide", ()=>{ document.querySelectorAll(".anlOv").forEach(o=>o.remove()); document.body.classList.remove("anlOffen"); });
  return { zeige, KLASSEN, klassenVon, klassenText };
})();
