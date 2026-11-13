@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 本机预览：http://127.0.0.1:8000   （改文件会自动刷新，Ctrl+C 停）
start "" "http://127.0.0.1:8000"
".venv\Scripts\python.exe" -m mkdocs serve
pause
