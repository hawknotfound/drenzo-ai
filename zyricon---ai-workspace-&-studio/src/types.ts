export type ViewMode = 
  | 'chat' 
  | 'archived' 
  | 'library' 
  | 'workspace' 
  | 'image-generator' 
  | 'ai-presentation' 
  | 'dev-assistant';

export interface ModelOption {
  id: string;
  name: string;
  version: string;
  provider: string;
  description: string;
  badge?: string;
  contextWindow: string;
  speed: 'Fast' | 'Ultra-Fast' | 'Balanced';
}

export interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  attachedFile?: AttachedFile;
  isStreaming?: boolean;
  codeSnippet?: {
    language: string;
    code: string;
  };
}

export interface ConfigState {
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  topP: number;
  responseFormat: 'markdown' | 'concise' | 'structured';
  streamResponse: boolean;
}

export interface FeatureOptions {
  webSearch: boolean;
  codeInterpreter: boolean;
  deepReasoning: boolean;
}

export interface WorkspaceFolder {
  id: string;
  name: string;
  iconType: 'folder' | 'image' | 'presentation' | 'code' | 'riset';
  itemCount: number;
  description?: string;
}

export interface ArchiveItem {
  id: string;
  title: string;
  preview: string;
  date: string;
  model: string;
  messageCount: number;
}

export interface LibraryTemplate {
  id: string;
  title: string;
  category: 'Coding' | 'Creative' | 'Productivity' | 'Research';
  description: string;
  prompt: string;
  tags: string[];
}

export interface ToastInfo {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}
