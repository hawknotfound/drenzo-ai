import React, { useState } from 'react';
import { X, Sliders, RotateCcw, Check } from 'lucide-react';
import { ConfigState } from '../types';

interface ConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ConfigState;
  onSaveConfig: (newConfig: ConfigState) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info') => void;
}

export const ConfigurationModal: React.FC<ConfigurationModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onShowToast,
}) => {
  const [localConfig, setLocalConfig] = useState<ConfigState>(config);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveConfig(localConfig);
    onShowToast('Configuration Saved', 'AI model parameters updated successfully', 'success');
    onClose();
  };

  const handleReset = () => {
    const defaults: ConfigState = {
      temperature: 0.7,
      maxTokens: 2048,
      systemPrompt: 'You are Zyricon, an ultra-intelligent, precise, and creative AI assistant. Provide thoughtful, well-structured, and helpful answers.',
      topP: 0.95,
      responseFormat: 'markdown',
      streamResponse: true
    };
    setLocalConfig(defaults);
    onShowToast('Defaults Restored', 'Model parameters reset to standard configuration', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-[#130E20] border border-[#2F2348] shadow-2xl p-5 text-white animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#221838]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">AI Configuration</h3>
              <p className="text-[11px] text-[#867D9C]">Fine-tune model runtime and response parameters</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7C7391] hover:text-white hover:bg-[#1E1730] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 space-y-4 max-h-[68vh] overflow-y-auto pr-1">
          {/* Temperature Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-[#D1CAE3]">
                Temperature ({localConfig.temperature.toFixed(2)})
              </label>
              <span className="text-[11px] text-[#8980A0]">
                {localConfig.temperature < 0.3 ? 'Deterministic' : localConfig.temperature > 0.8 ? 'Creative' : 'Balanced'}
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={localConfig.temperature}
              onChange={(e) => setLocalConfig({ ...localConfig, temperature: parseFloat(e.target.value) })}
              className="w-full accent-purple-500 cursor-pointer h-1.5 bg-[#241A3B] rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-[#69607E] mt-1">
              <span>0.0 Precise</span>
              <span>0.5 Balanced</span>
              <span>1.0 Creative</span>
            </div>
          </div>

          {/* Max Output Tokens */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-[#D1CAE3]">
                Max Tokens ({localConfig.maxTokens})
              </label>
              <span className="text-[11px] text-[#8980A0]">Response Length</span>
            </div>
            <input
              type="range"
              min="256"
              max="4096"
              step="128"
              value={localConfig.maxTokens}
              onChange={(e) => setLocalConfig({ ...localConfig, maxTokens: parseInt(e.target.value) })}
              className="w-full accent-purple-500 cursor-pointer h-1.5 bg-[#241A3B] rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-[#69607E] mt-1">
              <span>256 Brief</span>
              <span>2048 Default</span>
              <span>4096 Deep Long</span>
            </div>
          </div>

          {/* Top-P Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-[#D1CAE3]">
                Top P ({localConfig.topP.toFixed(2)})
              </label>
              <span className="text-[11px] text-[#8980A0]">Nucleus Sampling</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={localConfig.topP}
              onChange={(e) => setLocalConfig({ ...localConfig, topP: parseFloat(e.target.value) })}
              className="w-full accent-purple-500 cursor-pointer h-1.5 bg-[#241A3B] rounded-lg"
            />
          </div>

          {/* System Prompt */}
          <div>
            <label className="block text-xs font-medium text-[#D1CAE3] mb-1.5">
              System Instructions
            </label>
            <textarea
              rows={3}
              value={localConfig.systemPrompt}
              onChange={(e) => setLocalConfig({ ...localConfig, systemPrompt: e.target.value })}
              className="w-full rounded-xl bg-[#1B142B] border border-[#2D2244] p-2.5 text-xs text-white placeholder-[#706785] focus:border-purple-500 outline-none leading-relaxed resize-none"
              placeholder="Provide system instructions for how Zyricon should behave..."
            />
          </div>

          {/* Format Preference */}
          <div>
            <label className="block text-xs font-medium text-[#D1CAE3] mb-1.5">
              Default Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['markdown', 'concise', 'structured'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setLocalConfig({ ...localConfig, responseFormat: fmt })}
                  className={`
                    py-2 px-2.5 rounded-xl text-xs font-medium capitalize border transition-all
                    ${
                      localConfig.responseFormat === fmt
                        ? 'bg-[#291C43] border-purple-500/60 text-white shadow-sm'
                        : 'bg-[#181226] border-[#291E3E] text-[#938BA7] hover:text-white'
                    }
                  `}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3.5 border-t border-[#221838] mt-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-[#8B82A1] hover:text-white hover:bg-[#1E1730] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Defaults</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#A59DBA] hover:text-white hover:bg-[#1C152D] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-md active:scale-95 transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
