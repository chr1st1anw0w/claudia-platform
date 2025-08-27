<div align="center">
  <img src="https://github.com/user-attachments/assets/92fd93ed-e71b-4b94-b270-50684323dd00" alt="Claudia Logo" width="120" height="120">

  <a href="https://claudiacode.com"><h1>Claudia 平台</h1></a>

  <p>
    <strong>強大的 Claude Code GUI 應用程式與工具包</strong>
  </p>
  <p>
    <strong>建立自定義 AI 代理、管理互動式 Claude Code 會話、執行安全背景代理等功能</strong>
  </p>

  <p>
    <a href="#-功能特色"><img src="https://img.shields.io/badge/功能特色-✨-blue?style=for-the-badge" alt="Features"></a>
    <a href="#-安裝指南"><img src="https://img.shields.io/badge/安裝指南-🚀-green?style=for-the-badge" alt="Installation"></a>
    <a href="#-使用說明"><img src="https://img.shields.io/badge/使用說明-📖-purple?style=for-the-badge" alt="Usage"></a>
    <a href="#-開發指南"><img src="https://img.shields.io/badge/開發指南-🛠️-orange?style=for-the-badge" alt="Development"></a>
  </p>
</div>

![457013521-6133a738-d0cb-4d3e-8746-c6768c82672c](https://github.com/user-attachments/assets/a028de9e-d881-44d8-bae5-7326ab3558b9)

https://github.com/user-attachments/assets/bf0bdf9d-ba91-45af-9ac4-7274f57075cf

> [!TIP]
> **⭐ 為專案加星並關注 [@getAsterisk](https://x.com/getAsterisk) 以搶先體驗 `asteria-swe-v0`**

## 🌟 專案概述

**Claudia 平台** 是一個強大的桌面應用程式，徹底改變您與 Claude Code 的互動方式。基於 Tauri 2 構建，提供美觀的 GUI 介面來管理 Claude Code 會話、建立自定義代理、追蹤使用情況等功能。

將 Claudia 視為您的 Claude Code 指揮中心 - 在命令列工具與視覺化體驗之間搭建橋樑，讓 AI 輔助開發更加直觀且高效。

### 🆕 最新功能亮點

- **🔄 會話快照與差異比對系統** - 全新實現的版本控制功能
- **⚡ 快速操作模板** - 里程碑、備份、實驗、修復等預設模板
- **🔍 智能搜尋與篩選** - 強化的快照管理體驗
- **📊 視覺化差異比對** - 檔案級別的變更追蹤與展示

## 📋 目錄

- [🌟 專案概述](#-專案概述)
- [✨ 功能特色](#-功能特色)
  - [🗂️ 專案與會話管理](#️-專案與會話管理)
  - [🤖 CC 代理系統](#-cc-代理系統)
  - [🔄 會話快照與差異比對](#-會話快照與差異比對) **🆕 新功能**
  - [📊 使用分析儀表板](#-使用分析儀表板)
  - [🔌 MCP 伺服器管理](#-mcp-伺服器管理)
  - [⏰ 時間軸與檢查點](#-時間軸與檢查點)
  - [📝 CLAUDE.md 管理](#-claudemd-管理)
- [🚀 安裝指南](#-安裝指南)
- [🔨 從原始碼建置](#-從原始碼建置)
- [📖 使用說明](#-使用說明)
  - [快速開始](#快速開始)
  - [專案管理](#專案管理)
  - [代理建立](#代理建立)
  - [快照管理](#快照管理) **🆕**
  - [使用追蹤](#使用追蹤)
- [🛠️ 開發指南](#️-開發指南)
- [🔮 即將推出](#-即將推出)
- [👥 貢獻者](#-貢獻者)
- [🔒 安全性](#-安全性)
- [🤝 貢獻指南](#-貢獻指南)
- [📄 授權條款](#-授權條款)

## ✨ 功能特色

### 🗂️ **專案與會話管理**
- **視覺化專案瀏覽器**: 瀏覽 `~/.claude/projects/` 中的所有 Claude Code 專案
- **會話歷史記錄**: 查看並恢復過往的編程會話，保留完整上下文
- **智能搜尋**: 內建搜尋功能，快速找到專案和會話
- **會話洞察**: 一目了然地查看首則訊息、時間戳記和會話元資料

### 🔄 **會話快照與差異比對** 🆕
- **智能快照系統**: 自動或手動建立會話狀態快照，追蹤專案演進
- **視覺化差異比對**: 檔案級別的變更對比，清楚展示新增、刪除、修改內容
- **快速操作模板**:
  - 🏆 **里程碑快照**: 重要功能完成或專案階段性成果
  - 💾 **備份快照**: 進行重大變更前的安全備份
  - 🧪 **實驗快照**: 嘗試新想法或測試功能前的記錄點
  - 🔧 **修復快照**: Bug 修復完成後的狀態記錄
- **智能搜尋與篩選**: 支援描述、標籤、時間範圍的多維度搜尋
- **快照匯出功能**: JSON 格式匯出，支援版本控制整合
- **時間軸視圖**: 直觀的時間軸展示專案發展歷程

### 🤖 **CC 代理系統**
- **自定義 AI 代理**: 建立具有自定義系統提示和行為的專業代理
- **代理程式庫**: 為不同任務建立專用代理的集合
- **背景執行**: 在獨立進程中運行代理，實現非阻塞操作
- **執行歷史**: 追蹤所有代理運行，提供詳細日誌和效能指標



### 📊 **使用分析儀表板**
- **成本追蹤**: 即時監控您的 Claude API 使用量和成本
- **Token 分析**: 按模型、專案和時間段的詳細分解
- **視覺化圖表**: 美觀的圖表顯示使用趨勢和模式
- **資料匯出**: 匯出使用資料以供會計和分析

### 🔌 **MCP 伺服器管理**
- **伺服器註冊表**: 從中央 UI 管理 Model Context Protocol 伺服器
- **Easy Configuration**: Add servers via UI or import from existing configs
- **Connection Testing**: Verify server connectivity before use
- **Claude Desktop Import**: Import server configurations from Claude Desktop

### ⏰ **Timeline & Checkpoints**
- **Session Versioning**: Create checkpoints at any point in your coding session
- **Visual Timeline**: Navigate through your session history with a branching timeline
- **Instant Restore**: Jump back to any checkpoint with one click
- **Fork Sessions**: Create new branches from existing checkpoints
- **Diff Viewer**: See exactly what changed between checkpoints

### 📝 **CLAUDE.md Management**
- **Built-in Editor**: Edit CLAUDE.md files directly within the app
- **Live Preview**: See your markdown rendered in real-time
- **Project Scanner**: Find all CLAUDE.md files in your projects
- **Syntax Highlighting**: Full markdown support with syntax highlighting

## 📖 使用說明

### 快速開始

1. **啟動 Claudia**: 安裝後開啟應用程式
2. **歡迎畫面**: 選擇 CC 代理或 CC 專案
3. **首次設定**: Claudia 會自動偵測您的 `~/.claude` 目錄

### 專案管理

```
CC 專案 → 選擇專案 → 查看會話 → 恢復或開始新會話
```

- 點擊任何專案以查看其會話
- 每個會話顯示首則訊息和時間戳記
- 直接恢復會話或開始新會話

### 快照管理 🆕

```
命令面板 (Ctrl/Cmd + K) → 搜尋 "快照" → 快照管理
```

#### 建立快照
1. **快速模板**: 使用預設模板快速建立
   - 🏆 **里程碑**: 重要功能完成
   - 💾 **備份**: 重大變更前備份
   - 🧪 **實驗**: 測試新想法前記錄
   - 🔧 **修復**: Bug 修復後狀態

2. **自定義快照**:
   - 添加描述和標籤
   - 設定快照類型
   - 記錄變更原因

#### 差異比對
```
快照管理 → 選擇兩個快照 → 比較差異
```

- **檔案級別比對**: 清楚顯示變更的檔案
- **行級別差異**: 精確到每一行的變更
- **視覺化標示**: 新增(綠色)、刪除(紅色)、修改(藍色)
- **摺疊展開**: 可展開查看詳細變更內容

#### 快照操作
- **搜尋篩選**: 按描述、標籤、時間搜尋
- **匯出快照**: JSON 格式匯出
- **刪除快照**: 移除不需要的快照
- **查看詳情**: 檢視快照元資料

### 代理建立

```
CC Agents → Create Agent → Configure → Execute
```

1. **Design Your Agent**: Set name, icon, and system prompt
2. **Configure Model**: Choose between available Claude models
3. **Set Permissions**: Configure file read/write and network access
4. **Execute Tasks**: Run your agent on any project

### Tracking Usage

```
Menu → Usage Dashboard → View Analytics
```

- Monitor costs by model, project, and date
- Export data for reports
- Set up usage alerts (coming soon)

### Working with MCP Servers

```
Menu → MCP Manager → Add Server → Configure
```

- Add servers manually or via JSON
- Import from Claude Desktop configuration
- Test connections before using

## 🚀 安裝指南

### 系統需求

- **Claude Code CLI**: 從 [Claude 官方網站](https://claude.ai/code) 安裝
- **作業系統**: Windows 10+, macOS 10.15+, 或 Linux (Ubuntu 18.04+)
- **記憶體**: 最少 4GB RAM (建議 8GB+)
- **儲存空間**: 至少 500MB 可用空間

### 下載與安裝

**正式版本即將發布！** 🎉

我們正在準備各平台的安裝包：
- � **Windows**: `.msi` 安裝程式
- 🍎 **macOS**: `.dmg` 磁碟映像檔
- 🐧 **Linux**: `.deb` 和 `.rpm` 套件

### 搶先體驗
目前可透過從原始碼建置來體驗最新功能。

## 🔨 從原始碼建置

### 系統需求

在從原始碼建置 Claudia 之前，請確保已安裝以下軟體：

#### 系統需求

- **作業系統**: Windows 10/11, macOS 11+, 或 Linux (Ubuntu 20.04+)
- **記憶體**: 最少 4GB (建議 8GB)
- **儲存空間**: 至少 1GB 可用空間

#### 必要工具

1. **Rust** (1.70.0 或更新版本)
   ```bash
   # 透過 rustup 安裝
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. **Bun** (最新版本)
   ```bash
   # 安裝 Bun
   curl -fsSL https://bun.sh/install | bash
   ```

3. **Git**
   ```bash
   # Usually pre-installed, but if not:
   # Ubuntu/Debian: sudo apt install git
   # macOS: brew install git
   # Windows: Download from https://git-scm.com
   ```

4. **Claude Code CLI**
   - Download and install from [Claude's official site](https://claude.ai/code)
   - Ensure `claude` is available in your PATH

#### Platform-Specific Dependencies

**Linux (Ubuntu/Debian)**
```bash
# Install system dependencies
sudo apt update
sudo apt install -y \
  libwebkit2gtk-4.1-dev \
  libgtk-3-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  patchelf \
  build-essential \
  curl \
  wget \
  file \
  libssl-dev \
  libxdo-dev \
  libsoup-3.0-dev \
  libjavascriptcoregtk-4.1-dev
```

**macOS**
```bash
# Install Xcode Command Line Tools
xcode-select --install

# Install additional dependencies via Homebrew (optional)
brew install pkg-config
```

**Windows**
- Install [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- Install [WebView2](https://developer.microsoft.com/microsoft-edge/webview2/) (usually pre-installed on Windows 11)

### Build Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/getAsterisk/claudia.git
   cd claudia
   ```

2. **Install Frontend Dependencies**
   ```bash
   bun install
   ```

3. **Build the Application**
   
   **For Development (with hot reload)**
   ```bash
   bun run tauri dev
   ```
   
   **For Production Build**
   ```bash
   # Build the application
   bun run tauri build
   
   # The built executable will be in:
   # - Linux: src-tauri/target/release/bundle/
   # - macOS: src-tauri/target/release/bundle/
   # - Windows: src-tauri/target/release/bundle/
   ```

4. **Platform-Specific Build Options**
   
   **Debug Build (faster compilation, larger binary)**
   ```bash
   bun run tauri build --debug
   ```
   
   **Build without bundling (creates just the executable)**
   ```bash
   bun run tauri build --no-bundle
   ```
   
   **Universal Binary for macOS (Intel + Apple Silicon)**
   ```bash
   bun run tauri build --target universal-apple-darwin
   ```

### Troubleshooting

#### Common Issues

1. **"cargo not found" error**
   - Ensure Rust is installed and `~/.cargo/bin` is in your PATH
   - Run `source ~/.cargo/env` or restart your terminal

2. **Linux: "webkit2gtk not found" error**
   - Install the webkit2gtk development packages listed above
   - On newer Ubuntu versions, you might need `libwebkit2gtk-4.0-dev`

3. **Windows: "MSVC not found" error**
   - Install Visual Studio Build Tools with C++ support
   - Restart your terminal after installation

4. **"claude command not found" error**
   - Ensure Claude Code CLI is installed and in your PATH
   - Test with `claude --version`

5. **Build fails with "out of memory"**
   - Try building with fewer parallel jobs: `cargo build -j 2`
   - Close other applications to free up RAM

#### Verify Your Build

After building, you can verify the application works:

```bash
# Run the built executable directly
# Linux/macOS
./src-tauri/target/release/claudia

# Windows
./src-tauri/target/release/claudia.exe
```

### Build Artifacts

The build process creates several artifacts:

- **Executable**: The main Claudia application
- **Installers** (when using `tauri build`):
  - `.deb` package (Linux)
  - `.AppImage` (Linux)
  - `.dmg` installer (macOS)
  - `.msi` installer (Windows)
  - `.exe` installer (Windows)

All artifacts are located in `src-tauri/target/release/bundle/`.

## 🛠️ Development

### Tech Stack

- **Frontend**: React 18 + TypeScript + Vite 6
- **Backend**: Rust with Tauri 2
- **UI Framework**: Tailwind CSS v4 + shadcn/ui
- **Database**: SQLite (via rusqlite)
- **Package Manager**: Bun

### Project Structure

```
claudia/
├── src/                   # React frontend
│   ├── components/        # UI components
│   ├── lib/               # API client & utilities
│   └── assets/            # Static assets
├── src-tauri/             # Rust backend
│   ├── src/
│   │   ├── commands/      # Tauri command handlers
│   │   ├── checkpoint/    # Timeline management
│   │   └── process/       # Process management
│   └── tests/             # Rust test suite
└── public/                # Public assets
```

### Development Commands

```bash
# Start development server
bun run tauri dev

# Run frontend only
bun run dev

# Type checking
bunx tsc --noEmit

# Run Rust tests
cd src-tauri && cargo test

# Format code
cd src-tauri && cargo fmt
```

## � 即將推出

我們正在積極開發以下功能，敬請期待：

### 🚀 近期規劃
- **🌐 多語言支援**: 完整的國際化支援，包含繁體中文、簡體中文、英文等
- **🔄 即時協作**: 多人同時編輯專案的協作功能
- **📱 行動端應用**: iOS 和 Android 原生應用程式
- **☁️ 雲端同步**: 可選的雲端備份和同步功能
- **🎨 主題系統**: 自定義主題和外觀設定
- **🔌 插件生態**: 第三方插件開發框架

### 🎯 長期願景
- **🤖 AI 助手整合**: 整合更多 AI 模型和服務
- **📊 進階分析**: 更深入的程式碼分析和建議
- **🔗 Git 整合**: 深度整合版本控制系統
- **🏢 企業功能**: 團隊管理、權限控制、稽核日誌

## 👥 貢獻者

感謝所有為 Claudia 平台做出貢獻的開發者：

### 🏆 核心團隊
- **[@chr1st1anw0w](https://github.com/chr1st1anw0w)** - 專案維護者與主要開發者
- **[@getAsterisk](https://github.com/getAsterisk)** - 架構設計與技術指導

### 🌟 特別貢獻
- **會話快照系統**: 由核心團隊設計並實現，提供強大的版本控制功能
- **差異比對引擎**: 創新的視覺化差異比對技術
- **快速操作模板**: 提升開發效率的智能模板系統

### 🤝 如何貢獻
我們歡迎各種形式的貢獻！請參閱我們的 [貢獻指南](CONTRIBUTING.md) 了解詳情。

**貢獻方式包括**：
- 🐛 回報 Bug 和問題
- 💡 提出新功能建議
- 📝 改善文件和教學
- 🔧 提交程式碼修復和功能
- 🌍 協助多語言翻譯
- 📢 推廣和分享專案

## 🔒 安全性

Claudia 優先考慮您的隱私和安全：

1. **進程隔離**: 代理在獨立進程中運行
2. **權限控制**: 為每個代理配置檔案和網路存取權限
3. **本地儲存**: 所有資料保留在您的機器上
4. **無遙測**: 不收集或追蹤資料
5. **開源透明**: 透過開源程式碼實現完全透明

## 🤝 貢獻指南

我們歡迎貢獻！請參閱我們的 [貢獻指南](CONTRIBUTING.md) 了解詳情。

### Areas for Contribution

- 🐛 Bug fixes and improvements
- ✨ New features and enhancements
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- 🧪 Test coverage
- 🌐 Internationalization

## 📄 授權條款

本專案採用 AGPL 授權條款 - 詳情請參閱 [LICENSE](LICENSE) 檔案。

### 授權摘要
- ✅ **商業使用**: 允許商業用途
- ✅ **修改**: 允許修改原始碼
- ✅ **分發**: 允許分發軟體
- ✅ **專利使用**: 提供專利授權
- ⚠️ **網路使用**: 網路使用也需要提供原始碼
- ⚠️ **相同授權**: 衍生作品必須使用相同授權
- ⚠️ **原始碼**: 必須提供原始碼

## 🙏 致謝

感謝以下專案和社群的支持：

- **[Tauri](https://tauri.app/)** - 安全的桌面應用程式框架
- **[Claude](https://claude.ai)** by Anthropic - 強大的 AI 助手
- **[React](https://reactjs.org/)** - 使用者介面函式庫
- **[TypeScript](https://www.typescriptlang.org/)** - 型別安全的 JavaScript
- **[Rust](https://www.rust-lang.org/)** - 系統程式語言
- **[Tailwind CSS](https://tailwindcss.com/)** - CSS 框架

### 特別感謝
- **開源社群**: 為無數優秀的開源專案
- **早期使用者**: 提供寶貴的回饋和建議
- **貢獻者**: 每一個 commit、issue 和 PR 都讓 Claudia 更好

---

<div align="center">
  <p>
    <strong>用 ❤️ 打造，來自 <a href="https://asterisk.so/">Asterisk</a> 團隊</strong>
  </p>
  <p>
    <a href="https://github.com/chr1st1anw0w/claudia-platform/issues">回報問題</a>
    ·
    <a href="https://github.com/chr1st1anw0w/claudia-platform/issues">功能建議</a>
    ·
    <a href="https://claudiacode.com">官方網站</a>
  </p>

  <p>
    <strong>⭐ 如果這個專案對您有幫助，請給我們一個星星！</strong>
  </p>
</div>

## 📊 專案統計

[![Star History Chart](https://api.star-history.com/svg?repos=chr1st1anw0w/claudia-platform&type=Date)](https://www.star-history.com/#chr1st1anw0w/claudia-platform&Date)

