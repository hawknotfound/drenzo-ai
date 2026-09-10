import { useState, useCallback } from 'react'
import type { AppSettings } from '@/types/settings'
import * as storage from '@/lib/google/storage'

export function useSettings(userId: string | undefined) {
  const [settings, setSettings] = useState<AppSettings>({ temperature: 0.7, max_tokens: 4096 })
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const data = await storage.loadSettings()
      setSettings({ temperature: data.temperature, max_tokens: data.max_tokens })
    } catch (err) {
      console.error('Load settings error:', err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  const loadSettings = load

  const updateSettings = useCallback(async (updates: Partial<AppSettings>) => {
    const newSettings = { ...settings, ...updates }
    setSettings(newSettings)
    try {
      await storage.saveSettings(updates)
    } catch (err) {
      console.error('Update settings error:', err)
    }
  }, [settings])

  return { settings, loading, loadSettings, updateSettings }
}
