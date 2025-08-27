# Claudia 平台工作流程圖整合指南

## 📋 概述

本指南說明如何在 Claudia 專案中整合和使用視覺化工作流程圖，基於專案的 React+TypeScript 前端與 Rust+Tauri 後端架構。

## 🎯 功能特色

### ✨ 視覺化特點
- **完整工作流程展示**: 涵蓋專案管理、代理系統、快照管理等核心功能
- **互動式圖表**: 支援縮放、平移和節點懸停效果
- **響應式設計**: 適配不同螢幕尺寸，支援行動裝置
- **深色模式支援**: 自動適應系統主題偏好

### 🎨 設計元素
- **色彩編碼系統**: 不同功能模組使用不同顏色區分
- **視覺化圖例**: 清楚說明各節點類型和功能
- **專業樣式**: 符合現代 UI/UX 設計標準

## 📁 檔案結構

```
workflow-visualization/
├── workflow-diagram.html      # 完整的 HTML 展示頁面
├── workflow-diagram.css       # 專用 CSS 樣式檔案
├── workflow-integration-guide.md  # 本整合指南
└── mermaid-config.js         # Mermaid 配置檔案 (可選)
```

## 🚀 快速開始

### 1. 基本整合

在您的 HTML 頁面中加入以下內容：

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <link rel="stylesheet" href="workflow-diagram.css">
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js"></script>
</head>
<body>
    <div class="workflow-container">
        <div class="mermaid-container">
            <div class="mermaid">
                <!-- Mermaid 圖表代碼 -->
            </div>
        </div>
    </div>
</body>
</html>
```

### 2. React 組件整合

在 React 專案中使用：

```tsx
import React, { useEffect } from 'react';
import mermaid from 'mermaid';
import './workflow-diagram.css';

const WorkflowDiagram: React.FC = () => {
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      }
    });
  }, []);

  return (
    <div className="workflow-container">
      <h1 className="workflow-title">Claudia 平台工作流程圖</h1>
      <div className="mermaid-container">
        <div className="mermaid">
          {/* Mermaid 圖表代碼 */}
        </div>
      </div>
    </div>
  );
};

export default WorkflowDiagram;
```

## 🎨 樣式自定義

### 主題配置

修改 CSS 變數來自定義主題：

```css
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --accent-color: #e74c3c;
  --background-gradient: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  --text-color: #2c3e50;
  --border-radius: 12px;
  --shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}
```

### 響應式斷點

```css
/* 平板裝置 */
@media (max-width: 768px) {
  .workflow-container {
    padding: 15px;
  }
}

/* 手機裝置 */
@media (max-width: 480px) {
  .workflow-title {
    font-size: 1.5rem;
  }
}
```

## 🔧 進階配置

### Mermaid 自定義配置

```javascript
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'basis',
    padding: 20
  },
  themeVariables: {
    fontFamily: 'Segoe UI, sans-serif',
    fontSize: '14px',
    primaryColor: '#f3e5f5',
    primaryTextColor: '#000',
    primaryBorderColor: '#4a148c',
    lineColor: '#34495e'
  }
});
```

### 互動功能增強

```javascript
// 節點點擊事件
document.addEventListener('DOMContentLoaded', function() {
  const nodes = document.querySelectorAll('.mermaid .node');
  nodes.forEach(node => {
    node.addEventListener('click', function() {
      const nodeId = this.id;
      console.log('點擊節點:', nodeId);
      // 自定義點擊處理邏輯
    });
  });
});
```

## 📱 在 Tauri 應用中整合

### 1. 前端整合

在 React 組件中：

```tsx
import { invoke } from '@tauri-apps/api/tauri';

const WorkflowViewer: React.FC = () => {
  const handleNodeClick = async (nodeId: string) => {
    try {
      await invoke('handle_workflow_node_click', { nodeId });
    } catch (error) {
      console.error('處理節點點擊失敗:', error);
    }
  };

  return (
    <div className="workflow-container">
      {/* 工作流程圖內容 */}
    </div>
  );
};
```

### 2. 後端處理

在 Rust 後端中：

```rust
#[tauri::command]
async fn handle_workflow_node_click(node_id: String) -> Result<(), String> {
    match node_id.as_str() {
        "project_mode" => {
            // 處理專案模式邏輯
            Ok(())
        },
        "agent_mode" => {
            // 處理代理模式邏輯
            Ok(())
        },
        _ => Err("未知的節點類型".to_string())
    }
}
```

## 🎯 最佳實踐

### 1. 效能優化
- 使用 `useMaxWidth: true` 確保圖表響應式
- 延遲載入大型圖表
- 使用 CSS `will-change` 屬性優化動畫

### 2. 可訪問性
- 為圖表添加 `alt` 屬性
- 確保鍵盤導航支援
- 提供高對比度模式

### 3. 維護性
- 將圖表定義分離到獨立檔案
- 使用 TypeScript 定義圖表結構
- 建立圖表版本控制系統

## 🔍 故障排除

### 常見問題

1. **圖表不顯示**
   - 檢查 Mermaid CDN 是否載入成功
   - 確認圖表語法正確性
   - 檢查 CSS 樣式是否正確載入

2. **響應式問題**
   - 確認 viewport meta 標籤設定
   - 檢查 CSS 媒體查詢斷點
   - 測試不同裝置和瀏覽器

3. **樣式衝突**
   - 使用 CSS 特異性規則
   - 檢查全域樣式覆蓋
   - 使用 CSS 模組或 styled-components

## 📚 相關資源

- [Mermaid 官方文件](https://mermaid.js.org/)
- [Tauri 官方指南](https://tauri.app/)
- [React TypeScript 最佳實踐](https://react-typescript-cheatsheet.netlify.app/)

## 🤝 貢獻指南

歡迎提交改進建議和 Pull Request：

1. Fork 專案
2. 建立功能分支
3. 提交變更
4. 建立 Pull Request

## 📄 授權條款

本視覺化組件遵循 Claudia 專案的 AGPL 授權條款。
