interface CacheEntry<T> {
  data: T
  expiry: number
}

const store = new Map<string, CacheEntry<unknown>>()

export function getFromCache<T>(key: string): T | null {
  const entry = store.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiry) {
    store.delete(key)
    return null
  }
  return entry.data as T
}

export function setToCache<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void {
  store.set(key, { data, expiry: Date.now() + ttlMs })
}

export function invalidateCache(key: string): void {
  store.delete(key)
}

export function invalidateCacheByPrefix(prefix: string): void {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key)
  }
}
