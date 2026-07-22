export interface Profile {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Conversation {
  id: string
  user_id: string
  title: string
  is_pinned: boolean
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  metadata: Record<string, unknown>
  created_at: string
}

export interface ConversationMetadata {
  id: string
  conversation_id: string
  key: string
  value: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface UserSettings {
  id: string
  user_id: string
  theme: 'dark' | 'light'
  model: string
  temperature: number
  max_tokens: number
  created_at: string
  updated_at: string
}

export interface Usage {
  id: string
  user_id: string
  tokens_in: number
  tokens_out: number
  model: string
  endpoint: string
  created_at: string
}

export interface Feedback {
  id: string
  user_id: string | null
  message_id: string
  rating: number
  comment: string | null
  created_at: string
}
