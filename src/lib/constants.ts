export const USER_API_KEY_STORAGE = 'drenzo_user_api_key'
export const PROVIDER_STORAGE = 'drenzo_provider'
export const OPENROUTER_API_KEY_STORAGE = 'drenzo_openrouter_api_key'
export const OPENROUTER_MODEL_STORAGE = 'drenzo_openrouter_model'

export type Provider = 'opencode' | 'openrouter'

export const OPENROUTER_MODELS = [
  { id: 'openai/gpt-4o-mini', label: 'GPT-4o Mini (fast, cheap)' },
  { id: 'openai/gpt-4o', label: 'GPT-4o' },
  { id: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' },
  { id: 'google/gemini-2.0-flash-001', label: 'Gemini 2.0 Flash' },
  { id: 'meta-llama/llama-3.3-70b-instruct', label: 'Llama 3.3 70B' },
  { id: 'deepseek/deepseek-chat', label: 'DeepSeek Chat' },
  { id: 'mimo/mimo-v2-flash', label: 'Mimo V2 Flash' },
] as const
