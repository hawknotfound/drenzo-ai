export type AIModelId =
  | 'deepseek-v4-flash'
  | 'deepseek-r1'
  | 'claude-3-5-sonnet'
  | 'gpt-4o'
  | 'gemini-1-5-pro'
  | 'drenzo-custom-v2';

export interface AIModel {
  id: AIModelId;
  name: string;
  provider: string;
  badge?: string;
  description: string;
  speed: 'Ultra Fast' | 'Fast' | 'Balanced' | 'Reasoning';
  contextWindow: string;
}

export type CapabilityId =
  | 'web-search'
  | 'analyze-files'
  | 'image-understanding'
  | 'brainstorm'
  | 'coding'
  | 'writing'
  | 'research'
  | 'deep-thinking';

export interface CapabilityOption {
  id: CapabilityId;
  label: string;
  icon: string; // Lucide icon identifier
  activeColor?: string;
}

export interface PromptSuggestion {
  id: string;
  label: string;
  icon: string;
  category: 'code' | 'design' | 'writing' | 'learning';
  promptText: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  modelUsed?: string;
  thoughtProcess?: string;
  codeSnippets?: { language: string; code: string; title?: string }[];
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  lastUpdated: string;
  isPinned?: boolean;
  messages: Message[];
  capabilityFlags?: CapabilityId[];
}

export interface AttachedFile {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'code' | 'image' | 'text';
  uploadedAt: string;
  contentSnippet?: string;
}

export interface PromptTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  prompt: string;
  icon: string;
}
