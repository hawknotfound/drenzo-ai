export function friendlyChatError(raw: string): string {
  const r = raw.toLowerCase()

  // Network / connectivity
  if (r.includes('failed to fetch') || r.includes('networkerror') || r.includes('network request failed')) {
    return 'Network error — check your internet connection and try again.'
  }

  // Model unavailable
  if (r.includes('model is unavailable') || r.includes('model is not supported')) {
    return 'The AI model is temporarily unavailable. Try again in a few seconds.'
  }

  // Rate limit
  if (r.includes('rate limit') || r.includes('too many requests') || r.includes('429')) {
    return 'Rate limit hit — too many requests. Wait a moment and try again.'
  }

  // Auth / key issues
  if (r.includes('invalid api key') || r.includes('unauthorized') || r.includes('401') || r.includes('authentication')) {
    return 'Invalid API key — check your key in Settings → API Key.'
  }

  // No API key
  if (r.includes('no api key configured')) {
    return 'No API key set — add yours in Settings → API Key, or use the shared free tier.'
  }

  // Server / gateway errors
  if (r.includes('502') || r.includes('503') || r.includes('504') || r.includes('bad gateway') || r.includes('service unavailable')) {
    return 'Server is overloaded — try again in a few seconds.'
  }

  // Function crash
  if (r.includes('500') || r.includes('internal server error')) {
    return 'Something went wrong on our end — try again.'
  }

  // Timeout
  if (r.includes('timeout') || r.includes('timed out')) {
    return 'Request timed out — the server took too long. Try a shorter message.'
  }

  // SSE stream errors from the provider
  if (r.includes('opencode api error')) {
    // Extract the nested error if possible
    const match = r.match(/opencode api error:\s*(.*)/)
    const inner = match?.[1] || ''
    if (inner.includes('MissingSessionID')) {
      return 'Session error — refresh the page and try again.'
    }
    if (inner.includes('CreditsError') || inner.includes('payment method')) {
      return 'API key has no credits — check your account at opencode.ai/billing.'
    }
    if (inner.includes('FreeUsageLimitError') || inner.includes('rate limit exceeded')) {
      return 'Free tier rate limit hit — too many shared users. Add your own API key in Settings, or wait a few minutes.'
    }
    return 'AI provider returned an error — try again in a few seconds.'
  }

  // Direct rate limit errors
  if (r.includes('FreeUsageLimitError') || r.includes('rate limit exceeded')) {
    return 'Free tier rate limit hit — too many shared users. Add your own API key in Settings, or wait a few minutes.'
  }

  // Abort (user cancelled)
  if (r.includes('abort') || r.includes('aborted')) {
    return '' // silent — user cancelled intentionally
  }

  // Fallback
  return `Something went wrong — ${raw.slice(0, 120)}`
}
