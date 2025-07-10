import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  GitCompare,
  Clock,
  Download,
  Share,
  Copy,
  Tag,
  FileText,
  Zap,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, type SessionSnapshot } from "@/lib/api";
import { cn } from "@/lib/utils";

interface SnapshotQuickActionsProps {
  sessionId: string;
  projectId: string;
  currentMessageIndex: number;
  onSnapshotCreated: () => void;
  className?: string;
}

interface QuickSnapshotTemplate {
  id: string;
  name: string;
  description: string;
  tags: string[];
  icon: React.ReactNode;
  color: string;
}

const QUICK_TEMPLATES: QuickSnapshotTemplate[] = [
  {
    id: "milestone",
    name: "里程碑快照",
    description: "重要功能完成或項目階段性成果",
    tags: ["milestone", "feature"],
    icon: <CheckCircle className="h-4 w-4" />,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  {
    id: "backup",
    name: "備份快照",
    description: "進行重大變更前的安全備份",
    tags: ["backup", "safety"],
    icon: <Copy className="h-4 w-4" />,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  {
    id: "experiment",
    name: "實驗快照",
    description: "嘗試新想法或測試功能前的記錄點",
    tags: ["experiment", "test"],
    icon: <Zap className="h-4 w-4" />,
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  },
  {
    id: "bugfix",
    name: "修復快照",
    description: "Bug 修復完成後的狀態記錄",
    tags: ["bugfix", "fix"],
    icon: <AlertCircle className="h-4 w-4" />,
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  },
];

export const SnapshotQuickActions: React.FC<SnapshotQuickActionsProps> = ({
  sessionId,
  projectId,
  currentMessageIndex,
  onSnapshotCreated,
  className,
}) => {
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<QuickSnapshotTemplate | null>(null);
  const [customDescription, setCustomDescription] = useState("");
  const [customTags, setCustomTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuickSnapshot = async (template: QuickSnapshotTemplate) => {
    try {
      setLoading(true);
      setError(null);
      
      await api.createSessionSnapshot(
        sessionId,
        projectId,
        template.description,
        template.tags
      );
      
      onSnapshotCreated();
    } catch (err) {
      console.error("Failed to create quick snapshot:", err);
      setError("Failed to create snapshot");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSnapshot = async () => {
    if (!selectedTemplate) return;

    try {
      setLoading(true);
      setError(null);
      
      const description = customDescription || selectedTemplate.description;
      const tags = customTags 
        ? customTags.split(',').map(tag => tag.trim()).filter(Boolean)
        : selectedTemplate.tags;
      
      await api.createSessionSnapshot(
        sessionId,
        projectId,
        description,
        tags
      );
      
      setCustomDescription("");
      setCustomTags("");
      setSelectedTemplate(null);
      setShowQuickCreate(false);
      onSnapshotCreated();
    } catch (err) {
      console.error("Failed to create custom snapshot:", err);
      setError("Failed to create snapshot");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Quick Action Buttons */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Camera className="h-5 w-5" />
            <span>快速快照</span>
          </CardTitle>
          <CardDescription>
            使用預設模板快速建立快照
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QUICK_TEMPLATES.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-auto p-4 flex flex-col items-start space-y-2"
                  onClick={() => handleQuickSnapshot(template)}
                  disabled={loading}
                >
                  <div className="flex items-center space-x-2 w-full">
                    <div className={cn("p-1 rounded", template.color)}>
                      {template.icon}
                    </div>
                    <span className="font-medium">{template.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-left">
                    {template.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {template.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setShowQuickCreate(true)}
            >
              <FileText className="h-4 w-4 mr-2" />
              自定義快照
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Session Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">當前會話狀態</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">會話 ID:</span>
              <span className="font-mono">{sessionId.slice(0, 8)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">訊息索引:</span>
              <span className="font-medium">{currentMessageIndex}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">專案 ID:</span>
              <span className="font-mono">{projectId.slice(0, 8)}...</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Custom Snapshot Dialog */}
      <Dialog open={showQuickCreate} onOpenChange={setShowQuickCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>建立自定義快照</DialogTitle>
            <DialogDescription>
              選擇模板並自定義描述和標籤
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">選擇模板</label>
              <Select 
                value={selectedTemplate?.id || ""} 
                onValueChange={(value) => {
                  const template = QUICK_TEMPLATES.find(t => t.id === value);
                  setSelectedTemplate(template || null);
                  if (template) {
                    setCustomDescription(template.description);
                    setCustomTags(template.tags.join(", "));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="選擇快照模板" />
                </SelectTrigger>
                <SelectContent>
                  {QUICK_TEMPLATES.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center space-x-2">
                        {template.icon}
                        <span>{template.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">描述</label>
              <Input
                placeholder="快照描述..."
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">標籤 (用逗號分隔)</label>
              <Input
                placeholder="feature, milestone, backup..."
                value={customTags}
                onChange={(e) => setCustomTags(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQuickCreate(false)}>
              取消
            </Button>
            <Button 
              onClick={handleCustomSnapshot} 
              disabled={loading || !selectedTemplate}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  建立中...
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4 mr-2" />
                  建立快照
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
