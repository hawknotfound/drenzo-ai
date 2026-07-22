export function WelcomeScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-16 h-16 rounded-2xl bg-neutral-800 flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-neutral-100" viewBox="0 0 32 32" fill="none">
          <rect x="8" y="10" width="4" height="12" rx="1" fill="currentColor" opacity="0.9"/>
          <rect x="14" y="10" width="4" height="12" rx="1" fill="currentColor" opacity="0.6"/>
          <rect x="20" y="10" width="4" height="12" rx="1" fill="currentColor" opacity="0.3"/>
        </svg>
      </div>
      <h1 className="text-2xl font-semibold text-neutral-100 mb-2">Drenzo AI</h1>
      <p className="text-sm text-neutral-500 text-center max-w-sm">
        Your intelligent assistant. Start a conversation below.
      </p>
    </div>
  )
}
