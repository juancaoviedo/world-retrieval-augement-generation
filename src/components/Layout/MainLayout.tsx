import { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FilesWindow } from '../Files/FilesWindow';
import { TodoWindow } from '../Todo/TodoWindow';
import { ChatWindow } from '../Chat/ChatWindow';
import { useIsMobile } from '@/hooks/use-mobile';

export function MainLayout() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-primary bg-card px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 lg:w-auto w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        
        <h1 className="text-xl font-semibold text-foreground absolute left-1/2 transform -translate-x-1/2">SI-Mapper</h1>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="ml-auto"
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </header>

      {/* Main Container with Blue Border */}
      <div className="p-4">
        <div className="border-2 border-primary rounded-lg overflow-hidden bg-background">
          <div className="flex h-[calc(100vh-140px)]">
            {/* Sidebar - Files and TODO */}
            <aside 
              className={`
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                ${isMobile ? 'absolute inset-y-0 left-0 z-50 w-80 bg-card border-r border-border' : 'w-80 border-r border-border'}
                transition-transform duration-200 ease-in-out flex flex-col
              `}
            >
              {/* Files Window */}
              <div className="flex-1 min-h-0 border-b border-border">
                <FilesWindow />
              </div>
              
              {/* TODO Window */}
              <div className="flex-1 min-h-0">
                <TodoWindow />
              </div>
            </aside>

            {/* Overlay for mobile */}
            {isMobile && isSidebarOpen && (
              <div 
                className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
                onClick={toggleSidebar}
              />
            )}

            {/* Chat Window */}
            <main className="flex-1 min-w-0">
              <ChatWindow />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}