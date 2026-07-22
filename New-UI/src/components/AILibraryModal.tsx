import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, X, Sparkles, ArrowRight, Server, Palette, Zap } from 'lucide-react';
import { PROMPT_TEMPLATES } from '../data/initialData';

interface AILibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (prompt: string) => void;
}

export const AILibraryModal: React.FC<AILibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl rounded-2xl bg-[#121622] border border-white/15 shadow-2xl overflow-hidden p-6 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-bold text-white">Drenzo AI Prompt Library</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PROMPT_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => {
                  onSelectTemplate(tmpl.prompt);
                  onClose();
                }}
                className="flex flex-col justify-between p-4 rounded-xl bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-500/40 text-left transition-all group"
              >
                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 w-fit">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {tmpl.title}
                  </h3>
                  <p className="text-[11px] text-zinc-400 line-clamp-3">
                    {tmpl.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-[11px] font-medium text-blue-400">
                  <span>Use Template</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
