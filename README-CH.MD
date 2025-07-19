```markdown
# Claudia - 功能強大的 Claude Code GUI 應用程式和工具包

<div align="center">
  <img src="https://github.com/user-attachments/assets/92fd93ed-e71b-4b94-b270-50684323dd00" alt="Claudia Logo" width="120" height="120">

  <a href="https://claudiacode.com"><h1>Claudia</h1></a>
  
  <p>
    <strong>一個功能強大的 Claude Code 圖形用戶界面應用程式和工具包</strong>
  </p>
  <p>
    <strong>創建自定義代理，管理交互式 Claude Code 會話，運行安全的後台代理，等等。</strong>
  </p>
  
  <p>
    <a href="#功能"><img src="https://img.shields.io/badge/功能-✨-blue?style=for-the-badge" alt="功能"></a>
    <a href="#安裝"><img src="https://img.shields.io/badge/安裝-🚀-green?style=for-the-badge" alt="安裝"></a>
    <a href="#使用"><img src="https://img.shields.io/badge/使用-📖-purple?style=for-the-badge" alt="使用"></a>
    <a href="#開發"><img src="https://img.shields.io/badge/開發-🛠️-orange?style=for-the-badge" alt="開發"></a>
  </p>
</div>

![Claudia Demo](https://github.com/user-attachments/assets/a028de9e-d881-44d8-bae5-7326ab3558b9)

[Claudia Demo Video](https://github.com/user-attachments/assets/bf0bdf9d-ba91-45af-9ac4-7274f57075cf)

> **提示**: ⭐ 給倉庫點星並在 X 上關注 [@getAsterisk](https://x.com/getAsterisk)，以獲得 `asteria-swe-v0` 的早期訪問權限。

## 🌟 概述

**Claudia** 是一個功能強大的桌面應用程式，改變了您與 Claude Code 交互的方式。使用 Tauri 2 構建，它為管理您的 Claude Code 會話、創建自定義代理、跟踪使用情況等提供了一個美觀的圖形用戶界面。

將 Claudia 視為您的 Claude Code 指揮中心——彌合命令行工具與視覺體驗之間的差距，使 AI 輔助開發更加直觀和高效。

## 📋 目錄

- [🌟 概述](#-概述)
- [✨ 功能](#-功能)
  - [🗂️ 項目與會話管理](#️-項目與會話管理)
  - [🤖 CC 代理](#-cc-代理)
  - [📊 使用分析儀表板](#-使用分析儀表板)
  - [🔌 MCP 服務器管理](#-mcp-服務器管理)
  - [⏰ 時間線與檢查點](#-時間線與檢查點)
  - [📝 CLAUDE.md 管理](#-claudemd-管理)
- [📖 使用](#-使用)
  - [開始使用](#開始使用)
  - [管理項目](#管理項目)
  - [創建代理](#創建代理)
  - [跟踪使用情況](#跟踪使用情況)
  - [使用 MCP 服務器](#使用-mcp-服務器)
- [🚀 安裝](#-安裝)
- [🔨 從源代碼構建](#-從源代碼構建)
- [🛠️ 開發](#️-開發)
- [🔒 安全性](#-安全性)
- [🤝 貢獻](#-貢獻)
- [📄 許可證](#-許可證)
- [🙏 致謝](#-致謝)

## ✨ 功能

### 🗂️ **項目與會話管理**
- **視覺項目� wait for response 覽器**：在 `~/.claude/projects/` 中瀏覽所有 Claude Code 項目
- **會話歷史**：查看並恢復過去的編碼會話，包含完整上下文
- **智能搜索**：使用內置搜索快速查找項目和會話
- **會話洞察**：一目了然查看首條消息、時間戳和會話元數據

### 🤖 **CC 代理**
- **自定義 AI 代理**：創建具有自定義系統提示和行為的專用代理
- **代理庫**：構建針對不同任務的專用代理集合
- **後台執行**：在獨立進程中運行代理，實現非阻塞操作
- **執行歷史**：跟踪所有代理運行，包含詳細日誌和性能指標

### 📊 **使用分析儀表板**
- **成本跟踪**：實時監控您的 Claude API 使用情況和成本
- **令牌分析**：按模型、項目和時間段進行詳細分解
- **視覺圖表**：展示使用趨勢和模式的精美圖表
- **數據導出**：導出使用數據以進行會計和分析

### 🔌 **MCP 服務器管理**
- **服務器註冊表**：從中央用戶界面管理模型上下文協議服務器
- **簡易配置**：通過用戶界面添加服務器或從現有配置導入
- **連接測試**：在使用前驗證服務器連接
- **Claude 桌面導入**：從 Claude 桌面導入服務器配置

### ⏰ **時間線與檢查點**
- **會話版本控制**：在編碼會話的任何點創建檢查點
- **視覺時間線**：通過分支時間線瀏覽會話歷史
- **即時恢復**：一鍵跳回到任何檢查點
- **分叉會話**：從現有檢查點創建新分支
- **差異查看器**：精確查看檢查點之間的變化

### 📝 **CLAUDE.md 管理**
- **內置編輯器**：直接在應用程式內編輯 CLAUDE.md 文件
- **實時預覽**：實時查看您的 markdown 渲染
- **項目掃描器**：查找項目中的所有 CLA dispute UDE.md 文件
- **語法高亮**：支持完整的 markdown 語法高亮

## 📖 使用

### 開始使用

1. **啟動 Claudia**：安裝後打開應用程式
2. **歡迎界面**：選擇 CC 代理或 CC 項目
3. **首次設置**：Claudia 將自動檢測您的 `~/.claude` 目錄

### 管理項目

```bash
CC 項目 → 選擇項目 → 查看會話 → 恢復或開始新會話
```

- 點擊任何項目以查看其會話
- 每個會話顯示首條消息和時間戳
- 直接恢復會話或開始新會話

### 創建代理

```bash
CC 代理 → 創建代理 → 配置 → 執行
```

1. **設計您的代理**：設置名稱、圖標和系統提示
2. **配置模型**：選擇可用的 Claude 模型
3. **設置權限**：配置文件讀寫和網絡訪問
4. **執行任務**：在任何項目上運行您的代理

### 跟踪使用情況

```bash
菜單 → 使用分析儀表板 → 查看分析
```

- 按模型、項目和日期監控成本
- 導出數據以生成報告
- 設置使用警報（即將推出）

### 使用 MCP 服務器

```bash
菜單 → MCP 管理器 → 添加服務器 → 配置
```

- 手動添加服務器或通過 JSON 導入
- 從 Claude 桌面配置導入
- 在使用前測試連接

## 🚀 安裝

### 先決條件

- **Claude Code CLI**：從 [Claude 官方網站](https://claude.ai/code) 安裝

### 可執行文件即將發布

## 🔨 從源代碼構建

### 先決條件

在從源代碼構建 Claudia 之前，請確保已安裝以下內容：

#### 系統要求

- **操作系統**：Windows 10/11、macOS 11+ 或 Linux（Ubuntu 20.04+）
- **內存**：最低 4GB（建議 8GB）
- **存儲**：至少 1GB 可用空間

#### 所需工具

1. **Rust**（1.70.0 或更高版本）
   ```bash
   # 通過 rustup 安裝
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. **Bun**（最新版本）
   ```bash
   # 安裝 bun
   curl -fsSL https://bun.sh/install | bash
   ```

