#!/bin/bash

# 🚀 Claudia v2.0.0 自動化部署腳本
# 作者: Christian Wu
# 版本: 2.0.0
# 日期: 2025-08-27

set -e  # 遇到錯誤時停止執行

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# 日誌函數
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${PURPLE}[STEP]${NC} $1"
}

# 檢查必要工具
check_dependencies() {
    log_step "檢查系統依賴..."
    
    if ! command -v bun &> /dev/null; then
        log_error "Bun 未安裝。請先安裝 Bun: curl -fsSL https://bun.sh/install | bash"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        log_error "Git 未安裝。請先安裝 Git。"
        exit 1
    fi
    
    log_success "所有必要依賴已就緒"
}

# 檢查 Git 狀態
check_git_status() {
    log_step "檢查 Git 狀態..."
    
    if [[ -n $(git status --porcelain) ]]; then
        log_warning "發現未提交的變更："
        git status --short
        
        read -p "是否要繼續部署？(y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "部署已取消"
            exit 0
        fi
    fi
    
    log_success "Git 狀態檢查完成"
}

# 安裝依賴
install_dependencies() {
    log_step "安裝項目依賴..."
    
    if [[ -f "bun.lock" ]]; then
        bun install --frozen-lockfile
    else
        bun install
    fi
    
    log_success "依賴安裝完成"
}

# 類型檢查
type_check() {
    log_step "執行 TypeScript 類型檢查..."
    
    if bun run type-check; then
        log_success "類型檢查通過"
    else
        log_error "類型檢查失敗，請修復錯誤後重試"
        exit 1
    fi
}

# 建置專案
build_project() {
    log_step "建置生產版本..."
    
    # 清理舊的建置檔案
    if [[ -d "dist" ]]; then
        rm -rf dist
        log_info "已清理舊的建置檔案"
    fi
    
    # 執行建置
    if bun run build; then
        log_success "專案建置完成"
    else
        log_error "專案建置失敗"
        exit 1
    fi
    
    # 顯示建置檔案大小
    if [[ -d "dist" ]]; then
        log_info "建置檔案大小："
        du -sh dist/*
    fi
}

# 預覽建置結果
preview_build() {
    log_step "啟動預覽伺服器..."
    log_info "預覽伺服器將在 http://localhost:4173 運行"
    log_info "按 Ctrl+C 停止預覽伺服器"
    
    bun run preview
}

# 部署到 Netlify (可選)
deploy_netlify() {
    if command -v netlify &> /dev/null; then
        log_step "部署到 Netlify..."
        
        read -p "是否要部署到 Netlify？(y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            netlify deploy --prod --dir=dist
            log_success "已成功部署到 Netlify"
        fi
    else
        log_info "Netlify CLI 未安裝，跳過 Netlify 部署"
        log_info "如需部署到 Netlify，請安裝：npm i -g netlify-cli"
    fi
}

# 部署到 GitHub Pages (可選)
deploy_github_pages() {
    if [[ -f ".github/workflows/deploy.yml" ]]; then
        log_step "準備 GitHub Pages 部署..."
        
        read -p "是否要推送到 GitHub 觸發自動部署？(y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git add .
            git commit -m "🚀 Deploy v$(cat package.json | grep version | cut -d '"' -f 4)" || true
            git push origin main
            log_success "已推送到 GitHub，GitHub Actions 將自動部署"
        fi
    else
        log_info "未找到 GitHub Actions 配置，跳過 GitHub Pages 部署"
    fi
}

# 生成部署報告
generate_report() {
    log_step "生成部署報告..."
    
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    VERSION=$(cat package.json | grep version | cut -d '"' -f 4)
    
    cat > deployment-report.md << EOF
# 📊 部署報告

**部署時間**: ${TIMESTAMP}
**版本**: v${VERSION}
**部署方式**: 手動部署腳本

## 📦 建置檔案

\`\`\`
$(ls -la dist/ 2>/dev/null || echo "建置目錄不存在")
\`\`\`

## 📈 檔案大小統計

\`\`\`
$(du -sh dist/* 2>/dev/null || echo "無建置檔案")
\`\`\`

## ✅ 部署狀態

- [x] 依賴安裝
- [x] 類型檢查
- [x] 專案建置
- [ ] 部署到生產環境

## 🔗 相關連結

- 專案首頁: https://claudiacode.com
- GitHub 倉庫: https://github.com/chr1st1anw0w/claudia-platform
- 文檔: ./README.md

---
*自動生成於 ${TIMESTAMP}*
EOF
    
    log_success "部署報告已生成：deployment-report.md"
}

# 清理函數
cleanup() {
    log_info "執行清理操作..."
    # 這裡可以添加清理邏輯
}

# 主函數
main() {
    echo -e "${GREEN}"
    echo "🚀 Claudia v2.0.0 部署腳本"
    echo "=================================="
    echo -e "${NC}"
    
    # 設置錯誤時的清理
    trap cleanup EXIT
    
    # 執行部署步驟
    check_dependencies
    check_git_status
    install_dependencies
    type_check
    build_project
    
    log_success "✨ 建置完成！"
    
    # 選擇後續操作
    echo
    echo "請選擇接下來的操作："
    echo "1) 預覽建置結果 (推薦)"
    echo "2) 部署到 Netlify"
    echo "3) 推送到 GitHub Pages"
    echo "4) 生成部署報告"
    echo "5) 結束"
    echo
    
    read -p "請輸入選項 (1-5): " -n 1 -r choice
    echo
    
    case $choice in
        1)
            preview_build
            ;;
        2)
            deploy_netlify
            ;;
        3)
            deploy_github_pages
            ;;
        4)
            generate_report
            ;;
        5)
            log_info "部署流程結束"
            ;;
        *)
            log_warning "無效選項，部署流程結束"
            ;;
    esac
    
    echo
    log_success "🎉 部署流程完成！"
    log_info "建置檔案位於 ./dist/ 目錄"
    log_info "您可以將 dist/ 目錄內容部署到任何靜態檔案伺服器"
}

# 處理命令行參數
case "${1:-}" in
    --help|-h)
        echo "Claudia v2.0.0 部署腳本"
        echo "用法: $0 [選項]"
        echo "選項:"
        echo "  --help, -h     顯示此幫助資訊"
        echo "  --build-only   僅執行建置，不進行部署"
        echo "  --preview      建置後直接預覽"
        echo "  --auto         自動模式（跳過所有確認提示）"
        exit 0
        ;;
    --build-only)
        check_dependencies
        install_dependencies
        type_check
        build_project
        log_success "僅建置模式完成"
        exit 0
        ;;
    --preview)
        main
        preview_build
        exit 0
        ;;
    --auto)
        export AUTO_MODE=true
        main
        exit 0
        ;;
    "")
        main
        ;;
    *)
        log_error "未知參數: $1"
        log_info "使用 --help 查看可用選項"
        exit 1
        ;;
esac