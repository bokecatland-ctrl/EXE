@echo off
chcp 65001 > nul
set PATH=C:\nodejs\node-v22.14.0-win-x64;%PATH%

echo [1/4] Node.js version check...
node -v
if errorlevel 1 (
  echo ERROR: Node.js not found. Check the PATH in this bat file.
  pause
  exit /b 1
)

echo [2/4] Installing packages...
npm install
if errorlevel 1 (
  echo ERROR: npm install failed. See messages above.
  pause
  exit /b 1
)

echo [3/4] Initializing data...
npm run seed --workspace=server
if errorlevel 1 (
  echo ERROR: seed failed. See messages above.
  pause
  exit /b 1
)

echo [4/4] Starting server... Open http://localhost:5173 in your browser.
npm run dev
pause
