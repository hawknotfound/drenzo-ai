import type { KnowledgeFile, KnowledgeContent } from '@/types/knowledge'
import { getFromCache, setToCache, invalidateCacheByPrefix } from '@/lib/utils/cache'

const CACHE_PREFIX = 'cloudinary:'
const CACHE_TTL = 10 * 60 * 1000

export async function listKnowledgeFiles(): Promise<KnowledgeFile[]> {
  const cacheKey = `${CACHE_PREFIX}files`
  const cached = getFromCache<KnowledgeFile[]>(cacheKey)
  if (cached) return cached

  const response = await fetch('/api/knowledge/list')

  if (!response.ok) throw new Error(`Knowledge list failed: ${response.statusText}`)

  const data = await response.json()
  setToCache(cacheKey, data.files, CACHE_TTL)
  return data.files
}

export async function getRelevantKnowledge(filenames: string[]): Promise<KnowledgeContent[]> {
  const results: KnowledgeContent[] = []
  const uncached: string[] = []

  for (const name of filenames) {
    const cacheKey = `${CACHE_PREFIX}content:${name}`
    const cached = getFromCache<KnowledgeContent>(cacheKey)
    if (cached) {
      results.push(cached)
    } else {
      uncached.push(name)
    }
  }

  if (uncached.length > 0) {
    const response = await fetch('/api/knowledge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filenames: uncached }),
    })

    if (!response.ok) throw new Error(`Knowledge fetch failed: ${response.statusText}`)

    const data = await response.json()

    for (const file of data.files) {
      if (file.content && !file.error) {
        const entry: KnowledgeContent = {
          filename: file.filename,
          content: file.content,
          cached_at: Date.now(),
        }
        setToCache(`${CACHE_PREFIX}content:${file.filename}`, entry, CACHE_TTL)
        results.push(entry)
      }
    }
  }

  return results
}

export function refreshKnowledgeCache(): void {
  invalidateCacheByPrefix(CACHE_PREFIX)
}
