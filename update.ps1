# Aktualisiert die Online-Version: kopiert die 4 Trainer aus "Documents\Claude Code"
# in dieses Repository, macht einen Commit und lädt ihn zu GitHub hoch.
# Aufruf: Rechtsklick -> "Mit PowerShell ausführen"  (oder im Terminal: .\update.ps1)
$src = "C:\Users\petru\Documents\Claude Code"
$dst = $PSScriptRoot
foreach ($f in "index.html","logo.jpeg","einmaleins-trainer.html","einsdurcheins-trainer.html","plus-trainer.html","minus-trainer.html") {
  Copy-Item (Join-Path $src $f) (Join-Path $dst $f) -Force
  "kopiert: $f"
}
# Online-Version (mit Firebase-Archiv) -> Unterordner "online"
New-Item -ItemType Directory -Force (Join-Path $dst "online") | Out-Null
foreach ($f in "index.html","logo.jpeg","einmaleins-trainer.html","einsdurcheins-trainer.html","plus-trainer.html","minus-trainer.html") {
  Copy-Item (Join-Path $src ("mathe-trainer-online\" + $f)) (Join-Path $dst ("online\" + $f)) -Force
}
Set-Location $dst
git add -A
git commit -m ("Update " + (Get-Date -Format "dd.MM.yyyy HH:mm")) 2>$null
git push
"Fertig - die Online-Version ist in 1-2 Minuten aktualisiert."
