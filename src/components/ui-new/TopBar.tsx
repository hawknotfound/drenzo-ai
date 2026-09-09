import { useState, useEffect } from 'react';
import {
  Settings2, Share2, Zap, Menu,
  Maximize2, Minimize2, Search
} from 'lucide-react';

interface TopBarProps {
  onOpenSettings: () => void;
  onOpenSearch: () => void;
  onExportChat: () => void;
  onToggleMobileMenu: () => void;
}

export function TopBar({
  onOpenSettings, onOpenSearch, onExportChat,
  onToggleMobileMenu,
}: TopBarProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <header className="relative z-30 flex items-center justify-between px-4 md:px-6 py-3.5 border-b border-[#1b1528]/80 select-none shrink-0">
      {/* Left side: Mobile menu toggle & Model badge */}
      <div className="flex items-center gap-3">
        {/* Mobile menu hamburger */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-1.5 rounded-lg text-[#8b82a1] hover:text-white hover:bg-[#1c162e] transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Model badge (static — single model) */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#151122] border border-[#271f38] text-xs font-medium text-white shadow-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          <Zap className="w-3.5 h-3.5 text-purple-300" />
          <span className="tracking-tight">Drenzo AI</span>
        </div>
      </div>

      {/* Right side: Search, Fullscreen, Settings, Export */}
      <div className="flex items-center gap-2 md:gap-2.5">
        {/* Search */}
        <button
          onClick={onOpenSearch}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#151122]/70 hover:bg-[#1e1830] border border-[#251e36] text-xs text-[#a097b5] hover:text-white transition-colors"
          title="Search conversations (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#151122]/70 hover:bg-[#1e1830] border border-[#251e36] text-xs text-[#a097b5] hover:text-white transition-colors"
          title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[11px]">Exit</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[11px]">Full</span>
            </>
          )}
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#151122] hover:bg-[#1e1830] border border-[#251e36] hover:border-[#3f315a] transition-all text-xs font-medium text-white shadow-sm cursor-pointer"
          title="Settings"
        >
          <span className="hidden sm:inline">Configuration</span>
          <Settings2 className="w-3.5 h-3.5 text-[#988fae]" />
        </button>

        {/* Export */}
        <button
          onClick={onExportChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#151122] hover:bg-[#1e1830] border border-[#251e36] hover:border-[#3f315a] transition-all text-xs font-medium text-white shadow-sm cursor-pointer"
          title="Export chat"
        >
          <span className="hidden sm:inline">Export</span>
          <Share2 className="w-3.5 h-3.5 text-[#988fae]" />
        </button>
      </div>
    </header>
  );
}
