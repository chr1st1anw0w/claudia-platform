import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Server,
  Plus,
  Search,
  Filter,
  Settings,
  Play,
  Square,
  RefreshCw,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Globe,
  Shield,
  Monitor,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api, type MCPServer } from "@/lib/api";
import { cn } from "@/lib/utils";

interface EnhancedMCPManagerProps {
  onBack: () => void;
}

interface ServerStatus {
  id: string;
  status: "running" | "stopped" | "error" | "starting" | "stopping";
  uptime?: number;
  lastError?: string;
  connections?: number;
  memoryUsage?: number;
  cpuUsage?: number;
}

interface ServerTemplate {
  id: string;
  name: string;
  description: string;
  category: "development" | "productivity" | "integration" | "ai";
  config: Partial<MCPServer>;
  icon: React.ReactNode;
  difficulty: "beginner" | "intermediate" | "advanced";
}

const SERVER_TEMPLATES: ServerTemplate[] = [
  {
    id: "filesystem",
    name: "檔案系統 | Filesystem",
    description: "提供檔案系統存取功能，支援讀寫檔案和目錄操作",
    category: "development",
    config: {
      name: "filesystem",
      command: "npx",
      args: ["@modelcontextprotocol/server-filesystem"],
      env: {},
    },
    icon: <Server className="h-5 w-5" />,
    difficulty: "beginner",
  },
  {
    id: "github",
    name: "GitHub 整合 | GitHub Integration",
    description: "連接 GitHub API，支援倉庫管理、議題追蹤和 PR 操作",
    category: "integration",
    config: {
      name: "github",
      command: "npx",
      args: ["@modelcontextprotocol/server-github"],
      env: {
        GITHUB_PERSONAL_ACCESS_TOKEN: "",
      },
    },
    icon: <Globe className="h-5 w-5" />,
    difficulty: "intermediate",
  },
  {
    id: "database",
    name: "資料庫連接 | Database Connection",
    description: "連接各種資料庫，支援 SQL 查詢和資料操作",
    category: "development",
    config: {
      name: "database",
      command: "npx",
      args: ["@modelcontextprotocol/server-postgres"],
      env: {
        DATABASE_URL: "",
      },
    },
    icon: <Activity className="h-5 w-5" />,
    difficulty: "advanced",
  },
];

