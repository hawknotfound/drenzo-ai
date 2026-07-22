const KEYWORD_MAP: Record<string, string[]> = {
  'about-me': ['who are you', 'about', 'yourself', 'introduce'],
  identity: ['identity', 'who am i', 'self'],
  rules: ['rule', 'constraint', 'limit', 'cannot', 'must not', 'forbidden', 'restriction'],
  'communication-style': ['communication', 'talk', 'speak', 'conversation'],
  'operating-system': ['operating system', 'how you work', 'system', 'framework'],
  knowledge: ['know', 'knowledge', 'information', 'fact', 'general', 'tell me about'],
  'mental-models': ['mental model', 'think', 'reason', 'approach', 'logic', 'framework'],
  projects: ['project', 'drenzo', 'portfolio', 'work', 'case study'],
  philosophy: ['philosophy', 'meaning', 'purpose', 'belief', 'why'],
  patterns: ['pattern', 'habit', 'behavior', 'cycle'],
  'emotional-patterns': ['emotion', 'feel', 'mood', 'emotional'],
  'social-patterns': ['social', 'people', 'relationship', 'friend'],
  psychology: ['psychology', 'mind', 'cognitive', 'mental'],
  'defense-mechanisms': ['defense', 'protect', 'cope', 'mechanism'],
  'inner-child': ['inner child', 'childhood', 'past', 'wound'],
  beliefs: ['believe', 'belief', 'value', 'principle'],
  shadow: ['shadow', 'dark', 'hidden', 'suppress'],
  strengths: ['strength', 'good at', 'strong', 'talent'],
  weaknesses: ['weakness', 'weak', 'improve', 'grow'],
  goals: ['goal', 'aim', 'target', 'objective', 'ambition'],
  future: ['future', 'next', 'plan', 'ahead'],
  fears: ['fear', 'scared', 'anxious', 'worry'],
  decisions: ['decision', 'choose', 'choice', 'option', 'decide'],
  'mind-games': ['mind game', 'trick', 'manipulate', 'game'],
  conflict: ['conflict', 'argue', 'fight', 'disagree'],
  'pain-and-justice': ['pain', 'justice', 'suffer', 'unfair', 'hurt'],
  memory: ['memory', 'remember', 'recall', 'past'],
  taste: ['taste', 'prefer', 'like', 'aesthetic'],
  'non-negotiables': ['non-negotiable', 'must have', 'deal breaker', 'boundary'],
  mistakes: ['mistake', 'error', 'fail', 'wrong', 'lesson'],
  lessons: ['lesson', 'learn', 'taught', 'experience'],
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
