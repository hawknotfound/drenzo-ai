import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, LogOut, Crown, Plus, Pencil, Trash2, Check, Lock } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { useInstructions } from '@/hooks/useInstructions';
import { isFounder } from '@/lib/config';

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

  useEffect(() => {
    if (isOpen) {
      load()
      setCreating(false)
      setEditingId(null)
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
    <span className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${isActive ? 'border-blue-400' : 'border-zinc-600'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-blue-400' : 'bg-transparent'}`} />
    </span>
  )

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-md select-none"
      >
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 48 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative w-full sm:max-w-lg xl:max-w-xl sm:rounded-2xl rounded-t-2xl bg-[#121622] sm:border border-white/15 shadow-2xl sm:overflow-hidden max-h-[92dvh] sm:max-h-[70vh] flex flex-col"
        >
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/10 bg-[#161a26] shrink-0">
            <div className="flex items-center gap-2.5">
              <Settings className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-bold text-white">Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 active:bg-white/15 transition-colors"
              aria-label="Close settings"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto custom-scrollbar">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-blue-500" />
                Account
              </h3>
              <p className="text-xs text-zinc-400">{userEmail || 'Not signed in'}</p>
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

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-blue-500" />
                Instructions
                {activeId && (
                  <span className="text-[11px] text-blue-400 font-normal ml-auto">
                    Active: {instructions.find(i => i.id === activeId)?.title ?? 'Custom'}
                  </span>
                )}
              </h3>

              <button
                onClick={() => selectInstruction(null)}
                className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-colors ${activeId === null ? 'border-blue-500/40 bg-blue-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
              >
                {radioDot(activeId === null)}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white flex items-center gap-1.5">
                    Default
                    <Lock className="w-3 h-3 text-zinc-500" />
                  </p>
                  <p className="text-[11px] text-zinc-500 truncate">Drenzo's standard personality — no custom behavior</p>
                </div>
                {activeId === null && <Check className="w-4 h-4 text-blue-400 shrink-0" />}
              </button>

              {instructions.map(ins => {
                const isActive = activeId === ins.id
                return (
                  <div
                    key={ins.id}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-colors ${isActive ? 'border-blue-500/40 bg-blue-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                  >
                    <button onClick={() => selectInstruction(ins.id)} className="flex items-center gap-2.5 flex-1 min-w-0">
                      {radioDot(isActive)}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white truncate">{ins.title}</p>
                        <p className="text-[11px] text-zinc-500 truncate">{ins.content}</p>
                      </div>
                    </button>
                    {isActive && <Check className="w-4 h-4 text-blue-400 shrink-0" />}
                    <button
                      onClick={() => startEdit(ins.id, ins.title, ins.content)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 active:bg-white/15 transition-colors shrink-0"
                      aria-label={`Edit ${ins.title}`}
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(ins.id)}
                      className={`p-1.5 rounded-lg transition-colors shrink-0 ${confirmingDeleteId === ins.id ? 'bg-red-500/20 text-red-400' : 'text-zinc-400 hover:text-red-400 hover:bg-red-500/10'}`}
                      aria-label={`Delete ${ins.title}`}
                      title={confirmingDeleteId === ins.id ? 'Click again to confirm' : 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )
              })}

              {(creating || editingId) && (
                <div className="space-y-2.5 px-3 py-3 rounded-xl border border-white/10 bg-[#0d1117]">
                  <p className="text-[11px] font-semibold text-zinc-400">
                    {editingId ? 'Edit instruction' : 'New instruction'}
                  </p>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title — e.g. Always answer in Hindi"
                    className="w-full bg-[#121622] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50"
                  />
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What should Drenzo always know or do? e.g. Call me boss, never use emojis, keep answers under 5 lines…"
                    rows={3}
                    className="w-full bg-[#121622] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 resize-none"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={handleSave}
                      disabled={!title.trim() || !content.trim()}
                      className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelForm}
                      className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {!creating && !editingId && (
                <button
                  onClick={startCreate}
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl border border-dashed border-white/20 text-zinc-300 text-xs font-medium hover:border-blue-500/50 hover:text-blue-400 active:bg-white/5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Instruction
                </button>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-blue-500" />
                Temperature <span className="text-xs text-zinc-500 font-normal">({settings.temperature.toFixed(1)})</span>
              </h3>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={settings.temperature}
                onChange={(e) => updateSettings({ temperature: parseFloat(e.target.value) })}
                className="w-full h-2 accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-zinc-500">
                <span>Precise (0)</span>
                <span>Creative (2)</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-blue-500" />
                Max Tokens <span className="text-xs text-zinc-500 font-normal">({settings.max_tokens})</span>
              </h3>
              <input
                type="range"
                min="256"
                max="8192"
                step="256"
                value={settings.max_tokens}
                onChange={(e) => updateSettings({ max_tokens: parseInt(e.target.value) })}
                className="w-full h-2 accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-zinc-500">
                <span>256</span>
                <span>8192</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
