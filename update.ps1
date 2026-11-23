# Aktualisiert die Online-Version: kopiert die 4 Trainer aus "Documents\Claude Code"
# in dieses Repository, macht einen Commit und lädt ihn zu GitHub hoch.
# Aufruf: Rechtsklick -> "Mit PowerShell ausführen"  (oder im Terminal: .\update.ps1)
$src = "C:\Users\petru\Documents\Claude Code"
$dst = $PSScriptRoot
foreach ($f in "index.html","logo.jpeg","einmaleins-trainer.html","einsdurcheins-trainer.html","plus-trainer.html","minus-trainer.html","zerlegen-trainer.html") {
  Copy-Item (Join-Path $src $f) (Join-Path $dst $f) -Force
  "kopiert: $f"
}
# Online-Version (mit Firebase-Archiv) -> Unterordner "online"
New-Item -ItemType Directory -Force (Join-Path $dst "online") | Out-Null
foreach ($f in "index.html","logo.jpeg","einmaleins-trainer.html","einsdurcheins-trainer.html","plus-trainer.html","minus-trainer.html","zerlegen-trainer.html") {
  Copy-Item (Join-Path $src ("mathe-trainer-online\" + $f)) (Join-Path $dst ("online\" + $f)) -Force
}
foreach ($x in "lehrer.html","marathon-trainer.html","rallye-trainer.html","halbschriftlich-trainer.html","anmeldung.js","tank.js","wiederholung.js","sterne.js","hilfe.js","komfort.js","uhr-trainer.html","hausaufgabe.js","sach-trainer.html","groessen.js","geld-trainer.html","laengen-trainer.html","einstufung-trainer.html","eltern.html","anleitung.js","platz-trainer.html","info.js","gewichte-trainer.html","zahlen-trainer.html","geo-trainer.html","daten-trainer.html","schrift-trainer.html","kalender-trainer.html","mix-trainer.html","sach2-trainer.html","strahl-trainer.html","stellen-trainer.html","stellen.js","paeckchen-trainer.html","entdecken.js","zoo-trainer.html","zoo.js","blitz-trainer.html","turm-trainer.html","turm.js","turm-info.js","standort-trainer.html","lernstand.js","weltraum-reise.js") { Copy-Item (Join-Path $src ("mathe-trainer-online\" + $x)) (Join-Path $dst ("online\" + $x)) -Force }
# Bilder (Mein Wolkenkratzer): ganzer Ordner
New-Item -ItemType Directory -Force (Join-Path $dst "online\bilder\turm") | Out-Null
Copy-Item (Join-Path $src "mathe-trainer-online\bilder\turm\*.webp") (Join-Path $dst "online\bilder\turm") -Force
# Bilder (Rechen-Rallye): gemalte Modelle
New-Item -ItemType Directory -Force (Join-Path $dst "online\bilder\rallye") | Out-Null
Copy-Item (Join-Path $src "mathe-trainer-online\bilder\rallye\*.webp") (Join-Path $dst "online\bilder\rallye") -Force
Set-Location $dst
git add -A
git commit -m ("Update " + (Get-Date -Format "dd.MM.yyyy HH:mm")) 2>$null
git push
"Fertig - die Online-Version ist in 1-2 Minuten aktualisiert."
