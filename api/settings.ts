import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' })

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) return res.status(401).json({ error: 'Invalid token' })

  switch (req.method) {
    case 'GET': {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        return res.status(500).json({ error: error.message })
      }
      return res.json(data || { theme: 'dark', model: 'deepseek-v4-flash-free', temperature: 0.7, max_tokens: 4096 })
    }
    case 'PUT': {
      const { theme, model, temperature, max_tokens } = req.body
      const { data, error } = await supabase
        .from('user_settings')
        .upsert({ user_id: user.id, theme, model, temperature, max_tokens, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
        .select()
        .single()
      if (error) return res.status(500).json({ error: error.message })
      return res.json(data)
    }
    default:
      return res.status(405).json({ error: 'Method not allowed' })
  }
}
