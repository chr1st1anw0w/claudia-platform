import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  GitCompare,
  FileText,
  Code,
  Plus,
  Minus,
  Edit,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  Maximize2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface DiffLine {
  type: "added" | "removed" | "unchanged" | "modified";
  content: string;
  lineNumber?: number;
  oldLineNumber?: number;
  newLineNumber?: number;
}

interface FileDiff {
  path: string;
  type: "added" | "removed" | "modified" | "renamed";
  oldPath?: string;
  lines: DiffLine[];
  additions: number;
  deletions: number;
  isBinary?: boolean;
  language?: string;
}

interface SnapshotDiff {
  snapshotA: string;
  snapshotB: string;
  files: FileDiff[];
  summary: {
    additions: number;
    deletions: number;
    changes: number;
    filesChanged: number;
  };
  metadata?: {
    timespan: number;
    author?: string;
  };
}

interface SnapshotDiffViewerProps {
  diff: SnapshotDiff;
  snapshotAName?: string;
  snapshotBName?: string;
  onClose: () => void;
}

export const SnapshotDiffViewer: React.FC<SnapshotDiffViewerProps> = ({
  diff,
  snapshotAName = "Snapshot A",
  snapshotBName = "Snapshot B",
  onClose,
}) => {
  const [showUnchanged, setShowUnchanged] = useState(false);
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"side-by-side" | "unified">("unified");
  const [showFullscreen, setShowFullscreen] = useState(false);

  // Filter and group files
  const { addedFiles, removedFiles, modifiedFiles, renamedFiles } = useMemo(() => {
    const added: FileDiff[] = [];
    const removed: FileDiff[] = [];
    const modified: FileDiff[] = [];
    const renamed: FileDiff[] = [];

    diff.files.forEach((file) => {
      switch (file.type) {
        case "added":
          added.push(file);
          break;
        case "removed":
          removed.push(file);
          break;
        case "modified":
          modified.push(file);
          break;
        case "renamed":
          renamed.push(file);
          break;
      }
    });

    return { addedFiles: added, removedFiles: removed, modifiedFiles: modified, renamedFiles: renamed };
  }, [diff.files]);

  const toggleFileExpansion = (filePath: string) => {
    const newExpanded = new Set(expandedFiles);
    if (newExpanded.has(filePath)) {
      newExpanded.delete(filePath);
    } else {
      newExpanded.add(filePath);
    }
    setExpandedFiles(newExpanded);
  };

  const getFileIcon = (filePath: string) => {
    const extension = filePath.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
      case 'ts':
      case 'jsx':
      case 'tsx':
      case 'py':
      case 'java':
      case 'cpp':
      case 'c':
      case 'rs':
        return <Code className="h-4 w-4" />;
      case 'md':
      case 'txt':
      case 'json':
      case 'yaml':
      case 'yml':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case "added":
        return "text-green-600 bg-green-50 dark:bg-green-900/20";
      case "removed":
        return "text-red-600 bg-red-50 dark:bg-red-900/20";
      case "modified":
        return "text-blue-600 bg-blue-50 dark:bg-blue-900/20";
      case "renamed":
        return "text-purple-600 bg-purple-50 dark:bg-purple-900/20";
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  const renderDiffLine = (line: DiffLine, index: number, showLineNumbers: boolean = true) => {
    const getLineClass = () => {
      switch (line.type) {
        case "added":
          return "bg-green-50 dark:bg-green-900/20 border-l-2 border-green-500";
        case "removed":
          return "bg-red-50 dark:bg-red-900/20 border-l-2 border-red-500";
        case "modified":
          return "bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500";
        default:
          return showUnchanged ? "bg-gray-50/50 dark:bg-gray-900/10" : "hidden";
      }
    };

    const getLinePrefix = () => {
      switch (line.type) {
        case "added":
          return "+";
        case "removed":
          return "-";
        case "modified":
          return "~";
        default:
          return " ";
      }
    };

    if (line.type === "unchanged" && !showUnchanged) {
      return null;
    }

    return (
      <div key={index} className={cn("font-mono text-sm p-2 hover:bg-muted/50", getLineClass())}>
        <div className="flex">
          {showLineNumbers && (
            <div className="flex-shrink-0 w-16 text-muted-foreground text-right mr-4 select-none">
              <span className="inline-block w-6">{line.oldLineNumber || ""}</span>
              <span className="mx-1">|</span>
              <span className="inline-block w-6">{line.newLineNumber || ""}</span>
            </div>
          )}
          <div className="flex-shrink-0 w-4 text-muted-foreground mr-2 select-none">
            {getLinePrefix()}
          </div>
          <div className="flex-1 overflow-x-auto">
            <code>{line.content}</code>
          </div>
        </div>
      </div>
    );
  };

  const renderFileSection = (title: string, files: FileDiff[], icon: React.ReactNode, colorClass: string) => {
    if (files.length === 0) return null;

    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          {icon}
          <h3 className="font-medium">{title}</h3>
          <Badge variant="secondary">{files.length}</Badge>
        </div>
        
        <div className="space-y-2">
          {files.map((file, index) => (
            <Card key={file.path} className="overflow-hidden">
              <CardHeader 
                className={cn("pb-2 cursor-pointer hover:bg-muted/50", colorClass)}
                onClick={() => toggleFileExpansion(file.path)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {expandedFiles.has(file.path) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    {getFileIcon(file.path)}
                    <div>
                      <CardTitle className="text-sm font-mono">{file.path}</CardTitle>
                      {file.oldPath && file.oldPath !== file.path && (
                        <CardDescription className="text-xs">
                          從 {file.oldPath} 重新命名
                        </CardDescription>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {file.additions > 0 && (
                      <Badge variant="outline" className="text-xs text-green-600">
                        +{file.additions}
                      </Badge>
                    )}
                    {file.deletions > 0 && (
                      <Badge variant="outline" className="text-xs text-red-600">
                        -{file.deletions}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(file.path);
                        setShowFullscreen(true);
                      }}
                    >
                      <Maximize2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {expandedFiles.has(file.path) && (
                <CardContent className="pt-0">
                  {file.isBinary ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-8 w-8 mx-auto mb-2" />
                      <p>二進制檔案無法顯示差異</p>
                    </div>
                  ) : (
                    <div className="border rounded-md overflow-hidden">
                      <div className="max-h-96 overflow-y-auto">
                        {file.lines.map((line, lineIndex) => 
                          renderDiffLine(line, lineIndex)
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const selectedFileDiff = selectedFile ? diff.files.find(f => f.path === selectedFile) : null;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center space-x-2">
              <GitCompare className="h-6 w-6" />
              <span>快照差異比較</span>
            </h2>
            <p className="text-muted-foreground">
              {snapshotAName} → {snapshotBName}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Switch
                checked={showUnchanged}
                onCheckedChange={setShowUnchanged}
                id="show-unchanged"
              />
              <label htmlFor="show-unchanged" className="text-sm">
                顯示未變更行
              </label>
            </div>
            <Button variant="outline" onClick={onClose}>
              關閉
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{diff.summary.additions}</div>
              <div className="text-sm text-muted-foreground">新增行數</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{diff.summary.deletions}</div>
              <div className="text-sm text-muted-foreground">刪除行數</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{diff.summary.changes}</div>
              <div className="text-sm text-muted-foreground">總變更數</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{diff.summary.filesChanged}</div>
              <div className="text-sm text-muted-foreground">變更檔案</div>
            </CardContent>
          </Card>
        </div>

        {/* File Changes */}
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">全部變更 ({diff.files.length})</TabsTrigger>
            {addedFiles.length > 0 && (
              <TabsTrigger value="added">新增 ({addedFiles.length})</TabsTrigger>
            )}
            {modifiedFiles.length > 0 && (
              <TabsTrigger value="modified">修改 ({modifiedFiles.length})</TabsTrigger>
            )}
            {removedFiles.length > 0 && (
              <TabsTrigger value="removed">刪除 ({removedFiles.length})</TabsTrigger>
            )}
            {renamedFiles.length > 0 && (
              <TabsTrigger value="renamed">重新命名 ({renamedFiles.length})</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            {renderFileSection("新增檔案", addedFiles, <Plus className="h-4 w-4 text-green-600" />, "text-green-600 bg-green-50 dark:bg-green-900/20")}
            {renderFileSection("修改檔案", modifiedFiles, <Edit className="h-4 w-4 text-blue-600" />, "text-blue-600 bg-blue-50 dark:bg-blue-900/20")}
            {renderFileSection("刪除檔案", removedFiles, <Minus className="h-4 w-4 text-red-600" />, "text-red-600 bg-red-50 dark:bg-red-900/20")}
            {renderFileSection("重新命名檔案", renamedFiles, <FileText className="h-4 w-4 text-purple-600" />, "text-purple-600 bg-purple-50 dark:bg-purple-900/20")}
          </TabsContent>
          
          <TabsContent value="added">
            {renderFileSection("新增檔案", addedFiles, <Plus className="h-4 w-4 text-green-600" />, "text-green-600 bg-green-50 dark:bg-green-900/20")}
          </TabsContent>
          
          <TabsContent value="modified">
            {renderFileSection("修改檔案", modifiedFiles, <Edit className="h-4 w-4 text-blue-600" />, "text-blue-600 bg-blue-50 dark:bg-blue-900/20")}
          </TabsContent>
          
          <TabsContent value="removed">
            {renderFileSection("刪除檔案", removedFiles, <Minus className="h-4 w-4 text-red-600" />, "text-red-600 bg-red-50 dark:bg-red-900/20")}
          </TabsContent>
          
          <TabsContent value="renamed">
            {renderFileSection("重新命名檔案", renamedFiles, <FileText className="h-4 w-4 text-purple-600" />, "text-purple-600 bg-purple-50 dark:bg-purple-900/20")}
          </TabsContent>
        </Tabs>
      </div>

      {/* Fullscreen File Viewer */}
      <Dialog open={showFullscreen} onOpenChange={setShowFullscreen}>
        <DialogContent className="max-w-7xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {selectedFileDiff && getFileIcon(selectedFileDiff.path)}
              <span className="font-mono">{selectedFile}</span>
              {selectedFileDiff && (
                <Badge className={getFileTypeColor(selectedFileDiff.type)}>
                  {selectedFileDiff.type}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedFileDiff && (
            <div className="overflow-y-auto max-h-[70vh]">
              <div className="border rounded-md">
                {selectedFileDiff.lines.map((line, index) => 
                  renderDiffLine(line, index, true)
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
