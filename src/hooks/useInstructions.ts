import { useState, useCallback, useEffect } from 'react'
import type { UserInstruction } from '@/types/instructions'
import * as storage from '@/lib/google/storage'

export function useInstructions(userId: string | undefined) {
  const [instructions, setInstructions] = useState<UserInstruction[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!userId) { setInstructions([]); setActiveId(null); return }
    setLoading(true)
    try {
      const [list, settings] = await Promise.all([
        storage.loadInstructions(),
        storage.loadSettings(),
      ])
      setInstructions(list)
      setActiveId(settings.active_instruction_id ?? null)
    } catch (err) {
      console.error('Load instructions error:', err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => { load() }, [load])

  const createInstruction = useCallback(async (title: string, content: string): Promise<boolean> => {
    if (!title.trim() || !content.trim()) return false
    const inst = await storage.createInstruction(title, content)
    if (!inst) return false
    setInstructions(prev => [...prev, inst])
    return true
  }, [])

  const updateInstruction = useCallback(async (id: string, title: string, content: string): Promise<boolean> => {
    const ok = await storage.updateInstruction(id, title, content)
    if (ok) {
      setInstructions(prev => prev.map(i =>
        i.id === id ? { ...i, title: title.trim(), content: content.trim(), updated_at: new Date().toISOString() } : i
      ))
    }
    return ok
  }, [])

  const deleteInstruction = useCallback(async (id: string): Promise<boolean> => {
    const ok = await storage.deleteInstructionFromDrive(id)
    if (ok) {
      setInstructions(prev => prev.filter(i => i.id !== id))
      if (activeId === id) setActiveId(null)
    }
    return ok
  }, [activeId])

  const selectInstruction = useCallback(async (id: string | null) => {
    setActiveId(id)
    await storage.saveSettings({ active_instruction_id: id })
  }, [])

  const activeInstruction = activeId
    ? instructions.find(i => i.id === activeId) ?? null
    : null

  return {
    instructions,
    activeId,
    activeInstruction,
    loading,
    load,
    createInstruction,
    updateInstruction,
    deleteInstruction,
    selectInstruction,
  }
}
