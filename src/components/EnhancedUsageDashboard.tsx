import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  MessageSquare,
  Zap,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  AlertTriangle,
  Target,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { api } from "@/lib/api";
import { formatDistanceToNow, format, subDays, startOfDay, endOfDay } from "date-fns";
import { cn } from "@/lib/utils";

interface EnhancedUsageDashboardProps {
  onBack: () => void;
}

interface UsageData {
  totalCost: number;
  totalTokens: number;
  totalMessages: number;
  totalSessions: number;
  dailyUsage: DailyUsage[];
  modelUsage: ModelUsage[];
  projectUsage: ProjectUsage[];
  costTrend: number;
  tokenTrend: number;
  budget?: {
    monthly: number;
    current: number;
    remaining: number;
  };
}

interface DailyUsage {
  date: string;
  cost: number;
  tokens: number;
  messages: number;
  sessions: number;
}

interface ModelUsage {
  model: string;
  cost: number;
  tokens: number;
  messages: number;
  percentage: number;
}

interface ProjectUsage {
  projectId: string;
  projectName: string;
  cost: number;
  tokens: number;
  messages: number;
  sessions: number;
  lastUsed: string;
}

export const EnhancedUsageDashboard: React.FC<EnhancedUsageDashboardProps> = ({ onBack }) => {
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadUsageData();
  }, [timeRange]);

  const loadUsageData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const endDate = new Date();
      const startDate = (() => {
        switch (timeRange) {
          case "7d": return subDays(endDate, 7);
          case "30d": return subDays(endDate, 30);
          case "90d": return subDays(endDate, 90);
          case "1y": return subDays(endDate, 365);
          default: return subDays(endDate, 30);
        }
      })();

      const data = await api.getUsageAnalytics(startDate, endDate);
      setUsageData(data);
    } catch (err) {
      console.error("Failed to load usage data:", err);
      setError("Failed to load usage data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('zh-TW').format(num);
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <div className="h-4 w-4" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return "text-green-600";
    if (trend < 0) return "text-red-600";
    return "text-gray-600";
  };

  const budgetPercentage = useMemo(() => {
    if (!usageData?.budget) return 0;
    return (usageData.budget.current / usageData.budget.monthly) * 100;
  }, [usageData]);

  const getBudgetStatus = () => {
    if (budgetPercentage >= 90) return { color: "text-red-600", bg: "bg-red-100", status: "危險" };
    if (budgetPercentage >= 75) return { color: "text-yellow-600", bg: "bg-yellow-100", status: "警告" };
    return { color: "text-green-600", bg: "bg-green-100", status: "正常" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">載入使用統計...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={loadUsageData}>重試</Button>
      </div>
    );
  }

  if (!usageData) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">暫無使用數據</h3>
        <p className="text-muted-foreground">開始使用 Claude Code 後將顯示統計資料</p>
      </div>
    );
  }

  const budgetStatus = getBudgetStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">使用分析儀表板 | Usage Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            追蹤 API 使用情況、成本和效能指標
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">過去 7 天</SelectItem>
              <SelectItem value="30d">過去 30 天</SelectItem>
              <SelectItem value="90d">過去 90 天</SelectItem>
              <SelectItem value="1y">過去 1 年</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={loadUsageData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            重新整理
          </Button>
          
          <Button variant="outline" onClick={onBack}>
            返回
          </Button>
        </div>
      </div>

      {/* Budget Alert */}
      {usageData.budget && budgetPercentage >= 75 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn("rounded-lg border p-4", budgetStatus.bg)}
        >
          <div className="flex items-center space-x-2">
            <AlertTriangle className={cn("h-5 w-5", budgetStatus.color)} />
            <div>
              <h3 className={cn("font-medium", budgetStatus.color)}>
                預算警告 - {budgetStatus.status}
              </h3>
              <p className="text-sm text-muted-foreground">
                本月已使用 {budgetPercentage.toFixed(1)}% 的預算 
                ({formatCurrency(usageData.budget.current)} / {formatCurrency(usageData.budget.monthly)})
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">總覽</TabsTrigger>
          <TabsTrigger value="models">模型使用</TabsTrigger>
          <TabsTrigger value="projects">專案分析</TabsTrigger>
          <TabsTrigger value="trends">趨勢分析</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">總成本</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(usageData.totalCost)}</div>
                <div className={cn("flex items-center text-xs", getTrendColor(usageData.costTrend))}>
                  {getTrendIcon(usageData.costTrend)}
                  <span className="ml-1">
                    {usageData.costTrend > 0 ? "+" : ""}{usageData.costTrend.toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">總 Token 數</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(usageData.totalTokens)}</div>
                <div className={cn("flex items-center text-xs", getTrendColor(usageData.tokenTrend))}>
                  {getTrendIcon(usageData.tokenTrend)}
                  <span className="ml-1">
                    {usageData.tokenTrend > 0 ? "+" : ""}{usageData.tokenTrend.toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">總訊息數</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(usageData.totalMessages)}</div>
                <p className="text-xs text-muted-foreground">
                  平均每訊息 {formatCurrency(usageData.totalCost / usageData.totalMessages)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">總會話數</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(usageData.totalSessions)}</div>
                <p className="text-xs text-muted-foreground">
                  平均每會話 {formatNumber(Math.round(usageData.totalMessages / usageData.totalSessions))} 訊息
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Budget Progress */}
          {usageData.budget && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>月度預算追蹤</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      已使用: {formatCurrency(usageData.budget.current)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      預算: {formatCurrency(usageData.budget.monthly)}
                    </span>
                  </div>
                  <Progress value={budgetPercentage} className="h-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span className={budgetStatus.color}>
                      {budgetPercentage.toFixed(1)}% 已使用
                    </span>
                    <span className="text-muted-foreground">
                      剩餘: {formatCurrency(usageData.budget.remaining)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Model Usage Chart */}
            <Card>
              <CardHeader>
                <CardTitle>模型使用分佈</CardTitle>
                <CardDescription>各模型的使用情況和成本分析</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {usageData.modelUsage.map((model, index) => (
                    <div key={model.model} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{model.model}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatCurrency(model.cost)}
                        </span>
                      </div>
                      <Progress value={model.percentage} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatNumber(model.tokens)} tokens</span>
                        <span>{formatNumber(model.messages)} 訊息</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Model Efficiency */}
            <Card>
              <CardHeader>
                <CardTitle>模型效率分析</CardTitle>
                <CardDescription>每個模型的成本效益比較</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {usageData.modelUsage.map((model) => {
                    const costPerMessage = model.cost / model.messages;
                    const tokensPerMessage = model.tokens / model.messages;
                    
                    return (
                      <div key={model.model} className="p-3 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{model.model}</span>
                          <Badge variant="secondary">
                            {model.percentage.toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">每訊息成本:</span>
                            <div className="font-medium">{formatCurrency(costPerMessage)}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">每訊息 Token:</span>
                            <div className="font-medium">{Math.round(tokensPerMessage)}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>專案使用分析</CardTitle>
              <CardDescription>各專案的 API 使用情況和成本</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usageData.projectUsage.map((project, index) => (
                  <motion.div
                    key={project.projectId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{project.projectName}</h3>
                        <p className="text-sm text-muted-foreground">
                          最後使用: {formatDistanceToNow(new Date(project.lastUsed), { addSuffix: true })}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(project.cost)}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatNumber(project.tokens)} tokens
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">訊息數:</span>
                        <div className="font-medium">{formatNumber(project.messages)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">會話數:</span>
                        <div className="font-medium">{formatNumber(project.sessions)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">平均成本:</span>
                        <div className="font-medium">
                          {formatCurrency(project.cost / project.messages)}/訊息
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>使用趨勢</CardTitle>
              <CardDescription>過去 {timeRange} 的使用情況變化</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Daily Usage Chart Placeholder */}
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">圖表功能開發中</p>
                    <p className="text-sm text-muted-foreground">
                      將顯示每日使用量、成本和 Token 消耗趨勢
                    </p>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-green-600">
                      {usageData.dailyUsage.length > 0 ? 
                        formatCurrency(usageData.dailyUsage.reduce((sum, day) => sum + day.cost, 0) / usageData.dailyUsage.length) : 
                        "$0.00"
                      }
                    </div>
                    <p className="text-sm text-muted-foreground">平均每日成本</p>
                  </div>
                  
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-blue-600">
                      {usageData.dailyUsage.length > 0 ? 
                        formatNumber(Math.round(usageData.dailyUsage.reduce((sum, day) => sum + day.tokens, 0) / usageData.dailyUsage.length)) : 
                        "0"
                      }
                    </div>
                    <p className="text-sm text-muted-foreground">平均每日 Token</p>
                  </div>
                  
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-purple-600">
                      {usageData.dailyUsage.length > 0 ? 
                        formatNumber(Math.round(usageData.dailyUsage.reduce((sum, day) => sum + day.messages, 0) / usageData.dailyUsage.length)) : 
                        "0"
                      }
                    </div>
                    <p className="text-sm text-muted-foreground">平均每日訊息</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
