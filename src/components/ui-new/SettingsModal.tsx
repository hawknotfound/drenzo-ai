import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, LogOut, Sun, Moon } from 'lucide-react';
import { useThemeContext } from '@/providers/ThemeProvider';
import { useSettings } from '@/hooks/useSettings';

const MODELS = [
  { id: 'deepseek-v4-flash-free', label: 'DeepSeek V4 Flash Free' },
  { id: 'deepseek-r1', label: 'DeepSeek R1 (reasoning)' },
]

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg rounded-2xl bg-[#121622] border border-white/15 shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#161a26]">
            <div className="flex items-center gap-2.5">
              <Settings className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-bold text-white">Settings</h2>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-blue-500" />
                Account
              </h3>
              <p className="text-xs text-zinc-400">{userEmail || 'Not signed in'}</p>
              <button
                onClick={onSignOut}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
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
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
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
                Model
              </h3>
              <select
                value={settings.model}
                onChange={(e) => updateSettings({ model: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-zinc-300 focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
              >
                {MODELS.map(m => (
                  <option key={m.id} value={m.id} className="bg-[#121622]">{m.label}</option>
                ))}
              </select>
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
                className="w-full accent-blue-500"
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
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-[11px] text-zinc-500">
                <span>256</span>
                <span>8192</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
