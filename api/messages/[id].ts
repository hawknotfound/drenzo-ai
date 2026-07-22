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

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true })

  if (error) return res.status(500).json({ error: error.message })
  return res.json(data)
}
