import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, Layout, FileSpreadsheet, GitPullRequest, Palette, Atom, Brain,
  Star, Eye, Lightbulb, Target, Users, Scale, UserCheck, Terminal,
  Code2, Globe, PenTool, Clock, MessageSquare, Monitor, Paperclip, ArrowUp
} from 'lucide-react';
import { PROMPT_SUGGESTIONS } from '@/data/initialData';

interface HeroStateProps {
  inputText: string;
  setInputText: (val: string) => void;
  onSubmit: () => void;
  onSelectPromptSuggestion: (promptText: string) => void;
}

const THEMES: Record<string, { border: string; hoverBorder: string; bg: string; hoverBg: string; iconBg: string; iconHoverBg: string; text: string; shadow: string; glow: string }> = {
  blue: {
    border: 'border-blue-500/30', hoverBorder: 'hover:border-blue-500/60',
    bg: 'bg-blue-600/20', hoverBg: 'hover:bg-blue-600/30',
    iconBg: 'bg-blue-500/25', iconHoverBg: 'group-hover:bg-blue-500/35',
    text: 'text-blue-300', shadow: 'hover:shadow-blue-500/20',
    glow: 'group-hover:shadow-blue-500/10',
  },
  purple: {
    border: 'border-purple-500/30', hoverBorder: 'hover:border-purple-500/60',
    bg: 'bg-purple-600/20', hoverBg: 'hover:bg-purple-600/30',
    iconBg: 'bg-purple-500/25', iconHoverBg: 'group-hover:bg-purple-500/35',
    text: 'text-purple-300', shadow: 'hover:shadow-purple-500/20',
    glow: 'group-hover:shadow-purple-500/10',
  },
  amber: {
    border: 'border-amber-500/30', hoverBorder: 'hover:border-amber-500/60',
    bg: 'bg-amber-600/20', hoverBg: 'hover:bg-amber-600/30',
    iconBg: 'bg-amber-500/25', iconHoverBg: 'group-hover:bg-amber-500/35',
    text: 'text-amber-300', shadow: 'hover:shadow-amber-500/20',
    glow: 'group-hover:shadow-amber-500/10',
  },
  emerald: {
    border: 'border-emerald-500/30', hoverBorder: 'hover:border-emerald-500/60',
    bg: 'bg-emerald-600/20', hoverBg: 'hover:bg-emerald-600/30',
    iconBg: 'bg-emerald-500/25', iconHoverBg: 'group-hover:bg-emerald-500/35',
    text: 'text-emerald-300', shadow: 'hover:shadow-emerald-500/20',
    glow: 'group-hover:shadow-emerald-500/10',
  },
  rose: {
    border: 'border-rose-500/30', hoverBorder: 'hover:border-rose-500/60',
    bg: 'bg-rose-600/20', hoverBg: 'hover:bg-rose-600/30',
    iconBg: 'bg-rose-500/25', iconHoverBg: 'group-hover:bg-rose-500/35',
    text: 'text-rose-300', shadow: 'hover:shadow-rose-500/20',
    glow: 'group-hover:shadow-rose-500/10',
  },
  cyan: {
    border: 'border-cyan-500/30', hoverBorder: 'hover:border-cyan-500/60',
    bg: 'bg-cyan-600/20', hoverBg: 'hover:bg-cyan-600/30',
    iconBg: 'bg-cyan-500/25', iconHoverBg: 'group-hover:bg-cyan-500/35',
    text: 'text-cyan-300', shadow: 'hover:shadow-cyan-500/20',
    glow: 'group-hover:shadow-cyan-500/10',
  },
  violet: {
    border: 'border-violet-500/30', hoverBorder: 'hover:border-violet-500/60',
    bg: 'bg-violet-600/20', hoverBg: 'hover:bg-violet-600/30',
    iconBg: 'bg-violet-500/25', iconHoverBg: 'group-hover:bg-violet-500/35',
    text: 'text-violet-300', shadow: 'hover:shadow-violet-500/20',
    glow: 'group-hover:shadow-violet-500/10',
  },
  orange: {
    border: 'border-orange-500/30', hoverBorder: 'hover:border-orange-500/60',
    bg: 'bg-orange-600/20', hoverBg: 'hover:bg-orange-600/30',
    iconBg: 'bg-orange-500/25', iconHoverBg: 'group-hover:bg-orange-500/35',
    text: 'text-orange-300', shadow: 'hover:shadow-orange-500/20',
    glow: 'group-hover:shadow-orange-500/10',
  },
};

const ANIM_VARIANTS = {
  fadeRight: { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 } },
  fadeLeft: { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 } },
  fadeUp: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } },
  scale: { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } },
} as const;

