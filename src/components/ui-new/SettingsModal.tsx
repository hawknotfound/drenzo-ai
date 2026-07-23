import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, LogOut, Sun, Moon } from 'lucide-react';
import { useThemeContext } from '@/providers/ThemeProvider';
import { useSettings } from '@/hooks/useSettings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  userId?: string;
  onSignOut: () => void;
}

export function SettingsModal({ isOpen, onClose, userEmail, userId, onSignOut }: SettingsModalProps) {
  const { theme, toggleTheme } = useThemeContext()
  const { settings, updateSettings } = useSettings(userId)

  if (!isOpen) return null;

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
          className="relative w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl bg-[#121622] sm:border border-white/15 shadow-2xl sm:overflow-hidden max-h-[92dvh] sm:max-h-[70vh] flex flex-col"
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
                Appearance
              </h3>
              <button
                onClick={toggleTheme}
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 active:bg-white/15 transition-all"
              >
                <span className="text-sm text-zinc-300">Theme</span>
                <span className="flex items-center gap-2 text-sm text-zinc-400">
                  {theme === 'dark' ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                  {theme === 'dark' ? 'Dark' : 'Light'}
                </span>
              </button>
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
