@echo off
echo ===================================================
echo   Starting AI Secure Data Intelligence Platform
echo ===================================================
echo.
echo The backend is starting up. Your browser will open automatically in 10 seconds...
echo.

:: Start the browser with a 10 second delay in the background
start /b cmd /c "timeout /t 10 >nul & start http://localhost:8080"

:: Start the backend using the PowerShell script (which also auto-fixes JAVA_HOME)
powershell -ExecutionPolicy Bypass -File .\run.ps1
pause
