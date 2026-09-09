import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Search, Sparkles, Cpu } from 'lucide-react';

interface TopBarProps {
  onOpenSettings: () => void;
  onOpenSearch: () => void;
  conversationTitle?: string;
  isGuest?: boolean;
}

export function TopBar({ onOpenSettings, onOpenSearch, conversationTitle }: TopBarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`relative z-20 flex items-center justify-between w-full px-3 sm:px-5 py-3 select-none shrink-0 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-[#0b0e16]/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      {/* Left: conversation title (or brand) */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {conversationTitle ? (
          <motion.div
            key={conversationTitle}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 min-w-0"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-white truncate">{conversationTitle}</h2>
            </div>
          </motion.div>
        ) : (
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-white">Drenzo AI</h2>
            </div>
          </div>
        )}
      </div>

      {/* Center: model badge */}
      <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
        <Cpu className="w-3 h-3 text-emerald-400" />
        <span className="text-[11px] font-medium text-zinc-300">Drenzo Model</span>
        <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[9px] font-semibold uppercase tracking-wider border border-emerald-500/20">
          Free
        </span>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onOpenSearch}
          className="p-2 sm:p-2 rounded-lg hover:bg-white/5 active:bg-white/10 text-zinc-400 hover:text-white transition-all active:scale-95"
          title="Search (Ctrl+K)"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>
        <button
          onClick={onOpenSettings}
          className="p-2 sm:p-2 rounded-lg hover:bg-white/5 active:bg-white/10 text-zinc-400 hover:text-white transition-all active:scale-95"
          title="Settings (Ctrl+Shift+,)"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
