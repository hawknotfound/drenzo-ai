export interface OpenCodeMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface OpenCodeRequest {
  messages: OpenCodeMessage[]
  temperature?: number
  max_tokens?: number
}

export interface OpenCodeStreamCallbacks {
  onToken: (token: string) => void
  onDone: (reason?: string) => void
  onError: (error: Error) => void
}

export async function* streamChat(
  request: OpenCodeRequest
): AsyncGenerator<string, void, unknown> {
  const response = await fetch('/api/chat', {
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
          const content = parsed.choices?.[0]?.delta?.content || ''
          if (content) yield content
        } catch {
          continue
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

export function streamChatWithCallbacks(
  request: OpenCodeRequest,
  callbacks: OpenCodeStreamCallbacks
): AbortController {
  const controller = new AbortController()

  ;(async () => {
    try {
      for await (const token of streamChat(request)) {
        if (controller.signal.aborted) break
        callbacks.onToken(token)
      }
      if (!controller.signal.aborted) {
        callbacks.onDone()
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        callbacks.onError(err instanceof Error ? err : new Error(String(err)))
      }
    }
  })()

  return controller
}
