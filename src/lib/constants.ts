export const USER_API_KEY_STORAGE = 'drenzo_user_api_key'
export const PROVIDER_STORAGE = 'drenzo_provider'
export const OPENROUTER_API_KEY_STORAGE = 'drenzo_openrouter_api_key'
export const OPENROUTER_MODEL_STORAGE = 'drenzo_openrouter_model'

export type Provider = 'opencode' | 'openrouter'

export const OPENROUTER_MODELS = [
  { id: 'deepseek/deepseek-r1:free', label: 'DeepSeek R1 (free)' },
  { id: 'deepseek/deepseek-chat:free', label: 'DeepSeek Chat (free)' },
  { id: 'meta-llama/llama-3.3-70b-instruct:free', label: 'Llama 3.3 70B (free)' },
  { id: 'meta-llama/llama-3.1-8b-instruct:free', label: 'Llama 3.1 8B (free)' },
  { id: 'google/gemma-2-9b-it:free', label: 'Gemma 2 9B (free)' },
  { id: 'qwen/qwen-2.5-72b-instruct:free', label: 'Qwen 2.5 72B (free)' },
  { id: 'mistralai/mistral-7b-instruct:free', label: 'Mistral 7B (free)' },
] as const
