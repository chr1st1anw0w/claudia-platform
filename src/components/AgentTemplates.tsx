import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Code,
  FileText,
  GitBranch,
  TestTube,
  Shield,
  Database,
  Globe,
  Zap,
  Search,
  Plus,
  Download,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: "development" | "testing" | "documentation" | "security" | "analysis";
  model: "opus" | "sonnet" | "haiku";
  systemPrompt: string;
  defaultTask: string;
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
}

interface AgentTemplatesProps {
  onSelectTemplate: (template: AgentTemplate) => void;
  onClose: () => void;
}

const AGENT_TEMPLATES: AgentTemplate[] = [
  {
    id: "code-reviewer",
    name: "程式碼審查專家 | Code Reviewer",
    description: "專業的程式碼審查，提供詳細的改進建議和最佳實踐指導",
    icon: <Code className="h-5 w-5" />,
    category: "development",
    model: "sonnet",
    systemPrompt: `你是一位經驗豐富的程式碼審查專家。你的任務是：

1. **程式碼品質分析**：
   - 檢查程式碼結構、可讀性和維護性
   - 識別潛在的 bug 和邏輯錯誤
   - 評估效能和記憶體使用

2. **最佳實踐檢查**：
   - 確保遵循語言特定的編碼規範
   - 檢查設計模式的正確使用
   - 評估錯誤處理和邊界條件

3. **安全性審查**：
   - 識別潛在的安全漏洞
   - 檢查輸入驗證和資料清理
   - 評估權限和存取控制

4. **改進建議**：
   - 提供具體的重構建議
   - 推薦更好的演算法或資料結構
   - 建議效能優化方案

請以建設性和教育性的方式提供回饋，包含程式碼範例和解釋。`,
    defaultTask: "請審查這個專案的程式碼，重點關注程式碼品質、安全性和效能。",
    tags: ["code-review", "quality", "security", "performance"],
    difficulty: "intermediate"
  },
  {
    id: "test-generator",
    name: "測試生成器 | Test Generator",
    description: "自動生成全面的單元測試和整合測試",
    icon: <TestTube className="h-5 w-5" />,
    category: "testing",
    model: "sonnet",
    systemPrompt: `你是一位測試專家，專門生成高品質的測試程式碼。你的職責包括：

1. **測試策略規劃**：
   - 分析程式碼結構，識別測試重點
   - 設計測試案例覆蓋所有功能路徑
   - 確保邊界條件和錯誤情況的測試

2. **測試程式碼生成**：
   - 編寫清晰、可維護的測試程式碼
   - 使用適當的測試框架和工具
   - 包含正面和負面測試案例

3. **測試資料準備**：
   - 創建適當的測試資料和模擬物件
   - 設計測試環境和前置條件
   - 確保測試的獨立性和可重複性

4. **測試文件**：
   - 為每個測試提供清晰的描述
   - 解釋測試目的和預期結果
   - 提供測試執行指南

請確保生成的測試程式碼遵循最佳實踐，具有良好的可讀性和維護性。`,
    defaultTask: "為這個專案生成全面的測試套件，包括單元測試和整合測試。",
    tags: ["testing", "unit-tests", "integration", "automation"],
    difficulty: "intermediate"
  },
  {
    id: "documentation-writer",
    name: "文件撰寫專家 | Documentation Writer",
    description: "生成專業的技術文件、API 文檔和使用指南",
    icon: <FileText className="h-5 w-5" />,
    category: "documentation",
    model: "sonnet",
    systemPrompt: `你是一位技術文件撰寫專家，擅長創建清晰、全面的技術文件。你的任務包括：

1. **API 文檔**：
   - 詳細描述 API 端點、參數和回應
   - 提供實用的程式碼範例
   - 包含錯誤處理和狀態碼說明

2. **使用指南**：
   - 編寫逐步的安裝和設定指南
   - 創建教學和最佳實踐文件
   - 提供故障排除和常見問題解答

3. **程式碼文檔**：
   - 為函數和類別添加詳細註解
   - 解釋複雜的演算法和邏輯
   - 提供使用範例和注意事項

4. **專案文檔**：
   - 撰寫 README 文件和專案概述
   - 創建架構圖和流程說明
   - 維護變更日誌和版本說明

請確保文件結構清晰、內容準確、易於理解和維護。`,
    defaultTask: "為這個專案生成完整的技術文件，包括 README、API 文檔和使用指南。",
    tags: ["documentation", "api-docs", "readme", "guides"],
    difficulty: "beginner"
  },
  {
    id: "security-auditor",
    name: "安全審計專家 | Security Auditor",
    description: "全面的安全漏洞掃描和安全最佳實踐檢查",
    icon: <Shield className="h-5 w-5" />,
    category: "security",
    model: "opus",
    systemPrompt: `你是一位網路安全專家，專門進行程式碼安全審計。你的職責包括：

1. **漏洞掃描**：
   - 識別常見的安全漏洞（OWASP Top 10）
   - 檢查 SQL 注入、XSS、CSRF 等攻擊向量
   - 分析身份驗證和授權機制

2. **程式碼安全分析**：
   - 檢查敏感資料處理
   - 評估加密和雜湊實作
   - 分析輸入驗證和資料清理

3. **依賴安全性**：
   - 掃描第三方套件的已知漏洞
   - 檢查過時的依賴項目
   - 評估供應鏈安全風險

4. **安全建議**：
   - 提供具體的修復方案
   - 推薦安全最佳實踐
   - 建議安全工具和流程

請提供詳細的安全報告，包含風險等級、影響範圍和修復優先順序。`,
    defaultTask: "對這個專案進行全面的安全審計，識別潛在漏洞並提供修復建議。",
    tags: ["security", "vulnerability", "audit", "owasp"],
    difficulty: "advanced"
  },
  {
    id: "performance-optimizer",
    name: "效能優化專家 | Performance Optimizer",
    description: "分析和優化應用程式效能，提供具體的改進方案",
    icon: <Zap className="h-5 w-5" />,
    category: "analysis",
    model: "sonnet",
    systemPrompt: `你是一位效能優化專家，專門分析和改善應用程式效能。你的任務包括：

1. **效能分析**：
   - 識別效能瓶頸和熱點
   - 分析記憶體使用和洩漏
   - 評估 CPU 使用率和執行時間

2. **程式碼優化**：
   - 優化演算法和資料結構
   - 改善資料庫查詢效能
   - 減少不必要的計算和 I/O 操作

3. **架構優化**：
   - 建議快取策略和實作
   - 優化網路請求和資料傳輸
   - 改善並行處理和非同步操作

4. **監控和測量**：
   - 設定效能監控指標
   - 建立效能測試和基準
   - 提供持續優化建議

請提供具體的優化方案，包含預期的效能改善和實作步驟。`,
    defaultTask: "分析這個專案的效能，識別瓶頸並提供優化建議。",
    tags: ["performance", "optimization", "profiling", "monitoring"],
    difficulty: "advanced"
  },
  {
    id: "database-designer",
    name: "資料庫設計師 | Database Designer",
    description: "設計高效的資料庫架構和優化查詢效能",
    icon: <Database className="h-5 w-5" />,
    category: "development",
    model: "sonnet",
    systemPrompt: `你是一位資料庫設計專家，擅長設計高效、可擴展的資料庫架構。你的職責包括：

1. **資料庫設計**：
   - 分析業務需求，設計適當的資料模型
   - 建立正規化的資料表結構
   - 設計索引策略和約束條件

2. **查詢優化**：
   - 分析和優化 SQL 查詢效能
   - 建議適當的索引和分割策略
   - 優化複雜的聯結和子查詢

3. **架構規劃**：
   - 設計資料庫分片和複製策略
   - 規劃備份和災難恢復方案
   - 評估不同資料庫技術的適用性

4. **效能監控**：
   - 設定資料庫效能監控
   - 分析慢查詢和資源使用
   - 提供容量規劃建議

請提供詳細的資料庫設計文件和實作指南。`,
    defaultTask: "分析這個專案的資料需求，設計最佳的資料庫架構。",
    tags: ["database", "sql", "optimization", "architecture"],
    difficulty: "intermediate"
  }
];

