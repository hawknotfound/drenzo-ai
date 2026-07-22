import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Paperclip,
  Send,
  Globe,
  FileText,
  Image as ImageIcon,
  Lightbulb,
  Code2,
  PenTool,
  BarChart2,
  Brain,
  Sparkles,
  Layout,
  Code2,
  FileSpreadsheet,
  FileUp,
  GitPullRequest,
  Palette,
  Atom,
  Mic
} from 'lucide-react';
import { CapabilityId } from '../types';
import { CAPABILITY_OPTIONS, PROMPT_SUGGESTIONS } from '../data/initialData';

interface HeroStateProps {
  inputText: string;
  setInputText: (val: string) => void;
  onSubmit: () => void;
  selectedCapabilities: CapabilityId[];
  onToggleCapability: (id: CapabilityId) => void;
  onSelectPromptSuggestion: (promptText: string) => void;
  onAttachFileClick: () => void;
  isDeepThinkingActive: boolean;
}

export const HeroState: React.FC<HeroStateProps> = ({
  inputText,
  setInputText,
  onSubmit,
  selectedCapabilities,
  onToggleCapability,
  onSelectPromptSuggestion,
  onAttachFileClick,
  isDeepThinkingActive
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Helper map for capability icons
  const getCapabilityIcon = (iconName: string, active: boolean) => {
    const props = { className: `w-3.5 h-3.5 transition-colors ${active ? 'text-blue-300' : 'text-zinc-400'}` };
    switch (iconName) {
      case 'Globe': return <Globe {...props} />;
      case 'FileText': return <FileText {...props} />;
      case 'Image': return <ImageIcon {...props} />;
      case 'Lightbulb': return <Lightbulb {...props} />;
      case 'MonitorCode': return <Code2 {...props} />;
      case 'PenTool': return <PenTool {...props} />;
      case 'BarChart2': return <BarChart2 {...props} />;
      case 'Brain': return <Brain {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  // Helper map for prompt suggestion icons
  const getSuggestionIcon = (iconName: string) => {
    const props = { className: "w-3.5 h-3.5 text-blue-400" };
    switch (iconName) {
      case 'Layout': return <Layout {...props} />;
      case 'Code2': return <Code2 {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      case 'FileSpreadsheet': return <FileSpreadsheet {...props} />;
      case 'FileUp': return <FileUp {...props} />;
      case 'GitPullRequest': return <GitPullRequest {...props} />;
      case 'Palette': return <Palette {...props} />;
      case 'Atom': return <Atom {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-140px)] w-full max-w-4xl mx-auto px-4 py-8 select-none">
      {/* 1. Drenzo AI Title Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-center space-y-2 mb-8"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-sm font-sans">
          Drenzo AI
        </h1>
        <p className="text-lg md:text-xl text-zinc-400 font-normal tracking-wide">
          Think. Build. Create.
        </p>
      </motion.div>

      {/* 2. Central Glass Message Input Container matching reference image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className={`relative w-full rounded-2xl bg-[#161a25]/80 border transition-all duration-300 backdrop-blur-2xl shadow-2xl ${
          isFocused
            ? 'border-blue-500/60 ring-4 ring-blue-500/15 shadow-[0_0_35px_rgba(59,130,246,0.2)]'
            : 'border-white/10 hover:border-white/20'
        }`}
      >
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Message AI chat..."
          rows={3}
          className="w-full p-5 bg-transparent text-white placeholder-zinc-500 text-base font-normal resize-none focus:outline-none custom-scrollbar"
        />

        {/* Input Bottom Bar (Attachment & Send button) */}
        <div className="flex items-center justify-between px-4 pb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onAttachFileClick}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Attach File / Document"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Voice Input (Simulated)"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={onSubmit}
            disabled={!inputText.trim()}
            className={`flex items-center justify-center p-2.5 rounded-xl transition-all duration-200 ${
              inputText.trim()
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-100 cursor-pointer active:scale-95'
                : 'bg-blue-600/40 text-white/50 cursor-not-allowed scale-95'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* 3. Capability Pills Row 1 & Row 2 below message input box */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-col items-center gap-2.5 mt-6 w-full"
      >
        {/* Row 1 */}
        <div className="flex flex-wrap justify-center items-center gap-2">
          {CAPABILITY_OPTIONS.slice(0, 4).map((cap) => {
            const isActive = selectedCapabilities.includes(cap.id);
            return (
              <button
                key={cap.id}
                onClick={() => onToggleCapability(cap.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 cursor-pointer active:scale-95 ${
                  isActive
                    ? cap.activeColor || 'bg-blue-600/30 text-blue-200 border-blue-500/60 shadow-[0_0_12px_rgba(59,130,246,0.25)]'
                    : 'bg-[#151924]/60 hover:bg-[#1c2232] text-zinc-300 border-white/10 hover:border-white/20'
                }`}
              >
                {getCapabilityIcon(cap.icon, isActive)}
                <span>{cap.label}</span>
              </button>
            );
          })}
        </div>

        {/* Row 2 */}
        <div className="flex flex-wrap justify-center items-center gap-2">
          {CAPABILITY_OPTIONS.slice(4).map((cap) => {
            const isActive = selectedCapabilities.includes(cap.id);
            return (
              <button
                key={cap.id}
                onClick={() => onToggleCapability(cap.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 cursor-pointer active:scale-95 ${
                  isActive
                    ? cap.activeColor || 'bg-blue-600/30 text-blue-200 border-blue-500/60 shadow-[0_0_12px_rgba(59,130,246,0.25)]'
                    : 'bg-[#151924]/60 hover:bg-[#1c2232] text-zinc-300 border-white/10 hover:border-white/20'
                }`}
              >
                {getCapabilityIcon(cap.icon, isActive)}
                <span>{cap.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* 4. Quick Suggestion Prompt Chips Grid at bottom matching reference image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-10 w-full"
      >
        {PROMPT_SUGGESTIONS.map((sug) => (
          <button
            key={sug.id}
            onClick={() => onSelectPromptSuggestion(sug.promptText)}
            className="group flex items-center gap-2.5 p-3 rounded-2xl bg-[#141824]/60 hover:bg-[#1d2334] border border-white/10 hover:border-blue-500/40 text-left transition-all duration-200 shadow-md hover:shadow-blue-500/10 active:scale-98 cursor-pointer"
          >
            <div className="p-1.5 rounded-xl bg-white/5 group-hover:bg-blue-500/20 transition-colors shrink-0">
              {getSuggestionIcon(sug.icon)}
            </div>
            <span className="text-xs font-medium text-zinc-300 group-hover:text-white truncate">
              {sug.label}
            </span>
          </button>
        ))}
      </motion.div>

      {/* 5. Sparkle Accent SVG at bottom right */}
      <div className="absolute bottom-4 right-4 pointer-events-none opacity-40">
        <svg className="w-8 h-8 text-blue-400 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>
    </div>
  );
};
