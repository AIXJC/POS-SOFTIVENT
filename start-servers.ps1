$root = 'C:\Users\Ander\OneDrive\Desktop\PUNTO DE VENTA'
Set-Location $root
Remove-Item "$root\backend.log","$root\backend-err.log","$root\frontend.log","$root\frontend-err.log" -ErrorAction SilentlyContinue

$backend = Start-Process -FilePath "node" -ArgumentList @('backend\src\server.js') -WorkingDirectory $root -RedirectStandardOutput "$root\backend.log" -RedirectStandardError "$root\backend-err.log" -PassThru -WindowStyle Hidden
Write-Host "Backend PID: $($backend.Id)"

$frontend = Start-Process -FilePath "node" -ArgumentList @('node_modules\vite\bin\vite.js','--host','0.0.0.0','--port','5175','--strictPort') -WorkingDirectory $root -RedirectStandardOutput "$root\frontend.log" -RedirectStandardError "$root\frontend-err.log" -PassThru -WindowStyle Hidden
Write-Host "Frontend PID: $($frontend.Id)"
Write-Host "Listo: front http://127.0.0.1:5175/ back http://127.0.0.1:3003/api/health"
