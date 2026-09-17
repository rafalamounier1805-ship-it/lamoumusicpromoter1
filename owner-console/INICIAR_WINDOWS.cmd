@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Instale Node.js 22 ou superior antes de iniciar.
  pause
  exit /b 1
)
if not exist ".output\server\index.mjs" (
  echo Build ausente. Execute: bun scripts/build-portable.mjs
  pause
  exit /b 1
)
set HOST=127.0.0.1
set PORT=4173
echo LAMOU candidata: http://127.0.0.1:4173
echo Mantenha esta janela aberta. Encerre com Ctrl+C.
node .output\server\index.mjs
pause
