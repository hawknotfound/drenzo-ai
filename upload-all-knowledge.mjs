// Upload ALL knowledge + skill MD files to Cloudinary
// Run: node upload-all-knowledge.mjs
// Scans knowledge-master/, .agents/skills/, opencode-data/skills/
// Deduplicates, categorizes, and uploads with category prefix naming

import { createHash } from 'crypto'
import { readFileSync, readdirSync, statSync } from 'fs'
import { join, basename, relative } from 'path'

const CLOUD_NAME = 'dcbagjtsy'
const API_KEY = '227168975138771'
const API_SECRET = '31gG_n-YwUJnkRAOZDiGw17QUcY'
const FOLDER = 'Drenzo AI'

const PROJECT_ROOT = 'C:\\Users\\SnyX\\Documents\\drenzo-ai'
const AGENTS_SKILLS = 'C:\\Users\\SnyX\\.agents\\skills'
const OPENCODE_SKILLS = 'C:\\Users\\SnyX\\Documents\\opencode-data\\skills'

// ─── Category Mapping ────────────────────────────────────────────────
// Maps file paths/names to categories. Order matters for priority.

const CATEGORY_MAP = [
  {
    category: 'identity',
    match: (path, name) => {
      const p = path.toLowerCase()
      return p.includes('knowledge-master') && /^(01|02|03|04|05)-/.test(name)
    }
  },
  {
    category: 'knowledge',
    match: (path, name) => {
      const p = path.toLowerCase()
      return p.includes('knowledge-master') && /^(06|07|08|09|1[0-9]|2[0-6])-/.test(name)
    }
  },
  {
    category: 'astrology',
    match: (path, name) => {
      const p = path.toLowerCase()
      const n = name.toLowerCase()
      return n.includes('vedic') || n.includes('astrology') || n.includes('vedic-astro') ||
        n.includes('chart_reading') || n.includes('natal') || n.includes('synastry') ||
        n.includes('predict') || n.includes('house_') || n.includes('event_') ||
        n.includes('yoga') || n.includes('dasha') || n.includes('moon-phase') ||
        n.includes('qa_rules') || n.includes('report_rules') || n.includes('validation_rules') ||
        n.includes('data_contract') || n.includes('p1_p12') || n.includes('prediction_discipline') ||
        (n.includes('vedic') && p.includes('resources'))
    }
  },
  {
    category: 'drenzo',
    match: (path, name) => {
      const n = name.toLowerCase()
      return n.includes('drenzo-') || n.includes('drenzo_')
    }
  },
  {
    category: 'web',
    match: (path, name) => {
      const n = name.toLowerCase()
      return n.includes('web-craft') || n.includes('brutal-web') ||
        n.includes('webcraft') || n.includes('lets-scroll')
    }
  },
  {
    category: 'programming',
    match: (path, name) => {
      const n = name.toLowerCase()
      return n.includes('rap-') || n.includes('rap_') ||
        n.includes('code-security') || n.includes('test-driven') ||
        n.includes('test-fixing') || n.includes('mcp-builder') ||
        n.includes('skill-creator') || n.includes('skill-seekers') ||
        n.includes('skill-share') || n.includes('langsmith') ||
        n.includes('ios-simulator') || n.includes('playwright')
    }
  },
  {
    category: 'business',
    match: (path, name) => {
      const n = name.toLowerCase()
      return n.includes('lead-research') || n.includes('competitive-ads') ||
        n.includes('domain-name') || n.includes('invoice')
    }
  },
  {
    category: 'writing',
    match: (path, name) => {
      const n = name.toLowerCase()
      return n.includes('content-research') || n.includes('changelog') ||
        n.includes('tailored-resume') || n.includes('internal-comms') ||
        n.includes('article-extractor')
    }
  },
  {
    category: 'productivity',
    match: (path, name) => {
      const n = name.toLowerCase()
      return n.includes('git-pushing') || n.includes('file-organizer') ||
        n.includes('finishing-a-development') || n.includes('using-git-worktrees') ||
        n.includes('review-implementing') || n.includes('staff-engineer') ||
        n.includes('meeting-insights') || n.includes('developer-growth')
    }
  },
  {
    category: 'tools',
    match: (path, name) => {
      const n = name.toLowerCase()
      return n.includes('pdf') || n.includes('xlsx') || n.includes('pptx') ||
        n.includes('docx') || n.includes('video-downloader') || n.includes('youtube-transcript') ||
        n.includes('slack-gif') || n.includes('image-enhancer') || n.includes('raffle') ||
        n.includes('canvas-design') || n.includes('theme-factory') ||
        n.includes('brand-guidelines') || n.includes('lean-ctx') ||
        n.includes('brainstorming') || n.includes('ship-learn') ||
        n.includes('twitter-algorithm') || n.includes('webapp-testing')
    }
  },
]

function categorize(filePath, fileName) {
  for (const rule of CATEGORY_MAP) {
    if (rule.match(filePath, fileName)) return rule.category
  }
  return 'other'
}

// ─── File Discovery ──────────────────────────────────────────────────

function walkDir(dir, pattern) {
  const results = []
  try {
    const entries = readdirSync(dir)
    for (const entry of entries) {
      const full = join(dir, entry)
      try {
        const st = statSync(full)
        if (st.isDirectory()) {
          results.push(...walkDir(full, pattern))
        } else if (entry.endsWith('.md') && !full.includes('node_modules')) {
          results.push(full)
        }
      } catch {}
    }
  } catch {}
  return results
}

