import type { VercelRequest, VercelResponse } from '@vercel/node'

const TAVILY_API_KEY = process.env.TAVILY_API_KEY

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { query } = req.body
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'query string required' })
  }

  if (!TAVILY_API_KEY) {
    return res.json({ results: [], note: 'Search not configured — set TAVILY_API_KEY' })
  }

  try {
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
      return res.status(response.status).json({ error: `Tavily error: ${err}` })
    }

    const data = await response.json()
    return res.json({
      results: data.results?.map((r: any) => ({
        title: r.title,
        url: r.url,
        content: r.content,
      })) || [],
      answer: data.answer || '',
    })
  } catch (err) {
    return res.status(500).json({ error: String(err) })
  }
}
