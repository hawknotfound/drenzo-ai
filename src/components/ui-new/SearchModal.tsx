import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles, Clock, ArrowRight } from 'lucide-react';
import type { Conversation } from '@/types/database';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  onSelectConversation: (id: string) => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

export function SearchModal({ isOpen, onClose, conversations, onSelectConversation }: SearchModalProps) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 48, scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full sm:max-w-xl xl:max-w-2xl sm:rounded-2xl rounded-t-2xl glass-strong shadow-2xl max-h-[80dvh] sm:max-h-[70vh] flex flex-col"
        >
          <div className="flex items-center px-4 py-4 border-b border-white/10 shrink-0">
            <Search className="w-5 h-5 text-blue-400 mr-3 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-transparent text-white text-sm focus:outline-none placeholder-zinc-500"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors mr-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 active:bg-white/15 transition-colors"
              aria-label="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-y-auto p-2 space-y-1 custom-scrollbar flex-1">
            {filtered.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-5 h-5 text-zinc-500" />
                </div>
                <p className="text-sm font-medium text-zinc-400">
                  {query ? 'No matches found' : 'No conversations yet'}
                </p>
                <p className="text-[11px] text-zinc-500 mt-1">
                  {query ? 'Try a different search term' : 'Start a new chat to see it here'}
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {filtered.map((c, i) => (
                  <motion.button
                    key={c.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: i < 8 ? i * 0.02 : 0 }}
                    onClick={() => { onSelectConversation(c.id); onClose(); }}
                    className="flex items-center justify-between w-full p-3 rounded-xl bg-white/[0.02] hover:bg-blue-500/10 active:bg-blue-500/20 border border-transparent hover:border-blue-500/30 text-left transition-all group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2 rounded-lg bg-blue-500/15 text-blue-400 shrink-0 group-hover:bg-blue-500/25 transition-colors">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="text-sm font-semibold text-white truncate">{c.title}</span>
                        <span className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {formatDate(c.updated_at)}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </motion.button>
                ))}
              </AnimatePresence>
            )}
          </div>

          <div className="px-4 py-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-500 shrink-0">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400 font-mono">↑</kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400 font-mono">↓</kbd>
                <span>navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400 font-mono">↵</kbd>
                <span>select</span>
              </span>
            </div>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400 font-mono">Esc</kbd>
              <span>close</span>
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
