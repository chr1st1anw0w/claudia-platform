# Claudia 專案開發提示詞指南

## 1. 專案概述
- **專案名稱**：Claudia
- **技術棧**：React 18 + TypeScript + Vite + Tauri + Tailwind CSS
- **目標平台**：桌面應用程式 (macOS/Windows/Linux)

## 2. 專案架構

### 2.1 目錄結構
```
Claudia/
├── src/                    # 前端源碼
│   ├── components/         # 共用組件
│   ├── pages/              # 頁面組件
│   ├── hooks/              # 自定義 Hooks
│   ├── utils/              # 工具函數
│   ├── styles/             # 全局樣式
│   ├── types/              # TypeScript 類型定義
│   └── App.tsx             # 主入口組件
├── src-tauri/              # Tauri 相關代碼
├── public/                 # 靜態資源
├── scripts/                # 構建和開發腳本
└── tests/                  # 測試代碼
```

## 3. 開發規範

### 3.1 代碼風格
- 使用 ESLint + Prettier 進行代碼格式化
- 組件使用 PascalCase 命名
- 函數和方法使用 camelCase 命名
- 常量使用 UPPER_CASE 命名

### 3.2 Git 提交規範
```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

## 4. 開發流程

### 4.1 環境設置
```bash
# 安裝依賴
bun install

# 啟動開發服務器
bun run dev

# 構建生產版本
bun run build
```

### 4.2 測試
```bash
# 運行單元測試
bun test

# 運行 E2E 測試
bun run test:e2e
```

## 5. 組件開發指南

### 5.1 創建新組件
1. 在 `src/components` 下創建組件文件夾
2. 創建組件文件：`ComponentName.tsx`
3. 創建樣式文件：`ComponentName.module.css`
4. 創建測試文件：`ComponentName.test.tsx`

### 5.2 組件示例
```tsx
import React from 'react';
import styles from './ComponentName.module.css';

interface ComponentNameProps {
  // 組件屬性定義
}

export const ComponentName: React.FC<ComponentNameProps> = ({
  // 解構屬性
}) => {
  return (
    <div className={styles.container}>
      {/* 組件內容 */}
    </div>
  );
};
```

## 6. 狀態管理
- 使用 React Context 進行全局狀態管理
- 複雜狀態邏輯使用 Redux Toolkit
- 非同步操作使用 RTK Query

## 7. 性能優化
- 使用 React.memo 優化組件渲染
- 使用 useCallback 和 useMemo 優化回調和計算
- 代碼分割和懶加載

## 8. 測試策略
- 單元測試：Jest + React Testing Library
- 組件測試：@testing-library/react
- E2E 測試：Cypress

## 9. 文檔
- 組件文檔使用 Storybook
- API 文檔使用 TypeDoc
- 更新日誌維護在 CHANGELOG.md

## 10. 部署
- 使用 GitHub Actions 進行 CI/CD
- 自動化測試和構建
- 自動發佈到 GitHub Releases
