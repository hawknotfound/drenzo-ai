import { useState, useCallback } from 'react'
import type { KnowledgeFile } from '@/types/knowledge'
import { listKnowledgeFiles, refreshKnowledgeCache } from '@/lib/cloudinary/service'

export function useKnowledge() {
  const [files, setFiles] = useState<KnowledgeFile[]>([])
  const [loading, setLoading] = useState(false)

  const loadFiles = useCallback(async () => {
    setLoading(true)
    try {
      const result = await listKnowledgeFiles()
      setFiles(result)
    } catch (err) {
      console.error('Failed to load knowledge files:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const refresh = useCallback(() => {
    refreshKnowledgeCache()
    loadFiles()
  }, [loadFiles])

  return { files, loading, loadFiles, refresh }
}
