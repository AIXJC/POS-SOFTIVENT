@echo off
cd /d C:\Users\Ander\OneDrive\Desktop\DRAGONES_MARINOS_SFAVIS
taskkill /F /IM node.exe >nul 2>&1
del /q backend.log backend-err.log frontend.log frontend-err.log >nul 2>&1
start "TIENDA-BACK" /min cmd /c "node backend\src\server.js > backend.log 2> backend-err.log"
start "TIENDA-FRONT" /min cmd /c "node node_modules\vite\bin\vite.js --host 0.0.0.0 --port 5175 --strictPort > frontend.log 2> frontend-err.log"
echo Servidores lanzados. Espera 8 segundos y abre http://127.0.0.1:5175/
timeout /t 8 >nul
type backend.log
type frontend.log
pause
