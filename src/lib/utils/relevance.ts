const KEYWORD_MAP: Record<string, string[]> = {
  '01-identity-origin': [
    'who are you', 'about', 'yourself', 'introduce', 'identity', 'name', 'shubham',
    'drenzo', 'origin', 'birth', 'background', 'personal', 'life story', 'lore',
    'history', 'nature', 'core', 'personality', 'mind', 'communicate', 'style',
    'taste', 'prefer', 'environment', 'space', 'health', 'body', 'sleep', 'routine'
  ],
  '02-philosophy-rules': [
    'philosophy', 'belief', 'value', 'principle', 'rule', 'non-negotiable',
    'constraint', 'limit', 'cannot', 'must not', 'forbidden', 'restriction',
    'mental model', 'think', 'reason', 'approach', 'logic', 'decision',
    'choose', 'option', 'decide', 'honest', 'quote', 'karma', 'meaning',
    'purpose', 'why', 'boundary', 'deal breaker', 'standard'
  ],
  '03-psychology-patterns': [
    'emotion', 'feel', 'feelings', 'mood', 'emotional', 'pattern', 'cycle',
    'behavior', 'habit', 'shadow', 'dark', 'hidden', 'suppress', 'defense',
    'protect', 'cope', 'mechanism', 'fear', 'scared', 'anxious', 'worry',
    'blindspot', 'blind', 'paradox', 'contradiction', 'strength', 'talent',
    'good at', 'strong', 'weakness', 'weak', 'improve', 'grow', 'attachment',
    'social', 'people', 'relationship', 'friend', 'inner child', 'childhood',
    'wound', 'past', 'conflict', 'argue', 'apology', 'maafi', 'forgive',
    'growth edge', 'psychology', 'mind', 'cognitive', 'mental', 'gussa',
    'angry', 'lonely', 'alone'
  ],
  '04-knowledge-projects': [
    'know', 'knowledge', 'information', 'learn', 'interest', 'curious',
    'project', 'drenzo', 'portfolio', 'work', 'build', 'create', 'quest',
    'adventure', 'skill', 'lesson', 'taught', 'experience', 'mistake',
    'error', 'fail', 'wrong', 'people', 'value', 'drain', 'friend', 'circle',
    'topic', 'explore', 'study', 'health goal'
  ],
  '05-life-growth': [
    'goal', 'aim', 'target', 'objective', 'ambition', 'future', 'next',
    'plan', 'ahead', 'dream', 'vision', 'life', 'growth', 'phase', 'age',
    'operating manual', 'wound', 'trauma', 'emergency', 'crisis', 'scroll',
    'comparison', 'tulna', 'isolat', 'alone', 'suicidal', 'dark thought',
    'gussa', 'anger', 'coping', 'tool', 'golden thread', 'survival',
    'decade', '2021', '2022', '2023', '2024', '2025', '2026', '2027',
    'current', 'teen', 'relationship', 'romantic', 'family', 'parents',
    'self-check', 'check-in', 'protocol', 'foundation'
  ],
  'brutal-web/SKILL': [
    '3d', 'three.js', 'r3f', 'react three fiber', 'spline', 'gsap', 'scrolltrigger',
    'webgl', '3d website', 'scroll animation', 'interactive website', 'particles',
    'web experience', 'apple website', 'product page', '3d model', 'webgl performance',
    'scroll-driven animation', 'video scrubbing', 'css scroll-timeline', 'draco compression',
    'offscreencanvas', 'frame sequence', 'lod', 'model-viewer'
  ],
  'drenzo-content-curator/SKILL': [
    'content quality', 'fake inspirational', 'generic filler', 'cringe content',
    'weak writing', 'content curation', 'quality check', 'content standard'
  ],
  'drenzo-identity-architect/SKILL': [
    'identity system', 'digital identity', 'brand identity', 'premium brand',
    'portfolio energy', 'identity architecture', 'personal brand'
  ],
  'drenzo-info-architect/SKILL': [
    'information architecture', 'content structure', 'navigation', 'hierarchy',
    'content cluster', 'information design', 'ia', 'content system'
  ],
  'drenzo-lore-keeper/SKILL': [
    'project continuity', 'lore', 'history', 'session context', 'project evolution',
    'historical decision', 'work session', 'knowledge preservation'
  ],
  'drenzo-mobile-engineer/SKILL': [
    'mobile', 'mobile-first', 'responsive', 'touch target', 'mobile performance',
    'mobile optimization', 'small screen', 'mobile layout', 'mobile ux',
    'touch interaction', 'mobile animation', 'mobile lag', 'mobile quality'
  ],
  'drenzo-no-filter/SKILL': [
    'brutal', 'no filter', 'savage', 'brutally honest', 'unfiltered',
    'raw truth', 'direct feedback', 'uncomfortable truth'
  ],
  'drenzo-philosophy-engine/SKILL': [
    'philosophy', 'meaning', 'deep', 'fake deep', 'motivation', 'inspirational',
    'philosophical', 'meaning-based', 'empty motivation', 'vague philosophy'
  ],
  'drenzo-systems-thinker/SKILL': [
    'systems thinking', 'reusable', 'scalable', 'architecture', 'operating system',
    'evolving system', 'ad hoc', 'one-off', 'system design'
  ],
  'rap-behavior/SKILL': [
    'rap', 'abap', 'behavior definition', 'bdef', 'validation', 'determination',
    'action', 'draft', 'authorization', 'side effect', 'business event',
    'feature control', 'eml', 'handler method', 'saver class', 'behavior implementation'
  ],
  'rap-cds/SKILL': [
    'cds view', 'cds', 'annotation', 'data model', 'view entity', 'projection view',
    'metadata extension', 'association', 'composition', 'value help', 'search help',
    'fiori ui', 'odata', 'abap cloud', 'btp'
  ],
  'rap-generator/SKILL': [
    'generate', 'rap bo', 'business object', 'scaffold', 'crud', 'service definition',
    'service binding', 'database table', 'cds root view', 'behavior implementation',
    'abap cloud', 'managed implementation', 'strict mode'
  ],
  'rap-testing/SKILL': [
    'unit test', 'test class', 'abap unit', 'test double', 'cl_botd', 'test validation',
    'test action', 'test determination', 'for testing', 'rap test'
  ],
  'rap-troubleshoot/SKILL': [
    'activation error', 'syntax error', 'runtime dump', 'rap error', 'odata error',
    'fiori error', 'draft not working', 'validation not triggered', 'determination not running',
    'behavior definition error', 'cds activation', 'eml error', 'dump'
  ],
  'vedic/SKILL': [
    'astrology', 'vedic', 'chart', 'horoscope', 'kundli', 'rasi', 'nakshatra',
    'planets', 'graha', 'houses', 'bhav', 'love astrology', 'career astrology',
    'time rectification', 'birth chart', 'natal chart', 'moon sign', 'sun sign',
    'rising sign', 'lagna', 'dasha', 'transit', 'yoga', 'manglik', 'compatibility',
    'synastry', 'relationship astrology', 'astrology reading', 'jyotish'
  ],
  'web-craft/SKILL': [
    'web development', 'frontend', 'ui design', 'ux design', 'motion design',
    'accessibility', 'wcag', 'core web vitals', 'tailwind', 'framer motion',
    'lenis', 'shadcn', 'design system', 'react', 'next.js', 'landing page',
    'web animation', 'responsive design', 'web performance'
  ],
  'vedic/resources/chart_reading_rules': [
    'chart reading', 'chart interpretation', 'reading rules', 'vedic chart analysis'
  ],
  'vedic/resources/data_contract': [
    'data contract', 'api contract', 'astrology data', 'data schema'
  ],
  'vedic/resources/event_house_map': [
    'event house', 'house mapping', 'bhava', 'house events', 'life events house'
  ],
  'vedic/resources/house_framework': [
    'house framework', 'bhava framework', 'house system', 'house interpretation'
  ],
  'vedic/resources/natal-report': [
    'natal report', 'birth chart report', 'janam kundli', 'natal analysis'
  ],
  'vedic/resources/synastry-report': [
    'synastry', 'compatibility report', 'relationship astrology', 'match making',
    'kundli matching', 'guna matching'
  ],
  'vedic/resources/predict-report': [
    'prediction', 'predictive astrology', 'future prediction', 'bhavishya'
  ],
  'vedic/resources/qa_rules': [
    'astrology qa', 'question answering', 'astrology rules', 'query rules'
  ],
  'vedic/resources/report_rules': [
    'report rules', 'astrology report', 'report format', 'astrology output'
  ],
  'vedic/resources/validation_rules': [
    'validation rules', 'astrology validation', 'chart validation', 'data validation'
  ],
  'vedic/resources/yogas': [
    'yoga', 'raj yoga', 'dhana yoga', 'planetary combination', 'graha yoga'
  ],
}

export function getRelevantFiles(message: string): string[] {
  const lower = message.toLowerCase()
  const matched = new Set<string>()

  for (const [file, keywords] of Object.entries(KEYWORD_MAP)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        matched.add(file)
        break
      }
    }
  }

  return Array.from(matched)
}
