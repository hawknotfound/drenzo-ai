export interface OpenCodeMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface OpenCodeRequest {
  messages: OpenCodeMessage[]
  temperature?: number
  max_tokens?: number
  userApiKey?: string
}

export interface StreamToken {
  type: 'content' | 'thinking'
  text: string
}

export interface OpenCodeStreamCallbacks {
  onToken: (token: string) => void
  onThinking?: (token: string) => void
  onDone: (reason?: string) => void
  onError: (error: Error) => void
}

import { apiUrl } from '@/lib/api'

export async function* streamChat(
  request: OpenCodeRequest
): AsyncGenerator<StreamToken, void, unknown> {
  const response = await fetch(apiUrl('/api/chat'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Chat API error (${response.status}): ${err}`)
  }

  const reader = response.body?.getReader()
  if (!reader) throw new Error('Response body is not readable')

  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data: ')) continue

        const data = trimmed.slice(6)

        if (data === '[DONE]') return

        try {
          const parsed = JSON.parse(data)
          if (parsed.error) throw new Error(parsed.error)
          const delta = parsed.choices?.[0]?.delta
          const content = delta?.content || ''
          const reasoning = delta?.reasoning_content || ''
          if (reasoning) yield { type: 'thinking', text: reasoning }
          if (content) yield { type: 'content', text: content }
        } catch (e) {
          if (e instanceof SyntaxError) continue
          throw e
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

export function streamChatWithCallbacks(
  request: OpenCodeRequest,
  callbacks: OpenCodeStreamCallbacks,
  retries = 2
): AbortController {
  const controller = new AbortController()

  ;(async () => {
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= retries; attempt++) {
      if (controller.signal.aborted) return

      try {
        for await (const token of streamChat(request)) {
          if (controller.signal.aborted) break
          if (token.type === 'thinking' && callbacks.onThinking) {
            callbacks.onThinking(token.text)
          } else if (token.type === 'content') {
            callbacks.onToken(token.text)
          }
        }
        if (!controller.signal.aborted) {
          callbacks.onDone()
        }
        return
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err))
        const msg = lastError.message.toLowerCase()
        const isRateLimit = msg.includes('rate limit') || msg.includes('too many') || msg.includes('429')

        if (isRateLimit && attempt < retries) {
          const delay = (attempt + 1) * 3000
          await new Promise(r => setTimeout(r, delay))
          continue
        }

        if (!controller.signal.aborted) {
          callbacks.onError(lastError)
        }
        return
      }
    }
  })()

  return controller
}
