import { Settings } from 'lucide-react';

interface TopBarProps {
  onOpenSettings: () => void;
}

export function TopBar({ onOpenSettings }: TopBarProps) {
  return (
    <div className="relative z-20 flex items-center justify-end w-full px-3 sm:px-6 py-3 sm:py-4 border-b border-white/5 bg-transparent select-none shrink-0 min-h-0">

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
