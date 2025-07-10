import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitBranch,
  Clock,
  Save,
  RotateCcw,
  Plus,
  Eye,
  Copy,
  Trash2,
  Tag,
  MessageSquare,
  Code,
  FileText,
  Zap,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { api, type Checkpoint } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface EnhancedTimelineProps {
  sessionId: string;
  projectId: string;
  projectPath: string;
  currentMessageIndex: number;
  onCheckpointSelect: (checkpoint: Checkpoint) => void;
  onCheckpointCreate: () => void;
}

interface TimelineNode {
  checkpoint: Checkpoint;
  children: TimelineNode[];
  level: number;
  isExpanded: boolean;
}

interface CheckpointDiff {
  added: string[];
  removed: string[];
  modified: string[];
}

export const EnhancedTimeline: React.FC<EnhancedTimelineProps> = ({
  sessionId,
  projectId,
  projectPath,
  currentMessageIndex,
  onCheckpointSelect,
  onCheckpointCreate,
}) => {
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<Checkpoint | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDiffDialog, setShowDiffDialog] = useState(false);
  const [checkpointDescription, setCheckpointDescription] = useState("");
  const [checkpointTags, setCheckpointTags] = useState("");
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"tree" | "linear">("tree");
  const [diffData, setDiffData] = useState<CheckpointDiff | null>(null);

  useEffect(() => {
    loadTimeline();
  }, [sessionId, projectId]);

  const loadTimeline = async () => {
    try {
      setLoading(true);
      setError(null);
      const timeline = await api.getTimeline(sessionId, projectId);
      setCheckpoints(timeline);
    } catch (err) {
      console.error("Failed to load timeline:", err);
      setError("Failed to load timeline");
    } finally {
      setLoading(false);
    }
  };

  // Build tree structure for checkpoints
  const timelineTree = useMemo(() => {
    const buildTree = (parentId: string | null, level: number = 0): TimelineNode[] => {
      return checkpoints
        .filter(cp => cp.parent_id === parentId)
        .map(checkpoint => ({
          checkpoint,
          children: buildTree(checkpoint.id, level + 1),
          level,
          isExpanded: expandedNodes.has(checkpoint.id),
        }));
    };
    return buildTree(null);
  }, [checkpoints, expandedNodes]);

  const handleCreateCheckpoint = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const tags = checkpointTags.split(',').map(tag => tag.trim()).filter(Boolean);
      
      await api.createCheckpoint(
        sessionId,
        projectId,
        projectPath,
        currentMessageIndex,
        checkpointDescription || undefined,
        tags.length > 0 ? tags : undefined
      );
      
      setCheckpointDescription("");
      setCheckpointTags("");
      setShowCreateDialog(false);
      await loadTimeline();
      onCheckpointCreate();
    } catch (err) {
      console.error("Failed to create checkpoint:", err);
      setError("Failed to create checkpoint");
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreCheckpoint = async (checkpoint: Checkpoint) => {
    if (!confirm(`還原到檢查點 "${checkpoint.description || checkpoint.id.slice(0, 8)}"？當前狀態將被保存為新檢查點。`)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Create auto-save checkpoint
      await api.createCheckpoint(
        sessionId,
        projectId,
        projectPath,
        currentMessageIndex,
        "Auto-save before restore"
      );
      
      // Restore checkpoint
      await api.restoreCheckpoint(checkpoint.id, sessionId, projectId, projectPath);
      
      await loadTimeline();
      onCheckpointSelect(checkpoint);
    } catch (err) {
      console.error("Failed to restore checkpoint:", err);
      setError("Failed to restore checkpoint");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCheckpoint = async (checkpoint: Checkpoint) => {
    if (!confirm(`刪除檢查點 "${checkpoint.description || checkpoint.id.slice(0, 8)}"？此操作無法撤銷。`)) {
      return;
    }

    try {
      await api.deleteCheckpoint(checkpoint.id);
      await loadTimeline();
    } catch (err) {
      console.error("Failed to delete checkpoint:", err);
      setError("Failed to delete checkpoint");
    }
  };

  const handleViewDiff = async (checkpoint: Checkpoint) => {
    try {
      setLoading(true);
      const diff = await api.getCheckpointDiff(checkpoint.id);
      setDiffData(diff);
      setSelectedCheckpoint(checkpoint);
      setShowDiffDialog(true);
    } catch (err) {
      console.error("Failed to get checkpoint diff:", err);
      setError("Failed to get checkpoint diff");
    } finally {
      setLoading(false);
    }
  };

  const toggleNodeExpansion = (checkpointId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(checkpointId)) {
      newExpanded.delete(checkpointId);
    } else {
      newExpanded.add(checkpointId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderTimelineNode = (node: TimelineNode, index: number) => {
    const { checkpoint, children, level } = node;
    const hasChildren = children.length > 0;
    const isExpanded = expandedNodes.has(checkpoint.id);
    
    return (
      <motion.div
        key={checkpoint.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className={cn("relative", level > 0 && "ml-8")}
      >
        {/* Connection Lines */}
        {level > 0 && (
          <div className="absolute -left-4 top-0 bottom-0 w-px bg-border" />
        )}
        {level > 0 && (
          <div className="absolute -left-4 top-6 w-4 h-px bg-border" />
        )}
        
        <Card className="mb-4 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                {hasChildren && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleNodeExpansion(checkpoint.id)}
                    className="p-1 h-6 w-6"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </Button>
                )}
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <GitBranch className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium">
                    {checkpoint.description || `Checkpoint ${checkpoint.id.slice(0, 8)}`}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3" />
                      <span>{formatDistanceToNow(new Date(checkpoint.timestamp), { addSuffix: true })}</span>
                      <Badge variant="secondary" className="text-xs">
                        {checkpoint.id.slice(0, 8)}
                      </Badge>
                    </div>
                  </CardDescription>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewDiff(checkpoint)}
                  title="查看差異"
                >
                  <Eye className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRestoreCheckpoint(checkpoint)}
                  title="還原檢查點"
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteCheckpoint(checkpoint)}
                  title="刪除檢查點"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            {/* Tags */}
            {checkpoint.tags && checkpoint.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {checkpoint.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    <Tag className="h-2 w-2 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardHeader>
          
          {checkpoint.message_count && (
            <CardContent className="pt-0">
              <div className="flex items-center text-xs text-muted-foreground">
                <MessageSquare className="h-3 w-3 mr-1" />
                <span>{checkpoint.message_count} 條訊息</span>
              </div>
            </CardContent>
          )}
        </Card>
        
        {/* Children */}
        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children.map((child, childIndex) => renderTimelineNode(child, childIndex))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  if (loading && checkpoints.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <span className="ml-2">載入時間軸...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">會話時間軸 | Session Timeline</h3>
          <p className="text-sm text-muted-foreground">
            管理會話檢查點和版本歷史
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "tree" ? "linear" : "tree")}
          >
            {viewMode === "tree" ? "線性視圖" : "樹狀視圖"}
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            建立檢查點
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-4">
        {viewMode === "tree" ? (
          <div>
            {timelineTree.map((node, index) => renderTimelineNode(node, index))}
          </div>
        ) : (
          <div className="space-y-4">
            {checkpoints.map((checkpoint, index) => (
              <motion.div
                key={checkpoint.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                          <GitBranch className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {checkpoint.description || `Checkpoint ${checkpoint.id.slice(0, 8)}`}
                          </h4>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDistanceToNow(new Date(checkpoint.timestamp), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDiff(checkpoint)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          查看
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRestoreCheckpoint(checkpoint)}
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          還原
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {checkpoints.length === 0 && (
          <div className="text-center py-12">
            <GitBranch className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">尚無檢查點</h3>
            <p className="text-muted-foreground mb-4">
              建立第一個檢查點來開始版本控制
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              建立檢查點
            </Button>
          </div>
        )}
      </div>

      {/* Create Checkpoint Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>建立新檢查點</DialogTitle>
            <DialogDescription>
              為當前會話狀態建立一個檢查點
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">描述</label>
              <Input
                placeholder="檢查點描述..."
                value={checkpointDescription}
                onChange={(e) => setCheckpointDescription(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">標籤 (用逗號分隔)</label>
              <Input
                placeholder="feature, bugfix, milestone..."
                value={checkpointTags}
                onChange={(e) => setCheckpointTags(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              取消
            </Button>
            <Button onClick={handleCreateCheckpoint} disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  建立中...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  建立檢查點
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diff Dialog */}
      <Dialog open={showDiffDialog} onOpenChange={setShowDiffDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>檢查點差異</DialogTitle>
            <DialogDescription>
              {selectedCheckpoint?.description || `Checkpoint ${selectedCheckpoint?.id.slice(0, 8)}`}
            </DialogDescription>
          </DialogHeader>
          
          {diffData && (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {diffData.added.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-green-600 mb-2">新增檔案</h4>
                  <div className="space-y-1">
                    {diffData.added.map((file, index) => (
                      <div key={index} className="text-sm font-mono bg-green-50 dark:bg-green-900/20 p-2 rounded">
                        + {file}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {diffData.modified.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-blue-600 mb-2">修改檔案</h4>
                  <div className="space-y-1">
                    {diffData.modified.map((file, index) => (
                      <div key={index} className="text-sm font-mono bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                        ~ {file}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {diffData.removed.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-red-600 mb-2">刪除檔案</h4>
                  <div className="space-y-1">
                    {diffData.removed.map((file, index) => (
                      <div key={index} className="text-sm font-mono bg-red-50 dark:bg-red-900/20 p-2 rounded">
                        - {file}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDiffDialog(false)}>
              關閉
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
