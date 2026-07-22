export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  metadata?: Record<string, unknown>
  created_at?: string
}

export interface ConversationSummary {
  id: string
  title: string
  is_pinned: boolean
  created_at: string
  updated_at: string
  message_count?: number
}

export interface StreamChunk {
  content: string
  done: boolean
  error?: string
}
