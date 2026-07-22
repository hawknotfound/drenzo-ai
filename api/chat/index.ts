import type { VercelRequest, VercelResponse } from '@vercel/node'

const OPENCODE_API_URL = process.env.OPENCODE_API_URL || process.env.VITE_OPENCODE_API_URL || 'https://opencode.ai/zen/v1'
const OPENCODE_API_KEY = process.env.OPENCODE_API_KEY || process.env.VITE_OPENCODE_API_KEY
const OPENCODE_MODEL = process.env.OPENCODE_MODEL || process.env.VITE_OPENCODE_MODEL || 'deepseek-v4-flash-free'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  if (!OPENCODE_API_KEY) return res.status(500).json({ error: 'OpenCode API key not configured' })

  const { messages, temperature = 0.7, max_tokens = 4096 } = req.body

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' })
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    const response = await fetch(`${OPENCODE_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENCODE_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENCODE_MODEL,
        messages,
        temperature,
        max_tokens,
        stream: true,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      res.write(`data: ${JSON.stringify({ error: `OpenCode API error: ${err}` })}\n\n`)
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
