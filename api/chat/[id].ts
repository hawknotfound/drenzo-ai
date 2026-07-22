import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query
  const authHeader = req.headers.authorization

  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' })
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Conversation ID required' })

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
        .from('conversations')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()
      if (error) return res.status(404).json({ error: error.message })
      return res.json(data)
    }
    case 'PUT': {
      const { title, is_pinned } = req.body
      const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
      if (title !== undefined) updates.title = title
      if (is_pinned !== undefined) updates.is_pinned = is_pinned

      const { data, error } = await supabase
        .from('conversations')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()
      if (error) return res.status(500).json({ error: error.message })
      return res.json(data)
    }
    case 'DELETE': {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)
      if (error) return res.status(500).json({ error: error.message })
      return res.json({ success: true })
    }
    default:
      return res.status(405).json({ error: 'Method not allowed' })
  }
}
