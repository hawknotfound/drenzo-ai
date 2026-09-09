import { useState, useCallback, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuthContext } from '@/providers/AuthProvider'
import { useConversations } from '@/hooks/useConversations'
import { useChat } from '@/hooks/useChat'
import { useInstructions } from '@/hooks/useInstructions'
import { useSettings } from '@/hooks/useSettings'
import { useToast } from '@/hooks/useToast'
import { Sidebar } from '@/components/ui-new/Sidebar'
import { TopBar } from '@/components/ui-new/TopBar'
import { HeroState } from '@/components/ui-new/HeroState'
import { ChatTimeline } from '@/components/ui-new/ChatTimeline'
import { SearchModal } from '@/components/ui-new/SearchModal'
import { SettingsModal } from '@/components/ui-new/SettingsModal'
import { ExportModal } from '@/components/ui-new/ExportModal'
import { Toast } from '@/components/ui-new/Toast'
import { ImageStudio } from '@/components/ui-new/ImageStudio'
import { PresentationStudio } from '@/components/ui-new/PresentationStudio'
import { DevStudio } from '@/components/ui-new/DevStudio'
import { ArchivedView } from '@/components/ui-new/ArchivedView'
import { LibraryView } from '@/components/ui-new/LibraryView'
import { WorkspaceView } from '@/components/ui-new/WorkspaceView'
import { isFounder } from '@/lib/config'
import { LanguageSwitch } from '@/components/ui-new/LanguageSwitch'
import { LogIn, UserPlus, MessageSquare, KeyRound, X } from 'lucide-react'

const USER_API_KEY_STORAGE = 'drenzo_user_api_key'
const API_KEY_BANNER_DISMISSED = 'drenzo_api_key_banner_dismissed'

interface ChatPageProps {
  isGuest?: boolean
  onExitGuest?: () => void
}

const ONBOARDING_KEY = 'drenzo_onboarding_seen'

