@echo off
echo ========================================
echo  Furniture Showroom System - Startup
echo ========================================
echo.

REM Check if MongoDB is running
echo [1/3] Checking MongoDB...
timeout /t 2 /nobreak >nul
echo MongoDB should be running on port 27017
echo.

REM Start Backend
echo [2/3] Starting Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0Backend && npm start"
timeout /t 3 /nobreak >nul
echo Backend starting on http://localhost:5000
echo.

REM Start Frontend
echo [3/3] Starting Frontend Application...
start "Frontend App" cmd /k "cd /d %~dp0frontend && npm start"
echo Frontend will open at http://localhost:3000
echo.

echo ========================================
echo  Both servers are starting!
echo  - Backend: http://localhost:5000
echo  - Frontend: http://localhost:3000
echo ========================================
echo.
echo Press any key to close this window...
pause >nul
