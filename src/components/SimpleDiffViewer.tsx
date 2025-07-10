import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  GitCompare,
  FileText,
  Plus,
  Minus,
  Edit,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  type: "added" | "removed" | "modified";
  lines: DiffLine[];
  additions: number;
  deletions: number;
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
}

interface SimpleDiffViewerProps {
  diff: SnapshotDiff;
  snapshotAName?: string;
  snapshotBName?: string;
  onClose: () => void;
}

export const SimpleDiffViewer: React.FC<SimpleDiffViewerProps> = ({
  diff,
  snapshotAName = "Snapshot A",
  snapshotBName = "Snapshot B",
  onClose,
}) => {
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());

  const toggleFileExpansion = (filePath: string) => {
    const newExpanded = new Set(expandedFiles);
    if (newExpanded.has(filePath)) {
      newExpanded.delete(filePath);
    } else {
      newExpanded.add(filePath);
    }
    setExpandedFiles(newExpanded);
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case "added":
        return "text-green-600 bg-green-50 dark:bg-green-900/20";
      case "removed":
        return "text-red-600 bg-red-50 dark:bg-red-900/20";
      case "modified":
        return "text-blue-600 bg-blue-50 dark:bg-blue-900/20";
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  const renderDiffLine = (line: DiffLine, index: number) => {
    const getLineClass = () => {
      switch (line.type) {
        case "added":
          return "bg-green-50 dark:bg-green-900/20 border-l-2 border-green-500";
        case "removed":
          return "bg-red-50 dark:bg-red-900/20 border-l-2 border-red-500";
        case "modified":
          return "bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500";
        default:
          return "bg-gray-50/50 dark:bg-gray-900/10";
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

    return (
      <div key={index} className={cn("font-mono text-sm p-2 hover:bg-muted/50", getLineClass())}>
        <div className="flex">
          <div className="flex-shrink-0 w-16 text-muted-foreground text-right mr-4 select-none">
            <span className="inline-block w-6">{line.oldLineNumber || ""}</span>
            <span className="mx-1">|</span>
            <span className="inline-block w-6">{line.newLineNumber || ""}</span>
          </div>
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

  return (
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
        
        <Button variant="outline" onClick={onClose}>
          關閉
        </Button>
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
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">檔案變更</h3>
        
        {diff.files.map((file, index) => (
          <Card key={file.path} className="overflow-hidden">
            <CardHeader 
              className={cn("pb-2 cursor-pointer hover:bg-muted/50", getFileTypeColor(file.type))}
              onClick={() => toggleFileExpansion(file.path)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {expandedFiles.has(file.path) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <FileText className="h-4 w-4" />
                  <div>
                    <CardTitle className="text-sm font-mono">{file.path}</CardTitle>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {file.type}
                  </Badge>
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
                </div>
              </div>
            </CardHeader>
            
            {expandedFiles.has(file.path) && (
              <CardContent className="pt-0">
                <div className="border rounded-md overflow-hidden">
                  <div className="max-h-96 overflow-y-auto">
                    {file.lines.map((line, lineIndex) => 
                      renderDiffLine(line, lineIndex)
                    )}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}

        {diff.files.length === 0 && (
          <div className="text-center py-12">
            <GitCompare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">無變更</h3>
            <p className="text-muted-foreground">
              兩個快照之間沒有檔案變更
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
