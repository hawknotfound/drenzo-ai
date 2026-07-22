import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const hasKeys = !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
  return res.json({
    configured: hasKeys,
    supabase_url: process.env.SUPABASE_URL ? 'configured' : 'missing',
  })
}
