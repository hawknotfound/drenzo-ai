import type { VercelRequest, VercelResponse } from '@vercel/node'

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || 'Drenzo AI'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return res.status(500).json({ error: 'Cloudinary not configured' })
  }

  const { filenames } = req.body
  if (!filenames || !Array.isArray(filenames)) {
    return res.status(400).json({ error: 'filenames array required' })
  }

  const auth = Buffer.from(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`).toString('base64')

  const results: { filename: string; content: string; error?: string }[] = []

  for (const name of filenames) {
    try {
      const publicId = `${CLOUDINARY_FOLDER}/${name.replace(/\.md$/, '')}`
      const url = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/raw/upload/${publicId}.md`

      const response = await fetch(url, {
        headers: { Authorization: `Basic ${auth}` },
      })

      if (!response.ok) {
        results.push({ filename: name, content: '', error: `Not found (${response.status})` })
        continue
      }

      const content = await response.text()
      results.push({ filename: name, content })
    } catch (err) {
      results.push({ filename: name, content: '', error: String(err) })
    }
  }

  return res.json({ files: results })
}
