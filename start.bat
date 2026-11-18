@echo off
cd /d "%~dp0"
title Zodetron Dining by Hardik - Launcher

echo.
echo  ================================================
echo   Zodetron Dining by Hardik
echo   Where Code Meets Cuisine.
echo   Powered by Taste. Driven by Tech.
echo  ================================================
echo.

:: Check .NET SDK
where dotnet >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] .NET SDK not found. Download from https://aka.ms/dotnet-download
    pause
    exit /b 1
)

:: Check Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js not found. Download from https://nodejs.org/
    pause
    exit /b 1
)

echo  [1/3] Installing frontend dependencies...
cd frontend
call npm install --silent
if %errorlevel% neq 0 (
    echo  [ERROR] npm install failed.
    pause
    exit /b 1
)
cd ..

echo  [2/3] Starting Backend API on http://localhost:5000 ...
start "Zodetron Dining - Backend" cmd /k "cd backend && dotnet run"

:: Give backend a moment to boot
timeout /t 4 /nobreak >nul

echo  [3/3] Starting Frontend on http://localhost:3000 ...
start "Zodetron Dining - Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo  ================================================
echo   Both servers are running!
echo.
echo   Frontend  ->  http://localhost:3000
echo   Backend   ->  http://localhost:5000
echo.
echo   Admin login:
echo     Email   : admin@foodorder.com
echo     Password: admin123
echo  ================================================
echo.

:: Open browser
start http://localhost:3000

echo  Press any key to close this launcher window...
pause >nul