export function ChatPage({ isGuest, onExitGuest }: ChatPageProps) {
  const { user, signOut } = useAuthContext()
  type ViewMode = 'chat' | 'image' | 'presentation' | 'dev' | 'archived' | 'library' | 'workspace'
  const [currentView, setCurrentView] = useState<ViewMode>('chat')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isFramed, setIsFramed] = useState(true)
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [inputText, setInputText] = useState('')

  const [language, setLanguage] = useState<'english' | 'hinglish'>('english')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)
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
  const { settings } = useSettings(user?.id)
  const { toasts, showToast, dismissToast } = useToast()

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
  } = useChat(isGuest ? guestConvId.current : activeConversationId, !!isGuest, language, instructionsApi.activeInstruction?.content, settings.temperature, settings.max_tokens)

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
    showToast('Welcome to Drenzo AI', 'Start typing or pick a prompt suggestion below', 'success')
  }, [showToast])

  const handleExportChat = useCallback(() => {
    setIsExportOpen(true)
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
          if (currentView !== 'chat') {
            setCurrentView('chat')
          } else if (isSearchOpen) setIsSearchOpen(false)
          else if (isSettingsOpen) setIsSettingsOpen(false)
          else if (isExportOpen) setIsExportOpen(false)
        }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isGuest, isSearchOpen, isSettingsOpen, isExportOpen, handleNewChat, currentView])

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

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center transition-all duration-300 ${
        isFramed
          ? 'bg-[#B497BD] p-1 sm:p-2 md:p-4 lg:p-6'
          : 'bg-[#0B0912] p-0'
      }`}
    >
      {/* Main Application Container */}
      <div
        className={`
          relative flex overflow-hidden transition-all duration-300
          ${
            isFramed
              ? 'w-full max-w-[1240px] h-[92vh] sm:h-[92vh] max-h-[860px] min-h-[85vh] sm:min-h-[640px] rounded-2xl sm:rounded-[28px] border border-[#271F38] shadow-[0_30px_90px_rgba(0,0,0,0.65)]'
              : 'w-full h-screen rounded-none border-none shadow-none'
          }
          bg-[#0B0912] text-white
        `}
      >
        {/* Left Sidebar */}
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
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenStudio={(view) => setCurrentView(view)}
            isMobileOpen={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Right Main Content Area */}
        <main
          className="relative flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#0A0812]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 28%, rgba(130, 70, 205, 0.22) 0%, rgba(68, 20, 115, 0.12) 32%, rgba(10, 8, 18, 1) 72%)'
          }}
        >
          {/* Top Bar */}
          <TopBar
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenSearch={() => setIsSearchOpen(true)}
            onExportChat={handleExportChat}
            onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            isFramed={isFramed}
            onToggleFramed={() => setIsFramed(!isFramed)}
          />

          {/* Banners */}
          {isGuest && !guestLimitReached && (
            <div className="px-3 sm:px-4 py-2.5 sm:py-2 bg-purple-900/20 border-b border-purple-800/30 text-center flex items-center justify-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 sm:w-3 sm:h-3 text-purple-400 shrink-0" />
              <p className="text-xs text-purple-300">{guestRemaining} free chat{guestRemaining !== 1 ? 's' : ''} remaining — <button onClick={onExitGuest} className="underline hover:text-purple-200 active:text-purple-100">sign in</button> for unlimited</p>
            </div>
          )}

          {!isGuest && showApiKeyBanner && (
            <div className="px-3 sm:px-4 py-2.5 sm:py-2 bg-purple-900/20 border-b border-purple-800/30 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <KeyRound className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400 shrink-0" />
                <p className="text-xs text-purple-300 truncate">Use your own API key for better rate limits — <button onClick={() => setIsSettingsOpen(true)} className="underline hover:text-purple-200 active:text-purple-100 font-medium">Settings → API Key</button></p>
              </div>
              <button
                onClick={() => {
                  setShowApiKeyBanner(false)
                  localStorage.setItem(API_KEY_BANNER_DISMISSED, 'true')
                }}
                className="p-1 text-purple-400/60 hover:text-purple-300 active:text-purple-200 transition-colors shrink-0"
                aria-label="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {limitReached && !isGuest && (
            <div className="px-3 sm:px-4 py-2.5 sm:py-2 bg-amber-900/20 border-b border-amber-800/30 text-center">
              <p className="text-xs text-amber-400">Limit reached — 35 messages per conversation. Start a new chat.</p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-3 mx-3 sm:mx-4 mt-2 rounded-lg bg-red-900/20 border border-red-800/30">
              <p className="text-xs text-red-400 flex-1">{error}</p>
              <button onClick={clearError} className="text-xs text-red-400 hover:text-red-300 active:text-red-200 px-2 py-1.5">Dismiss</button>
              {!isGuest && <button onClick={regenerate} className="text-xs text-zinc-400 hover:text-zinc-200 active:text-zinc-100 px-2 py-1.5">Retry</button>}
            </div>
          )}

          {/* Dynamic Center View Area */}
          <div className="flex-1 overflow-y-auto flex flex-col justify-between relative z-10">
            <AnimatePresence mode="wait">
              {currentView === 'chat' ? (
                !hasConversation ? (
                  <motion.div
                    key="hero"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="w-full h-full flex flex-col items-center justify-between py-2 sm:py-4"
                  >
                    <HeroState
                      inputText={inputText}
                      setInputText={setInputText}
                      onSubmit={() => handleSendMessage(inputText)}
                      onSelectPromptSuggestion={handlePromptSuggestion}
                    />

                    {/* Language Switch - bottom right */}
                    <div className="absolute right-4 bottom-4">
                      <LanguageSwitch
                        language={language}
                        onToggle={() => setLanguage(prev => prev === 'english' ? 'hinglish' : 'english')}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="timeline"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="w-full h-full flex flex-col"
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

                    {/* Language Switch - bottom right of chat */}
                    <div className="absolute right-4 bottom-4 z-20">
                      <LanguageSwitch
                        language={language}
                        onToggle={() => setLanguage(prev => prev === 'english' ? 'hinglish' : 'english')}
                      />
                    </div>
                  </motion.div>
                )
              ) : (
                <motion.div
                  key={currentView}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full overflow-y-auto"
                >
                  {currentView === 'image' && <ImageStudio onBack={() => setCurrentView('chat')} />}
                  {currentView === 'presentation' && <PresentationStudio onBack={() => setCurrentView('chat')} />}
                  {currentView === 'dev' && <DevStudio onBack={() => setCurrentView('chat')} />}
                  {currentView === 'archived' && <ArchivedView onBack={() => setCurrentView('chat')} />}
                  {currentView === 'library' && <LibraryView onBack={() => setCurrentView('chat')} />}
                  {currentView === 'workspace' && <WorkspaceView onBack={() => setCurrentView('chat')} />}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Guest limit overlay */}
            {guestLimitReached && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-30 bg-[#0B0912]/90 backdrop-blur-md flex items-center justify-center p-4"
              >
                <div className="max-w-sm text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mx-auto">
                    <MessageSquare className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Free chats used up</h3>
                  <p className="text-sm text-zinc-400">Sign in or create an account for unlimited conversations with Drenzo AI.</p>
                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      onClick={() => { if (onExitGuest) onExitGuest() }}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-all"
                    >
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </button>
                    <button
                      onClick={() => { if (onExitGuest) onExitGuest() }}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-sm font-medium transition-all"
                    >
                      <UserPlus className="w-4 h-4" />
                      Create Account
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Onboarding overlay */}
            {showOnboarding && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-30 bg-[#0B0912]/90 backdrop-blur-md flex items-center justify-center p-4"
              >
                <div className="max-w-md lg:max-w-lg text-center space-y-5 lg:space-y-6">
                  <div className="w-16 h-16 mx-auto">
                    <img src="Logo.png" alt="DRENZO AI" draggable={false} onContextMenu={(e) => e.preventDefault()} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">Welcome to Drenzo AI</h2>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      A researcher and texting AI — brutally honest, mature, and direct. No fluff, no cringe, just real talk.
                    </p>
                  </div>
                  <ul className="text-left space-y-2 text-sm text-zinc-400">
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                      <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 text-xs font-mono">Ctrl+K</kbd> Search conversations</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                      <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 text-xs font-mono">Ctrl+N</kbd> New conversation</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                      <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 text-xs font-mono">Ctrl+Shift+,</kbd> Open settings</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                      <span>Pin, rename, or delete conversations from sidebar</span>
                    </li>
                  </ul>
                  <button
                    onClick={handleDismissOnboarding}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-all active:scale-[0.98]"
                  >
                    Get Started
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
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
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        messages={messages}
      />
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
