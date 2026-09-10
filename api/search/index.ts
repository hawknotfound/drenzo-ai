import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleCors } from '../_lib/cors'

const TAVILY_API_KEY = process.env.TAVILY_API_KEY

interface SearchResult {
  title: string
  url: string
  content: string
}

// ─── FreeSerp (primary — no API key) ────────────────────────────────

async function searchFreeSerp(query: string): Promise<{ results: SearchResult[]; answer: string }> {
  const url = `https://freeserp.ai/api.php?q=${encodeURIComponent(query)}&format=json`

  const response = await fetch(url, {
    headers: { 'User-Agent': 'DrenzoAI/1.0' },
  })

  if (!response.ok) throw new Error(`FreeSerp error: ${response.status}`)

  const data = await response.json()

  const results: SearchResult[] = (data.organic || data.results || []).slice(0, 8).map((r: any) => ({
    title: r.title || '',
    url: r.url || r.link || '',
    content: r.snippet || r.content || r.description || '',
  }))

  return { results, answer: data.answer || '' }
}

// ─── Tavily (fallback — needs API key) ──────────────────────────────

async function searchTavily(query: string): Promise<{ results: SearchResult[]; answer: string }> {
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: TAVILY_API_KEY,
      query,
      search_depth: 'advanced',
      include_answer: true,
      max_results: 5,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Tavily error: ${err}`)
  }

  const data = await response.json()
  return {
    results: data.results?.map((r: any) => ({
      title: r.title,
      url: r.url,
      content: r.content,
    })) || [],
    answer: data.answer || '',
  }
}

// ─── DuckDuckGo (last resort — free, no key) ────────────────────────

async function searchDuckDuckGo(query: string): Promise<{ results: SearchResult[]; answer: string }> {
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&skip_disambig=1`

  const response = await fetch(url, {
    headers: { 'User-Agent': 'DrenzoAI/1.0' },
  })

  if (!response.ok) throw new Error(`DuckDuckGo error: ${response.status}`)

  const data = await response.json()

  const results: SearchResult[] = []
  const answer = data.AbstractText || data.Answer || ''

  if (data.AbstractText && data.AbstractURL) {
    results.push({
      title: data.AbstractSource || 'Summary',
      url: data.AbstractURL,
      content: data.AbstractText,
    })
  }

  if (data.RelatedTopics) {
    for (const topic of data.RelatedTopics.slice(0, 6)) {
      if (topic.Text) {
        results.push({
          title: topic.Text?.split(' - ')[0] || topic.FirstURL || 'Related',
          url: topic.FirstURL || '',
          content: topic.Text,
        })
      }
      if (topic.Topics) {
        for (const sub of topic.Topics.slice(0, 3)) {
          if (sub.Text) {
            results.push({
              title: sub.Text?.split(' - ')[0] || sub.FirstURL || 'Related',
              url: sub.FirstURL || '',
              content: sub.Text,
            })
          }
        }
      }
    }
  }

  return { results, answer }
}

// ─── Handler ─────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { query } = req.body
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'query string required' })
  }

  // Try FreeSerp first (no key needed)
  try {
    const result = await searchFreeSerp(query)
    if (result.results.length > 0) {
      return res.json(result)
    }
  } catch {}

  // Fallback to Tavily if key is set
  if (TAVILY_API_KEY) {
    try {
      const result = await searchTavily(query)
      return res.json(result)
    } catch {}
  }

  // Last resort: DuckDuckGo
  try {
    const result = await searchDuckDuckGo(query)
    return res.json(result)
  } catch (err) {
    return res.status(500).json({ error: String(err) })
  }
}