function scanSources() {
  const files = []

  // 1. knowledge-master/
  const kmFiles = walkDir(join(PROJECT_ROOT, 'knowledge-master'))
  for (const f of kmFiles) {
    const name = basename(f).replace(/\.md$/, '')
    const cat = categorize(f, name)
    files.push({ source: 'knowledge-master', path: f, name, category: cat })
  }

  // 2. .agents/skills/ (SKILL.md files + supplementary docs)
  const agentSkills = walkDir(AGENTS_SKILLS)
  for (const f of agentSkills) {
    const name = basename(f).replace(/\.md$/, '')
    const relPath = relative(AGENTS_SKILLS, f)
    // Create a clean name from the relative path
    const cleanName = relPath.replace(/\\/g, '/').replace(/\.md$/, '')
    const cat = categorize(f, cleanName)
    files.push({ source: '.agents/skills', path: f, name: cleanName, category: cat })
  }

  // 3. opencode-data/skills/ (SKILL.md + supplementary docs, skip node_modules)
  const opencodeSkills = walkDir(OPENCODE_SKILLS)
  for (const f of opencodeSkills) {
    if (f.includes('node_modules')) continue
    const name = basename(f).replace(/\.md$/, '')
    const relPath = relative(OPENCODE_SKILLS, f)
    const cleanName = relPath.replace(/\\/g, '/').replace(/\.md$/, '')
    const cat = categorize(f, cleanName)
    files.push({ source: 'opencode-data/skills', path: f, name: cleanName, category: cat })
  }

  return files
}

// ─── Deduplication ───────────────────────────────────────────────────

function deduplicate(files) {
  const seen = new Map() // category--name -> file entry
  const unique = []

  for (const file of files) {
    const uploadName = `${file.category}--${file.name}`
    if (!seen.has(uploadName)) {
      seen.set(uploadName, file)
      unique.push({ ...file, uploadName })
    }
  }

  return unique
}

// ─── Cloudinary Upload ───────────────────────────────────────────────

function signature(params, secret) {
  const sorted = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&')
  return createHash('sha1').update(sorted + secret).digest('hex')
}

async function uploadFile(file) {
  const filePath = file.path
  const publicId = file.uploadName
  const content = readFileSync(filePath, 'utf-8')
  const timestamp = Math.floor(Date.now() / 1000)

  const params = {
    folder: FOLDER,
    public_id: publicId,
    timestamp,
  }

  const sig = signature(params, API_SECRET)
  const form = new FormData()
  form.append('file', new Blob([content], { type: 'text/markdown' }), basename(filePath))
  form.append('folder', FOLDER)
  form.append('public_id', publicId)
  form.append('api_key', API_KEY)
  form.append('timestamp', String(timestamp))
  form.append('signature', sig)

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`
  const res = await fetch(url, { method: 'POST', body: form })
  const data = await res.json()

  return { file: file.uploadName, ok: res.ok, error: data.error?.message, status: res.status }
}

// ─── Check Existing Files ────────────────────────────────────────────

async function getExistingFiles() {
  const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64')
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/search?expression=folder="${FOLDER}"+AND+format=md&max_results=500`

  const res = await fetch(url, {
    headers: { Authorization: `Basic ${auth}` }
  })

  if (!res.ok) return new Set()

  const data = await res.json()
  const existing = new Set()
  for (const r of (data.resources || [])) {
    // Extract the public_id without folder prefix
    const name = r.public_id.replace(`${FOLDER}/`, '')
    existing.add(name)
  }
  return existing
}

// ─── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log('🔍 Scanning sources...\n')

  const allFiles = scanSources()
  console.log(`  Found ${allFiles.length} total files`)

  const uniqueFiles = deduplicate(allFiles)
  console.log(`  After dedup: ${uniqueFiles.length} unique files`)

  // Category breakdown
  const catCounts = {}
  for (const f of uniqueFiles) {
    catCounts[f.category] = (catCounts[f.category] || 0) + 1
  }
  console.log('\n  Categories:')
  for (const [cat, count] of Object.entries(catCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`    ${cat}: ${count}`)
  }

  console.log('\n📡 Checking existing files in Cloudinary...')
  const existing = await getExistingFiles()
  console.log(`  ${existing.size} files already uploaded`)

  const toUpload = uniqueFiles.filter(f => !existing.has(f.uploadName))
  console.log(`  ${toUpload.length} new files to upload\n`)

  if (toUpload.length === 0) {
    console.log('✅ Everything already uploaded!')
    return
  }

  console.log('⬆️  Uploading...\n')

  let success = 0
  let failed = 0

  for (let i = 0; i < toUpload.length; i++) {
    const file = toUpload[i]
    const result = await uploadFile(file)

    if (result.ok) {
      success++
      console.log(`  ✅ [${i + 1}/${toUpload.length}] ${file.uploadName}`)
    } else {
      failed++
      console.log(`  ❌ [${i + 1}/${toUpload.length}] ${file.uploadName} → ${result.error}`)
    }

    // Rate limit: 200ms between uploads
    if (i < toUpload.length - 1) {
      await new Promise(r => setTimeout(r, 200))
    }
  }

  console.log(`\n📊 Results: ${success} uploaded, ${failed} failed, ${existing.size} already existed`)
  console.log('✅ Done!')
}

main().catch(err => {
  console.error('❌ Fatal error:', err.message)
  process.exit(1)
})
