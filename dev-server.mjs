// Dev server — runs Vercel API routes locally (avoids CORS)
// Run: node dev-server.mjs   (then in another terminal: npm run dev)

import { createServer } from 'http'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// ─── Load .env ─────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url))
function loadEnv() {
  try {
    const envPath = resolve(__dirname, '.env')
    const content = readFileSync(envPath, 'utf-8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue
      const [key, ...rest] = trimmed.split('=')
      const value = rest.join('=').replace(/^["']|["']$/g, '')
      if (!process.env[key]) process.env[key] = value
    }
  } catch {}
}
loadEnv()

const PORT = 3001
const OPENCODE_URL = process.env.VITE_OPENCODE_API_URL || 'https://opencode.ai/zen/v1'
const OPENCODE_KEY = process.env.VITE_OPENCODE_API_KEY
const OPENCODE_MODEL = process.env.VITE_OPENCODE_MODEL || 'deepseek-v4-flash-free'
const CLOUD_NAME = process.env.VITE_CLOUDINARY_CLOUD_NAME
const CLOUD_KEY = process.env.VITE_CLOUDINARY_API_KEY
const CLOUD_SECRET = process.env.CLOUDINARY_API_SECRET || process.env.VITE_CLOUDINARY_API_SECRET
const CLOUD_FOLDER = process.env.CLOUDINARY_FOLDER || 'Drenzo AI'

if (!OPENCODE_KEY) {
  console.error('Missing VITE_OPENCODE_API_KEY in .env')
  process.exit(1)
}

function json(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:5173' })
  res.end(JSON.stringify(data))
}

const server = createServer(async (req, res) => {
  // CORS for Vite dev server
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }

  const url = req.url || '/'
  let body = ''
  await new Promise(resolve => {
    req.on('data', chunk => body += chunk)
    req.on('end', resolve)
  })

  try {
    // ─── POST /api/chat ─────────────────────────
    if (url.startsWith('/api/chat') && req.method === 'POST') {
      const { messages, temperature, max_tokens } = JSON.parse(body)
      const response = await fetch(`${OPENCODE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENCODE_KEY}`,
        },
        body: JSON.stringify({
          model: OPENCODE_MODEL,
          messages,
          temperature: temperature ?? 0.7,
          max_tokens: max_tokens ?? 4096,
          stream: true,
        }),
      })

      if (!response.ok) {
        const err = await response.text()
        res.writeHead(response.status, { 'Access-Control-Allow-Origin': 'http://localhost:5173' })
        res.end(err)
        return
      }

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': 'http://localhost:5173',
      })

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        res.write(decoder.decode(value, { stream: true }))
      }
      res.write('data: [DONE]\n\n')
      res.end()
      return
    }

    // ─── GET /api/knowledge/list ────────────────
    if (url.startsWith('/api/knowledge/list') && req.method === 'GET') {
      if (!CLOUD_NAME || !CLOUD_KEY) {
        json(res, 500, { error: 'Cloudinary not configured' })
        return
      }
      const auth = Buffer.from(`${CLOUD_KEY}:${CLOUD_SECRET || ''}`).toString('base64')
      const apiUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/search?expression=folder="${CLOUD_FOLDER}"+AND+format=md&max_results=50`

      const response = await fetch(apiUrl, { headers: { Authorization: `Basic ${auth}` } })
      if (!response.ok) { json(res, 502, { error: `Cloudinary error: ${await response.text()}` }); return }

      const data = await response.json()
      const files = (data.resources || []).map(r => ({
        id: r.public_id,
        name: r.public_id.replace(`${CLOUD_FOLDER}/`, ''),
        format: r.format,
        size: r.bytes,
        created_at: r.created_at,
        updated_at: r.updated_at,
      }))
      json(res, 200, { files })
      return
    }

    // ─── POST /api/knowledge ────────────────────
    if (url.startsWith('/api/knowledge') && req.method === 'POST') {
      if (!CLOUD_NAME || !CLOUD_KEY) {
        json(res, 500, { error: 'Cloudinary not configured' })
        return
      }
      const { filenames } = JSON.parse(body)
      if (!Array.isArray(filenames)) { json(res, 400, { error: 'filenames array required' }); return }

      const auth = Buffer.from(`${CLOUD_KEY}:${CLOUD_SECRET || ''}`).toString('base64')
      const results = []

      for (const name of filenames) {
        try {
          const publicId = `${CLOUD_FOLDER}/${name.replace(/\.md$/, '')}`
          const url = `https://res.cloudinary.com/${CLOUD_NAME}/raw/upload/${publicId}.md`
          const response = await fetch(url, { headers: { Authorization: `Basic ${auth}` } })
          if (!response.ok) {
            results.push({ filename: name, content: '', error: `Not found (${response.status})` })
            continue
          }
          results.push({ filename: name, content: await response.text() })
        } catch (err) {
          results.push({ filename: name, content: '', error: String(err) })
        }
      }

      json(res, 200, { files: results })
      return
    }

    // ─── 404 ────────────────────────────────────
    json(res, 404, { error: 'Not found' })

  } catch (err) {
    json(res, 500, { error: String(err) })
  }
})

server.listen(PORT, () => {
  console.log(`\n  Dev API → http://localhost:${PORT}`)
  console.log(`  OpenCode model: ${OPENCODE_MODEL}`)
  console.log(`  Cloudinary folder: ${CLOUD_FOLDER}`)
  console.log(`  CORS origin: http://localhost:5173\n`)
})
