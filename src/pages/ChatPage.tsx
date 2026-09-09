import { useState, useCallback, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuthContext } from '@/providers/AuthProvider'
import { useConversations } from '@/hooks/useConversations'
import { useChat } from '@/hooks/useChat'
import { useInstructions } from '@/hooks/useInstructions'
import { BackgroundOrbs } from '@/components/ui-new/BackgroundOrbs'
import { Sidebar } from '@/components/ui-new/Sidebar'
import { TopBar } from '@/components/ui-new/TopBar'
import { HeroState } from '@/components/ui-new/HeroState'
import { ChatTimeline } from '@/components/ui-new/ChatTimeline'
import { SearchModal } from '@/components/ui-new/SearchModal'
import { SettingsModal } from '@/components/ui-new/SettingsModal'
import { isFounder } from '@/lib/config'
import { LanguageSwitch } from '@/components/ui-new/LanguageSwitch'
import { LogIn, UserPlus, MessageSquare, PanelLeft, Plus, Settings, KeyRound, X, AlertCircle, RefreshCw, Sparkles, Keyboard, Zap } from 'lucide-react'

const USER_API_KEY_STORAGE = 'drenzo_user_api_key'
const API_KEY_BANNER_DISMISSED = 'drenzo_api_key_banner_dismissed'

interface ChatPageProps {
  isGuest?: boolean
  onExitGuest?: () => void
}

const ONBOARDING_KEY = 'drenzo_onboarding_seen'

