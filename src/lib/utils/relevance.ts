// Category-based knowledge routing
// Maps user queries → categories → top files per category

interface CategoryRule {
  category: string
  keywords: string[]
  priority: number  // lower = higher priority
  maxFiles: number  // max files to inject from this category
}

const CATEGORIES: CategoryRule[] = [
  {
    category: 'identity',
    keywords: [
      'who are you', 'about', 'yourself', 'introduce', 'identity', 'name', 'shubham',
      'drenzo', 'origin', 'birth', 'background', 'personal', 'life story', 'lore',
      'history', 'created', 'built', 'maker', 'founder', 'father'
    ],
    priority: 1,
    maxFiles: 2,
  },
  {
    category: 'astrology',
    keywords: [
      'astrology', 'vedic', 'chart', 'horoscope', 'kundli', 'rasi', 'nakshatra',
      'planets', 'graha', 'houses', 'bhav', 'love astrology', 'career astrology',
      'time rectification', 'birth chart', 'natal chart', 'moon sign', 'sun sign',
      'rising sign', 'lagna', 'dasha', 'transit', 'yoga', 'manglik', 'compatibility',
      'synastry', 'relationship astrology', 'jyotish', 'zodiac', 'ascendant',
      'date of birth', 'time of birth', 'place of birth', 'kundli matching'
    ],
    priority: 2,
    maxFiles: 4,
  },
  {
    category: 'drenzo',
    keywords: [
      'drenzo brand', 'drenzo identity', 'drenzo philosophy', 'drenzo system',
      'content quality', 'fake inspirational', 'cringe', 'identity system',
      'digital identity', 'brand identity', 'information architecture',
      'content structure', 'project continuity', 'lore keeper', 'mobile first',
      'mobile optimization', 'no filter', 'brutal honest', 'systems thinking'
    ],
    priority: 3,
    maxFiles: 3,
  },
  {
    category: 'web',
    keywords: [
      'web development', 'frontend', 'ui design', 'ux design', 'motion design',
      'accessibility', 'wcag', 'core web vitals', 'tailwind', 'framer motion',
      'lenis', 'shadcn', 'design system', 'react', 'next.js', 'landing page',
      'web animation', 'responsive design', 'web performance', '3d', 'three.js',
      'r3f', 'react three fiber', 'spline', 'gsap', 'scrolltrigger', 'webgl',
      '3d website', 'scroll animation', 'interactive website', 'particles',
      'web experience', 'product page', 'scroll-driven animation', 'css scroll-timeline'
    ],
    priority: 4,
    maxFiles: 3,
  },
  {
    category: 'programming',
    keywords: [
      'programming', 'code', 'coding', 'developer', 'software', 'api', 'backend',
      'database', 'algorithm', 'data structure', 'function', 'class', 'variable',
      'debug', 'error', 'bug', 'git', 'github', 'repository', 'commit', 'push',
      'deploy', 'server', 'cloud', 'docker', 'kubernetes', 'testing', 'unit test',
      'integration test', 'tdd', 'test driven', 'abap', 'rap', 'bdef', 'cds view',
      'sap', 'btp', 'fiori', 'odata', 'eml', 'behavior definition',
      'mcp', 'model context protocol', 'playwright', 'browser automation'
    ],
    priority: 5,
    maxFiles: 3,
  },
  {
    category: 'business',
    keywords: [
      'business', 'startup', 'entrepreneur', 'revenue', 'profit', 'marketing',
      'brand', 'branding', 'sales', 'customer', 'client', 'pitch', 'investor',
      'funding', 'growth strategy', 'market', 'competitor', 'pricing', 'monetize',
      'lead generation', 'lead research', 'domain name', 'invoice'
    ],
    priority: 6,
    maxFiles: 2,
  },
  {
    category: 'writing',
    keywords: [
      'writing', 'write', 'blog', 'article', 'content', 'copywriting', 'essay',
      'story', 'narrative', 'changelog', 'release notes', 'resume', 'cv',
      'documentation', 'technical writing', 'seo', 'headline', 'hook'
    ],
    priority: 7,
    maxFiles: 2,
  },
  {
    category: 'productivity',
    keywords: [
      'productivity', 'workflow', 'automation', '效率', 'organize', 'file management',
      'git workflow', 'branch', 'pull request', 'code review', 'meeting',
      'calendar', 'schedule', 'time management', 'habit', 'routine', 'focus'
    ],
    priority: 8,
    maxFiles: 2,
  },
  {
    category: 'tools',
    keywords: [
      'pdf', 'spreadsheet', 'excel', 'powerpoint', 'presentation', 'document',
      'video download', 'youtube', 'transcript', 'gif', 'slack', 'image',
      'enhance', 'image quality', 'theme', 'color scheme', 'brainstorm'
    ],
    priority: 9,
    maxFiles: 2,
  },
  {
    category: 'knowledge',
    keywords: [
      'personality', 'psychology', 'human behavior', 'dark psychology',
      'artificial intelligence', 'ai', 'machine learning', 'prompt engineering',
      'system design', 'architecture', 'learning', 'study', 'education',
      'philosophy', 'decision making', 'communication', 'research', 'science',
      'cognitive', 'mental model', 'decision', 'choose', 'strategy'
    ],
    priority: 10,
    maxFiles: 3,
  },
]

