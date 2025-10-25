import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, ArrowDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChatMessage } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // API CALL: Fetch chat history from /api/chat/history on page load
    const fetchChatHistory = async () => {
      try {
        // Mock data for now
        const mockMessages: ChatMessage[] = [
          {
            id: '1',
            content: 'Hello! I\'m your multimodal AI assistant. I can help you analyze files, extract insights, and answer questions. How can I assist you today?',
            sender: 'llm',
            timestamp: new Date(Date.now() - 600000),
            type: 'text'
          },
          {
            id: '2',
            content: 'Hi there! I\'ve uploaded a document. Can you analyze it for me?',
            sender: 'user',
            timestamp: new Date(Date.now() - 300000),
            type: 'text'
          },
          {
            id: '3',
            content: 'I\'ve successfully analyzed your document. Here are the key insights I found:\n\n• Main topic: Market Analysis Report\n• Key findings: 23% growth in Q3\n• Recommendations: Expand into new markets\n• Risk factors: Supply chain concerns\n\nWould you like me to dive deeper into any specific section?',
            sender: 'llm',
            timestamp: new Date(Date.now() - 120000),
            type: 'text'
          }
        ];
        
        // In real implementation:
        // const response = await fetch('/api/chat/history');
        // const data = await response.json();
        // setMessages(data);
        
        setMessages(mockMessages);
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
        toast({
          title: "Error",
          description: "Failed to load chat history",
          variant: "destructive"
        });
      }
    };

    fetchChatHistory();

    // API CALL or WEBSOCKET: Subscribe to /api/chat/updates for real-time response streaming
    // In real implementation, set up WebSocket connection:
    // const ws = new WebSocket('/api/chat/updates');
    // ws.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   if (data.type === 'message') {
    //     setMessages(prev => [...prev, data.message]);
    //   } else if (data.type === 'typing') {
    //     setIsTyping(data.isTyping);
    //   }
    // };
  }, [toast]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Handle scroll position to show/hide "Jump to Latest" button
    const handleScroll = () => {
      if (scrollAreaRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShowScrollToBottom(!isNearBottom);
      }
    };

    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      scrollArea.addEventListener('scroll', handleScroll);
      return () => scrollArea.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // API CALL: Post user input to /api/chat on send
      // const response = await fetch('/api/chat', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message: newMessage.trim() })
      // });
      // const data = await response.json();

      // Mock AI response
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: `I understand you said: "${userMessage.content}". I'm processing your request and will provide a detailed response. This might involve analyzing any uploaded files or performing the tasks you've mentioned. Please give me a moment to complete this analysis.`,
          sender: 'llm',
          timestamp: new Date(),
          type: 'text'
        };

        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsTyping(false);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="border-b border-border p-4">
        <h2 className="text-lg font-semibold text-foreground">Chat</h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 relative">
        <ScrollArea ref={scrollAreaRef} className="h-full p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 animate-fade-in",
                  message.sender === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {message.sender === 'llm' && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-2",
                    message.sender === 'user'
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  <div className={cn(
                    "text-xs mt-2 opacity-70",
                    message.sender === 'user' ? "text-primary-foreground" : "text-muted-foreground"
                  )}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>

                {message.sender === 'user' && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 animate-fade-in">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted text-foreground rounded-lg px-4 py-2">
                  <div className="flex items-center gap-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-muted-foreground ml-2">AI is typing...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Jump to Latest Button */}
        {showScrollToBottom && (
          <Button
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 rounded-full shadow-lg"
            size="sm"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-border p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          <Button type="submit" disabled={isLoading || !newMessage.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}