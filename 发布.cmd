@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 正在发布到 https://liucuso4.github.io/blog/ ...
".venv\Scripts\python.exe" -m mkdocs gh-deploy --force --no-history
if errorlevel 1 (
  echo.
  echo 发布失败，看上面的报错。
) else (
  echo.
  echo 好了。等一分钟左右刷新网页就能看到。
  start "" "https://liucuso4.github.io/blog/"
)
pause