3. **Git**
   ```bash
   # 通常預裝，但如果沒有：
   # Ubuntu/Debian: sudo apt install git
   # macOS: brew install git
   # Windows: 從 https://git-scm.com 下載
   ```

4. **Claude Code CLI**
   - 從 [Claude 官方網站](https://claude.ai/code) 下載並安裝
   - 確保 `claude` 在您的 PATH 中可用

#### 平台特定依賴

**Linux（Ubuntu/Debian）**
```bash
# 安裝系統依賴
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
# 安裝 Xcode 命令行工具
xcode-select --install

# 通過 Homebrew 安裝額外依賴（可選）
brew install pkg-config
```

**Windows**
- 安裝 [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- 安裝 [WebView2](https://developer.microsoft.com/microsoft-edge/webview2/)（Windows 11 通常預裝）

### 構建步驟

1. **克隆倉庫**
   ```bash
   git clone https://github.com/getAsterisk/claudia.git
   cd claudia
   ```

2. **安裝前端依賴**
   ```bash
   bun install
   ```

3. **構建應用程式**
   
   **用於開發（支持熱重載）**
   ```bash
   bun run tauri dev
   ```
   
   **用於生產構建**
   ```bash
   # 構建應用程式
   bun run tauri build
   
   # 構建的可執行文件將位於：
   # - Linux: src-tauri/target/release/bundle/
   # - macOS: src-tauri/target/release/bundle/
   # - Windows: src-tauri/target/release/bundle/
   ```

4. **平台特定構建選項**
   
   **調試構建（編譯更快，文件較大）**
   ```bash
   bun run tauri build --debug
   ```
   
   **不打包構建（僅生成可執行文件）**
   ```bash
   bun run tauri build --no-bundle
   ```
   
   **macOS 通用二進制文件（支持 Intel 和 Apple Silicon）**
   ```bash
   bun run tauri build --target universal-apple-darwin
   ```

### 故障排除

#### 常見問題

1. **"cargo not found" 錯誤**
   - 確保已安裝 Rust 並且 `~/.cargo/bin` 在您的 PATH 中
   - 運行 `source ~/.cargo/env` 或重啟您的終端

2. **Linux: "webkit2gtk not found" 錯誤**
   - 安裝上述列出的 webkit2gtk 開發包
   - 在較新的 Ubuntu 版本上，您可能需要 `libwebkit2gtk-4.0-dev`

3. **Windows: "MSVC not found" 錯誤**
   - 安裝支持 C++ 的 Visual Studio Build Tools
   - 安裝後重啟終端

4. **"claude command not found" 錯誤**
   - 確保已安裝 Claude Code CLI 並在您的 PATH 中
   - 使用 `claude --version` 測試

5. **構建失敗，顯示 "out of memory"**
   - 嘗試使用較少的並行作業構建：`cargo build -j 2`
   - 關閉其他應用程式以釋放內存

#### 驗證您的構建

構建完成後，您可以驗證應用程式是否正常運行：

```bash
# 直接運行構建的可執行文件
# Linux/macOS
./src-tauri/target/release/claudia

# Windows
./src-tauri/target/release/claudia.exe
```

### 構建產物

構建過程會生成以下產物：

- **可執行文件**：主要的 Claudia 應用程式
- **安裝程序**（使用 `tauri build` 時）：
  - `.deb` 包（Linux）
  - `.AppImage`（Linux）
  - `.dmg` 安裝程序（macOS）
  - `.msi` 安裝程序（Windows）
  - `.exe` 安裝程序（Windows）

所有產物都位於 `src-tauri/target/release/bundle/`。

## 🛠️ 開發

### 技術棧

- **前端**：React 18 + TypeScript + Vite 6
- **後端**：Rust with Tauri 2
- **UI 框架**：Tailwind CSS v4 + shadcn/ui
- **數據庫**：SQLite（通過 rusqlite）
- **包管理器**：Bun

### 項目結構

```plaintext
claudia/
├── src/                   # React 前端
│   ├── components/        # UI 組件
│   ├── lib/               # API 客戶端和工具
│   └── assets/            # 靜態資源
├── src-tauri/             # Rust 後端
│   ├── src/
│   │   ├── commands/      # Tauri 命令處理程序
│   │   ├── checkpoint/    # 時間線管理
│   │   └── process/       # 進程管理
│   └── tests/             # Rust 測試套件
└── public/                # 公共資源
```

### 開發命令

```bash
# 啟動開發服務器
bun run tauri dev

# 僅運行前端
bun run dev

# 類型檢查
bunx tsc --noEmit

# 運行 Rust 測試
cd src-tauri && cargo test

# 格式化代碼
cd src-tauri && cargo fmt
```

## 🔒 安全性

Claudia 優先考慮您的隱私和安全：

1. **進程隔離**：代理在獨立進程中運行
2. **權限控制**：為每個代理配置文件和網絡訪問
3. **本地存儲**：所有數據都保留在您的機器上
4. **無遙測**：不收集或跟踪數據
5. **開源**：通過開源代碼實現完全透明

## 🤝 貢獻

我們歡迎貢獻！請查看我們的 [貢獻指南](CONTRIBUTING.md) 以了解詳情。

### 貢獻領域

- 🐛 錯誤修復和改進
- ✨ 新功能和增強
- 📚 文檔改進
- 🎨 UI/UX 增強
- 🧪 測試覆蓋
- 🌐 國際化

## 📄 許可證

本項目採用 AGPL 許可證 - 詳情請見 [LICENSE](LICENSE) 文件。

## 🙏 致謝

- 使用 [Tauri](https://tauri.app/) 構建 - 用於構建桌面應用程式的安全框架
- [Claude](https://claude.ai) by Anthropic

---

<div align="center">
  <p>
    <strong>由 <a href="https://asterisk.so/">Asterisk</a> 用 ❤️ 製作</strong>
  </p>
  <p>
    <a href="https://github.com/getAsterisk/claudia/issues">報告錯誤</a>
    ·
    <a href="https://github.com/getAsterisk/claudia/issues">請求功能</a>
  </p>
</div>

## Star 歷史

[![Star 歷史圖表](https://api.star-history.com/svg?repos=getAsterisk/claudia&type=Date)](https://www.star-history.com/#getAsterisk/claudia&Date)
```

這個 Markdown 文件是根據您提供的翻譯內容整理的，包含了完整的 Claudia 項目介紹、功能描述、安裝指南、開發說明等內容，結構清晰並保留了原有的格式和風格。如果需要進一步調整或添加內容，請告訴我！