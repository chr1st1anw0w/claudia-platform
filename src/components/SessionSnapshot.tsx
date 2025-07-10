import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  GitCompare,
  Clock,
  Download,
  Trash2,
  Tag,
  Search,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, type SessionSnapshot as SessionSnapshotType, type SnapshotDiff } from "@/lib/api";
import { SnapshotDiffViewer } from "./SnapshotDiffViewer";
import { SnapshotQuickActions } from "./SnapshotQuickActions";
import { formatDistanceToNow } from "date-fns";

interface SessionSnapshotProps {
  sessionId: string;
  projectId: string;
  currentMessageIndex?: number;
  onBack: () => void;
}



export const SessionSnapshot: React.FC<SessionSnapshotProps> = ({
  sessionId,
  projectId,
  currentMessageIndex = 0,
  onBack,
}) => {
  const [snapshots, setSnapshots] = useState<SessionSnapshotType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSnapshots, setSelectedSnapshots] = useState<[string, string] | null>(null);
  const [diffData, setDiffData] = useState<SnapshotDiff | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDiffDialog, setShowDiffDialog] = useState(false);
  const [snapshotDescription, setSnapshotDescription] = useState("");
  const [snapshotTags, setSnapshotTags] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [tagFilter, setTagFilter] = useState<string>("all");

  useEffect(() => {
    loadSnapshots();
  }, [sessionId, projectId]);

  const loadSnapshots = async () => {
    try {
      setLoading(true);
      setError(null);
      const sessionSnapshots = await api.getSessionSnapshots(sessionId, projectId);
      setSnapshots(sessionSnapshots);
    } catch (err) {
      console.error("Failed to load snapshots:", err);
      setError("Failed to load snapshots");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSnapshot = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const tags = snapshotTags.split(',').map(tag => tag.trim()).filter(Boolean);
      
      await api.createSessionSnapshot(
        sessionId,
        projectId,
        snapshotDescription || undefined,
        tags.length > 0 ? tags : undefined
      );
      
      setSnapshotDescription("");
      setSnapshotTags("");
      setShowCreateDialog(false);
      await loadSnapshots();
    } catch (err) {
      console.error("Failed to create snapshot:", err);
      setError("Failed to create snapshot");
    } finally {
      setLoading(false);
    }
  };

  const handleCompareSnapshots = async (snapshot1Id: string, snapshot2Id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const diff = await api.compareSnapshots(snapshot1Id, snapshot2Id);
      setDiffData(diff);
      setSelectedSnapshots([snapshot1Id, snapshot2Id]);
      setShowDiffDialog(true);
    } catch (err) {
      console.error("Failed to compare snapshots:", err);
      setError("Failed to compare snapshots");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSnapshot = async (snapshotId: string) => {
    if (!confirm("刪除此快照？此操作無法撤銷。")) {
      return;
    }

    try {
      await api.deleteSessionSnapshot(snapshotId);
      await loadSnapshots();
    } catch (err) {
      console.error("Failed to delete snapshot:", err);
      setError("Failed to delete snapshot");
    }
  };

  const handleExportSnapshot = async (snapshotId: string) => {
    try {
      const exportData = await api.exportSnapshot(snapshotId);
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `snapshot-${snapshotId.slice(0, 8)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export snapshot:", err);
      setError("Failed to export snapshot");
    }
  };

  // Filter snapshots
  const filteredSnapshots = useMemo(() => {
    return snapshots.filter((snapshot) => {
      const matchesSearch = searchQuery === "" || 
        snapshot.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snapshot.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTag = tagFilter === "all" || 
        (snapshot.tags && snapshot.tags.includes(tagFilter));
      
      return matchesSearch && matchesTag;
    });
  }, [snapshots, searchQuery, tagFilter]);

  // Get unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    snapshots.forEach(snapshot => {
      snapshot.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [snapshots]);



  if (loading && snapshots.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <span className="ml-2">載入快照...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">會話快照 | Session Snapshots</h2>
          <p className="text-muted-foreground">
            管理會話快照和比較不同時間點的變更
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button onClick={() => setShowCreateDialog(true)}>
            <Camera className="h-4 w-4 mr-2" />
            建立快照
          </Button>
          <Button variant="outline" onClick={onBack}>
            返回
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜尋快照..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Select value={tagFilter} onValueChange={setTagFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="標籤篩選" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部標籤</SelectItem>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quick Actions Sidebar */}
        <div className="lg:col-span-1">
          <SnapshotQuickActions
            sessionId={sessionId}
            projectId={projectId}
            currentMessageIndex={currentMessageIndex}
            onSnapshotCreated={loadSnapshots}
          />
        </div>

        {/* Snapshots Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredSnapshots.map((snapshot, index) => (
          <motion.div
            key={snapshot.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Camera className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {snapshot.description || `Snapshot ${snapshot.id.slice(0, 8)}`}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-3 w-3" />
                          <span>{formatDistanceToNow(new Date(snapshot.timestamp), { addSuffix: true })}</span>
                        </div>
                      </CardDescription>
                    </div>
                  </div>
                </div>
                
                {/* Tags */}
                {snapshot.tags && snapshot.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {snapshot.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="h-2 w-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="pt-0">
                {/* Snapshot Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">檔案數:</span>
                    <span className="ml-1 font-medium">{snapshot.fileCount || 0}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">大小:</span>
                    <span className="ml-1 font-medium">
                      {snapshot.size ? `${(snapshot.size / 1024).toFixed(1)}KB` : "N/A"}
                    </span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Select for comparison
                      if (selectedSnapshots && selectedSnapshots[0] !== snapshot.id) {
                        handleCompareSnapshots(selectedSnapshots[0], snapshot.id);
                      } else {
                        setSelectedSnapshots([snapshot.id, ""]);
                      }
                    }}
                    className="flex-1"
                  >
                    <GitCompare className="h-3 w-3 mr-2" />
                    比較
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportSnapshot(snapshot.id)}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteSnapshot(snapshot.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
          </div>
        </div>
      </div>

      {filteredSnapshots.length === 0 && (
        <div className="text-center py-12">
          <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {snapshots.length === 0 ? "尚無快照" : "找不到相關快照"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {snapshots.length === 0 
              ? "建立第一個快照來開始追蹤變更" 
              : "嘗試調整搜尋條件或篩選器"
            }
          </p>
          {snapshots.length === 0 && (
            <Button onClick={() => setShowCreateDialog(true)}>
              <Camera className="h-4 w-4 mr-2" />
              建立快照
            </Button>
          )}
        </div>
      )}

      {/* Create Snapshot Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>建立新快照</DialogTitle>
            <DialogDescription>
              為當前會話狀態建立一個快照
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">描述</label>
              <Input
                placeholder="快照描述..."
                value={snapshotDescription}
                onChange={(e) => setSnapshotDescription(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">標籤 (用逗號分隔)</label>
              <Input
                placeholder="feature, bugfix, milestone..."
                value={snapshotTags}
                onChange={(e) => setSnapshotTags(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              取消
            </Button>
            <Button onClick={handleCreateSnapshot} disabled={loading}>
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

      {/* Diff Dialog */}
      <Dialog open={showDiffDialog} onOpenChange={setShowDiffDialog}>
        <DialogContent className="max-w-7xl max-h-[90vh] p-0">
          {diffData && selectedSnapshots && (
            <SnapshotDiffViewer
              diff={diffData}
              snapshotAName={`Snapshot ${selectedSnapshots[0].slice(0, 8)}`}
              snapshotBName={`Snapshot ${selectedSnapshots[1].slice(0, 8)}`}
              onClose={() => setShowDiffDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
