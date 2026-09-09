import React from 'react';
import { X, SlidersHorizontal, Moon, Bell, Keyboard, Sparkles } from 'lucide-react';
import { ModelOption } from '../types';
import { AVAILABLE_MODELS } from '../data/models';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: ModelOption;
  onSelectModel: (model: ModelOption) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  selectedModel,
  onSelectModel,
  soundEnabled,
  onToggleSound,
  onShowToast,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-[#130E20] border border-[#2F2348] shadow-2xl p-5 text-white animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#221838]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">App Settings</h3>
              <p className="text-[11px] text-[#867D9C]">Customize your workspace experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7C7391] hover:text-white hover:bg-[#1E1730] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-3.5">
          {/* Default Model */}
          <div>
            <label className="block text-xs font-medium text-[#D1CAE3] mb-1.5">
              Default Model
            </label>
            <select
              value={selectedModel.id}
              onChange={(e) => {
                const found = AVAILABLE_MODELS.find(m => m.id === e.target.value);
                if (found) {
                  onSelectModel(found);
                  onShowToast('Default Model Set', `Switched to ${found.name}`, 'info');
                }
              }}
              className="w-full px-3 py-2 rounded-xl bg-[#1B142B] border border-[#2D2244] text-xs text-white outline-none cursor-pointer"
            >
              {AVAILABLE_MODELS.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.provider}) - {m.badge || m.speed}
                </option>
              ))}
            </select>
          </div>

          {/* Theme Indicator */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#1B142B] border border-[#2A1F3F]">
            <div className="flex items-center gap-2.5">
              <Moon className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-xs font-medium text-white">Interface Theme</div>
                <div className="text-[10px] text-[#837A97]">Zyricon Cosmic Dark (Optimized)</div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/50 text-purple-300 border border-purple-500/30">
              Active
            </span>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#1B142B] border border-[#2A1F3F]">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-xs font-medium text-white">Audio Feedback</div>
                <div className="text-[10px] text-[#837A97]">Subtle chimes on generation finish</div>
              </div>
            </div>
            <button
              onClick={onToggleSound}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                soundEnabled ? 'bg-purple-600' : 'bg-[#2B2040]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  soundEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Keyboard Shortcuts preview */}
          <div className="p-3 rounded-xl bg-[#161024] border border-[#261C3B] text-xs space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#8B81A3] uppercase tracking-wider">
              <Keyboard className="w-3.5 h-3.5" />
              <span>Keyboard Shortcuts</span>
            </div>
            <div className="flex justify-between text-[#C1B8D4] text-[11px]">
              <span>Send Prompt</span>
              <kbd className="px-1.5 py-0.5 bg-[#201832] rounded border border-[#31254D] text-[10px] font-mono">Enter</kbd>
            </div>
            <div className="flex justify-between text-[#C1B8D4] text-[11px]">
              <span>New Line</span>
              <kbd className="px-1.5 py-0.5 bg-[#201832] rounded border border-[#31254D] text-[10px] font-mono">Shift + Enter</kbd>
            </div>
            <div className="flex justify-between text-[#C1B8D4] text-[11px]">
              <span>New Chat</span>
              <kbd className="px-1.5 py-0.5 bg-[#201832] rounded border border-[#31254D] text-[10px] font-mono">Alt + N</kbd>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-[#221838]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-medium bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-md transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
