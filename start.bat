@echo off
REM Quick Start Script for Backend Server (Windows)
echo.
echo ========================================
echo   Starting SMC Backend Server
echo ========================================
echo.

REM Check if .env exists
if not exist .env (
    echo [WARNING] .env file not found!
    echo Creating .env from template...
    if exist env.template (
        copy env.template .env
        echo.
        echo [IMPORTANT] Please edit .env file with your database credentials!
        echo Press any key to continue after editing .env...
        pause >nul
    ) else (
        echo [ERROR] env.template not found!
        pause
        exit /b 1
    )
)

echo Checking dependencies...
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)

echo.
echo Starting server on port 3001...
echo.
echo ========================================
echo   Server will start in a moment...
echo   Keep this window open!
echo ========================================
echo.

call npm run dev

pause