const CATEGORIES = [
  { id: "all", name: "全部", icon: <Bot className="h-4 w-4" /> },
  { id: "development", name: "開發", icon: <Code className="h-4 w-4" /> },
  { id: "testing", name: "測試", icon: <TestTube className="h-4 w-4" /> },
  { id: "documentation", name: "文檔", icon: <FileText className="h-4 w-4" /> },
  { id: "security", name: "安全", icon: <Shield className="h-4 w-4" /> },
  { id: "analysis", name: "分析", icon: <Search className="h-4 w-4" /> },
];

export const AgentTemplates: React.FC<AgentTemplatesProps> = ({
  onSelectTemplate,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter templates based on category and search
  const filteredTemplates = AGENT_TEMPLATES.filter((template) => {
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getModelColor = (model: string) => {
    switch (model) {
      case "opus": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "sonnet": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "haiku": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Agent 模板庫 | Agent Templates</h2>
          <p className="text-muted-foreground">
            選擇預建的 Agent 模板快速開始
          </p>
        </div>
        <Button variant="outline" onClick={onClose}>
          返回
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜尋模板..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2 overflow-x-auto">
          {CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              {category.icon}
              <span className="ml-2">{category.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {template.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold line-clamp-2">
                        {template.name}
                      </CardTitle>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-2">
                  <Badge className={cn("text-xs", getDifficultyColor(template.difficulty))}>
                    {template.difficulty}
                  </Badge>
                  <Badge className={cn("text-xs", getModelColor(template.model))}>
                    {template.model}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <CardDescription className="text-sm mb-4 line-clamp-3">
                  {template.description}
                </CardDescription>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {template.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {template.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{template.tags.length - 3}
                    </Badge>
                  )}
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={() => onSelectTemplate(template)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  使用模板
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">找不到相關模板</h3>
          <p className="text-muted-foreground">
            嘗試調整搜尋條件或選擇不同的分類
          </p>
        </div>
      )}
    </div>
  );
};
