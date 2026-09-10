import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, LogOut, Crown, Plus, Pencil, Trash2, Check, Lock, Eye, EyeOff, Terminal, Copy, Download, AlertTriangle } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { useInstructions } from '@/hooks/useInstructions';
import { isFounder } from '@/lib/config';
import { USER_API_KEY_STORAGE, PROVIDER_STORAGE, OPENROUTER_API_KEY_STORAGE, OPENROUTER_MODEL_STORAGE, OPENROUTER_MODELS } from '@/lib/constants';

type InstructionsApi = ReturnType<typeof useInstructions>

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  userId?: string;
  onSignOut: () => void;
  instructionsApi: InstructionsApi;
}

export function SettingsModal({ isOpen, onClose, userEmail, userId, onSignOut, instructionsApi }: SettingsModalProps) {
  const { settings, updateSettings } = useSettings(userId)
  const { instructions, activeId, load, createInstruction, updateInstruction, deleteInstruction, selectInstruction } = instructionsApi

  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null)
  const confirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [userApiKey, setUserApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [apiKeySaved, setApiKeySaved] = useState(false)
  const [provider, setProvider] = useState<'opencode' | 'openrouter'>(() => {
    try { return (localStorage.getItem(PROVIDER_STORAGE) as 'opencode' | 'openrouter') || 'opencode' } catch { return 'opencode' }
  })
  const [openRouterKey, setOpenRouterKey] = useState('')
  const [showORKey, setShowORKey] = useState(false)
  const [orKeySaved, setOrKeySaved] = useState(false)
  const [orModel, setOrModel] = useState(() => {
    try { return localStorage.getItem(OPENROUTER_MODEL_STORAGE) || 'openai/gpt-4o-mini' } catch { return 'openai/gpt-4o-mini' }
  })

  useEffect(() => {
    if (isOpen) {
      load()
      setCreating(false)
      setEditingId(null)
      try {
        setUserApiKey(localStorage.getItem(USER_API_KEY_STORAGE) || '')
        setProvider((localStorage.getItem(PROVIDER_STORAGE) as 'opencode' | 'openrouter') || 'opencode')
        setOpenRouterKey(localStorage.getItem(OPENROUTER_API_KEY_STORAGE) || '')
        setOrModel(localStorage.getItem(OPENROUTER_MODEL_STORAGE) || 'openai/gpt-4o-mini')
      } catch {}
      setShowApiKey(false)
      setApiKeySaved(false)
      setShowORKey(false)
      setOrKeySaved(false)
    }
  }, [isOpen, load])

  useEffect(() => {
    return () => {
      if (confirmTimer.current) clearTimeout(confirmTimer.current)
    }
  }, [])

  const startCreate = () => {
    setEditingId(null)
    setTitle('')
    setContent('')
    setCreating(true)
  }

  const startEdit = (id: string, currentTitle: string, currentContent: string) => {
    setCreating(false)
    setEditingId(id)
    setTitle(currentTitle)
    setContent(currentContent)
  }

  const cancelForm = () => {
    setCreating(false)
    setEditingId(null)
    setTitle('')
    setContent('')
  }

  const handleSave = async () => {
    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()
    if (!trimmedTitle || !trimmedContent) return
    const ok = editingId
      ? await updateInstruction(editingId, trimmedTitle, trimmedContent)
      : await createInstruction(trimmedTitle, trimmedContent)
    if (ok) cancelForm()
  }

  const handleDelete = (id: string) => {
    if (confirmingDeleteId !== id) {
      setConfirmingDeleteId(id)
      if (confirmTimer.current) clearTimeout(confirmTimer.current)
      confirmTimer.current = setTimeout(() => setConfirmingDeleteId(null), 2500)
      return
    }
    if (confirmTimer.current) clearTimeout(confirmTimer.current)
    setConfirmingDeleteId(null)
    deleteInstruction(id)
  }

  if (!isOpen) return null;

  const radioDot = (isActive: boolean) => (
    <span className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${isActive ? 'border-purple-400' : 'border-[#3a2f52]'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-purple-400' : 'bg-transparent'}`} />
    </span>
  )

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm select-none"
      >
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 48 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative w-full sm:max-w-lg xl:max-w-xl sm:rounded-2xl rounded-t-2xl bg-[#130E20] sm:border border-[#2F2348] shadow-[0_20px_60px_rgba(0,0,0,0.8)] sm:overflow-hidden max-h-[92dvh] sm:max-h-[70vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#221838] bg-[#171026] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-300">
                <Settings className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-semibold text-white">Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#7C7391] hover:text-white hover:bg-[#1E1730] transition-colors"
              aria-label="Close settings"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto custom-scrollbar">
            {/* Account */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-purple-500" />
                Account
              </h3>
              <p className="text-xs text-[#867D9C]">{userEmail || 'Not signed in'}</p>
              {isFounder(userEmail) && (
                <div className="flex items-center gap-1.5 mt-1">
                  <Crown className="w-3 h-3 text-purple-400" />
                  <span className="text-[11px] font-semibold text-purple-400 bg-purple-500/15 px-2 py-0.5 rounded-full border border-purple-500/30">Founder</span>
                </div>
              )}
              <button
                onClick={onSignOut}
                className="flex items-center justify-center gap-2 w-full py-2.5 sm:py-2 px-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/20 active:bg-red-500/25 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                Sign Out
              </button>
            </div>

            {/* Instructions */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-purple-500" />
                Instructions
                {activeId && (
                  <span className="text-[11px] text-purple-400 font-normal ml-auto">
                    Active: {instructions.find(i => i.id === activeId)?.title ?? 'Custom'}
                  </span>
                )}
              </h3>

              <button
                onClick={() => selectInstruction(null)}
                className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-colors ${activeId === null ? 'border-purple-500/40 bg-purple-500/10' : 'border-[#2c2240] bg-[#181226] hover:bg-[#1e1730]'}`}
              >
                {radioDot(activeId === null)}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white flex items-center gap-1.5">
                    Default
                    <Lock className="w-3 h-3 text-[#6e6680]" />
                  </p>
                  <p className="text-[11px] text-[#6e6680] truncate">Drenzo's standard personality — no custom behavior</p>
                </div>
                {activeId === null && <Check className="w-4 h-4 text-purple-400 shrink-0" />}
              </button>

              {instructions.map(ins => {
                const isActive = activeId === ins.id
                return (
                  <div
                    key={ins.id}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-colors ${isActive ? 'border-purple-500/40 bg-purple-500/10' : 'border-[#2c2240] bg-[#181226] hover:bg-[#1e1730]'}`}
                  >
                    <button onClick={() => selectInstruction(ins.id)} className="flex items-center gap-2.5 flex-1 min-w-0">
                      {radioDot(isActive)}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white truncate">{ins.title}</p>
                        <p className="text-[11px] text-[#6e6680] truncate">{ins.content}</p>
                      </div>
                    </button>
                    {isActive && <Check className="w-4 h-4 text-purple-400 shrink-0" />}
                    <button
                      onClick={() => startEdit(ins.id, ins.title, ins.content)}
                      className="p-1.5 rounded-lg text-[#7c7391] hover:text-white hover:bg-[#251d38] transition-colors shrink-0"
                      aria-label={`Edit ${ins.title}`}
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(ins.id)}
                      className={`p-1.5 rounded-lg transition-colors shrink-0 ${confirmingDeleteId === ins.id ? 'bg-red-500/20 text-red-400' : 'text-[#7c7391] hover:text-red-400 hover:bg-red-500/10'}`}
                      aria-label={`Delete ${ins.title}`}
                      title={confirmingDeleteId === ins.id ? 'Click again to confirm' : 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )
              })}

              {(creating || editingId) && (
                <div className="space-y-2.5 px-3 py-3 rounded-xl border border-[#2c2240] bg-[#0E0A17]">
                  <p className="text-[11px] font-semibold text-[#867D9C]">
                    {editingId ? 'Edit instruction' : 'New instruction'}
                  </p>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title — e.g. Always answer in Hindi"
                    className="w-full bg-[#1B142B] border border-[#2D2244] rounded-lg px-3 py-2 text-xs text-white placeholder-[#706785] focus:outline-none focus:border-purple-500/50"
                  />
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What should Drenzo always know or do? e.g. Call me boss, never use emojis, keep answers under 5 lines…"
                    rows={3}
                    className="w-full bg-[#1B142B] border border-[#2D2244] rounded-lg px-3 py-2 text-xs text-white placeholder-[#706785] focus:outline-none focus:border-purple-500/50 resize-none"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={handleSave}
                      disabled={!title.trim() || !content.trim()}
                      className="flex-1 py-2 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelForm}
                      className="px-4 py-2 rounded-lg bg-[#151122] hover:bg-[#1e1830] border border-[#251e36] text-[#A59DBA] text-xs font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {!creating && !editingId && (
                <button
                  onClick={startCreate}
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl border border-dashed border-[#3a2f52] text-[#9b92b0] text-xs font-medium hover:border-purple-500/50 hover:text-purple-400 active:bg-[#1e1730] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Instruction
                </button>
              )}
            </div>

            {/* Provider */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-purple-500" />
                Provider
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => { setProvider('opencode'); localStorage.setItem(PROVIDER_STORAGE, 'opencode') }} className={`py-2.5 rounded-xl text-xs font-medium border transition-colors ${provider === 'opencode' ? 'bg-purple-500/20 border-purple-500/40 text-white' : 'bg-[#181226] border-[#2c2240] text-[#9b92b0] hover:text-white'}`}>Drenzo AI (OpenCode)</button>
                <button onClick={() => { setProvider('openrouter'); localStorage.setItem(PROVIDER_STORAGE, 'openrouter') }} className={`py-2.5 rounded-xl text-xs font-medium border transition-colors ${provider === 'openrouter' ? 'bg-purple-500/20 border-purple-500/40 text-white' : 'bg-[#181226] border-[#2c2240] text-[#9b92b0] hover:text-white'}`}>OpenRouter</button>
              </div>
              {provider === 'openrouter' && (
                <div className="space-y-2">
                  <div className="relative">
                    <input type={showORKey ? 'text' : 'password'} value={openRouterKey} onChange={(e) => { setOpenRouterKey(e.target.value); setOrKeySaved(false) }} placeholder="sk-or-v1-xxxxxxxxxxxxxxxx" className="w-full bg-[#1B142B] border border-[#2D2244] rounded-lg pl-3 pr-10 py-2 text-xs text-white placeholder-[#706785] focus:outline-none focus:border-purple-500/50 font-mono" />
                    <button type="button" onClick={() => setShowORKey(!showORKey)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#706785] hover:text-[#9b92b0]">{showORKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { const t = openRouterKey.trim(); if (t) localStorage.setItem(OPENROUTER_API_KEY_STORAGE, t); else localStorage.removeItem(OPENROUTER_API_KEY_STORAGE); setOrKeySaved(true); window.dispatchEvent(new Event('drenzo-apikey-saved')) }} className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${orKeySaved ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' : 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white'}`}>{orKeySaved ? 'Saved' : 'Save Key'}</button>
                    {openRouterKey && <button onClick={() => { localStorage.removeItem(OPENROUTER_API_KEY_STORAGE); setOpenRouterKey(''); setOrKeySaved(false) }} className="px-4 py-2 rounded-lg bg-[#151122] border border-[#251e36] text-xs text-[#A59DBA]">Clear</button>}
                  </div>
                  <select value={orModel} onChange={(e) => { setOrModel(e.target.value); localStorage.setItem(OPENROUTER_MODEL_STORAGE, e.target.value) }} className="w-full bg-[#1B142B] border border-[#2D2244] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500/50">
                    {OPENROUTER_MODELS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                  </select>
                  <p className="text-[10px] text-[#6e6680]">Get key at openrouter.ai/keys — any model above works. Your key stays in browser only.</p>
                </div>
              )}
            </div>

            {/* API Key */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-purple-500" />
                API Key
              </h3>
              <p className="text-[11px] text-[#6e6680] leading-relaxed">
                Use your own OpenCode Zen API key to avoid shared rate limits. Drenzo works without it — this is optional.
              </p>
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={userApiKey}
                    onChange={(e) => { setUserApiKey(e.target.value); setApiKeySaved(false) }}
                    placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full bg-[#1B142B] border border-[#2D2244] rounded-lg pl-3 pr-10 py-2 text-xs text-white placeholder-[#706785] focus:outline-none focus:border-purple-500/50 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#706785] hover:text-[#9b92b0] transition-colors"
                    aria-label={showApiKey ? 'Hide key' : 'Show key'}
                  >
                    {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const trimmed = userApiKey.trim()
                      if (trimmed) {
                        localStorage.setItem(USER_API_KEY_STORAGE, trimmed)
                        setUserApiKey(trimmed)
                      } else {
                        localStorage.removeItem(USER_API_KEY_STORAGE)
                        setUserApiKey('')
                      }
                      setApiKeySaved(true)
                      window.dispatchEvent(new Event('drenzo-apikey-saved'))
                    }}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${apiKeySaved
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                      : 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white'
                    }`}
                  >
                    {apiKeySaved ? 'Saved' : 'Save Key'}
                  </button>
                  {userApiKey && (
                    <button
                      onClick={() => {
                        localStorage.removeItem(USER_API_KEY_STORAGE)
                        setUserApiKey('')
                        setApiKeySaved(false)
                      }}
                      className="px-4 py-2 rounded-lg bg-[#151122] hover:bg-[#1e1830] border border-[#251e36] text-[#A59DBA] text-xs font-medium transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
              <div className="px-3 py-2.5 rounded-xl bg-[#0E0A17] border border-[#2c2240] space-y-1.5">
                <p className="text-[11px] font-semibold text-[#D1CAE3]">How to get your key:</p>
                <ol className="text-[11px] text-[#867D9C] space-y-1 list-decimal list-inside leading-relaxed">
                  <li>Go to <span className="text-purple-400">opencode.ai</span> and sign in</li>
                  <li>Open Settings → API Keys (or visit <span className="text-purple-400">opencode.ai/keys</span>)</li>
                  <li>Copy your API key (starts with <span className="text-[#9b92b0] font-mono">sk-</span>)</li>
                  <li>Paste it above and hit Save</li>
                </ol>
                <p className="text-[10px] text-[#6e6680]">Your key stays in your browser only — never stored on our servers.</p>
              </div>
            </div>

            {/* Temperature */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-purple-500" />
                Temperature <span className="text-xs text-[#6e6680] font-normal">({settings.temperature.toFixed(1)})</span>
                {isFounder(userEmail) && <span className="text-[10px] text-purple-400 font-normal ml-1">(Extended)</span>}
              </h3>
              <input
                type="range"
                min="0"
                max={isFounder(userEmail) ? '4' : '2'}
                step="0.1"
                value={settings.temperature}
                onChange={(e) => updateSettings({ temperature: parseFloat(e.target.value) })}
                className="w-full h-1.5 accent-purple-500 cursor-pointer bg-[#241A3B] rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-[#6e6680]">
                <span>Precise (0)</span>
                <span>{isFounder(userEmail) ? 'Chaotic (4)' : 'Creative (2)'}</span>
              </div>
            </div>

            {/* Max Tokens */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-purple-500" />
                Max Tokens <span className="text-xs text-[#6e6680] font-normal">({settings.max_tokens})</span>
                {isFounder(userEmail) && <span className="text-[10px] text-purple-400 font-normal ml-1">(Extended)</span>}
              </h3>
              <input
                type="range"
                min="256"
                max={isFounder(userEmail) ? '16384' : '8192'}
                step="256"
                value={settings.max_tokens}
                onChange={(e) => updateSettings({ max_tokens: parseInt(e.target.value) })}
                className="w-full h-1.5 accent-purple-500 cursor-pointer bg-[#241A3B] rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-[#6e6680]">
                <span>256</span>
                <span>{isFounder(userEmail) ? '16384' : '8192'}</span>
              </div>
            </div>

            {/* Developer Panel (Founder only) */}
            {isFounder(userEmail) && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-1 h-4 rounded-full bg-amber-500" />
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  Developer
                  <span className="text-[10px] text-amber-400 font-normal ml-1">Owner</span>
                </h3>

                {/* System Info */}
                <div className="px-3 py-2.5 rounded-xl bg-[#0E0A17] border border-[#2c2240] space-y-2">
                  <p className="text-[11px] font-semibold text-[#D1CAE3]">System Info</p>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-[#6e6680]">User ID</span>
                      <p className="text-[#9b92b0] font-mono truncate">{userId || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-[#6e6680]">Model</span>
                      <p className="text-[#9b92b0] font-mono">mimo-v2.5-free</p>
                    </div>
                    <div>
                      <span className="text-[#6e6680]">API Endpoint</span>
                      <p className="text-[#9b92b0] font-mono truncate">opencode.ai/zen/v1</p>
                    </div>
                    <div>
                      <span className="text-[#6e6680]">Session</span>
                      <p className="text-[#9b92b0] font-mono">drenzo-ai-free</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      const data = {
                        settings: { temperature: settings.temperature, max_tokens: settings.max_tokens },
                        apiKey: localStorage.getItem(USER_API_KEY_STORAGE) ? 'SET' : 'NOT SET',
                        onboarding: localStorage.getItem('drenzo_onboarding_seen'),
                        exportDate: new Date().toISOString(),
                      };
                      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
                    }}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#151122] hover:bg-[#1e1830] border border-[#251e36] text-xs text-[#9b92b0] hover:text-white transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Config</span>
                  </button>
                  <button
                    onClick={() => {
                      const ls: Record<string, string> = {};
                      for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key) ls[key] = localStorage.getItem(key) || '';
                      }
                      const blob = new Blob([JSON.stringify(ls, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `drenzo-dev-export-${Date.now()}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#151122] hover:bg-[#1e1830] border border-[#251e36] text-xs text-[#9b92b0] hover:text-white transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span>Export Data</span>
                  </button>
                </div>

                {/* Danger Zone */}
                <div className="px-3 py-2.5 rounded-xl bg-red-500/5 border border-red-500/20 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3 text-red-400" />
                    <p className="text-[11px] font-semibold text-red-400">Danger Zone</p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Clear ALL localStorage data? This cannot be undone.')) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                    className="w-full py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-medium transition-colors"
                  >
                    Clear All Local Data
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
