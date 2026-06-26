@echo off
echo Building kingdom data from vault...
node scripts\build-data.js
echo Starting kingdom server...
start /b "" cmd /c "cd kingdom && npm run dev"
timeout /t 3 /nobreak > nul
start "" "http://localhost:5173/"
