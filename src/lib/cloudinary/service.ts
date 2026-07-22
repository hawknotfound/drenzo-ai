import type { KnowledgeFile, KnowledgeContent } from '@/types/knowledge'
import { getFromCache, setToCache, invalidateCacheByPrefix } from '@/lib/utils/cache'

const CACHE_PREFIX = 'cloudinary:'
const CACHE_TTL = 10 * 60 * 1000

let fileLookup: Map<string, string> | null = null

function cleanName(publicId: string): string {
  const name = publicId.replace(/^Drenzo AI\//, '')
  return name.replace(/_[a-z0-9]+(?=\.md$|$)/, '').replace(/\.md$/, '')
}

async function ensureLookup(): Promise<Map<string, string>> {
  if (fileLookup) return fileLookup

  const cacheKey = `${CACHE_PREFIX}lookup`
  const cached = getFromCache<Map<string, string>>(cacheKey)
  if (cached) { fileLookup = cached; return cached }

  const response = await fetch('/api/knowledge/list')
  if (!response.ok) throw new Error(`Knowledge list failed: ${response.statusText}`)

  const data = await response.json()
  const lookup = new Map<string, string>()

  for (const file of data.files) {
    const name = cleanName(file.name || file.id)
    lookup.set(name, file.name || file.id)
  }

  fileLookup = lookup
  setToCache(cacheKey, lookup, CACHE_TTL)
  return lookup
}

export async function listKnowledgeFiles(): Promise<KnowledgeFile[]> {
  const cacheKey = `${CACHE_PREFIX}files`
  const cached = getFromCache<KnowledgeFile[]>(cacheKey)
  if (cached) return cached

  const response = await fetch('/api/knowledge/list')
  if (!response.ok) throw new Error(`Knowledge list failed: ${response.statusText}`)

  const data = await response.json()
  const files: KnowledgeFile[] = data.files.map((f: { name?: string; id?: string; format?: string; size?: number; created_at?: string; updated_at?: string }) => ({
    id: f.id || '',
    name: cleanName(f.name || f.id || ''),
    path: f.name || f.id || '',
    type: f.format || 'md',
    size: f.size || 0,
    updated_at: f.updated_at || '',
  }))

  setToCache(cacheKey, files, CACHE_TTL)
  return files
}

export async function getRelevantKnowledge(filenames: string[]): Promise<KnowledgeContent[]> {
  const results: KnowledgeContent[] = []
  const uncached: string[] = []

  const lookup = await ensureLookup()

  for (const name of filenames) {
    const cacheKey = `${CACHE_PREFIX}content:${name}`
    const cached = getFromCache<KnowledgeContent>(cacheKey)
    if (cached) {
      results.push(cached)
    } else {
      const actualName = lookup.get(name)
      if (actualName) uncached.push(actualName)
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
          filename: cleanName(file.filename),
          content: file.content,
          cached_at: Date.now(),
        }
        setToCache(`${CACHE_PREFIX}content:${entry.filename}`, entry, CACHE_TTL)
        results.push(entry)
      }
    }
  }

  return results
}

export function refreshKnowledgeCache(): void {
  fileLookup = null
  invalidateCacheByPrefix(CACHE_PREFIX)
}
