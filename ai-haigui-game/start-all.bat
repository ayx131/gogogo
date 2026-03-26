@echo off
setlocal

REM ===============================
REM AI 海龟汤 一键启动脚本 (Windows)
REM ===============================

set "ROOT_DIR=%~dp0"
set "BACKEND_DIR=%ROOT_DIR%backend"
set "NODE_EXE=C:\Program Files\nodejs\node.exe"
set "NPM_CMD=C:\Program Files\nodejs\npm.cmd"

if not exist "%NODE_EXE%" (
  echo [ERROR] 未找到 Node.js: "%NODE_EXE%"
  echo 请先安装 Node.js LTS 后重试。
  pause
  exit /b 1
)

if not exist "%NPM_CMD%" (
  echo [ERROR] 未找到 npm.cmd: "%NPM_CMD%"
  echo 请确认 Node.js 安装完整并重试。
  pause
  exit /b 1
)

if not exist "%BACKEND_DIR%\package.json" (
  echo [ERROR] 未找到后端目录: "%BACKEND_DIR%"
  pause
  exit /b 1
)

echo [1/3] 启动后端服务...
start "AI-Haigui Backend" cmd /k "cd /d "%BACKEND_DIR%" && "%NPM_CMD%" run dev"

echo [2/3] 启动前端服务...
start "AI-Haigui Frontend" cmd /k "cd /d "%ROOT_DIR%" && "%NPM_CMD%" run dev -- --host 127.0.0.1 --port 5173"

echo [3/3] 等待服务启动并打开浏览器...
timeout /t 3 /nobreak >nul
start "" "http://127.0.0.1:5173/"

echo.
echo 启动完成：
echo - 前端: http://127.0.0.1:5173/
echo - 后端: http://127.0.0.1:3001/api/test
echo.
echo 提示：关闭两个新开的终端窗口即可停止服务。
endlocal

