import { useState, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { UserInstruction } from '@/types/instructions'

const SETTINGS_DEFAULTS = {
  temperature: 0.7,
  max_tokens: 4096,
}

export function useInstructions(userId: string | undefined) {
  const [instructions, setInstructions] = useState<UserInstruction[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!userId) {
      setInstructions([])
      setActiveId(null)
      return
    }
    setLoading(true)
    try {
      const [listRes, settingsRes] = await Promise.all([
        supabase
          .from('user_instructions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: true }),
        supabase
          .from('user_settings')
          .select('active_instruction_id')
          .eq('user_id', userId)
          .single(),
      ])
      if (!listRes.error && listRes.data) setInstructions(listRes.data)
      if (!settingsRes.error && settingsRes.data) {
        setActiveId(settingsRes.data.active_instruction_id)
      }
    } catch (err) {
      console.error('Load instructions error:', err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    load()
  }, [load])

  const createInstruction = useCallback(async (title: string, content: string): Promise<boolean> => {
    if (!userId || !title.trim() || !content.trim()) return false
    const { data, error } = await supabase
      .from('user_instructions')
      .insert({ user_id: userId, title: title.trim(), content: content.trim() })
      .select()
      .single()
    if (error || !data) {
      console.error('Create instruction error:', error)
      return false
    }
    setInstructions(prev => [...prev, data])
    return true
  }, [userId])

  const updateInstruction = useCallback(async (id: string, title: string, content: string): Promise<boolean> => {
    if (!title.trim() || !content.trim()) return false
    const { error } = await supabase
      .from('user_instructions')
      .update({ title: title.trim(), content: content.trim(), updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
    if (error) {
      console.error('Update instruction error:', error)
      return false
    }
    setInstructions(prev => prev.map(i => i.id === id ? { ...i, title: title.trim(), content: content.trim(), updated_at: new Date().toISOString() } : i))
    return true
  }, [userId])

  const deleteInstruction = useCallback(async (id: string): Promise<boolean> => {
    if (!userId) return false
    const { error } = await supabase
      .from('user_instructions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
    if (error) {
      console.error('Delete instruction error:', error)
      return false
    }
    setInstructions(prev => prev.filter(i => i.id !== id))
    if (activeId === id) setActiveId(null)
    return true
  }, [userId, activeId])

  const selectInstruction = useCallback(async (id: string | null) => {
    if (!userId) return
    setActiveId(id)
    const { data: existing } = await supabase
      .from('user_settings')
      .select('user_id')
      .eq('user_id', userId)
      .single()
    if (existing) {
      const { error } = await supabase
        .from('user_settings')
        .update({ active_instruction_id: id })
        .eq('user_id', userId)
      if (error) console.error('Select instruction error:', error)
    } else {
      const { error } = await supabase
        .from('user_settings')
        .insert({ user_id: userId, ...SETTINGS_DEFAULTS, active_instruction_id: id })
      if (error) console.error('Select instruction error:', error)
    }
  }, [userId])

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
