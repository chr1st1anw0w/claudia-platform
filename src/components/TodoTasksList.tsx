import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Calendar,
  Tag,
  ChevronUp,
  Filter,
  Search,
  Archive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface TodoTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

interface TodoTasksListProps {
  projectId?: string;
  className?: string;
}

const defaultCategories = [
  'development',
  'design', 
  'testing',
  'documentation',
  'meeting',
  'review',
  'deployment',
  'research'
];

const priorityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  urgent: 'bg-red-100 text-red-800 border-red-200'
};

const priorityLabels = {
  low: '低',
  medium: '中',
  high: '高',
  urgent: '緊急'
};

/**
 * TodoTasksList - 專案待辦事項管理組件
 * 
 * 功能包括：
 * - 創建、編輯、刪除任務
 * - 優先級和分類管理  
 * - 搜尋和篩選
 * - 標籤系統
 * - 到期日期提醒
 * - 本地存儲持久化
 */
export function TodoTasksList({ projectId, className }: TodoTasksListProps) {
  const [tasks, setTasks] = useState<TodoTask[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // 新任務表單狀態
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as TodoTask['priority'],
    category: 'development',
    dueDate: '',
    tags: [] as string[]
  });

  // 載入任務（從 localStorage 或 API）
  useEffect(() => {
    loadTasks();
  }, [projectId]);

  const loadTasks = () => {
    try {
      const storageKey = projectId ? `claudia_tasks_${projectId}` : 'claudia_tasks_global';
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsedTasks = JSON.parse(stored).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined
        }));
        setTasks(parsedTasks);
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const saveTasks = (updatedTasks: TodoTask[]) => {
    try {
      const storageKey = projectId ? `claudia_tasks_${projectId}` : 'claudia_tasks_global';
      localStorage.setItem(storageKey, JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;

    const task: TodoTask = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      completed: false,
      priority: newTask.priority,
      category: newTask.category,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: newTask.tags
    };

    saveTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      category: 'development',
      dueDate: '',
      tags: []
    });
    setIsAddDialogOpen(false);
  };

  const toggleTask = (id: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id 
        ? { ...task, completed: !task.completed, updatedAt: new Date() }
        : task
    );
    saveTasks(updatedTasks);
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    saveTasks(updatedTasks);
  };

  // Unused for now but can be used for editing functionality
  // const updateTask = (updatedTask: TodoTask) => {
  //   const updatedTasks = tasks.map(task =>
  //     task.id === updatedTask.id 
  //       ? { ...updatedTask, updatedAt: new Date() }
  //       : task
  //   );
  //   saveTasks(updatedTasks);
  // };

  // 篩選任務
  const filteredTasks = tasks.filter(task => {
    // 搜尋篩選
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // 分類篩選  
    if (filterCategory !== 'all' && task.category !== filterCategory) {
      return false;
    }
    
    // Priority filtering can be added later
    // if (filterPriority !== 'all' && task.priority !== filterPriority) {
    //   return false;
    // }
    
    // 完成狀態篩選
    if (!showCompleted && task.completed) {
      return false;
    }
    
    return true;
  });

  // 按優先級和創建時間排序
  const sortedTasks = filteredTasks.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  const isOverdue = (task: TodoTask) => {
    return task.dueDate && task.dueDate < new Date() && !task.completed;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 標題和操作列 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold">
            {projectId ? `專案任務` : `所有任務`}
          </h3>
          <Badge variant="outline" className="text-xs">
            {filteredTasks.length} / {tasks.length}
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          {/* 搜尋 */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜尋任務..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-48"
            />
          </div>

          {/* 篩選器 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                篩選
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setShowCompleted(!showCompleted)}>
                {showCompleted ? '隱藏' : '顯示'}已完成任務
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterCategory('all')}>
                所有分類
              </DropdownMenuItem>
              {defaultCategories.map(cat => (
                <DropdownMenuItem key={cat} onClick={() => setFilterCategory(cat)}>
                  {cat}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 新增任務 */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                新增任務
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新增任務</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="任務標題"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
                <Textarea
                  placeholder="任務描述（選填）"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Select value={newTask.priority} onValueChange={(value: any) => setNewTask({...newTask, priority: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="優先級" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">低優先級</SelectItem>
                      <SelectItem value="medium">中優先級</SelectItem>
                      <SelectItem value="high">高優先級</SelectItem>
                      <SelectItem value="urgent">緊急</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={newTask.category} onValueChange={(value) => setNewTask({...newTask, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="分類" />
                    </SelectTrigger>
                    <SelectContent>
                      {defaultCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={addTask}>新增</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 任務列表 */}
      <div className="space-y-2">
        <AnimatePresence>
          {sortedTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              layout
            >
              <Card className={`p-4 ${task.completed ? 'opacity-60' : ''} ${isOverdue(task) ? 'border-red-300' : ''}`}>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="mt-1"
                  />
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </h4>
                      
                      <div className="flex items-center space-x-2">
                        {/* 優先級徽章 */}
                        <Badge className={priorityColors[task.priority]}>
                          <ChevronUp className="h-3 w-3 mr-1" />
                          {priorityLabels[task.priority]}
                        </Badge>
                        
                        {/* 分類徽章 */}
                        <Badge variant="outline">
                          <Tag className="h-3 w-3 mr-1" />
                          {task.category}
                        </Badge>
                        
                        {/* 到期日 */}
                        {task.dueDate && (
                          <Badge variant={isOverdue(task) ? 'destructive' : 'outline'}>
                            <Calendar className="h-3 w-3 mr-1" />
                            {task.dueDate.toLocaleDateString('zh-TW')}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {task.description && (
                      <p className={`text-sm text-muted-foreground ${task.completed ? 'line-through' : ''}`}>
                        {task.description}
                      </p>
                    )}
                    
                    {/* 操作按鈕 */}
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 空狀態 */}
      {sortedTasks.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Archive className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>{searchTerm || filterCategory !== 'all' ? '沒有符合條件的任務' : '還沒有任務，立即新增一個吧！'}</p>
        </div>
      )}
    </div>
  );
}