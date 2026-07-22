import { readFileSync, readdirSync, statSync } from 'fs'
import { join, relative, sep } from 'path'
import { createHash, createHmac } from 'crypto'

const SKILLS_DIR = 'C:\\Users\\shubh\\Documents\\opencode-data\\skills'
const CLOUD_NAME = 'dcbagjtsy'
const API_KEY = '227168975138771'
const API_SECRET = '31gG_n-YwUJnkRAOZDiGw17QUcY'
const FOLDER = 'Drenzo AI'

function sha1hex(data) {
  return createHash('sha1').update(data).digest('hex')
}

function signParams(params, secret) {
  const keys = Object.keys(params).sort()
  const str = keys.map(k => `${k}=${params[k]}`).join('&') + secret
  return sha1hex(str)
}

async function uploadFile(filePath, publicId) {
  const content = readFileSync(filePath)
  const ext = filePath.endsWith('.mjs') ? 'mjs' : filePath.endsWith('.py') ? 'py' : 'md'
  const timestamp = Math.floor(Date.now() / 1000)

  const params = {
    folder: FOLDER,
    public_id: publicId,
    timestamp,
  }

  const signature = signParams(params, API_SECRET)

  const form = new FormData()
  form.append('file', new Blob([content], { type: 'text/plain' }), publicId + '.' + ext)
  form.append('folder', FOLDER)
  form.append('public_id', publicId)
  form.append('resource_type', 'raw')
  form.append('api_key', API_KEY)
  form.append('timestamp', String(timestamp))
  form.append('signature', signature)

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`

  try {
    const res = await fetch(url, { method: 'POST', body: form })
    const data = await res.json()
    if (res.ok) {
      console.log(`  OK  ${publicId}`)
    } else {
      console.log(` FAIL ${publicId} — ${data.error?.message || res.statusText}`)
    }
    return data
  } catch (err) {
    console.log(` FAIL ${publicId} — ${err.message}`)
  }
}

function collectFiles(dir, baseDir = dir) {
  const results = []
  const entries = readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...collectFiles(fullPath, baseDir))
    } else if (
      entry.isFile() &&
      (entry.name.endsWith('.md') || entry.name.endsWith('.mjs') || entry.name.endsWith('.py'))
    ) {
      const rel = relative(baseDir, fullPath)
      const publicId = rel.replace(/\.[^.]+$/, '').replace(/\\/g, '/')
      results.push({ path: fullPath, publicId })
    }
  }
  return results
}

const files = collectFiles(SKILLS_DIR)
console.log(`Found ${files.length} files to upload\n`)

for (const f of files) {
  await uploadFile(f.path, f.publicId)
}

console.log('\nDone.')
