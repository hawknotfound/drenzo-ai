import type { VercelRequest, VercelResponse } from '@vercel/node'

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || 'Drenzo AI'

interface CloudinaryResource {
  public_id: string
  format: string
  bytes: number
  created_at: string
  updated_at: string
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return res.status(500).json({ error: 'Cloudinary not configured' })
  }

  const auth = Buffer.from(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`).toString('base64')
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/search?expression=folder="${CLOUDINARY_FOLDER}"+AND+format=md&max_results=50`

  try {
    const response = await fetch(url, { headers: { Authorization: `Basic ${auth}` } })
    if (!response.ok) {
      const err = await response.text()
      return res.status(502).json({ error: `Cloudinary error: ${err}` })
    }

    const data = await response.json()
    const files = (data.resources as CloudinaryResource[] || []).map((r) => ({
      id: r.public_id,
      name: r.public_id.replace(`${CLOUDINARY_FOLDER}/`, ''),
      format: r.format,
      size: r.bytes,
      created_at: r.created_at,
      updated_at: r.updated_at,
    }))

    return res.json({ files })
  } catch (err) {
    return res.status(500).json({ error: String(err) })
  }
}
