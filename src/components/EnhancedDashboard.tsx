import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FolderKanban,
  BotMessageSquare,
  BarChart3,
  Settings,
  Clock,
  Zap,
  FileText,
  Terminal,
  ArrowRight,
  Plus,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api, type Project, type Session, type Agent } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

type View = "welcome" | "projects" | "agents" | "editor" | "settings" | "claude-file-editor" | "claude-code-session" | "usage-dashboard" | "mcp";

interface EnhancedDashboardProps {
  onNavigate: (view: View) => void;
}

export const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({ onNavigate }) => {
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [usageStats, setUsageStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch recent projects (limit to 5)
        const projects = await api.listProjects();
        setRecentProjects(projects.slice(0, 5));
        
        // Fetch recent sessions (limit to 5)
        const sessions = await api.listRecentSessions(5);
        setRecentSessions(sessions);
        
        // Fetch agents
        const agentsList = await api.listAgents();
        setAgents(agentsList);
        
        // Fetch usage stats
        const stats = await api.getUsageStats();
        setUsageStats(stats);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return "Unknown date";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">載入儀表板...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>重試</Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-4 space-y-8"
    >
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">歡迎使用 Claudia</h1>
          <p className="text-muted-foreground mt-1">
            您的 Claude Code 管理中心
          </p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button onClick={() => onNavigate("projects")}>
            <FolderKanban className="mr-2 h-4 w-4" />
            瀏覽專案
          </Button>
          <Button variant="outline" onClick={() => onNavigate("agents")}>
            <BotMessageSquare className="mr-2 h-4 w-4" />
            管理代理
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">專案總數</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentProjects.length}</div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="p-0 h-auto" onClick={() => onNavigate("projects")}>
              <span className="text-xs text-muted-foreground">查看全部</span>
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">自定義代理</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.length}</div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="p-0 h-auto" onClick={() => onNavigate("agents")}>
              <span className="text-xs text-muted-foreground">管理代理</span>
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">API 使用量</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usageStats ? `$${usageStats.total_cost.toFixed(2)}` : "$0.00"}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="p-0 h-auto" onClick={() => onNavigate("usage-dashboard")}>
              <span className="text-xs text-muted-foreground">查看詳情</span>
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">最近專案</h2>
          <Button variant="outline" size="sm" onClick={() => onNavigate("projects")}>
            查看全部
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentProjects.length > 0 ? (
            recentProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium truncate">{project.name}</CardTitle>
                  <CardDescription className="truncate">{project.path}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>更新於 {formatDate(project.last_modified)}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => onNavigate("projects")}>
                    開啟專案
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card className="col-span-full p-6 flex flex-col items-center justify-center">
              <p className="text-muted-foreground mb-4">尚無專案</p>
              <Button onClick={() => onNavigate("projects")}>
                <Plus className="mr-2 h-4 w-4" />
                建立專案
              </Button>
            </Card>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">快速操作</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center" onClick={() => onNavigate("projects")}>
            <FolderKanban className="h-6 w-6 mb-2" />
            <span>瀏覽專案</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center" onClick={() => onNavigate("agents")}>
            <BotMessageSquare className="h-6 w-6 mb-2" />
            <span>管理代理</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center" onClick={() => onNavigate("usage-dashboard")}>
            <BarChart3 className="h-6 w-6 mb-2" />
            <span>使用統計</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center" onClick={() => onNavigate("settings")}>
            <Settings className="h-6 w-6 mb-2" />
            <span>設定</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
