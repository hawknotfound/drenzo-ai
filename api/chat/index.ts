import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleCors } from '../_lib/cors'

const OPENCODE_API_URL = process.env.OPENCODE_API_URL || process.env.VITE_OPENCODE_API_URL || 'https://opencode.ai/zen/v1'
const OPENCODE_API_KEY = process.env.OPENCODE_API_KEY || process.env.VITE_OPENCODE_API_KEY
const RAW_OPENCODE_MODEL = process.env.OPENCODE_MODEL || process.env.VITE_OPENCODE_MODEL || 'mimo-v2.5-free'
const OPENCODE_MODEL = RAW_OPENCODE_MODEL === 'deepseek-v4-flash-free' ? 'mimo-v2.5-free' : RAW_OPENCODE_MODEL
const OPENCODE_SESSION_ID = process.env.OPENCODE_SESSION_ID || 'drenzo-ai-free'

const OPENROUTER_API_URL = process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1'
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { messages, temperature = 0.7, max_tokens = 4096, userApiKey, sessionId, provider, openRouterApiKey, openRouterModel } = req.body

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' })
  }

  const useOpenRouter = provider === 'openrouter'

  if (useOpenRouter) {
    const orKey = openRouterApiKey || OPENROUTER_API_KEY
    if (!orKey) return res.status(400).json({ error: 'No OpenRouter API key. Add it in Settings → Provider.' })
    const orModel = openRouterModel || 'openai/gpt-4o-mini'
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    try {
      const response = await fetch(`${OPENROUTER_API_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${orKey}`,
          'HTTP-Referer': 'https://drenzo-ai.vercel.app',
          'X-Title': 'Drenzo AI',
        },
        body: JSON.stringify({ model: orModel, messages, temperature, max_tokens, stream: true }),
      })
      if (!response.ok) {
        const err = await response.text()
        res.write(`data: ${JSON.stringify({ error: `OpenRouter error: ${err}` })}\n\n`)
        res.write('data: [DONE]\n\n')
        res.end()
        return
      }
      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        res.write(decoder.decode(value, { stream: true }))
      }
      res.write('data: [DONE]\n\n')
      res.end()
    } catch (error) {
      res.write(`data: ${JSON.stringify({ error: String(error) })}\n\n`)
      res.write('data: [DONE]\n\n')
      res.end()
    }
    return
  }

  const apiKey = userApiKey || OPENCODE_API_KEY
  if (!apiKey) {
    return res.status(400).json({ error: 'No API key configured. Add your OpenCode Zen key in Settings.' })
  }

  const effectiveSessionId = sessionId || OPENCODE_SESSION_ID

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    const fallbacks = ['muse-spark-1.2-contributor-free', 'mimo-v2.5-free'].filter(m => m !== OPENCODE_MODEL)
    const modelsToTry = [OPENCODE_MODEL, ...fallbacks]
    let response: Response | null = null
    let lastErr = ''
    for (const model of modelsToTry) {
      response = await fetch(`${OPENCODE_API_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'session_id': effectiveSessionId,
        },
        body: JSON.stringify({ model, messages, temperature, max_tokens, stream: true }),
      })
      if (response.ok) break
      lastErr = await response.text()
      const isRetryable = lastErr.includes('Rate limit') || lastErr.includes('FreeUsageLimitError') || lastErr.includes('Internal server error') || lastErr.includes('Model is unavailable') || response.status === 429 || response.status === 500
      if (!isRetryable) break
    }

    if (!response || !response.ok) {
      res.write(`data: ${JSON.stringify({ error: `OpenCode API error: ${lastErr}` })}\n\n`)
      res.write('data: [DONE]\n\n')
      res.end()
      return
    }

    const reader = response.body?.getReader()
    if (!reader) throw new Error('No response body')

    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      res.write(chunk)
    }

    res.write('data: [DONE]\n\n')
    res.end()
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: String(error) })}\n\n`)
    res.write('data: [DONE]\n\n')
    res.end()
  }
}
