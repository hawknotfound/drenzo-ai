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