function SuggestionIcon({ iconName }: { iconName: string }) {
  const props = { className: "w-3.5 h-3.5" };
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

  const recommended = PROMPT_SUGGESTIONS.filter(s => s.recommended);
  const others = PROMPT_SUGGESTIONS.filter(s => !s.recommended);

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

  const canSend = inputText.trim().length > 0;

  return (
    <div className="relative flex flex-col items-center w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto px-4 lg:px-8 py-8 my-auto select-none">

      {/* Hero logo with glow */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-6"
      >
        <div className="relative inline-block">
          {/* Glow behind logo */}
          <div className="absolute inset-0 blur-2xl opacity-50 bg-gradient-to-r from-blue-500/30 via-indigo-500/30 to-violet-500/30" />
          <div className="relative w-64 sm:w-80 mx-auto">
            <img
              src="banner.png"
              alt="DRENZO AI"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-sm sm:text-base text-zinc-400 mt-3 font-medium"
        >
          No filter. <span className="text-zinc-200">Real talk.</span>
        </motion.p>
      </motion.div>

      {/* Input area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className={`relative w-full rounded-2xl glass border transition-all duration-300 ${
          isFocused
            ? 'border-blue-500/60 ring-4 ring-blue-500/15 shadow-[0_0_40px_rgba(59,130,246,0.2)]'
            : 'border-white/10 hover:border-white/20'
        }`}
      >
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Drenzo anything..."
          rows={3}
          className="w-full p-4 sm:p-5 bg-transparent text-white placeholder-zinc-500 text-sm sm:text-base font-normal resize-none focus:outline-none custom-scrollbar"
        />

        <div className="flex items-center justify-between px-3 sm:px-4 pb-3 sm:pb-4 pt-1">
          <div className="flex items-center gap-1">
            <button
              onClick={handleAttach}
              className="p-2 sm:p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/5 active:bg-white/10 transition-all"
              title="Attach a file"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            {inputText.length > 0 && (
              <span className="text-[10px] text-zinc-500 ml-1 font-mono">
                {inputText.length.toLocaleString()}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSend}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              canSend
                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/30 scale-100 cursor-pointer active:scale-95'
                : 'bg-white/5 text-zinc-600 cursor-not-allowed'
            }`}
          >
            <span className="hidden sm:inline">Send</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Hint chips below input */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="flex items-center gap-2 mt-4 text-[11px] text-zinc-500"
      >
        <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400 font-mono text-[10px]">Enter</kbd>
        <span>to send</span>
        <span className="text-zinc-700">·</span>
        <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400 font-mono text-[10px]">Shift+Enter</kbd>
        <span>for new line</span>
      </motion.div>

      {/* Recommended prompts */}
      {recommended.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="w-full mt-8 sm:mt-10"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Recommended</span>
            <div className="h-px flex-1 bg-gradient-to-r from-blue-500/30 to-transparent" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 w-full">
            {recommended.map((sug, i) => {
              const theme = THEMES[sug.theme || 'blue'];
              return (
                <motion.button
                  key={sug.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.4 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => onSelectPromptSuggestion(sug.promptText)}
                  className={`group flex items-center gap-2.5 p-3 rounded-xl border transition-all duration-200 text-left shadow-md active:scale-[0.98] cursor-pointer w-full ${theme.bg} ${theme.border} ${theme.hoverBg} ${theme.hoverBorder} ${theme.shadow} ${theme.glow} hover:shadow-lg relative overflow-hidden`}
                >
                  <div className={`p-1.5 rounded-lg transition-colors shrink-0 ${theme.iconBg} ${theme.iconHoverBg}`}>
                    <SuggestionIcon iconName={sug.icon} />
                  </div>
                  <span className={`text-xs font-semibold truncate ${theme.text} group-hover:text-white transition-colors`}>
                    {sug.label}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* More prompts */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="w-full mt-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">More prompts</span>
          <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-2.5 w-full">
          {others.map((sug, i) => {
            const theme = THEMES[sug.theme || 'blue'];
            const anim = ANIM_VARIANTS[sug.anim || 'fadeUp'];
            return (
              <motion.div
                key={sug.id}
                initial={anim.initial}
                animate={anim.animate}
                transition={{ duration: 0.35, delay: 0.5 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                <button
                  onClick={() => onSelectPromptSuggestion(sug.promptText)}
                  className={`group flex items-center gap-2 sm:gap-2.5 p-2 sm:p-3 rounded-xl sm:rounded-2xl border transition-all duration-200 text-left shadow-md active:scale-[0.98] cursor-pointer w-full ${theme.bg} ${theme.border} ${theme.hoverBg} ${theme.hoverBorder} ${theme.shadow} hover:shadow-lg`}
                >
                  <div className={`p-1 sm:p-1.5 rounded-lg sm:rounded-xl transition-colors shrink-0 ${theme.iconBg} ${theme.iconHoverBg}`}>
                    <SuggestionIcon iconName={sug.icon} />
                  </div>
                  <span className={`text-[10px] sm:text-xs font-medium truncate ${theme.text} group-hover:text-white transition-colors`}>
                    {sug.label}
                  </span>
                </button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
