import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronRight, Clock, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { TodoTask } from '@/types';
import { cn } from '@/lib/utils';

export function TodoWindow() {
  const [tasks, setTasks] = useState<TodoTask[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    // API CALL: Fetch the initial TODO list from /api/tasks on page load
    const fetchTasks = async () => {
      try {
        // Mock data for now
        const mockTasks: TodoTask[] = [
          {
            id: '1',
            title: 'Read document.pdf',
            description: 'Extract key insights from uploaded document',
            status: 'completed',
            createdAt: new Date(Date.now() - 300000),
            completedAt: new Date(Date.now() - 60000),
            priority: 'high'
          },
          {
            id: '2',
            title: 'Analyze image.jpg',
            description: 'Identify objects and extract text from image',
            status: 'in_progress',
            createdAt: new Date(Date.now() - 120000),
            priority: 'medium'
          },
          {
            id: '3',
            title: 'Generate summary report',
            description: 'Create comprehensive analysis based on uploaded files',
            status: 'pending',
            createdAt: new Date(),
            priority: 'low'
          }
        ];
        
        // In real implementation:
        // const response = await fetch('/api/tasks');
        // const data = await response.json();
        // setTasks(data);
        
        setTasks(mockTasks);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };

    fetchTasks();

    // API CALL or WEBSOCKET: Subscribe to /api/tasks/updates for real-time task updates
    // In real implementation, set up WebSocket connection:
    // const ws = new WebSocket('/api/tasks/updates');
    // ws.onmessage = (event) => {
    //   const updatedTask = JSON.parse(event.data);
    //   setTasks(prev => prev.map(task => 
    //     task.id === updatedTask.id ? updatedTask : task
    //   ));
    // };

    // Mock real-time updates
    const interval = setInterval(() => {
      setTasks(prev => prev.map(task => {
        if (task.status === 'in_progress' && Math.random() > 0.7) {
          return { ...task, status: 'completed' as const, completedAt: new Date() };
        }
        if (task.status === 'pending' && Math.random() > 0.8) {
          return { ...task, status: 'in_progress' as const };
        }
        return task;
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const activeTasks = tasks.filter(task => task.status !== 'completed');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  const getStatusIcon = (status: TodoTask['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-warning animate-pulse" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: TodoTask['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-destructive';
      case 'medium':
        return 'border-l-warning';
      default:
        return 'border-l-muted';
    }
  };

  const formatTime = (date: Date) => {
    const minutes = Math.round((date.getTime() - Date.now()) / (1000 * 60));
    if (minutes > -1) return 'just now';
    if (minutes > -60) return `${Math.abs(minutes)} minutes ago`;
    const hours = Math.round(minutes / 60);
    if (hours > -24) return `${Math.abs(hours)} hours ago`;
    return `${Math.abs(Math.round(hours / 24))} days ago`;
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <h2 className="text-lg font-semibold text-foreground mb-4">Tasks</h2>

      <ScrollArea className="flex-1">
        <div className="space-y-3">
          {/* Active Tasks */}
          {activeTasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                "p-3 rounded-lg border-l-4 bg-card border border-border transition-all duration-300",
                getPriorityColor(task.priority)
              )}
            >
              <div className="flex items-start gap-3">
                {getStatusIcon(task.status)}
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-medium",
                    task.status === 'in_progress' ? "text-foreground font-semibold" : "text-foreground"
                  )}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {formatTime(task.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Completed Tasks Section */}
          {completedTasks.length > 0 && (
            <div className="mt-6">
              <Button
                variant="ghost"
                onClick={() => setShowCompleted(!showCompleted)}
                className="w-full justify-start p-0 h-auto text-muted-foreground hover:text-foreground mb-2"
              >
                {showCompleted ? (
                  <ChevronDown className="h-4 w-4 mr-2" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-2" />
                )}
                Completed ({completedTasks.length})
              </Button>

              {showCompleted && (
                <div className="space-y-2 animate-fade-in">
                  {completedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-lg border border-border bg-muted/30 opacity-75"
                    >
                      <div className="flex items-start gap-3">
                        {getStatusIcon(task.status)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground line-through">
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-through">
                              {task.description}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            Completed {task.completedAt && formatTime(task.completedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No tasks yet
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}