export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'llm';
  timestamp: Date;
  type?: 'text' | 'file' | 'system';
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  thumbnailUrl?: string;
  url: string;
}

export interface TodoTask {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  priority?: 'low' | 'medium' | 'high';
}

export interface Progress {
  id: string;
  title: string;
  progress: number; // 0-100
  status: 'idle' | 'running' | 'completed' | 'error';
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}