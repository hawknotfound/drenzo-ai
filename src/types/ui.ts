export type AIModelId =
  | 'deepseek-v4-flash';

export interface AIModel {
  id: AIModelId;
  name: string;
  provider: string;
  badge?: string;
  description: string;
  speed: 'Ultra Fast' | 'Fast' | 'Balanced' | 'Reasoning';
  contextWindow: string;
}

export interface PromptSuggestion {
  id: string;
  label: string;
  icon: string;
  category: 'code' | 'design' | 'writing' | 'learning' | 'business' | 'career' | 'productivity' | 'finance' | 'creative' | 'analysis';
  promptText: string;
  theme?: 'blue' | 'purple' | 'amber' | 'emerald' | 'rose' | 'cyan' | 'violet' | 'orange';
  anim?: 'fadeRight' | 'fadeLeft' | 'fadeUp' | 'scale';
  recommended?: boolean;
}

export interface PromptTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  prompt: string;
  icon: string;
}