// Score a message against a category
function scoreCategory(message: string, rule: CategoryRule): number {
  const lower = message.toLowerCase()
  let score = 0

  for (const keyword of rule.keywords) {
    if (lower.includes(keyword)) {
      // Exact match gets more weight
      score += keyword.length > 4 ? 2 : 1
    }
  }

  return score
}

// Get matching categories sorted by score
function getMatchingCategories(message: string): CategoryRule[] {
  const scored: { rule: CategoryRule; score: number }[] = []

  for (const rule of CATEGORIES) {
    const score = scoreCategory(message, rule)
    if (score > 0) {
      scored.push({ rule, score })
    }
  }

  // Sort by score descending, then by priority ascending
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return a.rule.priority - b.rule.priority
  })

  return scored.map(s => s.rule)
}

// Main function: returns list of file names to load
export function getRelevantFiles(message: string): string[] {
  const matchedCategories = getMatchingCategories(message)

  // If no category matches, return identity files as fallback
  if (matchedCategories.length === 0) {
    const identityRule = CATEGORIES.find(c => c.category === 'identity')!
    return getFilesForCategory('identity', identityRule.maxFiles)
  }

  // Collect files from matched categories, respecting maxFiles limit
  // Total cap: ~8 files max to keep token budget reasonable
  const result: string[] = []
  const MAX_TOTAL = 8

  for (const rule of matchedCategories) {
    if (result.length >= MAX_TOTAL) break
    const catFiles = getFilesForCategory(rule.category, rule.maxFiles)
    for (const f of catFiles) {
      if (result.length >= MAX_TOTAL) break
      result.push(f)
    }
  }

  return result
}

