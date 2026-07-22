const KEYWORD_MAP: Record<string, string[]> = {
  personality: ['personality', 'tone', 'voice', 'character', 'vibe', 'you are', 'who are you'],
  rules: ['rule', 'constraint', 'limit', 'cannot', 'must not', 'forbidden', 'restriction'],
  'writing-style': ['write', 'style', 'format', 'response format', 'language', 'grammar'],
  'thinking-style': ['think', 'reason', 'approach', 'problem solving', 'analysis', 'logic'],
  knowledge: ['know', 'knowledge', 'information', 'fact', 'general'],
  projects: ['project', 'drenzo', 'portfolio', 'work', 'case study'],
  coding: ['code', 'programming', 'function', 'bug', 'debug', 'react', 'typescript'],
  psychology: ['psychology', 'behavior', 'motivation', 'mindset', 'cognitive'],
  business: ['business', 'startup', 'revenue', 'market', 'strategy', 'client'],
  prompts: ['prompt', 'instruction', 'command', 'guide'],
  documentation: ['doc', 'manual', 'reference', 'api', 'how to'],
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
