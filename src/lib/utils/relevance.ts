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
