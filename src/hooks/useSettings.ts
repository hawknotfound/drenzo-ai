import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { AppSettings } from '@/types/settings'

const DEFAULTS: AppSettings = {
  theme: 'dark',
  model: 'deepseek-v4-flash-free',
  temperature: 0.7,
  max_tokens: 4096,
}

export function useSettings(userId: string | undefined) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          setSettings({
            theme: data.theme,
            model: data.model,
            temperature: data.temperature,
            max_tokens: data.max_tokens,
          })
        }
        setLoading(false)
      })
  }, [userId])

  const updateSettings = useCallback(async (updates: Partial<AppSettings>) => {
    if (!userId) return
    const newSettings = { ...settings, ...updates }
    setSettings(newSettings)

    const { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        ...newSettings,
      }, { onConflict: 'user_id' })

    if (error) console.error('Update settings error:', error)
  }, [userId, settings])

  return { settings, loading, updateSettings }
}
