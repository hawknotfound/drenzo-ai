import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, X, Key, Shield, Sliders, Palette, Monitor, Keyboard, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  onToggleDarkMode
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'models' | 'theme' | 'shortcuts'>('general');
  const [systemPrompt, setSystemPrompt] = useState('You are Drenzo AI, an ultra-fast, highly accurate AI assistant specializing in software engineering, frontend architecture, and creative problem solving.');
  const [temperature, setTemperature] = useState(0.7);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl rounded-2xl bg-[#121622] border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#161a26]">
            <div className="flex items-center gap-2.5">
              <Settings className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-bold text-white">Drenzo AI Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Left Tabs */}
            <div className="w-48 p-3 border-r border-white/10 bg-[#0d1018] space-y-1 shrink-0">
              <button
                onClick={() => setActiveTab('general')}
                className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  activeTab === 'general'
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>General Preferences</span>
              </button>

              <button
                onClick={() => setActiveTab('models')}
                className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  activeTab === 'models'
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Key className="w-4 h-4" />
                <span>Model Tuning</span>
              </button>

              <button
                onClick={() => setActiveTab('theme')}
                className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  activeTab === 'theme'
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>Theme & Aesthetics</span>
              </button>

              <button
                onClick={() => setActiveTab('shortcuts')}
                className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  activeTab === 'shortcuts'
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Keyboard className="w-4 h-4" />
                <span>Shortcuts</span>
              </button>
            </div>

            {/* Right Tab Content */}
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-6">
              {activeTab === 'general' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white">System Instructions</h3>
                  <textarea
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    rows={4}
                    className="w-full p-3 rounded-xl bg-[#0b0e15] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50"
                  />
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-xs text-zinc-300 font-medium">Auto-save chat history</span>
                    <input type="checkbox" defaultChecked className="toggle-checkbox" />
                  </div>
                </div>
              )}

              {activeTab === 'models' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white">Model Parameters</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-zinc-300">
                      <span>Temperature (Creativity): {temperature}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'theme' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white">Aesthetic Style</h3>
                  <button
                    onClick={onToggleDarkMode}
                    className="flex items-center justify-between w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-400/40 text-left transition-colors"
                  >
                    <div>
                      <p className="text-xs font-semibold text-white">Cosmic Dark Glass (Default)</p>
                      <p className="text-[11px] text-zinc-400">Deep cosmic blue atmosphere with glowing spheres</p>
                    </div>
                    <Check className="w-4 h-4 text-blue-400" />
                  </button>
                </div>
              )}

              {activeTab === 'shortcuts' && (
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between p-2 rounded bg-white/5 text-zinc-300">
                    <span>New Chat</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/40 text-zinc-400 border border-white/10">⌘ + N</kbd>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-white/5 text-zinc-300">
                    <span>Search Conversations</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/40 text-zinc-400 border border-white/10">⌘ + K</kbd>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-white/5 text-zinc-300">
                    <span>Toggle Sidebar</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/40 text-zinc-400 border border-white/10">⌘ + B</kbd>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