// Get file names for a category (will be resolved against Cloudinary lookup)
function getFilesForCategory(category: string, maxFiles: number): string[] {
  // These are the upload names (category--name) that will exist in Cloudinary
  // The cloudinary service will resolve these via the lookup map
  const categoryFiles: Record<string, string[]> = {
    identity: [
      'identity--01-identity-origin',
      'identity--02-philosophy-rules',
      'identity--03-psychology-patterns',
      'identity--04-knowledge-projects',
      'identity--05-life-growth',
    ],
    knowledge: [
      'knowledge--06-personality',
      'knowledge--07-psychology',
      'knowledge--08-human-behavior',
      'knowledge--09-dark-psychology',
      'knowledge--10-artificial-intelligence',
      'knowledge--11-prompt-engineering',
      'knowledge--12-programming',
      'knowledge--13-react',
      'knowledge--14-system-design',
      'knowledge--15-business',
      'knowledge--16-branding',
      'knowledge--17-marketing',
      'knowledge--18-writing',
      'knowledge--19-uiux',
      'knowledge--20-productivity',
      'knowledge--21-learning',
      'knowledge--22-philosophy',
      'knowledge--23-decision-making',
      'knowledge--24-communication',
      'knowledge--25-astrology',
      'knowledge--26-research',
      'knowledge--01-capabilities-thinking-writing',
      'knowledge--02-capabilities-programming-tech',
      'knowledge--03-capabilities-business-creative',
      'knowledge--04-capabilities-science-general',
    ],
    astrology: [
      'astrology--vedic/SKILL',
      'astrology--vedic/resources/chart_reading_rules',
      'astrology--vedic/resources/data_contract',
      'astrology--vedic/resources/event_house_map',
      'astrology--vedic/resources/house_framework',
      'astrology--vedic/resources/natal-report',
      'astrology--vedic/resources/synastry-report',
      'astrology--vedic/resources/predict-report',
      'astrology--vedic/resources/qa_rules',
      'astrology--vedic/resources/report_rules',
      'astrology--vedic/resources/validation_rules',
      'astrology--vedic/resources/yogas',
      'astrology--vedic/resources/p1_p12',
      'astrology--vedic/resources/prediction_discipline',
      'astrology--vedic/resources/moon-phase-report',
      'astrology--vedic-astro/SKILL',
      'astrology--astrology-skill/SKILL',
      'astrology--25-astrology',
    ],
    drenzo: [
      'drenzo--drenzo-content-curator/SKILL',
      'drenzo--drenzo-identity-architect/SKILL',
      'drenzo--drenzo-info-architect/SKILL',
      'drenzo--drenzo-lore-keeper/SKILL',
      'drenzo--drenzo-mobile-engineer/SKILL',
      'drenzo--drenzo-no-filter/SKILL',
      'drenzo--drenzo-philosophy-engine/SKILL',
      'drenzo--drenzo-systems-thinker/SKILL',
    ],
    web: [
      'web--web-craft/SKILL',
      'web--brutal-web/SKILL',
      'web--lets-scroll/SKILL',
      'web--19-uiux',
    ],
    programming: [
      'programming--rap-behavior/SKILL',
      'programming--rap-cds/SKILL',
      'programming--rap-generator/SKILL',
      'programming--rap-testing/SKILL',
      'programming--rap-troubleshoot/SKILL',
      'programming--code-security-auditor/SKILL',
      'programming--test-driven-development/SKILL',
      'programming--test-fixing/SKILL',
      'programming--mcp-builder/SKILL',
      'programming--playwright-skill/SKILL',
      'programming--skill-creator/SKILL',
      'programming--ios-simulator-skill/SKILL',
      'programming--langsmith-fetch/SKILL',
    ],
    business: [
      'business--lead-research-assistant/SKILL',
      'business--competitive-ads-extractor/SKILL',
      'business--domain-name-brainstormer/SKILL',
      'business--15-business',
      'business--16-branding',
      'business--17-marketing',
    ],
    writing: [
      'writing--content-research-writer/SKILL',
      'writing--changelog-generator/SKILL',
      'writing--tailored-resume-generator/SKILL',
      'writing--internal-comms/SKILL',
      'writing--article-extractor/SKILL',
      'writing--18-writing',
    ],
    productivity: [
      'productivity--git-pushing/SKILL',
      'productivity--file-organizer/SKILL',
      'productivity--finishing-a-development-branch/SKILL',
      'productivity--using-git-worktrees/SKILL',
      'productivity--review-implementing/SKILL',
      'productivity--staff-engineer-review/SKILL',
      'productivity--meeting-insights-analyzer/SKILL',
      'productivity--developer-growth-analysis/SKILL',
      'productivity--20-productivity',
    ],
    tools: [
      'tools--pdf/SKILL',
      'tools--xlsx/SKILL',
      'tools--pptx/SKILL',
      'tools--docx/SKILL',
      'tools--video-downloader/SKILL',
      'tools--youtube-transcript/SKILL',
      'tools--slack-gif-creator/SKILL',
      'tools--image-enhancer/SKILL',
      'tools--raffle-winner-picker/SKILL',
      'tools--canvas-design/SKILL',
      'tools--theme-factory/SKILL',
      'tools--brand-guidelines/SKILL',
      'tools--lean-ctx/SKILL',
      'tools--brainstorming/SKILL',
      'tools--ship-learn-next/SKILL',
      'tools--twitter-algorithm-optimizer/SKILL',
      'tools--webapp-testing/SKILL',
    ],
  }

  const files = categoryFiles[category] || []
  return files.slice(0, maxFiles)
}
