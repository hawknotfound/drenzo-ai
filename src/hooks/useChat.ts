import { useState, useCallback, useRef } from 'react'
import type { ChatMessage } from '@/types/chat'
import { supabase } from '@/lib/supabase/client'
import { streamChatWithCallbacks, type OpenCodeMessage } from '@/lib/opencode/service'
import { getRelevantFiles } from '@/lib/utils/relevance'
import { getRelevantKnowledge } from '@/lib/cloudinary/service'

const MESSAGE_LIMIT = 35

export function useChat(conversationId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const sendingRef = useRef(false)

  const messageCount = messages.filter(m => m.role === 'user').length
  const limitReached = messageCount >= MESSAGE_LIMIT

  const loadMessages = useCallback(async (convId?: string) => {
    const id = convId || conversationId
    if (!id || sendingRef.current) { setMessages([]); return }
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true })

    if (!error && data) setMessages(data)
    if (error) setError(error.message)
  }, [conversationId])

  const sendMessage = useCallback(async (content: string, overrideConvId?: string) => {
    const convId = overrideConvId || conversationId
    if (!convId || !content.trim()) return
    if (limitReached) { setError('Message limit reached (35 per conversation). Start a new chat.'); return }

    sendingRef.current = true
    setError(null)

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
    }

    setMessages(prev => [...prev, userMessage])

    await supabase.from('messages').insert({
      id: userMessage.id,
      conversation_id: convId,
      role: 'user',
      content,
    })

    setIsStreaming(true)

    const relevantFiles = getRelevantFiles(content)
    let knowledgeContext = ''
    if (relevantFiles.length > 0) {
      try {
        const files = await getRelevantKnowledge(relevantFiles)
        knowledgeContext = files.map(f => `[${f.filename}]\n${f.content}`).join('\n\n')
      } catch {}
    }

    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
    }
    setMessages(prev => [...prev, assistantMessage])

    const openCodeMessages: OpenCodeMessage[] = []

    if (knowledgeContext) {
      openCodeMessages.push({
        role: 'system',
        content: `You are Drenzo AI. Use the following knowledge context to inform your response:\n\n${knowledgeContext}`,
      })
    }

    const history = messages.concat(userMessage)
    for (const msg of history) {
      if (msg.role === 'system') continue
      openCodeMessages.push({ role: msg.role, content: msg.content })
    }

    abortRef.current = streamChatWithCallbacks(
      { messages: openCodeMessages },
      {
        onToken: (token) => {
          setMessages(prev => {
            const updated = [...prev]
            const last = updated[updated.length - 1]
            if (last && last.role === 'assistant') {
              updated[updated.length - 1] = { ...last, content: last.content + token }
            }
            return updated
          })
        },
        onDone: async () => {
          sendingRef.current = false
          setIsStreaming(false)
          const lastMsg = messages[messages.length - 1]
          if (lastMsg && lastMsg.role === 'assistant' && lastMsg.content) {
            await supabase.from('messages').insert({
              id: assistantMessage.id,
              conversation_id: convId,
              role: 'assistant',
              content: lastMsg.content,
            })
          }
        },
        onError: (err) => {
          sendingRef.current = false
          setIsStreaming(false)
          setError(err.message)
        },
      }
    )
  }, [conversationId, messages, limitReached])

  const stopStreaming = useCallback(() => {
    sendingRef.current = false
    abortRef.current?.abort()
    setIsStreaming(false)
  }, [])

  const regenerate = useCallback(async () => {
    if (messages.length < 2) return
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')
    if (lastUserMsg) {
      setMessages(prev => prev.slice(0, -1))
      await sendMessage(lastUserMsg.content)
    }
  }, [messages, sendMessage])

  const clearError = useCallback(() => setError(null), [])

  return {
    messages,
    isStreaming,
    error,
    messageCount,
    limitReached,
    loadMessages,
    sendMessage,
    stopStreaming,
    regenerate,
    clearError,
  }
}
