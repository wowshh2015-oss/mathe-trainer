# Aktualisiert die Online-Version: kopiert die 4 Trainer aus "Documents\Claude Code"
# in dieses Repository, macht einen Commit und lädt ihn zu GitHub hoch.
# Aufruf: Rechtsklick -> "Mit PowerShell ausführen"  (oder im Terminal: .\update.ps1)
$src = "C:\Users\petru\Documents\Claude Code"
$dst = $PSScriptRoot
foreach ($f in "einmaleins-trainer.html","einsdurcheins-trainer.html","plus-trainer.html","minus-trainer.html") {
  Copy-Item (Join-Path $src $f) (Join-Path $dst $f) -Force
  "kopiert: $f"
}
Set-Location $dst
git add -A
git commit -m ("Update " + (Get-Date -Format "dd.MM.yyyy HH:mm")) 2>$null
git push
"Fertig - die Online-Version ist in 1-2 Minuten aktualisiert."