export const EnhancedMCPManager: React.FC<EnhancedMCPManagerProps> = ({ onBack }) => {
  const [servers, setServers] = useState<MCPServer[]>([]);
  const [serverStatuses, setServerStatuses] = useState<Map<string, ServerStatus>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ServerTemplate | null>(null);
  const [activeTab, setActiveTab] = useState("servers");

  useEffect(() => {
    loadServers();
    startStatusPolling();
  }, []);

  const loadServers = async () => {
    try {
      setLoading(true);
      setError(null);
      const mcpServers = await api.listMCPServers();
      setServers(mcpServers);
    } catch (err) {
      console.error("Failed to load MCP servers:", err);
      setError("Failed to load MCP servers");
    } finally {
      setLoading(false);
    }
  };

  const startStatusPolling = () => {
    const pollStatus = async () => {
      try {
        const statuses = await api.getMCPServerStatuses();
        const statusMap = new Map();
        statuses.forEach((status: ServerStatus) => {
          statusMap.set(status.id, status);
        });
        setServerStatuses(statusMap);
      } catch (err) {
        console.error("Failed to poll server statuses:", err);
      }
    };

    // Poll every 5 seconds
    const interval = setInterval(pollStatus, 5000);
    pollStatus(); // Initial poll

    return () => clearInterval(interval);
  };

  const handleServerAction = async (serverId: string, action: "start" | "stop" | "restart") => {
    try {
      await api.controlMCPServer(serverId, action);
      // Status will be updated by polling
    } catch (err) {
      console.error(`Failed to ${action} server:`, err);
      setError(`Failed to ${action} server`);
    }
  };

  const handleAddFromTemplate = (template: ServerTemplate) => {
    setSelectedTemplate(template);
    setShowAddDialog(true);
    setShowTemplates(false);
  };

  const filteredServers = servers.filter((server) => {
    const matchesSearch = searchQuery === "" || 
      server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.command.toLowerCase().includes(searchQuery.toLowerCase());
    
    const status = serverStatuses.get(server.name)?.status || "stopped";
    const matchesStatus = statusFilter === "all" || status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "stopped": return <Square className="h-4 w-4 text-gray-500" />;
      case "error": return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "starting": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "stopping": return <Clock className="h-4 w-4 text-orange-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "stopped": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      case "error": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "starting": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "stopping": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">載入 MCP 服務器...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">MCP 服務器管理 | MCP Server Manager</h2>
          <p className="text-muted-foreground">
            管理 Model Context Protocol 服務器
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          返回
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="servers">服務器列表</TabsTrigger>
          <TabsTrigger value="templates">服務器模板</TabsTrigger>
          <TabsTrigger value="monitoring">監控面板</TabsTrigger>
          <TabsTrigger value="settings">設定</TabsTrigger>
        </TabsList>

        <TabsContent value="servers" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜尋服務器..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部狀態</SelectItem>
                  <SelectItem value="running">運行中</SelectItem>
                  <SelectItem value="stopped">已停止</SelectItem>
                  <SelectItem value="error">錯誤</SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={() => setShowTemplates(true)}>
                <Plus className="h-4 w-4 mr-2" />
                添加服務器
              </Button>
            </div>
          </div>

          {/* Servers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServers.map((server, index) => {
              const status = serverStatuses.get(server.name);
              return (
                <motion.div
                  key={server.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Server className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{server.name}</CardTitle>
                            <CardDescription className="text-sm">
                              {server.command} {server.args?.join(" ")}
                            </CardDescription>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {status && getStatusIcon(status.status)}
                          <Badge className={cn("text-xs", getStatusColor(status?.status || "stopped"))}>
                            {status?.status || "stopped"}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      {/* Server Stats */}
                      {status && status.status === "running" && (
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">連接數:</span>
                            <span className="ml-1 font-medium">{status.connections || 0}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">運行時間:</span>
                            <span className="ml-1 font-medium">
                              {status.uptime ? `${Math.floor(status.uptime / 60)}m` : "N/A"}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {status?.status === "running" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleServerAction(server.name, "stop")}
                            className="flex-1"
                          >
                            <Square className="h-3 w-3 mr-2" />
                            停止
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleServerAction(server.name, "start")}
                            className="flex-1"
                          >
                            <Play className="h-3 w-3 mr-2" />
                            啟動
                          </Button>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleServerAction(server.name, "restart")}
                        >
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                        
                        <Button variant="outline" size="sm">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {filteredServers.length === 0 && (
            <div className="text-center py-12">
              <Server className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">找不到相關服務器</h3>
              <p className="text-muted-foreground mb-4">
                嘗試調整搜尋條件或添加新的服務器
              </p>
              <Button onClick={() => setShowTemplates(true)}>
                <Plus className="h-4 w-4 mr-2" />
                添加服務器
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVER_TEMPLATES.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {template.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {template.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {template.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <CardDescription className="mb-4">
                      {template.description}
                    </CardDescription>
                    
                    <Button 
                      className="w-full" 
                      onClick={() => handleAddFromTemplate(template)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      使用模板
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">總服務器數</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{servers.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">運行中</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {Array.from(serverStatuses.values()).filter(s => s.status === "running").length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">已停止</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-600">
                  {Array.from(serverStatuses.values()).filter(s => s.status === "stopped").length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">錯誤</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {Array.from(serverStatuses.values()).filter(s => s.status === "error").length}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>MCP 設定</CardTitle>
              <CardDescription>
                配置 Model Context Protocol 的全域設定
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">設定功能開發中...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Templates Dialog */}
      <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>選擇服務器模板</DialogTitle>
            <DialogDescription>
              從預建模板快速添加 MCP 服務器
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {SERVER_TEMPLATES.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {template.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{template.name}</h3>
                      <div className="flex gap-1 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {template.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {template.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {template.description}
                  </p>
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleAddFromTemplate(template)}
                  >
                    使用模板
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTemplates(false)}>
              關閉
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
