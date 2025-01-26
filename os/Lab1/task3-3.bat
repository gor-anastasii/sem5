@echo off
if "%1"=="" (
    echo specify the extension.
    exit /b
)
mkdir TXT
move *%1 TXT
echo work is done
pause
