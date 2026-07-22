export interface SearchResult {
  title: string
  url: string
  content: string
}

export interface SearchResponse {
  results: SearchResult[]
  answer?: string
  note?: string
}

export async function searchWeb(query: string): Promise<SearchResponse> {
  const response = await fetch('/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Search API error (${response.status}): ${err}`)
  }

  return response.json()
}
