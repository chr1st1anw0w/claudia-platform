import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  ArrowLeft,
  GitCompare,
  Clock,
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Share,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SessionSnapshot } from "./SessionSnapshot";
import { SnapshotDiffViewer } from "./SnapshotDiffViewer";

interface SessionSnapshotManagerProps {
  sessionId: string;
  projectId: string;
  projectName: string;
  onBack: () => void;
}

export const SessionSnapshotManager: React.FC<SessionSnapshotManagerProps> = ({
  sessionId,
  projectId,
  projectName,
  onBack,
}) => {
  const [activeView, setActiveView] = useState<"snapshots" | "compare">("snapshots");

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center space-x-2">
              <Camera className="h-6 w-6" />
              <span>會話快照管理</span>
            </h1>
            <p className="text-muted-foreground">
              {projectName} - Session {sessionId.slice(0, 8)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            設定
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            匯出全部
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 pt-4">
        <Tabs value={activeView} onValueChange={(value: any) => setActiveView(value)}>
          <TabsList>
            <TabsTrigger value="snapshots" className="flex items-center space-x-2">
              <Camera className="h-4 w-4" />
              <span>快照管理</span>
            </TabsTrigger>
            <TabsTrigger value="compare" className="flex items-center space-x-2">
              <GitCompare className="h-4 w-4" />
              <span>差異比較</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {activeView === "snapshots" && (
          <SessionSnapshot
            sessionId={sessionId}
            projectId={projectId}
            onBack={() => setActiveView("snapshots")}
          />
        )}
        
        {activeView === "compare" && (
          <div className="space-y-6">
            <div className="text-center py-12">
              <GitCompare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">快照比較</h3>
              <p className="text-muted-foreground mb-4">
                選擇兩個快照進行差異比較
              </p>
              <Button onClick={() => setActiveView("snapshots")}>
                <Camera className="h-4 w-4 mr-2" />
                前往快照管理
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats Footer */}
      <div className="border-t p-4">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">0</div>
            <div className="text-sm text-muted-foreground">總快照數</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-muted-foreground">今日建立</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">0 KB</div>
            <div className="text-sm text-muted-foreground">總大小</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-muted-foreground">比較次數</div>
          </div>
        </div>
      </div>
    </div>
  );
};