export function ChatPage({ isGuest, onExitGuest }: ChatPageProps) {
  const { user, signOut } = useAuthContext()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [inputText, setInputText] = useState('')

  const [language, setLanguage] = useState<'english' | 'hinglish'>('english')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (isGuest) return false
    return !localStorage.getItem(ONBOARDING_KEY)
  })
  const [showApiKeyBanner, setShowApiKeyBanner] = useState(() => {
    if (isGuest) return false
    try {
      if (localStorage.getItem(USER_API_KEY_STORAGE)) return false
      if (localStorage.getItem(API_KEY_BANNER_DISMISSED)) return false
    } catch {}
    return true
  })

  const guestConvId = useRef(isGuest ? crypto.randomUUID() : null)

  const {
    conversations,
    loading: _convsLoading,
    createConversation,
    deleteConversation,
    renameConversation,
    togglePin,
  } = useConversations(user?.id)

  const instructionsApi = useInstructions(user?.id)

  const {
    messages,
    isStreaming,
    thinking,
    error,
    limitReached,
    guestLimitReached,
    guestMessagesUsed,
    loadMessages,
    sendMessage,
    regenerate,
    clearError,
    editAndResend,
  } = useChat(isGuest ? guestConvId.current : activeConversationId, !!isGuest, language, instructionsApi.activeInstruction?.content)

  const handleNewChat = useCallback(async () => {
    setInputText('')
    if (isGuest) {
      guestConvId.current = crypto.randomUUID()
      setActiveConversationId(null)
      return
    }
    const conv = await createConversation()
    if (conv) setActiveConversationId(conv.id)
  }, [createConversation, isGuest])
  const handleSelectConversation = useCallback((id: string) => {
    setInputText('')
    setActiveConversationId(id)
    loadMessages(id)
  }, [loadMessages])
  const handleDeleteConversation = useCallback(async (id: string) => {
    await deleteConversation(id)
    if (activeConversationId === id) setActiveConversationId(null)
  }, [deleteConversation, activeConversationId])

  const handleSendMessage = useCallback(async (text: string) => {
    if (isGuest) {
      if (!guestConvId.current) guestConvId.current = crypto.randomUUID()
      sendMessage(text, guestConvId.current)
      return
    }
    if (!activeConversationId) {
      const title = text.length > 55 ? text.slice(0, 52) + '...' : text
      const conv = await createConversation(title)
      if (conv) {
        sendMessage(text, conv.id)
        setActiveConversationId(conv.id)
        return
      }
    }
    sendMessage(text)
  }, [activeConversationId, createConversation, sendMessage, isGuest])

  const handlePromptSuggestion = (promptText: string) => {
    setInputText(promptText)
  }

  const handleDismissOnboarding = useCallback(() => {
    setShowOnboarding(false)
    localStorage.setItem(ONBOARDING_KEY, 'true')
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.key === 'k') {
        e.preventDefault()
        if (!isGuest) setIsSearchOpen(prev => !prev)
      }
      if (mod && e.shiftKey && e.key === ',') {
        e.preventDefault()
        setIsSettingsOpen(prev => !prev)
      }
      if (mod && e.key === 'n') {
        e.preventDefault()
        handleNewChat()
      }
      if (e.key === 'Escape') {
        if (isSearchOpen) setIsSearchOpen(false)
        else if (isSettingsOpen) setIsSettingsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isGuest, isSearchOpen, isSettingsOpen, handleNewChat])

  useEffect(() => {
    if (!showApiKeyBanner) return
    const handler = () => {
      try {
        if (localStorage.getItem(USER_API_KEY_STORAGE)) {
          setShowApiKeyBanner(false)
        }
      } catch {}
    }
    window.addEventListener('drenzo-apikey-saved', handler)
    return () => window.removeEventListener('drenzo-apikey-saved', handler)
  }, [showApiKeyBanner])

  const hasConversation = (isGuest ? messages.length > 0 : activeConversationId && messages.length > 0)
  const guestRemaining = Math.max(0, 3 - guestMessagesUsed)
  const userEmail = user?.email
  const isFounderUser = isFounder(userEmail)

  const activeConv = conversations.find(c => c.id === activeConversationId)
  const conversationTitle = activeConv?.title

  return (
    <div className="h-screen flex bg-[#090b10] overflow-hidden relative">
      <BackgroundOrbs />

      <div className="relative z-10 flex w-full h-full">
        {!isGuest && (
          <Sidebar
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            onNewChat={handleNewChat}
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={handleSelectConversation}
            onDeleteConversation={handleDeleteConversation}
            onRenameConversation={renameConversation}
            onTogglePin={togglePin}
          />
        )}

        <div className="flex flex-col flex-1 min-w-0">
          {!isGuest && (
            <TopBar
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenSearch={() => setIsSearchOpen(true)}
              conversationTitle={conversationTitle}
              isGuest={isGuest}
            />
          )}

          {/* Guest mode banner */}
          {isGuest && !guestLimitReached && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-3 sm:px-4 py-2.5 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10 border-b border-blue-500/20 text-center flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <p className="text-xs text-blue-300">
                {guestRemaining} free chat{guestRemaining !== 1 ? 's' : ''} remaining —
                <button onClick={onExitGuest} className="ml-1 underline hover:text-blue-200 active:text-blue-100 font-medium">
                  sign in
                </button>
                {' '}for unlimited
              </p>
            </motion.div>
          )}

          {/* API key banner */}
          {!isGuest && showApiKeyBanner && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-3 sm:px-4 py-2.5 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-indigo-500/10 border-b border-emerald-500/20 flex items-center justify-between gap-2 backdrop-blur-md"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-xs text-zinc-300 truncate">
                  <span className="text-emerald-300 font-medium">Pro tip:</span> Use your own API key for better rate limits —
                  <button onClick={() => setIsSettingsOpen(true)} className="ml-1 underline hover:text-white active:text-white font-medium">
                    Settings → API Key
                  </button>
                </p>
              </div>
              <button
                onClick={() => {
                  setShowApiKeyBanner(false)
                  localStorage.setItem(API_KEY_BANNER_DISMISSED, 'true')
                }}
                className="p-1 text-zinc-500 hover:text-white active:text-white transition-colors shrink-0"
                aria-label="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}

          {/* Limit reached banner */}
          {limitReached && !isGuest && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-3 sm:px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/20 text-center backdrop-blur-md"
            >
              <p className="text-xs text-amber-300">
                <span className="font-semibold">Limit reached</span> — 35 messages per conversation. Start a new chat to continue.
              </p>
            </motion.div>
          )}

          {/* Error display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mx-3 sm:mx-4 mt-3 rounded-xl bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/30 overflow-hidden backdrop-blur-md"
            >
              <div className="flex items-start gap-3 p-3 sm:p-3.5">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-red-300 mb-0.5">Something went wrong</p>
                  <p className="text-xs text-red-200/80 leading-relaxed break-words">{error}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!isGuest && !isStreaming && (
                    <button
                      onClick={() => { clearError(); regenerate() }}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 active:bg-red-500/30 text-red-200 hover:text-white text-xs font-medium transition-all"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Retry
                    </button>
                  )}
                  <button
                    onClick={clearError}
                    className="p-1.5 rounded-lg text-red-300/60 hover:text-red-200 hover:bg-red-500/10 transition-colors"
                    aria-label="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex-1 overflow-y-auto custom-scrollbar relative">
            <AnimatePresence mode="wait">
              {!hasConversation ? (
                <motion.div
                  key="hero"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full flex flex-col items-center"
                >
                  <HeroState
                    inputText={inputText}
                    setInputText={setInputText}
                    onSubmit={() => handleSendMessage(inputText)}
                    onSelectPromptSuggestion={handlePromptSuggestion}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full"
                >
                  <ChatTimeline
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    onRegenerate={regenerate}
                    onEditMessage={editAndResend}
                    isStreaming={isStreaming}
                    thinking={thinking}
                    isFounder={isFounderUser}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Guest limit modal */}
            {guestLimitReached && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-30 bg-[#090b10]/90 backdrop-blur-md flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
                  className="max-w-sm w-full text-center space-y-4 p-6 rounded-2xl glass border border-white/10"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center mx-auto">
                    <MessageSquare className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Free chats used up</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      Sign in or create an account for unlimited conversations with Drenzo AI.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      onClick={() => { if (onExitGuest) onExitGuest() }}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white text-sm font-semibold transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
                    >
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </button>
                    <button
                      onClick={() => { if (onExitGuest) onExitGuest() }}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-sm font-medium transition-all active:scale-[0.98]"
                    >
                      <UserPlus className="w-4 h-4" />
                      Create Account
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Onboarding modal */}
            {showOnboarding && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-30 bg-[#090b10]/90 backdrop-blur-md flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
                  className="max-w-md lg:max-w-lg w-full text-center space-y-5 lg:space-y-6 p-6 lg:p-8 rounded-2xl glass-strong border border-white/10"
                >
                  <div className="relative inline-block">
                    <div className="absolute inset-0 blur-2xl opacity-50 bg-gradient-to-r from-blue-500/40 via-indigo-500/40 to-violet-500/40" />
                    <div className="relative w-16 h-16 mx-auto">
                      <img src="Logo.png" alt="DRENZO AI" draggable={false} onContextMenu={(e) => e.preventDefault()} className="w-full h-full object-contain" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Welcome to <span className="text-gradient">Drenzo AI</span>
                    </h2>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      A researcher and texting AI — brutally honest, mature, and direct. No fluff, no cringe, just real talk.
                    </p>
                  </div>
                  <ul className="text-left space-y-2.5 text-sm text-zinc-300">
                    <li className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center shrink-0">
                        <Keyboard className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      <span className="flex-1"><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-zinc-200 text-xs font-mono">Ctrl+K</kbd> Search conversations</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center shrink-0">
                        <Plus className="w-3.5 h-3.5 text-indigo-400" />
                      </div>
                      <span className="flex-1"><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-zinc-200 text-xs font-mono">Ctrl+N</kbd> New conversation</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center shrink-0">
                        <Settings className="w-3.5 h-3.5 text-violet-400" />
                      </div>
                      <span className="flex-1"><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-zinc-200 text-xs font-mono">Ctrl+Shift+,</kbd> Open settings</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center shrink-0">
                        <Zap className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <span className="flex-1">Pin, rename, or delete conversations from the sidebar</span>
                    </li>
                  </ul>
                  <button
                    onClick={handleDismissOnboarding}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white text-sm font-semibold transition-all active:scale-[0.98] shadow-lg shadow-blue-500/30"
                  >
                    Get Started
                  </button>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Bottom toolbar (mobile-friendly, no duplicates with TopBar) */}
          <div className="relative flex justify-center pb-3 sm:pb-4 shrink-0">
            {!isGuest && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-1 p-1.5 rounded-xl glass border border-white/10 shadow-lg"
              >
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="hidden lg:flex p-2.5 rounded-lg hover:bg-white/10 active:bg-white/15 text-zinc-400 hover:text-white transition-all active:scale-95"
                  aria-label={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
                  title={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
                >
                  <PanelLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNewChat}
                  className="p-2.5 rounded-lg hover:bg-white/10 active:bg-white/15 text-zinc-400 hover:text-white transition-all active:scale-95"
                  aria-label="New Chat"
                  title="New Chat (Ctrl+N)"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2">
              <LanguageSwitch
                language={language}
                onToggle={() => setLanguage(prev => prev === 'english' ? 'hinglish' : 'english')}
              />
            </div>
          </div>
        </div>
      </div>

      {!isGuest && (
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          conversations={conversations}
          onSelectConversation={handleSelectConversation}
        />
      )}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userEmail={user?.email}
        userId={user?.id}
        onSignOut={signOut}
        instructionsApi={instructionsApi}
      />
    </div>
  )
}
