@echo off
echo Starting the script
cd "..\glasses za puskane\FileMover\"  // Път до папката, където се намира `moveFiles.js`
// if %errorlevel% neq 0 echo Error at the "cd" command
node moveFiles.js
pause
