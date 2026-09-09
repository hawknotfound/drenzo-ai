import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Send, Sparkles, Layout, FileSpreadsheet, GitPullRequest, Palette, Atom, Brain,
  Star, Eye, Lightbulb, Target, Users, Scale, UserCheck, Terminal,
  Code2, Globe, PenTool, Clock, MessageSquare, Monitor, Paperclip
} from 'lucide-react';
import { PROMPT_SUGGESTIONS } from '@/data/initialData';
import { GlowingOrb } from './GlowingOrb';

interface HeroStateProps {
  inputText: string;
  setInputText: (val: string) => void;
  onSubmit: () => void;
  onSelectPromptSuggestion: (promptText: string) => void;
}

function SuggestionIcon({ iconName }: { iconName: string }) {
  const props = { className: "w-4 h-4" };
  switch (iconName) {
    case 'Layout': return <Layout {...props} />;
    case 'Sparkles': return <Sparkles {...props} />;
    case 'Atom': return <Atom {...props} />;
    case 'Brain': return <Brain {...props} />;
    case 'GitPullRequest': return <GitPullRequest {...props} />;
    case 'Palette': return <Palette {...props} />;
    case 'FileSpreadsheet': return <FileSpreadsheet {...props} />;
    case 'Star': return <Star {...props} />;
    case 'Eye': return <Eye {...props} />;
    case 'Lightbulb': return <Lightbulb {...props} />;
    case 'Target': return <Target {...props} />;
    case 'Users': return <Users {...props} />;
    case 'Scale': return <Scale {...props} />;
    case 'UserCheck': return <UserCheck {...props} />;
    case 'MonitorCode': return <Monitor {...props} />;
    case 'Terminal': return <Terminal {...props} />;
    case 'Code2': return <Code2 {...props} />;
    case 'Globe': return <Globe {...props} />;
    case 'PenTool': return <PenTool {...props} />;
    case 'Clock': return <Clock {...props} />;
    case 'MessageSquare': return <MessageSquare {...props} />;
    default: return <Sparkles {...props} />;
  }
}

