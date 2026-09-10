import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Conversation } from '@/types/database'

export function useConversations(userId: string | undefined) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  const fetchConversations = useCallback(async (retries = 1) => {
    if (!userId) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', userId)
        .order('is_pinned', { ascending: false })
        .order('updated_at', { ascending: false })

      if (error) {
        // Retry on transient network errors (ERR_CONNECTION_CLOSED)
        if (retries > 0 && (error.message?.includes('Failed to fetch') || (error as any).code === 'NETWORK_ERROR')) {
          await new Promise(r => setTimeout(r, 1000))
          return fetchConversations(retries - 1)
        }
        console.error('Fetch conversations error:', error.message || error)
      } else if (data) setConversations(data)
    } catch (err: any) {
      if (retries > 0) {
        await new Promise(r => setTimeout(r, 1000))
        return fetchConversations(retries - 1)
      }
      console.error('Fetch conversations network error:', err?.message || err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  useEffect(() => {
    if (!userId) return
    const channel = supabase
      .channel('conversations-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversations', filter: `user_id=eq.${userId}` },
        () => { fetchConversations() }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId, fetchConversations])

  const createConversation = async (title = 'New Chat'): Promise<Conversation | null> => {
    if (!userId) return null
    const { data, error } = await supabase
      .from('conversations')
      .insert({ user_id: userId, title })
      .select()
      .single()

    if (error || !data) { console.error('Create conversation error:', error); return null }
    return data
  }

  const updateConversation = async (id: string, updates: Partial<Conversation>) => {
    const { error } = await supabase
      .from('conversations')
      .update(updates)
      .eq('id', id)

    if (error) console.error('Update conversation error:', error)
    else fetchConversations()
  }

  const deleteConversation = async (id: string) => {
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', id)

    if (error) console.error('Delete conversation error:', error)
    else fetchConversations()
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
