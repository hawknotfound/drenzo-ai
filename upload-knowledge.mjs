// Upload 5 master knowledge files to Cloudinary
// Run: node upload-knowledge.mjs

import { createHash } from 'crypto'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const CLOUD_NAME = 'dcbagjtsy'
const API_KEY = '227168975138771'
const API_SECRET = '31gG_n-YwUJnkRAOZDiGw17QUcY'
const FOLDER = 'Drenzo AI'
const SOURCE_DIR = join(__dirname, 'knowledge-master')

const FILES = [
  '01-identity-origin.md',
  '02-philosophy-rules.md',
  '03-psychology-patterns.md',
  '04-knowledge-projects.md',
  '05-life-growth.md',
]

function signature(params, secret) {
  const sorted = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&')
  return createHash('sha1').update(sorted + secret).digest('hex')
}

async function upload(file) {
  const filePath = join(SOURCE_DIR, file)
  const publicId = file.replace(/\.md$/, '')
  const content = readFileSync(filePath, 'utf-8')
  const timestamp = Math.floor(Date.now() / 1000)

  const params = {
    folder: FOLDER,
    public_id: publicId,
    timestamp,
  }

  const sig = signature(params, API_SECRET)
  const form = new FormData()
  form.append('file', new Blob([content], { type: 'text/markdown' }), file)
  form.append('folder', FOLDER)
  form.append('public_id', publicId)
  form.append('api_key', API_KEY)
  form.append('timestamp', timestamp)
  form.append('signature', sig)

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`
  const res = await fetch(url, { method: 'POST', body: form })
  const data = await res.json()

  if (res.ok) {
    console.log(`  OK  ${file}  →  ${data.public_id}`)
  } else {
    console.error(`  FAIL  ${file}  →  ${data.error?.message || res.status}`)
  }
}

console.log(`Uploading ${FILES.length} files to Cloudinary folder "${FOLDER}"...\n`)
await Promise.all(FILES.map(upload))
console.log('\nDone.')
