@echo off
REM === Flask Auto-Restart Script ===
REM Set your backend directory here:
cd /d "C:\Users\punya mittal\Downloads\team_1B-main-1\team_1B-main-1\unified-farm-app\src\plantdiseaseprediction\app"

REM Uncomment the next line if you use a virtual environment:
REM call venv\Scripts\activate

:loop
echo Starting Flask backend...
set FLASK_APP=main.py
set FLASK_ENV=development
flask run --host=0.0.0.0 --port=5000
echo Flask crashed or stopped. Restarting in 5 seconds...
timeout /t 5
goto loop 