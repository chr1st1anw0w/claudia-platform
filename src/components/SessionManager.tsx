import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Tag,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Archive,
  Trash2,
  Star,
  Download,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { api, type Session, type Project } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface SessionManagerProps {
  project: Project;
  onSessionSelect: (session: Session) => void;
  onBack: () => void;
}

interface SessionFilter {
  search: string;
  dateRange: "all" | "today" | "week" | "month";
  status: "all" | "active" | "completed" | "archived";
  sortBy: "date" | "name" | "duration";
  sortOrder: "asc" | "desc";
}

export const SessionManager: React.FC<SessionManagerProps> = ({
  project,
  onSessionSelect,
  onBack,
}) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedSessions, setSelectedSessions] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<SessionFilter>({
    search: "",
    dateRange: "all",
    status: "all",
    sortBy: "date",
    sortOrder: "desc",
  });

  useEffect(() => {
    loadSessions();
  }, [project.id]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const projectSessions = await api.listSessions(project.id);
      setSessions(projectSessions);
    } catch (err) {
      console.error("Failed to load sessions:", err);
      setError("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort sessions
  const filteredSessions = useMemo(() => {
    let filtered = sessions.filter((session) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          session.id.toLowerCase().includes(searchLower) ||
          (session.first_message && session.first_message.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Date range filter
      if (filters.dateRange !== "all") {
        const sessionDate = new Date(session.created_at);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
        
        switch (filters.dateRange) {
          case "today":
            if (diffDays > 0) return false;
            break;
          case "week":
            if (diffDays > 7) return false;
            break;
          case "month":
            if (diffDays > 30) return false;
            break;
        }
      }

      return true;
    });

    // Sort sessions
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case "date":
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case "name":
          comparison = (a.first_message || a.id).localeCompare(b.first_message || b.id);
          break;
        case "duration":
          // Assuming we have duration data, fallback to date
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }
      
      return filters.sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [sessions, filters]);

  const handleSessionToggle = (sessionId: string) => {
    const newSelected = new Set(selectedSessions);
    if (newSelected.has(sessionId)) {
      newSelected.delete(sessionId);
    } else {
      newSelected.add(sessionId);
    }
    setSelectedSessions(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedSessions.size === filteredSessions.length) {
      setSelectedSessions(new Set());
    } else {
      setSelectedSessions(new Set(filteredSessions.map(s => s.id)));
    }
  };

  const handleBulkAction = async (action: "archive" | "delete" | "export") => {
    if (selectedSessions.size === 0) return;

    try {
      switch (action) {
        case "archive":
          // Implement archive functionality
          console.log("Archiving sessions:", Array.from(selectedSessions));
          break;
        case "delete":
          if (confirm(`Delete ${selectedSessions.size} sessions? This action cannot be undone.`)) {
            // Implement delete functionality
            console.log("Deleting sessions:", Array.from(selectedSessions));
          }
          break;
        case "export":
          // Implement export functionality
          console.log("Exporting sessions:", Array.from(selectedSessions));
          break;
      }
      setSelectedSessions(new Set());
      await loadSessions();
    } catch (err) {
      console.error(`Failed to ${action} sessions:`, err);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return "Unknown date";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">載入會話...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={loadSessions}>重試</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">會話管理 | Session Manager</h2>
          <p className="text-muted-foreground">
            管理 {project.name} 的所有會話
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          返回
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜尋會話..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                篩選
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">日期範圍</label>
                  <Select value={filters.dateRange} onValueChange={(value: any) => setFilters(prev => ({ ...prev, dateRange: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="today">今天</SelectItem>
                      <SelectItem value="week">本週</SelectItem>
                      <SelectItem value="month">本月</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">排序方式</label>
                  <div className="flex gap-2">
                    <Select value={filters.sortBy} onValueChange={(value: any) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">日期</SelectItem>
                        <SelectItem value="name">名稱</SelectItem>
                        <SelectItem value="duration">時長</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFilters(prev => ({ 
                        ...prev, 
                        sortOrder: prev.sortOrder === "asc" ? "desc" : "asc" 
                      }))}
                    >
                      {filters.sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedSessions.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 bg-primary/10 rounded-lg"
        >
          <span className="text-sm font-medium">
            已選擇 {selectedSessions.size} 個會話
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => handleBulkAction("archive")}>
              <Archive className="h-4 w-4 mr-2" />
              封存
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleBulkAction("export")}>
              <Download className="h-4 w-4 mr-2" />
              匯出
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleBulkAction("delete")}>
              <Trash2 className="h-4 w-4 mr-2" />
              刪除
            </Button>
          </div>
        </motion.div>
      )}

      {/* Sessions List/Grid */}
      <div className="space-y-4">
        {/* Select All */}
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={selectedSessions.size === filteredSessions.length && filteredSessions.length > 0}
            onCheckedChange={handleSelectAll}
          />
          <label className="text-sm font-medium">
            全選 ({filteredSessions.length} 個會話)
          </label>
        </div>

        {/* Sessions */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSessions.map((session) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <Checkbox
                        checked={selectedSessions.has(session.id)}
                        onCheckedChange={() => handleSessionToggle(session.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Toggle favorite
                        }}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-lg line-clamp-2" onClick={() => onSessionSelect(session)}>
                      {session.first_message || `Session ${session.id.slice(0, 8)}`}
                    </CardTitle>
                    <CardDescription>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(session.created_at)}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {session.id.slice(0, 8)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSessionSelect(session)}
                      >
                        開啟
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredSessions.map((session) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={selectedSessions.has(session.id)}
                          onCheckedChange={() => handleSessionToggle(session.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate" onClick={() => onSessionSelect(session)}>
                            {session.first_message || `Session ${session.id.slice(0, 8)}`}
                          </h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(session.created_at)}
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {session.id.slice(0, 8)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Toggle favorite
                          }}
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSessionSelect(session)}
                        >
                          開啟
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {filteredSessions.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">找不到相關會話</h3>
            <p className="text-muted-foreground">
              嘗試調整搜尋條件或篩選器
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
