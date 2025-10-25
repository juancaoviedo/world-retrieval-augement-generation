import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Progress as ProgressType } from '@/types';

export function ProgressBar() {
  const [progress, setProgress] = useState<ProgressType | null>(null);

  useEffect(() => {
    // API CALL: Fetch progress status from /api/progress
    const fetchProgress = async () => {
      try {
        // Mock data for now
        const mockProgress: ProgressType = {
          id: '1',
          title: 'Processing files...',
          progress: 65,
          status: 'running'
        };
        
        // In real implementation:
        // const response = await fetch('/api/progress');
        // const data = await response.json();
        // setProgress(data);
        
        setProgress(mockProgress);
      } catch (error) {
        console.error('Failed to fetch progress:', error);
      }
    };

    fetchProgress();
    
    // Poll for updates every 2 seconds when there's active progress
    const interval = setInterval(() => {
      if (progress?.status === 'running') {
        fetchProgress();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [progress?.status]);

  if (!progress || progress.status === 'idle') {
    return null;
  }

  const getProgressColor = () => {
    switch (progress.status) {
      case 'completed':
        return 'bg-success';
      case 'error':
        return 'bg-destructive';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div className="bg-card border-b border-border px-4 py-2">
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-foreground font-medium">{progress.title}</span>
        <span className="text-muted-foreground">{progress.progress}%</span>
      </div>
      <Progress 
        value={progress.progress} 
        className="h-2"
        style={{
          '--progress-background': `hsl(var(--${progress.status === 'completed' ? 'success' : progress.status === 'error' ? 'destructive' : 'primary'}))`
        } as React.CSSProperties}
      />
    </div>
  );
}