export function HeroState({
  inputText, setInputText, onSubmit, onSelectPromptSuggestion,
}: HeroStateProps) {
  const [isFocused, setIsFocused] = useState(false);

  const recommended = PROMPT_SUGGESTIONS.filter(s => s.recommended)
  const others = PROMPT_SUGGESTIONS.filter(s => !s.recommended)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleAttach = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.txt,.md,.js,.ts,.tsx,.jsx,.py,.html,.css,.json,.csv,.yml,.yaml,.toml,.sh,.bat,.ps1,.sql,.xml,.env'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        const content = reader.result as string
        const text = `[Attached: ${file.name}]\n\`\`\`\n${content}\n\`\`\``
        setInputText(inputText ? `${inputText}\n\n${text}` : text)
      }
      reader.readAsText(file)
    }
    input.click()
  }

  return (
    <div className="relative flex flex-col items-center w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto px-4 lg:px-8 py-8 my-auto select-none">
      {/* Glowing Orb */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mb-2"
      >
        <GlowingOrb size={64} />
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-2xl md:text-[28px] font-normal tracking-tight text-white/95 mb-6 text-center"
      >
        Ready to Create Something New?
      </motion.h1>

      {/* Prompt Composer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className={`relative w-full rounded-2xl bg-[#161124]/80 border transition-all duration-300 backdrop-blur-2xl shadow-2xl ${
          isFocused
            ? 'border-purple-500/60 ring-4 ring-purple-500/15 shadow-[0_0_35px_rgba(139,92,246,0.2)]'
            : 'border-[#2c2240] hover:border-[#523d75]'
        }`}
      >
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Message Drenzo AI..."
          rows={3}
          className="w-full p-4 sm:p-5 bg-transparent text-white placeholder-[#6e6680] text-sm sm:text-base font-normal resize-none focus:outline-none custom-scrollbar"
        />

        <div className="flex items-center justify-between px-3 sm:px-4 pb-3 sm:pb-4">
          <button
            onClick={handleAttach}
            className="p-3 sm:p-2.5 rounded-xl text-[#6e6680] hover:text-[#9b92b0] hover:bg-[#1e1730] active:bg-[#251d38] transition-all"
            title="Attach a file"
          >
            <Paperclip className="w-5 h-5 sm:w-4 sm:h-4" />
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!inputText.trim()}
            className={`flex items-center justify-center p-3 sm:p-2.5 rounded-xl transition-all duration-200 ${
              inputText.trim()
                ? 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-lg shadow-purple-500/30 scale-100 cursor-pointer active:scale-95'
                : 'bg-[#8B5CF6]/40 text-white/50 cursor-not-allowed scale-95'
            }`}
          >
            <Send className="w-5 h-5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </motion.div>

      {/* Shortcut Chips */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.25 }}
        className="flex flex-wrap items-center justify-center gap-2 max-w-xl mt-5"
      >
        {[
          { label: 'Brainstorm', icon: Lightbulb, prompt: 'Brainstorm 5 high-impact ideas for my next project' },
          { label: 'Make a plan', icon: FileSpreadsheet, prompt: 'Create a comprehensive execution roadmap with key milestones and risks' },
          { label: 'Write code', icon: Code2, prompt: 'Help me write production-grade code with proper error handling' },
        ].map((chip) => (
          <button
            key={chip.label}
            onClick={() => onSelectPromptSuggestion(chip.prompt)}
            className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161124]/90 hover:bg-[#221a36] border border-[#2c2240] hover:border-[#523d75] transition-all duration-200 text-xs font-normal text-[#cfc8de] hover:text-white shadow-sm cursor-pointer active:scale-95"
          >
            <span>{chip.label}</span>
            <chip.icon className="w-3.5 h-3.5 text-[#887e9e] group-hover:text-purple-300 transition-colors" />
          </button>
        ))}
      </motion.div>

      {/* Recommended Prompts */}
      {recommended.length > 0 && (
        <div className="w-full mt-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-purple-400/80">Recommended</span>
            <div className="h-px flex-1 bg-gradient-to-r from-purple-500/20 to-transparent" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
            {recommended.map((sug, i) => (
              <motion.button
                key={sug.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.3 + i * 0.06 }}
                onClick={() => onSelectPromptSuggestion(sug.promptText)}
                className="group relative flex flex-col gap-2.5 p-4 rounded-2xl border border-[#271D3A]/60 hover:border-purple-500/40 bg-[#130E20]/60 hover:bg-[#1a1429]/80 backdrop-blur-sm transition-all duration-300 text-left cursor-pointer w-full overflow-hidden"
              >
                {/* Subtle glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />

                <div className="relative flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 group-hover:bg-purple-500/15 group-hover:border-purple-500/30 transition-all text-purple-300">
                    <SuggestionIcon iconName={sug.icon} />
                  </div>
                  <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                    {sug.label}
                  </span>
                </div>

                <p className="relative text-[11px] text-[#7a7090] leading-relaxed line-clamp-2 group-hover:text-[#9b92b0] transition-colors">
                  {sug.promptText.slice(0, 80)}...
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* More Prompts */}
      <div className="w-full mt-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#5a5270]">More prompts</span>
          <div className="h-px flex-1 bg-gradient-to-r from-[#271D3A]/60 to-transparent" />
        </div>
        <div className="flex flex-wrap gap-2 w-full">
          {others.map((sug) => (
            <button
              key={sug.id}
              onClick={() => onSelectPromptSuggestion(sug.promptText)}
              className="group flex items-center gap-2 px-3 py-2 rounded-xl border border-[#271D3A]/40 hover:border-purple-500/30 bg-[#130E20]/40 hover:bg-[#1a1429]/60 transition-all duration-200 text-left cursor-pointer"
            >
              <div className="p-1 rounded-lg bg-purple-500/8 group-hover:bg-purple-500/15 transition-colors text-purple-400/70 group-hover:text-purple-300">
                <SuggestionIcon iconName={sug.icon} />
              </div>
              <span className="text-xs text-[#887e9e] group-hover:text-white/90 transition-colors">
                {sug.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
