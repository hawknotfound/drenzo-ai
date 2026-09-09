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
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 48 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative w-full sm:max-w-xl xl:max-w-2xl sm:rounded-2xl rounded-t-2xl bg-[#130E20] sm:border border-[#2F2348] shadow-[0_20px_60px_rgba(0,0,0,0.8)] max-h-[80dvh] sm:max-h-auto flex flex-col"
        >
          <div className="flex items-center px-4 py-4 sm:py-3 border-b border-[#221838] shrink-0">
            <Search className="w-5 h-5 sm:w-4 sm:h-4 text-[#7c7391] mr-3 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-transparent text-white text-sm focus:outline-none placeholder-[#706785]"
              autoFocus
            />
            <button
              onClick={onClose}
              className="p-2.5 sm:p-1.5 rounded-lg text-[#7c7391] hover:text-white hover:bg-[#1E1730] transition-colors"
              aria-label="Close search"
            >
              <X className="w-5 h-5 sm:w-4 sm:h-4" />
            </button>
          </div>

          <div className="overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {filtered.length === 0 ? (
              <div className="py-8 text-center text-[#6e6680] text-sm">
                No matching conversations found.
              </div>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { onSelectConversation(c.id); onClose(); }}
                  className="flex items-center justify-between w-full p-3 sm:p-3 rounded-xl bg-[#181226] hover:bg-[#231A38] active:bg-[#291C43] border border-[#2c2240] hover:border-purple-500/40 text-left transition-all group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2.5 sm:p-2 rounded-lg bg-purple-950/70 text-purple-300 shrink-0">
                      <Sparkles className="w-5 h-5 sm:w-4 sm:h-4" />
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-xs font-semibold text-white truncate">{c.title}</span>
                      <span className="text-[11px] text-[#867D9C] flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {c.updated_at}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#7c7391] group-hover:text-purple-400 transition-colors shrink-0" />
                </button>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
