import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Home,
  FolderKanban,
  BotMessageSquare,
  BarChart3,
  Settings,
  FileText,
  Terminal,
  Zap,
  Sun,
  Moon,
  Palette,
  Command,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

type View = "welcome" | "projects" | "agents" | "editor" | "settings" | "claude-file-editor" | "claude-code-session" | "usage-dashboard" | "mcp" | "snapshots";

interface CommandItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  category: "navigation" | "actions" | "settings" | "tools";
  keywords: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: View) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { theme, setTheme } = useTheme();

  // Define all available commands
  const commands: CommandItem[] = [
    // Navigation commands
    {
      id: "nav-welcome",
      title: "前往歡迎頁 | Go to Welcome",
      description: "返回主頁面 | Return to main page",
      icon: <Home className="h-4 w-4" />,
      action: () => onNavigate("welcome"),
      category: "navigation",
      keywords: ["welcome", "home", "歡迎", "主頁"],
    },
    {
      id: "nav-projects",
      title: "前往專案 | Go to Projects",
      description: "管理 Claude Code 專案 | Manage Claude Code projects",
      icon: <FolderKanban className="h-4 w-4" />,
      action: () => onNavigate("projects"),
      category: "navigation",
      keywords: ["projects", "專案", "project", "code"],
    },
    {
      id: "nav-agents",
      title: "前往 CC Agents | Go to CC Agents",
      description: "管理自定義 AI 代理 | Manage custom AI agents",
      icon: <BotMessageSquare className="h-4 w-4" />,
      action: () => onNavigate("agents"),
      category: "navigation",
      keywords: ["agents", "代理", "ai", "bot", "cc"],
    },
    {
      id: "nav-usage",
      title: "前往使用統計 | Go to Usage Dashboard",
      description: "查看 API 使用情況和成本 | View API usage and costs",
      icon: <BarChart3 className="h-4 w-4" />,
      action: () => onNavigate("usage-dashboard"),
      category: "navigation",
      keywords: ["usage", "dashboard", "統計", "成本", "cost", "api"],
    },
    {
      id: "nav-settings",
      title: "前往設定 | Go to Settings",
      description: "應用程式設定 | Application settings",
      icon: <Settings className="h-4 w-4" />,
      action: () => onNavigate("settings"),
      category: "navigation",
      keywords: ["settings", "設定", "config", "preferences"],
    },
    {
      id: "nav-mcp",
      title: "前往 MCP 管理 | Go to MCP Manager",
      description: "管理 Model Context Protocol 服務器 | Manage MCP servers",
      icon: <Terminal className="h-4 w-4" />,
      action: () => onNavigate("mcp"),
      category: "navigation",
      keywords: ["mcp", "server", "protocol", "管理"],
    },
    {
      id: "nav-snapshots",
      title: "前往快照管理 | Go to Snapshot Manager",
      description: "管理會話快照和差異比對 | Manage session snapshots and diffs",
      icon: <FileText className="h-4 w-4" />,
      action: () => onNavigate("snapshots"),
      category: "navigation",
      keywords: ["snapshots", "快照", "diff", "比對", "版本"],
    },
    
    // Theme commands
    {
      id: "theme-toggle",
      title: "切換主題 | Toggle Theme",
      description: "在深色和淺色主題間切換 | Switch between dark and light theme",
      icon: theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />,
      action: () => setTheme(theme === "dark" ? "light" : "dark"),
      category: "settings",
      keywords: ["theme", "主題", "dark", "light", "深色", "淺色"],
    },
    {
      id: "theme-dark",
      title: "設為深色主題 | Set Dark Theme",
      description: "切換到深色主題 | Switch to dark theme",
      icon: <Moon className="h-4 w-4" />,
      action: () => setTheme("dark"),
      category: "settings",
      keywords: ["dark", "深色", "theme", "主題"],
    },
    {
      id: "theme-light",
      title: "設為淺色主題 | Set Light Theme",
      description: "切換到淺色主題 | Switch to light theme",
      icon: <Sun className="h-4 w-4" />,
      action: () => setTheme("light"),
      category: "settings",
      keywords: ["light", "淺色", "theme", "主題"],
    },
    {
      id: "theme-system",
      title: "跟隨系統主題 | Follow System Theme",
      description: "根據系統設定自動切換主題 | Auto switch based on system preference",
      icon: <Palette className="h-4 w-4" />,
      action: () => setTheme("system"),
      category: "settings",
      keywords: ["system", "系統", "auto", "自動", "theme", "主題"],
    },
    
    // Action commands
    {
      id: "action-refresh",
      title: "重新整理 | Refresh",
      description: "重新載入當前頁面 | Reload current page",
      icon: <Zap className="h-4 w-4" />,
      action: () => window.location.reload(),
      category: "actions",
      keywords: ["refresh", "reload", "重新整理", "重載"],
    },
  ];

  // Filter commands based on query
  const filteredCommands = commands.filter((command) => {
    if (!query) return true;
    const searchTerm = query.toLowerCase();
    return (
      command.title.toLowerCase().includes(searchTerm) ||
      command.description.toLowerCase().includes(searchTerm) ||
      command.keywords.some((keyword) => keyword.toLowerCase().includes(searchTerm))
    );
  });

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            onClose();
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    },
    [isOpen, filteredCommands, selectedIndex, onClose]
  );

  // Setup keyboard listeners
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Reset state when opening/closing
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Update selected index when filtered commands change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.15 }}
          className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-background border border-border rounded-lg shadow-2xl overflow-hidden">
            {/* Search Input */}
            <div className="flex items-center px-4 py-3 border-b border-border">
              <Search className="h-4 w-4 text-muted-foreground mr-3" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜尋命令... | Search commands..."
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                autoFocus
              />
              <div className="flex items-center space-x-1 text-xs text-muted-foreground ml-3">
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">↑↓</kbd>
                <span>導航</span>
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">↵</kbd>
                <span>選擇</span>
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Esc</kbd>
                <span>關閉</span>
              </div>
            </div>

            {/* Commands List */}
            <div className="max-h-96 overflow-y-auto">
              {filteredCommands.length === 0 ? (
                <div className="px-4 py-8 text-center text-muted-foreground">
                  <Command className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>找不到相關命令 | No commands found</p>
                </div>
              ) : (
                <div className="py-2">
                  {filteredCommands.map((command, index) => (
                    <button
                      key={command.id}
                      className={cn(
                        "w-full flex items-center px-4 py-3 text-left hover:bg-accent hover:text-accent-foreground transition-colors",
                        index === selectedIndex && "bg-accent text-accent-foreground"
                      )}
                      onClick={() => {
                        command.action();
                        onClose();
                      }}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted mr-3">
                        {command.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {command.title}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {command.description}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {command.category}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
