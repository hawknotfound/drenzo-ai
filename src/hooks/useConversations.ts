import { useState, useEffect, useCallback } from 'react'
import type { Conversation } from '@/types/database'
import * as storage from '@/lib/google/storage'

export function useConversations(userId: string | undefined) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  const fetchConversations = useCallback(async () => {
    if (!userId) { setLoading(false); return }
    setLoading(true)
    try {
      const data = await storage.loadConversations()
      data.sort((a, b) => {
        if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      })
      setConversations(data)
    } catch (err) {
      console.error('Load conversations error:', err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  const createConversation = async (title = 'New Chat'): Promise<Conversation | null> => {
    if (!userId) return null
    try {
      const conv = await storage.createConversation(title)
      setConversations(prev => [conv, ...prev])
      return conv
    } catch (err) {
      console.error('Create conversation error:', err)
      return null
    }
  }

  const updateConversation = async (id: string, updates: Partial<Conversation>) => {
    try {
      await storage.updateConversation(id, updates)
      setConversations(prev =>
        prev.map(c => c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c)
      )
    } catch (err) {
      console.error('Update conversation error:', err)
    }
  }

  const deleteConversation = async (id: string) => {
    try {
      await storage.deleteConversation(id)
      setConversations(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      console.error('Delete conversation error:', err)
    }
  }

  const togglePin = async (id: string, isPinned: boolean) => {
    await updateConversation(id, { is_pinned: !isPinned })
  }

  const renameConversation = async (id: string, title: string) => {
    await updateConversation(id, { title })
  }

  return {
    conversations,
    loading,
    createConversation,
    updateConversation,
    deleteConversation,
    togglePin,
    renameConversation,
    refresh: fetchConversations,
  }
}
