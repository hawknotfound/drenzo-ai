import { Settings, Languages, PanelLeftClose, PanelLeft } from 'lucide-react';

interface TopBarProps {
  onOpenSettings: () => void;
  onToggleSidebar: () => void;
  sidebarCollapsed?: boolean;
  language?: 'english' | 'hinglish';
  onToggleLanguage?: () => void;
}

export function TopBar({ onOpenSettings, onToggleSidebar, sidebarCollapsed = false, language = 'english', onToggleLanguage }: TopBarProps) {
  return (
    <div className="relative z-20 flex items-center justify-between w-full px-3 sm:px-6 py-3 sm:py-4 border-b border-white/5 bg-transparent select-none shrink-0 min-h-0">
        <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={onToggleSidebar}
          className="p-2.5 sm:p-2 rounded-xl bg-[#1a202c]/70 hover:bg-[#222938] active:bg-[#2a3248] border border-white/10 text-zinc-300 hover:text-white transition-all"
          aria-label={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
          title={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
        >
          {sidebarCollapsed ? <PanelLeft className="w-5 h-5 sm:w-4 sm:h-4" /> : <PanelLeftClose className="w-5 h-5 sm:w-4 sm:h-4" />}
        </button>
        <button
          onClick={onToggleLanguage}
          className={`flex items-center gap-1.5 px-3 sm:px-2.5 py-1.5 sm:py-1 rounded-full text-[11px] font-medium border transition-all shrink-0 active:scale-95 ${
            language === 'hinglish'
              ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
              : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
          }`}
          title="Toggle language"
        >
          <Languages className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
          <span>{language === 'hinglish' ? 'Hinglish' : 'English'}</span>
        </button>
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>System Ready</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSettings}
          className="p-2.5 sm:p-2 rounded-xl bg-[#1a202c]/70 hover:bg-[#222938] active:bg-[#2a3248] border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white transition-all backdrop-blur-md active:scale-95"
          title="Settings"
        >
          <Settings className="w-5 h-5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
}
