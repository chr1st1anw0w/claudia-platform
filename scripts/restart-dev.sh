#!/bin/bash

echo "🚀 Claudia 開發服務器重啟腳本"
echo "================================="

# 檢查必要工具 (簡化，假設已安裝)
echo "ℹ️  檢查必要工具..."
# 這裡可以添加檢查 bun, tauri-cli 等的邏輯
echo "✅ 所有必要工具已安裝"

# 停止現有開發進程
echo "ℹ️  停止現有的開發進程..."
# 嘗試停止 tauri dev 進程
TAURI_PID=$(pgrep -f "tauri dev")
if [ -n "$TAURI_PID" ]; then
  echo "ℹ️  停止 tauri dev 進程..."
  kill $TAURI_PID
  sleep 1
fi

# 嘗試停止 vite 進程 (如果單獨運行)
VITE_PID=$(pgrep -f "vite")
if [ -n "$VITE_PID" ]; then
  echo "ℹ️  停止 vite 進程..."
  kill $VITE_PID
  sleep 1
fi

# 嘗試釋放端口 1420 (如果被佔用)
PORT=1420
PORT_PID=$(lsof -t -i:$PORT)
if [ -n "$PORT_PID" ]; then
  echo "⚠️  端口 $PORT 仍被佔用，嘗試釋放..."
  kill $PORT_PID
  sleep 1
fi

echo "✅ 所有開發進程已停止"

# 清理暫存文件和 Rust 編譯緩存
echo "ℹ️  清理暫存文件..."
rm -rf ./temp-claude-package
rm -rf ./src-tauri/target/debug/.fingerprint
rm -rf ./src-tauri/target/debug/build
rm -rf ./src-tauri/target/debug/deps
rm -rf ./src-tauri/target/debug/incremental
rm -rf ./src-tauri/target/debug/examples
rm -rf ./src-tauri/target/debug/native
rm -rf ./src-tauri/target/debug/plugins

echo "ℹ️  清理 Rust 編譯緩存..."
# cargo clean --manifest-path src-tauri/Cargo.toml

echo "✅ 暫存文件清理完成"

echo "\n✅ 準備重新啟動開發服務器..."

# 重新啟動開發服務器
echo "ℹ️  重新啟動開發服務器..."
echo "ℹ️  啟動 Tauri 開發服務器..."
echo "ℹ️  使用命令: bun run tauri dev"

bun run tauri dev
